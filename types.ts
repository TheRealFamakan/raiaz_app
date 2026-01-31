
export enum UserRole {
  CLIENT = 'CLIENT',
  BARBER = 'BARBER',
  ADMIN = 'ADMIN'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DECLINED = 'DECLINED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isActive?: boolean;
  walletBalance?: number;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Hairdresser extends User {
  bio: string;
  rating: number;
  reviewCount: number;
  services: Service[];
  gallery: string[];
  availability: string[];
  distance?: number;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName?: string;
  barberId: string;
  serviceId: string;
  serviceName?: string;
  date: string;
  status: BookingStatus;
  totalPrice: number;
  paymentMethod?: string;
  notes?: string;
}
