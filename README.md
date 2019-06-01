# ewd-memory-globals: Memory emulation of Global Storage database

[![Build Status](https://travis-ci.org/killmenot/ewd-memory-globals.svg?branch=master)](https://travis-ci.org/killmenot/ewd-memory-globals) [![Coverage Status](https://coveralls.io/repos/github/killmenot/ewd-memory-globals/badge.svg?branch=master)](https://coveralls.io/github/killmenot/ewd-memory-globals?branch=master) [![dependencies Status](https://david-dm.org/github/killmenot/status.svg)](https://david-dm.org/github/killmenot) [![devDependencies Status](https://david-dm.org/killmenot/ewd-memory-globals/dev-status.svg)](https://david-dm.org/killmenot/ewd-memory-globals?type=dev) [![npm version](https://img.shields.io/npm/v/ewd-memory-globals.svg)](https://www.npmjs.com/package/ewd-memory-globals) [![Known Vulnerabilities](https://snyk.io/test/github/killmenot/ewd-memory-globals/badge.svg?targetFile=package.json)](https://snyk.io/test/github/killmenot/ewd-memory-globals?targetFile=package.json)


Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

Special thanks to the Ripple Foundation [http://rippleosi.org](http://rippleosi.org) for support and funding of this project.


## ewd-memory-globals

This module provides an emulation of a Global Storage database using memory storage.

The APIs are modelled on the *cache.node* interface provided by the Cach&eacute; database (a proprietary Global Storage database) and are designed to behave identically.

It is designed to be used in conjunction with the [ewd-qoper8](https://github.com/robtweed/ewd-qoper8) module and used within  its worker processes, where synchronous database access does not interfere with the main Node.js process, rather than in conventional Node.js-based applications.

See [https://robtweed.wordpress.com/2016/03/03/higher-level-database-operations-with-node-js/](https://robtweed.wordpress.com/2016/03/03/higher-level-database-operations-with-node-js/) for further background.


## APIs

The following APIs are provided:

    open()
    close()
    get()
    set()
    data()
    increment()
    kill()
    next()
    previous()
    next_node()
    previous_node()
    lock()
    unlock()
    global_directory()
    version()

## Examples

Several examples demonstrating the use of *ewd-memory-globals* are included in the */examples* folder.

In addition to basic API tests, you can also see how the *ewd-document-store* module provides a high-level abstraction of *ewd-memory-global's* Global Storage as:

- persistent JavaScript Objects
- document database

See /examples/docstore-tests.js

For more information on ewd-document-store, see:

[http://gradvs1.mgateway.com/download/ewd-document-store.pdf](http://gradvs1.mgateway.com/download/ewd-document-store.pdf)

You'll also find a detailed set of presentations on Global Storage databases and the 
ewd-document-store JavaScript abstraction on the M/Gateway Web Site: go to:

      [http://www.mgateway.com](http://www.mgateway.com)

Click the *Training* tab.  Parts 17 to 27 will provide in-depth background. *ewd-memory-globals* will behave
identically to the other Global Storage databases referred to in these presentations.


## How Global Storage is Emulated in ewd-memory-globals

To understand the basics of a Global Storage database, see 

[http://www.slideshare.net/robtweed/ewd-3-training-course-part-17-introduction-to-global-storage-databases](http://www.slideshare.net/robtweed/ewd-3-training-course-part-17-introduction-to-global-storage-databases)

The hierarchical structure of a Global is emulated using plain JavaScript object

 - node:xxxx  A hash that contains details about each Global Node, specifically whether it's a leaf-node or not, and if so, its value
 - children:xxxx  A sorted list containing any child subscript values for each of a Global's nodes
 - leaves:xxxx  A sorted list containing pointers to the node: keys for leaf nodes only

A global node key (xxxx) is constructed from the Global name and its Subscripts.  They are flattened into
a singe string using Hex 01 as a delimiter.  For example the Global Node:

      rob("a","b","c")

would be represented as:

      rob\x01a\x01b\x01\c

In order to emulate the subscript collating order of Global Storage database, integer subscript values
are padded out with up to 9 leading zeros within the children:xxxx sorted lists.

The Lock and Unlock commands are emulated using the Redis Blocking Pop command BLPOP and use two additional 
simple keys:

- lock:xxxx  Representing the Global Node that is locked
- locker: xxxx  Representing the process locking the node


## License

The MIT License (MIT)

    Copyright (c) Alexey Kucherenko

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.    
