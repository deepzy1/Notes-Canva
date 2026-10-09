import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { Header } from './components/header/Header';
import { CanvasToolbar } from './components/toolbar/CanvasToolbar';
import { CanvasArea } from './components/canvas/CanvasArea';
import { AiGenerateModal } from './components/modals/AiGenerateModal';
import { AiAssistantDrawer } from './components/modals/AiAssistantDrawer';
import { ShareModal } from './components/modals/ShareModal';
import { TemplatesModal } from './components/modals/TemplatesModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';
import { ConfirmDialog } from './components/modals/ConfirmDialog';
import { THEMES } from './constants/themes';
import {
  storageService,
  DEFAULT_USER,
  UserProfile,
} from './services/storageService';
import {
  CanvasCardItem,
  Connection,
  ThemeId,
  Folder,
  ActiveTool,
  Workspace,
  ShapeSubtype,
} from './types/canvas';

export default function App() {
  // 1. Workspaces & Folders State
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => storageService.getWorkspaces());
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => storageService.getActiveWorkspaceId());
  const [folders, setFolders] = useState<Folder[]>(() => storageService.getFolders());
  const [activeFolderId, setActiveFolderId] = useState<string>('python');
  const [userProfile, setUserProfile] = useState<UserProfile>(() => storageService.getUserProfile());

  // Derive active workspace
  const activeWorkspace = useMemo(() => {
    return workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  }, [workspaces, activeWorkspaceId]);

  const cards = activeWorkspace.cards;
  const connections = activeWorkspace.connections;
  const themeId = activeWorkspace.theme;
  const canvasName = activeWorkspace.name;

  // 2. Editor Interaction State
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [zoom, setZoom] = useState<number>(1.0);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [clipboard, setClipboard] = useState<CanvasCardItem[] | null>(null);

  // 3. Modals State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // 4. Undo / Redo History Stack per workspace
  const [history, setHistory] = useState<{ cards: CanvasCardItem[]; connections: Connection[] }[]>([
    { cards, connections },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sync to localStorage
  useEffect(() => {
    storageService.saveWorkspaces(workspaces);
    storageService.setActiveWorkspaceId(activeWorkspaceId);
  }, [workspaces, activeWorkspaceId]);

  useEffect(() => {
    storageService.saveFolders(folders);
  }, [folders]);

  useEffect(() => {
    storageService.saveUserProfile(userProfile);
  }, [userProfile]);

  // Push history state
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

  // Update current workspace cards & connections
  const handleUpdateCards = (newCards: CanvasCardItem[]) => {
    setWorkspaces(prev =>
      prev.map(w => (w.id === activeWorkspaceId ? { ...w, cards: newCards } : w))
    );
    pushHistory(newCards, connections);
  };

  const handleUpdateConnections = (newConns: Connection[]) => {
    setWorkspaces(prev =>
      prev.map(w => (w.id === activeWorkspaceId ? { ...w, connections: newConns } : w))
    );
    pushHistory(cards, newConns);
  };

  const handleSelectTheme = (newTheme: ThemeId) => {
    setWorkspaces(prev =>
      prev.map(w => (w.id === activeWorkspaceId ? { ...w, theme: newTheme } : w))
    );
  };

  const handleRenameCanvas = (newName: string) => {
    setWorkspaces(prev =>
      prev.map(w => (w.id === activeWorkspaceId ? { ...w, name: newName } : w))
    );
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setWorkspaces(workspacesList =>
        workspacesList.map(w =>
          w.id === activeWorkspaceId ? { ...w, cards: prev.cards, connections: prev.connections } : w
        )
      );
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setWorkspaces(workspacesList =>
        workspacesList.map(w =>
          w.id === activeWorkspaceId ? { ...w, cards: next.cards, connections: next.connections } : w
        )
      );
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Copy / Cut / Paste
  const handleCopyCards = (toCopy: CanvasCardItem[]) => {
    if (toCopy.length === 0) return;
    setClipboard(toCopy);
  };

  const handleCutCards = (toCut: CanvasCardItem[]) => {
    if (toCut.length === 0) return;
    setClipboard(toCut);
    const cutIds = toCut.map(c => c.id);
    handleUpdateCards(cards.filter(c => !cutIds.includes(c.id)));
    handleUpdateConnections(
      connections.filter(c => !cutIds.includes(c.fromId) && !cutIds.includes(c.toId))
    );
    setSelectedCardIds([]);
  };

  const handlePasteCards = () => {
    if (!clipboard || clipboard.length === 0) return;
    const pasted = clipboard.map(orig => ({
      ...orig,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      x: orig.x + 30,
      y: orig.y + 30,
    }));
    handleUpdateCards([...cards, ...pasted]);
    setSelectedCardIds(pasted.map(c => c.id));
  };

  const handleDeleteSelected = () => {
    if (selectedCardIds.length === 0) return;
    handleUpdateCards(cards.filter(c => !selectedCardIds.includes(c.id)));
    handleUpdateConnections(
      connections.filter(c => !selectedCardIds.includes(c.fromId) && !selectedCardIds.includes(c.toId))
    );
    setSelectedCardIds([]);
  };

  const handleGroupSelected = () => {
    if (selectedCardIds.length < 2) return;
    const newGroupId = `group-${Date.now()}`;
    handleUpdateCards(
      cards.map(c => (selectedCardIds.includes(c.id) ? { ...c, groupId: newGroupId } : c))
    );
  };

  const handleUngroupSelected = () => {
    handleUpdateCards(
      cards.map(c => (selectedCardIds.includes(c.id) ? { ...c, groupId: undefined } : c))
    );
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if currently typing inside an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        const toCopy = cards.filter(c => selectedCardIds.includes(c.id));
        handleCopyCards(toCopy);
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        const toCut = cards.filter(c => selectedCardIds.includes(c.id));
        handleCutCards(toCut);
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePasteCards();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        const toDuplicate = cards.filter(c => selectedCardIds.includes(c.id));
        if (toDuplicate.length > 0) {
          const dups = toDuplicate.map(orig => ({
            ...orig,
            id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            x: orig.x + 30,
            y: orig.y + 30,
            title: `${orig.title} (Copy)`,
          }));
          handleUpdateCards([...cards, ...dups]);
          setSelectedCardIds(dups.map(c => c.id));
        }
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedCardIds(cards.map(c => c.id));
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (cmdOrCtrl && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          handleUngroupSelected();
        } else {
          handleGroupSelected();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      } else if (e.key === 'Escape') {
        setSelectedCardIds([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards, connections, selectedCardIds, clipboard, historyIndex, history]);

  // Insert Card / Shape / Text
  const handleAddCard = (type: string, subtype?: ShapeSubtype) => {
    const timestamp = Date.now();
    const spawnX = 220 + Math.floor(Math.random() * 60);
    const spawnY = 180 + Math.floor(Math.random() * 60);

    let newCard: CanvasCardItem;

    if (type === 'text') {
      newCard = {
        id: `text-${timestamp}`,
        type: 'text',
        x: spawnX,
        y: spawnY,
        width: 220,
        height: 60,
        title: 'Text Box',
        accent: 'purple',
        data: { text: 'Double-click to type text...' },
        textStyle: { fontSize: 16, fontWeight: 'normal', textColor: '#0f172a' },
      };
    } else if (type === 'shape') {
      newCard = {
        id: `shape-${timestamp}`,
        type: 'shape',
        x: spawnX,
        y: spawnY,
        width: 170,
        height: 130,
        title: 'Shape',
        accent: 'blue',
        data: { text: subtype === 'diamond' ? 'Condition?' : 'Process Block' },
        shapeStyle: {
          subtype: subtype || 'rectangle',
          fillColor: '#f8fafc',
          strokeColor: '#64748b',
          strokeWidth: 2,
        },
      };
    } else if (type === 'note') {
      newCard = {
        id: `card-note-${timestamp}`,
        type: 'note',
        x: spawnX,
        y: spawnY,
        width: 280,
        height: 180,
        title: 'Notes',
        accent: 'yellow',
        hasGlow: false,
        data: {
          bullets: ['Key takeaway to remember', 'Review after practice'],
        },
      };
    } else if (type === 'diagram') {
      newCard = {
        id: `card-flow-${timestamp}`,
        type: 'flowchart',
        x: spawnX,
        y: spawnY,
        width: 320,
        height: 270,
        title: 'Flowchart Diagram',
        accent: 'purple',
        hasGlow: false,
        data: {},
      };
    } else if (type === 'code') {
      newCard = {
        id: `card-code-${timestamp}`,
        type: 'code',
        x: spawnX,
        y: spawnY,
        width: 300,
        height: 230,
        title: 'Code Example',
        badgeNumber: cards.length + 1,
        accent: 'blue',
        hasGlow: false,
        data: {
          description: 'Interactive runnable python sandbox',
          language: 'python',
          code: `def calculate():\n    return 42\nprint(calculate())`,
          output: '42',
        },
      };
    } else if (type === 'mindmap') {
      newCard = {
        id: `card-mindmap-${timestamp}`,
        type: 'mindmap',
        x: spawnX,
        y: spawnY,
        width: 380,
        height: 280,
        title: 'Mind Map: Architecture',
        accent: 'rose',
        hasGlow: true,
        data: {
          center: 'Topic',
          topics: [
            { name: 'Concept 1', color: 'blue' },
            { name: 'Concept 2', color: 'emerald' },
            { name: 'Concept 3', color: 'pink' },
            { name: 'Concept 4', color: 'amber' },
          ],
        },
      };
    } else if (type === 'quiz') {
      newCard = {
        id: `card-quiz-${timestamp}`,
        type: 'quiz',
        x: spawnX,
        y: spawnY,
        width: 300,
        height: 220,
        title: 'Knowledge Check',
        accent: 'purple',
        hasGlow: false,
        data: {
          question: 'What is the output of print(len([1, 2, 3]))?',
          options: ['3', '2', 'Error'],
          correctIndex: 0,
          explanation: 'len returns the count of items in the list.',
        },
      };
    } else if (type === 'comment') {
      newCard = {
        id: `card-comment-${timestamp}`,
        type: 'comment',
        x: spawnX,
        y: spawnY,
        width: 250,
        height: 120,
        title: 'Comment',
        accent: 'purple',
        hasGlow: false,
        data: {
          comment: 'Verify edge cases before shipping!',
          author: userProfile.name,
        },
      };
    } else {
      newCard = {
        id: `card-concept-${timestamp}`,
        type: 'concept',
        x: spawnX,
        y: spawnY,
        width: 270,
        height: 180,
        title: 'New Concept',
        badgeNumber: cards.length + 1,
        accent: 'pink',
        hasGlow: true,
        data: {
          content: 'Double-click to write concepts, documentation, or architecture details.',
          tags: ['Key Principle', 'Practice'],
        },
      };
    }

    handleUpdateCards([...cards, newCard]);
    setSelectedCardIds([newCard.id]);
  };

  // Workspace CRUD handlers
  const handleSelectWorkspace = (id: string) => {
    setActiveWorkspaceId(id);
    setSelectedCardIds([]);
    const ws = workspaces.find(w => w.id === id);
    if (ws) {
      setHistory([{ cards: ws.cards, connections: ws.connections }]);
      setHistoryIndex(0);
      setActiveFolderId(ws.folderId);
    }
  };

  const handleNewWorkspace = () => {
    const name = prompt('Enter workspace name:', 'New Visual Workspace');
    if (name && name.trim()) {
      const newWs = storageService.createWorkspace(name.trim(), activeFolderId);
      setWorkspaces(storageService.getWorkspaces());
      setActiveWorkspaceId(newWs.id);
      setSelectedCardIds([]);
      setHistory([{ cards: newWs.cards, connections: newWs.connections }]);
      setHistoryIndex(0);
    }
  };

  const handleRenameWorkspace = (id: string, newName: string) => {
    storageService.renameWorkspace(id, newName);
    setWorkspaces(storageService.getWorkspaces());
  };

  const handleDuplicateWorkspace = (id: string) => {
    const dup = storageService.duplicateWorkspace(id);
    if (dup) {
      setWorkspaces(storageService.getWorkspaces());
      setActiveWorkspaceId(dup.id);
      setSelectedCardIds([]);
    }
  };

  const handleDeleteWorkspace = (id: string) => {
    const ws = workspaces.find(w => w.id === id);
    if (!ws) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Delete Workspace',
      message: `Are you sure you want to permanently delete "${ws.name}"? This action cannot be undone.`,
      onConfirm: () => {
        const ok = storageService.deleteWorkspace(id);
        if (ok) {
          const updated = storageService.getWorkspaces();
          setWorkspaces(updated);
          setActiveWorkspaceId(storageService.getActiveWorkspaceId());
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Folder CRUD handlers
  const handleCreateFolder = (name: string) => {
    const colors = ['#8b5cf6', '#ec4899', '#10b981', '#06b6d4', '#f59e0b', '#3b82f6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const folder = storageService.createFolder(name, randomColor);
    setFolders(storageService.getFolders());
    setActiveFolderId(folder.id);
  };

  const handleRenameFolder = (id: string, newName: string) => {
    storageService.renameFolder(id, newName);
    setFolders(storageService.getFolders());
  };

  const handleDeleteFolder = (id: string) => {
    const folder = folders.find(f => f.id === id);
    if (!folder) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Delete Folder',
      message: `Delete folder "${folder.name}"? Workspaces in this folder will be moved to another folder.`,
      onConfirm: () => {
        storageService.deleteFolder(id);
        setFolders(storageService.getFolders());
        setWorkspaces(storageService.getWorkspaces());
        setActiveFolderId(storageService.getFolders()[0].id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const currentTheme = THEMES[themeId] || THEMES.instagram;
  const currentFolderName = folders.find(f => f.id === activeFolderId)?.name || 'Python Learning';

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${currentTheme.textColor} font-sans`}>
      {/* 1. Left Sidebar with Folder & Workspace Management */}
      <Sidebar
        folders={folders}
        activeFolderId={activeFolderId}
        onSelectFolder={id => {
          setActiveFolderId(id);
          const firstWsInFolder = workspaces.find(w => w.folderId === id);
          if (firstWsInFolder) {
            handleSelectWorkspace(firstWsInFolder.id);
          }
        }}
        workspaces={workspaces}
        activeWorkspaceId={activeWorkspaceId}
        onSelectWorkspace={handleSelectWorkspace}
        onNewWorkspace={handleNewWorkspace}
        onRenameWorkspace={handleRenameWorkspace}
        onDuplicateWorkspace={handleDuplicateWorkspace}
        onDeleteWorkspace={handleDeleteWorkspace}
        onCreateFolder={handleCreateFolder}
        onRenameFolder={handleRenameFolder}
        onDeleteFolder={handleDeleteFolder}
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
          onSelectTheme={handleSelectTheme}
          userProfile={userProfile}
          onUpdateUserProfile={setUserProfile}
          onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        />

        {/* Canvas Toolbar with Shapes, Arrow, Group, Delete */}
        <CanvasToolbar
          canvasName={canvasName}
          folderName={currentFolderName}
          onRenameCanvas={handleRenameCanvas}
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
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
          selectedCount={selectedCardIds.length}
          onDeleteSelected={handleDeleteSelected}
          onGroupSelected={handleGroupSelected}
          onUngroupSelected={handleUngroupSelected}
        />

        {/* Infinite Interactive Canvas Workspace */}
        <main className="flex-1 relative overflow-hidden">
          <CanvasArea
            cards={cards}
            connections={connections}
            theme={currentTheme}
            zoom={zoom}
            onZoomChange={setZoom}
            onUpdateCards={handleUpdateCards}
            onUpdateConnections={handleUpdateConnections}
            selectedCardIds={selectedCardIds}
            onSelectCards={setSelectedCardIds}
            searchQuery={searchQuery}
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            clipboard={clipboard}
            onCopyCards={handleCopyCards}
            onCutCards={handleCutCards}
            onPasteCards={handlePasteCards}
          />
        </main>
      </div>

      {/* AI Generate Text-to-Canvas Modal */}
      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyCards={(aiCards, aiConns, aiTitle) => {
          if (aiTitle) handleRenameCanvas(aiTitle);
          handleUpdateCards(aiCards);
          handleUpdateConnections(aiConns);
        }}
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
          if (data.name) handleRenameCanvas(data.name);
        }}
        onResetCanvas={() => {
          const fresh = storageService.resetToDefault();
          setWorkspaces(storageService.getWorkspaces());
          setActiveWorkspaceId(fresh.id);
        }}
      />

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onLoadTemplate={tpl => {
          handleRenameCanvas(tpl.name);
          handleUpdateCards(tpl.cards);
          handleUpdateConnections(tpl.connections);
        }}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
