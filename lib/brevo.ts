const BREVO_API_URL = "https://api.brevo.com/v3/contacts";

export async function createBrevoContact(
  email: string,
  attributes: Record<string, string | undefined>,
  listIds: number[]
) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const cleanAttributes = Object.fromEntries(
    Object.entries(attributes).filter(([, v]) => v !== undefined)
  );

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        attributes: cleanAttributes,
        listIds,
        updateEnabled: true,
      }),
    });

    if (!res.ok && res.status !== 204) {
      console.error("Brevo contact creation failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Brevo contact creation error:", err);
  }
}
