import jwt from 'jsonwebtoken';
import { UserModel } from '../../DB/Model/user.model.js';
import { findById, findByIdAndUpdate } from '../../common/repository/db.repository.js';
import { createLoginCredentials, createRevokeToken, userBaseRevokeTokenKey, userRevokeTokenKey, verifyToken } from '../../common/security/index.js';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../../config.js';
import { ConflictException } from '../../common/exceptions/error.exception.js';
import { del, keys, set } from './../../common/services/index.js';
import { LogoutEnum } from '../../common/enum/security.enum.js';

export const profile = async(account)=>{
    return account
}

export const update = async(user , data)=>{
    const account = await findByIdAndUpdate({
        model:UserModel , 
        id:user._id,
        update: data
    })
    return account
}

export const rotateToken = async(payload , user , issuer)=>{
    const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN)*1000
    const currentTime = Date.now() + (5*60000)
    if (currentTime < accessExpiresIn) {
        throw ConflictException("Sorry we cannot create new login credentials while current access token still within valid time range")
    }
    const data = await createLoginCredentials({user , issuer})
    await createRevokeToken({payload})
    return data
}

export const logout = async(payload , user , {action = LogoutEnum.DEVICE})=>{
    console.log({user});
    
    switch (action) {
        case LogoutEnum.ALL:
            user.changeCredentialTime = new Date()
            await user.save()
            await del({key: await keys({prefix : userBaseRevokeTokenKey({userId:payload.sub})})})
            break;
        default:
            await createRevokeToken({payload})
            break;
    }
    return 
}
