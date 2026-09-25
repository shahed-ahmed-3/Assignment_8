import { Router } from "express";
import { successResponse } from "../../common/utils/success.response.js";
import { profile, rotateToken, update } from "./user.service.js";
import { authentication, authorization } from "../../middleware/index.js";
import { RoleEnum, TokenTypeEnum } from "../../common/enum/index.js";
const router = Router()


router.get("/" ,authentication() , async(req,res,next)=>{
    const data = await profile(req.user)
    return successResponse({res,data})
})

router.patch("/" ,authentication(), authorization(RoleEnum.ADMIN) , async(req,res,next)=>{
    const data = await update(req.user , req.body)
    return successResponse({res,data})
})

router.post("/rotate-token" ,authentication(TokenTypeEnum.REFRESH) , async(req,res,next)=>{
    const data = await rotateToken(req.payload , req.user , `${req.protocol}://${req.host}`)
    return successResponse({res,data})
})

export default router