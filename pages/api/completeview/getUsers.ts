import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";
import { decode } from "next-auth/jwt";

export default async function getUsers(req:NextApiRequest, res:NextApiResponse){
    const {examId} = req.query;

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
        const records = await prisma.user.findMany({
                where:{
                    userExam:{
                        some:{
                            examId:String(examId)
                        }
                    }
                },
                
        })
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}