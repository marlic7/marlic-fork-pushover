
n.n.n / 2019-10-27
==================



1.3.10 / 2019-10-27
===================

  * send reject message to git client in understandable for client format
  * add reference to req and res object for all event context object (Service)
  * test: remove ".git" from repo url
  * fixes from martindale/pushover: Eliminate .git in local filesystems
  * fixes from vdemedes/pushover: fix push handling; fix large data transfers; add missing require() for fs
  * Fork as marlic-fork-pushover; Revert "Describe fork in README"; add .gitignore
  * Merge tag 'v1.3.9'

v1.3.9 / 2015-01-21
===================

  * Merge branch 'release/1.3.9' into production
  * v1.3.9
  * Remove HttpDuplex from Service prototype
  * Merge tag 'v1.3.8'

v1.3.8 / 2015-01-13
===================

  * Merge branch 'release/1.3.8' into production
  * v1.3.8
  * Merge tag 'v1.3.7'

v1.3.7 / 2015-01-13
===================

  * Merge branch 'release/1.3.7' into production
  * v1.3.7
  * Describe fork in README
  * Use 'git service' instead of 'git-service'
  * tests: use cross-platform tmpdir
  * tests: use 127.0.0.1 instead of localhost
  * test: improve reject test wording
  * fix repo name in tests
  * test: fix path/fs.exists reference
  * travis: update node versions
  * Use 'git command' instead of 'git-command'
  * Fork as strong-fork-pushover

1.3.6 / 2014-05-17
==================

  * 1.3.6
  * self

1.3.5 / 2014-04-22
==================

  * 1.3.5
  * print errors in the reject test
  * wrap spawn calls in better error reporting
  * inherits package instead
  * indent
  * s/\t/\s/g
  * s/\t/\s/g
  * Added gzip decoding when git fetches pack using gzip compression
  * add done callback and document the response event
  * add response stream for controlling what gets written to the git client response

1.3.4 / 2013-12-11
==================

  * 1.3.4
  * Using util.inherits instead of new EventEmitter and calling contstructor. Otherwise multiple pushover instances uses one EventEmitter instance

1.3.3 / 2013-04-07
==================

  * Merge branch 'master' of github.com:substack/pushover
  * add back http-duplex into service responses
  * Merge pull request #20 from mantoni/patch-1
  * update the dirmap test to work with auto .git inclusion
  * Corrected port number in example

1.3.2 / 2013-04-06
==================

  * 1.3.2
  * using a regex instead of substr
  * Merge branch 'master' of git://github.com/MRdNk/pushover into MRdNk-master
  * Repo name: If repo does not end with .git - then add .git to the repo name

1.3.1 / 2013-04-06
==================

  * `connection: close` fixes everything; 1.3.1

1.3.0 / 2013-04-05
==================

  * 1.3.0
  * use .once()
  * using through in lib/service to get proper backpressure
  * pipe stdout directly through instead of using a custom onexit handler
  * readme art

1.2.1 / 2013-02-04
==================

  * fix for some repos that just send 0000 on push-receive for some reason

1.2.0 / 2012-12-21
==================

  * 1.2.0
  * document dirmap
  * dirmap test finally passes; thread the functionality through repos(dirmap) instead
  * failing dirmap test

1.1.1 / 2012-12-12
==================

  * fix race condition resulting in lost chunks and hanging git pushes
  * Merge branch 'master' of git://github.com/distracteddev/pushover
  * Fix upload-pack regex
  * Fix upload-pack regex

1.1.0 / 2012-10-14
==================

  * 1.1.0
  * node_modules should never be in .gitignore
  * emit multiple events if commits and tags are pushed
  * handle tags

1.0.3 / 2012-09-26
==================

  * 1.0.3
  * Fix crash on some requests.

1.0.2 / 2012-09-23
==================

  * make missing directories in create()

1.0.1 / 2012-09-22
==================

  * subdirs work
  * failing test for subdirs

1.0.0 / 2012-09-22
==================

  * s/qs/querystring/
  * update readme, example with all the new events
  * add cwd and repo to info and head duplex event objects
  * head events
  * info requests split out into a separate lib file
  * info events, first half
  * all tests pass again, "fetch" event
  * reject test passes with the new accept/reject event api
  * fix test to compensate for repos.create()
  * refactor service handling logic into lib/service.js, launch the command after emitting and parsing the values
  * make sure the reject test directory never gets created, currently fails
  * remove repos.listen()
  * split up big file into some littler files
  * fix so all tests pass again
  * passing reject test
  * switched over to http-duplex api
  * update tests for http-duplex usage
  * passing the new tests
  * updated tests for new push signature

0.1.6 / 2012-08-14
==================

  * 0.1.6, document branch argument to push event
  * push emits branch, passes branch test
  * failing test to get branch data

0.1.5 / 2012-08-13
==================

  * fs.exists
  * documented "push", repo, commit
  * emit the commit hash as the second arg, passes its test
  * failing test to check the commit hash as the second arg from "push" events

0.1.4 / 2012-07-22
==================

  * fix all the race conditions
  * fix race condition in node 0.8. due to "exit"/end event ordering

0.1.3 / 2012-07-07
==================

  * seq is still a dev dep
  * fs.exists
  * remove unnecessary dep, bump travis to 0.8
  * travis badge

0.1.2 / 2012-02-28
==================

  * bump and using travis
  * Bubble up listening event to pushover.

0.1.1 / 2012-01-14
==================

  * bump for opts.checkout
  * minor style changes
  * self not defined
  * Add option to work with checkouts rather than bare repos.

0.1.0 / 2011-11-23
==================

  * readme notes and a bump for autocreate
  * autoCreate test passes
  * create() is async, check for autoCreate option
  * handle now ensures the repository exists and creates a bare one if required. Effectively removes the need for explicit create call

0.0.0 / 2011-11-17
==================

  * note about repos as an event emitter
  * word choice
  * better descriptions
  * documentation!
  * working example
  * .bind(this) fixed it, the test passes!
  * failing comprehensive test
  * refactored into handlers and some helper code to set up repos
  * no longer using hard-coded bouncy paths
  * abstracted out service info/refs
  * index.js works with pushing hard-coded refs
