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

const set = require('../../../lib/apis/set');
const createNode = require('../../../lib/apis/createNode');

function createStore() {
  return require('../../../lib/store').createStore();
}

function getStore(db) {
  return db.store._store;
}

describe('api/set', () => {
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
    proto.set = set;
    proto.createNode = createNode;
  });

  beforeEach(() => {
    db = new Db();
  });

  it('should return non ok', () => {
    const expected = {
      ok: 0,
      global: '',
      result: 0,
      subscripts: []
    };

    const node = {};

    const actual = db.set(node);

    expect(actual).toEqual(expected);
  });

  it('should create node', () => {
    const expectedResult = {
      ok: 1,
      global: 'rob',
      result: 0,
      subscripts: ['a', 'b']
    };
    const expectedStore = {
      'node:rob:a:b': {
        data: 1,
        value: 'foo'
      },
      'leaves:rob': ['a:b'],
      'children:rob:a': ['b'],
      'node:rob:a': {
        data: 10
      },
      'children:rob': ['a'],
      'node:rob': {
        data: 10
      }
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b'],
      data: 'foo'
    };

    const actualResult = db.set(node);
    expect(actualResult).toEqual(expectedResult);

    const actualStore = getStore(db);
    expect(actualStore).toEqual(expectedStore);
  });
});
