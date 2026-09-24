import { ConflictException,notFoundException } from '../../common/exceptions/error.exception.js';
import { compare, decryption, encryption, hash } from '../../common/security/index.js';
import { UserModel } from '../../DB/Model/user.model.js';
import { createOne, findOne } from './../../common/repository/index.js';

export const signup = async({userName , email ,password ,phone})=>{
    const duplicatedAccount = await findOne({
      model : UserModel,
      filter:{email},
      options:{select:"email" }
    })
    if(duplicatedAccount) throw ConflictException("Email Exist")
      const account = await createOne({
    model : UserModel,
    data:{
      userName , 
      email ,
      password : await hash(password),
      phone: await encryption(phone)
    }
  })
  return account
}

export const login = async({email,password})=>{
 const account = await findOne({
      model : UserModel,
      filter:{email},
    })
    if(!account) throw notFoundException("Not Exist")
    const match = await compare(password, account.password)
    if(!match) throw notFoundException("Not Exist")
    account.phone = await decryption(account.phone)
  return account
}