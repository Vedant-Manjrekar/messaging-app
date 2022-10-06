import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import * as color from "@mui/material/colors";
import db from "../firebase";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  collection,
  query,
  setDoc,
  doc,
  onSnapshot,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { Link } from "react-router-dom";

function SidebarChat(props) {
  const [seed, setSeed] = React.useState("");

  const [messages, setMessages] = useState([]);

  const deleteRoom = () => {
    const roomCollection = doc(db, "rooms", props.id);
    deleteDoc(roomCollection);

    window.location.replace("/home");
  };

  const newChat = () => {
    const roomname = prompt("Enter Room Name!");

    if (roomname) {
      // * cleverstuff
      const coll = collection(db, "rooms");

      const q = doc(coll);

      setDoc(q, {
        name: roomname,
      });
    }
  };

  useEffect(() => {
    if (props.id) {
      const msgColl = doc(db, "rooms", props.id);

      const q = query(
        collection(msgColl, "messages"),
        orderBy("timestamp", "asc")
      );

      onSnapshot(q, (snapshot) =>
        setMessages(snapshot.docs.map((doc) => doc.data()))
      );
    }
  }, [props.id]);

  React.useEffect(() => {
    setSeed(Math.floor(Math.random() * 3000));
  }, []);

  if (props.addNewChat) {
    return (
      <Link id="link" to={`/rooms/${props.id}`}>
        <div className="sidebar--chat" style={props.style}>
          <Avatar
            src={`https://avatars.dicebear.com/api/male/${props.name}.svg`}
          />
          <div className="sidebar--chat--info">
            <div className="head">
              <h2>{props.name}</h2>
              <button onClick={deleteRoom}>
                <RemoveIcon />
              </button>
            </div>
            {messages.length > 0 && (
              <p className="last--chat">
                {messages[messages.length - 1].messaage}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  } else if (props.addTemp) {
    return (
      <Link id="link" to="/home">
        <div className="sidebar--chat">
          <Avatar src={`https://avatars.dicebear.com/api/male/temp.svg`} />
          <div className="sidebar--chat--info">
            <div className="head">
              <h2>Home</h2>
            </div>
            {messages.length > 0 && (
              <p className="last--chat">
                {messages[messages.length - 1].messaage}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  } else {
    return (
      <div className="newChat sidebar--chat">
        <IconButton onClick={newChat}>
          <h2>Add New Chat</h2>
        </IconButton>
      </div>
    );
  }
}

export default SidebarChat;
