"use client";
import { createContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const keyDefault = {
  key: "",
  setKey: () => {},
};
export const KeyContext = createContext(keyDefault);

function MainComponent({ children }) {
  const [key, setKey] = useState("");
  const [logged, setLogged] = useState(false);

  return (
    <KeyContext.Provider value={{ key, setKey }}>
      <main className="flex flex-col h-screen">
        <div
          id="header"
          className="flex items-center justify-between flex-wrap gap-2 bg-slate-900 text-white px-2 md:px-8 py-4  "
        >
          <div className="flex items-center gap-2">
            <Image src="/assistant.svg" height={50} width={50} alt="logo" />
            <h6 className="  text-3xl font-semibold">Paperass AI</h6>
          </div>
          {logged ? (
            <div>bla</div>
          ) : (
            <div className="flex gap-5" id="login-buttons">
              <Link
                href="/signup"
                className="bg-mySecondary rounded-lg p-2.5 text-slate-900"
              >
                S&apos;inscrire
              </Link>
              <Link className="p-2.5" href="/signin">
                Se Connecter
              </Link>
            </div>
          )}
        </div>
        {children}
      </main>
    </KeyContext.Provider>
  );
}
export default MainComponent;
