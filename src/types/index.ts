import type { EnvironmentId } from '../environments/config';

export type ItemUsage = 'info' | 'regular';
export type ItemPhase = 'registration' | 'feed';

export interface ItemDefinition {
  id: string;
  href: string;
  title: string;
  usage: ItemUsage;
  sequenceNumber: number;
  phase: ItemPhase;
  author?: string;
}

export interface SusanNotificationPayload {
  itemId: string;
  html: string;
}

export interface ItemResponse {
  interactionId: string;
  value: string;
  score: number;
}

export interface ItemResult {
  id: string;
  responses: ItemResponse[];
  totalScore: number;
}

export type AppPhase =
  | 'login'
  | 'welcome'
  | 'start'
  | 'registration'
  | 'feed'
  | 'end';

export interface SessionState {
  loggedIn: boolean;
  isDemo: boolean;
  environment: EnvironmentId | null;
  phase: AppPhase;
  currentIndex: number;
  results: ItemResult[];
}
