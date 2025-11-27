import axios from "axios";
import express from "express";
const app = express();
app.use(express.json());
const BASE_URL = "https://test.icorp.uz/interview.php";

let part1 = "";
let part2 = "";

app.post("/webhook", (req, res) => {
  part2 = req.body.part2;
  res.send("keldi");
});

app.get("/", async (_, res) => {
  try {
    const response = await axios.get(BASE_URL, {
      method: "POST",
      body: JSON.stringify({ msg: "Salom", url: "https://example-test-tz.uz" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    part1 = response.part1;
    let connected = part1 + part2;

    let result = await axios.get(`${BASE_URL}?code=${connected}`);
    res.status(200).send({
      message: result.message,
    });
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(3000, () => {
  console.log("server running");
});
