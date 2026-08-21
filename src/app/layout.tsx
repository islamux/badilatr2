import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "بديل عطر ٢ | أفضل العطور الرجالية وبدائلها",
  description:
    "بديل عطر ٢: أفضل العطور الرجالية مع بدائلها العربية والاقتصادية، النوتات العطرية، نسب الثبات والفوحان، وحكم الشراء الأعمى — مصنّفة في إحدى عشرة عائلة عطرية مع بحث وفلترة فورية.",
  other: {
    "theme-color": "#161009",
    author: "بديل عطر ٢",
    "og:title": "بديل عطر ٢ | أفضل العطور الرجالية وبدائلها",
    "og:description":
      "أفضل العطور الرجالية مع بدائلها الموثوقة، النوتات، الثبات والفوحان، وحكم الشراء الأعمى.",
    "og:type": "website",
    "og:locale": "ar_AR",
    "twitter:card": "summary",
    "twitter:title": "بديل عطر ٢ | أفضل العطور الرجالية وبدائلها",
    "twitter:description":
      "أفضل العطور الرجالية مع بدائلها الموثوقة والنوتات والثبات.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%23161009'/><path d='M16 5c4 6 7 9 7 13a7 7 0 0 1-14 0c0-4 3-7 7-13z' fill='%23d4a24e'/></svg>"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
