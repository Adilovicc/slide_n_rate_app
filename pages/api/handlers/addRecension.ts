import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prismadb";



export default async function addRecension(req:NextApiRequest,res:NextApiResponse){
    const {grade,userId,postId} = req.body;
    try {
        const record= await prisma.recension.create({
              data:{
                  userId:userId,
                  postId:postId,
                  grade:Number(grade)
              }
          }).catch(err=>console.log(err))
       
          return res.status(200).json({message:'Post created'});
          
      } catch (error) {
          return res.status(500).json({message:'Something went wrong'});
      }
}