import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let GallerySchema = new Schema({
  title: {type: String},
  info:{type:[{title:String, text:String}], default: null},
  site_url:{type: String},
  text:{type: String},
  video:{type:String},
  img:{type:String},
  img_hover:{type:String},
  site:{type:String}
});
export default mongoose.model('GallerySchema', GallerySchema);