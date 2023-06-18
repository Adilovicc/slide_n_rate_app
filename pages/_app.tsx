import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import '../styles/globals.css'
import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import spinnerSvg from '../public/spinner.svg'
import Image from "next/image";
import $ from 'jquery'

export default function App({ Component, pageProps }: AppProps) {

  const [loading, setLoading] = useState(false);
  const router=useRouter();
  useEffect(() => {
    const handleStart = (url:any) => {
      if (url !== router.asPath) {
        setLoading(true)
        $('body').css('overflow','hidden');
      };
    }
    const handleComplete = (url:any) => {
         setLoading(false);
         $('body').css('overflow','overlay');
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError',  handleComplete)

    return () => {
        router.events.off('routeChangeStart', handleStart)
        router.events.off('routeChangeComplete', handleComplete)
        router.events.off('routeChangeError', handleComplete)
    }
},[router])

  return (
    <SessionProvider session={pageProps.session}>
       <>
          {loading && 
          (<div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-[#9cc0d0] z-40 ">
            <div className="fixed h-[220px] w-[220px]">
                  <Image className="animate-spin" src={spinnerSvg} fill alt="spinner"></Image>
           </div>
          </div>)}
          <Component {...pageProps} /> 
          </>
    </SessionProvider>
  )
}