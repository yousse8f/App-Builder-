export type ElementType = 'text' | 'image' | 'logo' | 'shape' | 'button';
export type BackgroundType = 'color' | 'gradient' | 'image';
export type Alignment = 'left' | 'center' | 'right';
export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export interface Background {
  type: BackgroundType;
  value?: string;
  color1?: string;
  color2?: string;
  imageUrl?: string;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  scale?: number;
  zIndex?: number;
  locked?: boolean;
  visible?: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontWeight: FontWeight;
  color: string;
  fontFamily?: string;
  alignment?: Alignment;
  lineHeight?: number;
  letterSpacing?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image' | 'logo';
  src: string;
  borderRadius?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'none';
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shape: 'rectangle' | 'circle' | 'triangle';
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  text: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: FontWeight;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
}

export type Element = TextElement | ImageElement | ShapeElement | ButtonElement;

export interface ScreenConfig {
  width: number;
  height: number;
  background: Background;
  elements: Element[];
  device?: {
    type: string;
    model: string;
  };
}