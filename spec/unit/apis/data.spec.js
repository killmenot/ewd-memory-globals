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

const data = require('../../../lib/apis/data');
const createNode = require('../../../lib/apis/createNode');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('api/data', () => {
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
    proto.data = data;
    proto.createNode = createNode;
  });

  beforeEach(() => {
    db = new Db();
  });

  describe('When global is not passed', () => {
    it('should return non ok', () => {
      const expected = {
        ok: 0
      };

      const node = {};

      const actual = db.data(node);

      expect(actual).toEqual(expected);
    });
  });

  describe('When global does not exist', () => {
    it('should return not defined', () => {
      const expected = {
        ok: 1,
        global: 'rob',
        defined: 0,
        subscripts: []
      };

      const node = {
        global: 'rob'
      };
      const actual = db.data(node);

      expect(actual).toEqual(expected);
    });
  });

  it('should return defined', () => {
    const expected = {
      ok: 1,
      global: 'rob',
      defined: 1,
      subscripts: ['a', 'b']
    };

    db.createNode('rob', ['a', 'b'], 'hello');

    const node = {
      global: 'rob',
      subscripts: ['a', 'b']
    };
    const actual = db.data(node);

    expect(actual).toEqual(expected);
  });
});
