import { AgeGroup, PartyIdea, HolidayActivity } from '../types';

async function fetchFromApi<T>(endpoint: string, body: object): Promise<T> {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response from server.' }));
            throw new Error(errorData.error || errorData.details || `Request failed with status ${response.status}`);
        }

        return await response.json() as T;
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        if (error instanceof Error) {
            // Re-throw the specific error message to be caught by the UI component
            throw error;
        }
        // Fallback for unexpected errors
        throw new Error("An unexpected network error occurred.");
    }
}

export const generatePartyIdeas = async (ageGroup: AgeGroup): Promise<PartyIdea[] | null> => {
    return fetchFromApi<PartyIdea[]>('/api/generate', { type: 'party', ageGroup });
};

export const generateHolidayActivities = async (ageGroup: AgeGroup, location: string): Promise<HolidayActivity[] | null> => {
    return fetchFromApi<HolidayActivity[]>('/api/generate', { type: 'holiday', ageGroup, location });
};
