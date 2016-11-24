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
//        console.log(hasher.hash);
        t.end();
    });
});



tap.test('hasher() - hash a String - should match given hash', (t) => {
    t.equal(lib.hasher('abc'), 'a9993e364706816aba3e25717850c26c9cd0d89d');
    t.equal(lib.hasher('abce'), '0a431a7631cabf6b11b984a943127b5e0aa9d687');
    t.end();
});

tap.test('hasher() - hash a Buffer - should match given hash', (t) => {
    t.equal(lib.hasher(new Buffer('abc')), 'a9993e364706816aba3e25717850c26c9cd0d89d');
    t.equal(lib.hasher(new Buffer('abc').toString()), 'a9993e364706816aba3e25717850c26c9cd0d89d');
    t.equal(lib.hasher(new Buffer('abce')), '0a431a7631cabf6b11b984a943127b5e0aa9d687');
    t.equal(lib.hasher(new Buffer('abce').toString()), '0a431a7631cabf6b11b984a943127b5e0aa9d687');
    t.end();
});

tap.test('hasher() - source contains hexadecimal escape sequence - should match given hash', (t) => {
    t.equal(lib.hasher('ab\xff'), 'ba5142a8207bd61baddf325088732e71cbfe8eb6');
    t.equal(lib.hasher(new Buffer('ab\xff')), 'ba5142a8207bd61baddf325088732e71cbfe8eb6');
    t.equal(lib.hasher(new Buffer('ab\xff').toString()), 'ba5142a8207bd61baddf325088732e71cbfe8eb6');
    t.end();
});
