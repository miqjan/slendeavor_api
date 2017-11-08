import express from 'express';
import PartnerModel from '../models/partner_model';
import {MustBeSuperAdmin,MustBeSignin,NotMustBeSignin} from './user_router';
const router = express.Router();

router.get('/', async function(req, res, next) {  
    try {
        res.json((await PartnerModel.find({})));
    } catch (error) {
        return next(error);
    }
});
router.post('/', MustBeSuperAdmin, async function(req, res, next) {  
    try {
        
        req.checkBody('img','Incorect url of verification').notEmpty();
        await req.asyncValidationErrors();
        let inserted = new PartnerModel(req.body); 
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
