'use strict';

// const stream = require('stream');
const lib = require('../');
const tap = require('tap');
const JSONStream = require('JSONStream');
const fs = require('fs');


// const sourceStream = (arr) => new stream.Readable({
//     objectMode: false,
//     read (n) {
//         arr.forEach((chunk) => {
//             this.push(chunk);
//         });
//         this.push(null);
//     },
// });

// const a = ['a', 'b', 'c'];
// const b = ['d', 'a', 'b', 'c'];


tap.test('not a real test', (t) => {
    const file = fs.createReadStream('./test/mock/feed.a.json');
    const parser = JSONStream.parse('*');

    const hasher = new lib.SourceHasher();
    file.pipe(parser).pipe(hasher);

    hasher.on('finish', () => {
        // console.log(hasher.hash);
        t.end();
    });
});


tap.test('hasher() - hash a String - should match given hash', (t) => {
    t.equal(lib.hasher('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    t.equal(lib.hasher('abce'), '84e73dc50f2be9000ab2a87f8026c1f45e1fec954af502e9904031645b190d4f');
    t.end();
});

tap.test('hasher() - hash a Buffer - should match given hash', (t) => {
    t.equal(lib.hasher(new Buffer('abc')), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    t.equal(lib.hasher(new Buffer('abc').toString()), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    t.equal(lib.hasher(new Buffer('abce')), '84e73dc50f2be9000ab2a87f8026c1f45e1fec954af502e9904031645b190d4f');
    t.equal(lib.hasher(new Buffer('abce').toString()), '84e73dc50f2be9000ab2a87f8026c1f45e1fec954af502e9904031645b190d4f');
    t.end();
});

tap.test('hasher() - source contains hexadecimal escape sequence - should match given hash', (t) => {
    t.equal(lib.hasher('ab\xff'), '90629f3210df046be595674cf165db584faf8163f2c20983098b21bc16a32b81');
    t.equal(lib.hasher(new Buffer('ab\xff')), '90629f3210df046be595674cf165db584faf8163f2c20983098b21bc16a32b81');
    t.equal(lib.hasher(new Buffer('ab\xff').toString()), '90629f3210df046be595674cf165db584faf8163f2c20983098b21bc16a32b81');
    t.end();
});
