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

function storeSet(key, value) {
  this._store[key] = value;
}

function storeGet(key) {
  if (key in this._store) {
    return this._store[key];
  }

  return null;
}

function storeDelete(key) {
  delete this._store[key];
}

function storeExists(key) {
  return key in this._store;
}

function storeReset() {
  this._store = {};
}

function storeAllKeys() {
  return Object.keys(this._store);
}

function createStore() {
  return {
    set: storeSet,
    get: storeGet,
    delete: storeDelete,
    exists: storeExists,
    reset: storeReset,
    keys: storeAllKeys,
    createStore: createStore,
    _store: {}
  };
}

module.exports = createStore();
