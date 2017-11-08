import express from 'express';
import GalleryModel from '../models/gallery_model';
import {MustBeSuperAdmin,MustBeSignin,NotMustBeSignin} from './user_router';
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
        req.checkBody('info','Incorect url of verification').notEmpty();
        req.checkBody('site_url','Incorect url of verification').notEmpty();
        req.checkBody('video','Incorect url of verification').notEmpty();
        req.checkBody('img','Incorect url of verification').notEmpty();
        req.checkBody('img_hover','Incorect url of verification').notEmpty();
        req.checkBody('site','Incorect url of verification').notEmpty();
        await req.asyncValidationErrors();
        let inserted = new GalleryModel(req.body); 
        res.json( await inserted.save() );
    } catch (error) {
        return next(error);
    } 
});
router.post('/edit', MustBeSuperAdmin, async function(req, res, next) {  
    res.send('signup');
});
router.delete('/', MustBeSuperAdmin , async function(req,res,next){

});

export default router;