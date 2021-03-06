/*

 ----------------------------------------------------------------------------
 | ewd-memory-globals: Memory emulation of Global Storage database          |
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

  26 July 2018

*/

'use strict';

const increment = require('../../../lib/apis/increment');
const createNode = require('../../../lib/apis/createNode');
const set = require('../../../lib/apis/set');
const get = require('../../../lib/apis/get');

function createStore() {
  return require('../../../lib/store').createStore();
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
    proto.increment = increment;
    proto.createNode = createNode;
    proto.set = set;
    proto.get = get;
  });

  beforeEach(() => {
    db = new Db();
  });

  it('should return non ok value', () => {
    const expected = {
      ok: 0
    };

    const node = {};

    const actual = db.increment(node);

    expect(actual).toEqual(expected);
  });

  it('should increment value to next number', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      data: '1',
      subscripts: ['a', 'b']
    };

    const node = {
      global: 'rob',
      subscripts: ['a', 'b']
    };

    const actual = db.increment(node);

    expect(actual).toEqual(expected);
  });

  it('should increment value on increment value', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      data: '4',
      subscripts: ['a', 'b']
    };

    db.createNode('rob', ['a', 'b'], 1);

    const node = {
      global: 'rob',
      subscripts: ['a', 'b'],
      increment: 3
    };

    const actual = db.increment(node);

    expect(actual).toEqual(expected);
  });
});
