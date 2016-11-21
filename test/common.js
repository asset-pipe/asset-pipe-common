"use strict";

const stream = require('stream');
const lib = require('../');
const tap = require('tap');
const JSONStream  = require('JSONStream');
const fs = require('fs');



const sourceStream = (arr) => {
    return new stream.Readable({
        objectMode : false,
        read: function (n) {
            arr.forEach((chunk) => {
                this.push(chunk);
            });
            this.push(null);
        }
    });
}

const a = ['a','b','c'];
const b = ['d', 'a','b','c'];


tap.test('not a real test', (t) => {
    const file = fs.createReadStream('./test/mock/feed.a.json');
    const parser = JSONStream.parse('*');

    const hasher = new lib.SourceHasher();
    file.pipe(parser).pipe(hasher);

    hasher.on('finish', () => {
        console.log(hasher.hash);
        t.end();
    });
});
