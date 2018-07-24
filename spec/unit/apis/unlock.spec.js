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

const unlock = require('../../../lib/apis/unlock');
const createNode = require('../../../lib/apis/createNode');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('api/unlock', () => {
  let Db;
  let db;

  beforeAll(() => {
    Db = function () {
      this.store = createStore();
    };

    const proto = Db.prototype;
    proto.unlock = unlock;
    proto.createNode = createNode;
    // proto.set = set;
    // proto.get = get;
  });

  beforeEach(() => {
    db = new Db();
  });

  it('should return non ok value', () => {
    const expected = {
      ok: 0
    };

    const node = {};

    const actual = db.unlock(node);

    expect(actual).toEqual(expected);
  });
});
