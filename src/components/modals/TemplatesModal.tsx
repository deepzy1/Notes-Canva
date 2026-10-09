import React from 'react';
import { X, LayoutTemplate, Sparkles, BookOpen, Database, GitBranch, ArrowRight } from 'lucide-react';
import { INITIAL_CARDS, INITIAL_CONNECTIONS } from '../../constants/pythonBasicsData';
import { CanvasCardItem, Connection } from '../../types/canvas';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (template: { name: string; cards: CanvasCardItem[]; connections: Connection[] }) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onLoadTemplate,
}) => {
  if (!isOpen) return null;

  const templates = [
    {
      id: 'python-basics',
      title: 'Python Basics (Default Workspace)',
      description: 'Complete 13-card visual learning map covering variables, control flow, functions, flow diagrams, mind maps, and practice tasks.',
      badge: 'Beginner',
      cardsCount: 13,
      load: () => ({
        name: 'Python Basics',
        cards: INITIAL_CARDS,
        connections: INITIAL_CONNECTIONS,
      }),
    },
    {
      id: 'fastapi-backend',
      title: 'FastAPI Backend Architecture',
      description: 'Pydantic schemas, dependency injection, async endpoints, database session lifecycle, and swagger documentation.',
      badge: 'Intermediate',
      cardsCount: 6,
      load: () => ({
        name: 'FastAPI Architecture',
        cards: [
          {
            id: 'fa-banner',
            type: 'banner' as const,
            x: 60,
            y: 50,
            width: 600,
            title: 'FastAPI Architecture',
            accent: 'emerald' as const,
            hasGlow: true,
            data: {
              subtitle: 'Modern, fast (high-performance) web framework for building APIs with Python',
              tags: [
                { label: 'FastAPI', variant: 'green' },
                { label: 'Async', variant: 'purple' },
                { label: 'Type Hints', variant: 'blue' },
              ],
            },
          },
          {
            id: 'fa-code-1',
            type: 'code' as const,
            x: 60,
            y: 230,
            width: 320,
            title: 'Endpoint & Validation',
            badgeNumber: 1,
            accent: 'blue' as const,
            hasGlow: false,
            data: {
              description: 'Automatic request parsing with Pydantic BaseModel.',
              language: 'python',
              code: `from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    title: str\n    price: float\n\n@app.post("/items")\ndef create_item(item: Item):\n    return {"saved": item.title}`,
              output: '{"saved": "Python Book"}',
            },
          },
          {
            id: 'fa-mindmap',
            type: 'mindmap' as const,
            x: 410,
            y: 230,
            width: 380,
            title: 'FastAPI Core Concepts',
            accent: 'purple' as const,
            hasGlow: true,
            data: {
              center: 'FastAPI',
              topics: [
                { name: 'Pydantic', color: 'blue' },
                { name: 'Dependencies', color: 'emerald' },
                { name: 'Starlette', color: 'pink' },
                { name: 'Uvicorn', color: 'purple' },
                { name: 'OpenAPI', color: 'amber' },
              ],
            },
          },
        ],
        connections: [
          {
            id: 'fa-conn-1',
            fromId: 'fa-banner',
            fromSide: 'bottom' as const,
            toId: 'fa-code-1',
            toSide: 'top' as const,
            color: '#10b981',
            animated: true,
          },
        ],
      }),
    },
    {
      id: 'oop-python',
      title: 'Object-Oriented Programming (OOP)',
      description: 'Master classes, inheritance, polymorphism, encapsulation, magic methods, and design patterns in Python.',
      badge: 'Core Python',
      cardsCount: 6,
      load: () => ({
        name: 'Python OOP Mastery',
        cards: [
          {
            id: 'oop-banner',
            type: 'banner' as const,
            x: 60,
            y: 50,
            width: 600,
            title: 'Object-Oriented Python',
            accent: 'purple' as const,
            hasGlow: true,
            data: {
              subtitle: 'Design reusable, modular, and maintainable software systems with Python classes',
              tags: [
                { label: 'OOP', variant: 'purple' },
                { label: 'Inheritance', variant: 'blue' },
                { label: 'Dunder Methods', variant: 'green' },
              ],
            },
          },
          {
            id: 'oop-code-1',
            type: 'code' as const,
            x: 60,
            y: 230,
            width: 320,
            title: 'Class Definition',
            badgeNumber: 1,
            accent: 'blue' as const,
            hasGlow: false,
            data: {
              description: 'Encapsulating data and behaviors inside class blueprints.',
              language: 'python',
              code: `class Developer:\n    def __init__(self, name, role):\n        self.name = name\n        self.role = role\n\n    def code(self):\n        return f"{self.name} is building features!"\n\ndev = Developer("Deepak", "Lead")\nprint(dev.code())`,
              output: 'Deepak is building features!',
            },
          },
          {
            id: 'oop-tasks',
            type: 'tasks' as const,
            x: 410,
            y: 230,
            width: 280,
            title: 'OOP Challenges',
            accent: 'orange' as const,
            hasGlow: false,
            data: {
              items: [
                { id: 'ot1', text: 'Define a custom class with __repr__', done: true },
                { id: 'ot2', text: 'Implement single and multiple inheritance', done: false },
                { id: 'ot3', text: 'Use @property getters and setters', done: false },
                { id: 'ot4', text: 'Implement the Strategy pattern', done: false },
              ],
            },
          },
        ],
        connections: [
          {
            id: 'oop-c1',
            fromId: 'oop-banner',
            fromSide: 'bottom' as const,
            toId: 'oop-code-1',
            toSide: 'top' as const,
            color: '#8b5cf6',
            animated: true,
          },
        ],
      }),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Workspace Templates</h3>
              <p className="text-xs text-neutral-500">
                Choose a pre-designed curriculum canvas to learn or remix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {templates.map(tpl => (
            <div
              key={tpl.id}
              className="p-4 rounded-2xl border border-neutral-200/80 hover:border-purple-300 hover:bg-purple-50/30 transition-all flex items-center justify-between group"
            >
              <div className="pr-4">
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-neutral-900 text-sm group-hover:text-purple-700">
                    {tpl.title}
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                    {tpl.badge}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">{tpl.description}</p>
                <span className="text-[11px] text-purple-600 font-medium mt-1 inline-block">
                  {tpl.cardsCount} visual cards included
                </span>
              </div>
              <button
                onClick={() => {
                  onLoadTemplate(tpl.load());
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center space-x-1.5 flex-shrink-0 shadow-sm cursor-pointer"
              >
                <span>Load</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
