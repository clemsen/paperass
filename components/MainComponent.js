"use client";
import { createContext, useState } from "react";
import { SessionProvider } from "next-auth/react";
import HeaderComponent from "./HeaderComponent";

const keyDefault = {
  key: "",
  setKey: () => {},
};
export const KeyContext = createContext(keyDefault);

function MainComponent({ children }) {
  const [key, setKey] = useState("");

  return (
    <KeyContext.Provider value={{ key, setKey }}>
      <SessionProvider>
        <main className="flex flex-col h-screen">
          <HeaderComponent />
          {children}
        </main>
      </SessionProvider>
    </KeyContext.Provider>
  );
}
export default MainComponent;
