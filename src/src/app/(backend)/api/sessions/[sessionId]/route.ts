import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import StatusCode from "status-code-enum";
import { Prisma } from "@prisma/client";

/**
 * /api/sessions/:sessionId
 *
 * @param req Request
 * @returns All messages for the corresponding session and cursor
 */
export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { sessionId: string };
  }
) {
  const DEFAULT_TAKE_AMOUNT = 30;
  const searchParams = new URL(req.url).searchParams;

  const sessionId = Number(params.sessionId);
  if (isNaN(sessionId)) {
    return new NextResponse("Invalid URL params", {
      status: StatusCode.ClientErrorBadRequest,
    });
  }

  const cursor =
    Number(searchParams.get("cursor")!) === 0
      ? undefined
      : Number(searchParams.get("cursor")!);
  const take =
    Number(searchParams.get("take")!) === 0
      ? DEFAULT_TAKE_AMOUNT
      : Number(searchParams.get("take")!);

  const result = await prisma.message.findMany({
    take,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    where: {
      sessionId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    is_success: true,
    message: null,
    data: {
      messages: result,
      cursor: result.length > 0 ? result[result.length - 1].id : null,
    },
  });
}

/**
 * /api/sessions/:sessionId
 *
 * @param req  Request
 * @returns -
 */
export async function DELETE(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  const sessionId = Number(params.sessionId);
  if (isNaN(sessionId)) {
    return new NextResponse("Invalid URL params", {
      status: StatusCode.ClientErrorBadRequest,
    });
  }

  try {
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    return NextResponse.json({
      is_success: true,
      message: `Session with id ${sessionId} has been deleted`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return new NextResponse("Session not found", {
          status: StatusCode.ClientErrorBadRequest,
        });
      }
    }

    return new NextResponse(String(error), {
      status: StatusCode.ServerErrorInternal,
    });
  }
}
