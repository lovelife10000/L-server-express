'use strict';


module.exports = {
    domain: 'http://localhost',

    mongo: {
        uri: 'mongodb://localhost/blog'
    },

    redis: {
        db: 0
    },
    seedDB: true,
    session: {
        cookie: {maxAge: 60000 * 30}
    }
};

