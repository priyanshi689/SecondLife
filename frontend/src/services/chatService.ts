import { api, isBackendConfigured } from "./api";

/** POST /chat/message (contract). Response shape to be confirmed with backend. */
export async function sendChatMessage(message: string): Promise<string> {
  if (!isBackendConfigured) {
    throw new Error("GREEN AI isn't connected yet. Your team's backend will power answers here.");
  }
  const { data } = await api.post<{ reply: string }>("/chat/message", { message });
  return data.reply;
}
