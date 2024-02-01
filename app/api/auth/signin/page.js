"use client";
import { TextField } from "@mui/material";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submitForm = async () => {
    const { data, error } = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (error) {
      console.log("Erreur d'authentification");
    } else {
      console.log("Vous êtes authentifié");
      router.push("/");
    }
  };
  return (
    <div id="signup" className="flex flex-col w-screen items-center">
      <div className="bloc-signup flex flex-col w-1/2 items-center">
        <div className="title mt-10 text-xl">Connectez vous</div>
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
            Connectez vous
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
