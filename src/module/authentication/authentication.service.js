import { ConflictException,notFoundException } from '../../common/exceptions/error.exception.js';
import { UserModel } from '../../DB/Model/user.model.js';
import { createOne, findOne } from './../../common/repository/index.js';

export const signup = async({userName , email ,password})=>{
    const duplicatedAccount = await findOne({
      model : UserModel,
      filter:{email},
      options:{select:"email" }
    })
    if(duplicatedAccount) throw ConflictException("Email Exist")
      const account = await createOne({
    model : UserModel,
    data:{userName , email ,password}
  })
  return account
}

export const login = async({email,password})=>{
 const account = await findOne({
      model : UserModel,
      filter:{email, password},
      options:{select:"-password" }
    })
    if(!account) throw notFoundException("Not Exist")
  return account
}