import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sid = req.nextUrl.searchParams.get("sid");
  const token = req.nextUrl.searchParams.get("token");

  if (!sid || !token || token !== process.env.TWILIO_RECORDING_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Recordings/${sid}.mp3`;

  const response = await fetch(twilioUrl, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Recording not found" }, { status: 404 });
  }

  const audio = await response.arrayBuffer();

  return new NextResponse(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `inline; filename="${sid}.mp3"`,
    },
  });
}
