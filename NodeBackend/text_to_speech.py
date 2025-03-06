import os
import sys
from gtts import gTTS

def text_to_speech(text, output_dir, output_file):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    output_path = os.path.join(output_dir, output_file)
    tts = gTTS(text=text, lang="en")  # Choose the language
    tts.save(output_path)  # Save as an MP3 file
    os.system(f"afplay {output_path}")  # Play the audio (for macOS)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python text_to_speech.py <text> <output_dir> <output_file>")
        sys.exit(1)
    
    text = sys.argv[1]
    output_dir = sys.argv[2]
    output_file = sys.argv[3]
    text_to_speech(text, output_dir, output_file)