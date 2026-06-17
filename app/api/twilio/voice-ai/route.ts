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
      "お電話ありがとうございます。ゴーヤです。只今電話に出ることができません。ご予約の方は人数と来店時間を教えてください。",
  });

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
