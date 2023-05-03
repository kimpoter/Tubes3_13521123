import { bmMatch } from "@/lib/bm";
import { MessageRequestBody } from "@/lib/interfaces";
import { kmpMatch } from "@/lib/kmp";
import { levenshtein } from "@/lib/levenshtein";
import prisma from "@/lib/prisma";
import { MessageType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { evaluate } from "@/lib/calculator";
import StatusCode from "status-code-enum";

const regex = {
  exprRegex:
    /^\s*\(*([-+]?(\d*\.\d+|\d+))(\s*((\+|\-|\*|\/|\^|\%))\s*\(*([-+]?(\d*\.\d+|\d+))\)*)*\s*\??\s*$/,
  calcQuestionRegex: /^\s*kalkulasi\s*(.*)$/i,
  dateRegex:
    /^\s*(0?[1-9]|[1-2][0-9]|3[0-1])\s*\/\s*(0?[1-9]|1[0-2])\s*\/\s*([0-9]{4})\s*\??\s*$/,
  dateQuestionRegex: /^\s*hari apa\s*(.*)$/i,
  tambahRegex: /^tambahkan pertanyaan (\w+) dengan jawaban (\w+)$/i,
  hapusRegex: /^hapus pertanyaan (\w+)$/u,
};

async function createSession(name: string) {
  const session = await getServerSession(authOptions);
  console.info(session);
  try {
    const result = await prisma.session.create({
      data: {
        name: name,
        user: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    });
    return result.id;
  } catch (_) {
    return undefined;
  }
}

function calculate(expression: string) {
  if (regex.exprRegex.test(expression)) {
    expression = expression
      .replace("?", "")
      .toString()
      .replaceAll(" ", "")
      .toString()
      .replaceAll("\n", "")
      .toString();
    try {
      return "Jawabannya adalah " + evaluate(expression);
    } catch (err) {
      if (err instanceof Error) {
        return "Sintaks persamaan tidak sesuai. " + err.message;
      } else {
        return "Sintaks persamaan tidak sesuai.";
      }
    }
  } else {
    return "Sintaks persamaan tidak sesuai.";
  }
}

function getResult(question: string, choice: "KMP" | "BM") {
  const dateQuestionMatches = question.match(regex.dateQuestionRegex);
  const calcQuestionMatches = question.match(regex.calcQuestionRegex);
  const tambahMatches = question.match(regex.tambahRegex);
  const hapusMatches = question.match(regex.hapusRegex);

  let result;
  if (dateQuestionMatches) {
    let dateString = dateQuestionMatches[1];
    if (regex.exprRegex.test(dateString)) {
      dateString = dateString
        .replaceAll(" ", "")
        .toString()
        .replace("?", "")
        .toString()
        .replace("hariapa", "");
      const dateParts = dateString.split("/");
      const year = parseInt(dateParts[2]);
      const month = parseInt(dateParts[1]) - 1; // month is zero-indexed
      const day = parseInt(dateParts[0]);

      const dayOfWeek = new Date(year, month, day).toLocaleDateString("id-ID", {
        weekday: "long",
      });

      result = "Tanggal tersebut hari " + dayOfWeek;
    } else {
      result = "Format atau tanggal tidak valid";
    }
  } else {
    if (calcQuestionMatches) {
      let expression = calcQuestionMatches[1];
      result = calculate(expression);
    } else if (regex.exprRegex.test(question)) {
      result = calculate(question);
    } else if (tambahMatches) {
      // TODO TAMBAH DB
      let questionTambah = tambahMatches[1];
      let answerTambah = tambahMatches[2];
      result = "Mau tambah " + questionTambah + " jawab " + answerTambah;
    } else if (hapusMatches) {
      // TODO HAPUS DB
      let questionHapus = hapusMatches[1];
      result = "Mau hapus " + questionHapus;
    } else {
      let exactMatch;
      // TODO LOOP OVER EACH QUESTION IN DB, set result
      if (choice == "KMP") {
        exactMatch = kmpMatch(question, "tes");
      } else {
        exactMatch = bmMatch(question, "tes");
      }

      if (exactMatch) {
        result = "HASILNYA JAWABAN DB";
      } else {
        // TODO GET APPROXIMATE ANSWER (mirip > 90%)
        const kemiripan: number = levenshtein("s_pattern", "s_target");
        if (kemiripan > 0.9) {
          result = "HASIL JAWABAN DB";
        } else {
          result = "REKOMENDASI PERTANYAAN DB TOP 3 YG PALING MIRIP";
        }
      }
    }
  }

  return result;
}

/**
 * /api/message
 * Processing user question and giving the appropriate response
 *
 * @param req Request
 * @returns Response messsage from system
 */
export async function POST(req: Request) {
  try {
    let { choice, question, sessionId }: MessageRequestBody = await req.json();
    console.info("session id (server)", sessionId);
    if (sessionId == undefined) {
      sessionId = await createSession(question);
      if (sessionId == undefined) {
        return new NextResponse(
          "Internal server error. Failed to create session",
          {
            status: StatusCode.ServerErrorInternal,
          }
        );
      }
    }

    await prisma.message.create({
      data: {
        content: question,
        type: MessageType.USER,
        sessionId: sessionId,
      },
    });

    question = question.replace(/\b0+(\d+)/g, "$1"); // replace digits with 0 prefix
    console.info(question);
    const listQuestion = question.split(/\?(?=\s)/);
    const listResult = [];

    console.info(listQuestion);

    for (const question of listQuestion) {
      listResult.push(getResult(question, choice));
    }

    const res = await prisma.message.create({
      data: {
        content: listResult.join(". "),
        type: MessageType.SYSTEM,
        sessionId: sessionId,
      },
    });
    console.info(res);
    return NextResponse.json({
      is_success: true,
      message: null,
      data: res,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
