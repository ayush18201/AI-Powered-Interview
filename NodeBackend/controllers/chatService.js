import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
// const API_KEY = "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";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";


// export async function generateQuestions(jobRole, experience) {
//     const prompt = experience
//         ? `Generate five different professional interview questions for a ${jobRole} role with ${experience} years of experience.`
//         : `Generate five different professional interview questions for a ${jobRole} role.`;
// console.log(process.env.API_KEY,"api")
//     try {
//         const response = await axios.post(
//             API_URL,
//             {
//                 model: "mistralai/mistral-7b-instruct", // Ensure this model is supported
//                 messages: [{ role: "user", content: prompt }],
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${API_KEY}`,
//                     "Content-Type": "application/json",
//                     "HTTP-Referer": "your-app.com", // Replace with your app’s URL
//                 },
//             }
//         );

//         return response.data.choices[0]?.message?.content.split('\n').filter(q => q.trim() !== '') || [];
//     } catch (error) {
//         console.error("❌ OpenRouter API Error:", error.response?.data || error.message);
//         return "Error generating questions.";
//     }
// }

export async function generateQuestions(jobRole, experience) {
    const prompt = experience
        ? `Generate five different professional interview questions for a ${jobRole} role with ${experience} years of experience.`
        : `Generate five different professional interview questions for a ${jobRole} role.`;

    console.log("API_KEY from env:", process.env.API_KEY); // Debugging

    try {
        const response = await axios.post(
            API_URL,
            {
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: prompt }],
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.API_KEY}`,
                    "Content-Type": "application/json",
                    "X-Title": "your-app.com", // Fix: Use X-Title instead of HTTP-Referer
                },
            }
        );

        return response.data.choices[0]?.message?.content.split('\n').filter(q => q.trim() !== '') || [];
    } catch (error) {
        console.error("❌ OpenRouter API Error:", error.response?.data || error.message);
        return "Error generating questions.";
    }
}
  async function analyzeClarity(body) {
    let messageContent ;
    if(body.exp){
        messageContent = `
       Analyze the following interview response for question "${body.question}" on the basis of confidence in 30 words:
        "${body.answer} for ${body.role} role`;
    }else{
        messageContent = `
       Analyze the following interview response for the question "${body.question}" based on the candidate's confidence. The response is for a ${body.role} role. Provide feedback in 30 words:
"${body.answer}"`;
    }
    try {
        const response = await axios.post(
          API_URL,
          {
            model: "mistralai/mistral-7b-instruct", // Use a Hugging Face model available on OpenRouter
            messages: [{ role: "user", content: messageContent}],
          //   max_tokens: 100, // Limit response length
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "your-app.com", // Replace with your app’s URL
            },
          }
        );
    
        console.log(response.data,"clarity");
        return response.data.choices[0].message.content; // Extract the response text
      } catch (error) {
        console.error("OpenRouter API Error:", error.response?.data || error.message);
        return "Error generating question.";
      }
  }
  async function analyzeConfidence(body) {
    console.log(body.exp,"exp")
    let messageContent;
    if(body.exp){
        console.log(body.exp,"exp")
        messageContent = `
        Analyze the following interview response for the question "${body.question}" based on the candidate's confidence. The response is for a ${body.role} role with ${body.exp} years of experience. Provide feedback in 30 words:
"${body.answer}`;
    }else{
        messageContent = `
       Analyze the following interview response for the question "${body.question}" based on the candidate's confidence. The response is for a ${body.role} role. Provide feedback in 30 words:
"${body.answer}"`;
    }
    try {
        const response = await axios.post(
          API_URL,
          {
            model: "mistralai/mistral-7b-instruct", // Use a Hugging Face model available on OpenRouter
            messages: [{ role: "user", content: messageContent}],
          //   max_tokens: 100, // Limit response length
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "your-app.com", // Replace with your app’s URL
            },
          }
        );
    
        console.log(response.data,"confidence");
        return response.data.choices[0].message.content; // Extract the response text
      } catch (error) {
        console.error("OpenRouter API Error:", error.response?.data || error.message);
        return "Error generating question.";
      }
  }
  async function analyzeRelevance(body) {
    console.log(body.exp,"exp")
    let messageContent;
    if(body.exp){
        messageContent = `
        Analyze the following interview response for question "${body.question}" on the basis of confidence in 30 words:
        "${body.answer} for ${body.role} role`;
    }else{
        messageContent = `
        Analyze the following interview response for the question "${body.question}" based on the candidate's confidence. The response is for a ${body.role} role. Provide feedback in 30 words:
"${body.answer}"`;
    }
    try {
        const response = await axios.post(
          API_URL,
          {
            model: "mistralai/mistral-7b-instruct", // Use a Hugging Face model available on OpenRouter
            messages: [{ role: "user", content: messageContent}],
          //   max_tokens: 100, // Limit response length
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.API_KEY}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "your-app.com", // Replace with your app’s URL
            },
          }
        );
    
        console.log(response.data,"relevance");
        return response.data.choices[0].message.content; // Extract the response text
      } catch (error) {
        console.error("OpenRouter API Error:", error.response?.data || error.message);
        return "Error generating question.";
      }
  }
export async function analyseAnswer(body) {
    console.log(body,"body")
     const clarity = await analyzeClarity(body)
     const confidence = await analyzeConfidence(body)
     const relevance = await analyzeRelevance(body)
     console.log(clarity,"clarity")
    //  return {feedback: `Clarity: ${clarity} Confidence: ${confidence} Relevance: ${relevance}` }
    return {clarity: clarity, confidence:confidence, relevance:relevance   }

  }
