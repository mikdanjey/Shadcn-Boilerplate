import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/primitives/sonner";

import "@/styles/globals.css";

function RouterProgress() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const start = () => {
      setVisible(true);
      setProgress(20);
      timer = setTimeout(() => setProgress(70), 200);
    };
    const done = () => {
      clearTimeout(timer);
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
    };
  }, [router]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: "3px",
        background: "linear-gradient(90deg, #10b981, #06b6d4)",
        zIndex: 9999,
        transition: "width 0.3s ease",
        boxShadow: "0 0 12px rgba(16,185,129,0.55)",
      }}
    />
  );
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="theme">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="content-language" content="en" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#10b981" />
      </Head>
      <RouterProgress />
      <Component {...pageProps} />
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
