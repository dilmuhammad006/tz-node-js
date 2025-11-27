import axios from "axios";
import express from "express";

const app = express();
app.use(express.json());

const BASE_URL = "https://test.icorp.uz/interview.php";
const WEBHOOK_URL = "https://tz-node-js.onrender.com/webhook";

let part1 = "";
let part2 = "";

app.post("/webhook", (req, res) => {
  console.log("📥 Webhook ga ma'lumot keldi:", req.body);

  part2 = req.body.part2 || req.body.code_part2 || req.body.code || "";


  res.status(200).json({ status: "received", part2 });
});

app.get("/", async (req, res) => {
  try {

    const response = await axios.post(BASE_URL, {
      msg: "Salom",
      url: WEBHOOK_URL,
    });
    part1 =
      response.data.part1 ||
      response.data.code_part1 ||
      response.data.code ||
      "";


    let attempts = 0;
    while (!part2 && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    }

    if (!part2) {
      return res.status(408).json({
        error: "Part 2 kelmadi",
        part1,
        message: "Webhook ishlamayotgan bo'lishi mumkin",
      });
    }

    const connected = part1 + part2;
    const result = await axios.get(`${BASE_URL}?code=${connected}`);

    res.status(200).json({
      success: true,
      message: result.data.message || result.data,
      code: connected,
      part1,
      part2,
    });
  } catch (error) {
    console.error("❌ Xatolik:", error.message);
    res.status(500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("server is running");
});
