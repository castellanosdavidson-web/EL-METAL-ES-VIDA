import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiKey) {
  console.error("Missing environment variables. Check .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const ai = new GoogleGenAI({ apiKey: geminiKey });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateContent(title, desc, retries = 3) {
  try {
    const prompt = `Translate the following title and HTML description from Spanish to English. Return a JSON object exactly with keys "title_en" and "desc_en". Do not modify any HTML tags, classes, or URLs in the description, only translate the readable text.
Title: ${title}
Description: ${desc}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const result = JSON.parse(response.text || '{}');
    return {
      title_en: result.title_en || '',
      desc_en: result.desc_en || ''
    };
  } catch (error) {
    if (error.status === 429 && retries > 0) {
      console.log('Rate limit exceeded. Waiting 60 seconds...');
      await delay(60000);
      return translateContent(title, desc, retries - 1);
    }
    console.error('Translation error:', error);
    return null;
  }
}

async function main() {
  console.log("Fetching posts.json from Supabase...");
  const { data: fileData, error: downloadError } = await supabase.storage
    .from('articles')
    .download('posts.json');

  if (downloadError || !fileData) {
    console.error("Error downloading posts.json", downloadError);
    return;
  }

  const text = await fileData.text();
  let posts = JSON.parse(text || '[]');
  
  console.log(`Found ${posts.length} posts.`);

  let modifiedCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    
    // Check if translation is missing
    if (!post.title_en || !post.desc_en) {
      console.log(`[${i + 1}/${posts.length}] Translating: ${post.title}...`);
      
      const translation = await translateContent(post.title, post.desc || '');
      
      if (translation) {
        posts[i].title_en = translation.title_en || post.title;
        posts[i].desc_en = translation.desc_en || post.desc;
        modifiedCount++;
        
        // Wait 13 seconds to avoid rate limits on free tier (max 5 per minute)
        await delay(13000);
      } else {
        console.log(`Failed to translate: ${post.title}`);
      }
    } else {
      console.log(`[${i + 1}/${posts.length}] Skipping (already translated): ${post.title}`);
    }
  }

  if (modifiedCount > 0) {
    console.log(`\nTranslated ${modifiedCount} new posts. Uploading back to Supabase...`);
    const { error: updateError } = await supabase.storage
      .from('articles')
      .upload('posts.json', JSON.stringify(posts), {
        upsert: true,
        contentType: 'application/json'
      });

    if (updateError) {
      console.error("Error uploading to Supabase:", updateError);
    } else {
      console.log("Successfully updated posts.json!");
    }
  } else {
    console.log("\nNo new posts needed translation.");
  }
}

main().catch(console.error);
