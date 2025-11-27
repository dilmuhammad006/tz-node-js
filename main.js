import express from "express";
const BASE_URL = "https://test.icorp.uz/interview.php";

const response1 = await fetch(BASE_URL, {
  method: "POST",
  body: JSON.stringify({ msg: "Salom", url: "https://example-test-tz.uz" }),
  headers: {
    "Content-Type": "application/json",
  },
});
const part1 = await response1.json();

console.log(part1);

const app = express();

app.listen(3000, () => {
  console.log("server running");
});
