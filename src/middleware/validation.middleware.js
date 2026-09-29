import { LanguageEnum } from "../common/enum/security.enum.js"
import { BadException } from "../common/exceptions/error.exception.js"


export const validation = (schema)=>{
    return (req,res,next)=>{
        const lang = Number(req.headers["accept-language"] ?? LanguageEnum.EN);
        console.log({lang});
        
        const validationResalt = schema(lang).safeParse({
            body:req.body,
            query:req.query,
            params:req.params
        })
            if (!validationResalt.success) {
                throw BadException("Validation Error" , validationResalt.error.issues)
            }
            req.validate = validationResalt.data
            next()
    }
}