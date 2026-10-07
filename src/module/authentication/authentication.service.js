import { ProviderEnum,EmailSubjectEnum } from '../../common/enum/index.js';
import { BadException, ConflictException,notFoundException, TooManyRequestException } from '../../common/exceptions/error.exception.js';
import { compare, createLoginCredentials, decryption, encryption, hash, userBaseRevokeTokenKey } from '../../common/security/index.js';
import { del, expire, get, incrBy, keys, set, ttl } from '../../common/services/cache.service.js';
import { createOtp, emailEvent, UserEmailKey, UserEmailTrialsKey } from '../../common/utils/index.js';
import { WEB_CLIENT_IDS } from '../../config.js';
import { UserModel } from '../../DB/Model/user.model.js';
import { createOne, findOne } from './../../common/repository/index.js';
import {OAuth2Client} from 'google-auth-library';

const sendEmailOtp = async({email , subject , expiresIn = 120 , maxTrials=3 , blockInSeconds = 300 })=>{
  const existOTP_Ttl = await ttl({key:UserEmailKey({email , subject})})
  if (existOTP_Ttl>0) {
    throw ConflictException(`Sorry we cannot create new otp while existing one still valid please try again later after ${existOTP_Ttl}s`)
  }
  const oldTrials = await get({key:UserEmailTrialsKey({email , subject})})??0
  if (oldTrials >= maxTrials) {
    throw TooManyRequestException('Max otp trials has been reached')
  }

  const code = createOtp()
  await set({
    key:UserEmailKey({email , subject}),
    value:await hash(code.toString()),
    ttl:expiresIn
  })
  const currentTrials = await incrBy({key:UserEmailTrialsKey({email , subject})})
  if (currentTrials == 3) {
    await expire({key:UserEmailTrialsKey({email , subject}) , ttl:blockInSeconds})
  }
  emailEvent.emit("sendEmail" , {recipients:{to:email} , subject:subject , data:{code}})
}

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
      provider: ProviderEnum.SYSTEM,
      role
    }
  })
  console.log("AFTER SAVE HASH IN DB:", account.password);
  await sendEmailOtp({email , subject:EmailSubjectEnum.CONFIRM_EMAIL})
  return account
}

export const confirmEmail = async({otp , email})=>{
    const account = await findOne({
      model : UserModel,
      filter:{
        email , 
        provider: ProviderEnum.SYSTEM,
        confirmEmail:{$exists:false}
      },
      options:{select:"email" }
    })
    if(!account) throw notFoundException("Invalid account")
      const hashOtp = await get({key: UserEmailKey({email , subject:EmailSubjectEnum.CONFIRM_EMAIL})})
    if (!hashOtp || !await compare(otp , hashOtp)) {
      throw ConflictException("Invalid otp")
    }

    account.confirmEmail = new Date()
    await account.save()
    await del({key: await keys({prefix:UserEmailKey({email , subject:EmailSubjectEnum.CONFIRM_EMAIL})})})
    return
}

export const resendConfirmEmail = async({email})=>{
    const account = await findOne({
      model : UserModel,
      filter:{
        email , 
        provider: ProviderEnum.SYSTEM,
        confirmEmail:{$exists:false}
      },
      options:{select:"email" }
    })
    if(!account) throw notFoundException("Invalid account")

    await sendEmailOtp({email , subject:EmailSubjectEnum.CONFIRM_EMAIL})
    
    return
}

export const requestForgotPasswordCode = async({email})=>{
    const account = await findOne({
      model : UserModel,
      filter:{
        email , 
        provider: ProviderEnum.SYSTEM,
        confirmEmail:{$exists:true}
      },
      options:{select:"email" }
    })
    if(!account) throw notFoundException("Invalid account")

    await sendEmailOtp({email , subject:EmailSubjectEnum.FORGOT_PASSWORD})
    
    return
}

export const verifyForgetPasswordCode = async({otp , email})=>{
    const account = await findOne({
      model : UserModel,
      filter:{
        email , 
        provider: ProviderEnum.SYSTEM,
        confirmEmail:{$exists:true}
      },
      options:{select:"email" }
    })
    if(!account) throw notFoundException("Invalid account")
      const hashOtp = await get({key: UserEmailKey({email , subject:EmailSubjectEnum.FORGOT_PASSWORD})})
    if (!hashOtp || !await compare(otp , hashOtp)) {
      throw ConflictException("Invalid otp")
    }
    return account ;
}

export const resetForgetPassword = async({otp , email , password})=>{
    const account = await verifyForgetPasswordCode({email , otp})
    account.password = await hash(password)
    account.changeCredentialsTime = new Date()
    await account.save()
    const result = await Promise.all([ 
      keys({prefix : userBaseRevokeTokenKey({userId:account._id})}) , 
      keys({prefix:UserEmailKey({email , subject:EmailSubjectEnum.FORGOT_PASSWORD})})
    ])
    await del({key: [...result[0] , ...result[1]] })
    return
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
      filter:{
        email , 
        provider: ProviderEnum.SYSTEM,
        confirmEmail:{$exists:true}
      },
    })
    console.log("LOGIN ACCOUNT RESULT:", account)
    if(!account) throw notFoundException("Not Exist")
    const match = await compare(password, account.password)
    if(!match) throw notFoundException("Invalid Password");
    account.phone = await decryption(account.phone)
    return await createLoginCredentials({user:account , issuer})
}