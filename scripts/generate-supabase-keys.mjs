import crypto from "node:crypto"

const jwtSecret = process.argv[2]

if (!jwtSecret || jwtSecret.length < 32) {
  console.error("Usage: node scripts/generate-supabase-keys.mjs <jwt-secret-32-chars-min>")
  process.exit(1)
}

const base64Url = (value) =>
  Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

const sign = (role) => {
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload = base64Url(
    JSON.stringify({
      iss: "supabase",
      ref: "local",
      role,
      iat: 1642646000,
      exp: 1958222000,
    })
  )
  const signature = crypto
    .createHmac("sha256", jwtSecret)
    .update(`${header}.${payload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

  return `${header}.${payload}.${signature}`
}

console.log(`JWT_SECRET=${jwtSecret}`)
console.log(`SUPABASE_ANON_KEY=${sign("anon")}`)
console.log(`SUPABASE_SERVICE_ROLE_KEY=${sign("service_role")}`)
