import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_KEY = process.env.API_KEY; // Use environment variable
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

if (!API_KEY) {
    console.error("❌ Missing OpenRouter API key! Set it in .env as OPENROUTER_API_KEY");
}

export async function generateQuestions(jobRole, experience) {
    const prompt = experience
        ? `Generate five different professional interview questions for a ${jobRole} role with ${experience} years of experience.`
        : `Generate five different professional interview questions for a ${jobRole} role.`;
console.log(process.env.API_KEY,"api")
    try {
        const response = await axios.post(
            API_URL,
            {
                model: "mistralai/mistral-7b-instruct", // Ensure this model is supported
                messages: [{ role: "user", content: prompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "your-app.com", // Replace with your app’s URL
                },
            }
        );

        return response.data.choices[0]?.message?.content.split('\n').filter(q => q.trim() !== '') || [];
    } catch (error) {
        console.error("❌ OpenRouter API Error:", error.response?.data || error.message);
        return "Error generating questions.";
    }
}

async function analyzeAnswerAspect(body, aspect) {
    const prompt = `
    Analyze the following interview response for the question "${body.question}" 
    based on ${aspect}. The response is for a ${body.role} role ${body.exp ? `with ${body.exp} years of experience` : ''}. 
    Provide feedback in 30 words:
    "${body.answer}"`;

    try {
        const response = await axios.post(
            API_URL,
            {
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: prompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "your-app.com",
                },
            }
        );

        return response.data.choices[0]?.message?.content || "No response generated.";
    } catch (error) {
        console.error(`❌ OpenRouter API Error (${aspect}):`, error.response?.data || error.message);
        return `Error analyzing ${aspect}.`;
    }
}

export async function analyseAnswer(body) {
    console.log("🔍 Analyzing answer:", body);

    const clarity = await analyzeAnswerAspect(body, "clarity");
    const confidence = await analyzeAnswerAspect(body, "confidence");
    const relevance = await analyzeAnswerAspect(body, "relevance");

    return { clarity, confidence, relevance };
}
