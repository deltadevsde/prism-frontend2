"use client";

import React, { useState, useEffect, useRef } from "react";
import * as ed from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import Image from "next/image";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

interface Message {
  user_id: string;
  contents: string;
}

const LoadingIndicator = ({ size = 6, className = "" }) => (
  <Image
    src="/prism_color.svg"
    alt="Loading"
    width={24}
    height={24}
    className={`w-${size} h-${size} animate-prism-sequence ${className}`}
  />
);

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [currentChannel, setCurrentChannel] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isRegistered, setIsRegistered] = useState(false);
  const [userId, setUserId] = useState("");
  const [userIdInput, setUserIdInput] = useState("");
  const [privateKey, setPrivateKey] = useState<Uint8Array | null>(null);
  const [publicKey, setPublicKey] = useState<Uint8Array | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [showNewChannelInput, setShowNewChannelInput] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<{
    [key: string]: string[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdInput.trim()) return;

    setIsRegistering(true);
    try {
      const privKey = ed.utils.randomPrivateKey();
      const pubKey = await ed.getPublicKey(privKey);

      const registerData = {
        private_key: Array.from(privKey),
        id: userIdInput,
        signature: Array.from(privKey),
      };

      const response = await fetch("http://localhost:3000/register_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      setPrivateKey(privKey);
      setPublicKey(pubKey);
      setUserId(userIdInput);

      // we need to wait for the user to be registered before we can send messages
      let userRegistered = false;
      const maxAttempts = 30;
      let attempts = 0;

      while (!userRegistered && attempts < maxAttempts) {
        try {
          const checkResponse = await fetch(
            "http://localhost:3000/check_user",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(Array.from(pubKey)),
            }
          );

          if (checkResponse.ok) {
            userRegistered = await checkResponse.json();

            if (userRegistered) {
              const txData = {
                type: "SendMessage",
                content: "Welcome to the general channel!",
                channel: "general",
                nonce: 0,
              };

              const signatureMessage = new TextEncoder().encode(
                JSON.stringify(txData)
              );
              const signature = await ed.sign(signatureMessage, privKey);

              const messageData = {
                user: Array.from(pubKey),
                contents: "Welcome to the general channel!",
                channel: "general",
                signature: Array.from(signature),
              };

              await fetch("http://localhost:3000/send_message", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(messageData),
              });

              setCurrentChannel("general");
              setIsRegistered(true);
              await new Promise((resolve) => setTimeout(resolve, 2000)); // wait a bit for the channel to be created
              break;
            }
          }
        } catch (error) {
          console.error("Error checking registration:", error);
        }
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 sec between attempts
      }

      if (!userRegistered) {
        throw new Error("Registration timed out. Please try again.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };
  // Fetch channels periodically
  useEffect(() => {
    if (!isRegistered) return;

    const fetchChannels = async () => {
      try {
        const response = await fetch("http://localhost:3000/list_channels");
        const channelList = await response.json();
        setChannels(channelList);

        if (channelList.length > 0 && !currentChannel) {
          setCurrentChannel(channelList[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    setIsLoading(true);
    fetchChannels();
    const interval = setInterval(fetchChannels, 3000);
    return () => clearInterval(interval);
  }, [isRegistered, currentChannel]);

  // Fetch messages for current channel
  useEffect(() => {
    if (!currentChannel || !isRegistered) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/read_channel/${currentChannel}`
        );
        const channelMessages = (await response.json()) as Message[];
        if (channelMessages) {
          setMessages(channelMessages);
          // Clear pending messages for this channel if they appear in actual messages
          setPendingMessages((prev) => ({
            ...prev,
            [currentChannel]:
              prev[currentChannel]?.filter(
                (msg) => !channelMessages.some((m) => m.contents === msg)
              ) || [],
          }));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const interval = setInterval(fetchMessages, 1000);
    return () => clearInterval(interval);
  }, [currentChannel, isRegistered]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentChannel || !isRegistered) return;

    setIsSendingMessage(true);

    // Add to pending messages immediately
    setPendingMessages((prev) => ({
      ...prev,
      [currentChannel]: [...(prev[currentChannel] || []), inputMessage],
    }));

    try {
      const txData = {
        type: "SendMessage",
        content: inputMessage,
        channel: currentChannel,
        nonce: 0,
      };

      const signatureMessage = new TextEncoder().encode(JSON.stringify(txData));
      const signature = await ed.sign(signatureMessage, privateKey!);

      const messageData = {
        user: Array.from(publicKey!),
        contents: inputMessage,
        channel: currentChannel,
        signature: Array.from(signature),
      };

      const response = await fetch("http://localhost:3000/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setInputMessage("");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    // Send first message to create channel
    try {
      const txData = {
        type: "SendMessage",
        content: `Channel "${newChannelName}" created`,
        channel: newChannelName,
        nonce: 0,
      };

      const signatureMessage = new TextEncoder().encode(JSON.stringify(txData));
      const signature = await ed.sign(signatureMessage, privateKey!);

      const messageData = {
        user: Array.from(publicKey!),
        contents: `Channel "${newChannelName}" created`,
        channel: newChannelName,
        signature: Array.from(signature),
      };

      const response = await fetch("http://localhost:3000/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setCurrentChannel(newChannelName);
        setNewChannelName("");
        setShowNewChannelInput(false);
      }
    } catch (error) {
      console.error("Error creating channel:", error);
      alert("Failed to create channel. Please try again.");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </button>
    );
  }
  //<p className="text-xs -mt-5 text-gray-600 leading-4">powered by Dwight K. Schrute</p>

  return (
    <div
      className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 
                bg-black/80 backdrop-blur-sm p-6 rounded-lg 
                border border-white/10 shadow-lg w-[440px] h-[634px] 
                flex flex-col"
    >
      {!isRegistered ? (
        <div className="flex flex-col space-y-4">
          <h2 className="font-semibold text-lg">Welcome to Prism Chat</h2>
          <p className="text-sm text-gray-500">
            Please choose a username to continue
          </p>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              placeholder="Enter username"
              className="flex h-10 w-full rounded-md border border-white/10 
              bg-black/40 backdrop-blur-sm px-3 py-2 text-sm 
              placeholder-gray-400 text-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-400/50 
              disabled:opacity-50"
              disabled={isRegistering}
            />
            <button
              type="submit"
              disabled={isRegistering}
              className="inline-flex items-center justify-center rounded-md 
              text-sm font-medium text-gray-100 
              bg-black/60 border border-white/10 
              hover:bg-black hover:scale-105 
              h-10 px-4 py-2 disabled:opacity-50
              transition-all duration-300"
            >
              {isRegistering ? (
                <div className="flex items-center space-x-2">
                  <LoadingIndicator size={4} />
                  <span>Registering...</span>
                </div>
              ) : (
                "Start Chatting"
              )}
            </button>
          </form>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <LoadingIndicator size={4} />
          <span className="text-gray-400">Loading channels...</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-blue-400 font-display text-center">
                Prism Chat
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-500 hover:text-blue-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-blue-300">Writing as: {userId}</p>

            {/* Channel selector */}

            {channels.length > 0 ? (
              <div className="flex items-center space-x-2 pt-2">
                <select
                  value={currentChannel}
                  onChange={(e) => setCurrentChannel(e.target.value)}
                  className="flex h-8 rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  {channels.map((channel) => (
                    <option key={channel} value={channel}>
                      {channel}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewChannelInput(!showNewChannelInput)}
                  className="text-sm text-blue-500 hover:text-blue-300"
                >
                  + New Channel
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LoadingIndicator size={4} />
                <span className="text-blue-300">Loading Channels...</span>
              </div>
            )}

            {/* New channel input */}
            {showNewChannelInput && (
              <form
                onSubmit={handleCreateChannel}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="Channel name"
                  className="flex h-8 rounded-md border border-gray-200 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                  type="submit"
                  className="text-sm text-gray-50 bg-black hover:bg-gray-800 rounded-md px-3 py-1"
                >
                  Create
                </button>
              </form>
            )}
          </div>

          {/* Messages container with flex-grow */}
          <div className="flex-grow overflow-hidden flex flex-col mt-4">
            <div className="flex-grow overflow-y-auto pr-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="flex gap-3 my-4 text-gray-600 text-sm"
                >
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                    <div className="rounded-full bg-blue-500 border p-1">
                      <svg
                        stroke="none"
                        fill="white"
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        height="20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                      </svg>
                    </div>
                  </span>
                  {msg.contents.includes("Welcome to") ? (
                    <p className="leading-relaxed text-blue-200">
                      {msg.user_id} 😊 {msg.contents}
                    </p>
                  ) : (
                    <p className="leading-relaxed text-blue-200">
                      <span className="block font-bold text-white">
                        {msg.user_id}
                      </span>
                      {msg.contents}
                    </p>
                  )}
                </div>
              ))}

              {/* Pending messages */}
              {pendingMessages[currentChannel]?.map((msg, index) => (
                <div
                  key={`pending-${index}`}
                  className="flex gap-3 my-4 text-gray-400 text-sm"
                >
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                    <div className="rounded-full bg-gray-100 border p-1">
                      <svg
                        stroke="none"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        height="20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                      </svg>
                    </div>
                  </span>
                  <p className="leading-relaxed">
                    <span className="block font-bold text-gray-400">
                      {userId}
                    </span>
                    {msg}
                    <span className="ml-2 text-xs italic">sending...</span>
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message input at bottom */}
          <div className="pt-4">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center justify-center w-full space-x-2"
            >
              <input
                className="flex h-10 w-full bg-blue-950 rounded-md border border-blue-200 px-3 py-2 text-sm placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                placeholder="Type your message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isSendingMessage}
              />
              <button
                type="submit"
                disabled={isSendingMessage}
                className="inline-flex items-center justify-center rounded-md 
             text-sm font-medium text-blue-200 
             bg-blue/60 border border-blue/10 
             hover:bg-blue hover:scale-105 
             h-10 px-4 py-2 disabled:opacity-80
             transition-all duration-300"
              >
                {isSendingMessage ? (
                  <div className="flex items-center space-x-2">
                    <LoadingIndicator size={4} />
                    <span>Sending</span>
                  </div>
                ) : (
                  "Send"
                )}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
