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
    tambahRegex: /^tambahkan pertanyaan (.*) dengan jawaban (.*)$/i,
    hapusRegex: /^hapus pertanyaan (.*)$/u,
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
            .replaceAll(" ", "")
            .replaceAll("\n", "")
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

async function getResult(question: string, choice: "KMP" | "BM") {
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
                .replace("?", "")
                .replace("hariapa", "");
            const dateParts = dateString.split("/");
            const year = parseInt(dateParts[2]);
            const month = parseInt(dateParts[1]) - 1; // month is zero-indexed
            const day = parseInt(dateParts[0]);

            const dayOfWeek = new Date(year, month, day).toLocaleDateString(
                "id-ID",
                {
                    weekday: "long",
                }
            );

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
            let questionTambah = tambahMatches[1];
            let answerTambah = tambahMatches[2];
            try {
                await prisma.questionAnswerr.create({
                    data: {
                        question: questionTambah,
                        answer: answerTambah,
                    },
                });
                result =
                    "Berhasil menambahkan pertanyaan " +
                    `"${questionTambah}"` +
                    " dengan jawaban " +
                    `"${answerTambah}"`;
            } catch (err) {
                await prisma.questionAnswerr.update({
                    where: { question: questionTambah },
                    data: {
                        answer: answerTambah,
                    },
                });
                result =
                    "Pertanyaan sudah ada di database dan jawaban telah diupdate ke " +
                    `"${answerTambah}"`;
            }
        } else if (hapusMatches) {
            let questionHapus = hapusMatches[1];
            try {
                const exist = await prisma.questionAnswerr.findUnique({
                    where: { question: questionHapus },
                });
                if (exist) {
                    await prisma.questionAnswerr.delete({
                        where: { question: questionHapus },
                    });
                    result = "Berhasil menghapus pertanyaan " + `"${questionHapus}"`;
                } else {
                    result = "Pertanyaan tidak ditemukan";
                }
            } catch (err) {
                result = "Terjadi kesalahan";
            }
        } else {
            let exactMatch;
            const questionAnswers = await prisma.questionAnswerr.findMany();
            let similarityScores = [];
            for (let questionAns of questionAnswers) {
                let questionDB = questionAns.question;
                let answerDB = questionAns.answer;
                if (choice == "KMP") {
                    exactMatch = kmpMatch(question, questionDB);
                } else {
                    exactMatch = bmMatch(question, questionDB);
                }

                if (exactMatch) {
                    result = answerDB;
                    break;
                } else {
                    const kemiripan: number = levenshtein(question, questionDB);
                    similarityScores.push({
                        ques: questionDB,
                        ans: answerDB,
                        score: kemiripan,
                    });
                }
            }
            if (!exactMatch) {
                const threshold = 90;
                similarityScores.sort((a, b) => b.score - a.score);
                // If highest similarity more than threshold, get that one.
                if (similarityScores[0].score >= threshold) {
                    result = `${similarityScores[0].ans} (${similarityScores[0].score}%)`
                } else {
                    result = "Pertanyaan tidak ditemukan di database\n"
                    result += "Apakah pertanyaan yang anda maksud ini? \n";
                    result += similarityScores
                        .slice(0, 3)
                        .map((obj, index) => `${index + 1}. ${obj.ques} (${Math.round(obj.score)}%)`)
                        .join("\n");
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
        let { choice, question, sessionId }: MessageRequestBody =
            await req.json();
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
            let lowerQuestion = question.toLowerCase();
            listResult.push(await getResult(lowerQuestion, choice));
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
