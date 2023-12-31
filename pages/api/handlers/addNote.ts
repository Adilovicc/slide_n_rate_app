import prisma from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";



export default async function addNote(req:NextApiRequest,res:NextApiResponse){
    const {text, examId, userId, postId, userEmail, currentPost} = req.body;
    const postName = 'Post'+String(currentPost);
    try {
         const result = await prisma.note.upsert({
            where:{
               userId_postId:{userId: userId, postId:postId}
            },
            create:{
                text:text,
                userId:userId,
                postId:postId,
                examId:examId,
                userEmail: userEmail,
                currentPost: currentPost,
                postName: postName
            },
            update:{
                text:text,
            }
         })
         if(result) return res.status(200).json({message:'Success'});

    } catch (error) {
        return res.status(500).json({message:'Error'});
    }
}