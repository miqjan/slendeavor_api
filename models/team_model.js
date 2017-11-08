import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let TeamSchema = new Schema({
  img:{type:Buffer},
  info:{type:String},
  name:{type:String}
});
export default mongoose.model('TeamSchema', TeamSchema);