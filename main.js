import axios from "axios";
import express from "express";

const app = express();
app.use(express.json());

const BASE_URL = "https://test.icorp.uz/interview.php";
const WEBHOOK_URL = "https://tz-node-js.onrender.com/webhook";

let part1 = "";
let part2 = "";

app.post("/webhook", (req, res) => {
  console.log("\nWEBHOOKGA MA'LUMOT KELDI!");
  console.log("Body:", req.body);

  part2 = req.body.part2 || req.body.code_part2 || req.body.code || "";

  if (part2) {
    console.log("PART 2 QABUL QILINDI:", part2);
  } else {
    console.log("PART 2 topilmadi, API boshqa maydon yuboryapti");
  }

  res.status(200).json({ status: "received", part2 });
});

app.get("/", async (_, res) => {
  try {
    console.log("\n/ ga so'rov tushdi — Jarayon boshlandi...");

    console.log("\n1-qadam: API ga POST yuborilyapti...");
    const response = await axios.post(BASE_URL, {
      msg: "Salom",
      url: WEBHOOK_URL,
    });

    part1 =
      response.data.part1 ||
      response.data.code_part1 ||
      response.data.code ||
      "";

    console.log("ART 1 qabul qilindi:", part1);

    console.log("\n2-qadam: PART 2 webhook orqali kelishini kutyapmiz...");

    let attempts = 0;
    while (!part2 && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
      console.log(`⏱Kutilyapti... (${attempts}/20)`);
    }

    if (!part2) {
      console.log("PART 2 kelmadi. Jarayon to'xtadi.\n");
      return res.status(408).json({
        error: "Part 2 kelmadi",
        part1,
        message: "Webhook ishlamayotgan bo'lishi mumkin",
      });
    }

    console.log("PART 2 topildi:", part2);

    const connected = part1 + part2;
    console.log("\n3-qadam: PART 1 + PART 2 birlashtirildi:");
    console.log("Yakuniy CODE:", connected);

    console.log("\n4-qadam: Yakuniy GET yuborilyapti...");
    const finalResponse = await axios.get(`${BASE_URL}?code=${connected}`);

    console.log("API javobi:", finalResponse.data);

    res.status(200).json({
      success: true,
      message: finalResponse.data.message || finalResponse.data,
      code: connected,
      part1,
      part2,
      status: "OK — hamma jarayon muvaffaqiyatli bajarildi",
    });
  } catch (error) {
    console.log("\nXATOLIK YUZ BERDI:");
    console.log(error);

    res.status(500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\nSERVER ISHGA TUSHDI: http://localhost:${PORT}`);
  console.log(`WEBHOOK URL: ${WEBHOOK_URL}\n`);
});
