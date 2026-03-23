import { getContactMessages } from "@/actions/contact";
import { MessagesClient } from "./messages-client";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  return <MessagesClient initialMessages={messages} />;
}
