# @asset-pipe/common

[![Travis CI Build Status](https://img.shields.io/travis/asset-pipe/asset-pipe-common/master.svg)](http://travis-ci.org/asset-pipe/asset-pipe-common)
[![NPM version](https://img.shields.io/npm/v/@asset-pipe/common.svg)](https://npmjs.org/package/@asset-pipe/common)
[![Dependency Status](https://img.shields.io/david/asset-pipe/asset-pipe-common.svg)](https://david-dm.org/asset-pipe/asset-pipe-common)
[![Dev Dependency Status](https://img.shields.io/david/dev/asset-pipe/asset-pipe-common.svg)](https://david-dm.org/asset-pipe/asset-pipe-common#info=devDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/asset-pipe/@asset-pipe/common.svg)](https://greenkeeper.io/)

Common utility methods shared accross the [asset-pipe project][asset-pipe]. Intended for use by other
modules in the [asset-pipe project][asset-pipe]

## Installation

```bash
$ npm install @asset-pipe/common
```

## API

This module have the following API:

### IdHasher()

Writable stream to build a hash out of all the `id` properties in an [asset feed](#data-format).

```js
const common = require('@asset-pipe/common');
const JSONStream = require('JSONStream');
const fs = require('fs');

const file = fs.createReadStream('./asset-feed.json');
const parser = JSONStream.parse('*');
const hasher = new common.IdHasher();

file.pipe(parser).pipe(hasher);

hasher.on('finish', () => {
    console.log(hasher.hash);
});
```

### SourceHasher()

Writable stream to build a hash out of all the `source` properties in an [asset feed](#data-format).

```js
const common = require('@asset-pipe/common');
const JSONStream = require('JSONStream');
const fs = require('fs');

const file = fs.createReadStream('./asset-feed.json');
const parser = JSONStream.parse('*');
const hasher = new common.SourceHasher();

file.pipe(parser).pipe(hasher);

hasher.on('finish', () => {
    console.log(hasher.hash);
});
```

### FileHasher()

Writable stream to build a hash out of the content of a non object mode stream.

```js
const common = require('@asset-pipe/common');
const fs = require('fs');

const file = fs.createReadStream('./assets.js');
const hasher = new common.FileHasher();

file.pipe(hasher);

hasher.on('finish', () => {
    console.log(hasher.hash);
});
```

### hasher(source)

Creates a hash out of a String or Buffer

Arguments:

*   source - `String` or `Buffer` - the contents to hash

Returns a hash.

```js
const common = require('@asset-pipe/common');
const fs = require('fs');

fs.readFile('.assets.js', (err, data) => {
    const hash = common.hasher(data);
    console.log(hash);
});
```

### createTemporaryFilename(fileType)

Creates a random file name intended to be used for temp files.

Arguments:

*   fileType - `String` - extension to be used on the file. Ex; `json`.

Returns a String on the following format: `tmp-{random-value}.{fileType}`.

```js
const common = require('@asset-pipe/common');
const tmpFile = common.createTemporaryFilename('json');
console.log(tmpFile);
```

## Data format

Some of the metods in this module operate on what we call the asset feed. What we refere to as an
asset feed is the internal data format used in [Browserify][browserify]. We use the exact same
data format as Browserify in the [asset-pipe project][asset-pipe].

When Browserify resolves [CommonJS modules][commonjs] each dependency will be read and transformed
into an object which looks something like this:

```json
{
    "id": "c645cf572a8f5acf8716e4846b408d3b1ca45c58",
    "source":
        "\"use strict\";module.exports.world=function(){return\"world\"};",
    "deps": {},
    "file": "./assets/js/bar.js"
}
```

## License

The MIT License (MIT)

Copyright (c) 2017 - Trygve Lie - post@trygve-lie.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[commonjs]: https://nodejs.org/docs/latest/api/modules.html
[asset-pipe]: https://github.com/asset-pipe
[browserify]: https://github.com/substack/node-browserify
