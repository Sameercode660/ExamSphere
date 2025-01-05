import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        
        const {email, password} = await req.json();

        if(!email || !password) {
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

        // check if password is correct
        if(user.password !== password) {
            return NextResponse.json({statusCode: 400, message: 'Invalid password', status: false})
        }

        return NextResponse.json({statusCode: 200, message: 'Login successful', status: true})

    }catch (error: unknown | Error) {
        let customError = new Error('Something went wrong in login');

        if(error instanceof Error) {
            customError = error;
        }

        return NextResponse.json({statusCode: 500, message: customError.message, status: false})
    }
}