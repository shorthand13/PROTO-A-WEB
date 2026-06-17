import { NextResponse } from "next/server";
import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;

const WS_URL = process.env.CONVERSATION_RELAY_WS_URL || "wss://localhost:8080";

export async function POST(req: Request) {
  const formData = await req.formData();
  const from = formData.get("From") as string;

  console.log(`[Twilio Voice AI] Incoming call from: ${from}`);

  const twiml = new VoiceResponse();

  const connect = twiml.connect();
  const conversationRelay = connect.conversationRelay({
    url: WS_URL,
    language: "ja-JP",
    welcomeGreeting:
      "お電話ありがとうございます。ゴーヤです。ご予約やお問い合わせ、お気軽にどうぞ。",
  });

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
