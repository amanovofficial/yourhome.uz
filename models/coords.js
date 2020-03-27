const {Schema,model}=require('mongoose')
const coord={
    ID:{
        type:String
    },
    latitude: {
        type:Number
    },
    longitude: {
        type:Number
    },
    hintContent:{
        type:String
    },
    balloonContent:{
        type:String
    }
}

module.exports=model('Coords',coord)