import express from 'express';
import WorkModel from '../models/work_model';
import {MustBeSuperAdmin,MustBeSignin,NotMustBeSignin} from './user_router';
const router = express.Router();

router.get('/', async function(req, res, next) {  
   
});
router.post('/', MustBeSuperAdmin, async function(req, res, next) {  
    try {
        req.checkParams('icon','Incorect url of verification').notEmpty();
        req.checkParams('title','Incorect url of verification').notEmpty();
        req.checkParams('text','Incorect url of verification').notEmpty();
        await req.asyncValidationErrors();
        let inserted = new WorkModel(req.body); 
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