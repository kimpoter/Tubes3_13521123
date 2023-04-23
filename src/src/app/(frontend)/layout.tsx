import "./globals.css";

export const metadata = {
  title: "ShibAl - Chat",
  description:
    "The next generation ”ChatGPT” like web app created by typescript enjoyers and friends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
