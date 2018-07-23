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

  23 July 2018

*/

'use strict';

const debug = require('debug')('ewd-memory-global:padIfInteger');
const isNormalInteger = require('./isNormalInteger');

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function padIfInteger(value) {
  var isZero = false;
  if (value === 0 || value === '0') {
    debug('zero coming');
    isZero = true;
  }

  if (typeof value !== 'undefined' && value !== '' && isNormalInteger(value)) {
    debug('isZero?: %s', isZero);
    // pack with leading zeros to ensure collating sequence
    value = this.key_separator + pad(value, this.integer_padding);
    debug('padded integer subscript %d', value);
  }

  return value;
}

module.exports = padIfInteger;
