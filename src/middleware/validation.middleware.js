import { BadException } from "../common/exceptions/error.exception.js"


export const validation = (schema)=>{
    return (req,res,next)=>{
        const validationResalt = schema.safeParse(req.body)
            if (!validationResalt.success) {
                throw BadException("Validation Error" , validationResalt.error.issues)
            }
            req.validate = validationResalt.data
            next()
    }
}