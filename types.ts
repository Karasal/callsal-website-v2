import React from 'react';

export interface ExampleItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ServiceDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  examples: ExampleItem[];
  icon: React.ReactNode;
}

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
  onConfigure: () => void;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SectionProps {
  id?: string;
}

export type UserRole = 'client' | 'admin';
export type MeetingType = 'zoom' | 'phone' | 'in-person';

export interface User {
  id: string;
  email?: string;
  name: string;
  role: UserRole;
  businessName?: string;
  phone?: string;
  website?: string;
  avatar?: string;
  registrationKey?: string;
  isRegistered?: boolean;
  verified?: boolean;
  hasCompletedOnboarding?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  date: string;
  time: string;
  type: MeetingType;
  duration: number;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export interface ProjectLog {
  id: string;
  clientId: string;
  date: string;
  title: string;
  update: string;
  progress: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid';
  date: string;
}
