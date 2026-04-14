# Matgarco AI Service

AI-powered features using local LLM (Ollama).

## Tech Stack

- **Framework:** FastAPI
- **Language:** Python 3.11+
- **LLM:** Ollama (Llama 3 / Mistral)
- **Image Processing:** Pillow

## Setup

### 1. Install Ollama

```bash
# Windows (PowerShell as Admin)
Invoke-WebRequest -Uri https://ollama.com/download/windows -OutFile ollama-setup.exe
.\ollama-setup.exe

# Start Ollama
ollama serve
```

### 2. Download AI Model

```bash
ollama pull llama3
# or
ollama pull mistral
```

### 3. Create Virtual Environment

```bash
python -m venv venv

# Windows
.\venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 6. Run Server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/docs`

## Features

- **Product Description Generator** - Generate engaging product descriptions
- **SEO Optimizer** - Create SEO-friendly titles, descriptions, and keywords
- **Category Suggester** - Suggest relevant product categories and tags

## Available Models

- **llama3:8b** - Best quality, requires 8GB+ RAM
- **mistral:7b** - Faster, good quality
- **phi:2.7b** - Lightweight, basic tasks

## API Endpoints

- `POST /api/generate-description` - Generate product description
- `POST /api/optimize-seo` - Optimize product SEO
- `POST /api/suggest-categories` - Suggest categories
- `GET /health` - Health check

## License

MIT
