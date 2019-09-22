import app from "./app";

const PORT = 4000;

const handleListening = () =>
  console.log(`Listeneing on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
