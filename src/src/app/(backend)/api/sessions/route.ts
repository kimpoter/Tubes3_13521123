import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

/**
 * /api/sessions
 *
 * @param req Request
 * @returns All sessions for the corresponding user
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  let result = await prisma.session.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  return NextResponse.json({
    is_success: true,
    message: null,
    data: result,
  });
}

/**
 * /api/sessions
 *
 * @param req Request
 * @returns Session id
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    const result = await prisma.session.create({
      data: {
        name: "New Session",
        user: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    });

    return NextResponse.json({
      is_success: true,
      message: "New Session has been created!",
      data: {
        session_id: result.id,
      },
    });
  } catch (error) {
    return new NextResponse(String(error), {
      status: 500,
    });
  }
}
