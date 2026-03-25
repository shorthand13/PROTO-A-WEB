import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Verify the webhook secret
  const secret = request.headers.get("X-Microcms-Webhook-Secret");
  if (secret !== process.env.MICROCMS_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { api } = body;

    // Revalidate based on which content type was updated
    if (api === "case-studies") {
      revalidatePath("/[locale]/case-studies", "page");
      revalidatePath("/[locale]", "page"); // homepage also shows case studies
    } else if (api === "blogs") {
      revalidatePath("/[locale]/blog", "page");
      revalidatePath("/[locale]", "page");
    } else {
      // Revalidate everything if unknown content type
      revalidatePath("/", "layout");
    }

    return NextResponse.json({
      revalidated: true,
      api,
      now: Date.now(),
    });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
