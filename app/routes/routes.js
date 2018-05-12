'use strict';
module.exports = function (app) {
    app.use('/admin', require('../api/admin/routes/route'));
    app.use('/', require('../api/web/routes/route'));
};
