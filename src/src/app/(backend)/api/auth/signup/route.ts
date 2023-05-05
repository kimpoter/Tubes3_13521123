import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import StatusCode from "status-code-enum";

export async function POST(req: Request) {
    const { email, password, confirmPassword } = await req.json();
    if (password !== confirmPassword) {
        return new NextResponse("Password and confirm password must be same!", {
            status: StatusCode.ClientErrorBadRequest,
        });
    }

    try {
        const passwordHashed = await hash(password, 12);
        await prisma.user.create({
            data: {
                email,
                password: passwordHashed,
                role: "USER",
            },
        });
        return NextResponse.json("Account created!");
    } catch (error) {
        return new NextResponse(String(error), {
            status: StatusCode.ServerErrorInternal,
        });
    }
}
