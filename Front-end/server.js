import express from "express";

const app = express();
const PORT = 3000;

// create a mock directory to serve as database
app.use(express.static("mock"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
