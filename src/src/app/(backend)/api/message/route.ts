import { bmMatch } from "@/lib/bm";
import { AuthSession, MessageRequestBody } from "@/lib/interfaces";
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
    /^\s*\(*([-]?(\d*\.\d+|\d+))(\s*((\+|\-|\*|\/|\^|\%))\s*\(*([-]?(\d*\.\d+|\d+))\)*)*\s*\??\s*$/,
  calcQuestionRegex: /^\s*kalkulasi\s*(.*)$/i,
  dateRegex:
    /^\s*(0?[1-9]|[1-2][0-9]|3[0-1])\s*\/\s*(0?[1-9]|1[0-2])\s*\/\s*([0-9]{4})\s*\??\s*$/,
  dateQuestionRegex: /^\s*hari\s+apa\s*(.*)$/i,
  tambahRegex: /^tambahkan pertanyaan (.*) dengan jawaban (.*)$/i,
  hapusRegex: /^hapus pertanyaan (.*)$/u,
};

/**
 * create new session
 * @param name session's name
 * @returns 
 */
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
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

/**
 * calculate expression
 * 
 * @param expression string expression
 * @returns 
 */
function calculate(expression: string) {
  if (regex.exprRegex.test(expression)) {
    expression = expression
      .replace("?", "")
      .replaceAll(" ", "")
      .replaceAll("\n", "");
    try {
      return `Hasil dari ${expression} adalah ${evaluate(expression)}`;
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

/**
 * 
 * @param question 
 * @param choice 
 * @param user 
 * @returns 
 */
async function getResult(
  question: string,
  choice: "KMP" | "BM",
  user: AuthSession
) {
  const dateQuestionMatches = question.match(regex.dateQuestionRegex);
  const calcQuestionMatches = question.match(regex.calcQuestionRegex);
  const tambahMatches = question.match(regex.tambahRegex);
  const hapusMatches = question.match(regex.hapusRegex);
    console.log("date question", dateQuestionMatches);
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

      const dayOfWeek = new Date(year, month, day).toLocaleDateString("id-ID", {
        weekday: "long",
      });

      result = `Tanggal ${dateString} hari ${dayOfWeek}`;
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
        const answerTambahID = await prisma.questionAnswer.findFirst({
          where: {
            question: {
              content: questionTambah,
            },
            user: {
              id: user.id,
            },
          },
          select: {
            answerId: true,
          },
        });
        const question = await prisma.question.findFirst({
          where: {
            content: questionTambah,
            answers: {
              some: {
                userId: user.id,
              },
            },
          },
        });
        const answer = await prisma.answer.findFirst({
          where: {
            content: answerTambah,
            questions: {
              some: {
                question: {
                  content: questionTambah,
                },
                userId: user.id,
              },
            },
          },
        });

        if (!question || !answer) {
          await prisma.$transaction(async (tx) => {
            await tx.questionAnswer.create({
              data: {
                answer: {
                  connectOrCreate: {
                    where: {
                      content: answerTambah,
                    },
                    create: {
                      content: answerTambah,
                    },
                  },
                },
                question: {
                  connectOrCreate: {
                    where: {
                      content: questionTambah,
                    },
                    create: {
                      type: user.role == "ADMIN" ? "GLOBAL" : "USER",
                      content: questionTambah,
                    },
                  },
                },
                user: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            });

            if (question) {
              await tx.questionAnswer.delete({
                where: {
                  questionId_answerId_userId: {
                    questionId: question.id,
                    answerId: answerTambahID?.answerId ?? 0,
                    userId: user.id,
                  },
                },
              });
            }
          });
        }

        if (question && answer) {
          result = `Pertanyaan "${questionTambah}" dengan jawaban "${answerTambah}" telah ada di database`;
        } else if (question) {
          result = `Pertanyaan "${questionTambah}" sudah ada di database dan jawaban telah diupdate ke "${answerTambah}"`;
        } else {
          result = `Berhasil menambahkan pertanyaan "${questionTambah}" dengan jawaban "${answerTambah}"`;
        }
        // await prisma.questionAnswerr.create({
        //   data: {
        //     question: questionTambah,
        //     answer: answerTambah,
        //   },
        // });
        // result =
        //   "Berhasil menambahkan pertanyaan " +
        //   `"${questionTambah}"` +
        //   " dengan jawaban " +
        //   `"${answerTambah}"`;
      } catch (_) {
        result = "Internal server error.😶";
        // await prisma.questionAnswerr.update({
        //   where: { question: questionTambah },
        //   data: {
        //     answer: answerTambah,
        //   },
        // });
        // result =
        //   "Pertanyaan sudah ada di database dan jawaban telah diupdate ke " +
        //   `"${answerTambah}"`;
      }
    } else if (hapusMatches) {
      let questionHapus = hapusMatches[1];
      try {
        const question = await prisma.questionAnswer.findFirst({
          where: {
            question: {
              content: questionHapus,
            },
            user: {
              id: user.id,
            },
          },
        });
        if (question) {
          await prisma.questionAnswer.delete({
            where: {
              questionId_answerId_userId: {
                questionId: question.questionId,
                answerId: question.answerId,
                userId: user.id,
              },
            },
          });
          result = "Berhasil menghapus pertanyaan " + `"${questionHapus}"`;
        } else {
          result = "Pertanyaan tidak ditemukan";
        }
      } catch (_) {
        result = "Internal server error.😶";
      }
    } else {
      let exactMatch;
      const userQuestionAnswers = await prisma.questionAnswer.findMany({
        distinct: ["questionId", "userId"],
        where: {
          userId: user.id,
        },
        select: {
          question: {
            select: {
              content: true,
            },
          },
          answer: {
            select: {
              content: true,
            },
          },
        },
      });
      const systemQuestionAnswer = await prisma.questionAnswer.findMany({
        distinct: ["questionId", "userId"],
        where: {
          question: {
            type: "GLOBAL",
          },
          user: {
            role: "ADMIN",
          },
        },
        select: {
          question: {
            select: {
              content: true,
            },
          },
          answer: {
            select: {
              content: true,
            },
          },
        },
      });
      let questionAnswers = [...userQuestionAnswers, ...systemQuestionAnswer];
      questionAnswers = questionAnswers.filter(
        (value, index, self) =>
          index ==
          self.findIndex((t) => t.question.content === value.question.content)
      );
      if (questionAnswers.length == 0) {
        return `Tidak ada pertanyaan di database.`;
      }
      let similarityScores = [];
      for (let questionAns of questionAnswers) {
        let questionDB = questionAns.question.content;
        let answerDB = questionAns.answer.content;
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
          result = `${similarityScores[0].ans} (${similarityScores[0].score}%)`;
        } else {
          result = "Pertanyaan tidak ditemukan di database\n";
          result += "Apakah pertanyaan yang anda maksud ini? \n";
          result += similarityScores
            .slice(0, 3)
            .map(
              (obj, index) =>
                `${index + 1}. ${obj.ques} (${Math.round(obj.score)}%)`
            )
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
  const session = await getServerSession(authOptions);

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

    question = question.replace(/\b0+(\d+)/g, "$1").trim(); // replace digits with 0 prefix
    console.info(question);
    const listQuestion = question.split(/\?(?=\s)/);
    const listResult = [];

    console.info(listQuestion);

    for (const question of listQuestion) {
      let lowerQuestion = question.toLowerCase();
      listResult.push(await getResult(lowerQuestion, choice, session?.user!));
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
