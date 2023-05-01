import { bmMatch } from "@/lib/bm";
import { MessageRequestBody } from "@/lib/interfaces";
import { kmpMatch } from "@/lib/kmp";
import { levenshtein } from "@/lib/levenshtein";
import { NextResponse } from "next/server";

const regex = {
  calcRegex: /^\s*([-+]?(\d*\.\d+|\d+))(\s*((\+|\-|\*|\/|\*\*|\^|\%))\s*([-+]?(\d*\.\d+|\d+)))*\s*\??\s*$/,
  dateRegex: /^\s*(0?[1-9]|[1-2][0-9]|3[0-1])\s*\/\s*(0?[1-9]|1[0-2])\s*\/\s*([0-9]{4})\s*\??\s*$/,
  tambahRegex: /^tambahkan pertanyaan (\w+) dengan jawaban (\w+)$/,
  hapusRegex: /^hapus pertanyaan (\w+)$/u,
};

/**
 * /api/message
 * Processing user question and giving the appropriate response
 *
 * @param req Request
 * @returns Response messsage from system
 */
export async function POST(req: Request) {
  try {
    let { choice, question }: MessageRequestBody = await req.json();

    question = question.replace(/\b0+(\d+)/g, '$1'); // replace digits with 0 prefix 
    console.info(question);
    
    const tambahMatches = question.match(regex.tambahRegex);
    const hapusMatches = question.match(regex.hapusRegex);
    
    let result;
    if (regex.dateRegex.test(question)) {
      question = question.replaceAll(" ", "").toString();
      question = question.replaceAll("?", "").toString();
      const dateParts = question.split("/");
      const year = parseInt(dateParts[2]);
      const month = parseInt(dateParts[1]) - 1; // month is zero-indexed
      const day = parseInt(dateParts[0]);

      const dayOfWeek = new Date(year, month, day).toLocaleDateString("id-ID", {
        weekday: "long",
      });

      result = "Tanggal tersebut hari " + dayOfWeek;
    } else {
      if (regex.calcRegex.test(question)) {
        question = question.replaceAll("?", "").toString();
        result = "Jawabannya adalah " + eval(question);
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
    return NextResponse.json({
      is_success: true,
      message: null,
      data: {
        id: Math.ceil(Math.random() * 10000) + 3, // change to the new message id
        content: result,
      }
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: err });
  }
}
