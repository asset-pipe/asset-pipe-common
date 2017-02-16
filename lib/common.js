'use strict';

const stream = require('readable-stream');
const crypto = require('crypto');
const Buffer = require('buffer').Buffer;


/**
  * Writable stream to build a hash out of all the "source" attributes in a
  * stream of asset objects.
  * @class
  *
  * @returns {Stream} a writable stream
  */

class SourceHasher extends stream.Writable {
    constructor () {
        super({
            objectMode: true,
        });
        this._hasher = crypto.createHash('sha1');
    }

    get hash () {
        return this._hasher.digest('hex');
    }

    _write (chunk, encoding, next) {
        this._hasher.update(chunk.source, 'utf8');
        next();
    }
};

module.exports.SourceHasher = SourceHasher;


/**
  * Writable stream to build a hash out of the content of a non object mode
  * stream
  * @class
  *
  * @returns {Stream} a writable stream
  */

class FileHasher extends stream.Writable {
    constructor () {
        super({
            objectMode: false,
        });
        this._hasher = crypto.createHash('sha1');
    }

    get hash () {
        return this._hasher.digest('hex');
    }

    _write (chunk, encoding, next) {
        this._hasher.update(chunk, Buffer.isBuffer(chunk) ? null : 'utf8');
        next();
    }
};

module.exports.FileHasher = FileHasher;


/**
  * Creates a hash out of a String or Buffer
  *
  * @param {String|Buffer} source Source to make hash out of
  *
  * @returns {String} a hash
  */

module.exports.hasher = (source) => {
    const hasher = crypto.createHash('sha1');
    return hasher.update(source, Buffer.isBuffer(source) ? null : 'utf8').digest('hex');
};


/**
  * Constructs a temporary filename
  *
  * @param {String} fileType What filetype the file is
  *
  * @returns {Stream} a temporary filename
  */

module.exports.createTemporaryFilename = (fileType) => {
    const rand = Math.floor(Math.random() * 1000).toString();
    return `tmp-${Date.now().toString()}-${rand}.${fileType}`;
};
