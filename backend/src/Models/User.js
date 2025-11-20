import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    profileImage:{
        type:String,
        default:""
    },
    clerkId:{
        type:true,
        required:true,
        unique:true
    }
},{timeseries:true});

export default mongoose.model("User", userSchema);