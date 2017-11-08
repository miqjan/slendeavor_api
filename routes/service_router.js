import express from 'express';
import ServiceModel from '../models/service_model';
import {MustBeSuperAdmin,MustBeSignin,NotMustBeSignin} from './user_router';
const router = express.Router();

router.get('/', async function(req, res, next) {  
    try {
        res.json(await ServiceModel.find({}));
    } catch (error) {
        return next(error);
    }
});
router.post('/', MustBeSuperAdmin, async function(req, res, next) {  
    try {
        req.checkBody('icon','Incorect url of verification').notEmpty();
        req.checkBody('pre_title','Incorect url of verification').notEmpty();
        req.checkBody('title','Incorect url of verification').notEmpty();
        req.checkBody('img','Incorect url of verification').notEmpty();
        req.checkBody('color','Incorect url of verification').notEmpty();
        await req.asyncValidationErrors();
        let inserted = new ServiceModel(req.body); 
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