import express from 'express';
import TeamModel from '../models/team_model';
import {MustBeSuperAdmin,MustBeSignin,NotMustBeSignin} from './user_router';
const router = express.Router();

router.get('/', async function(req, res, next) {  
    try {
        res.json(await TeamModel.find({}));
    } catch (error) {
        return next(error);
    }
});
router.post('/', MustBeSuperAdmin, async function(req, res, next) {  
    try {
        req.checkBody('img','Incorect img verification').notEmpty();
        req.checkBody('info','Incorect info verification').notEmpty();
        req.checkBody('name','Incorect name verification').notEmpty();
        await req.asyncValidationErrors();
        let inserted = new TeamModel(req.body); 
        await inserted.save();
        res.json(await TeamModel.find({}));
    } catch (error) {
        return next(error);
    } 
});
router.post('/edit', MustBeSuperAdmin, async function(req, res, next) {  
    try {
        req.checkBody('img','Incorect img verification').notEmpty();
        req.checkBody('info','Incorect info verification').notEmpty();
        req.checkBody('name','Incorect name verification').notEmpty();
        req.checkBody('_id','Incorect name verification').notEmpty();
        await req.asyncValidationErrors();
       
        await TeamModel.update(req.body).where({"_id":req.body._id});
        res.json(await TeamModel.find({}));
    } catch (error) {
        return next(error);
    } 
});
router.post('/delate', MustBeSuperAdmin , async function(req,res,next){
    try {
        req.checkBody('row_arr','Incorect img verification').notEmpty();
        await req.asyncValidationErrors();
        console.dir(req.body);
        await TeamModel.remove({ _id: { $in: req.body.row_arr }});
        res.json(await TeamModel.find({}));
    } catch (error) {
        return next(error);
    }
});

export default router;