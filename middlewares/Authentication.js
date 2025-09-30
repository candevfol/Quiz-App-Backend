import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const AuthenticationMiddleware = async (req, res, next) => {
    const jwt = req.cookies.token;
    if(!jwt){
        return res.unauthorised_error();
    }
    const isValid = await prisma.authentication.findFirst({
        where: {
            jwt,
            isValid: true
        }
    })
    if(!isValid){
        return res.unauthorised_error(`Sorry! Cookie is expired/invalid.Please login again!`);
    }
    next();
}

export default AuthenticationMiddleware 