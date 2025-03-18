#!/usr/bin/env python3
# import whisper
# import sys

# model = whisper.load_model("medium")  # Change to "large" for even better accuracy

# def transcribe_audio(audio_file):
#     result = model.transcribe(audio_file)
#     return result["text"]

# if __name__ == "__main__":
#     if len(sys.argv) < 2:
#         print("Error: No audio file provided")
#         sys.exit(1)
    
#     text = transcribe_audio(sys.argv[1])
#     print(text)
import whisper
import sys
import os

print("✅ Python script started")

model = whisper.load_model("medium")
print("✅ Whisper model loaded")

def transcribe_audio(audio_file):
    if not os.path.exists(audio_file):
        print(f"❌ Error: Audio file {audio_file} not found!")
        return "Error: File not found!"
    
    print(f"✅ Processing file: {audio_file}")
    result = model.transcribe(audio_file)
    return result["text"]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Error: No audio file provided")
        sys.exit(1)

    audio_file = sys.argv[1]
    print(f"✅ Received audio file: {audio_file}")

    text = transcribe_audio(audio_file)
    print(f"✅ Transcription: {text}")
