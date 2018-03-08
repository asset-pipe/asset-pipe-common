'use strict';

const fs = require('fs');
const JSONStream = require('JSONStream');
const {
    hasher,
    IdHasher,
    FileHasher,
    SourceHasher,
    createTemporaryFilename,
} = require('../');

test('SourceHasher() - feed stream source hash', done => {
    expect.hasAssertions();
    const file = fs.createReadStream('./test/mock/feed.a.json');
    const parser = JSONStream.parse('*');

    const sourceHasher = new SourceHasher();
    file.pipe(parser).pipe(sourceHasher);

    sourceHasher.on('finish', () => {
        expect(sourceHasher.hash).toBe(
            '7eb8654f5d3c083a7028dc8836fbcf1a3bbed5e01c7a3b93e0c4986256e2a42e'
        );
        done();
    });
});

test('IdHasher() - feed stream id hash', done => {
    expect.hasAssertions();
    const file = fs.createReadStream('./test/mock/feed.a.json');
    const parser = JSONStream.parse('*');

    const idHasher = new IdHasher();
    file.pipe(parser).pipe(idHasher);

    idHasher.on('finish', () => {
        expect(idHasher.hash).toBe(
            '07a109ac983bc28d7f393215ca409e2d759e1fda9dc034e48338a5ef1aa92d6c'
        );
        done();
    });
});

test('FileHasher() - file stream hash', done => {
    expect.hasAssertions();
    const file = fs.createReadStream('./test/mock/feed.a.json');

    const fileHasher = new FileHasher();
    file.pipe(fileHasher);

    fileHasher.on('finish', () => {
        expect(fileHasher.hash).toBe(
            '83576ed655b360d52839a5649f9209e7d71db15e22ac15e18d0eb3a25e515f7e'
        );
        done();
    });
});

test('hasher() - hash a String - should match given hash', () => {
    expect.hasAssertions();
    expect(hasher('abc')).toEqual(
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
    expect(hasher('abce')).toEqual(
        '84e73dc50f2be9000ab2a87f8026c1f45e1fec954af502e9904031645b190d4f'
    );
});

test('hasher() - hash a Buffer - should match given hash', () => {
    expect.hasAssertions();
    expect(hasher(new Buffer('abc'))).toEqual(
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
    expect(hasher(new Buffer('abc').toString())).toEqual(
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
    expect(hasher(new Buffer('abce'))).toEqual(
        '84e73dc50f2be9000ab2a87f8026c1f45e1fec954af502e9904031645b190d4f'
    );
    expect(hasher(new Buffer('abce').toString())).toEqual(
        '84e73dc50f2be9000ab2a87f8026c1f45e1fec954af502e9904031645b190d4f'
    );
});

test('hasher() - source contains hexadecimal escape sequence - should match given hash', () => {
    expect.hasAssertions();
    expect(hasher('ab\xff')).toEqual(
        '90629f3210df046be595674cf165db584faf8163f2c20983098b21bc16a32b81'
    );
    expect(hasher(new Buffer('ab\xff'))).toEqual(
        '90629f3210df046be595674cf165db584faf8163f2c20983098b21bc16a32b81'
    );
    expect(hasher(new Buffer('ab\xff').toString())).toEqual(
        '90629f3210df046be595674cf165db584faf8163f2c20983098b21bc16a32b81'
    );
});

test('createTemporaryFilename()', () => {
    expect.hasAssertions();
    const type = 'js';
    const regex = new RegExp(`^tmp-[0-9a-f-]{5,40}.${type}$`);
    expect(createTemporaryFilename(type)).toMatch(regex);
});
