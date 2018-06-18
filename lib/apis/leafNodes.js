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

const debug = require('debug')('ewd-memory-global:leafNodes');
const clone = require('../utils/cloneArray');
const flattenArray = require('../utils/flattenArray');

const commands = {
  globalExists: require('../commands/globalExists'),
  getMemberIndex: require('../commands/getMemberIndex'),
  addMember: require('../commands/addMember'),
  getMemberndex: require('../commands/getMemberIndex'),
  countMembers: require('../commands/countMembers'),
  deleteMember: require('../commands/deleteMember'),
  getMemberByIndex: require('../commands/getMemberByIndex'),
};

function leafNodes(node, direction) {
  debug('next_node: %j', node);

  const glob = node.global;

  direction = direction || 'forwards';
  if (direction !== 'forwards' && direction !== 'backwards') direction = 'forwards';

  if (glob) {
    debug('does global exist?');
    if (!commands.globalExists.call(this, glob)) {
      return {
        global: glob,
        defined: 0
      };
    }

    debug('global exists');

    const key = 'leaves:' + glob;
    const subscripts = clone(node.subscripts);

    let member;
    let index;
    let max;
    let min;
    let result;
    let tempMember;

    if (subscripts.length > 0) member = flattenArray.call(this, subscripts);

    if (member) {
      // a subscript has been specified - see if it exists as a leaf node
      index = commands.getMemberIndex.call(this, key, member);
      debug('index: %d', index);

      if (index === -1) {
        debug('index undefined');
        //  the specified subscripts dont point to a leaf node so
        //  get the nearest leaf node in collating sequence

        //  do this by temporarily adding the subscript to the leaf list,
        //  get the next or previous index and delete the temporary subscript

        tempMember = member + this.key_separator;
        result = commands.addMember.call(this, key, tempMember);
        debug('added tempMember: %s to %s; %j', tempMember, key, result);
        index = commands.getMemberIndex.call(this, key, tempMember);
        debug('index of temporarily added member: %d', index);
      }

      // get the next or previous member
      if (direction === 'forwards') {
        index++;
        max = commands.countMembers.call(this, key);
        if (index === max) {
          // fallen off the end
          if (tempMember) commands.deleteMember.call(this, key, tempMember);

          return {
            global: glob,
            defined: 0
          };
        } else {
          // retrieve the member
          result = commands.getMemberByIndex.call(this, key, index);
          if (tempMember) commands.deleteMember.call(this, key, tempMember);

          return this.get({
            global: glob,
            subscripts: result.split(this.key_separator)
          });
        }
      } else {
        index--;
        if (index === -1) {
          // fallen off the top
          if (tempMember) commands.deleteMember.call(this, key, tempMember);

          return {
            global: glob,
            defined: 0
          };
        } else {
          // retrieve the member
          result = commands.getMemberByIndex.call(this, key, index);
          if (tempMember) commands.deleteMember.call(this, key, tempMember);

          return this.get({
            global: glob,
            subscripts: result.split(this.key_separator)
          });
        }
      }
    } else {
      // no subscripts specified - get first or last leaf node
      if (direction === 'forwards') {
        // retrieve the first member
        result = commands.getMemberByIndex.call(this, key, 0);

        return this.get({
          global: glob,
          subscripts: result.split(this.key_separator)
        });
      } else {
        // retrieve the last member
        index = commands.countMembers.call(this, key) - 1;
        result = commands.getMemberByIndex.call(this, key, index);

        return this.get({
          global: glob,
          subscripts: result.split(this.key_separator)
        });
      }
    }
  }

  return {
    ok: 0
  };
};

module.exports = leafNodes;
