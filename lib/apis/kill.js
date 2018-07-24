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

const debug = require('debug')('ewd-memory-globals:kill');
const deleteNode = require('./deleteNode');
const clone = require('../utils/cloneArray');
const commands = {
  globalExists: require('../commands/globalExists')
};

function kill(node) {
  debug('kill %j', node);

  const glob = node.global;
  if (glob) {
    if (!commands.globalExists.call(this, glob)) {
      return {
        ok: 1,
        global: glob,
        result: 0,
        subscripts: node.subscripts
      };
    }

    const subscripts = clone(node.subscripts);
    deleteNode.call(this, glob, subscripts);

    return {
      ok: 1,
      global: glob,
      result: 0,
      subscripts: node.subscripts
    };
  }

  return {
    ok: 0,
    global: '',
    result: 0,
    subscripts: node.subscripts || ''
  };
}

module.exports = kill;
