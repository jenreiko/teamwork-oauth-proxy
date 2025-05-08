export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing required parameter: code" });
  }

  const client_id = process.env.TEAMWORK_CLIENT_ID;
  const client_secret = process.env.TEAMWORK_CLIENT_SECRET;
  const redirect_uri = "https://teamwork-oauth-proxy.vercel.app/oauth-callback.html";

  const tokenUrl = "https://www.teamwork.com/launchpad/v1/token.json";

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code,
        client_id,
        client_secret,
        grant_type: "authorization_code",
        redirect_uri
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Token exchange failed", detail: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Unexpected error", detail: err.message });
  }
}