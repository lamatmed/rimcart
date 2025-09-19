import { openai } from "@/config/openai";
import { authSeller } from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";


async function main(base64Image,mimeType){
     const messages = [
     { "role": "system",
      "content":`You are a Product listing assistant for an e-commerce store.
      Your job is to analyze an image of a product and generate  structured data.
      Respond ONLY with row JSON (no code block,no markdown, no explanation).
      The JSON must strictly follow this schema:
      {
      "name": string,
      "description": string 
      } `
    },   
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyze this image and return name + description.",
        },
        {
          "type": "image_url",
          "image_url": {
            "url": `data:${mimeType};base64,${base64Image}`
          },
        },
      ],
    }
  ];
 const response = await openai.chat.completions.create({
  model: process.env.OPENAI_MODEL,
  messages,
});


    const raw = response.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g,"").trim();
    let parsed;
    try {
        parsed = JSON.parse(cleaned)
    } catch (error) {
        throw new Error("AI did not return valid JSON");
        
    }
return parsed;
}
export async function POST(req){
    try {
        const {userId} = getAuth(req)
        const isSeller = await authSeller(userId)
        if(!isSeller){
            return NextResponse.json({error:'not authorized'},{status: 401})
        }
        const {base64Image, mimeType} = await req.json()
         console.log(base64Image, mimeType);
        const result = await main(base64Image,mimeType)
        return NextResponse.json({...result})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error.code || error.message}, {status:400})
    }
}