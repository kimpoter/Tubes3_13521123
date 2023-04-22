"use client";

import { MessageType } from "@prisma/client";
import ChatBox from "../components/ChatBox";

const dummy = [
  {
    id: "1",
    messages: [
      {
        id: 1,
        type: MessageType.USER,
        content:
          "Halo, apakah kamu bisa membantu saya dengan masalah komputer saya?",
      },
      {
        id: 2,
        type: MessageType.SYSTEM,
        content: "Tentu saja, saya akan mencoba membantu. Apa masalahnya?",
      },
      {
        id: 3,
        type: MessageType.USER,
        content:
          "Komputer saya tiba-tiba mati saat sedang digunakan, dan sekarang tidak bisa dihidupkan lagi.",
      },
      {
        id: 4,
        type: MessageType.SYSTEM,
        content:
          "Apakah Anda sudah mencoba mengecek kabel daya dan memastikan bahwa komputer terhubung ke listrik?",
      },
      {
        id: 5,
        type: MessageType.USER,
        content: "Sudah, tapi masih tidak bisa dihidupkan.",
      },
      {
        id: 6,
        type: MessageType.SYSTEM,
        content: "Baik, apakah ada lampu indikator pada komputer yang menyala?",
      },
      {
        id: 7,
        type: MessageType.USER,
        content: "Tidak ada lampu indikator yang menyala.",
      },
      {
        id: 8,
        type: MessageType.SYSTEM,
        content:
          "Saya sarankan Anda membawa komputer ke pusat layanan terdekat untuk diperiksa lebih lanjut.",
      },
    ],
  },
  {
    id: "2",
    messages: [
      {
        id: 9,
        type: MessageType.USER,
        content: "Halo, apakah kamu bisa membantu saya membuat website?",
      },
      {
        id: 10,
        type: MessageType.SYSTEM,
        content: "Tentu saja! Apa jenis website yang ingin Anda buat?",
      },
      {
        id: 11,
        type: MessageType.USER,
        content:
          "Saya ingin membuat website untuk bisnis saya. Bagaimana cara memulainya?",
      },
      {
        id: 12,
        type: MessageType.SYSTEM,
        content:
          "Pertama-tama, Anda perlu memilih platform atau CMS (Content Management System) untuk membuat website Anda. Ada beberapa platform populer seperti WordPress, Wix, dan Squarespace.",
      },
      {
        id: 13,
        type: MessageType.USER,
        content:
          "Saya pernah mendengar tentang WordPress. Apa itu dan bagaimana cara menggunakannya?",
      },
      {
        id: 14,
        type: MessageType.SYSTEM,
        content:
          "WordPress adalah platform CMS open source yang memungkinkan Anda membuat dan mengelola website dengan mudah. Untuk memulai, Anda perlu mendaftar ke layanan web hosting dan menginstal WordPress. Setelah itu, Anda dapat memilih tema dan plugin yang sesuai dengan kebutuhan Anda.",
      },
      {
        id: 15,
        type: MessageType.USER,
        content:
          "Saya tidak tahu apa itu tema dan plugin. Bisakah kamu menjelaskannya?",
      },
      {
        id: 16,
        type: MessageType.SYSTEM,
        content:
          "Tema adalah tampilan visual dari website Anda, sementara plugin adalah fitur tambahan yang dapat Anda pasang ke website Anda untuk meningkatkan fungsionalitasnya. Ada banyak tema dan plugin yang tersedia untuk WordPress, beberapa di antaranya gratis dan yang lainnya berbayar.",
      },
      {
        id: 17,
        type: MessageType.USER,
        content:
          "Terima kasih banyak atas bantuanmu! Saya akan mencoba membuat website saya dengan WordPress.",
      },
      {
        id: 18,
        type: MessageType.SYSTEM,
        content:
          "Senang bisa membantu! Jangan ragu untuk kembali jika kamu membutuhkan bantuan lainnya.",
      },
    ],
  },
];

function ChatPage({ params }: { params: { id: string } }) {
  const chats = dummy.filter((value) => value.id == params.id)[0];

  return <ChatBox messages={chats.messages} />;
}

export default ChatPage;
