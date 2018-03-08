'use strict';

const stream = require('readable-stream');
const crypto = require('crypto');
const Buffer = require('buffer').Buffer;

/**
 * Writable stream to build a hash out of all the "id" attributes in a
 * stream of asset objects.
 * @class
 *
 * @returns {Stream} a writable stream
 */

class IdHasher extends stream.Writable {
    constructor() {
        super({
            objectMode: true,
        });
        this._hasher = crypto.createHash('sha256');
    }

    get hash() {
        return this._hasher.digest('hex');
    }

    _write(chunk, encoding, next) {
        this._hasher.update(chunk.id, 'utf8');
        next();
    }
}

module.exports.IdHasher = IdHasher;

/**
 * Writable stream to build a hash out of all the "source" attributes in a
 * stream of asset objects.
 * @class
 *
 * @returns {Stream} a writable stream
 */

class SourceHasher extends stream.Writable {
    constructor() {
        super({
            objectMode: true,
        });
        this._hasher = crypto.createHash('sha256');
    }

    get hash() {
        return this._hasher.digest('hex');
    }

    _write(chunk, encoding, next) {
        this._hasher.update(chunk.source, 'utf8');
        next();
    }
}

module.exports.SourceHasher = SourceHasher;

/**
 * Writable stream to build a hash out of the content of a non object mode
 * stream
 * @class
 *
 * @returns {Stream} a writable stream
 */

class FileHasher extends stream.Writable {
    constructor() {
        super({
            objectMode: false,
        });
        this._hasher = crypto.createHash('sha256');
    }

    get hash() {
        return this._hasher.digest('hex');
    }

    _write(chunk, encoding, next) {
        this._hasher.update(chunk);
        next();
    }
}

module.exports.FileHasher = FileHasher;

/**
 * Creates a hash out of a String or Buffer
 *
 * @param {String|Buffer} source Source to make hash out of
 *
 * @returns {String} a hash
 */

module.exports.hasher = source => {
    const hasher = crypto.createHash('sha256');
    return hasher
        .update(source, Buffer.isBuffer(source) ? null : 'utf8')
        .digest('hex');
};

/**
 * Constructs a temporary filename
 *
 * @param {String} fileType What filetype the file is
 *
 * @returns {Stream} a temporary filename
 */

module.exports.createTemporaryFilename = fileType => {
    const rand = Math.floor(Math.random() * 1000).toString();
    return `tmp-${Date.now().toString()}-${rand}.${fileType}`;
};

/**
 * Hashes an array of hashes into a single hash
 *
 * @param {string[]} arr array of hash strings
 *
 * @returns {string} a single hash
 */

function hashArray(arr) {
    const source = new stream.Readable({ objectMode: true, read() {} });
    const hasher = new IdHasher();

    source.pipe(hasher);

    return new Promise((resolve, reject) => {
        hasher.on('finish', () => {
            resolve(hasher.hash);
        });

        hasher.on('error', reject);

        for (const hash of arr) {
            source.push({ id: hash });
        }
        source.push(null);
    });
}

module.exports.hashArray = hashArray;
