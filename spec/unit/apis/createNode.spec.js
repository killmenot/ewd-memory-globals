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

function createStore() {
  return require('../../../lib/store').createStore();
}

function getStore(db) {
  return db.store._store;
}

describe('api/createNode', () => {
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
  });

  beforeEach(() => {
    db = new Db();
  });

  describe('When top-level global node', () => {
    it('should create global node', () => {
      const expected = {
        'node:rob': {
          data: '1',
          value: 'hello'
        },
        'leaves:rob': []
      };

      db.createNode('rob', [], 'hello');

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should create global node when subscripted node exists', () => {
      const expected = {
        'node:rob:a': {
          data: '1',
          value: 'hello'
        },
        'leaves:rob': ['a'],
        'children:rob': ['a'],
        'node:rob': {
          data: '11',
          value: 'world'
        }
      };

      db.createNode('rob', ['a'], 'hello');
      db.createNode('rob', [], 'world');

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });
  });

  describe('When subscripted node', () => {
    it('should create subscripted node', () => {
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

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should create subscripted node when parent subscripted node has data', () => {
      const expected = {
        'node:rob:a': {
          data: '11',
          value: 'world'
        },
        'leaves:rob': ['a', 'a:b'],
        'children:rob': ['a'],
        'node:rob': {
          data: '10'
        },
        'node:rob:a:b': {
          data: '1',
          value: 'hello'
        },
        'children:rob:a': ['b']
      };

      db.createNode('rob', ['a'], 'world');
      db.createNode('rob', ['a', 'b'], 'hello');

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should create subscripted node when parent node has children', () => {
      const expected = {
        'node:rob:a:b': {
          data: '1',
          value: 'hello'
        },
        'leaves:rob': ['a:b', 'a:c'],
        'children:rob:a': ['b', 'c'],
        'node:rob:a': {
          data: '10'
        },
        'children:rob': ['a'],
        'node:rob': {
          data: '10'
        },
        'node:rob:a:c': {
          data: '1',
          value: 'world'
        }
      };

      db.createNode('rob', ['a', 'b'], 'hello');
      db.createNode('rob', ['a', 'c'], 'world');

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should create subscripted node when top-level global node exists and has data', () => {
      const expected = {
        'node:rob': {
          data: '11',
          value: 'world'
        },
        'node:rob:a:b': {
          data: '1',
          value: 'hello'
        },
        'leaves:rob': ['a:b'],
        'children:rob:a': ['b'],
        'node:rob:a': {
          data: '10'
        },
        'children:rob': ['a']
      };

      db.createNode('rob', [], 'world');
      db.createNode('rob', ['a', 'b'], 'hello');

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should create subscripted when top-level global node exists and has data/children', () => {
      const expected = {
        'node:rob': {
          data: '11',
          value: 'world'
        },
        'node:rob:a': {
          data: '1',
          value: 'hello'
        },
        'leaves:rob': ['a', 'b:c'],
        'children:rob': ['a', 'b'],
        'node:rob:b:c': {
          data: '1',
          value: 'foo'
        },
        'children:rob:b': ['c'],
        'node:rob:b': {
          data: '10'
        }
      };

      db.createNode('rob', [], 'world');
      db.createNode('rob', ['a'], 'hello');
      db.createNode('rob', ['b', 'c'], 'foo');

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });

    it('should create subscripted node when children leaf node has data', () => {
      const expected = {
        'node:rob:a:b': {
          data: '11',
          value: 'foo'
        },
        'leaves:rob': ['a:b', 'a:b:c'],
        'children:rob:a': ['b'],
        'node:rob:a': {
          data: '10'
        },
        'children:rob': ['a'],
        'node:rob': {
          data: '10'
        },
        'node:rob:a:b:c': {
          data: '1',
          value: 'bar'
        },
        'children:rob:a:b': ['c']
      };

      db.createNode('rob', ['a', 'b', 'c'], 'bar');
      db.createNode('rob', ['a', 'b'], 'foo');

      const actual = getStore(db);

      expect(actual).toEqual(expected);
    });
  });
});
