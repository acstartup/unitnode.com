'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Property {
    id: string;
    address: string;
    mainTenant: string;
    rent: number;
    occupied: boolean;
    createdAt: Date;
}

interface PropertyContextType {
    properties: Property [];
    addProperty: (property: Omit<Property, 'id'>) => void;
}

const PropertyContext = createContext<PropertyContextType| undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
    const [properties, setProperties] = useState<Property[]>([]);

    const addProperty = (property: Omit<Property, 'id'>) => {
        const newProperty: Property = {
            ...property,
            id: Date.now().toString(),
        }
        setProperties((prev) => [...prev, newProperty]);
    }

    return (
        <PropertyContext.Provider value={{ properties, addProperty }}>
            {children}
        </PropertyContext.Provider>
    )
}

export function useProperties() {
    const context = useContext(PropertyContext);
    if (!context) {
        throw new Error('useProperties must be used within PropertyProvider');
    }
    return context;
}