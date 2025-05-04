import os
import whisper
import sys

if len(sys.argv) < 2:
    print("No audio file path provided.")
    sys.exit(1)

audio_path = sys.argv[1]
audio_path = os.path.abspath(audio_path)  # Convert to absolute path

print(f"Using audio file: {audio_path}")  # Log the file path

try:
    model = whisper.load_model("base")  # You can try "tiny" for faster results
    result = model.transcribe(audio_path)
    print(result["text"])
except Exception as e:
    print(f"Error: {str(e)}")
    sys.exit(1)
