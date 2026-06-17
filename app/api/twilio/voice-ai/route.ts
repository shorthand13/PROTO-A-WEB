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
    ttsProvider: "Google",
    voice: "ja-JP-Neural2-B",
    welcomeGreeting:
      "お電話ありがとうございます。泡盛と沖縄料理、ゴーヤです。ご予約やお問い合わせなど、お気軽にどうぞ。",
    interruptible: "speech",
  });

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
