import prisma from "@/lib/prismadb";
import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "next-auth/jwt";




export default async function deleteExam(req: NextApiRequest, res:NextApiResponse){
     const { examId } = req.body;
     /*
     const token = req.cookies['next-auth.session-token']


     if (token) {
          try {
               const decoded = await decode({
                    token: token,
                    secret: process.env.JWT_SECRET || 'nn',
               })
               const isAdmin = await prisma.user.findUnique({
                    where: {
                         id: decoded?.sub,
                    }
               });
               if (isAdmin && isAdmin.role !== 'admin') return res.status(500).json({ message: 'You do not have permission for this operation!' });
          }
          catch (err) {
               console.log(err);
               return res.status(500).json({ message: 'Something went wrong!' });
          }
     }
     else {
          return res.status(500).json({ message: 'You should login first!' });
     }
     */
    
     try {
          const result = await prisma.exam.delete({
               where: {
                    id: examId,
               }
          })

          if (result) return res.status(200).json({ message: "Success" });
     } catch (error) {
          return res.status(200).json({ message: "Error" });
     }

}