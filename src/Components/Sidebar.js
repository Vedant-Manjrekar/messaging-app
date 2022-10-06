import React, { useState, useEffect } from "react";
import { onSnapshot, query, collection } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Avatar, IconButton } from "@mui/material";
import DoughnutLarge from "@mui/icons-material/DonutLargeSharp";
import ChatIcon from "@mui/icons-material/Chat";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SidebarChat from "./SidebarChat";
import db from "../firebase";
import { useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth } from "../firebase";

function Sidebar() {
  const [rooms, setRooms] = useState([]);

  const [searchValue, setsearchValue] = useState("");

  const userState = useSelector((state) => state.user.data);

  const searched_style = {
    display: "flex",
  };

  const searched_style_un = {
    display: "none",
  };

  function logout() {
    console.log("logout");
    signOut(auth);
  }

  function search(e) {
    setsearchValue(e.target.value);
  }

  useEffect(() => {
    const roomColl = collection(db, "rooms");

    const q = query(roomColl);

    onSnapshot(q, (querySnapshot) => {
      setRooms(
        querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    });
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar--header">
        <Avatar src={userState.pic} />
        <IconButton>
          <DoughnutLarge />
        </IconButton>

        <IconButton>
          <ChatIcon />
        </IconButton>

        <div className="logout--btn" onClick={logout}>
          <IconButton>
            <LogoutIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar--search">
        <div className="sidebar--searchContainer">
          <SearchOutlinedIcon />
          <input placeholder="Search" name="" onChange={search} id="" />
        </div>
      </div>

      <div className="sidebar--chats">
        <SidebarChat />
        {/* Search Functionality. */}
        {rooms.map((room) =>
          searchValue == "" || room.data.name.includes(searchValue) ? (
            <>
              <SidebarChat
                addNewChat
                style={searched_style}
                id={room.id}
                key={room.id}
                roomData={rooms}
                name={room.data.name}
              />
            </>
          ) : (
            <SidebarChat
              addNewChat
              style={searched_style_un}
              id={room.id}
              key={room.id}
              roomData={rooms}
              name={room.data.name}
            />
          )
        )}
      </div>
    </div>
  );
}

export default Sidebar;
