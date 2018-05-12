'use strict';

var compression = require('compression');
var bodyParser = require('body-parser');
var cors = require('cors');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var appConfig = require('./app');

module.exports = function (app) {
    app.enable('trust proxy');
    var options = {
        origin: ['http://localhost:3001', 'http://localhost:3002'],
        credentials: true
    };
    app.use(cors(options));
    app.use(compression());
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(session({
        secret: appConfig.session.secrets,
        resave: false,
        saveUninitialized: false,
        store: new RedisStore({
            host: appConfig.redis.host,
            port: appConfig.redis.port,
            pass: appConfig.redis.password || ''
        }),
        cookie: appConfig.session.cookie
    }));
    app.use(passport.initialize());
};
