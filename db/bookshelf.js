(function () {
    var config = require('../env')[process.env.NODE_ENV || 'development'];

    var dbConfig = {
        client: 'mysql',
        debug: config.DEBUG,
        connection: {
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME,
            charset: 'utf8'
        }
    };

    var knex = require('knex')(dbConfig);
    var bookshelf = require('bookshelf')(knex);
    module.exports = {
        bookshelf: bookshelf,
        knex: knex
    };
})();
