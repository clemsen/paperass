"use client";
import { useState, useEffect } from "react";
import ChatComponent from "../components/ChatComponent";
import { useContext } from "react";
import { KeyContext } from "../components/MainComponent";

function Home() {
  const getKey = useContext(KeyContext);
  const [assistant, setAssistant] = useState();
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
    <div id="chat" className="flex flex-1">
      {getKey.key && getKey.key !== "" && assistant !== undefined && (
        <ChatComponent assistantId={assistant} Okey={getKey.key} />
      )}
    </div>
  );
}

export default Home;
