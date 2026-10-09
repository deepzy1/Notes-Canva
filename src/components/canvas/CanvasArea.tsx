import React, { useRef, useState, useEffect } from 'react';
import { CanvasCardItem, Connection, ThemeConfig } from '../../types/canvas';
import { CanvasCard } from './CanvasCard';
import { ConnectionLines } from './ConnectionLines';
import { Minimap } from './Minimap';
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

interface CanvasAreaProps {
  cards: CanvasCardItem[];
  connections: Connection[];
  theme: ThemeConfig;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onUpdateCards: (newCards: CanvasCardItem[]) => void;
  onUpdateConnections: (newConns: Connection[]) => void;
  selectedCardId: string | null;
  onSelectCard: (id: string | null) => void;
  searchQuery: string;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  cards,
  connections,
  theme,
  zoom,
  onZoomChange,
  onUpdateCards,
  onUpdateConnections,
  selectedCardId,
  onSelectCard,
  searchQuery,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan state (pixel translation)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Dragging a card state
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [cardDragOffset, setCardDragOffset] = useState({ x: 0, y: 0 });

  // Connecting cards state
  const [connectingStart, setConnectingStart] = useState<{
    cardId: string;
    side: 'top' | 'right' | 'bottom' | 'left';
  } | null>(null);
  const [connectionMousePos, setConnectionMousePos] = useState({ x: 0, y: 0 });

  // Handle Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
      const newZoom = Math.min(2.0, Math.max(0.4, zoom + zoomDelta));
      onZoomChange(newZoom);
    } else {
      // Pan with trackpad or mouse wheel
      setPan(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  // Start panning on empty canvas click
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if left click or middle click and clicking directly on background
    if (e.target === containerRef.current || (e.target as HTMLElement).classList.contains('canvas-background')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      onSelectCard(null);
    }
  };

  // Start dragging a specific card
  const handleStartCardDrag = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    onSelectCard(cardId);
    setDraggingCardId(cardId);
    setCardDragOffset({
      x: e.clientX / zoom - card.x,
      y: e.clientY / zoom - card.y,
    });
  };

  // Start creating a connection from a port
  const handleStartConnect = (
    e: React.MouseEvent,
    cardId: string,
    side: 'top' | 'right' | 'bottom' | 'left'
  ) => {
    e.stopPropagation();
    setConnectingStart({ cardId, side });
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setConnectionMousePos({
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom,
      });
    }
  };

  // Global mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (draggingCardId) {
      const newX = e.clientX / zoom - cardDragOffset.x;
      const newY = e.clientY / zoom - cardDragOffset.y;

      onUpdateCards(
        cards.map(c => (c.id === draggingCardId ? { ...c, x: Math.round(newX), y: Math.round(newY) } : c))
      );
    } else if (connectingStart) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setConnectionMousePos({
          x: (e.clientX - rect.left - pan.x) / zoom,
          y: (e.clientY - rect.top - pan.y) / zoom,
        });
      }
    }
  };

  // Global mouse up
  const handleMouseUp = (e: React.MouseEvent) => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (draggingCardId) {
      setDraggingCardId(null);
    }

    if (connectingStart) {
      // Check if dropped onto a card
      const targetElement = document.elementFromPoint(e.clientX, e.clientY);
      const cardElement = targetElement?.closest('[data-card-id]') as HTMLElement;
      const targetCardId = cardElement?.dataset?.cardId;

      if (targetCardId && targetCardId !== connectingStart.cardId) {
        // Create new connection
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          fromId: connectingStart.cardId,
          fromSide: connectingStart.side,
          toId: targetCardId,
          toSide: 'left',
          color: '#8b5cf6',
          animated: true,
        };
        onUpdateConnections([...connections, newConnection]);
      }

      setConnectingStart(null);
    }
  };

  // Delete Card
  const handleDeleteCard = (cardId: string) => {
    onUpdateCards(cards.filter(c => c.id !== cardId));
    onUpdateConnections(connections.filter(c => c.fromId !== cardId && c.toId !== cardId));
    if (selectedCardId === cardId) onSelectCard(null);
  };

  // Duplicate Card
  const handleDuplicateCard = (cardId: string) => {
    const orig = cards.find(c => c.id === cardId);
    if (!orig) return;

    const copy: CanvasCardItem = {
      ...orig,
      id: `card-${Date.now()}`,
      x: orig.x + 30,
      y: orig.y + 30,
      title: `${orig.title} (Copy)`,
    };
    onUpdateCards([...cards, copy]);
  };

  // Toggle ambient blob glow
  const handleToggleGlow = (cardId: string) => {
    onUpdateCards(
      cards.map(c => (c.id === cardId ? { ...c, hasGlow: !c.hasGlow } : c))
    );
  };

  // Render card content based on type
  const renderCardContent = (card: CanvasCardItem) => {
    switch (card.type) {
      case 'banner':
        return (
          <BannerCard
            title={card.title}
            subtitle={card.data?.subtitle || ''}
            tags={card.data?.tags}
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
        return <FlowDiagramCard title={card.title} />;
      case 'mindmap':
        return (
          <MindMapCard
            title={card.title}
            center={card.data?.center || 'Python'}
            topics={card.data?.topics}
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
            content={card.data?.content || 'Custom workspace item'}
            tags={card.data?.tags}
            accent={card.accent}
          />
        );
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative w-full h-full overflow-hidden select-none cursor-default ${theme.canvasBg}`}
      style={
        {
          '--dot-color': theme.dotsColor,
        } as React.CSSProperties
      }
    >
      {/* Canvas Infinite Background Dots Grid */}
      <div
        className="canvas-background canvas-dots absolute inset-0 w-full h-full pointer-events-auto"
        style={{
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Canvas Viewport Transformation Layer */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isPanning || draggingCardId ? 'none' : 'transform 0.05s ease-out',
        }}
        className="absolute inset-0 pointer-events-none"
      >
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
          onDeleteConnection={connId => {
            onUpdateConnections(connections.filter(c => c.id !== connId));
          }}
        />

        {/* Render Canvas Cards */}
        <div className="pointer-events-auto">
          {cards.map(card => {
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
                  isSelected={selectedCardId === card.id}
                  onSelect={e => {
                    e.stopPropagation();
                    onSelectCard(card.id);
                  }}
                  onStartDrag={handleStartCardDrag}
                  onDelete={handleDeleteCard}
                  onDuplicate={handleDuplicateCard}
                  onToggleGlow={handleToggleGlow}
                  onStartConnect={handleStartConnect}
                >
                  {renderCardContent(card)}
                </CanvasCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Canvas Minimap Radar */}
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
