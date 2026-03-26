import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Verify the webhook secret
  const secret = request.headers.get("X-Microcms-Webhook-Secret");
  if (secret !== process.env.MICROCMS_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Webhook received:", JSON.stringify(body));

    const { api } = body;
    console.log("API field:", api);

    // Wait for MicroCMS to propagate the update before revalidating
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Invalidate data cache (fetch-level) and page cache
    if (api === "case-studies") {
      revalidateTag("case-studies", { expire: 0 });
      revalidatePath("/[locale]/case-studies", "layout");
      revalidatePath("/[locale]", "page");
      console.log("Revalidated: case-studies tag + pages");
    } else if (api === "blogs") {
      revalidateTag("blogs", { expire: 0 });
      revalidatePath("/[locale]/blog", "layout");
      revalidatePath("/[locale]", "page");
      console.log("Revalidated: blogs tag + pages");
    } else {
      revalidateTag("case-studies", { expire: 0 });
      revalidateTag("blogs", { expire: 0 });
      revalidatePath("/", "layout");
      console.log("Revalidated: all tags + everything");
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
