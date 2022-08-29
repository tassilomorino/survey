import { useContext } from "react";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { StateContext } from "../../state/State";
import { endpoint } from "../../state/axiosInstance";

export const socket = io(endpoint);

export default function useSocket() {
  const { dispatch, events } = useContext(StateContext);
  const handleTicket = (data) => {
    dispatch({
      type: "ADD_SINGLE",
      context: "messages",
      payload: {
        ...JSON.parse(data),
        isRead: false,
        ctx: "signup",
      },
    });
    dispatch({
      type: "ADD_SINGLE",
      context: "officials",
      payload: JSON.parse(data),
    });
    notifyMe(data);
  };

  const handleMessage = (data) => {
    dispatch({
      type: "ADD_SINGLE",
      context: "messages",
      payload: {
        ...data,
        isRead: false,
        ctx: "message",
      },
    });
    notifyMe(data);
  };

  const handleEvent = (data) => {
    dispatch({
      type: "ADD_SINGLE",
      context: "events",
      payload: { ...data, isNew: true },
    });
    dispatch({
      type: "ADD_SINGLE",
      context: "messages",
      payload: {
        ...data,
        isRead: false,
        ctx: "events",
      },
    });
    notifyMe(data);
  };

  useEffect(() => {
    socket.on("new_agent", handleTicket);
    socket.on("new_message", handleMessage);
    socket.on("new_event", handleEvent);
    socket.on("new_vote", handleVote);

    return () => {
      socket.off("new_agent", handleTicket);
      socket.off("new_message", handleMessage);
      socket.off("new_event", handleEvent);
      socket.off("new_vote", handleVote);
    };
  }, []);

  function handleVote(data) {
    dispatch({
      type: "ADD_SINGLE",
      context: "votes",
      payload: data,
    });
  }

  return io;
}

export function notifyMe(id) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    var notification = new Notification(id);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }
}
