export class PreferenceTally {
  constructor(ctx) {
    this.sql = ctx.storage.sql;
    this.sql.exec("CREATE TABLE IF NOT EXISTS votes (id TEXT PRIMARY KEY, transitive INTEGER NOT NULL)");
    this.sql.exec("CREATE TABLE IF NOT EXISTS coin_votes (id TEXT PRIMARY KEY, fair INTEGER NOT NULL, correct INTEGER NOT NULL, flips INTEGER NOT NULL)");
  }

  async fetch(request) {
    const vote = await request.json();
    if (new URL(request.url).pathname === "/coin") {
      const { id, rate, fair, heads, tails } = vote;
      this.sql.exec("INSERT OR IGNORE INTO coin_votes VALUES (?, ?, ?, ?)", id, Number(fair), Number(fair === (rate === 50)), heads + tails);
      const [result] = this.sql.exec("SELECT COUNT(*) AS total, SUM(correct) AS correct, SUM(fair) AS fairCalls, SUM(flips) AS flips FROM coin_votes");
      return Response.json(result);
    }
    const { id, transitive } = vote;
    this.sql.exec("INSERT OR IGNORE INTO votes VALUES (?, ?)", id, Number(transitive));
    const [result] = this.sql.exec("SELECT COUNT(*) AS total, SUM(transitive) AS transitive FROM votes");
    return Response.json(result);
  }
}

export default {
  async fetch(request, env) {
    const headers = {
      "Access-Control-Allow-Origin": env.SITE_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
      "Vary": "Origin"
    };
    if (request.headers.get("Origin") !== env.SITE_ORIGIN) return new Response(null, { status: 403 });
    const path = new URL(request.url).pathname;
    if (!["/", "/coin"].includes(path)) return new Response(null, { status: 404, headers });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return new Response(null, { status: 405, headers });
    let vote;
    try {
      vote = await request.json();
    } catch {
      return new Response(null, { status: 400, headers });
    }
    if (typeof vote?.id !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(vote.id)) {
      return new Response(null, { status: 400, headers });
    }
    const valid = path === "/" ? typeof vote.transitive === "boolean"
      : [40, 50, 60].includes(vote.rate) && typeof vote.fair === "boolean"
        && [vote.heads, vote.tails].every(n => Number.isSafeInteger(n) && n >= 0)
        && Number.isSafeInteger(vote.heads + vote.tails) && vote.heads + vote.tails > 0;
    if (!valid) return new Response(null, { status: 400, headers });
    const tally = env.TALLY.get(env.TALLY.idFromName("first-rounds"));
    const result = await tally.fetch("https://internal" + path, { method: "POST", body: JSON.stringify(vote) });
    return new Response(result.body, { status: result.status, headers: { ...headers, "Content-Type": "application/json" } });
  }
};
