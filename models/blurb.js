const {Schema,model}=require('mongoose')
const mongoosePaginate=require('mongoose-paginate-v2')

const blurb=new Schema({
  ID:{
    type:String,
    required:true
  },
photoURL:[],
region: {
    type:String,
    required:true
},
refPoint:{
    type:String,
    required:true
},
  room: {
    type:String,
    required:true
},
  conditioner:{
    type:String,
    default:'нет'
} ,
washMachine:{
    type:String,
    default:'нет'
},
  internet:{
    type:String,
    default:'нет'
} ,
furniture:{
  type:String,
  default:'нет'
} ,
tv:{
  type:String,
  default:'нет'
},
microwaveOven:{
  type:String,
  default:'нет'
},
  typePlanLavatory: {
    type:String,
    required:true
},
  typePlanRooms: {
    type:String,
    required:true
} ,
  floor:  {
    type:Number,
    required:true
},
  numberOfStoreys: {
    type:Number,
    required:true
},
  cost: {
    type:Number,
    required:true
} ,
  currency: {
    type:String,
    required:true
} ,
  name:  {
    type:String,
    required:true
},
  telephone: {
    type:String,
    required:true
} ,
  isStudent: {
    type:String,
    required:true
} ,
commission:{
    type:Number,
    required:true,
    default:0
}
,
  registration:  {
    type:String,
    required:true,
    default:'нет'
},
  additionalInfo: 
  {
    type:String
},
userID:{
  type:Schema.Types.ObjectId,
  required:true
},
date:{
  type:Date,
  default:Date.now
}

})
blurb.plugin(mongoosePaginate)

module.exports=model('Blurb',blurb)