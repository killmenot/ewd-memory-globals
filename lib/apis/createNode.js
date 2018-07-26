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

const debug = require('debug')('ewd-memory-globals:createNode');
const flattenArray = require('../utils/flattenArray');
const padIfInteger = require('../utils/padIfInteger');
const constants =require('../constants');
const commands = {
  addProperty: require('../commands/addProperty'),
  addProperties: require('../commands/addProperties'),
  addMember: require('../commands/addMember'),
  getProperty: require('../commands/getProperty'),
  keyExists: require('../commands/keyExists'),
  setKeyValue: require('../commands/setKeyValue')
};

const LEAF_NODE = constants.LEAF_NODE;
const NO_DATA_HAS_CHILDREN = constants.NO_DATA_HAS_CHILDREN;
const HAS_DATA_HAS_CHILDREN = constants.HAS_DATA_HAS_CHILDREN;

function createNode(glob, subscripts, value) {
  const noOfSubscripts = subscripts.length;
  const nodeRoot = 'node:' + glob;
  const leavesKey = 'leaves:' + glob;
  const childrenRoot = 'children:' + glob;
  let result;
  let properties;

  if (noOfSubscripts === 0) {
    // top-level global node is the leaf node

    debug('check if top-level global node %s exists...', nodeRoot);
    if (commands.keyExists.call(this, nodeRoot)) {
      debug('yes - top-level global node exists, check if data value...');
      result = commands.getProperty.call(this, nodeRoot, 'data');
    }

    if (result === NO_DATA_HAS_CHILDREN) {
      debug('update top-level global node %s to has data and children', nodeRoot);
      properties = [
        { name: 'data', value: HAS_DATA_HAS_CHILDREN },
        { name: 'value', value: value }
      ];
    } else {
      debug('create a new top-level global node %s or update existing value', nodeRoot);
      properties = [
        { name: 'data', value: LEAF_NODE },
        { name: 'value', value: value }
      ];
    }

    debug('creating top-level global node %s', nodeRoot);
    commands.addProperties.call(this, nodeRoot, properties);

    debug('check if leaves key %s exists...', leavesKey);
    if (!commands.keyExists.call(this, leavesKey)) {
      debug('no - key %s needs creating', leavesKey);
      commands.setKeyValue.call(this, leavesKey, []);
    }
  } else {
    // subscripted node is the leaf node

    // create the leaf node
    let flatSubs = flattenArray.call(this, subscripts);
    let nodeKey = nodeRoot + this.key_separator + flatSubs;
    let childrenKey;

    debug('check if leaf node %s exists...', nodeKey);
    if (commands.keyExists.call(this, nodeKey)) {
      debug('yes - leaf node exists, check data value...');
      result = commands.getProperty.call(this, nodeKey, 'data');
    }

    if (result === NO_DATA_HAS_CHILDREN) {
      debug('update leaf node %s to has data and children', nodeKey);
      properties = [
        { name: 'data', value: HAS_DATA_HAS_CHILDREN },
        { name: 'value', value: value }
      ];
    } else {
      debug('create a leaf node %s or update existing value', nodeKey);
      properties = [
        { name: 'data', value: LEAF_NODE },
        { name: 'value', value: value }
      ];
    }

    debug('creating leaf node %s', nodeKey);
    commands.addProperties.call(this, nodeKey, properties);
    debug('adding %s to %s ', flatSubs, leavesKey);
    commands.addMember.call(this, leavesKey, flatSubs);

    // now go up each parent creating the
    //  intermediate nodes if the don't exist
    //  and add the child subscript to the parent's
    //  children list
    debug('subscripts start as %j', subscripts);
    let stop = false;

    do {
      let child = subscripts.slice(-1)[0]; // get the last subscript
      child = padIfInteger.call(this, child);

      result = null; // reset result

      subscripts = subscripts.slice(0, -1); // remove the last subscript
      debug('subscripts = %j', subscripts);
      debug('stop = %s', stop);

      if (subscripts.length > 0) {
        flatSubs = flattenArray.call(this, subscripts);
        nodeKey = nodeRoot + this.key_separator + flatSubs;
        childrenKey = childrenRoot + this.key_separator + flatSubs;

        debug('adding %s to %s', child, childrenKey);
        // add child to parent's subscript list
        commands.addMember.call(this, childrenKey, child);

        debug('check if node %s exists...', nodeKey);
        if (commands.keyExists.call(this, nodeKey)) {
          debug('yes - node already created, check if data value needs to be updated');
          result = commands.getProperty.call(this, nodeKey, 'data');

          if (result === LEAF_NODE) {
            debug('update node %s to has data and children now', nodeKey);
            // update node
            commands.addProperty.call(this, nodeKey, 'data', HAS_DATA_HAS_CHILDREN);
          }

          // parent nodes already exist so don't go any further
          stop = true;
        } else {
          debug('no - node needs creating');
          // create intermediate node
          commands.addProperty.call(this, nodeKey, 'data', NO_DATA_HAS_CHILDREN);
        }
      } else {
        debug('adding %s to global %s', child, childrenRoot);
        // add child to subscripts of the global itself
        commands.addMember.call(this, childrenRoot, child);

        // see if we have to set the global node too
        debug('check if global node %s exists...', nodeRoot);
        if (commands.keyExists.call(this, nodeRoot)) {
          debug('yes - global node already created, check if data value needs to be updated');
          result = commands.getProperty.call(this, nodeRoot, 'data');

          if (result === LEAF_NODE) {
            debug('update global node %s to has data and children', nodeRoot);
            // update top-level global node
            commands.addProperty.call(this, nodeRoot, 'data', HAS_DATA_HAS_CHILDREN);
          }
        } else {
          debug('no - global node needs creating');
          // create top-level global node
          commands.addProperty.call(this, nodeRoot, 'data', NO_DATA_HAS_CHILDREN);
        }

        stop = true;
      }
    } while (!stop);
  }

  debug('node created');
}

module.exports = createNode;
