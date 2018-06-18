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

const leafNodes = require('../../../lib/apis/leafNodes');
const createNode = require('../../../lib/apis/createNode');
const get = require('../../../lib/apis/get');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('api/leafNodes', () => {
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
    proto.leafNodes = leafNodes;
    proto.createNode = createNode;
    proto.get = get;
  });

  beforeEach(() => {
    db = new Db();

    db.createNode('rob', ['a', 'b'], 'foo');
    db.createNode('rob', ['a', 'b', 'c'], 'baz');
    db.createNode('rob', ['a', 'b', 'd'], 'bar');
    db.createNode('rob', ['a', 'b', 'e'], 'bar2');
    db.createNode('rob', ['a', 'e'], 'quux');
    db.createNode('tony', ['z'], 'hello');
    db.createNode('tony', ['z', 'y'], 'world');
  });

  it('should return non ok', () => {
    const expected = {
      ok: 0
    };

    const node = {};
    const actual = db.leafNodes(node, 'forwards');

    expect(actual).toEqual(expected);
  });

  it('should return global does not exist', () => {
    const expected = {
      global: 'john',
      defined: 0
    };

    const node = {
      global: 'john'
    };
    const actual = db.leafNodes(node, 'forwards');

    expect(actual).toEqual(expected);
  });

  it('should set direction to forwards when not passed', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      data: 'foo',
      defined: 11,
      subscripts: ['a', 'b']
    };

    const node = {
      global: 'rob'
    };
    const actual = db.leafNodes(node);

    expect(actual).toEqual(expected);
  });

  it('should set direction to forwards when bad format', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      data: 'foo',
      defined: 11,
      subscripts: ['a', 'b']
    };

    const node = {
      global: 'rob'
    };
    const actual = db.leafNodes(node, 'bad');

    expect(actual).toEqual(expected);
  });

  it('should return forwards node when top-level global node passed', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      data: 'foo',
      defined: 11,
      subscripts: ['a', 'b']
    };

    const node = {
      global: 'rob'
    };
    const actual = db.leafNodes(node, 'forwards');

    expect(actual).toEqual(expected);
  });

  it('should return backwards node when top-level global node passed', () => {
    const expected = {
      ok: 1,
      global: 'tony',
      data: 'world',
      defined: 1,
      subscripts: ['z', 'y']
    };

    const node = {
      global: 'tony'
    };
    const actual = db.leafNodes(node, 'backwards');

    expect(actual).toEqual(expected);
  });

  it('should return forwards node when subscripted node passed', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      data: 'bar2',
      defined: 1,
      subscripts: ['a', 'b', 'e']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b', 'd']
    };
    const actual = db.leafNodes(node, 'forwards');

    expect(actual).toEqual(expected);
  });

  it('should return backwards node when subscripted node passed', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      data: 'foo',
      defined: 11,
      subscripts: ['a', 'b']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b', 'c']
    };
    const actual = db.leafNodes(node, 'backwards');

    expect(actual).toEqual(expected);
  });

  it('should return the nearest leaf node in collating sequence (forwards)', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      data: 'baz',
      defined: 1,
      subscripts: ['a', 'b', 'c']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b', 'a']
    };
    const actual = db.leafNodes(node, 'forwards');

    expect(actual).toEqual(expected);
  });

  it('should return the nearest leaf node in collating sequence (backwards)', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      data: 'foo',
      defined: 11,
      subscripts: ['a', 'b']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b', 'a']
    };
    const actual = db.leafNodes(node, 'backwards');

    expect(actual).toEqual(expected);
  });

  it('should return empty when fallen off the end', () => {
    const expected = {
      global: 'rob',
      defined: 0
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'e']
    };
    const actual = db.leafNodes(node, 'forwards');

    expect(actual).toEqual(expected);
  });

  it('should return empty when fallen off the top', () => {
    const expected = {
      global: 'rob',
      defined: 0
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b']
    };
    const actual = db.leafNodes(node, 'backwards');

    expect(actual).toEqual(expected);
  });

  it('should return empty when fallen off the end with not existed member', () => {
    const expected = {
      global: 'rob',
      defined: 0
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'z']
    };
    const actual = db.leafNodes(node, 'forwards');

    expect(actual).toEqual(expected);
  });

  it('should return empty when fallen off the top with not existed member', () => {
    const expected = {
      global: 'rob',
      defined: 0
    };

    const node = {
      global: 'rob',
      subscripts: ['a']
    };
    const actual = db.leafNodes(node, 'backwards');

    expect(actual).toEqual(expected);
  });
});
