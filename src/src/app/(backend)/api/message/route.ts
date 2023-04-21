import { bmMatch } from "../../../../lib/bm";
import { kmpMatch } from "../../../../lib/kmp";
import { NextRequest, NextResponse } from "next/server";

const calcRegex =
    /^\s*\d+(\.\d+)?(\s*[\\+\\-\\*\\^\\/]\s*\d+(\.\d+)?)*(\s*[\\+\\-\\*\\^\\/]\s*\d+(\.\d+)?)*\s*$/;
const dateRegex = /^(0?[1-9]|[1-2][0-9]|3[0-1])\-(0?[1-9]|1[0-2])\-([0-9]{4})$/;
const tambahRegex = /^tambahkan pertanyaan (\w+) dengan jawaban (\w+)$/;
const hapusRegex = /^hapus pertanyaan (\w+)$/u;

interface RequestBody {
    choice: "KMP" | "BM";
    question: string;
}

export async function POST(req: Request) {
    try {
        let { choice, question }: RequestBody = await req.json();
        // Untuk validasi tanggal, javascript marah kalo ada / diikuti 0. Jadi kita pake "/"
        question = question.replaceAll("/", "-").toString().toLowerCase();
        console.log(question);
        const tambahMatches = question.match(tambahRegex);
        const hapusMatches = question.match(hapusRegex);
        let result;
        if (calcRegex.test(question)) {
            // console.log("hi");
            result = "Jawabannya adalah " + eval(question);
        } else if (dateRegex.test(question)) {
            const dateParts = question.split("-");
            const year = parseInt(dateParts[2]);
            const month = parseInt(dateParts[1]) - 1; // month is zero-indexed
            const day = parseInt(dateParts[0]);

            const dayOfWeek = new Date(year, month, day).toLocaleDateString(
                "id-ID",
                { weekday: "long" }
            );

            result = "Tanggal tersebut hari " + dayOfWeek;
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
                let kemiripan = 0.8;
                if (kemiripan > 0.9) {
                    result = "HASIL JAWABAN DB";
                } else {
                    result = "REKOMENDASI PERTANYAAN DB TOP 3 YG PALING MIRIP";
                }
            }
        }
        return NextResponse.json(result);
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err });
    }
}
