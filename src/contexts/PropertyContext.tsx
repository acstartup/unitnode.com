'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Property {
    id: string;
    address: string;
    mainTenant: string;
    mainTenantPhone?: string;
    rent: number;
    occupied: boolean;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
    createdAt: Date;
}

interface PropertyContextType {
    properties: Property[];
    addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<void>;
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

    return (
        <PropertyContext.Provider value={{ properties, addProperty, isLoading }}>
            {children}
        </PropertyContext.Provider>
    );
}