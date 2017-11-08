import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let GallerySchema = new Schema({
  title: {type: String},
  info:{type:Array, default: null},//title,text
  site_url:{type: String},
  text:{type: String},
  video:{type:String},
  img:{type:String},
  img_hover:{type:Buffer},
  site:{type:String}
});
export default mongoose.model('GallerySchema', GallerySchema);