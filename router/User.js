import express from "express";
import { login_schema } from "../utils/Schema.Zod.js";
import { register_user } from "../service/UserService.js";

const userRouter = express.Router();

userRouter.post('/login', async(req, res, next) => {
    const validataionResult = login_schema.safeParse(req.body);
    if(!validataionResult.success){
        const errorMessages = validataionResult.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
        }));
        return res.bad_request("Validation failed", errorMessages);
    }

    try{
        const user = await register_user(req.body);
        if(!user.success){
            return res.not_found(user.message);
        }
        res.cookie("token", user.data.token);
        return res.created(`User Registered Successfully`, user.data);
        
    }
    catch(err){
        next(err)
    }
})


export default userRouter;