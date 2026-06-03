export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    res.status(400).send("Missing code");
    return;
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  if (data.error || !data.access_token) {
    res.status(400).send("OAuth error: " + (data.error ?? "no token"));
    return;
  }

  const token = JSON.stringify({ token: data.access_token, provider: "github" });
  res.setHeader("Content-Type", "text/html");
  res.send(`<script>
    window.opener.postMessage('authorization:github:success:${token}', '*');
    window.close();
  </script>`);
}
