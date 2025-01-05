import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        
        const {userId, otp} = await req.json();

        if(!userId || !otp) {
            return NextResponse.json({statusCode: 400, message: 'Missing required parameters', status: false})
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
                otp: otp
            }
        });

        if(!user) {
            return NextResponse.json({statusCode: 400, message: 'Invalid OTP', status: false})
        }

        return NextResponse.json({statusCode: 200, message: 'OTP verified successfully', status: true})
        
    } catch (error: unknown | Error) {
        let customError = new Error('Something went wrong in verifying OTP');

        if(error instanceof Error) {
            customError = error;
        }

        return NextResponse.json({statusCode: 500, message: customError.message, status: false})
    }

}
