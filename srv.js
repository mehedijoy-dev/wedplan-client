const uri = process.env.MONGODB_URI;
const m = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)/);
if (!m) {
  console.log("MONGODB_URI is not an SRV string. Check .env.local");
  process.exit(1);
}
const [, user, pass, host] = m;

const q = async (type) => {
  const name = (type === "SRV" ? "_mongodb._tcp." : "") + host;
  const res = await fetch(
    `https://dns.google/resolve?name=${name}&type=${type}`,
  );
  const json = await res.json();
  return json.Answer ?? [];
};

(async () => {
  const srv = await q("SRV");
  const txt = await q("TXT");
  if (!srv.length) throw new Error("No SRV answer received");
  const hosts = srv
    .map((a) => {
      const p = a.data.split(" ");
      return `${p[3].replace(/\.$/, "")}:${p[2]}`;
    })
    .join(",");
  const opts = txt.length ? txt[0].data.replace(/"/g, "") : "authSource=admin";
  console.log(
    "\nMONGODB_URI=mongodb://" +
      user +
      ":" +
      pass +
      "@" +
      hosts +
      "/?ssl=true&" +
      opts +
      "&retryWrites=true&w=majority\n",
  );
})().catch((e) => console.log("FAILED:", e.message));
