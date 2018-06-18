/*

 ----------------------------------------------------------------------------
 | ewd-memory-global: Memory emulation of Global Storage database           |
 |                                                                          |
 | Copyright (c) 2018 M/Gateway Developments Ltd,                           |
 | Reigate, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  18 June 2018

*/

'use strict';

const sequence = require('../../../lib/apis/sequence');
const createNode = require('../../../lib/apis/createNode');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('api/sequence', () => {
  let Db;
  let db;

  beforeAll(() => {
    Db = function () {
      /*jshint camelcase: false */
      this.key_separator = ':';
      /*jshint camelcase: true */

      this.store = createStore();
    };

    const proto = Db.prototype;
    proto.sequence = sequence;
    proto.createNode = createNode;
  });

  beforeEach(() => {
    db = new Db();

    db.createNode('rob', ['a', 'b'], 'foo');
    db.createNode('rob', ['a', 'b', 'c'], 'baz');
    db.createNode('rob', ['a', 'b', 'd'], 'bar');
    db.createNode('rob', ['a', 'b', 'g'], 'bar2');
    db.createNode('rob', ['a', 'e'], 'quux');
  });

  it('should return non ok', () => {
    const expected = {
      ok: 0
    };

    const node = {};
    const actual = db.sequence(node);

    expect(actual).toEqual(expected);
  });

  it('should return global does not exist', () => {
    const expected = {
      global: 'john',
      subscripts: ''
    };

    const node = {
      global: 'john'
    };
    const actual = db.sequence(node);

    expect(actual).toEqual(expected);
  });

  it('should return global does not exist when subscripts passed', () => {
    const expected = {
      global: 'john',
      subscripts: ['a']
    };

    const node = {
      global: 'john',
      subscripts: ['a']
    };
    const actual = db.sequence(node);

    expect(actual).toEqual(expected);
  });

  it('should return next node when top-level global node passed', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: 'a',
      subscripts: ['a']
    };

    const node = {
      global: 'rob'
    };
    const actual = db.sequence(node, 'next');

    expect(actual).toEqual(expected);
  });

  it('should return next node when subscripted node passed', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: 'd',
      subscripts: ['a', 'b', 'd']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b', 'c']
    };
    const actual = db.sequence(node, 'next');

    expect(actual).toEqual(expected);
  });

  it('should return previous node when subscripted node passed', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: 'd',
      subscripts: ['a', 'b', 'd']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b', 'g']
    };
    const actual = db.sequence(node, 'previous');

    expect(actual).toEqual(expected);
  });

  it('should return first node for subscripted node', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: 'c',
      subscripts: ['a', 'b', 'c']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b', '']
    };
    const actual = db.sequence(node, 'next');

    expect(actual).toEqual(expected);
  });

  it('should return last node for subscripted node', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: 'g',
      subscripts: ['a', 'b', 'g']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b', '']
    };
    const actual = db.sequence(node, 'previous');

    expect(actual).toEqual(expected);
  });

  it('should return next node when subscripted node points to non-existed node', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: 'g',
      subscripts: ['a', 'b', 'g']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b', 'f']
    };
    const actual = db.sequence(node, 'next');

    expect(actual).toEqual(expected);
  });

  it('should return previous node when subscripted node points to non-existed node', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: 'd',
      subscripts: ['a', 'b', 'd']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b', 'f']
    };
    const actual = db.sequence(node, 'previous');

    expect(actual).toEqual(expected);
  });

  it('should return empty result when passed next for non-existed node', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: '',
      subscripts: ['a', 'e', '']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'e', 'b']
    };
    const actual = db.sequence(node, 'previous');

    expect(actual).toEqual(expected);
  });

  it('should return empty result when passed previous for non-existed node', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: '',
      subscripts: ['a', 'e', '']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'e', 'b']
    };
    const actual = db.sequence(node, 'previous');

    expect(actual).toEqual(expected);
  });
});
