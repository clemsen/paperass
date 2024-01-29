"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Embed from "./embed/page";
import { useContext } from "react";
import { KeyContext } from "../components/MainComponent";

function Home() {
  const getKey = useContext(KeyContext);
  const [keyAdded, setKeyAdded] = useState(false);
  const [assistants, setAssistants] = useState([]);
  const [test, setTest] = useState("");
  const fetchData = async () => {
    let data = undefined;
    try {
      const response = await fetch("/api");
      data = await response.json();
    } catch (error) {
      console.error("Error in getting data", error);
    }
    setTest(data);
    if (data.openAIKey != undefined && data.openAIKey != "") {
      getKey.setKey(data.openAIKey);
      setKeyAdded(true);
    }
    if (
      data.assistants != undefined &&
      Object.keys(data.assistants).length > 0
    ) {
      let getAssistants = [];
      Object.keys(data.assistants).forEach((key) =>
        getAssistants.push(data.assistants[key])
      );
      setAssistants(getAssistants);
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
      </div>
      {getKey.key && getKey.key !== "" && assistants.length > 0 && (
        <div id="chat" className="flex flex-1">
          <Embed assistantId={assistants[0].id} Okey={getKey.key} />
        </div>
      )}
    </main>
  );
}

export default Home;
