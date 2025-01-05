import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendOtp } from "@/utils/email/send-otp";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if(!name || !email || !password) {
            return NextResponse.json({statusCode: 400, message: "Please provide all the required fields", status: false});
        }

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role: "USER"
            }
        });

        if(!user) {
            return NextResponse.json({statusCode: 500, message: "Something went wrong in creating a new user", status: false});
        }

        // sending the otp to the user's email

        const otp = await sendOtp(user.email);

        // update the user's otp

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                otp
            }
        });
        
        return NextResponse.json({statusCode: 200, message: "User created successfully", status: true, data: updatedUser});

    } catch (error: unknown | Error) {
        let customError = new Error(`Something went wrong in creating a new user`);

        if(error instanceof Error) {
            customError = error;
        }

        return NextResponse.json({statusCode: 500, message: customError.message, status: false});

    }
}