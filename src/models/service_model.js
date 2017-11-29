import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ServiceSchema = new Schema({
    icon: {type: String},
    pre_title: {type: String},
    title: {type: String},
    text: {type: String},
    img: {type: String},
    color: {type: String}
});
export default mongoose.model('ServiceSchema', ServiceSchema);