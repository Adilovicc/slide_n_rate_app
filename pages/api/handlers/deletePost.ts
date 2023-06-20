import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";



export default async function deletePost(req:NextApiRequest,res:NextApiResponse){
    const {postId} = req.body;
  

    try {
      const record= await prisma.post.delete({
            where:{
                id:postId
            }
        })
     
        return res.status(200).json({message:'Post deleted'});
        
    } catch (error) {
        return res.status(500).json({message:'Something went wrong'});
    }
}


