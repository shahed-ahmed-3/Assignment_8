import mongoose from "mongoose";
import { GenderEnum } from "../../common/enum/user.gender.js";

const userSchema = new mongoose.Schema(
    {
        firstName :{
            type:String,
            minLength:2,
            maxLength:25, 
            required:true
        },

        lastName :{
            type:String,
            minLength:2,
            maxLength:25, 
            required:true
        },

        email :{
            type:String,
            unique:true, 
            required:true
        },

        password :{
            type:String , 
            required:true
        },

        Phone : String,
        DOB: Date,
        confirmEmail : Date,
        image : String,
        coverImage:[String],

        gender :{
            type:Number,
            enum: Object.values(GenderEnum),
            default: GenderEnum.MALE
        }
    },
    {
        timestamps:true,
        toObject:{virtuals:true},
        toJSON:{virtuals:true},
        strict:true,
        strictQuery:true,
        autoIndex:true
    }
);

userSchema.virtual("userName").set(function(value){
    const [firstName , lastName] = value?.split(" ") || [] ;
    this.set({firstName,lastName})
}).get(function(){
    return `${this.firstName} ${this.lastName}`
})

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema)