'use client';

import { useRef, useEffect, useState } from 'react';
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from 'use-places-autocomplete';

interface PlacesAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (address: string) => void;
}

export default function PlacesAutocomplete({
    value,
    onChange,
    onSelect,
}: PlacesAutocompleteProps) {
    const {
        ready,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
    });

    const [isFocused, setIsFocused] = useState(false);

    const handleSelect = async (address: string) => {
        setValue(address, false);
        clearSuggestions();
        onSelect(address);

        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            console.log('CoordinatesL', { lat, lng });
        } catch (error) {
            console.error('Error getting geocode:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange(newValue);
    }

    return (
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                disabled={!ready}
                className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main Street, Apt 4B, Anytown, CA 90210, USA"
            />

            {/* Dropdown suggestions */}
            {status === 'OK' && isFocused && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {data.map((suggestion) => {
                        const {
                            place_id,
                            structured_formatting: { main_text, secondary_text },
                        } = suggestion;

                        return (
                            <button
                                key={place_id}
                                onClick={() => handleSelect(suggestion.description)}
                                className="w-full px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                            >
                                <div className="text-sm font-medium text-gray-900">
                                    {main_text}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {secondary_text}
                                </div>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
}