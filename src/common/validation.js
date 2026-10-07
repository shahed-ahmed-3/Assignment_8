import {z} from 'zod'
import { GenderEnum } from './enum/user.enum.js'
import { LanguageEnum } from './enum/security.enum.js'
import { validationMessage } from './validationMessage.js'



const getValidationMessage = (lang , code )=>{
    return lang == LanguageEnum.AR ?
        validationMessage[code].ar :  validationMessage[code].en
}

const matchFields = ({original , copy , data , ctx , lang})=>{
    if (data[original] != data[copy]) {
        ctx.addIssue({
            code:"custom",
            path:[copy],
            message: getValidationMessage(lang,304)
        })
    }
}

export const generalValidationFields = {
    email: (lang) => z.email({message: getValidationMessage(lang,202)}),
    otp:(lang) => z.string().regex(/^\d{6}$/ , {message:'Invalid Code'}),
    password: (lang) => z.string({message:getValidationMessage(lang,303)}).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    userName: (lang) => z.string().min(2 , {message: getValidationMessage(lang,102)}).max(30 , {message: getValidationMessage(lang,103)}),
    phone: (lang) => z.string({message: getValidationMessage(lang,402)}).regex(/^(00201|201|\+201|01)[0125][0-9]{8}$/),
    gender: (lang) => z.enum(GenderEnum),
    matchFields
}