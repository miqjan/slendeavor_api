import express from 'express';
import UserModel from '../models/user_model';
var router = express.Router();


router.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
router.use(checkAuthentication);
router.get('/issignin', MustBeSignin ,async function(req, res, next){  
    try {
        res.json(req.user);
    } catch (error) {
        return next(error);
    } 
});
router.post('/insert', MustBeSuperAdmin ,async function(req, res, next) { 
    
    try {
        req.checkBody('firstname', 'Firstname is required').notEmpty();
        req.checkBody('lastname', 'Lastname is required').notEmpty();
        req.checkBody('email', 'Email is required').isEmail();
        req.checkBody('phone','Phone is required').isMobilePhone('any');
        req.checkBody('type','Type is required').isNumeric();
        req.checkBody('password','Password is required').notEmpty();
        await req.asyncValidationErrors();
        
        let inserted = new UserModel({
            firstname: req.body.firstname,
            lastname : req.body.lastname,
            email    : req.body.email,
            phone    : req.body.phone,
            type     : req.body.type,
            password : req.body.password
        }); 
        
        res.json(await inserted.InsertUser());
    } catch (error) {
        return next(error);
    } 
});
router.get('/activ/:id/:mail', NotMustBeSignin ,async function(req, res, next){  
    try {
        req.checkParams('id','Incorect url of verification').notEmpty();
        req.checkParams('mail','Incorect url of verification').notEmpty();
        await req.asyncValidationErrors();
        res.json(await UserModel.prototype.Activate(req.params.id,req.params.mail));
    } catch (error) {
        return next(error);
    } 
});
router.get('/all/:activ',MustBeSuperAdmin ,async function (req,res,next){
    try {
        req.checkParams('activ','Incorect url').notEmpty();
        await req.asyncValidationErrors();
        let selected = null;
        if(req.params.activ === 'true'){
            selected =  UserModel.find({status: true,removed : false});
        } else if(req.params.activ === 'false'){
            selected =  UserModel.find({$or : [{status: false}, {removed: true}]});
        } else {
            selected =  UserModel.find();
        }
        selected = await selected.select(['firstname','lastname','email','phone','type','removed','status']);
        res.json(selected);
    } catch (error) {
        return next(error);
    } 
});
router.post('/signin',NotMustBeSignin ,async function (req, res, next) {  
    try {
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        let remeber = req.body.remeber || false;
        await req.asyncValidationErrors();
        res.json(await UserModel.prototype.Signin(req.body.email,req.body.password,remeber));
    } catch (error) {
        //when error is validation error in the server error middleware have an if(error instanse of Arrey)
        return next(error);
    }
});
router.post('/remove',MustBeSuperAdmin ,async function (req, res, next) {  
    try {
        req.checkBody('id', 'id is required').notEmpty();
        await req.asyncValidationErrors();
        if(req.body.id  == req.user._id){
            throw new Error('You can`t remove someself');
            return false;
        }
        res.json(await UserModel.findByIdAndUpdate({_id:req.body.id},{removed: true}));
    } catch (error) {
        //when error is validation error in the server error middleware have an if(error instanse of Arrey)
        return next(error);
    }
});
router.post('/update',MustBeSuperAdmin ,async function (req, res, next) {  
    try {
        req.checkBody('id', 'id is required').notEmpty();
        req.checkBody('firstname', 'First name is required ').notEmpty();
        req.checkBody('lastname','Last name is required').notEmpty();
        await req.asyncValidationErrors();
        
        if(req.body.idcdv  == req.user._id){
            throw new Error('You can`t update someself');
            return false;
        }
        res.json(await UserModel.findByIdAndUpdate({
            _id:req.body.id},{firstname: req.body.firstname,lastname: req.body.lastname}));
    } catch (error) {
        //when error is validation error in the server error middleware have an if(error instanse of Arrey)
        return next(error);
    }
});
module.exports = router;
async function checkAuthentication(req,res,next){
    try {
        let user = await UserModel.prototype.IsSignin(req.headers.authorization);
        user = user.user;
        if(user.type === 1){
            req.SuperAdmin = true;
        } else {
            req.SuperAdmin = false;
        }
        req.IsSignin = true;
        delete user.type;
        req.user = user;
        next();
    } catch (error) {
        req.user = null;
        req.IsSignin = false;
        req.SuperAdmin = false;
        next();
    }
}
function MustBeSignin(req,res,next){
    if(req.IsSignin){
        next();
    } else {
        next(new Error('you must signin'));
    } 
}
function MustBeSuperAdmin(req,res,next){
    if(req.IsSignin && req.SuperAdmin){
        next();
    } else {
        next(new Error('you must be Super Admin'));
    } 
}
function NotMustBeSignin(req,res,next){
    if(!req.IsSignin){
        next();
    } else {
        next(new Error('you are signin'));
    } 
}