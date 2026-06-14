import { NextResponse } from "next/server";
import twilio from "twilio";

const RESERVATION_URL = "https://meet.brevo.com/protoa-digital/kadai-haken";

export async function POST(req: Request) {
  const formData = await req.formData();
  const from = formData.get("From") as string;
  const callStatus = formData.get("CallStatus") as string;
  const recordingSid = formData.get("RecordingSid") as string | null;

  console.log(`[Twilio Status] Call from ${from}, status: ${callStatus}`);

  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  // Send SMS to the caller with the reservation link
  try {
    await twilioClient.messages.create({
      to: from,
      from: process.env.TWILIO_PHONE_NUMBER!,
      body: [
        "ProtoAにお電話ありがとうございます。",
        "",
        "サービスのご予約・ご相談はこちらから:",
        RESERVATION_URL,
        "",
        "折り返しご連絡いたしますので、少々お待ちください。",
        "",
        "ProtoA | DX支援",
        "https://protoa.digital",
      ].join("\n"),
    });
    console.log(`[Twilio SMS] Sent reservation link to ${from}`);
  } catch (err) {
    console.error(`[Twilio SMS] Failed to send to ${from}:`, err);
  }

  // Send LINE notification to the team
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserIds =
    process.env.LINE_ADMIN_USER_IDS?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) ?? [];

  if (lineToken && lineUserIds.length > 0) {
    const lineMessage = [
      "📞 着信あり（不在転送）",
      `発信者: ${from}`,
      `ステータス: ${callStatus}`,
      recordingSid ? `録音: https://protoa.digital/api/twilio/recording?sid=${recordingSid}&token=${process.env.TWILIO_RECORDING_TOKEN}` : "録音: なし",
      `日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
      "",
      "→ SMSで予約リンクを送信済み",
    ].join("\n");

    await Promise.all(
      lineUserIds.map(async (uid) => {
        try {
          await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${lineToken}`,
            },
            body: JSON.stringify({
              to: uid,
              messages: [{ type: "text", text: lineMessage }],
            }),
          });
        } catch (err) {
          console.error(`[LINE push error for ${uid}]:`, err);
        }
      })
    );
  }

  // Return empty TwiML to end the call
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();
  twiml.hangup();

  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
