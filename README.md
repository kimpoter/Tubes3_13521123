<p align="center">
<img
  src="assets/shiba-l-logo.png"
  alt="Treasure Hunt App by Bebas"
  style="display: block; margin: 10px 0; width: 200px; max-width:800; padding: 0;">
</p>

<p align="center" style="border-radius: 10px; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
<img
  src="assets/shiba-l-landing-page.png"
  alt="Treasure Hunt App by Bebas"
  style="display: block; margin: 0 auto; width: 100%; max-width:800; padding: 0;">
</p>

# 🐶 The Next Generation 'Chat-GPT' Implemented Using Knuth Morris Pratt and Boyer Moore Algorithm 🐶

This project implements the Knuth-Morris-Pratt (KMP) and Boyer-Moore (BM) algorithms for string searching. These algorithms are widely used in computer science and can be applied in various contexts, such as text processing, data mining, and bioinformatics. The project is built using the Next.js framework from frontend to the backend also a PostgreSQL database for storing all the data.

## Contents

- [Tech Stack](#%EF%B8%8Ftech-stack)
- [Minimum Requirements](#-minimum-requirements)
- [Main Features](#-main-features)
  - [Calculator](#calculator)
  - [Determining the day based on a date](#determining-the-day-based-on-a-date)
  - [Adding and deleting custom questions and answers](#adding-and-deleting-custom-questions-and-answers)
  - [Multiple questions in a single prompt](#multiple-questions-in-a-single-prompt)
- [How to Run Locally](#-how-to-run-locally)

## 🕹️Tech Stack

- Next.js (full stack frontend and backend)
- Vercel Postgres Database (databese)
- Prisma (ORM)

## 🦺 Minimum Requirements

> This section is only necessary if you want to run Shiba-L on a local server (WARNING: This is an option that is strongly discouraged. The application may not perform as expected, and full responsibility rests on your hand). You can use the application without the requirements listed below by visiting https://shiba-l.vercel.app.

- Node.js v18 or later
- Vercel Postgres Database instance

## ⚡ Main Features

Here are the main features of Shiba-L,

### Calculator

The mathematical operators that can be used are
|Operator|Description|
|--|--|
|+|addition|
|-|subtraction|
|/|division|
|\*|multiplication|
|%|modulo|
|^|exponentiation|

**Prompt:**

template:

```
{direct mathematics operation}
```

```
kalkulasi {mathematics operation}
```

examples:

```
1 + 1 * 289 + ((900 - 4) % 8) / -10
```

```
kalkulasi 1 + 1 * 289 + ((900 - 4) % 8) / -10
```

### Determining the day based on a date

You can find out what day falls on a certain date with the input date format of DD/MM/YYYY.

**Prompt:**

template:

```
hari apa {DD/MM/YYYY}
```

example:

```
hari apa 29/10/2030
```

### Adding and deleting custom questions and answers

You can add and delete your own questions and answers to the system. These questions and answers can only be accessed by you and can be asked in all of your sessions.

**Prompt:**

template for adding:

```
tambahkan pertanyaan {the question} dengan jawaban {the answer}
```

template for deleting:

```
hapus pertanyaan {the question}
```

examples:

```
tambahkan pertanyaan who is the best girl in Oshi No Ko dengan jawaban of course Kana-chan
```

```
tambahkan pertanyaan is Kana-chan the best girl in Oshi No Ko dengan jawaban of course!!.
```

```
hapus pertanyaan is Akane the best girl?
```

### Multiple questions in a single prompt

Shiba-L supports multiple questions with just one prompt submission. Each questions is separated by a newline.

**Prompt:**

template:

```
{question 1}
{question 2}
{question 3}
...
{question n}
```

examples:

```
who is your fav waifu?
how can someone doesn't like Kana?
give me waifu recommendation!
```

## 🤖 How to Run Locally

1. Clone this repository and go to src folder
2. Execute `npm i` on terminal
3. Create new .env file inside this (src) folder with the content same as .env.example (fill the empty fields)
4. Run the app using `npm run dev`
5. Open the app on `localhost:3000` or another url that provided when compiling the app

---

Made with ❤️ by しばー L team,
|||
|--|--|
|William Nixon|13521123|
|I Putu Bakta Hari Sudewa|13521150|
|Made Debby Almadea P.|13521153|
