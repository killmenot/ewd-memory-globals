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

  26 July 2018

*/

'use strict';

const debug = require('debug')('ewd-memory-globals:deleteNode');
const flattenArray = require('../utils/flattenArray');
const padIfInteger = require('../utils/padIfInteger');
const constants =require('../constants');
const commands = {
  addProperty: require('../commands/addProperty'),
  getMatchingKeys: require('../commands/getMatchingKeys'),
  getProperty: require('../commands/getProperty'),
  deleteKey: require('../commands/deleteKey'),
  deleteKeys: require('../commands/deleteKeys'),
  deleteMembersByPrefix: require('../commands/deleteMembersByPrefix'),
  deleteMember: require('../commands/deleteMember'),
  countMembers: require('../commands/countMembers'),
  keyExists: require('../commands/keyExists')
};

const LEAF_NODE = constants.LEAF_NODE;
const NO_DATA_HAS_CHILDREN = constants.NO_DATA_HAS_CHILDREN;
const HAS_DATA_HAS_CHILDREN = constants.HAS_DATA_HAS_CHILDREN;

function deleteNode(glob, subscripts) {
  let keys;
  let result;

  if (subscripts.length === 0) {
    // top level delete of entire global

    keys = ['node:' + glob, 'leaves:' + glob, 'children:' + glob];
    result = commands.getMatchingKeys.call(this, '*' + glob + this.key_separator + '*');
    commands.deleteKeys.call(this, keys.concat(result));
  } else {
    const nodeRoot = 'node:' + glob;
    const childrenRoot = 'children:' + glob;
    const leafKey = 'leaves:' + glob;
    let nodeKey;
    let childrenKey;
    let result;

     // delete everything from the specified subscripts and below
    let flatSubs = flattenArray.call(this, subscripts);
    nodeKey = nodeRoot + this.key_separator + flatSubs;
    childrenKey = childrenRoot + this.key_separator + flatSubs;
    keys = [nodeKey, childrenKey];

    // match all lower-level nodes and children
    const wildCard = '*' + glob + this.key_separator + flatSubs + this.key_separator + '*';
    result = commands.getMatchingKeys.call(this, wildCard);

    // now delete all these keys
    result = commands.deleteKeys.call(this, keys.concat(result));

    // now remove leaf item records
    //  match all the lower-level leaf nodes that start with the specified flattened subscripts
    commands.deleteMembersByPrefix.call(this, leafKey, flatSubs + this.key_separator);

    // and now remove the leaf node specified in the delete
    commands.deleteMember.call(this, leafKey, flatSubs);  // change to deleteMember

    // now recursively remove each subscript level from next level up's children

    // if there aren't any subscripts left in the parent, this should be deleted
    //  and recurse this logic up all parent levels

    let stop = false;
    do {
      let child = subscripts.slice(-1)[0]; // get the last subscript
      child = padIfInteger.call(this, child);
      subscripts = subscripts.slice(0, -1); // remove the last subscript
      debug('subscripts = %j', subscripts);

      if (subscripts.length > 0) {
        debug('subscripts length: %d', subscripts.length);
        flatSubs = flattenArray.call(this, subscripts);
        childrenKey = childrenRoot + this.key_separator + flatSubs;

        debug('remove childrenKey = %s; child = %s', childrenKey, child);
        commands.deleteMember.call(this, childrenKey, child);

        // we're still in a subscripted level
        if (commands.countMembers.call(this, childrenKey) === 0) {
          // no children left, so delete the node and recurse up a level
          debug('no more children left for %s', childrenKey);

          nodeKey = nodeRoot + this.key_separator + flatSubs;
          debug('check if node %s data exists...', nodeKey);
          result = commands.getProperty.call(this, nodeKey, 'data');

          if (result === HAS_DATA_HAS_CHILDREN) {
            debug('update node %s to has data because no children', nodeKey);
            commands.addProperty.call(this, nodeKey, 'data', LEAF_NODE);
            // node still has data, so stop the recursion up the parents
            stop = true;
          } else if (result === NO_DATA_HAS_CHILDREN) {
            debug('delete %s because no data and children', nodeKey);
            commands.deleteKey.call(this, nodeKey);
          }
        } else {
          debug('%s still has children', childrenKey);
          // parent still has other children, so stop the recursion up the parents
          stop = true;
        }
      } else {
        debug('check the global node itself');

        // we need to check the subscripts against the global node itself
        debug('global level - remove %s from %s', child, childrenRoot);
        commands.deleteMember.call(this, childrenRoot, child);

        debug('check top level childrenRoot = %s', childrenRoot);
        if (commands.countMembers.call(this, childrenRoot) === 0) {
          // no children left, so check data of the global node
          debug('check if global node %s data exists...', nodeRoot);
          result = commands.getProperty.call(this, nodeRoot, 'data');

          if (result === HAS_DATA_HAS_CHILDREN) {
            debug('update global node %s to has data', nodeRoot);
            commands.addProperty.call(this, nodeRoot, 'data', LEAF_NODE);
          } else if (result === NO_DATA_HAS_CHILDREN) {
            debug('global node has no children and no data so delete %s', nodeRoot);
            commands.deleteKey.call(this, nodeRoot);
          }
        }

        // at the top now, so stop
        stop = true;
      }

      debug('stop = %s', stop);
    } while (!stop);
  }

  debug('node deleted');
}

module.exports = deleteNode;
