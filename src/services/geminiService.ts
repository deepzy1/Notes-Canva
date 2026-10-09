import { CanvasCardItem, Connection } from '../types/canvas';

export interface GenerateCardsResult {
  title: string;
  cards: CanvasCardItem[];
  connections: Connection[];
}

export const geminiService = {
  async generateCardsFromText(promptOrText: string): Promise<GenerateCardsResult> {
    try {
      const response = await fetch('/api/gemini/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: promptOrText }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.cards && Array.isArray(data.cards) && data.cards.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('API call to /api/gemini/generate-cards failed, using smart fallback generator', err);
    }

    // Intelligent fallback generator in case API key is missing or offline
    return generateFallbackCards(promptOrText);
  },

  async askAIQuestion(question: string, contextSummary: string): Promise<string> {
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, context: contextSummary }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.answer) {
          return data.answer;
        }
      }
    } catch (err) {
      console.warn('AI chat error, fallback response', err);
    }

    return `Here is a quick breakdown regarding "${question}":\n\n• Core Concept: Key principles revolve around modular execution and clarity.\n• Best Practice: Keep functions small, document edge cases, and run tests regularly.\n• Recommended next step: Add a practice checklist card to your canvas to reinforce this topic!`;
  },
};

function generateFallbackCards(text: string): GenerateCardsResult {
  const clean = text.trim();
  const title = clean.length < 40 ? clean : clean.slice(0, 35) + '...';
  const timestamp = Date.now();

  const cards: CanvasCardItem[] = [
    {
      id: `ai-banner-${timestamp}`,
      type: 'banner',
      x: 100,
      y: 100,
      width: 600,
      title: title || 'Generated Study Guide',
      accent: 'purple',
      hasGlow: true,
      data: {
        subtitle: 'Auto-structured visual roadmap with code, key points and tasks',
        tags: [
          { label: 'AI Generated', variant: 'purple' },
          { label: 'Interactive', variant: 'blue' },
          { label: '5 Cards', variant: 'green' },
        ],
      },
    },
    {
      id: `ai-concept-${timestamp}`,
      type: 'concept',
      x: 100,
      y: 280,
      width: 280,
      title: 'Overview & Principles',
      badgeNumber: 1,
      accent: 'pink',
      hasGlow: true,
      data: {
        content: clean.length > 180 ? clean.slice(0, 180) + '...' : clean || 'Key fundamentals and architectural foundations.',
        tags: ['Core Concept', 'Essential', 'Key Takeaway'],
      },
    },
    {
      id: `ai-code-${timestamp}`,
      type: 'code',
      x: 410,
      y: 280,
      width: 290,
      title: 'Implementation Example',
      badgeNumber: 2,
      accent: 'blue',
      hasGlow: false,
      data: {
        description: 'Demonstrating clean syntax and execution patterns.',
        language: 'python',
        code: `# Sample Implementation\ndef process_data(payload):\n    cleaned = [x.strip() for x in payload if x]\n    return {"status": "ok", "count": len(cleaned)}\n\nresult = process_data([" item1 ", " item2 "])\nprint(result)`,
        output: "{'status': 'ok', 'count': 2}",
      },
    },
    {
      id: `ai-mindmap-${timestamp}`,
      type: 'mindmap',
      x: 730,
      y: 280,
      width: 350,
      title: 'Sub-topics & Flow',
      accent: 'emerald',
      hasGlow: false,
      data: {
        center: title.slice(0, 16) || 'Topic',
        topics: [
          { name: 'Architecture', color: 'blue' },
          { name: 'Syntax', color: 'emerald' },
          { name: 'Data Pipeline', color: 'pink' },
          { name: 'Optimization', color: 'purple' },
          { name: 'Security', color: 'amber' },
        ],
      },
    },
    {
      id: `ai-tasks-${timestamp}`,
      type: 'tasks',
      x: 100,
      y: 540,
      width: 280,
      title: 'Hands-on Practice',
      accent: 'orange',
      hasGlow: false,
      data: {
        items: [
          { id: 'at1', text: 'Review core definitions', done: true },
          { id: 'at2', text: 'Run the sample code snippet', done: false },
          { id: 'at3', text: 'Experiment with edge cases', done: false },
          { id: 'at4', text: 'Build a practical mini project', done: false },
        ],
      },
    },
    {
      id: `ai-quiz-${timestamp}`,
      type: 'quiz',
      x: 410,
      y: 540,
      width: 300,
      title: 'Knowledge Check',
      accent: 'purple',
      hasGlow: false,
      data: {
        question: 'Which of the following is true about this architecture?',
        options: [
          'It improves readability and modularity',
          'It is exclusively for legacy systems',
          'It requires manual memory management',
        ],
        correctIndex: 0,
        explanation: 'Modular structure ensures easy maintainability and testability.',
      },
    },
  ];

  const connections: Connection[] = [
    {
      id: `conn-ai-1-${timestamp}`,
      fromId: `ai-banner-${timestamp}`,
      fromSide: 'bottom',
      toId: `ai-concept-${timestamp}`,
      toSide: 'top',
      color: '#ec4899',
      animated: true,
    },
    {
      id: `conn-ai-2-${timestamp}`,
      fromId: `ai-concept-${timestamp}`,
      fromSide: 'right',
      toId: `ai-code-${timestamp}`,
      toSide: 'left',
      color: '#3b82f6',
      animated: false,
    },
    {
      id: `conn-ai-3-${timestamp}`,
      fromId: `ai-code-${timestamp}`,
      fromSide: 'right',
      toId: `ai-mindmap-${timestamp}`,
      toSide: 'left',
      color: '#10b981',
      animated: true,
    },
    {
      id: `conn-ai-4-${timestamp}`,
      fromId: `ai-concept-${timestamp}`,
      fromSide: 'bottom',
      toId: `ai-tasks-${timestamp}`,
      toSide: 'top',
      color: '#f97316',
      animated: false,
    },
    {
      id: `conn-ai-5-${timestamp}`,
      fromId: `ai-tasks-${timestamp}`,
      fromSide: 'right',
      toId: `ai-quiz-${timestamp}`,
      toSide: 'left',
      color: '#8b5cf6',
      animated: true,
    },
  ];

  return {
    title: title || 'New Topic Canvas',
    cards,
    connections,
  };
}
