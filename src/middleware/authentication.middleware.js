import { TokenTypeEnum } from "../common/enum/index.js"
import { ForbiddenException, UnauthorizedException } from "../common/exceptions/error.exception.js"
import { decodeToken } from "../common/security/index.js"


export const authentication  = (tokenType=TokenTypeEnum.ACCESS)=>{
    return async (req,res,next)=>{
    const {authorization} = req.headers
    if (!authorization) {
        throw UnauthorizedException("Unauthorized account")
    }

    const {user , payload} = await decodeToken({authorization , tokenType})
    req.user = user
    req.payload = payload
    next()
}
}

export const authorization  = (accessRole)=>{
    return async (req,res,next)=>{
    if (req.user.role < accessRole) {
        throw ForbiddenException("Forbidden account")
    }
    next()
}
}