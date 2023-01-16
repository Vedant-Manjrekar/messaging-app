import React from "react";
import { Button } from "@mui/material";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import logo from "../css/contact.ico";

const loginUsingGoogle = () => {
  signInWithPopup(auth, provider)
    .then((res) => console.log(res))
    .catch((err) => alert(err));
};

function Login() {
  return (
    <div className="login">
      <div className="whatsapp--logo">
        <img src={logo} alt="whatsapp_logo" />
      </div>
      <p className="login--head">Continue using</p>

      <Button onClick={loginUsingGoogle}>
        <img
          className="google--logo"
          src="	https://cdn-icons-png.flaticon.com/512/281/281764.png"
          alt=""
        />
      </Button>
    </div>
  );
}

export default Login;
