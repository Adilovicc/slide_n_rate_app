import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";
import { PrismaClient } from "@prisma/client";


export default async function PublishPost(req:NextApiRequest,res:NextApiResponse){
    const {imageUrl, session} = req.body;
    const sess = JSON.parse(session);
  
    if(!sess){
        return res.status(500).json({message:'Something went wrong'});
    }
    const user = await prisma.user.findUnique({
        where:{
            email: sess.data.user.email
        }
    })
    if(!user) return res.status(500);

    try {
      const record= await prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                image:String(imageUrl),
            }
        })
     
        return res.status(200).json(record);
        
    } catch (error) {
        return res.status(500).json({message:'Something went wrong'});
    }
}