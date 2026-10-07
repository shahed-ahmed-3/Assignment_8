import { Router } from "express";
import { successResponse } from "../../common/utils/success.response.js";
import { confirmEmail, login, requestForgotPasswordCode, resendConfirmEmail, resetForgetPassword, signup, signupWithGmail, verifyForgetPasswordCode } from "./authentication.service.js";
import * as validators from './authentication.validation.js'
import { validation } from "../../middleware/index.js";
const router = Router();

router.post("/signup" ,validation(validators.signup), async(req,res,next)=>{
    const data = await signup(req.body)
    return successResponse({res , status:201 , data})
})

router.patch("/confirm-email" ,validation(validators.confirmEmail), async(req,res,next)=>{
    const data = await confirmEmail(req.body)
    return successResponse({res , status:200 , data})
})

router.patch("/resend-confirm-email" ,validation(validators.resendConfirmEmail), async(req,res,next)=>{
    const data = await resendConfirmEmail(req.body)
    return successResponse({res , status:200 , data})
})

router.post("/request-forgot-password-code" ,validation(validators.requestForgotPassword), async(req,res,next)=>{
    const data = await requestForgotPasswordCode(req.body)
    return successResponse({res , status:201 , data})
})

router.post("/verify-forgot-password" ,validation(validators.confirmEmail), async(req,res,next)=>{
    const data = await verifyForgetPasswordCode(req.body)
    return successResponse({res , status:200 , data})
})

router.patch("/reset-forgot-password" ,validation(validators.resetForgetPassword), async(req,res,next)=>{
    const data = await resetForgetPassword(req.body)
    return successResponse({res , status:200 , data})
})

router.post("/singup-with-gmail", async (req, res, next) => {
    const {status , data} = await signupWithGmail(req.body ,`${req.protocol}://${req.host}`);
    return successResponse({ res, status, data });
});

router.post("/login" , validation(validators.login), async(req,res,next)=>{
    const data = await login(req.validate.body,`${req.protocol}://${req.host}`)
    return successResponse({res , data})
})

export default router;