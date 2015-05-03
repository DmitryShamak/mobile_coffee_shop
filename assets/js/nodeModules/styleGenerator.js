var less = require("less");
var Promise = require("bluebird");
var fs = require("fs");

var getCssFromLess = function () {
    var responder = Promise.pending();

    fs.readFile('./assets/styles/style.less', function (err, data) {
        if (err) {
            return responder.reject(err);
        }

        less.render(data.toString(), function (err, output) {
            if (err) {
                console.log(err);
                return responder.resolve(null);
            }

            responder.resolve(output.css);
        });
    });

    return responder.promise;
};

var saveToCss = function (less) {
    fs.open('./assets/styles/style.css', "w", function (err, fd) {
        if (err) {
            return console.log("Open error", err);
        }
        less = less[0];

        if (!less) {
            fs.close(fd, function () {
                console.log("CSS file empty");
            });
        } else {
            var buffer = new Buffer(less);
            var offset = 0;
            var length = buffer.length;

            fs.write(fd, buffer, offset, length, 0, function (err, written, string) {
                fs.close(fd, function () {
                    console.log("CSS file generated");
                });
            });
        }
    });
};

var generate = function () {
    Promise.all([
		getCssFromLess()
    ]).then(saveToCss);
};

module.exports.generate = generate;