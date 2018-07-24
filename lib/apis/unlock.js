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

const debug = require('debug')('ewd-memory-globals:unlock');
const clone = require('../utils/cloneArray');
const flattenArray = require('../utils/flattenArray');
const commands = {
  keyExists: require('../commands/keyExists'),
  getKeyValue: require('../commands/getKeyValue'),
  deleteKey: require('../commands/deleteKey'),
  pushOntoList: require('../commands/pushOntoList')
};

function unlock(node) {
  debug('unlock: %j', node);

  // key that will be used to block
  const glob = node.global;
  let flatSubs;

  if (glob) {
    let lockKey = 'lock:' + glob;
    // key that denotes who's got the lock
    let lockerKey = 'locker:' + glob;

    if (!node.subscripts) node.subscripts = [];
    const subscripts = clone(node.subscripts);
    if (subscripts.length > 0) {
      flatSubs = flattenArray.call(this, subscripts);
      lockKey = lockKey + this.key_separator + flatSubs;
      lockerKey = lockerKey + this.key_separator + flatSubs;
    }

    if (!commands.keyExists.call(this, lockerKey)) {
      debug('lockerKey does not exist');
      // nobody has this lock set, so just return

      return {
        ok: 1,
        global: glob,
        subscripts: node.subscripts,
        result: 0
      };
    }

    // if I have the lock, unlock it by pushing a value onto the lock list
    const result = commands.getKeyValue.call(this, lockerKey);
    if (result.toString() === process.pid.toString()) {
      debug('I own the lock so I will unlock it');
      debug('push value onto %s', lockKey);
      debug('first delete %s', lockerKey);
      commands.deleteKey.call(this, lockerKey);
      commands.pushOntoList.call(this, lockKey, 'unlocked by ' + process.pid);

      return {
        ok: 1,
        global: glob,
        subscripts: node.subscripts,
        result: 0,
        releasedBy: process.pid
      };
    }

    // I don't own the lock so I can't release it
    return {
      ok: 1,
      global: glob,
      subscripts: node.subscripts,
      result: 0
    };
  }

  return {
    ok: 0
  };
};

module.exports = unlock;
