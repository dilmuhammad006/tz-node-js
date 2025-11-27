import axios from "axios";
import express from "express";

const app = express();
app.use(express.json());

const BASE_URL = "https://test.icorp.uz/interview.php";
const WEBHOOK_URL = "https://tz-node-js.onrender.com/webhook";

let part1 = "";
let part2 = "";

// Webhook
app.post("/webhook", (req, res) => {
  console.log("\n--- WEBHOOK KELDI ---");
  console.log("Body:", req.body);

  part2 = req.body.part2 || req.body.code_part2 || req.body.code || "";

  console.log("Part 2:", part2 || "topilmadi");
  console.log("----------------------\n");

  res.status(200).json({ status: "received", part2 });
});

// Root request
app.get("/", async (_, res) => {
  console.log("\n--- / REQUEST KELDI ---");

  try {
    console.log("BASE_URL ga so‘rov yuborildi");

    const response = await axios.post(BASE_URL, {
      msg: "Salom",
      url: WEBHOOK_URL,
    });

    part1 =
      response.data.part1 ||
      response.data.code_part1 ||
      response.data.code ||
      "";

    console.log("Part 1:", part1 || "topilmadi");




    if (!part2) {
      console.log("Part 2 kelmadi\n");
      return res.status(408).json({
        error: "Part 2 kelmadi",
        part1,
      });
    }

    const connected = part1 + part2;
    console.log("Yakuniy code:", connected);

    const result = await axios.get(`${BASE_URL}?code=${connected}`);

    console.log("Server javobi:", result.data);
    console.log("-------------------------\n");

    res.status(200).json({
      success: true,
      message: result.data.message || result.data,
      code: connected,
      part1,
      part2,
    });
  } catch (error) {
    console.log("Xatolik:", error.message);
    console.log("Response:", error.response?.data);

    res.status(500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server ishlayapti");
});
