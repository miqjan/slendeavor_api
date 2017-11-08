import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let PartnerSchema = new Schema({
  img:{type:Buffer},
});
export default mongoose.model('PartnerSchema', PartnerSchema);