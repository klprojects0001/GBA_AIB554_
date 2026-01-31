
export enum Sentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative'
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  sentiment: Sentiment;
  status: 'pending' | 'approved' | 'responded';
  aiDraft?: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  partySize: number;
  dateTime: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'no-show';
  source: 'web' | 'sms' | 'phone';
}

export interface BookingIntent {
  guestName?: string;
  partySize?: number;
  date?: string;
  time?: string;
  specialRequests?: string;
  isComplete: boolean;
}

export interface RestaurantStats {
  noShowRate: number;
  tableUtilization: number;
  starRating: number;
  responseRate: number;
  revenueGain: number;
}
