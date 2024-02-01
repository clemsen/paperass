"use client";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";

function HeaderComponent({ children }) {
  const { data: session, status } = useSession();
  const [userBloc, setUserBloc] = useState(false);

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
        <div className="relative">
          <button
            className="bg-mySecondary rounded-lg p-2.5 text-slate-900 flex gap-2"
            onClick={() => setUserBloc(!userBloc)}
          >
            <div>{session.user?.email}</div>
            <KeyboardArrowDownIcon />
          </button>
          {userBloc && (
            <button
              id="userBloc"
              className="bg-myPrimary rounded-lg p-2.5 text-slate-900 absolute right-0"
              onClick={signOut}
            >
              Déconnexion
            </button>
          )}
          <div>{JSON.stringify(session)}</div>
        </div>
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
