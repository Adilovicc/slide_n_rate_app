import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";



export default async function deleteUser(req:NextApiRequest,res:NextApiResponse){
    const {id} = req.body;
  

    try {
      const record= await prisma.user.delete({
            where:{
                id:id
            }
        })
     
        return res.status(200).json({message:'User deleted'});
        
    } catch (error) {
        return res.status(500).json({message:'Something went wrong'});
    }
}

