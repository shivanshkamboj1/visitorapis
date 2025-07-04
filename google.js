const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config()
const gemini_api_key = process.env.GOOGLE_API_KEY;

console.log(process.env.GOOGLE_API_KEY)
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite-preview-06-17",
  generationConfig,
});
const generate = async (prompt) => {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    // console.log(response.text());
    return response.text()
  } catch (error) {
    console.log("response error", error);
    return "error in using ai"
  }
};
module.exports = generate