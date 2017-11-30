import express from 'express';
import fs from 'fs';
import path from 'path';
import {MustBeSuperAdmin,MustBeSignin,NotMustBeSignin} from './user_router';

const router = express.Router();

router.get('/', async function(req, res, next) { 
    try{
        let images = fs.readdirSync(path.join(__dirname,'../','public','images'));
        res.json(images);
    } catch (error) {
        return next(error);
    } 
});
router.post('/', MustBeSuperAdmin, async function(req, res, next) { 
    let regex = /^data:.+\/(.+);base64,(.*)$/;
    try {
        req.checkBody('name','Incorect name of file').notEmpty();
        req.checkBody('data','Incorect data of file').notEmpty();
        await req.asyncValidationErrors();
        let matches = req.body.data.match(regex);
        let ext = matches[1];
        let data = matches[2];
        let buffer = new Buffer(data, 'base64');
        
  
        fs.writeFileSync(path.join(__dirname , '../' , 'public','images' , req.body.name), buffer);
        let images = fs.readdirSync(path.join(__dirname,'../','public','images').toString());
        res.json(images);
    } catch (error) {
        return next(error);
    } 
});

router.post('/delate', MustBeSuperAdmin , async function(req,res,next){
    try {
        req.checkBody('name','Incorect name of file').notEmpty();
        await req.asyncValidationErrors();
        fs.unlinkSync(path.join(__dirname,'../','public','images', req.body.name));
        let images = fs.readdirSync(path.join(__dirname,'../','public','images'));
        res.json(images);
    } catch (error) {
        return next(error);
    }
   
});

export default router;