"use client";
import { TextField } from "@mui/material";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async () => {
    const supabase = await createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_KEY
    );
    await supabase.auth.signUp({ email, password });
  };
  return (
    <div id="signup" className="flex flex-col w-screen items-center">
      <div className="bloc-signup flex flex-col w-1/2 items-center">
        <div className="title mt-10 text-xl">Inscrivez vous</div>
        <div className="form mt-10 w-full">
          <div>Adresse Email</div>
          <TextField
            className="w-full"
            variant="outlined"
            name="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="mt-7">Mot de passe</div>
          <TextField
            className="w-full"
            variant="outlined"
            type="password"
            name="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="mt-7 w-full bg-mySecondary rounded-lg py-2"
            variant="outlined"
            onClick={submitForm}
          >
            Inscrivez vous
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
