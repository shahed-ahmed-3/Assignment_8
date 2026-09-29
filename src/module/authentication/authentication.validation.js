import { z } from 'zod'
import { generalValidationFields } from '../../common/validation.js';


export const loginSchema = (lang)=>{
    return z.strictObject({
    email:generalValidationFields.email(lang),
    password:generalValidationFields.password(lang)
})
}

export const login = (lang)=>{
    return z.object({
    body:loginSchema(lang),
    query:z.strictObject({
        lang:z.enum(["ar","en"]).default("ar"),
        // darkMood:z.coerce.boolean()
        darkMood:z.stringbool({
            truthy:["true" , "1" , "yes"],
            falsy:["false" , "0" , "no"]
        })
    })
})
}

export const signup = (lang)=>{
    return z.object({
    body: loginSchema(lang).safeExtend({
    userName:generalValidationFields.userName(lang),
    phone:generalValidationFields.phone(lang),
    confirmPassword:generalValidationFields.password(lang),
    gender:generalValidationFields.gender(lang)
}).superRefine((data , ctx)=>{
    console.log({data , ctx});

    generalValidationFields.matchFields({original:"password" , copy:"confirmPassword" , data , ctx ,lang})

        if (!data.userName.includes(" ")) {
        ctx.addIssue({
            code:"custom",
            path:['userName'],
            message:"userName must contain 2 parts"
        })
    }
})
})
}


// refine((data)=>{
//     console.log({data});
//     return data.password == data.confirmPassword
// },{message:"password mismatch with confirmPassword"})