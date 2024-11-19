import mongoose from 'mongoose';
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    cartData:{type:Object,
        default:{},
    },
    Addresses:{type:Array, default:[],
    },
    wishList:{type:Array, default:[],
    },

},{minimize:false,timestamps:true})

const userModel=mongoose.models.User || mongoose.model('user',userSchema);

export default userModel;