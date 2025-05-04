#!/usr/bin/env bash
# Fail on first error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Install Node dependencies
npm install

# Build frontend
npm run build
