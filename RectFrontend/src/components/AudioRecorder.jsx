import React,{useState, useRef} from 'react'

function AudioRecorder({onAudioData, onLoading}){
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
const [isStarted, setIsStarted] = useState(false)
const[loading, setLoading] = useState(false)

async function startRecording() {
    setIsStarted(true)
    setLoading(true)
    audioChunksRef.current =[]
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.controls = true;
        // Send to backend
        uploadAudio(audioBlob);
    };

    mediaRecorder.start();
    console.log("Recording started...");
}

function stopRecording() {
    if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsStarted(false);
        console.log("Recording stopped...");
      }
}

async function uploadAudio(audioBlob) {
    onLoading(true)
    const formData = new FormData();
    formData.append("audio", audioBlob, "recorded_audio.wav");

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/speech-to-text`, {
        method: "POST",
        body: formData,
    });

    const result = await response.json();
    onAudioData(result)
    setLoading(false)
    onLoading(false)
    console.log("Transcription:", result.transcription);
}
return (isStarted ? (
        <button className='btn-primary' onClick={stopRecording}>Done</button>
      ) : (
        <button className='btn-primary' onClick={startRecording}>Answer</button>
      )
  );
}
export default AudioRecorder