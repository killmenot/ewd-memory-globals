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

  24 July 2018

*/

'use strict';

const Memory = require('../../lib/ewd-memory-globals');
const createNode = require('../../lib/apis/createNode');
const pkg = require('../../package.json');

function createStore() {
  return require('../../lib/store').createStore();
}

describe('ewd-memory-globals', () => {
  let db;

  beforeEach(() => {
    db = new Memory();
    db.store = createStore();

    createNode.call(db, 'rob', ['a', 'b'], 'foo');
    createNode.call(db, 'rob', ['a', 'b', 'c'], 'baz');
    createNode.call(db, 'rob', ['a', 'b', 'd'], 'bar');
    createNode.call(db, 'rob', ['a', 'b', 'g'], 'bar2');
    createNode.call(db, 'rob', ['a', 'e'], 'quux');
  });

  describe('#about', () => {
    it('should return correct text', () => {
      const expected = 'ewd-memory-globals: Memory-based emulation of Global Storage database';
      const actual = db.about();
      expect(actual).toBe(expected);
    });
  });

  describe('#buildNo', () => {
    it('should return correct build number', () => {
      const expected = pkg.version;
      const actual = db.buildNo();
      expect(actual).toBe(expected);
    });
  });

  describe('#open', () => {
    it('should be defined', () => {
      expect(db.open).toBeDefined();
    });
  });

  describe('#close', () => {
    it('should be defined', () => {
      expect(db.close).toBeDefined();
    });
  });

  describe('#set', () => {
    it('should be defined', () => {
      expect(db.set).toBeDefined();
    });
  });

  describe('#version', () => {
    it('should be defined', () => {
      expect(db.version).toBeDefined();
    });
  });

  describe('#kill', () => {
    it('should be defined', () => {
      expect(db.kill).toBeDefined();
    });
  });

  describe('#get', () => {
    it('should be defined', () => {
      expect(db.get).toBeDefined();
    });
  });

  describe('#data', () => {
    it('should be defined', () => {
      expect(db.data).toBeDefined();
    });
  });

  describe('#increment', () => {
    it('should be defined', () => {
      expect(db.increment).toBeDefined();
    });
  });

  describe('#lock', () => {
    it('should be defined', () => {
      expect(db.lock).toBeDefined();
    });
  });

  describe('#unlock', () => {
    it('should be defined', () => {
      expect(db.unlock).toBeDefined();
    });
  });

  describe('#get', () => {
    it('should be defined', () => {
      expect(db.get).toBeDefined();
    });
  });

  describe('#global_directory', () => {
    it('should be defined', () => {
      /*jshint camelcase: false */
      expect(db.global_directory).toBeDefined();
      /*jshint camelcase: true */
    });
  });

  describe('#next', () => {
    it('should return next node', () => {
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
      const actual = db.next(node);

      expect(actual).toEqual(expected);
    });
  });

  describe('#order', () => {
    it('should return next node', () => {
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
      const actual = db.order(node);

      expect(actual).toEqual(expected);
    });
  });

  describe('#previous', () => {
    it('should return next node', () => {
      const expected = {
        ok: 1,
        global: 'rob',
        result: 'd',
        subscripts: ['a', 'b', 'd']
      };

      const node = {
        global: 'rob',
        subscripts: ['a', 'b', 'e']
      };

      /*jshint camelcase: false */
      const actual = db.previous(node);
      /*jshint camelcase: true */

      expect(actual).toEqual(expected);
    });
  });

  describe('#next_node', () => {
    it('should return next leaf node', () => {
      const expected = {
        ok: 1,
        global: 'rob',
        data: 'baz',
        defined: 1,
        subscripts: ['a', 'b', 'c']
      };

      const node = {
        global: 'rob',
        subscripts: ['a', 'b']
      };

      /*jshint camelcase: false */
      const actual = db.next_node(node);
      /*jshint camelcase: true */

      expect(actual).toEqual(expected);
    });
  });

  describe('#previous_node', () => {
    it('should return previous leaf node', () => {
      const expected = {
        ok: 1,
        global: 'rob',
        data: 'bar2',
        defined: 1,
        subscripts: ['a', 'b', 'g']
      };

      const node = {
        global: 'rob',
        subscripts: ['a', 'e']
      };

      /*jshint camelcase: false */
      const actual = db.previous_node(node);
      /*jshint camelcase: true */

      expect(actual).toEqual(expected);
    });
  });
});
