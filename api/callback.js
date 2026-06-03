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

  const content = JSON.stringify({ token: data.access_token, provider: "github" });
  const msg = "authorization:github:success:" + content;

  // COOP unsafe-none preserves window.opener across cross-origin navigation
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Content-Type", "text/html");
  res.send(`<!doctype html><html><body><script>
(function() {
  var msg = ${JSON.stringify(msg)};
  if (window.opener) {
    window.opener.postMessage(msg, '*');
    setTimeout(function() { window.close(); }, 100);
  } else {
    document.body.innerHTML = '<p style="font-family:sans-serif;padding:2rem">Autenticado correctamente. Cierra esta pestaña y vuelve al CMS.</p>';
  }
})();
</script></body></html>`);
}
