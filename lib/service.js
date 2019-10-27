var spawn = require('child_process').spawn;
var through = require('through');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var zlib = require('zlib');
var noCache = require('./no_cache');

var encodings = {
    'gzip': function() {return zlib.createGunzip();},
    'deflate': function() {return zlib.createDeflate();}
};

module.exports = function (opts, req, res) {
    var service = new Service(opts, req, res);
    
    Object.keys(opts).forEach(function (key) {
        service[key] = opts[key];
    });
    return service;
};

var headerRE = {
    'receive-pack' : '([0-9a-fA-F]+) ([0-9a-fA-F]+)'
        + ' refs\/(heads|tags)\/(.*?)( |00|\u0000)'
        + '|^(0000)$'
    ,
    'upload-pack' : '^\\S+ ([0-9a-fA-F]+)'
};

inherits(Service, EventEmitter);

function Service (opts, req, res) {
    EventEmitter.call(this);
    var self = this;
    
    self.headers = req.headers;
    self.method = req.method;
    self.url = req.url;
    self.req = req;
    self.res = res;

    self.status = 'pending';
    self.repo = opts.repo;
    self.service = opts.service;
    self.cwd = opts.cwd;
    
    var buffered = through().pause();

    // stream needed to receive data after decoding, but before accepting
    var ts = through();

    var decoder = encodings[req.headers['content-encoding']];
    if (decoder) {
        // data is compressed with gzip or deflate
        req.pipe(decoder()).pipe(ts).pipe(buffered);
    } else {
        // data is not compressed
        req.pipe(ts).pipe(buffered);
    }
    
    var data = '';
    ts.once('data', function (buf) {
        data += buf;
        
        var ops = data.match(new RegExp(headerRE[self.service], 'gi'));
        if (!ops) return;
        data = undefined;
       
        ops.forEach(function(op) {
            var m = op.match(new RegExp(headerRE[self.service]));
            if (self.service === 'receive-pack') {
                self.last = m[1];
                self.commit = m[2];

                if (m[3] == 'heads') {
                    var type = 'branch';
                    self.evName = 'push';
                } else {
                    var type = 'version';
                    self.evName = 'tag';
                }

                var headers = {
                    last: self.last,
                    commit : self.commit
                };
                headers[type] = self[type] = m[4];
                self.emit('header', headers);
            }
            else if (self.service === 'upload-pack') {
                self.commit = m[1];
                self.evName = 'fetch';
                self.emit('header', { commit : self.commit });
            }
        });
    });
    
    self.once('accept', function () {
        process.nextTick(function () {
            var cmd = [ 'git', opts.service, '--stateless-rpc', opts.cwd ];
            var ps = spawn(cmd[0], cmd.slice(1));
            ps.on('error', function (err) {
                self.emit('error', new Error(
                    err.message + ' running command ' + cmd.join(' ')
                ));
            });
            
            self.emit('service', ps);
            
            var respStream = through(function(c) {
                if (self.listeners('response').length === 0)
                    return this.queue(c);
                // prevent git from sending the close signal
                if (c.length === 4 && c.toString() === '0000')
                    return;

                this.queue(c);
            }, function() {
                if (self.listeners('response').length > 0)
                    return;
                this.queue(null);
            }, {
                autoDestroy: false
            });
            
            function endResponse() {
                respStream.queue(new Buffer('0000'));
                respStream.queue(null);

                self.emit('exit');
            }

            ps.stdout.pipe(respStream).pipe(res);
            
            buffered.pipe(ps.stdin);
            buffered.resume();

            ps.on('exit', function () {
                if (self.listeners('response').length === 0) {
                    self.emit('exit');

                    return;
                }

                self.emit('response', respStream, endResponse);
            });
        });
    });
    
    self.once('reject', function (code, msg) {

        res.setHeader('content-type', 'application/x-git-' + self.service + '-result');
        noCache(res);
        res.end(gitError(`error: ${msg}`));
    });
}

Service.prototype.accept = function (dir) {
    if (this.status !== 'pending') return;
    
    this.status = 'accepted';
    this.emit('accept', dir);
};

Service.prototype.reject = function (code, msg) {
    if (this.status !== 'pending') return;
    
    if (msg === undefined && typeof code === 'string') {
        msg = code;
        code = 500;
    }
    this.status = 'rejected';
    this.emit('reject', code || 500, msg);
};

function gitError(msg) {
    const lengthDec = Buffer.from(msg).length + 6;
    const lengthHex = lengthDec.toString(16).padStart(4, '0');
    const stx = String.fromCharCode(2);
    const etx = String.fromCharCode(3);
    const nul = String.fromCharCode(0);
    const cr = String.fromCharCode(13);
    const nl = String.fromCharCode(10);
    const end = `000e${etx}aborting${nul}${cr}${nl}`;
    return Buffer.from(`${lengthHex}${stx}${msg}${nl}${end}`);
}
