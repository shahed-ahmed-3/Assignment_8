import jwt from 'jsonwebtoken';
import { UserModel } from '../../DB/Model/user.model.js';
import { findById, findByIdAndUpdate } from '../../common/repository/db.repository.js';
import { createLoginCredentials, verifyToken } from '../../common/security/index.js';
import { ACCESS_TOKEN_EXPIRES_IN } from '../../config.js';
import { ConflictException } from '../../common/exceptions/error.exception.js';

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
    return await createLoginCredentials({user , issuer})
}
