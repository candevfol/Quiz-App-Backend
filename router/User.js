import express from "express";
import { login_schema } from "../utils/Schema.Zod.js";
import { get_rank, get_score, logout_user, register_user } from "../service/UserService.js";
import AuthenticationMiddleware from "../middlewares/Authentication.js";

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

userRouter.post('/logout', async(req, res, next) => {
    try{
        const jwt = req.cookies.token;
        const loggedOut = await logout_user(jwt);
        if(!loggedOut.success){
            return res.not_found(loggedOut.message);
        }
        return res.ok(loggedOut.message);
    }
    catch(err){
        next(err);
    }
})

userRouter.use(AuthenticationMiddleware);

userRouter.get('/score', async (req, res, next) => {
    try{
        const jwt = req.cookies.token;
        const score = await get_score(jwt);
        return res.ok("Score found", score.data);
    }
    catch(err){
        next(err);
    }
})

userRouter.get('/rank', async (req, res, next) => {
    try{
        const jwt = req.cookies.token;
        const score = await get_rank(jwt);
        return res.ok("Rank of the user found", score.data);
    }
    catch(err){
        next(err);
    }
})




export default userRouter;