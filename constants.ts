
import { Hairdresser, UserRole, BookingStatus, Booking } from './types';

export const COLORS = {
  primary: '#8B5CF6', // Electric Violet
  primaryDark: '#6D28D9',
  secondary: '#0F172A', // Slate 900
  accent: '#F472B6', // Pink
};

export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Espèces', icon: 'fa-money-bill-wave' },
  { id: 'card', name: 'Carte Bancaire', icon: 'fa-credit-card' },
  { id: 'mobile', name: 'Mobile Money (Wafacash/MT)', icon: 'fa-mobile-alt' },
];

export const MOCK_HAIRDRESSERS: Hairdresser[] = [
  {
    id: 'h1',
    name: 'Ahmed Benzani',
    email: 'ahmed@example.com',
    role: UserRole.BARBER,
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1503467913725-8484b65b0715?auto=format&fit=crop&q=80&w=200',
    bio: 'Expert en dégradés et barbes traditionnelles. 10 ans d\'expérience à Casablanca.',
    rating: 4.9,
    reviewCount: 124,
    services: [
      { id: 's1', name: 'Coupe Homme', price: 150, duration: 30 },
      { id: 's2', name: 'Barbe + Soin', price: 80, duration: 20 }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1621605815841-2dddbaaaf0b2?auto=format&fit=crop&q=80&w=400'
    ],
    availability: ['Lundi - Samedi: 09:00 - 20:00'],
    distance: 1.2
  },
  {
    id: 'h2',
    name: 'Sarah El Mansouri',
    email: 'sarah@example.com',
    role: UserRole.BARBER,
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=200',
    bio: 'Spécialiste coloration et soins capillaires pour femmes. Service premium à domicile.',
    rating: 4.7,
    reviewCount: 89,
    services: [
      { id: 's3', name: 'Coupe & Brushing', price: 250, duration: 60 },
      { id: 's4', name: 'Coloration complète', price: 500, duration: 120 }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&q=80&w=400'
    ],
    availability: ['Mardi - Dimanche: 10:00 - 19:00'],
    distance: 2.5
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    clientId: 'c1',
    barberId: 'h1',
    serviceId: 's1',
    date: '2024-05-20T14:30:00',
    status: BookingStatus.CONFIRMED,
    totalPrice: 150
  }
];
