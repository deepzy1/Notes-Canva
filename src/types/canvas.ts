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
  | 'comment';

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

export interface CanvasCardItem {
  id: string;
  type: CardType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  title: string;
  badgeNumber?: number;
  accent: AccentColor;
  data: Record<string, any>;
  hasGlow?: boolean;
}

export interface Connection {
  id: string;
  fromId: string;
  fromSide: 'top' | 'right' | 'bottom' | 'left';
  toId: string;
  toSide: 'top' | 'right' | 'bottom' | 'left';
  color?: string;
  label?: string;
  animated?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  iconColor: string;
  count: number;
}

export interface CanvasMeta {
  id: string;
  name: string;
  folderId: string;
  updatedAt: string;
  description?: string;
  tags?: string[];
  theme: ThemeId;
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
