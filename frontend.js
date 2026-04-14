exports.frontend =
  process.env.NODE_ENV === "production"
    ? "https://portal-honeylandschools-cooperative.vercel.app"
    : "http://localhost:5173";
