import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";



export default async function deletePost(req:NextApiRequest,res:NextApiResponse){
    const {postId, examId} = req.body;
  

    try {
      const record= await prisma.post.delete({
            where:{
                id:postId
            }
        })
        if(record) await prisma.exam.update({
            where:{
                id:examId,
            },
            data:{
                postsTotal:{
                    decrement:1
                }
            }
        })
     
        return res.status(200).json({message:'Post deleted'});
        
    } catch (error) {
        return res.status(500).json({message:'Something went wrong'});
    }
}


