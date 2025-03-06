import whisper
import sys

model = whisper.load_model("medium")  # Change to "large" for even better accuracy

def transcribe_audio(audio_file):
    result = model.transcribe(audio_file)
    return result["text"]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No audio file provided")
        sys.exit(1)
    
    text = transcribe_audio(sys.argv[1])
    print(text)
