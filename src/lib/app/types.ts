// This file will contain TypeScript types for our application

// Property types
export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'property_manager' | 'tenant';
  emailVerified?: Date;
  isActive?: boolean;
}

// Tenant types
export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  unitId: string;
}

// Unit types
export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  rent: number;
  status: 'vacant' | 'occupied' | 'maintenance';
}