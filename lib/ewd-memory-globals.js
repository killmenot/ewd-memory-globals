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

var pkg = require('../package.json');
var apis = {
  version: require('./apis/version'),
  open: require('./apis/open'),
  close: require('./apis/close'),
  set: require('./apis/set'),
  get: require('./apis/get'),
  data: require('./apis/data'),
  increment: require('./apis/increment'),
  kill: require('./apis/kill'),
  sequence: require('./apis/sequence'),
  leafNodes: require('./apis/leafNodes'),
  global_directory: require('./apis/globalDirectory'),
  lock: require('./apis/lock'),
  unlock: require('./apis/unlock')
};
var defaults = {
  integer_padding: 10,
  key_separator: String.fromCharCode(1)
};

function createStore() {
  return require('./store');
}

function db(config) {
  config = config || defaults;

  for (var name in defaults) {
    if (typeof config[name] === 'undefined') {
      config[name] = defaults[name];
    }
  }

  this.store = createStore();
  this.key_separator = config.key_separator;
  this.integer_padding = config.integer_padding;
}

var proto = db.prototype;

proto.buildNo = function () {
  return pkg.version;
};

proto.about = function () {
  return 'ewd-memory-globals: Memory-based emulation of Global Storage database';
};

proto.open = apis.open;
proto.close = apis.close;
proto.set = apis.set;
proto.version = apis.version;
proto.kill = apis.kill;
proto.get = apis.get;
proto.data = apis.data;
proto.increment = apis.increment;
proto.lock = apis.lock;
proto.unlock = apis.unlock;
proto.global_directory = apis.global_directory;

proto.next = function (node) {
  return apis.sequence.call(this, node, 'next');
};

proto.order = function (node) {
  return apis.sequence.call(this, node, 'next');
};

proto.previous = function (node) {
  return apis.sequence.call(this, node, 'previous');
};

proto.next_node = function (node) {
  return apis.leafNodes.call(this, node, 'forwards');
};

proto.previous_node = function (node) {
  return apis.leafNodes.call(this, node, 'backwards');
};

module.exports = db;
