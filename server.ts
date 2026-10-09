import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API: Generate structured canvas cards with Gemini
app.post('/api/gemini/generate-cards', async (req: Request, res: Response) => {
  try {
    const { text } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `You are an expert developer educator. Transform this input into structured visual learning cards for software developers:
Input: "${text}"

Respond with ONLY valid JSON with this exact structure:
{
  "title": "Short title",
  "cards": [
    {
      "id": "card-1",
      "type": "concept",
      "x": 80,
      "y": 80,
      "width": 280,
      "title": "Concept Title",
      "badgeNumber": 1,
      "accent": "pink",
      "hasGlow": true,
      "data": {
        "content": "Explanation",
        "tags": ["tag1", "tag2"]
      }
    },
    {
      "id": "card-2",
      "type": "code",
      "x": 390,
      "y": 80,
      "width": 300,
      "title": "Example Code",
      "badgeNumber": 2,
      "accent": "blue",
      "hasGlow": false,
      "data": {
        "description": "Short description",
        "language": "python",
        "code": "# Python or relevant code snippet",
        "output": "Simulated output"
      }
    },
    {
      "id": "card-3",
      "type": "tasks",
      "x": 720,
      "y": 80,
      "width": 270,
      "title": "Practice Tasks",
      "accent": "emerald",
      "hasGlow": false,
      "data": {
        "items": [
          {"id": "t1", "text": "Task 1", "done": false},
          {"id": "t2", "text": "Task 2", "done": false}
        ]
      }
    }
  ],
  "connections": [
    {
      "id": "c1",
      "fromId": "card-1",
      "fromSide": "right",
      "toId": "card-2",
      "toSide": "left",
      "color": "#ec4899",
      "animated": true
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    return res.type('application/json').send(outputText);
  } catch (err: any) {
    console.error('Server Gemini Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// API: AI Assistant Q&A
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Context: ${context || 'Learning software development'}\nUser question: ${question}\nProvide a clear, educational, concise explanation with code or bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ answer: response.text });
  } catch (err: any) {
    console.error('Server Gemini Chat Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Serve frontend static build
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
