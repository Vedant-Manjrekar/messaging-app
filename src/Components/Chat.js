import { Avatar, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFile";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import MoreVert from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import { useParams } from "react-router-dom";
import Picker from "emoji-picker-react";
import { nanoid } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import Files from "react-files";
import db, { auth } from "../firebase";
import { useSelector } from "react-redux";
import {
  AlignHorizontalCenterSharp,
  AlignVerticalBottom,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useFileUpload } from "use-file-upload";
import { style } from "@mui/system";

function Chat(props) {
  const [input, setInput] = useState("");

  const [file, selectFile] = useFileUpload();
  // console.log(file);

  const [searchInp, setSearchInp] = useState(false);

  const [searchVal, setSearchVal] = useState("");

  const [roomName, setRoomName] = useState("");

  const [msgName, setMsgName] = useState([]);

  const [go, setGo] = useState(false);

  const { roomId } = useParams();

  const [chosenEmoji, setChosenEmoji] = useState(null);

  const visible = {
    display: "flex",
  };

  const invisible = {
    display: "none",
  };

  const dispatch = useDispatch();

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);

    // setting emoji on keyboard.
    document.getElementById("chatBox").value += chosenEmoji.emoji;

    // setting emoji in the state.
    setInput((prevInput) => prevInput + chosenEmoji.emoji);
  };

  const search = () => {
    setSearchInp((prev) => !prev);
  };

  function searchFn(e) {
    setSearchVal(e.target.value);
  }

  const userState = useSelector((state) => state.user.data);

  let [myData, setMyData] = useState([]);

  React.useEffect(() => {
    auth.onAuthStateChanged((Auth) => {
      setMyData(Auth);
    });
  }, [myData]);

  useEffect(() => {
    const chatHistory = document
      .getElementById("chats")
      ?.lastChild?.scrollIntoView();
  }, [msgName]);

  const sendMsg = (e) => {
    e.preventDefault();
    document.getElementById("chatBox").value = "";

    addDoc(collection(db, "rooms", roomId, "messages"), {
      name: userState.name,
      messaage: input,
      timestamp: serverTimestamp(),
      id: nanoid(),
      email: myData.email,
      img_src: file ? file.source : "",
    });

    setInput("");
  };

  React.useEffect(() => {
    if (roomId) {
      const roomColl = doc(db, "rooms", roomId);
      const q = query(roomColl);

      onSnapshot(q, (snapshot) => {
        setRoomName(snapshot.data().name);
      });

      const messegeColl = doc(db, "rooms", roomId);
      const msgQ = query(
        collection(messegeColl, "messages"),
        orderBy("timestamp", "asc")
      );

      onSnapshot(msgQ, (snapshot) => {
        setMsgName(snapshot.docs.map((doc) => doc.data()));
      });
    }
  }, [roomId]);

  function EClick() {
    setGo((prev) => !prev);
  }

  return (
    <div className="chat">
      {!props.noFooter && (
        <div className="chat--header">
          <div className="chat--info">
            <Avatar
              src={`https://avatars.dicebear.com/api/male/${roomName}.svg`}
            />

            <div className="chat--name">
              <h3>{roomName}</h3>
              {msgName.length > 0 && (
                <p>
                  Last Scene at{" "}
                  {msgName[msgName.length - 1]?.timestamp
                    ?.toDate()
                    .toUTCString()}
                </p>
              )}
            </div>
          </div>

          <div className="chat--features">
            {searchInp && <input type="text" id="srch" onKeyUp={searchFn} />}
            <IconButton onClick={search} onKeyUp={searchFn}>
              <SearchOutlined />
            </IconButton>

            <IconButton>
              <input type="image" src="" alt="" />
              <AttachFileOutlinedIcon />
            </IconButton>

            <IconButton>
              <MoreVert />
            </IconButton>
          </div>
        </div>
      )}

      <div className="chats" id="chats">
        {msgName.map((msg) => {
          return (
            <div
              className={
                msg.email == myData.email
                  ? "chat--msg chat--sent "
                  : "chat--msg chat--recieved "
              }
              key={msg.id}
              id="sent"
              style={msg.messaage.includes(searchVal) ? visible : invisible}
            >
              <span className="chat--name">{msg.name}</span>
              <p>{msg.messaage}</p>
              {msg.img_src && (
                <img className="chat--img" src={msg.img_src} alt="img" />
              )}

              <span className="chat--time">
                {new Date(
                  msg.timestamp && msg.timestamp.toDate()
                ).toUTCString()}
              </span>
            </div>
          );
        })}

        {file ? (
          <div
            className="preview"
            onClick={() => {
              document.querySelector(".preview").style = "display: none";
            }}
          >
            <img src={file.source} alt="preview" />
            <span> Selected Image </span>
            <span> Size: {file.size} </span>
          </div>
        ) : (
          <span></span>
        )}
      </div>

      {!props.noFooter && (
        <div className="chat--footer">
          {go && <Picker name="emoji" onEmojiClick={onEmojiClick} />}
          <div className="emoji" id="emoji" onClick={EClick}>
            <IconButton>
              <InsertEmoticonIcon size="large" />
            </IconButton>
          </div>

          <form action="">
            <input
              type="text"
              name="submit"
              onChange={(e) => setInput(e.target.value)}
              id="chatBox"
              placeholder="Message"
            />
            <IconButton>
              <MicIcon id="mic" />
            </IconButton>
            <button onClick={sendMsg} id="submit--btn">
              <IconButton>
                <SendIcon size="medium" />
              </IconButton>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
