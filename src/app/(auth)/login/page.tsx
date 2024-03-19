'use client';

import Link from 'next/link';
import { signInWithGoogle } from '../actions';
import { signInWithGithub } from '../actions';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { CaretLeftIcon, ReloadIcon} from '@radix-ui/react-icons';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { Button } from '@/src/components/ui/button';
import { useState } from 'react';
import clsx from 'clsx';
import SubmitWithEmailForm from './components/SubmitWithEmailForm';

export default function Login() {
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [googleSigningIn, setGoogleSigningIn] = useState(false);
  const [githubSigningIn, setGithubSigningIn] = useState(false);

  return (
    <Card className="py-10 w-full max-w-[400px] overflow-hidden relative shadow-none border-none sm:shadow-[0_0_5px_1px_rgba(0,0,0,0.1)] sm:border">
      <Button 
        onClick={() => setShowEmailLogin(false)}
        variant="ghost" 
        className={clsx({
          "absolute left-2 top-6 px-2 transition-all duration-300": true,
          "scale-0 pointer-events-none": !showEmailLogin,
          "scale-1": showEmailLogin
        })}
      >
        <CaretLeftIcon className="w-[25px] h-[25px]" />
      </Button>
      <CardHeader>
        <CardTitle className="text-center text-lg">Вход в аккаунт</CardTitle>
      </CardHeader>
      <CardContent className={clsx({
        "relative p-6 pt-0 transition-all duration-300": true,
        "pb-20": showEmailLogin
      })}>
        <form className={clsx({
          "flex flex-col gap-3 transition-all duration-300": true,
          "-translate-x-[120%] pointer-events-none": showEmailLogin,
          "translate-x-0 pointer-events-auto": !showEmailLogin
        })}>
          <Button
            variant='outline'
            formAction={signInWithGoogle}
            className="py-6 px-3 relative"
            onClick={() => setGoogleSigningIn(true)}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2">  
              {
                googleSigningIn 
                  ? <ReloadIcon className="w-[20px] h-[20px] animate-spin-fast" /> 
                  : <GoogleIcon />
              }
            </div>
            <span className="ml-3 text-base">Продолжить с Google</span>
          </Button>
          <Button
            variant='outline'
            formAction={signInWithGithub}
            className="py-6 px-3 relative"
            onClick={() => setGithubSigningIn(true)}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2">  
              {
                githubSigningIn 
                  ? <ReloadIcon className="w-[20px] h-[20px] animate-spin-fast" /> 
                  : <GithubIcon />
              }
            </div>
            <span className="ml-3 text-base">Продолжить с GitHub</span>
          </Button>
          <Button
            variant='outline'
            className="py-6 px-3 relative"
            type="button"
            onClick={() => setShowEmailLogin(true)}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2">  
              <MailOutlineIcon />
            </div>
            <span className="ml-3 text-base">Почта</span>
          </Button>
        </form>

        <SubmitWithEmailForm show={showEmailLogin} />
      </CardContent>
      <CardFooter className="justify-center">
        Нет аккаунта?
        <Link href="/signup" className="ml-3 hover:underline text-sky-800">Регистрация</Link>
      </CardFooter>
    </Card>
  );
}

function GithubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g fill="currentColor" transform="translate(-140 -7559)">
          <g transform="translate(56 160)">
            <path d="M94 7399c5.523 0 10 4.59 10 10.253 0 4.529-2.862 8.371-6.833 9.728-.507.101-.687-.219-.687-.492 0-.338.012-1.442.012-2.814 0-.956-.32-1.58-.679-1.898 2.227-.254 4.567-1.121 4.567-5.059 0-1.12-.388-2.034-1.03-2.752.104-.259.447-1.302-.098-2.714 0 0-.838-.275-2.747 1.051a9.396 9.396 0 00-2.505-.345 9.375 9.375 0 00-2.503.345c-1.911-1.326-2.751-1.051-2.751-1.051-.543 1.412-.2 2.455-.097 2.714-.639.718-1.03 1.632-1.03 2.752 0 3.928 2.335 4.808 4.556 5.067-.286.256-.545.708-.635 1.371-.57.262-2.018.715-2.91-.852 0 0-.529-.985-1.533-1.057 0 0-.975-.013-.068.623 0 0 .655.315 1.11 1.5 0 0 .587 1.83 3.369 1.21.005.857.014 1.665.014 1.909 0 .271-.184.588-.683.493-3.974-1.355-6.839-5.199-6.839-9.729 0-5.663 4.478-10.253 10-10.253"></path>
          </g>
        </g>
      </g>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={20} height={20}>
      <path fill='currentColor' d="M16.601 14.648v4.105h9.813a8.68 8.68 0 01-2.243 5.18l.006-.007a10.015 10.015 0 01-7.596 3.003l.02.001c-5.946-.003-10.765-4.823-10.765-10.77l.001-.152v.008l-.001-.145c0-5.946 4.819-10.767 10.765-10.77l.135-.001c2.822 0 5.383 1.121 7.262 2.941l-.003-.003 2.888-2.888A14.137 14.137 0 0016.59.978h.012-.008c-8.337 0-15.11 6.699-15.228 15.009v.011c.118 8.32 6.891 15.02 15.228 15.02h.009a13.723 13.723 0 0010.476-4.201l.004-.004a13.527 13.527 0 003.554-9.618l.001.022.001-.183c0-.844-.079-1.669-.231-2.469l.013.082z"></path>
    </svg>
  );
}