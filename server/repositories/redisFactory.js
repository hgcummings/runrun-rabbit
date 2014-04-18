'use strict';

module.exports.createClient = function() {
    if (process.env.REDIS_HOST) {
        // Production server
        return require('redis').createClient(
            process.env.REDIS_PORT,
            process.env.REDIS_HOST,
            {
                'auth_pass': process.env.REDIS_PASSWORD
            });
    } else {
        // Local server or test runner
        var mockRedis = require('node-redis-mock');
        var client = mockRedis.createClient();
        // node-redis-mock doesn't implement PERSIST yet...
        client.persist = function(key, callback) {
            if (key in mockRedis.storage) {
                delete mockRedis.storage[key].expires;
                callback(null, 1);
            } else {
                callback(null, 0);
            }
        };
        return client;
    }
};