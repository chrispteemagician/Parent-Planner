import { GoogleGenAI } from "@google/genai";

// The types `PartyIdea` and `HolidayActivity` are structurally enforced by the prompts sent to the AI.
// We don't import them here as this serverless function typically runs in a separate context from the frontend code.

// This is a server-side file. It assumes the @google/genai package is available
// in its execution environment, and process.env.API_KEY is configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const parseJsonResponse = <T,>(jsonString: string): T | null => {
    let cleanJsonString = jsonString.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonString.match(fenceRegex);
    if (match && match[2]) {
        cleanJsonString = match[2].trim();
    }
    
    try {
        return JSON.parse(cleanJsonString) as T;
    } catch (error) {
        console.error("Failed to parse JSON response:", error);
        console.error("Original string:", jsonString);
        return null;
    }
};

const getPartyIdeasPrompt = (ageGroup: string) => `You are a helpful AI assistant for busy parents. Generate a list of 5 creative and stress-free party ideas for children aged ${ageGroup}. For each idea, provide: a unique 'theme', an engaging 'description', a list of 3 'activities', a list of 3 creative 'foodIdeas', and a suggestion for a 'partyFavor'. Return the response as a valid JSON array of objects. Do not include any introductory text, just the raw JSON array. The JSON should conform to this TypeScript interface: 
interface PartyIdea {
  theme: string;
  description: string;
  activities: string[];
  foodIdeas: string[];
  partyFavor: string;
}`;

const getHolidayActivitiesPrompt = (ageGroup: string, location: string) => `You are a helpful AI assistant for busy parents. Generate a list of 6 fun and engaging school holiday activities for children aged ${ageGroup} in or near ${location}. Include a mix of indoor and outdoor activities, and both free and paid options. For each activity, provide: a 'name', a brief 'description', the 'type' ('Indoor' | 'Outdoor'), and the 'cost' ('Free' | 'Paid'). Return the response as a valid JSON array of objects. Do not include any introductory text, just the raw JSON array. The JSON should conform to this TypeScript interface:
interface HolidayActivity {
  name: string;
  description:string;
  type: 'Indoor' | 'Outdoor';
  cost: 'Free' | 'Paid';
}`;


/**
 * Handler for serverless function environments (e.g., Vercel, Netlify).
 * Assumes a modern edge runtime where Request and Response objects are standard.
 */
export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json', 'Allow': 'POST' } });
    }

    if (!process.env.API_KEY) {
        return new Response(JSON.stringify({ error: 'The AI is taking a break. API key not configured on the server.' }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    }

    try {
        const body = await req.json();
        const { type, ageGroup, location } = body;

        let prompt;
        if (type === 'party') {
            if (!ageGroup) return new Response(JSON.stringify({ error: 'Age group is required for party ideas.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            prompt = getPartyIdeasPrompt(ageGroup);
        } else if (type === 'holiday') {
            if (!ageGroup || !location) return new Response(JSON.stringify({ error: 'Age group and location are required for holiday activities.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            prompt = getHolidayActivitiesPrompt(ageGroup, location);
        } else {
            return new Response(JSON.stringify({ error: 'Invalid request type specified.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const genAIResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const data = parseJsonResponse<any[]>(genAIResponse.text);

        if (!data) {
            console.error("Unparseable JSON received from AI:", genAIResponse.text);
            return new Response(JSON.stringify({ error: 'The AI gave a confusing answer. Failed to parse response.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error("Error in API route:", error);
        return new Response(JSON.stringify({ error: 'An unexpected error occurred on the server.', details: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
