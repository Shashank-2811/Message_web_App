import { FC, useState, useRef, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { FullMessageType } from "../../../utils/Types";
import useConversation from "../../../utils/hooks/useConversation";
import MessageBox from "./MessageBox";
import pusherClient from "../../../utils/Pusher/pusher";
import { find } from "lodash";

const SERVER_URL = process.env.REACT_APP_SERVER_PAGE_URL;

interface ChatBodyProps {
  initialMessages: FullMessageType[];
}

const ChatBody: FC<ChatBodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const { id } = useParams<{ id: string }>();

  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("Token not found");
          throw new Error("Token not found");
        }

        await axios.post(
          `${SERVER_URL}/api/${conversationId}/seen`,
          { },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error: any) {
        console.error(
          "Error while marking conversation as seen:",
          error.message
        );
      }
    })();
  }, [conversationId, id]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token not found");
        throw new Error("Token not found");
      }
      axios.post(
        `${SERVER_URL}/api/${conversationId}/seen`,
        { conversationId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((current) => {
        if (find(current, { is: message.id })) {
          return current;
        }
        return [...current, message];
      });
      bottomRef.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default ChatBody;
