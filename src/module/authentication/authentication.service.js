import { ProviderEnum } from '../../common/enum/user.enum.js';
import { BadException, ConflictException,notFoundException } from '../../common/exceptions/error.exception.js';
import { compare, createLoginCredentials, decryption, encryption, hash } from '../../common/security/index.js';
import { WEB_CLIENT_IDS } from '../../config.js';
import { UserModel } from '../../DB/Model/user.model.js';
import { createOne, findOne } from './../../common/repository/index.js';
import {OAuth2Client} from 'google-auth-library';

export const signup = async({userName , email ,password ,phone,role})=>{
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
      phone: await encryption(phone),
      role
    }
  })
  // console.log("Role received from Postman:", account.role);
  return account
}

/*
{
  iss: 'https://accounts.google.com',
  azp: '356201383591-pdn5sqf30bs1jkdg99c6u8bi4vjjb9j5.apps.googleusercontent.com',
  aud: '356201383591-pdn5sqf30bs1jkdg99c6u8bi4vjjb9j5.apps.googleusercontent.com',
  sub: '106811964196685365534',
  email: 'shahedahmed2436@gmail.com',
  email_verified: true,
  nonce: 'not_provided',
  nbf: 1790421651,
  name: 'Shahed Ahmed',
  picture: 'https://lh3.googleusercontent.com/a/ACg8ocKvScfidIbasghC8lDMCMSMVf7UPI_9GicdcBP-jEVChRbwoQ=s96-c',
  given_name: 'Shahed',
  family_name: 'Ahmed',
  iat: 1790421951,
  exp: 1790425551,
  jti: 'e6a23c8276e89557ae799dccd7247e5fe42223ee'
}
*/

const client = new OAuth2Client();
async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: WEB_CLIENT_IDS,
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified) {
    throw BadException("Email not verified")
  }
  return payload

}

export const signupWithGmail = async({idToken} , issuer)=>{
  console.log(idToken);
  const {email , name , picture} = await verifyGoogleAccount(idToken)
  console.log({email , name , picture});
  const existAccount = await findOne({
    model:UserModel,
    filter:{email}
  })
  if (existAccount) {
    if (existAccount.provider != ProviderEnum.GOOGLE) {
      throw ConflictException("Invalid account provider")
    }
    return {status:200 , data:await createLoginCredentials({ user:existAccount , issuer})} ;
  }
  const user = await createOne({
    model:UserModel,
    data:{
      userName:name,
      email,
      confirmEmail: new Date(),
      provider: ProviderEnum.GOOGLE,
      image:picture
    }
  })
  return {status:201 , data:await createLoginCredentials({ user , issuer})} ;
}

export const login = async({email,password}, issuer)=>{
 const account = await findOne({
      model : UserModel,
      filter:{email , provider:ProviderEnum.SYSTEM},
    })
    if(!account) throw notFoundException("Not Exist")
    const match = await compare(password, account.password)
    if(!match) throw notFoundException("Not Exist")
    account.phone = await decryption(account.phone)
    return await createLoginCredentials({user:account , issuer})
}