import { NextResponse } from "next/server";
import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(req: Request) {
  const formData = await req.formData();
  const from = formData.get("From") as string;

  const twiml = new VoiceResponse();

  twiml.say(
    { language: "ja-JP", voice: "Polly.Kazuha" as unknown as "Polly.Mizuki" },
    "お電話ありがとうございます。泡盛と沖縄料理、郷家です。ただいま電話に出ることができません。のちほどSMSにてご連絡いたします。"
  );

  twiml.pause({ length: 1 });

  twiml.say(
    { language: "ja-JP", voice: "Polly.Kazuha" as unknown as "Polly.Mizuki" },
    "発信音のあとにメッセージをお残しください。"
  );

  twiml.record({
    maxLength: 120,
    transcribe: false,
    action: "/api/twilio/status",
    method: "POST",
  });

  console.log(`[Twilio Voice] Incoming call from: ${from}`);

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
