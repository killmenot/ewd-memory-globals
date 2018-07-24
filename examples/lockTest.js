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

var memory_globals = require('../');
var db = new memory_globals();

db.open();

console.log(db.version());

var timeout = 40;

var node = {
  global: 'rob',
  subscripts: ['a'],
  timeout: timeout
};

console.log('attempting to lock ' + JSON.stringify(node) + ' within ' + timeout + ' seconds');
var ok = db.lock(node);

if (ok.result === 0) {
  console.log('lock timed out: ' + JSON.stringify(ok));
  db.close();
} else {
  console.log('lock set: ' + JSON.stringify(ok));
  console.log('will release in 30 seconds');
  setTimeout(function() {
    var result = db.unlock(node);
    console.log('unlocked: ' + JSON.stringify(result));
    db.close();
  }, 30000);
}
