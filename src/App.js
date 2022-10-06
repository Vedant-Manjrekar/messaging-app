import React, { useEffect } from "react";
import "./css/main.css";
import Sidebar from "./Components/Sidebar";
import { auth } from "./firebase";
import Chat from "./Components/Chat";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./features/userSlice";

function App() {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user.data);

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            name: userAuth.displayName,
            pic: userAuth.photoURL,
          })
        );
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  return !userState.name ? (
    <Login />
  ) : (
    <div className="app--body">
      <Sidebar />

      <Routes>
        <Route path="/home" element={<Chat noFooter />} />
        <Route path="/rooms/:roomId" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
