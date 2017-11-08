import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let WorkSchema = new Schema({
    icon:{type:String},
    title:{type:String},
    text:{type:String}
});

export default mongoose.model('WorkSchema', WorkSchema);