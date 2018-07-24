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

const globalDirectory = require('../../../lib/apis/globalDirectory');
const createNode = require('../../../lib/apis/createNode');

function createStore() {
  return require('../../../lib/store').createStore();
}

describe('api/globalDirectory', () => {
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
    /*jshint camelcase: false */
    proto.global_directory = globalDirectory;
    /*jshint camelcase: true */
    proto.createNode = createNode;
  });

  beforeEach(() => {
    db = new Db();
  });

  it('should return empty list', () => {
    const expected = [];

    /*jshint camelcase: false */
    const actual = db.global_directory();
    /*jshint camelcase: true */

    expect(actual).toEqual(expected);
  });

  it('should return globals', () => {
    const expected = ['rob', 'tony'];

    db.createNode('rob', ['a', 'b'], 'hello');
    db.createNode('rob', ['c'], 'world');
    db.createNode('tony', ['d'], 'foo');

    /*jshint camelcase: false */
    const actual = db.global_directory();
    /*jshint camelcase: true */

    expect(actual).toEqual(expected);
  });

  it('should return globals when no leaf nodes exists', () => {
    const expected = ['rob', 'tony'];

    db.createNode('rob', [], 'hello');
    db.createNode('tony', [], 'world');

    /*jshint camelcase: false */
    const actual = db.global_directory();
    /*jshint camelcase: true */

    expect(actual).toEqual(expected);
  });

  it('should return sorted values', () => {
    const expected = ['bar', 'foo', 'quux'];

    db.createNode('foo', [], 'foo');
    db.createNode('bar', [], 'bar');
    db.createNode('quux', [], 'quux');

    /*jshint camelcase: false */
    const actual = db.global_directory();
    /*jshint camelcase: true */

    expect(actual).toEqual(expected);
  });
});
