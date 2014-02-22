# heartbeat-monitor [![Build Status](https://travis-ci.org/shakyShane/heartbeat-monitor.png?branch=master)](https://travis-ci.org/shakyShane/heartbeat-monitor)

Keep track of a collection of items that emit heartbeats. Think tracking connected clients with socket.io

## Usage
Install it locally to your project.

`sudo npm install -g heartbeat-monitor`

## Example
This example shows how you can track an array of items. It will check the registry for any items
 that have not emitted a heartbeat in the last second & remove the outdated ones. If you've ever
 tried to keep track of socket-connected clients with something like socket.io, you'll understand the
 need for this module.

```javascript
var monitor = require("heartbeat-monitor");
var registry = [];

monitor.watchRegistry(registry, 1000).on("item:add", function(){
    // Item added
}).on("item:removed", function(){
    // Item removed
}).on("item:updated", function(){
    // Item updated
});

// Imitate a reaction to a heartbeat every 800ms - adding it to the registry
setInterval(function(){
    monitor.addItem({id: 123});
}, 800);

```

**Note:** This was written to keep track of connected clients with [BrowserSync](https://github.com/shakyShane/browser-sync)
    - not tested at any kind of scale yet.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2013 Shane Osbourne
Licensed under the MIT license.
