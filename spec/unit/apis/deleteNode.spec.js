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

const createNode = require('../../../lib/apis/createNode');
const deleteNode = require('../../../lib/apis/deleteNode');
const data = require('../../../lib/apis/data');

function createStore() {
  return require('../../../lib/store').createStore();
}

function getStore(db) {
  return db.store._store;
}

describe('api/deleteNode', () => {
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
    proto.createNode = createNode;
    proto.deleteNode = deleteNode;
    proto.data = data;
  });

  beforeEach(() => {
    db = new Db();
  });

  describe('When top-level global node', () => {
    it('should delete global node', () => {
      const expected = {};

      db.createNode('rob', [], 'hello');

      db.deleteNode('rob', []);

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should delete global node with subscripts', () => {
      const expected = {};

      db.createNode('rob', ['a', 'b'], 'hello');
      db.createNode('rob', ['c', 'd'], 'world');

      db.deleteNode('rob', []);

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });
  });

  describe('When subscripted node', () => {
    it('should delete subscripted node', () => {
      const expected = {};

      db.createNode('rob', ['a', 'b'], 'hello');

      db.deleteNode('rob', ['a', 'b']);

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should delete subscripted node when parent has data', () => {
      const expected = {
        'node:rob:a': {
          data: '1',
          value: 'hello'
        },
        'leaves:rob': ['a'],
        'children:rob': ['a'],
        'node:rob': {
          data: '10'
        }
      };

      db.createNode('rob', ['a'], 'hello');
      db.createNode('rob', ['a', 'b'], 'world');

      db.deleteNode('rob', ['a', 'b']);

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should delete subscripted node when parent has data and children', () => {
      const expected = {
        'node:rob:a': {
          data: '11',
          value: 'foo'
        },
        'leaves:rob': ['a', 'a:c'],
        'children:rob': ['a'],
        'node:rob': {
          data: '10'
        },
        'node:rob:a:c': {
          data: '1',
          value: 'world'
        },
        'children:rob:a': ['c']
      };

      db.createNode('rob', ['a'], 'foo');
      db.createNode('rob', ['a', 'b'], 'hello');
      db.createNode('rob', ['a', 'c'], 'world');

      db.deleteNode('rob', ['a', 'b']);

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should delete subscripted node when parent has children', () => {
      const expected = {
        'node:rob:a:b': {
          data: '1',
          value: 'hello'
        },
        'leaves:rob': ['a:b'],
        'children:rob:a': ['b'],
        'node:rob:a': {
          data: '10'
        },
        'children:rob': ['a'],
        'node:rob': {
          data: '10'
        }
      };

      db.createNode('rob', ['a', 'b'], 'hello');
      db.createNode('rob', ['a', 'c'], 'world');

      db.deleteNode('rob', ['a', 'c']);

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should delete subscripted node when global node has children', () => {
      const expected = {
        'node:rob:a': {
          data: '1',
          value: 'hello'
        },
        'leaves:rob': ['a'],
        'children:rob': ['a'],
        'node:rob': {
          data: '10'
        }
      };

      db.createNode('rob', ['a'], 'hello');
      db.createNode('rob', ['b'], 'world');

      db.deleteNode('rob', ['b']);

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should delete subscripted node when global node has data', () => {
      const expected = {
        'node:rob': {
          data: '1',
          value: 'hello'
        }
      };

      db.createNode('rob', [], 'hello');
      db.createNode('rob', ['a', 'b'], 'world');

      db.deleteNode('rob', ['a', 'b']);

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });
  });
});
