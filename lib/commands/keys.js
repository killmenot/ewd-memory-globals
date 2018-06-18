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

const escapeStringRegexp = require('escape-string-regexp');

function keys(pattern) {
  pattern = pattern || '';

  const keys = this.store.keys();

  if (pattern && pattern.startsWith('*') && pattern.endsWith('*')) {
    const reString = escapeStringRegexp(pattern.slice(1, -1));
    const re = new RegExp(reString, 'g');

    return keys.filter(x => x.match(re));
  }

  if (pattern && pattern.endsWith('*')) {
    const reString = escapeStringRegexp(pattern.slice(0, -1));
    const re = new RegExp(reString);

    return keys.filter(x => x.match(re));
  }

  if (pattern) {
    return keys.filter(x => x.startsWith(pattern));
  }

  return keys;
}

module.exports = keys;
