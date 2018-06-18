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

const debug = require('debug')('ewd-memory-global:get');
const clone = require('../utils/cloneArray');
const flattenArray = require('../utils/flattenArray');
const commands = {
  getProperties: require('../commands/getProperties')
};

function get(node) {
  debug('get: %j', node);

  const glob = node.global;
  if (glob) {
    let key = 'node:' + glob;
    if (!node.subscripts) node.subscripts = [];
    const subscripts = clone(node.subscripts);
    if (subscripts.length > 0) key = key + this.key_separator + flattenArray.call(this, subscripts);

    const result = commands.getProperties.call(this, key);
    debug('result: %j', result);

    if (result && result.data) {
      return {
        ok: 1,
        global: glob,
        data: result.value || '',
        defined: parseInt(result.data, 10),
        subscripts: node.subscripts
      }
    }

    return {
      ok: 1,
      global: glob,
      data: '',
      defined: 0,
      subscripts: node.subscripts
    };
  }

  return {
    ok: 0
  };
}

module.exports = get;
