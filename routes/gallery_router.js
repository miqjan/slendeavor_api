import express from 'express';
import GalleryModel from '../models/gallery_model';
import {MustBeSuperAdmin,MustBeSignin,NotMustBeSignin} from './user_router';
const router = express.Router();

router.get('/', async function(req, res, next) {  
    res.send('signin');
});
router.post('/', MustBeSuperAdmin, async function(req, res, next) {  
    try {
        req.checkParams('title','Incorect url of verification').notEmpty();
        req.checkParams('info','Incorect url of verification').notEmpty();
        req.checkParams('site_url','Incorect url of verification').notEmpty();
        req.checkParams('video','Incorect url of verification').notEmpty();
        req.checkParams('img','Incorect url of verification').notEmpty();
        req.checkParams('img_hover','Incorect url of verification').notEmpty();
        req.checkParams('site','Incorect url of verification').notEmpty();
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