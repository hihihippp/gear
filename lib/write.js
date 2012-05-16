var fs = require('fs');

/**
 * Write the last object in the object chain.
 *
 * @param options {Object} Write task options.
 * @param options.filename {String} Filename to write.
 * @param objects {Array} Object chain.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.write = {
    fn: function(options, objects, logger, callback) {
        var filename = options.filename;

        function writeFile(filename, content) {
            fs.writeFile(filename, content, function(err) {
                callback(err, objects);
            });
        }

        if (objects.length) {
            writeFile(filename, objects[objects.length - 1].content);
        }
        else {
            callback(null, objects);
        }
    }
};