import { Router } from "express";
import { successResponse } from "../../common/utils/success.response.js";
import { login, signup, signupWithGmail } from "./authentication.service.js";
import * as validators from './authentication.validation.js'
import { BadException } from "../../common/exceptions/error.exception.js";
import { validation } from "../../middleware/index.js";
const router = Router();

router.post("/signup" ,validation(validators.signup), async(req,res,next)=>{
    const data = await signup(req.body)
    return successResponse({res , status:201 , data})
})

router.post("/singup-with-gmail", async (req, res, next) => {
    const {status , data} = await signupWithGmail(req.body ,`${req.protocol}://${req.host}`);
    return successResponse({ res, status, data });
});

router.post("/login" , validation(validators.login), async(req,res,next)=>{
    const data = await login(req.validate,`${req.protocol}://${req.host}`)
    return successResponse({res , data})
})

export default router;