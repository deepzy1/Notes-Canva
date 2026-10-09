import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function geminiApiPlugin(): Plugin {
  return {
    name: 'gemini-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method === 'POST' && req.url === '/api/gemini/generate-cards') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { text } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not set' }));
                return;
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
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(outputText);
            } catch (err: any) {
              console.error('Gemini generate error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message || 'Failed to generate' }));
            }
          });
          return;
        }

        if (req.method === 'POST' && req.url === '/api/gemini/chat') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { question, context } = JSON.parse(body || '{}');
              const apiKey = process.env.GEMINI_API_KEY;

              if (!apiKey) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'GEMINI_API_KEY is not set' }));
                return;
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

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ answer: response.text }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message || 'Failed to answer' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), geminiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
