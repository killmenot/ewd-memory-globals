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

const debug = require('debug')('ewd-memory-global:sequence');
const padIfInteger = require('../utils/padIfInteger');
const clone = require('../utils/cloneArray');
const flattenArray = require('../utils/flattenArray');
const stripLeadingZeros = require('../utils/stripLeadingZeros');
const commands = {
  addMember: require('../commands/addMember'),
  countMembers: require('../commands/countMembers'),
  globalExists: require('../commands/globalExists'),
  deleteMember: require('../commands/deleteMember'),
  getMemberIndex: require('../commands/getMemberIndex'),
  getMemberByIndex: require('../commands/getMemberByIndex'),
};

const FIELD_MARK = String.fromCharCode(254);

function sequence(node, direction) {
  debug('next: %j; direction: %s', node, direction);

  const glob = node.global;

  if (glob) {
    debug('does global exist?');
    if (!commands.globalExists.call(this, glob)) {
      return {
        global: glob,
        subscripts: node.subscripts || ''
      };
    }

    debug('global exists');

    const subscripts = clone(node.subscripts);
    const parentSubs = subscripts.slice(0, -1);

    let seed = subscripts.slice(-1)[0] || '';
    let seedAfter = padIfInteger.call(this, seed);
    debug('seed: \'%s\'; after: \'%s\'', seed, seedAfter);
    seed = seedAfter;

    let key = 'children:' + glob;
    if (parentSubs.length > 0) key = key + this.key_separator + flattenArray.call(this, parentSubs);

    let index;
    let next;
    let tempMember;
    let result;

    if (seed === '') {
      index = -1;
      if (direction === 'previous') {
        index = commands.countMembers.call(this, key);
      }
    } else {
      index = commands.getMemberIndex.call(this, key, seed);
      debug('seed = %s; index: %s', seed, index);
      // if the seed subscript value doesn't exist, add it temporarily
      //  and use it as the seed

      if (typeof index === 'undefined' || index === -1) {
        tempMember = seed;
        result = commands.addMember.call(this, key, tempMember);
        debug('added tempMember: %s; result: %j', tempMember, result);
        index = commands.getMemberIndex.call(this, key, tempMember);
        debug('index of temporarily added member: %d', index);
      }
    }

    if (direction === 'next') index++;
    if (direction === 'previous') {
      index--;
      if (index === -1) {
        next = '';
        parentSubs.push(next);
        if (tempMember) {
          result = commands.deleteMember.call(this, key, tempMember);
          debug('deleted tempMember: %s; result: %j', tempMember, result);
        }

        return {
          ok: 1,
          global: glob,
          result: next,
          subscripts: parentSubs
        };
      }
    }

    result = commands.getMemberByIndex.call(this, key, index);
    next = result || '';

    if (next !== '' && next.toString().charAt(0) === this.key_separator) {
      next = stripLeadingZeros(next);
    }

    parentSubs.push(next);

    if (tempMember) {
      result = commands.deleteMember.call(this, key, tempMember);
      debug('deleted tempMember: %s; result: %j', tempMember, result);
    }

    return {
      ok: 1,
      global: glob,
      result: next,
      subscripts: parentSubs
    };
  }

  return {
    ok: 0
  };
};

module.exports = sequence;

