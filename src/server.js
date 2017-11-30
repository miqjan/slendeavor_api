import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import validator  from 'express-validator';

import UserRouter, { checkAuthentication } from './routes/user_router';
import PartnerRouter from './routes/partner_router';
import GalleryRouter from './routes/gallery_router';
import ServiceRouter from './routes/service_router';
import TeamRouter from './routes/team_router';
import WorkRouter from './routes/work_router';
import ImageesRouter from './routes/imggallery_router';


let app = express();        
mongoose.Promise = global.Promise;
let conn = mongoose.connect('mongodb://root:root@ds127375.mlab.com:27375/slendeavor',{useMongoClient : true});
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', ()=>console.log('connected'));

app.set('port', process.env.PORT || 3000);


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(validator());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.static(path.join(__dirname,'../','public')));
app.use(checkAuthentication);
app.use('/work', WorkRouter);
app.use('/gallery', GalleryRouter);
app.use('/user', UserRouter);
app.use('/team', TeamRouter);
app.use('/service', ServiceRouter);
app.use('/partner', PartnerRouter);
app.use('/images',ImageesRouter);



app.use(function(req, res, next){
    res.status(404);
    res.send({ error: 'Not found' });
    return;
});
app.use(function(err, req, res, next){
    if(process.env.NODE_ENV !== "production"){
        console.log(err);
    }
    if (err instanceof Array){  
        res.status(err.status || 401);
        res.json({error: err[0].msg});
        return ;
    } 
    res.status(err.status || 500);
    res.send({ error: err.message });
    return;
});

// let listener = app.listen(app.get('port'),'192.168.0.56',function(){
//     console.log('Example app listening at http://%s:%s', listener.address().address, listener.address().port);
// });
let listener1 = app.listen(app.get('port'),function(){
    console.log('api listening at http://%s:%s', listener1.address().address, listener1.address().port); 
});
