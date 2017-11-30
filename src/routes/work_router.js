import express from 'express';
import WorkModel from '../models/work_model';
import {MustBeSuperAdmin,MustBeSignin,NotMustBeSignin} from './user_router';
const router = express.Router();

router.get('/', async function(req, res, next) {  
    try {
        res.json(await WorkModel.find({}));
    } catch (error) {
        return next(error);
    }
    
});
router.post('/', MustBeSuperAdmin, async function(req, res, next) {  
    try {
        req.checkBody('icon','Incorect url of verification').notEmpty();
        req.checkBody('title','Incorect url of verification').notEmpty();
        req.checkBody('text','Incorect url of verification').notEmpty();
        await req.asyncValidationErrors();
        let inserted = new WorkModel(req.body); 
        await inserted.save();
        res.json(await WorkModel.find({}));
    } catch (error) {
        return next(error);
    } 
});
router.post('/edit', MustBeSuperAdmin, async function(req, res, next) {  
    try {
        req.checkBody('icon','Incorect url of verification').notEmpty();
        req.checkBody('title','Incorect url of verification').notEmpty();
        req.checkBody('text','Incorect url of verification').notEmpty();
        await req.asyncValidationErrors();
       
        await WorkModel.update(req.body).where({"_id":req.body._id});
        res.json(await WorkModel.find({}));
    } catch (error) {
        return next(error);
    } 
});
router.post('/delate', MustBeSuperAdmin , async function(req,res,next){
    try {
        req.checkBody('row_arr','Incorect img verification').notEmpty();
        await req.asyncValidationErrors();
        await WorkModel.remove({ _id: { $in: req.body.row_arr }});
        res.json(await WorkModel.find({}));
    } catch (error) {
        return next(error);
    }
});

export default router;