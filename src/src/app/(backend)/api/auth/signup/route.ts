import prisma from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import StatusCode from "status-code-enum";
import { z } from "zod";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const newUser = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "Password minimum 8 characters." }),
  });

  const parseResult = newUser.safeParse({
    email,
    password,
  });

  if (!parseResult.success) {
    return new NextResponse(String(parseResult.error.issues[0].message), {
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
