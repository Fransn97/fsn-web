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

  const content = { token: data.access_token, provider: "github" };

  res.setHeader("Content-Type", "text/html");
  res.send(`<!doctype html><html><body><script>
(function() {
  var provider = "github";
  var content = ${JSON.stringify(content)};

  function receiveMessage(e) {
    // El opener confirmó que está listo: enviamos el token
    window.opener.postMessage(
      "authorization:" + provider + ":success:" + JSON.stringify(content),
      e.origin
    );
    window.removeEventListener("message", receiveMessage, false);
  }

  window.addEventListener("message", receiveMessage, false);

  // Paso 1 del handshake: avisamos al opener que estamos autorizando
  window.opener.postMessage("authorizing:" + provider, "*");
})();
</script></body></html>`);
}
