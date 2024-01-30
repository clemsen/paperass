"use client";
import { FormControl, InputLabel, Input, FormHelperText } from "@mui/material";

const Signup = () => {
  return (
    <div id="signup">
      <FormControl>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
        <FormHelperText id="my-helper-text"></FormHelperText>
      </FormControl>
    </div>
  );
};

export default Signup;
