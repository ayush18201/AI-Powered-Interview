import {generateQuestions, analyseAnswer} from '../controllers/chatService.js'
import express from 'express'
import multer from 'multer'
import {spawn} from 'child_process'
import path from 'path'
import fs from 'fs'

const chatRouter = express.Router()
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, `audio_${Date.now()}.wav`); 
    },
});

const upload = multer({ storage });
// chatRouter.post("/speech-to-text", upload.single("audio"), (req, res) => {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded." });
//     const audioPath = path.resolve(req.file.path); // Full path to file
//     console.log("Received file:", audioPath);
//     // Call Python script to transcribe audio
//     const pythonPath = path.resolve("venv/bin/python3"); // Adjust this if needed
//     const scriptPath = path.resolve("transcribe.py"); 
//     const process = spawn(pythonPath, [scriptPath, audioPath]);
//     // let transcription = "";
//     process.stdout.on("data", (data) => {
//         const transcription = data.toString().trim()
//         res.json({ transcription });
//     });
//     process.stderr.on("data", (data) => {
//         console.error(`stderr: ${data}`);
//     });
//     process.on("close", (code) => {
//         console.log(`Python process exited with code ${code}`);
//     });
// });
chatRouter.post("/speech-to-text", upload.single("audio"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const audioPath = path.resolve(req.file.path);
    console.log(`✅ Received file: ${audioPath}`);

    const pythonPath = path.resolve("venv/bin/python3");
    const scriptPath = path.resolve("transcribe.py"); 

    console.log(`✅ Using Python path: ${pythonPath}`);
    console.log(`✅ Using script path: ${scriptPath}`);

    const process = spawn(pythonPath, [scriptPath, audioPath]);

    process.stdout.on("data", (data) => {
        console.log(`✅ Python Output: ${data.toString()}`);
        res.json({ transcription: data.toString().trim() });
    });

    process.stderr.on("data", (data) => {
        console.error(`❌ Python Error: ${data.toString()}`);
    });
    process.on("error", (err) => {
        console.error(`❌ Python Process Failed to Start: ${err.message}`);
    });
    
    process.on("exit", (code, signal) => {
        console.log(`✅ Python process exited with code ${code}, signal: ${signal}`);
    });

    process.on("close", (code) => {
        console.log(`✅ Python process exited with code ${code}`);
    });
});

chatRouter.get("/test-python", (req, res) => {
    console.log("✅ Testing Python execution...");
    const pythonPath = path.resolve("venv/bin/python3");
    
    const process = spawn(pythonPath, ["-c", "import whisper; print('Python is working!')"]);
    
    process.stdout.on("data", (data) => {
        console.log(`✅ Python output: ${data}`);
        res.send(`Success: ${data}`);
    });

    process.stderr.on("data", (data) => {
        console.error(`❌ Python error: ${data}`);
        res.status(500).send(`Error: ${data}`);
    });

    process.on("close", (code) => {
        console.log(`✅ Python process exited with code ${code}`);
    });
});

chatRouter.post('/text-to-speech', (req,res)=>{
    if(!req.body.text) return res.status(400).json({error:'No file Uploaded'})
    const text = req.body.text
    const fileName = `output_${Date.now()}.mp3`
    const outputPath = path.resolve(fileName)
    const pythonPath = path.resolve("venv/bin/python3");
    const scriptPath = path.resolve("text_to_speech.py"); 
// const process = spawn(pythonPath, ["text_to_speech", text, './outputs', fileName ])
const process = spawn(pythonPath, [scriptPath, text, './outputs', outputPath]);
process.on('close',(code) =>{
    if(code===0){
        console.log(`Python process exited with code ${code}`)
        fs.access(outputPath, fs.constants.F_OK ,(err)=>{
            if(err){
                console.error('Error: file not found')
                return res.status(500).json({error:'failed to generate speech'})
            }
            const fileStream = fs.createReadStream(outputPath)
            res.setHeader("Content-Type", "audio/mpeg");
            fileStream.pipe(res)

            fileStream.on("end", () => {
                res.end();
            });
            res.on("finish", () => {
               fs.unlink(outputPath, (unlinkErr) => {
                                         if (unlinkErr) console.error("Error deleting file:", unlinkErr);
                                         else console.log("File Deleted Successfully");
                                     });
                                 });
    
        })
    }else{
        res.status(500).json({ error: "Failed to get speech" });
    }
    
})
})
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