"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { useSession } from "next-auth/react";
import { v4 } from "uuid";
import Modal from "@mui/material/Modal";
import Signup from "@/app/signup/page";

function ChatComponent({ assistantId, Okey }) {
  const { data: session, status } = useSession();
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([
    {
      isBot: true,
      msg: "Bonjour, je suis là pour répondre à toutes vos questions administratives ou de comptabilité.",
    },
  ]);
  const [thread, setThread] = useState(null);
  const [openai, setOpenai] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [nbMessages, setNbMessages] = useState(0);
  const [messageId] = useState(v4());
  const chatRef = useRef(null);
  chatRef.current = chat;

  const postMessage = async (message) => {
    let supabase;
    let supabase_rep;
    if (session?.user_id) {
      supabase = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_KEY,
        {
          global: {
            headers: { Authorization: `Bearer ${session?.access_token}` },
          },
        }
      );
      supabase_rep = await supabase.from("message").upsert({
        session_id: session.access_token.substr(
          session.access_token.length - 10
        ),
        message: message,
        user_id: session.user_id,
      });
    } else {
      console.log("user_id doesn't exist in session");
      supabase = supabase_rep = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_KEY
      );
      if (process.env.NODE_ENV === "production")
        supabase_rep = await supabase.from("message_no_logged").upsert({
          message_id: messageId,
          message: message,
        });
    }
  };

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
  const askAssistant = async (questionInput = "", isAutomatic = false) => {
    if (!openai) {
      console.log("OpenAI client n'est pas encore initialisé.");
      return;
    }
    let getQuestion = questionInput || question;
    setQuestion("");
    if (!isAutomatic) {
      setNbMessages(nbMessages + 1);
      let chatList = [...chatRef.current, { isBot: false, msg: getQuestion }];
      setChat(chatList);
    }
    setLoading((prev) => true);
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
      const openaiInstance = new OpenAI({
        apiKey: Okey,
        dangerouslyAllowBrowser: true,
      });
      setOpenai(openaiInstance);
    }
  }, [Okey]);

  // useEffect(() => {
  //   if (openai && Okey) {
  //     askAssistant(
  //       "Bonjour présente toi, rappelle bien que tu es là pour expliquer l'ensemble des prestations sociales auxquelles j'ai droit \
  //       et dis moi en quoi tu peux m'aider à connaitre toutes les prestations sociales auxquelles j'ai droit.",
  //       true
  //     );
  //   }
  // }, [openai, Okey]);

  useEffect(() => {
    if (nbMessages > 0) postMessage(chat.slice(1));
  }, [chat]);

  return (
    <div className="flex-1 w-screen p-4 flex flex-col gap-4 bg-myBg">
      <div className="flex-1 flex flex-col gap-2 w-full h-full overflow-y-auto scroll">
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.isBot
                ? "bg-gray-900 text-gray-100 self-start"
                : "text-gray-900 bg-gray-100 self-end border-2"
            } rounded-lg  px-3 py-2 max-w-2xl text-sm sm:text-base`}
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
          placeholder="Pose une question"
          required
          value={question}
          onKeyDown={(e) => {
            e.code == "Enter" && !e.shiftKey && askAssistant();
          }}
          onChange={(e) => setQuestion(e.target.value)}
          onClick={status !== "authenticated" ? () => setModal(true) : () => {}}
        />
        <button
          onClick={() => askAssistant()}
          className="bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-4 py-2.5 text-center "
        >
          <Image height={20} width={20} src="/send.svg" alt="send" />
        </button>

        {/* <Modal open={modal}>
          <div className="absolute bg-white pb-10 w-1/2 top-1/4 left-1/4 rounded-lg bg-myBg">
            <Signup />
          </div>
        </Modal> */}
      </div>
    </div>
  );
}

export default ChatComponent;
