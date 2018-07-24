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

const debug = require('debug')('ewd-memory-globals:lock');
const clone = require('../utils/cloneArray');
const flattenArray = require('../utils/flattenArray');
const commands = {
  keyExists: require('../commands/keyExists'),
  setKeyValue: require('../commands/setKeyValue'),
  deleteKey: require('../commands/deleteKey'),
  blockingPop: require('../commands/blockingPop'),
};

function lock(node) {
  debug('lock: %j', node);

  const glob = node.global;
  let flatSubs;

  if (glob) {
    // key that will be used to block
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

    debug('checking if lockerKey %s exists', lockerKey);
    if (!commands.keyExists.call(this, lockerKey)) {
      debug('lockerKey does not exist');
      // nobody has this lock set, so grab it and clear out the lock key
      commands.setKeyValue.call(this, lockerKey, process.pid);
      commands.deleteKey.call(this, lockKey);

      return {
        ok: 1,
        global: glob,
        subscripts: node.subscripts,
        result: 1,
        pid: process.pid
      };
    }

    debug('locker key exists');
    // block awaiting the lock to be unlocked
    debug('waiting on lock for %d seconds', node.timeout);
    const result = commands.blockingPop.call(this, lockKey, node.timeout);
    debug('blocking pop completed: %j' + result);

    if (result.error) {
      // lock timed out
      return {
        ok: 1,
        global: glob,
        subscripts: node.subscripts,
        result: 0
      };
    }

    // I now have the lock
    debug('i now have the lock. lockerKey %s set to %s', lockerKey, process.pid);
    commands.setKeyValue.call(this, lockerKey, process.pid);

    return {
      ok: 1,
      global: glob,
      subscripts: node.subscripts,
      result: 1,
      pid: process.pid
    };
  }

  return {
    ok: 0
  };
}

module.exports = lock;
