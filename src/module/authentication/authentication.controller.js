import { Router } from "express";
import { successResponse } from "../../common/utils/success.response.js";
import { login, signup, signupWithGmail } from "./authentication.service.js";
const router = Router();

router.post("/signup" , async(req,res,next)=>{
    const data = await signup(req.body)
    return successResponse({res , status:201 , data})
})

router.post("/singup-with-gmail", async (req, res, next) => {
    const {status , data} = await signupWithGmail(req.body ,`${req.protocol}://${req.host}`);
    return successResponse({ res, status, data });
});

router.post("/login" , async(req,res,next)=>{
    const data = await login(req.body,`${req.protocol}://${req.host}`)
    return successResponse({res , data})
})

export default router;