"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

function HeaderComponent({ children }) {
  const { data: session, status } = useSession();

  return (
    <div
      id="header"
      className="flex items-center justify-between flex-wrap gap-2 bg-slate-900 text-white px-2 md:px-8 py-4  "
    >
      <Link className="flex items-center gap-2" href="/">
        <Image src="/assistant.svg" height={50} width={50} alt="logo" />
        <h6 className="  text-3xl font-semibold">Paperass AI</h6>
      </Link>
      {status == "authenticated" ? (
        <div>Authentifié</div>
      ) : (
        <div className="flex gap-5" id="login-buttons">
          <Link
            href="/signup"
            className="bg-mySecondary rounded-lg p-2.5 text-slate-900"
          >
            S&apos;inscrire
          </Link>
          <Link className="p-2.5" href="/api/auth/signin">
            Se Connecter
          </Link>
        </div>
      )}
    </div>
  );
}
export default HeaderComponent;
