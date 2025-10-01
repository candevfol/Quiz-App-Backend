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
const logout_user = async(jwt) => {
  const authenticated_user = await prisma.authentication.findFirst({
    where: {
        jwt,
        isValid: true
    }
  })

  if(!authenticated_user) return {success: false, message: "Cookie not found/User isn't authenticated!"};

  await prisma.authentication.update({
    where: {
        jwt: authenticated_user.jwt
    },
    data: {
        isValid: false
    }
  })
  return {success: true, message: "User logged out successfully"}
}

const get_score = async(token) => {
  const username = jwt.verify(token, process.env.JWT_SECRET).username;
  const score_found = await prisma.user.findUnique({
    select:{
      score:true
    },
    where: {
        username
    }
  });
  return {data:score_found}
}

const get_rank = async (token) => {
  const username = jwt.verify(token, process.env.JWT_SECRET).username;

  const result = await prisma.$queryRaw`
  SELECT u1.username,
         COUNT(u2.id) + 1 AS rank
  FROM "User" u1
  LEFT JOIN "User" u2
    ON u2.score > u1.score
  WHERE u1.username = ${username}
  GROUP BY u1.username;
`;
const rank = Number(result[0].rank);
return {data: rank}

}

export {register_user, logout_user, get_score, get_rank}