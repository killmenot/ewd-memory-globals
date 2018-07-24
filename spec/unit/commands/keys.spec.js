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

const keys = require('../../../lib/commands/keys');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('commands/keys', () => {
  let Db;
  let db;

  beforeAll(() => {
    Db = function () {
      this.store = createStore();
    };
  });

  beforeEach(() => {
    db = new Db();

    db.store.set('foo', 'bar');
    db.store.set('baz', 'quux');
    db.store.set('q:uu:x', 'quux');
    db.store.set('qu:uu:ux', 'quuux');
  });

  it('should return all keys', () => {
    const expected = ['foo', 'baz', 'q:uu:x', 'qu:uu:ux'];

    const actual = keys.call(db);

    expect(actual).toEqual(expected);
  });

  it('should return keys by simple pattern', () => {
    const expected = ['foo'];

    const actual = keys.call(db, 'f');

    expect(actual).toEqual(expected);
  });

  it('should return keys by global pattern', () => {
    const expected = ['q:uu:x', 'qu:uu:ux'];

    const actual = keys.call(db, '*:uu:*');

    expect(actual).toEqual(expected);
  });

  it('should return keys by global pattern', () => {
    const expected = ['q:uu:x', 'qu:uu:ux'];

    const actual = keys.call(db, 'q*');

    expect(actual).toEqual(expected);
  });
});
