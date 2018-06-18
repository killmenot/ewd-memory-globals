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

const kill = require('../../../lib/apis/kill');
const createNode = require('../../../lib/apis/createNode');
const deleteNode = require('../../../lib/apis/deleteNode');

function createStore() {
  return require('../../../lib/store').createStore();
}

function getStore(db) {
  return db.store._store;
}

describe('api/increment', () => {
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
    proto.kill = kill;
    proto.createNode = createNode;
    proto.deleteNode = deleteNode;
  });

  beforeEach(() => {
    db = new Db();
  });

  it('should return non ok value', () => {
    const expected = {
      ok: 0,
      global: '',
      result: 0,
      subscripts: ''
    };

    const node = {};

    const actual = db.kill(node);

    expect(actual).toEqual(expected);
  });

  it('should return non ok value when subscripts passed', () => {
    const expected = {
      ok: 0,
      global: '',
      result: 0,
      subscripts: ['a', 'b']
    };

    const node = {
      subscripts: ['a', 'b']
    };

    const actual = db.kill(node);

    expect(actual).toEqual(expected);
  });

  it('should return ok when global does not exist', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: 0,
      subscripts: ['a', 'b']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b']
    };

    const actual = db.kill(node);

    expect(actual).toEqual(expected);
  });

  it('should delete node', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      result: 0,
      subscripts: ['a', 'b']
    };

    db.createNode('rob', ['a', 'b'], 'hello');

    const node = {
      global: 'rob',
      subscripts: ['a', 'b']
    };
    const actual = db.kill(node);

    expect(actual).toEqual(expected);
    expect(getStore(db)).toEqual({});
  });
});
