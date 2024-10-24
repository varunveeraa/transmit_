import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, IMessage, InputToolbar, Send, Composer } from "react-native-gifted-chat";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons'; // For send icon

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { displayName } = useLocalSearchParams(); // Get displayName from params

  // Ensure displayName is a string, not an array
  const chatDisplayName = Array.isArray(displayName)
    ? displayName[0]
    : displayName;

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: chatDisplayName || "Unknown User", // Use the displayName param for the chat
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
  }, [chatDisplayName]);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  // Custom InputToolbar with dark mode styling
  const renderInputToolbar = (props: any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "#1e1e1e", // Dark background
          borderTopColor: "#444", // Darker border
          padding: 8,
        }}
      />
    );
  };

  // // Custom Composer with dark mode styling
  // const renderComposer = (props: any) => {
  //   return (
  //     <Composer
  //       {...props}
  //       textInputStyle={{
  //         color: "#ffffff", // White text input
  //         backgroundColor: "#2a2a2a", // Dark background
  //         borderRadius: 20,
  //         paddingHorizontal: 15,
  //       }}
  //       placeholder="Type a message..." // Make sure the placeholder is correctly set
  //       placeholderTextColor="#888" // Add placeholder text color to avoid error
  //     />
  //   );
  // };

  // Custom Send button with dark mode styling
  const renderSend = (props: any) => (
    <Send {...props}>
      <View style={{ marginRight: 10, marginBottom: 5 }}>
        <Ionicons name="send" size={24} color="#00A86B" /> {/* Green send icon */}
      </View>
    </Send>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <Stack.Screen
        options={{
          title: chatDisplayName,
        }}
      />
      <StatusBar style="light" />

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderInputToolbar={renderInputToolbar} 
        messagesContainerStyle={{
          backgroundColor: "#121212", 
        }}
      />
    </View>
  );
}
