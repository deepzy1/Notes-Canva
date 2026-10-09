export type CardType =
  | 'banner'
  | 'goal'
  | 'concept'
  | 'code'
  | 'datatypes'
  | 'flowchart'
  | 'mindmap'
  | 'note'
  | 'tasks'
  | 'resources'
  | 'image_concept'
  | 'quiz'
  | 'text'
  | 'shape'
  | 'comment';

export type ShapeSubtype =
  | 'rectangle'
  | 'rounded_rectangle'
  | 'circle'
  | 'diamond'
  | 'triangle'
  | 'star'
  | 'sticky';

export type AccentColor =
  | 'pink'
  | 'blue'
  | 'emerald'
  | 'orange'
  | 'purple'
  | 'yellow'
  | 'cyan'
  | 'rose';

export interface CardPort {
  id: string;
  side: 'top' | 'right' | 'bottom' | 'left';
}

export interface TextStyle {
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign?: 'left' | 'center' | 'right';
  textColor?: string;
}

export interface ShapeStyle {
  subtype?: ShapeSubtype;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  opacity?: number;
}

export interface CanvasCardItem {
  id: string;
  type: CardType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number; // In degrees
  zIndex?: number;
  groupId?: string;
  title: string;
  badgeNumber?: number;
  accent: AccentColor;
  data: Record<string, any>;
  hasGlow?: boolean;
  textStyle?: TextStyle;
  shapeStyle?: ShapeStyle;
  isLocked?: boolean;
}

export interface Connection {
  id: string;
  fromId: string;
  fromSide: 'top' | 'right' | 'bottom' | 'left';
  toId: string;
  toSide: 'top' | 'right' | 'bottom' | 'left';
  color?: string;
  label?: string;
  style?: 'curved' | 'straight' | 'dashed';
  animated?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  iconColor: string;
  count?: number;
}

export interface Workspace {
  id: string;
  name: string;
  folderId: string;
  cards: CanvasCardItem[];
  connections: Connection[];
  theme: ThemeId;
  createdAt: string;
  updatedAt: string;
}

export type ThemeId =
  | 'instagram'
  | 'apple'
  | 'nothing'
  | 'youtube'
  | 'facebook'
  | 'nature'
  | 'dark';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  icon: string;
  canvasBg: string;
  dotsColor: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  primaryGradient: string;
  accentColor: string;
  sidebarBg: string;
  headerBg: string;
  textColor: string;
  mutedTextColor: string;
}

export type ActiveTool =
  | 'select'
  | 'text'
  | 'card'
  | 'note'
  | 'image'
  | 'diagram'
  | 'shape'
  | 'arrow'
  | 'comment';

export interface SnapGuide {
  type: 'horizontal' | 'vertical';
  pos: number;
  start: number;
  end: number;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetType: 'card' | 'canvas' | 'connection';
  cardIds: string[];
  connectionId?: string;
}
