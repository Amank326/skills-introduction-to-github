#!/bin/bash

# Quantum Travel AI - Quick Start Script

echo "🚀 Quantum Travel AI - Quick Start"
echo "=================================="
echo ""

# Check Python version
echo "Checking Python version..."
python3 --version

if [ $? -ne 0 ]; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python is installed"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Check for .env file
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  No .env file found. Creating from example..."
    if [ -f "../.env.example" ]; then
        cp ../.env.example .env
        echo "✅ .env file created. Please edit it with your API keys."
    else
        echo "⚠️  .env.example not found. Please create .env manually."
    fi
fi

# Start the application
echo ""
echo "=================================="
echo "🚀 Starting Quantum Travel AI..."
echo "=================================="
echo ""
echo "Access the application at: http://localhost:8000"
echo "API Documentation at: http://localhost:8000/api/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python main.py

# Alternative: Use uvicorn directly for better production management
# uvicorn main:app --host 0.0.0.0 --port 8000
