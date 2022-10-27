import { createClient } from "@supabase/supabase-js";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html>
      <head>
            {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sen:wght@800&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@500&display=swap" rel="stylesheet"></link>
            <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital@0;1&display=swap" rel="stylesheet" />  */}


            <link rel="manifest" href="/manifest.json" />
            {/* <link rel="apple-touch-icon" href="/icon-apple-touch.png" /> */}
            <meta name="theme-color" content="#88E2A1" />
        </head>
      <body>{children}</body>
    </html>
  );
}
