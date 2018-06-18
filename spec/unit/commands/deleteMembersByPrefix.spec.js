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

const deleteMembersByPrefix = require('../../../lib/commands/deleteMembersByPrefix');
const addMember = require('../../../lib/commands/addMember');
const getMemberIndex = require('../../../lib/commands/getMemberIndex');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('commands/deleteMembersByPrefix', () => {
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

  it('should return false when no key exists', () => {
    const actual = deleteMembersByPrefix.call(db, 'foo', 'quux');

    expect(actual).toBeFalsy();
  });

  it('should return true when no members found', () => {
    addMember.call(db, 'foo', 'bar');

    expect(deleteMembersByPrefix.call(db, 'foo', 'quux')).toBeTruthy();
    expect(getMemberIndex.call(db, 'foo', 'bar')).toBe(0);
  });

  it('should return true when members deleted', () => {
    addMember.call(db, 'foo', 'bar');
    addMember.call(db, 'foo', 'baz');
    addMember.call(db, 'foo', 'quux');

    expect(deleteMembersByPrefix.call(db, 'foo', 'ba')).toBeTruthy();
    expect(getMemberIndex.call(db, 'foo', 'bar')).toBe(-1);
    expect(getMemberIndex.call(db, 'foo', 'baz')).toBe(-1);
    expect(getMemberIndex.call(db, 'foo', 'quux')).toBe(0);
  });

  it('should return true when members and key are deleted', () => {
    addMember.call(db, 'foo', 'bar');
    addMember.call(db, 'foo', 'baz');

    expect(deleteMembersByPrefix.call(db, 'foo', 'ba')).toBeTruthy();
    expect(getMemberIndex.call(db, 'foo', 'bar')).toBeUndefined();
    expect(getMemberIndex.call(db, 'foo', 'baz')).toBeUndefined();
  });
});
