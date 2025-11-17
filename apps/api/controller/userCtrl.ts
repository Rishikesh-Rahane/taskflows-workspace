import { AuthRequest } from "../middlewares/authMiddleware";
import { AsyncHandler } from "./authController";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUsers: AsyncHandler = async (req: AuthRequest, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const users = await prisma.user.findMany();
        const responseObj = {
            ok: true,
            message: 'Users retrieved successfully',
            data: users
        };
        return res.status(200).json(responseObj);
} catch (error) {
    return res.status(500).json({ error: `${error.message}- Internal Server Error` });
}
}
