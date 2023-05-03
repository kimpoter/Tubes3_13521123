import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import StatusCode from "status-code-enum";
import { z } from "zod";

export async function POST(req: Request) {
    console.log("ok");
    const { email, password, confirmPassword } = await req.json();

    // const newUser = z.object({
    //     email: z
    //         .string({
    //             required_error: "Email is required.",
    //             invalid_type_error: "Email must be a string.",
    //         })
    //         .email({ message: "Invalid email address." }),
    //     password: z
    //         .string({
    //             required_error: "Password is required.",
    //             invalid_type_error: "Password must be a string.",
    //         })
    //         .min(8, { message: "Password minimum 8 characters." }),
    //     confirmPassword: z.string({
    //         required_error: "Confirm password is required.",
    //         invalid_type_error: "Confirm password must be a string.",
    //     }),
    // });

    // const parseResult = newUser.safeParse({
    //     email,
    //     password,
    //     confirmPassword,
    // });

    // if (!parseResult.success) {
    //     return new NextResponse(String(parseResult.error.issues[0].message), {
    //         status: StatusCode.ClientErrorBadRequest,
    //     });
    // }

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
