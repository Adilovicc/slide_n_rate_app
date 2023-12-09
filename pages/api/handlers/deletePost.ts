import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]"
import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import { decode } from "next-auth/jwt";


export default async function deletePost(req:NextApiRequest,res:NextApiResponse){
    const {postId, examId} = req.body;
    const token = req.cookies['next-auth.session-token']

   
    if(token){
      try { 
       const decoded = await decode({
        token: token,
        secret:process.env.JWT_SECRET || 'nn',
       })
       const isAdmin = await prisma.user.findUnique({
        where:{
            id:decoded?.sub,
        }
       });
       if(isAdmin && isAdmin.role !== 'admin') return res.status(500).json({message:'You do not have permission for this operation!'});
      }
      catch(err){
        console.log(err);
        return res.status(500).json({message:'Something went wrong!'});
      }
    }
    else{
        return res.status(500).json({message:'You should login first!'});
    }
    
     
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


