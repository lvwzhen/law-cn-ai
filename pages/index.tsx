import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { SearchDialog } from '@/components/SearchDialog'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>AI 法律助手</title>
        <meta name="description" content="AI 法律助手" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-6GCGYXNM3S"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6GCGYXNM3S');
        `}
      </Script>
      <main className={styles.main}>
        <h1 className="text-slate-700 font-bold text-2xl mb-12 flex items-center gap-3 dark:text-slate-400">
          <Image src={'/logo.png'} width="32" height="32" alt="MagickPen logo" /> AI 法律助手
        </h1>
        <div className={styles.center}>
          <SearchDialog />
        </div>

        <div className="mt-28 md:mt-40 text-center w-full">
          <h2 className="text-slate-500">更多好玩</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 max-w-2xl mx-auto text-xs">
            <li>
              <Link
                href="https://magickpen.com/?ref=lawcnai"
                className=" 
              dark:bg-white/30
              dark:text-slate-900
              dark:border-slate-900
               text-slate-400  border border-slate-300/30 transition-all hover:bg-white/50 hover:backdrop-blur-md py-2.5 rounded-md block"
              >
                <Image
                  src={'/MagickPen.png'}
                  width={100}
                  height="20"
                  className="w-full mb-1 h-5 object-contain"
                  alt="MagickPen - 智能写作助手"
                />
                智能写作助手
              </Link>
            </li>
            <li>
              <Link
                href="https://www.teach-anything.com/?ref=lawcnai"
                className="dark:bg-white/30
              dark:border-slate-900
              dark:text-slate-900 text-slate-400  border border-slate-300/30 transition-all hover:bg-white/50 hover:backdrop-blur-md py-2.5 rounded-md block"
              >
                <Image
                  src={'/TeachAnything.png'}
                  width={100}
                  height="20"
                  className="w-full mb-1 h-5 object-contain"
                  alt="Teach Anything - AI 百科全书"
                />
                AI 百科全书
              </Link>
            </li>
            <li>
              <Link
                href="https://ask2end.com/?ref=lawcnai"
                className="dark:bg-white/30
              dark:border-slate-900
              dark:text-slate-900 text-slate-400  border border-slate-300/30 transition-all hover:bg-white/50 hover:backdrop-blur-md py-2.5 rounded-md block"
              >
                <Image
                  src={'/Ask2End.png'}
                  width={100}
                  height="20"
                  className="w-full mb-1 h-5 object-contain"
                  alt="Ask2End - 打破砂锅问到底"
                />
                打破砂锅问到底
              </Link>
            </li>
            <li>
              <Link
                href="https://better.avatarprompt.net/?ref=lawcnai"
                className="dark:bg-white/30
              dark:border-slate-900
              dark:text-slate-900 text-slate-400  border border-slate-300/30 transition-all hover:bg-white/50 hover:backdrop-blur-md py-2.5 rounded-md block"
              >
                <Image
                  src={'/BetterPrompt.png'}
                  width={100}
                  height="20"
                  className="w-full mb-1 h-5 object-contain"
                  alt="Teach Anything - AI 百科全书"
                />
                Prompt 生成器
              </Link>
            </li>
            <li>
              <Link
                href="https://openl.io/?ref=lawcnai"
                className="dark:bg-white/30
              dark:border-slate-900
              dark:text-slate-900 text-slate-400  border border-slate-300/30 transition-all hover:bg-white/50 hover:backdrop-blur-md py-2.5 rounded-md block"
              >
                <Image
                  src={'/OpenL.png'}
                  width={100}
                  height="20"
                  className="w-full mb-1 h-5 object-contain"
                  alt="OpenL - AI 翻译专家"
                />
                AI 翻译专家
              </Link>
            </li>
          </ul>
        </div>

        <div className="py-10 w-full md:flex items-center justify-center md:space-x-6">
          <div className="flex items-center justify-center space-x-6 mt-4 md:m-0">
            <div className="opacity-75 transition hover:opacity-100 cursor-pointer">
              <Link
                href="https://github.com/lvwzhen/law-cn-ai"
                className="flex items-center justify-center"
              >
                <Image src={'/github.svg'} width="24" height="24" alt="Github logo" />
              </Link>
            </div>
            <div className="opacity-75 transition hover:opacity-100 cursor-pointer">
              <Link
                href="https://discord.gg/zYHbmcRazd"
                className="flex items-center justify-center"
              >
                <Image src={'/discord.svg'} width="24" height="24" alt="Discord logo" />
              </Link>
            </div>
            <div className="opacity-75 transition hover:opacity-100 cursor-pointer">
              <Link href="https://twitter.com/lvwzhen" className="flex items-center justify-center">
                <Image src={'/twitter.svg'} width="24" height="24" alt="Twitter logo" />
              </Link>
            </div>
          </div>
        </div>

        <a
          href="https://discord.gg/zYHbmcRazd"
          target="_blank"
          className="fixed right-4 bottom-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white hover:bg-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fill-rule="evenodd"
              d="M10 3c-4.31 0-8 3.033-8 7 0 2.024.978 3.825 2.499 5.085a3.478 3.478 0 01-.522 1.756.75.75 0 00.584 1.143 5.976 5.976 0 003.936-1.108c.487.082.99.124 1.503.124 4.31 0 8-3.033 8-7s-3.69-7-8-7zm0 8a1 1 0 100-2 1 1 0 000 2zm-2-1a1 1 0 11-2 0 1 1 0 012 0zm5 1a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
      </main>
    </>
  )
}
