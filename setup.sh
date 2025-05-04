#!/bin/bash
# Install Python and FFmpeg
apt-get update
apt-get install -y python3 python3-pip ffmpeg

# Install Python dependencies
pip3 install whisper==1.1.10