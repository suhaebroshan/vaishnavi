import Dexie, { type EntityTable } from 'dexie';
import type {
  Worker as WorkerType, Customer as CustomerType, Admin as AdminType,
  Service, Address, Booking, BookingEvent, Message, Notification,
  Payment, Review, Ad, User
} from '../types';

interface VaishnaviDB extends Dexie {
  users: EntityTable<User, 'id'>;
  workers: EntityTable<WorkerType, 'id'>;
  customers: EntityTable<CustomerType, 'id'>;
  admins: EntityTable<AdminType, 'id'>;
  services: EntityTable<Service, 'id'>;
  addresses: EntityTable<Address, 'id'>;
  bookings: EntityTable<Booking, 'id'>;
  bookingEvents: EntityTable<BookingEvent, 'id'>;
  reviews: EntityTable<Review, 'id'>;
  payments: EntityTable<Payment, 'id'>;
  messages: EntityTable<Message, 'id'>;
  notifications: EntityTable<Notification, 'id'>;
  ads: EntityTable<Ad, 'id'>;
}

export const db = new Dexie('VaishnaviDB') as VaishnaviDB;

// Version 1: initial schema — all stores with base indexes
db.version(1).stores({
  users: 'id, role, name',
  workers: 'id, serviceType, status',
  customers: 'id',
  admins: 'id',
  services: 'id',
  addresses: 'id, userId',
  bookings: 'id, customerId, workerId, status, createdAt',
  bookingEvents: 'id, bookingId, timestamp',
  reviews: 'id, workerId, bookingId',
  payments: 'id, bookingId',
  messages: 'id, bookingId, senderId, createdAt',
  notifications: 'id, userId, reading, createdAt',
  ads: 'id',
});

// Version 2: add receiverId index on messages for chat queries
db.version(2).stores({
  users: 'id, role, name',
  workers: 'id, serviceType, status',
  customers: 'id',
  admins: 'id',
  services: 'id',
  addresses: 'id, userId',
  bookings: 'id, customerId, workerId, status, createdAt',
  bookingEvents: 'id, bookingId, timestamp',
  reviews: 'id, workerId, bookingId',
  payments: 'id, bookingId',
  messages: 'id, bookingId, senderId, receiverId, createdAt',
  notifications: 'id, userId, reading, createdAt',
  ads: 'id',
});
