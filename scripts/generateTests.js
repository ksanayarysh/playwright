import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateTests() {
  const prompt = fs.readFileSync("./prompts/generateTests.txt", "utf-8");

  const response = await client.chat.completions.create({
    model: "gpt-5.2",
    messages: [{ role: "user", content: prompt }]
  });

  const code = response.choices[0].message.content;

  fs.writeFileSync(
    "./tests/login.generated.spec.js",
    code
  );
}

generateTests();
