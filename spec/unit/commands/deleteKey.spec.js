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

const deleteKey = require('../../../lib/commands/deleteKey');
const keyExists = require('../../../lib/commands/keyExists');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('commands/deleteKey', () => {
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
  });

  it('should delete key', () => {

    expect(keyExists.call(db, 'foo')).toBeTruthy();

    deleteKey.call(db, 'foo');

    expect(keyExists.call(db, 'foo')).toBeFalsy();
  });
});
