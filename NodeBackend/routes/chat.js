import {generateQuestions, analyseAnswer} from '../controllers/chatService.js'
import express from 'express'
import multer from 'multer'
import {spawn} from 'child_process'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chatRouter = express.Router()
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `audio_${Date.now()}.wav`); 
    },
});

const upload = multer({ storage });
chatRouter.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://ai-powered-interview-frontend.onrender.com"
    ],
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
chatRouter.post("/speech-to-text", upload.single("audio"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    const audioPath = path.resolve(req.file.path); // Full path to file
    console.log("Received file:", audioPath);
    // Call Python script to transcribe audio
    const pythonPath = path.join(__dirname, "/usr/bin/python3");
    // const pythonPath = "/usr/bin/python3"; // Adjust this if needed
    const process = spawn(pythonPath, ["transcribe.py", audioPath]);
    // let transcription = "";
    process.stdout.on("data", (data) => {
        const transcription = data.toString().trim()
        res.json({ transcription });
    });
    process.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });
    process.on("close", (code) => {
        console.log(`Python process exited with code ${code}`);
    });
});
chatRouter.post('/text-to-speech', (req, res) => {
    if (!req.body.text) return res.status(400).json({ error: 'No text provided' });

    const text = req.body.text;
    const fileName = `output_${Date.now()}.mp3`;
    const outputPath = path.join(__dirname, "outputs", fileName);
    const pythonPath = path.join(__dirname, "venv", "bin", "python3"); // Update for Windows if needed
    const scriptPath = path.join(__dirname, "text_to_speech.py");

    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
        return res.status(500).json({ error: "Python script not found" });
    }

    // Spawn Python process
    const process = spawn(pythonPath, [scriptPath, text, "outputs", outputPath]);

    process.on('close', async (code) => {
        if (code === 0) {
            console.log(`Python process exited successfully.`);

            // Check if the file exists
            fs.access(outputPath, fs.constants.F_OK, async (err) => {
                if (err) {
                    console.error('Error: File not found');
                    return res.status(500).json({ error: 'Failed to generate speech' });
                }

                // Stream the file to the response
                const fileStream = fs.createReadStream(outputPath);
                res.setHeader("Content-Type", "audio/mpeg");
                fileStream.pipe(res);

                // Delete file after sending response
                res.on("finish", async () => {
                    try {
                        await fs.promises.unlink(outputPath);
                        console.log("File Deleted Successfully");
                    } catch (unlinkErr) {
                        console.error("Error deleting file:", unlinkErr);
                    }
                });
            });
        } else {
            console.error(`Python process exited with code ${code}`);
            res.status(500).json({ error: "Failed to generate speech" });
        }
    });

    process.on('error', (err) => {
        console.error("Error starting Python process:", err);
        res.status(500).json({ error: "Error executing Python script" });
    });
});
chatRouter.get('/get-questions/:role/:exp?', async(req, res)=>{
  const role = req.params.role;
  const experience = req.params.exp || ''
  const question = await generateQuestions(role, experience)
  res.json({question})
})
chatRouter.post('/analyse-ans', async(req, res)=>{
  const body = req.body;
  const feedback = await analyseAnswer(body)
  res.json(feedback)
})


export default chatRouter;
