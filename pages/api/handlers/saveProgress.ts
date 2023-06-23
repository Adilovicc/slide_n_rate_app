import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";


export default async function saveProgress(req:NextApiRequest,res:NextApiResponse){
    const {currentPost, userId} = req.body;

    try {
      const record= await prisma.user.update({
            where:{
                id:userId,
            },
            data:{
                currentPost:Number(currentPost)
            }
        })
     
        return res.status(200).json({message:'Progress saved'});
        
    } catch (error) {
        return res.status(500).json({message:'Stg went wrong'});
    }
}