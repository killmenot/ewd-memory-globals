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

const addMember = require('../../../lib/commands/addMember');
const getMemberByIndex = require('../../../lib/commands/getMemberByIndex');
const getMemberIndex = require('../../../lib/commands/getMemberIndex');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('commands/addMember', () => {
  let Db;
  let db;

  beforeAll(() => {
    Db = function () {
      this.store = createStore();
    };
  });

  beforeEach(() => {
    db = new Db();
  });

  it('should add new member', () => {
    addMember.call(db, 'foo', 'bar');

    expect(getMemberByIndex.call(db, 'foo', 0)).toBe('bar');
    expect(getMemberIndex.call(db, 'foo', 'bar')).toBe(0);
  });

  it('should sort members after adding', () => {
    addMember.call(db, 'foo', 'bar');
    addMember.call(db, 'foo', 'BAR');

    expect(getMemberByIndex.call(db, 'foo', 0)).toBe('BAR');
    expect(getMemberByIndex.call(db, 'foo', 1)).toBe('bar');
  });

  it('should handle duplicates', () => {
    addMember.call(db, 'foo', 'bar');
    addMember.call(db, 'foo', 'bar');

    expect(getMemberByIndex.call(db, 'foo', 0)).toBe('bar');
    expect(getMemberByIndex.call(db, 'foo', 1)).toBeUndefined();
  });
});
