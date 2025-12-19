'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Tenant {
    id: string;
    name: string;
    phone: string;
    relation: string;
}

export interface Bill {
    id: string;
    propertyId: string;
    dueBy: string;
    type: string;
    balance: number;
    description: string;
    status: 'Unpaid' | 'Partial Paid' | 'Paid';
    createdAt: Date;
}

export interface Payment {
    id: string;
    propertyId: string;
    type: string;
    referenceNumber: string;
    balance: number;
    description: string;
    appliedToBills: { billId: string; amount: number }[];
    createdAt: Date;
}

export interface Property {
    id: string;
    address: string;
    mainTenant: string;
    mainTenantPhone?: string;
    tenants?: Tenant[];
    rent: number;
    occupied: boolean;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
    credit?: number;
    createdAt: Date;
}

interface PropertyContextType {
    properties: Property[];
    addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<void>;
    updatePropertyCredit: (propertyId: string, creditChange: number) => void;
    getPropertyCredit: (propertyId: string) => number;
    bills: Bill[];
    addBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'status'>) => Promise<void>;
    getBillsByProperty: (propertyId: string) => Bill[];
    payments: Payment[];
    addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => Promise<void>;
    getPaymentsByProperty: (propertyId: string) => Payment[];
    isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function useProperties() {
    const context = useContext(PropertyContext);
    if (!context) {
        throw new Error('useProperties must be used within a PropertyProvider');
    }
    return context;
}

export function PropertyProvider({ children }: { children: ReactNode }) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [bills, setBills] = useState<Bill[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch properties on mount
    useEffect(() => {
        async function fetchProperties() {
            try {
                const response = await fetch('/api/properties');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setProperties(data.properties.map((p: { id: string; address: string; mainTenant: string; rent: number; occupied: boolean; ownerName?: string; ownerEmail?: string; ownerPhone?: string; createdAt: string }) => ({
                            ...p,
                            createdAt: new Date(p.createdAt),
                        })));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch properties:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProperties();
    }, []);

    const addProperty = async (property: Omit<Property, 'id' | 'createdAt'>) => {
        try {
            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(property),
            });

            if (!response.ok) {
                throw new Error('Failed to add property');
            }

            const data = await response.json();
            if (data.success) {
                const newProperty = {
                    ...data.property,
                    createdAt: new Date(data.property.createdAt),
                };
                setProperties(prev => [newProperty, ...prev]);
            }
        } catch (error) {
            console.error('Failed to add property:', error);
            throw error;
        }
    };

    const addBill = async (bill: Omit<Bill, 'id' | 'createdAt' | 'status'>) => {
        // For now, store bills in memory (localStorage)
        const newBill: Bill = {
            ...bill,
            id: Date.now().toString(),
            status: 'Unpaid',
            createdAt: new Date(),
        };

        setBills(prev => [newBill, ...prev]);

        // Store in localStorage
        const storedBills = localStorage.getItem('bills');
        const billsArray = storedBills ? JSON.parse(storedBills) : [];
        billsArray.push(newBill);
        localStorage.setItem('bills', JSON.stringify(billsArray));
    };

    const getBillsByProperty = (propertyId: string) => {
        return bills.filter(bill => bill.propertyId === propertyId);
    };

    const addPayment = async (payment: Omit<Payment, 'id' | 'createdAt'>) => {
        const newPayment: Payment = {
            ...payment,
            id: Date.now().toString(),
            createdAt: new Date(),
        };

        setPayments(prev => [newPayment, ...prev]);

        // Store in localStorage
        const storedPayments = localStorage.getItem('payments');
        const paymentsArray = storedPayments ? JSON.parse(storedPayments) : [];
        paymentsArray.push(newPayment);
        localStorage.setItem('payments', JSON.stringify(paymentsArray));
    };

    const getPaymentsByProperty = (propertyId: string) => {
        return payments.filter(payment => payment.propertyId === propertyId);
    };

    // Load bills from localStorage on mount
    useEffect(() => {
        const storedBills = localStorage.getItem('bills');
        if (storedBills) {
            const billsArray = JSON.parse(storedBills);
            setBills(billsArray.map((b: Bill) => ({
                ...b,
                createdAt: new Date(b.createdAt),
            })));
        }
    }, []);

    // Load payments from localStorage on mount
    useEffect(() => {
        const storedPayments = localStorage.getItem('payments');
        if (storedPayments) {
            const paymentsArray = JSON.parse(storedPayments);
            setPayments(paymentsArray.map((p: Payment) => ({
                ...p,
                createdAt: new Date(p.createdAt),
            })));
        }
    }, []);

    const updatePropertyCredit = (propertyId: string, creditChange: number) => {
        setProperties(prevProperties => {
            const updatedProperties = prevProperties.map(p => {
                if (p.id === propertyId) {
                    return { ...p, credit: (p.credit || 0) + creditChange };
                }
                return p;
            });
            return updatedProperties;
        });
    };

    const getPropertyCredit = (propertyId: string): number => {
        const property = properties.find(p => p.id === propertyId);
        return property?.credit || 0;
    };

    return (
        <PropertyContext.Provider value={{
            properties,
            addProperty,
            updatePropertyCredit,
            getPropertyCredit,
            bills,
            addBill,
            getBillsByProperty,
            payments,
            addPayment,
            getPaymentsByProperty,
            isLoading
        }}>
            {children}
        </PropertyContext.Provider>
    );
}