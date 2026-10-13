/**
 * OAuth proxy for Decap CMS on GitHub Pages (no server of its own).
 * Decap opens /auth in a popup; GitHub redirects back to /callback, which
 * exchanges the code for a token and hands it to the CMS via postMessage.
 */

// Decap's popup handshake: announce, wait for the opener's ack, send the result.
const resultPage = (payload) => `<!doctype html>
<title>Signing in…</title>
<p>Signing in…</p>
<script>
  (function () {
    function receive(e) {
      window.opener.postMessage(${JSON.stringify(payload).replace(/</g, "\\u003c")}, e.origin);
      window.removeEventListener("message", receive);
    }
    window.addEventListener("message", receive);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>`;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/auth") {
      const state = crypto.randomUUID();
      const authorize = new URL("https://github.com/login/oauth/authorize");
      authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorize.searchParams.set("redirect_uri", `${url.origin}/callback`);
      authorize.searchParams.set("scope", "repo,user");
      authorize.searchParams.set("state", state);
      return new Response(null, {
        status: 302,
        headers: {
          Location: authorize.href,
          // CSRF guard: GitHub echoes `state` back; /callback compares it to this cookie.
          "Set-Cookie": `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/callback; Max-Age=600`,
        },
      });
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const cookieState = (req.headers.get("Cookie") ?? "").match(/oauth_state=([\w-]+)/)?.[1];
      let payload;
      if (!code || !state || state !== cookieState) {
        payload = `authorization:github:error:${JSON.stringify({ error: "invalid state or missing code" })}`;
      } else {
        const res = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "grintbyte-decap-oauth",
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        });
        const body = await res.json();
        payload = body.error
          ? `authorization:github:error:${JSON.stringify(body)}`
          : `authorization:github:success:${JSON.stringify({ token: body.access_token, provider: "github" })}`;
      }
      return new Response(resultPage(payload), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Set-Cookie": "oauth_state=; Path=/callback; Max-Age=0",
        },
      });
    }

    return new Response("GrintByte Decap OAuth proxy. Nothing to see here.", { status: 404 });
  },
};
