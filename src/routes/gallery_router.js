import express from 'express';
import GalleryModel from '../models/gallery_model';
import {MustBeSuperAdmin,MustBeSignin,NotMustBeSignin} from './user_router';
import nodemailer from 'nodemailer';
const router = express.Router();

router.get('/', async function(req, res, next) {  
    try {
        res.json(await GalleryModel.find({}));
    } catch (error) {
        return next(error);
    }
});
router.post('/', MustBeSuperAdmin, async function(req, res, next) {  
    try {
        
        req.checkBody('title','Incorect url of verification').notEmpty();
        //req.checkBody('info','Incorect url of verification').notEmpty();
        req.checkBody('site_url','Incorect url of verification').notEmpty();
        req.checkBody('video','Incorect url of verification').notEmpty();
        req.checkBody('img','Incorect url of verification').notEmpty();
        req.checkBody('img_hover','Incorect url of verification').notEmpty();
        req.checkBody('site','Incorect url of verification').notEmpty();
        await req.asyncValidationErrors();
     
        let inserted = new GalleryModel(req.body); 
        await inserted.save();
        res.json( await GalleryModel.find({}) );
    } catch (error) {
        return next(error);
    } 
});
router.post('/edit', MustBeSuperAdmin, async function(req, res, next) {  
    try {
        req.checkBody('title','Incorect url of verification').notEmpty();
        req.checkBody('info','Incorect url of verification').notEmpty();
        req.checkBody('site_url','Incorect url of verification').notEmpty();
        req.checkBody('video','Incorect url of verification').notEmpty();
        req.checkBody('img','Incorect url of verification').notEmpty();
        req.checkBody('img_hover','Incorect url of verification').notEmpty();
        req.checkBody('site','Incorect url of verification').notEmpty();
        await req.asyncValidationErrors();
       
        await GalleryModel.update(req.body).where({"_id":req.body._id});
        res.json(await GalleryModel.find({}));
    } catch (error) {
        return next(error);
    } 
});
router.post('/delate', MustBeSuperAdmin , async function(req,res,next){
    try {
        req.checkBody('row_arr','Incorect img verification').notEmpty();
        await req.asyncValidationErrors();
      
        await GalleryModel.remove({ _id: { $in: req.body.row_arr }});
        res.json(await GalleryModel.find({}));
    } catch (error) {
        return next(error);
    }
});


export default router;