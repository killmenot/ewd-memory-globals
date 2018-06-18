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

const addProperty = require('../../../lib/commands/addProperty');
const getProperty = require('../../../lib/commands/getProperty');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('commands/getProperty', () => {
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

  it('should return undefined', () => {
    const actual = getProperty.call(db, 'foo', 'bar');

    expect(actual).toBeUndefined();
  });

  it('should return value', () => {
    const expected = 'baz';

    addProperty.call(db, 'foo', 'bar', 'baz');

    const actual = getProperty.call(db, 'foo', 'bar');

    expect(actual).toBe(expected);
  });
});
