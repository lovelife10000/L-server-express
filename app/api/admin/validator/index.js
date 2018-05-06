const { check } = require('express-validator/check');
module.exports={
    getDocs:[
        check('current')
            .exists()

          .withMessage('must be an email'),












    ]
}