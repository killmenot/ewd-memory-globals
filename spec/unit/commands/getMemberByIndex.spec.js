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

const getMemberByIndex = require('../../../lib/commands/getMemberByIndex');
const addMember = require('../../../lib/commands/addMember');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('commands/getMemberByIndex', () => {
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

  it('should return member by index', () => {
    const expected = 'bar';

    addMember.call(db, 'foo', 'bar');

    const actual = getMemberByIndex.call(db, 'foo', 0);

    expect(actual).toBe(expected);
  });

  it('should return nothing', () => {
    const actual = getMemberByIndex.call(db, 'foo', 1);

    expect(actual).toBeUndefined();
  });
});
