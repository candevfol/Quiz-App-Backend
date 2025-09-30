import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();

const register_user = async (body) => {
    const alreadyExistingUser = await prisma.user.findUnique({
        where: { username: body.username },
      });
      let user = alreadyExistingUser;
      if(alreadyExistingUser){
        const match = await bcrypt.compare(body.password, alreadyExistingUser.password);
        if(!match)return {success:false, message:`Username doesn't matched the password.Either Password is incorrect or Username already exists`};
      }
      else{
        const hashedPassword = await bcrypt.hash(body.password, 10);
        user = await prisma.user.create({
          data: {
            username: body.username,
            password: hashedPassword,
          },
        });
      }

      const token = jwt.sign({username:body.username}, process.env.JWT_SECRET);
        await prisma.authentication.create({
            data:{
                userId:user.id,
                jwt: token,
                isValid: true
            }
        })

        return {success:true, data: {userId:user.id,token:token}}
}

export {register_user}