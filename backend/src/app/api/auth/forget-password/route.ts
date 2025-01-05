import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendOtp } from "@/utils/email/send-otp";

const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
    try {
        
        const {email} = await req.json();

        if(!email) {
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

        // send otp to user

        const otp = await sendOtp(user.email);

        // update otp in db
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                otp 
            }
        });

        return NextResponse.json({statusCode: 200, message: 'otp sent successfully', status: true})

    } catch (error: unknown | Error) {

        let customError = new Error('Something went wrong in forgetting password');

        if(error instanceof Error) {
            customError = error;
        }

        return NextResponse.json({statusCode: 500, message: customError.message, status: false})
    }
}
