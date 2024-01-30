"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Embed from "../components/ChatComponent";
import { useContext } from "react";
import { KeyContext } from "../components/MainComponent";
import Link from "next/link";

function Home() {
  const getKey = useContext(KeyContext);
  const [assistant, setAssistant] = useState();
  const [logged, setLogged] = useState(false);
  const fetchData = async () => {
    let data = undefined;
    try {
      const response = await fetch("/api");
      data = await response.json();
    } catch (error) {
      console.error("Error in getting data", error);
    }
    const openAIKey = await process.env.NEXT_PUBLIC_OPENAI_KEY;
    if (openAIKey != undefined && openAIKey != "") {
      getKey.setKey(openAIKey);
    }
    if (data.assistant != undefined) {
      setAssistant(data.assistant.id);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
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
              S'inscrire
            </Link>
            <button>Se Connecter</button>
          </div>
        )}
      </div>
      {getKey.key && getKey.key !== "" && assistant !== undefined && (
        <div id="chat" className="flex flex-1">
          <Embed assistantId={assistant} Okey={getKey.key} />
        </div>
      )}
    </main>
  );
}

export default Home;
