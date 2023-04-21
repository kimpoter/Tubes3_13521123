"use client";

import ChatBox from "../components/ChatBox";

const dummy = [
  {
    id: "1",
    log: [
      {
        user: true,
        message:
          "Halo, apakah kamu bisa membantu saya dengan masalah komputer saya?",
        timestamp: "2023-04-15T13:30:00.000Z",
      },
      {
        user: false,
        message: "Tentu saja, saya akan mencoba membantu. Apa masalahnya?",
        timestamp: "2023-04-15T13:31:00.000Z",
      },
      {
        user: true,
        message:
          "Komputer saya tiba-tiba mati saat sedang digunakan, dan sekarang tidak bisa dihidupkan lagi.",
        timestamp: "2023-04-15T13:32:00.000Z",
      },
      {
        user: false,
        message:
          "Apakah Anda sudah mencoba mengecek kabel daya dan memastikan bahwa komputer terhubung ke listrik?",
        timestamp: "2023-04-15T13:33:00.000Z",
      },
      {
        user: true,
        message: "Sudah, tapi masih tidak bisa dihidupkan.",
        timestamp: "2023-04-15T13:34:00.000Z",
      },
      {
        user: false,
        message: "Baik, apakah ada lampu indikator pada komputer yang menyala?",
        timestamp: "2023-04-15T13:35:00.000Z",
      },
      {
        user: true,
        message: "Tidak ada lampu indikator yang menyala.",
        timestamp: "2023-04-15T13:36:00.000Z",
      },
      {
        user: false,
        message:
          "Saya sarankan Anda membawa komputer ke pusat layanan terdekat untuk diperiksa lebih lanjut.",
        timestamp: "2023-04-15T13:37:00.000Z",
      },
    ],
  },
  {
    id: "2",
    log: [
      {
        user: true,
        message: "Halo, apakah kamu bisa membantu saya membuat website?",
        timestamp: "2023-04-15T14:00:00.000Z",
      },
      {
        user: false,
        message: "Tentu saja! Apa jenis website yang ingin Anda buat?",
        timestamp: "2023-04-15T14:01:00.000Z",
      },
      {
        user: true,
        message:
          "Saya ingin membuat website untuk bisnis saya. Bagaimana cara memulainya?",
        timestamp: "2023-04-15T14:02:00.000Z",
      },
      {
        user: false,
        message:
          "Pertama-tama, Anda perlu memilih platform atau CMS (Content Management System) untuk membuat website Anda. Ada beberapa platform populer seperti WordPress, Wix, dan Squarespace.",
        timestamp: "2023-04-15T14:03:00.000Z",
      },
      {
        user: true,
        message:
          "Saya pernah mendengar tentang WordPress. Apa itu dan bagaimana cara menggunakannya?",
        timestamp: "2023-04-15T14:04:00.000Z",
      },
      {
        user: false,
        message:
          "WordPress adalah platform CMS open source yang memungkinkan Anda membuat dan mengelola website dengan mudah. Untuk memulai, Anda perlu mendaftar ke layanan web hosting dan menginstal WordPress. Setelah itu, Anda dapat memilih tema dan plugin yang sesuai dengan kebutuhan Anda.",
        timestamp: "2023-04-15T14:05:00.000Z",
      },
      {
        user: true,
        message:
          "Saya tidak tahu apa itu tema dan plugin. Bisakah kamu menjelaskannya?",
        timestamp: "2023-04-15T14:06:00.000Z",
      },
      {
        user: false,
        message:
          "Tema adalah tampilan visual dari website Anda, sementara plugin adalah fitur tambahan yang dapat Anda pasang ke website Anda untuk meningkatkan fungsionalitasnya. Ada banyak tema dan plugin yang tersedia untuk WordPress, beberapa di antaranya gratis dan yang lainnya berbayar.",
        timestamp: "2023-04-15T14:07:00.000Z",
      },
      {
        user: true,
        message:
          "Terima kasih banyak atas bantuanmu! Saya akan mencoba membuat website saya dengan WordPress.",
        timestamp: "2023-04-15T14:08:00.000Z",
      },
      {
        user: false,
        message:
          "Senang bisa membantu! Jangan ragu untuk kembali jika kamu membutuhkan bantuan lainnya.",
        timestamp: "2023-04-15T14:09:00.000Z",
      },
    ],
  },
];

function ChatPage({ params }: { params: { id: string } }) {
  const chats = dummy.filter((value) => value.id == params.id);

  return <ChatBox chats={chats[0].log} />;
}

export default ChatPage;
