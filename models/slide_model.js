import mongoose from 'mongoose'

class SlideSchema extends mongoose.Schema {
  constructor() {
    super({
        title: {type: String},
        body:{type:String},
        isview:{type : Boolean, default : false}
    })
  }
}

export default mongoose.model('SlideSchema', SlideSchema);