"use strict";

const stream = require('readable-stream'),
      crypto = require('crypto'),
      assert = require('assert');


class Foo extends stream.Writable {
    constructor () {
        super({
            objectMode: true,
        });
        this._hasher = crypto.createHash('sha1');
    }

    get hash() {
        return this._hasher.digest('hex');
    }

    _write (chunk, encoding, next) {
        this._hasher.update(chunk.source, 'utf8');
        next();
    }
};

module.exports = Foo;
