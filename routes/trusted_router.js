var express = require('express');
var router = express.Router();
router.use(function(req,res,next){
    next();
});
router.get('/signin', function(req, res, next) {  
    res.send('signin');
});
router.get('/signup', function(req, res, next) {  
    res.send('signup');
});

module.exports = router;