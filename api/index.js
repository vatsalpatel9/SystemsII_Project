const express = require('express');
const router = express.Router();

router
    .use('/login', require('./login'))
    .use('/signup', require('./signup'))
    //.use('/users', require('./users/'));

module.exports = router;