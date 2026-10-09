import React, { useRef, useState, useEffect } from 'react';
import {
  CanvasCardItem,
  Connection,
  ThemeConfig,
  SnapGuide,
  ContextMenuState,
  TextStyle,
  ShapeStyle,
  ActiveTool,
} from '../../types/canvas';
import { CanvasCard } from './CanvasCard';
import { ConnectionLines } from './ConnectionLines';
import { Minimap } from './Minimap';
import { AlignmentGuides } from './AlignmentGuides';
import { TextFormattingBar } from './TextFormattingBar';
import { CanvasContextMenu } from './CanvasContextMenu';

// Card sub-components
import { BannerCard } from '../cards/BannerCard';
import { GoalCard } from '../cards/GoalCard';
import { ConceptCard } from '../cards/ConceptCard';
import { CodeCard } from '../cards/CodeCard';
import { DataTypesCard } from '../cards/DataTypesCard';
import { FlowDiagramCard } from '../cards/FlowDiagramCard';
import { MindMapCard } from '../cards/MindMapCard';
import { NoteCard } from '../cards/NoteCard';
import { TasksCard } from '../cards/TasksCard';
import { ResourcesCard } from '../cards/ResourcesCard';
import { ImageConceptCard } from '../cards/ImageConceptCard';
import { QuizCard } from '../cards/QuizCard';
import { CommentCard } from '../cards/CommentCard';
import { ShapeCard } from '../cards/ShapeCard';
import { TextCard } from '../cards/TextCard';

interface CanvasAreaProps {
  cards: CanvasCardItem[];
  connections: Connection[];
  theme: ThemeConfig;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onUpdateCards: (newCards: CanvasCardItem[]) => void;
  onUpdateConnections: (newConns: Connection[]) => void;
  selectedCardIds: string[];
  onSelectCards: (ids: string[]) => void;
  searchQuery: string;
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  clipboard: CanvasCardItem[] | null;
  onCopyCards: (cards: CanvasCardItem[]) => void;
  onCutCards: (cards: CanvasCardItem[]) => void;
  onPasteCards: () => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  cards,
  connections,
  theme,
  zoom,
  onZoomChange,
  onUpdateCards,
  onUpdateConnections,
  selectedCardIds,
  onSelectCards,
  searchQuery,
  activeTool,
  onSelectTool,
  clipboard,
  onCopyCards,
  onCutCards,
  onPasteCards,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Dragging multiple cards
  const [isDraggingCards, setIsDraggingCards] = useState(false);
  const [dragStartMouse, setDragStartMouse] = useState({ x: 0, y: 0 });
  const [initialCardPositions, setInitialCardPositions] = useState<{ id: string; x: number; y: number }[]>([]);

  // Resizing state
  const [resizeState, setResizeState] = useState<{
    cardId: string;
    handle: string;
    startX: number;
    startY: number;
    initX: number;
    initY: number;
    initW: number;
    initH: number;
  } | null>(null);

  // Rotating state
  const [rotateState, setRotateState] = useState<{
    cardId: string;
    centerX: number;
    centerY: number;
  } | null>(null);

  // Marquee selection box
  const [marqueeBox, setMarqueeBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // Spacebar panning tracking
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target as HTMLElement).matches('input, textarea, [contenteditable="true"]')) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Alignment guide lines
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);

  // Interactive connector creation
  const [connectingStart, setConnectingStart] = useState<{
    cardId: string;
    side: 'top' | 'right' | 'bottom' | 'left';
  } | null>(null);
  const [connectionMousePos, setConnectionMousePos] = useState({ x: 0, y: 0 });

  // Selected Connection
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // Inline text editing
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  // Right-click Context Menu
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    targetType: 'canvas',
    cardIds: [],
  });

  // Close context menu on outside click
  useEffect(() => {
    const handleDocClick = () => {
      if (contextMenu.isOpen) {
        setContextMenu(prev => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener('click', handleDocClick);
    return () => window.removeEventListener('click', handleDocClick);
  }, [contextMenu.isOpen]);

  // Convert client coordinates to canvas coordinates
  const toCanvasCoords = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    };
  };

  // Mouse wheel: Pan & Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;
      const newZoom = Math.min(2.5, Math.max(0.3, zoom * zoomFactor));

      // Zoom towards mouse pointer
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        setPan(prev => ({
          x: mouseX - (mouseX - prev.x) * (newZoom / zoom),
          y: mouseY - (mouseY - prev.y) * (newZoom / zoom),
        }));
      }
      onZoomChange(newZoom);
    } else {
      setPan(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  // Canvas Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) return; // Right-click handled by onContextMenu

    const isBackground =
      e.target === containerRef.current ||
      (e.target as HTMLElement).classList.contains('canvas-background');

    if (isBackground) {
      setEditingCardId(null);
      setSelectedConnectionId(null);

      // Space key or middle click pans canvas
      if (e.button === 1 || isSpacePressed || activeTool !== 'select') {
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      } else {
        // Start Marquee drag-selection
        const canvasPos = toCanvasCoords(e.clientX, e.clientY);
        setMarqueeBox({
          startX: canvasPos.x,
          startY: canvasPos.y,
          currentX: canvasPos.x,
          currentY: canvasPos.y,
        });
        if (!e.shiftKey && !e.ctrlKey) {
          onSelectCards([]);
        }
      }
    }
  };

  // Start Card Dragging
  const handleStartCardDrag = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    if (editingCardId === cardId) return;

    // Arrow tool click: Connect cards
    if (activeTool === 'arrow') {
      if (!connectingStart) {
        setConnectingStart({ cardId, side: 'right' });
        const canvasPos = toCanvasCoords(e.clientX, e.clientY);
        setConnectionMousePos(canvasPos);
      } else if (connectingStart.cardId !== cardId) {
        const newConn: Connection = {
          id: `conn-${Date.now()}`,
          fromId: connectingStart.cardId,
          fromSide: connectingStart.side,
          toId: cardId,
          toSide: 'left',
          color: '#8b5cf6',
          animated: true,
        };
        onUpdateConnections([...connections, newConn]);
        setConnectingStart(null);
        onSelectTool('select');
      }
      return;
    }

    let nextSelected = selectedCardIds;
    if (e.shiftKey || e.ctrlKey) {
      if (selectedCardIds.includes(cardId)) {
        nextSelected = selectedCardIds.filter(id => id !== cardId);
      } else {
        nextSelected = [...selectedCardIds, cardId];
      }
    } else {
      if (!selectedCardIds.includes(cardId)) {
        nextSelected = [cardId];
      }
    }
    onSelectCards(nextSelected);

    setIsDraggingCards(true);
    setDragStartMouse({ x: e.clientX, y: e.clientY });
    setInitialCardPositions(
      cards
        .filter(c => nextSelected.includes(c.id))
        .map(c => ({ id: c.id, x: c.x, y: c.y }))
    );
  };

  // Start Resizing Handle
  const handleStartResize = (e: React.MouseEvent, cardId: string, handle: string) => {
    e.stopPropagation();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    setResizeState({
      cardId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initX: card.x,
      initY: card.y,
      initW: card.width || 280,
      initH: card.height || 180,
    });
  };

  // Start Rotating Handle
  const handleStartRotate = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const w = card.width || 280;
    const h = card.height || 180;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cardCenterX = rect.left + pan.x + (card.x + w / 2) * zoom;
    const cardCenterY = rect.top + pan.y + (card.y + h / 2) * zoom;

    setRotateState({
      cardId,
      centerX: cardCenterX,
      centerY: cardCenterY,
    });
  };

  // Start Port Connecting Handle
  const handleStartConnect = (
    e: React.MouseEvent,
    cardId: string,
    side: 'top' | 'right' | 'bottom' | 'left'
  ) => {
    e.stopPropagation();
    setConnectingStart({ cardId, side });
    const canvasPos = toCanvasCoords(e.clientX, e.clientY);
    setConnectionMousePos(canvasPos);
  };

  // Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    // Marquee Selection Box
    if (marqueeBox) {
      const canvasPos = toCanvasCoords(e.clientX, e.clientY);
      setMarqueeBox(prev => (prev ? { ...prev, currentX: canvasPos.x, currentY: canvasPos.y } : null));

      // Calculate intersecting cards
      const minX = Math.min(marqueeBox.startX, canvasPos.x);
      const maxX = Math.max(marqueeBox.startX, canvasPos.x);
      const minY = Math.min(marqueeBox.startY, canvasPos.y);
      const maxY = Math.max(marqueeBox.startY, canvasPos.y);

      const intersecting = cards.filter(card => {
        const cw = card.width || 280;
        const ch = card.height || 160;
        return card.x < maxX && card.x + cw > minX && card.y < maxY && card.y + ch > minY;
      });

      onSelectCards(intersecting.map(c => c.id));
      return;
    }

    // Rotating
    if (rotateState) {
      const angle =
        Math.atan2(e.clientY - rotateState.centerY, e.clientX - rotateState.centerX) * (180 / Math.PI) + 90;
      const normalized = Math.round((angle + 360) % 360);
      onUpdateCards(
        cards.map(c => (c.id === rotateState.cardId ? { ...c, rotation: normalized } : c))
      );
      return;
    }

    // Resizing
    if (resizeState) {
      const dx = (e.clientX - resizeState.startX) / zoom;
      const dy = (e.clientY - resizeState.startY) / zoom;
      let newX = resizeState.initX;
      let newY = resizeState.initY;
      let newW = resizeState.initW;
      let newH = resizeState.initH;

      const minW = 60;
      const minH = 40;

      if (resizeState.handle.includes('e')) {
        newW = Math.max(minW, resizeState.initW + dx);
      }
      if (resizeState.handle.includes('w')) {
        const potentialW = resizeState.initW - dx;
        if (potentialW >= minW) {
          newW = potentialW;
          newX = resizeState.initX + dx;
        }
      }
      if (resizeState.handle.includes('s')) {
        newH = Math.max(minH, resizeState.initH + dy);
      }
      if (resizeState.handle.includes('n')) {
        const potentialH = resizeState.initH - dy;
        if (potentialH >= minH) {
          newH = potentialH;
          newY = resizeState.initY + dy;
        }
      }

      onUpdateCards(
        cards.map(c =>
          c.id === resizeState.cardId
            ? { ...c, x: Math.round(newX), y: Math.round(newY), width: Math.round(newW), height: Math.round(newH) }
            : c
        )
      );
      return;
    }

    // Dragging Cards
    if (isDraggingCards) {
      const deltaX = (e.clientX - dragStartMouse.x) / zoom;
      const deltaY = (e.clientY - dragStartMouse.y) / zoom;

      // Smart Snapping Logic
      const draggedCard = cards.find(c => selectedCardIds.includes(c.id));
      const newGuides: SnapGuide[] = [];

      let snapOffsetX = 0;
      let snapOffsetY = 0;

      if (draggedCard) {
        const candidateX = draggedCard.x + deltaX;
        const candidateY = draggedCard.y + deltaY;
        const targetW = draggedCard.width || 280;
        const targetH = draggedCard.height || 180;

        const otherCards = cards.filter(c => !selectedCardIds.includes(c.id));

        for (const other of otherCards) {
          const ow = other.width || 280;
          const oh = other.height || 180;

          // Vertical snaps (X alignments)
          if (Math.abs(candidateX - other.x) < 6) {
            snapOffsetX = other.x - candidateX;
            newGuides.push({ type: 'vertical', pos: other.x, start: Math.min(candidateY, other.y) - 50, end: Math.max(candidateY + targetH, other.y + oh) + 50 });
          } else if (Math.abs(candidateX + targetW - (other.x + ow)) < 6) {
            snapOffsetX = other.x + ow - (candidateX + targetW);
            newGuides.push({ type: 'vertical', pos: other.x + ow, start: Math.min(candidateY, other.y) - 50, end: Math.max(candidateY + targetH, other.y + oh) + 50 });
          }

          // Horizontal snaps (Y alignments)
          if (Math.abs(candidateY - other.y) < 6) {
            snapOffsetY = other.y - candidateY;
            newGuides.push({ type: 'horizontal', pos: other.y, start: Math.min(candidateX, other.x) - 50, end: Math.max(candidateX + targetW, other.x + ow) + 50 });
          } else if (Math.abs(candidateY + targetH - (other.y + oh)) < 6) {
            snapOffsetY = other.y + oh - (candidateY + targetH);
            newGuides.push({ type: 'horizontal', pos: other.y + oh, start: Math.min(candidateX, other.x) - 50, end: Math.max(candidateX + targetW, other.x + ow) + 50 });
          }
        }
      }

      setSnapGuides(newGuides);

      const finalDeltaX = deltaX + snapOffsetX;
      const finalDeltaY = deltaY + snapOffsetY;

      const posMap = new Map<string, { x: number; y: number }>();
      initialCardPositions.forEach(p => posMap.set(p.id, p));

      onUpdateCards(
        cards.map(c => {
          const init = posMap.get(c.id);
          if (init) {
            return {
              ...c,
              x: Math.round(init.x + finalDeltaX),
              y: Math.round(init.y + finalDeltaY),
            };
          }
          return c;
        })
      );
      return;
    }

    // Pending Connection Drawing
    if (connectingStart) {
      const canvasPos = toCanvasCoords(e.clientX, e.clientY);
      setConnectionMousePos(canvasPos);
    }
  };

  // Mouse Up
  const handleMouseUp = (e: React.MouseEvent) => {
    setIsPanning(false);
    setIsDraggingCards(false);
    setResizeState(null);
    setRotateState(null);
    setMarqueeBox(null);
    setSnapGuides([]);

    // Finish connection line if dropped onto another card
    if (connectingStart) {
      const targetEl = document.elementFromPoint(e.clientX, e.clientY);
      const cardEl = targetEl?.closest('[data-card-id]') as HTMLElement;
      const targetCardId = cardEl?.dataset?.cardId;

      if (targetCardId && targetCardId !== connectingStart.cardId) {
        const newConn: Connection = {
          id: `conn-${Date.now()}`,
          fromId: connectingStart.cardId,
          fromSide: connectingStart.side,
          toId: targetCardId,
          toSide: 'left',
          color: '#8b5cf6',
          animated: true,
        };
        onUpdateConnections([...connections, newConn]);
      }
      setConnectingStart(null);
      if (activeTool === 'arrow') onSelectTool('select');
    }
  };

  // Delete Card
  const handleDeleteCard = (cardId: string) => {
    onUpdateCards(cards.filter(c => c.id !== cardId));
    onUpdateConnections(connections.filter(c => c.fromId !== cardId && c.toId !== cardId));
    onSelectCards(selectedCardIds.filter(id => id !== cardId));
  };

  // Duplicate Card
  const handleDuplicateCard = (cardId: string) => {
    const orig = cards.find(c => c.id === cardId);
    if (!orig) return;

    const copy: CanvasCardItem = {
      ...orig,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      x: orig.x + 30,
      y: orig.y + 30,
      title: `${orig.title} (Copy)`,
    };
    onUpdateCards([...cards, copy]);
    onSelectCards([copy.id]);
  };

  // Duplicate Multi-Selection
  const handleDuplicateSelected = () => {
    const toDuplicate = cards.filter(c => selectedCardIds.includes(c.id));
    if (toDuplicate.length === 0) return;

    const newCards = toDuplicate.map(orig => ({
      ...orig,
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      x: orig.x + 40,
      y: orig.y + 40,
      title: `${orig.title} (Copy)`,
    }));

    onUpdateCards([...cards, ...newCards]);
    onSelectCards(newCards.map(c => c.id));
  };

  // Delete Multi-Selection
  const handleDeleteSelected = () => {
    if (selectedCardIds.length === 0 && !selectedConnectionId) return;

    if (selectedCardIds.length > 0) {
      onUpdateCards(cards.filter(c => !selectedCardIds.includes(c.id)));
      onUpdateConnections(
        connections.filter(c => !selectedCardIds.includes(c.fromId) && !selectedCardIds.includes(c.toId))
      );
      onSelectCards([]);
    }

    if (selectedConnectionId) {
      onUpdateConnections(connections.filter(c => c.id !== selectedConnectionId));
      setSelectedConnectionId(null);
    }
  };

  // Layering
  const handleBringToFront = () => {
    const maxZ = Math.max(10, ...cards.map(c => c.zIndex || 10));
    onUpdateCards(
      cards.map(c => (selectedCardIds.includes(c.id) ? { ...c, zIndex: maxZ + 1 } : c))
    );
  };

  const handleSendToBack = () => {
    const minZ = Math.min(10, ...cards.map(c => c.zIndex || 10));
    onUpdateCards(
      cards.map(c => (selectedCardIds.includes(c.id) ? { ...c, zIndex: Math.max(1, minZ - 1) } : c))
    );
  };

  // Grouping
  const handleGroup = () => {
    if (selectedCardIds.length < 2) return;
    const newGroupId = `group-${Date.now()}`;
    onUpdateCards(
      cards.map(c => (selectedCardIds.includes(c.id) ? { ...c, groupId: newGroupId } : c))
    );
  };

  const handleUngroup = () => {
    onUpdateCards(
      cards.map(c => (selectedCardIds.includes(c.id) ? { ...c, groupId: undefined } : c))
    );
  };

  // Toggle ambient glow
  const handleToggleGlow = (cardId: string) => {
    onUpdateCards(
      cards.map(c => (c.id === cardId ? { ...c, hasGlow: !c.hasGlow } : c))
    );
  };

  // Add Element helper
  const handleAddElement = (type: string, subtype?: string) => {
    const centerPos = toCanvasCoords(window.innerWidth / 2, window.innerHeight / 2);
    const timestamp = Date.now();

    let newCard: CanvasCardItem;

    if (type === 'text') {
      newCard = {
        id: `text-${timestamp}`,
        type: 'text',
        x: Math.round(centerPos.x),
        y: Math.round(centerPos.y),
        width: 200,
        height: 60,
        title: 'Text Box',
        accent: 'purple',
        data: { text: 'Type your text here...' },
        textStyle: { fontSize: 16, fontWeight: 'normal', textColor: '#1e293b' },
      };
    } else if (type === 'shape') {
      newCard = {
        id: `shape-${timestamp}`,
        type: 'shape',
        x: Math.round(centerPos.x),
        y: Math.round(centerPos.y),
        width: 160,
        height: 120,
        title: 'Shape',
        accent: 'blue',
        data: { text: subtype === 'diamond' ? 'Decision' : 'Process' },
        shapeStyle: {
          subtype: (subtype as any) || 'rectangle',
          fillColor: '#f1f5f9',
          strokeColor: '#64748b',
          strokeWidth: 2,
        },
      };
    } else {
      newCard = {
        id: `card-${timestamp}`,
        type: 'concept',
        x: Math.round(centerPos.x),
        y: Math.round(centerPos.y),
        width: 270,
        height: 180,
        title: 'New Card',
        badgeNumber: cards.length + 1,
        accent: 'pink',
        hasGlow: true,
        data: {
          content: 'Double-click to write concepts, documentation, or architecture details.',
          tags: ['Idea', 'Todo'],
        },
      };
    }

    onUpdateCards([...cards, newCard]);
    onSelectCards([newCard.id]);
  };

  // Render Card Content
  const renderCardContent = (card: CanvasCardItem) => {
    const isEditing = editingCardId === card.id;

    if (card.type === 'shape') {
      return (
        <ShapeCard
          id={card.id}
          width={card.width || 160}
          height={card.height || 120}
          shapeStyle={card.shapeStyle}
          textStyle={card.textStyle}
          text={card.data?.text || card.title}
          isEditing={isEditing}
          onStartEditing={() => setEditingCardId(card.id)}
          onTextChange={newText => {
            onUpdateCards(
              cards.map(c =>
                c.id === card.id ? { ...c, title: newText, data: { ...c.data, text: newText } } : c
              )
            );
          }}
        />
      );
    }

    if (card.type === 'text') {
      return (
        <TextCard
          id={card.id}
          text={card.data?.text || card.title}
          textStyle={card.textStyle}
          isEditing={isEditing}
          onStartEditing={() => setEditingCardId(card.id)}
          onTextChange={newText => {
            onUpdateCards(
              cards.map(c =>
                c.id === card.id ? { ...c, title: newText, data: { ...c.data, text: newText } } : c
              )
            );
          }}
        />
      );
    }

    switch (card.type) {
      case 'banner':
        return (
          <BannerCard
            title={card.title}
            subtitle={card.data?.subtitle || ''}
            tags={card.data?.tags}
            onUpdate={updated => {
              onUpdateCards(
                cards.map(c =>
                  c.id === card.id
                    ? {
                        ...c,
                        title: updated.title ?? c.title,
                        data: { ...c.data, subtitle: updated.subtitle ?? c.data?.subtitle },
                      }
                    : c
                )
              );
            }}
          />
        );
      case 'goal':
        return (
          <GoalCard
            title={card.title}
            goals={card.data?.goals}
            onToggleGoal={goalId => {
              const updatedGoals = card.data?.goals?.map((g: any) =>
                g.id === goalId ? { ...g, done: !g.done } : g
              );
              onUpdateCards(
                cards.map(c =>
                  c.id === card.id ? { ...c, data: { ...c.data, goals: updatedGoals } } : c
                )
              );
            }}
          />
        );
      case 'concept':
        return (
          <ConceptCard
            badgeNumber={card.badgeNumber}
            title={card.title}
            content={card.data?.content || ''}
            tags={card.data?.tags}
            accent={card.accent}
            onUpdate={updated => {
              onUpdateCards(
                cards.map(c =>
                  c.id === card.id
                    ? {
                        ...c,
                        title: updated.title ?? c.title,
                        data: { ...c.data, content: updated.content ?? c.data?.content },
                      }
                    : c
                )
              );
            }}
          />
        );
      case 'code':
        return (
          <CodeCard
            badgeNumber={card.badgeNumber}
            title={card.title}
            description={card.data?.description || ''}
            language={card.data?.language || 'python'}
            code={card.data?.code || ''}
            output={card.data?.output}
            accent={card.accent}
            onUpdate={updated => {
              onUpdateCards(
                cards.map(c =>
                  c.id === card.id
                    ? {
                        ...c,
                        title: updated.title ?? c.title,
                        data: {
                          ...c.data,
                          description: updated.description ?? c.data?.description,
                          code: updated.code ?? c.data?.code,
                          output: updated.output ?? c.data?.output,
                        },
                      }
                    : c
                )
              );
            }}
          />
        );
      case 'datatypes':
        return (
          <DataTypesCard
            badgeNumber={card.badgeNumber}
            title={card.title}
            description={card.data?.description}
            items={card.data?.items}
          />
        );
      case 'flowchart':
        return (
          <FlowDiagramCard
            title={card.title}
            data={card.data}
            onUpdate={updatedData => {
              onUpdateCards(
                cards.map(c =>
                  c.id === card.id ? { ...c, data: { ...c.data, ...updatedData } } : c
                )
              );
            }}
          />
        );
      case 'mindmap':
        return (
          <MindMapCard
            title={card.title}
            center={card.data?.center || 'Python'}
            topics={card.data?.topics}
            onUpdate={updated => {
              onUpdateCards(
                cards.map(c =>
                  c.id === card.id
                    ? {
                        ...c,
                        data: {
                          ...c.data,
                          center: updated.center ?? c.data?.center,
                          topics: updated.topics ?? c.data?.topics,
                        },
                      }
                    : c
                )
              );
            }}
          />
        );
      case 'note':
        return <NoteCard title={card.title} bullets={card.data?.bullets} />;
      case 'tasks':
        return <TasksCard title={card.title} items={card.data?.items} />;
      case 'resources':
        return <ResourcesCard title={card.title} links={card.data?.links} />;
      case 'image_concept':
        return <ImageConceptCard title={card.title} />;
      case 'quiz':
        return (
          <QuizCard
            title={card.title}
            question={card.data?.question}
            options={card.data?.options}
            correctIndex={card.data?.correctIndex}
            explanation={card.data?.explanation}
          />
        );
      case 'comment':
        return (
          <CommentCard
            title={card.title}
            comment={card.data?.comment}
            author={card.data?.author}
          />
        );
      default:
        return (
          <ConceptCard
            badgeNumber={card.badgeNumber || 1}
            title={card.title}
            content={card.data?.content || ''}
            tags={card.data?.tags}
            accent={card.accent}
          />
        );
    }
  };

  // Find active element for text formatting bar position
  const primarySelectedCard = cards.find(c => selectedCardIds[0] === c.id);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={e => {
        e.preventDefault();
        setContextMenu({
          isOpen: true,
          x: e.clientX,
          y: e.clientY,
          targetType: 'canvas',
          cardIds: [],
        });
      }}
      className={`relative w-full h-full overflow-hidden select-none cursor-default ${theme.canvasBg}`}
      style={{ '--dot-color': theme.dotsColor } as React.CSSProperties}
    >
      {/* Canvas Infinite Background Dots */}
      <div
        className="canvas-background canvas-dots absolute inset-0 w-full h-full pointer-events-auto"
        style={{
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Canvas Transform Layer */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isPanning || isDraggingCards || resizeState ? 'none' : 'transform 0.05s ease-out',
        }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Alignment Snapping Guides */}
        <AlignmentGuides guides={snapGuides} />

        {/* SVG Connection Lines */}
        <ConnectionLines
          connections={connections}
          cards={cards}
          pendingConnection={
            connectingStart
              ? {
                  fromId: connectingStart.cardId,
                  fromSide: connectingStart.side,
                  currentX: connectionMousePos.x,
                  currentY: connectionMousePos.y,
                }
              : null
          }
          selectedConnectionId={selectedConnectionId}
          onSelectConnection={id => {
            setSelectedConnectionId(id);
            onSelectCards([]);
          }}
          onDeleteConnection={connId => {
            onUpdateConnections(connections.filter(c => c.id !== connId));
            if (selectedConnectionId === connId) setSelectedConnectionId(null);
          }}
        />

        {/* Render Canvas Elements / Cards */}
        <div className="pointer-events-auto">
          {cards.map(card => {
            const isSelected = selectedCardIds.includes(card.id);
            const isMatch =
              searchQuery &&
              (card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                JSON.stringify(card.data).toLowerCase().includes(searchQuery.toLowerCase()));

            return (
              <div
                key={card.id}
                data-card-id={card.id}
                className={isMatch ? 'ring-4 ring-yellow-400 rounded-3xl animate-bounce' : ''}
              >
                <CanvasCard
                  card={card}
                  isSelected={isSelected}
                  isMultiSelected={selectedCardIds.length > 1 && isSelected}
                  onSelect={e => {
                    e.stopPropagation();
                    if (e.shiftKey || e.ctrlKey) {
                      onSelectCards(
                        selectedCardIds.includes(card.id)
                          ? selectedCardIds.filter(id => id !== card.id)
                          : [...selectedCardIds, card.id]
                      );
                    } else {
                      onSelectCards([card.id]);
                    }
                  }}
                  onStartDrag={handleStartCardDrag}
                  onStartResize={handleStartResize}
                  onStartRotate={handleStartRotate}
                  onDelete={handleDeleteCard}
                  onDuplicate={handleDuplicateCard}
                  onToggleGlow={handleToggleGlow}
                  onStartConnect={handleStartConnect}
                  onContextMenu={(e, cid) => {
                    if (!selectedCardIds.includes(cid)) {
                      onSelectCards([cid]);
                    }
                    setContextMenu({
                      isOpen: true,
                      x: e.clientX,
                      y: e.clientY,
                      targetType: 'card',
                      cardIds: selectedCardIds.includes(cid) ? selectedCardIds : [cid],
                    });
                  }}
                  isEditingText={editingCardId === card.id}
                >
                  {renderCardContent(card)}
                </CanvasCard>
              </div>
            );
          })}
        </div>

        {/* Marquee Drag Selection Box */}
        {marqueeBox && (
          <div
            className="absolute border-2 border-purple-500 bg-purple-500/10 rounded-lg pointer-events-none z-40"
            style={{
              left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
              top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
              width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
              height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`,
            }}
          />
        )}
      </div>

      {/* Floating Text Formatting Toolbar for Selected Element */}
      {primarySelectedCard && (primarySelectedCard.type === 'text' || primarySelectedCard.type === 'shape' || editingCardId) && (
        <TextFormattingBar
          textStyle={primarySelectedCard.textStyle || {}}
          onChangeTextStyle={style => {
            onUpdateCards(
              cards.map(c =>
                selectedCardIds.includes(c.id) ? { ...c, textStyle: style } : c
              )
            );
          }}
          x={pan.x + (primarySelectedCard.x + (primarySelectedCard.width || 200) / 2) * zoom}
          y={pan.y + primarySelectedCard.y * zoom}
        />
      )}

      {/* Right-click Context Menu */}
      <CanvasContextMenu
        state={contextMenu}
        onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
        onCut={() => onCutCards(cards.filter(c => selectedCardIds.includes(c.id)))}
        onCopy={() => onCopyCards(cards.filter(c => selectedCardIds.includes(c.id)))}
        onPaste={onPasteCards}
        onDuplicate={handleDuplicateSelected}
        onDelete={handleDeleteSelected}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
        onGroup={handleGroup}
        onUngroup={handleUngroup}
        onToggleGlow={() => {
          selectedCardIds.forEach(id => handleToggleGlow(id));
        }}
        onStartEditText={() => {
          if (selectedCardIds[0]) setEditingCardId(selectedCardIds[0]);
        }}
        onAddElement={handleAddElement}
        onSelectAll={() => onSelectCards(cards.map(c => c.id))}
        onResetZoom={() => onZoomChange(1.0)}
        canPaste={!!clipboard && clipboard.length > 0}
        isMultiSelect={selectedCardIds.length > 1}
      />

      {/* Minimap Radar */}
      <Minimap
        cards={cards}
        pan={pan}
        zoom={zoom}
        onPanTo={(targetX, targetY) => {
          setPan({ x: targetX, y: targetY });
        }}
      />
    </div>
  );
};
