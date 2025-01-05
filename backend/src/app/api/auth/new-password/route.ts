import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        
        const {email, password, newPassword} = await req.json();

        if(!email || !password || !newPassword) {
            return NextResponse.json({statusCode: 400, message: 'Missing required parameters', status: false})
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if(!user) {
            return NextResponse.json({statusCode: 400, message: 'Invalid email', status: false})
        }

        // update the password
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: newPassword
            }
        });

        return NextResponse.json({statusCode: 200, message: 'Password changed successfully', status: true})
        
    } catch (error) {
        let customError = new Error('Something went wrong in changing password');

        if(error instanceof Error) {
            customError = error;
        }  

        return NextResponse.json({statusCode: 500, message: customError.message, status: false})
    }
}