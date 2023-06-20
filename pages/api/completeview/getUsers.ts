import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prismadb";

export default async function getUsers(req:NextApiRequest, res:NextApiResponse){
     try {
        const records = await prisma.user.findMany({

        })
        return res.json(records);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred' });
    }
}