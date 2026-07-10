import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testModel(modelName) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "hello",
    });
    console.log(`[${modelName}] Success!`);
  } catch (error) {
    console.log(`[${modelName}] Error: ${error.message}`);
  }
}

async function main() {
  await testModel('gemini-3.5-flash');
  await testModel('gemini-2.5-flash-lite');
  await testModel('gemini-flash-lite-latest');
  await testModel('gemini-2.5-pro');
}
main();
