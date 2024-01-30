"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";

function Embed({ assistantId, Okey }) {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [thread, setThread] = useState(null);
  const [openai, setOpenai] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  chatRef.current = chat;

  const getAnswer = async (threadId, runId) => {
    const getRun = await openai.beta.threads.runs.retrieve(threadId, runId);

    if (getRun.status == "completed") {
      const messages = await openai.beta.threads.messages.list(threadId);
      setLoading((prev) => false);
      setChat([
        ...chatRef.current,
        { isBot: true, msg: messages.data[0].content[0].text.value },
      ]);
    } else {
      setTimeout(() => getAnswer(threadId, runId), 200);
    }
  };
  const askAssistant = async () => {
    let getQuestion = question;
    setQuestion("");
    let chatList = [...chatRef.current, { isBot: false, msg: getQuestion }];
    setLoading((prev) => true);
    setChat(chatList);
    let getThread;
    if (thread == null) {
      getThread = await openai.beta.threads.create();
      setThread(getThread);
    } else {
      getThread = thread;
    }
    await openai.beta.threads.messages.create(getThread.id, {
      role: "user",
      content: getQuestion,
    });
    const getRun = await openai.beta.threads.runs.create(getThread.id, {
      assistant_id: assistantId,
    });
    getAnswer(getThread.id, getRun.id);
  };
  useEffect(() => {
    if (Okey != "") {
      setOpenai(new OpenAI({ apiKey: Okey, dangerouslyAllowBrowser: true }));
    }
  }, []);

  return (
    <div className="flex-1 w-screen md:p-4 flex flex-col bg-myBg gap-4">
      <div className="flex-1 flex flex-col gap-2 w-full h-full overflow-y-auto scroll">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.isBot
                ? "bg-gray-900 text-gray-100 self-start"
                : "text-gray-900 bg-gray-100 self-end border-2"
            } rounded-lg  px-3 py-2 max-w-sm`}
          >
            {msg.msg}
          </div>
        ))}
        {loading && (
          <div
            className={`bg-gray-900 text-gray-100 self-start rounded-lg  px-3 py-2 max-w-sm`}
          >
            <div className="flex h-4 items-center gap-2">
              <div className="bounce bounce1 rounded-full bg-slate-500 h-2 w-2" />
              <div className="bounce bounce2 rounded-full bg-slate-500 h-2 w-2" />
              <div className="bounce bounce3 rounded-full bg-slate-500 h-2 w-2" />
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-auto">
        <input
          id="question"
          className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          placeholder="Ask a question"
          required
          value={question}
          onKeyDown={(e) => {
            e.code == "Enter" && !e.shiftKey && askAssistant();
          }}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          onClick={askAssistant}
          className="bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2.5 text-center "
        >
          <Image height={20} width={20} src="/send.svg" alt="send" />
        </button>
      </div>
    </div>
  );
}

export default Embed;
