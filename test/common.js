"use strict";

const stream = require('stream');
// const concat = require('concat-stream');
const Foo = require('../');
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
//    const source = sourceStream(a);
    const file = fs.createReadStream('./test/mock/feed.a.json');
    const parser = JSONStream.parse('*');

    const foo = new Foo();
    file.pipe(parser).pipe(foo);
//    source.pipe(foo);
    foo.on('finish', () => {
        console.log(foo.hash);
        t.end();
    });
});
