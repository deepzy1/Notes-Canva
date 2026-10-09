import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/header/Header';
import { CanvasToolbar } from './components/toolbar/CanvasToolbar';
import { CanvasArea } from './components/canvas/CanvasArea';
import { AiGenerateModal } from './components/modals/AiGenerateModal';
import { AiAssistantDrawer } from './components/modals/AiAssistantDrawer';
import { ShareModal } from './components/modals/ShareModal';
import { TemplatesModal } from './components/modals/TemplatesModal';
import { THEMES } from './constants/themes';
import { storageService, DEFAULT_USER, UserProfile } from './services/storageService';
import {
  CanvasCardItem,
  Connection,
  ThemeId,
  Folder,
  ActiveTool,
} from './types/canvas';
import { INITIAL_CARDS, INITIAL_CONNECTIONS } from './constants/pythonBasicsData';

export default function App() {
  // Persistence state
  const [cards, setCards] = useState<CanvasCardItem[]>(() => storageService.getCards());
  const [connections, setConnections] = useState<Connection[]>(() => storageService.getConnections());
  const [themeId, setThemeId] = useState<ThemeId>(() => storageService.getTheme());
  const [folders, setFolders] = useState<Folder[]>(() => storageService.getFolders());
  const [activeFolderId, setActiveFolderId] = useState<string>('python');
  const [canvasName, setCanvasName] = useState<string>('Python Basics');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getUserProfile());

  // Interactive UI state
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [zoom, setZoom] = useState<number>(1.0);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  // Undo / Redo history state
  const [history, setHistory] = useState<{ cards: CanvasCardItem[]; connections: Connection[] }[]>([
    { cards: storageService.getCards(), connections: storageService.getConnections() },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Autosave whenever cards or connections change
  useEffect(() => {
    storageService.saveCards(cards);
    storageService.saveConnections(connections);
  }, [cards, connections]);

  useEffect(() => {
    storageService.saveTheme(themeId);
  }, [themeId]);

  useEffect(() => {
    storageService.saveUserProfile(userProfile);
  }, [userProfile]);

  // Push state to history for Undo/Redo
  const pushHistory = useCallback(
    (newCards: CanvasCardItem[], newConns: Connection[]) => {
      setHistory(prev => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, { cards: newCards, connections: newConns }];
      });
      setHistoryIndex(prev => prev + 1);
    },
    [historyIndex]
  );

  const handleUpdateCards = (newCards: CanvasCardItem[]) => {
    setCards(newCards);
    pushHistory(newCards, connections);
  };

  const handleUpdateConnections = (newConns: Connection[]) => {
    setConnections(newConns);
    pushHistory(cards, newConns);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setCards(prev.cards);
      setConnections(prev.connections);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setCards(next.cards);
      setConnections(next.connections);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Keyboard Shortcuts: Undo (Cmd+Z), Redo (Cmd+Y or Cmd+Shift+Z), Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Escape') {
        setSelectedCardId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Add Card helper
  const handleAddCard = (type: string) => {
    const timestamp = Date.now();
    const spawnX = 200 + Math.floor(Math.random() * 80);
    const spawnY = 200 + Math.floor(Math.random() * 80);

    let newCard: CanvasCardItem;

    switch (type) {
      case 'note':
        newCard = {
          id: `card-note-${timestamp}`,
          type: 'note',
          x: spawnX,
          y: spawnY,
          width: 280,
          title: 'Quick Note',
          accent: 'yellow',
          hasGlow: false,
          data: {
            bullets: ['Key takeaway to remember', 'Review after practice'],
          },
        };
        break;
      case 'code':
        newCard = {
          id: `card-code-${timestamp}`,
          type: 'code',
          x: spawnX,
          y: spawnY,
          width: 300,
          title: 'Code Example',
          badgeNumber: cards.length + 1,
          accent: 'blue',
          hasGlow: false,
          data: {
            description: 'Write custom Python snippet',
            language: 'python',
            code: `def solution():\n    return "Code executed successfully"\nprint(solution())`,
            output: 'Code executed successfully',
          },
        };
        break;
      case 'mindmap':
        newCard = {
          id: `card-mindmap-${timestamp}`,
          type: 'mindmap',
          x: spawnX,
          y: spawnY,
          width: 380,
          title: 'Mind Map: Architecture',
          accent: 'rose',
          hasGlow: true,
          data: {
            center: 'Topic',
            topics: [
              { name: 'Concept 1', color: 'blue' },
              { name: 'Concept 2', color: 'emerald' },
              { name: 'Concept 3', color: 'purple' },
              { name: 'Concept 4', color: 'amber' },
            ],
          },
        };
        break;
      case 'quiz':
        newCard = {
          id: `card-quiz-${timestamp}`,
          type: 'quiz',
          x: spawnX,
          y: spawnY,
          width: 300,
          title: 'Knowledge Check',
          accent: 'purple',
          hasGlow: false,
          data: {
            question: 'What is the default return value of a Python function?',
            options: ['None', '0', 'undefined'],
            correctIndex: 0,
            explanation: 'Functions without an explicit return statement return None.',
          },
        };
        break;
      case 'diagram':
      case 'shape':
        newCard = {
          id: `card-flow-${timestamp}`,
          type: 'flowchart',
          x: spawnX,
          y: spawnY,
          width: 320,
          title: 'Logic Flow Diagram',
          accent: 'purple',
          hasGlow: false,
          data: {},
        };
        break;
      case 'comment':
        newCard = {
          id: `card-comment-${timestamp}`,
          type: 'comment',
          x: spawnX,
          y: spawnY,
          width: 250,
          title: 'Comment',
          accent: 'purple',
          hasGlow: false,
          data: {
            comment: 'Review this section before next standup.',
            author: userProfile.name,
          },
        };
        break;
      default:
        newCard = {
          id: `card-concept-${timestamp}`,
          type: 'concept',
          x: spawnX,
          y: spawnY,
          width: 270,
          title: 'New Concept',
          badgeNumber: cards.length + 1,
          accent: 'pink',
          hasGlow: true,
          data: {
            content: 'Describe the programming concept, invariants, and implementation notes.',
            tags: ['Key Principle', 'Practice'],
          },
        };
        break;
    }

    handleUpdateCards([...cards, newCard]);
    setSelectedCardId(newCard.id);
  };

  const handleApplyAiCards = (
    newCards: CanvasCardItem[],
    newConns: Connection[],
    title?: string
  ) => {
    if (title) setCanvasName(title);
    handleUpdateCards(newCards);
    handleUpdateConnections(newConns);
  };

  const handleResetCanvas = () => {
    const defaultData = storageService.resetToDefault();
    setCards(defaultData.cards);
    setConnections(defaultData.connections);
    setCanvasName('Python Basics');
    pushHistory(defaultData.cards, defaultData.connections);
  };

  const currentTheme = THEMES[themeId] || THEMES.instagram;
  const currentFolderName = folders.find(f => f.id === activeFolderId)?.name || 'Python Learning';

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${currentTheme.textColor} font-sans`}>
      {/* 1. Left Sidebar (Instagram inspired clean theme) */}
      <Sidebar
        folders={folders}
        activeFolderId={activeFolderId}
        onSelectFolder={id => {
          setActiveFolderId(id);
          const f = folders.find(item => item.id === id);
          if (f) setCanvasName(`${f.name} Workspace`);
        }}
        onNewCanvas={() => {
          const name = prompt('Enter name for new canvas:', 'My Visual Workspace');
          if (name) {
            setCanvasName(name);
            handleUpdateCards([
              {
                id: `banner-${Date.now()}`,
                type: 'banner',
                x: 60,
                y: 50,
                width: 600,
                title: name,
                accent: 'purple',
                hasGlow: true,
                data: {
                  subtitle: 'Visual interactive workspace for software developers',
                  tags: [
                    { label: 'Custom', variant: 'purple' },
                    { label: 'Interactive', variant: 'green' },
                  ],
                },
              },
            ]);
            handleUpdateConnections([]);
          }
        }}
        onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentTheme={themeId}
          onSelectTheme={setThemeId}
          userProfile={userProfile}
          onUpdateUserProfile={setUserProfile}
          onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        />

        {/* Canvas Toolbar */}
        <CanvasToolbar
          canvasName={canvasName}
          folderName={currentFolderName}
          onRenameCanvas={setCanvasName}
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          onAddCard={handleAddCard}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          zoom={zoom}
          onZoomChange={setZoom}
          onResetZoom={() => setZoom(1.0)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />

        {/* Infinite Canvas Workspace */}
        <main className="flex-1 relative overflow-hidden">
          <CanvasArea
            cards={cards}
            connections={connections}
            theme={currentTheme}
            zoom={zoom}
            onZoomChange={setZoom}
            onUpdateCards={handleUpdateCards}
            onUpdateConnections={handleUpdateConnections}
            selectedCardId={selectedCardId}
            onSelectCard={setSelectedCardId}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      {/* AI Generate Text-to-Canvas Modal */}
      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyCards={handleApplyAiCards}
      />

      {/* AI Assistant Chat Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        canvasTitle={canvasName}
      />

      {/* Share & Export Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        cards={cards}
        connections={connections}
        canvasName={canvasName}
        onImportData={data => {
          if (data.cards) handleUpdateCards(data.cards);
          if (data.connections) handleUpdateConnections(data.connections);
          if (data.name) setCanvasName(data.name);
        }}
        onResetCanvas={handleResetCanvas}
      />

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onLoadTemplate={tpl => {
          setCanvasName(tpl.name);
          handleUpdateCards(tpl.cards);
          handleUpdateConnections(tpl.connections);
        }}
      />
    </div>
  );
}
