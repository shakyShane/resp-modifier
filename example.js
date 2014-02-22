var watcher = require("./index");

var items = [];

watcher.watchRegistry(items, 1000).on("item:add", function (item) {
    console.log("ADDED");
}).on("item:removed" ,function () {
    console.log("REMOVED");
}).on("item:updated", function () {
    console.log("UPDATED");
});

setInterval(function () {
    watcher.addItem(items, {id: 123});
}, 900);
