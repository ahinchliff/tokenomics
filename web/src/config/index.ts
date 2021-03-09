const config: web.Config = {
  apiEndpoint:
    process.env.NODE_ENV === "production"
      ? window.location.origin
      : "http://localhost:3000",
  socketEndpoint:
    process.env.NODE_ENV === "production"
      ? window.location.origin.replace(/^http/, "ws")
      : "ws://localhost:3000",
};
export default config;
