import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

import nodemailer_config from '../config/nodemailer';
const Schema = mongoose.Schema;
const transporter = nodemailer.createTransport({service: nodemailer_config.service,
	auth: nodemailer_config.auth
});
function message (email,temp,id) {
	return {
		from: 'Sender Name <miqjan@yandex.com>',
		to: `Recipient <${email}>`,
		subject: 'Verification Email ✔',
		//text: `http://localhost:3000/verif/email/${temp}`,
		html: `<a href='http://localhost:3000/user/activ/${id}/${temp}'>Url of verification :</a>
		<p>http://localhost:3000/user/activ/${id}/${temp} work time 24 hour</p>`
	}
};

let UserSchema = new Schema({
	firstname: {type: String},
	lastname: {type: String},
	email: {type: String},
	phone: {type: String},
	createat: {type: Date, default: Date.now},
	status: {type: Boolean, default: false},
	type: {type:Number, default: 0},
	password: {type: String},
	qnfirmkey: {type: String},
	rememberkey: {type: String, default: ''},
	removed: {type: Boolean, default: false}
});
let UserConstruct = mongoose.model('UserSchema', UserSchema);

UserConstruct.prototype.InsertUser = async function(){
	try {
		if(!_.isEmpty(await UserConstruct.findOne({email:this.email}))){
			throw new Error('This email alredy exist');
			return false;
		}
		this.password = crypto.createHash('sha1').update(this.password).digest("hex");
		this.qnfirmkey = crypto.createHash('sha1').update(this.email).digest("hex");
		let user = (await this.save()).toObject();
		let usertemp = {
			_id:user._id,
			firstname:user.firstname,
			lastname:user.lastname,
			email:user.email,
			phone:user.phone,
			removed:user.removed,
			type:user.type,
			status:user.status
		}
		return {
			user: usertemp
			//message: await transporter.sendMail(message(this.email,this.qnfirmkey,this._id))
		};
	} catch (error) {
		throw error;
		return false;
	}
};
UserConstruct.prototype.Activate = async function(id,qnfirmkey){
	try {
		let temp = await UserConstruct.findOne({_id:id});
		if(!_.isEmpty(temp)){
			if(temp.qnfirmkey === qnfirmkey){
				return await UserConstruct.findByIdAndUpdate({_id:id},{qnfirmkey:null,status : true});
			} else {
				throw new Error('Incorect Activate kay');
				return false;
			}
		} else {
			throw new Error('Incorect Activate kay');
			return false;
		}
	} catch (error) {
		throw error;
		return false;
	}
};
UserConstruct.prototype.Signin = async function(email,password,remember = false){
	try {
		let temp = await UserConstruct.findOne({email:email});
		if(!_.isEmpty(temp)){
			if(!temp.status){
				throw new Error('You mast activate your email');
				return false;
			}
			if(temp.removed){
				throw new Error('Administarator of site block you');
				return false;
			}
			if(temp.password === crypto.createHash('sha1').update(password).digest("hex")){
				let token = '';
				if(remember){
					token = jwt.sign({id: temp.id,email: temp.email},'password sicret key edulik',{
						expiresIn : 60*60*24
					});
				} else {
					token = jwt.sign({id: temp.id,email: temp.email},'password sicret key edulik',{
						expiresIn :  "7d"
					});
				}
				return {token:token};
			} else {
				throw new Error('Invalid password');
				return false;
			}
		} else {
			throw new Error('Invalid email');
			return false;
		}
	} catch (error) {
		throw error;
		return false;
	}
};
UserConstruct.prototype.IsSignin = async function (token){
	try {
		let decoded = jwt.verify(token, 'password sicret key edulik');
		let user = await UserConstruct.findById(decoded.id)
		.select(['firstname','lastname','email','phone','type','removed','status']);
		if(!_.isEmpty(user)){
			if(user.removed){
				throw new Error('Administarator of site block you');
				return false;
			}
			return {user : user};
		} else {
			throw new Error('Incorect token');
			return false;
		}
	} catch(err) {
		throw err;
		return false;
	}
};
export default UserConstruct;
