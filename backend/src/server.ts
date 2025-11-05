import app from "./app.js";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});


