# Gear.js

## Task-Based Build System

Gear.js is a scriptable build system using simple tasks that act like a sequence of piped commands.

Features include:
 * Basic building blocks that can be combined to perform complex builds.
 * Tasks are simply defined and keep system internals to a minimum.
 * Asynchronous execution.
 * Extensible task loading via NPM, file, or directory.
 * Advanced flow control for complex task execution.

## Installation

To get the most out of Gear.js, you will want to install [gear-lib](/twobit/gear-lib) which contains tasks for linting, minifying, and deploying JS/CSS assets.

```bash
$ npm install gear
$ npm install gear-lib
```

## Quick Examples

### Chaining Tasks

```javascript
gear.queue()
 .load('foo.js')
 .log('read foo.js')
 .inspect()
 .write('foobarbaz.js')
 .run();
```

### Execute Tasks Using Array Style

```javascript
gear.queue()
 .load(['foo.js', {file: 'bar.js'}, 'baz.js'])
 .log('read foo.js')
 .inspect()
 .write(['newfoo.js', 'newbar.js']) // Not writing 'baz.js'
 .run();
```

### Complex Task Execution

```javascript
gear.queue()
 .load('foo.js')
 .log('Complex Task')
 .tasks({
    read: {task: 'load', options: ['foo.js', 'bar.js', 'baz.js']}
    combine: {task: 'concat', requires: ['read']}
    minify: {task: 'jsminify', requires: ['combine']}
    print: {task: 'inspect', requires: ['read', 'combine', 'minify']} // Runs when read, combine, and minify complete
    parallel: {task: 'log', options: "Hello gear world!"} // Run parallel to read
 }).run();
```

## Documentation

### [Core](#Core)

 * [queue](#Core.queue)
 * [Queue.task](#Core.Queue.task)
 * [Queue.run](#Core.Queue.run)
 * [gearbox](#Core.gearbox)
 * [Gearbox.load](#Core.Gearbox.load)

### [Core Tasks](#Tasks)

 * [load](#Tasks.load)
 * [write](#Tasks.write)
 * [concat](#Tasks.concat)
 * [inspect](#Tasks.inspect)
 * [log](#Tasks.log)
 * [tasks](#Tasks.tasks)

### [Library Tasks](#Library)

### [Custom Tasks](#Custom)

<a name="Core" />
## Core

<a name="Core.queue" />
### queue(options)

Creates a new Queue instance.

__Arguments__

 * options.gearbox - Gearbox loaded with available tasks.

__Example__

```javascript
gear.queue()
 .log('test')
 .run();
```

---------------------------------------

<a name="Core.Queue.task" />
### Queue.task(name, options)

Helper method to run the specified task. Preferred task execution style is to call the task directly i.e. `inspect()` instead of `task('inspect')`.

__Arguments__

 * name - Name of task in gearbox.

__Example__

```javascript
gear.queue()
 .task('log', 'Hello, world!')
 .run();
```

---------------------------------------

<a name="Core.Queue.run" />
### Queue.run(callback)

Runs the queue.

__Arguments__

 * callback - (optional) Callback accepting (err, results)

__Example__

```javascript
gear.queue()
 .log('test')
 .run();
```

---------------------------------------

<a name="Core.gearbox" />
### gearbox()

Creates a new Gearbox instance. Gearboxes contain all available tasks.

__Arguments__

 * options - (optional) Same as .load

__Example__

```javascript
gear.gearbox();
```

---------------------------------------

<a name="Core.Gearbox.load" />
### Gearbox.load(options)

Load tasks from NPM, directory, or file.

__Arguments__

 * options.module - Module to load tasks from.
 * options.dirname - Directory to load tasks from.
 * options.filename - File to load tasks from.

__Example__

```javascript
gear.gearbox().load({dirname: 'foo'});
```

---------------------------------------

<a name="Tasks" />
## Tasks

<a name="Tasks.load" />
### load(sources)

Loads blobs from different sources.

__Arguments__

 * sources - List of sources.

__Example__

```javascript
// source - Filename or object to load.
// source.file - Filename of resource.
.load(['foo', 'baz'])
.load([{file: 'foo'}, {file: 'bar'}, {file: 'baz'}])
```

---------------------------------------

<a name="Tasks.write" />
### write(options)

__Arguments__

 * options.file - File to write, will replace {checksum} with hash of blob content.

Write the blob to disk.

__Example__

```javascript
.write({file: 'foo'})
```

---------------------------------------

<a name="Tasks.concat" />
### concat()

Concatenates blobs.

__Example__

```javascript
.concat()
```

---------------------------------------

<a name="Tasks.inspect" />
### inspect()

Inspects blobs.

__Example__

```javascript
.inspect()
```

---------------------------------------

<a name="Tasks.log" />
### log(string)

__Arguments__

 * string - String to log.

Log a message.

__Example__

```javascript
.log('Finished')
```

---------------------------------------

<a name="Tasks.tasks" />
### tasks(workflow)

__Arguments__

 * workflow - Task workflow.

Execute tasks in parallel with optional dependencies. Data is joined on completion.

__Example__

```javascript
// label - Task instance name.
// label.task - Task name.
// label.options - Task options.
// label.requires - List of labels that must be executed before this task runs.
.tasks({
    label_1: {task: 'log', options: 'Hello, world!'}
    label_2: {task: 'log', options: 'Hello, world 2!', requires: ['label_1']}
})
```

<a name="Library" />
## Library Tasks

Install [gear-lib](/twobit/gear-lib) which contains tasks such as:

 * jslint
 * jsminify
 * csslint
 * cssminify
 * s3

```bash
$ npm install gear-lib
```

<a name="Custom" />
## Custom Tasks

Writing a task is especially easy compared to other Node build systems. There is no need to use Gear.js internals within a task. Tasks operate on immutable blobs. Blobs have a body property. The task returns transformed data via its callback.

__Arguments__

 * options - Options for the task.
 * blob - Immutable blob.
 * done(err, result) - Callback executed when task is complete.

__Example__
```javascript
// example.js
// Example task creates new blob containing `string`
exports.example = function(string, blob, done) {
    done(null, blob.create(string)); // blob.create() is equivalent to new Blob()
};
```

__Running Example Task__

```javascript
gear.queue({gearbox: gear.gearbox({filename: 'example.js'})})
 .example('EXAMPLE')
 .run();
```

## Who's Using Gear.js

 * [Mojito Shaker](/yahoo/mojito-shaker) by [Yahoo](/yahoo).

## Special Thanks

Gear.js takes inspiration from a few sources:

 * [buildy](/mosen/buildy) created by [mosen](/mosen).
 * [grunt](/cowboy/grunt) created by [cowboy](/cowboy).
