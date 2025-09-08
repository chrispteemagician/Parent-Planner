import { GoogleGenAI, Type } from "@google/genai";

// The types `PartyIdea` and `HolidayActivity` are structurally enforced by the prompts sent to the AI.
// We don't import them here as this serverless function typically runs in a separate context from the frontend code.

// This is a server-side file. It assumes the @google/genai package is available
// in its execution environment, and process.env.API_KEY is configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const partyIdeaSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        theme: {
          type: Type.STRING,
          description: "The unique theme of the party."
        },
        description: {
          type: Type.STRING,
          description: "An engaging description of the party theme."
        },
        activities: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "A list of 3 fun and engaging activities for the party."
        },
        foodIdeas: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
          description: "A list of 3 creative food ideas that match the theme."
        },
        partyFavor: {
          type: Type.STRING,
          description: "A suggestion for a simple and creative party favor."
        },
      },
      required: ['theme', 'description', 'activities', 'foodIdeas', 'partyFavor']
    }
};

const holidayActivitySchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: {
                type: Type.STRING,
                description: "The name of the activity."
            },
            description: {
                type: Type.STRING,
                description: "A brief, engaging description of the activity."
            },
            type: {
                type: Type.STRING,
                enum: ['Indoor', 'Outdoor'],
                description: "The type of activity."
            },
            cost: {
                type: Type.STRING,
                enum: ['Free', 'Paid'],
                description: "The cost of the activity."
            },
        },
        required: ['name', 'description', 'type', 'cost']
    }
};


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

const getPartyIdeasPrompt = (ageGroup: string) => `You are a helpful AI assistant for busy parents. Generate a list of 5 creative and stress-free party ideas for children aged ${ageGroup}.`;

const getHolidayActivitiesPrompt = (ageGroup: string, location: string) => `You are a helpful AI assistant for busy parents. Generate a list of 6 fun and engaging school holiday activities for children aged ${ageGroup} in or near ${location}. Include a mix of indoor and outdoor activities, and both free and paid options.`;


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
        let schema;
        if (type === 'party') {
            if (!ageGroup) return new Response(JSON.stringify({ error: 'Age group is required for party ideas.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            prompt = getPartyIdeasPrompt(ageGroup);
            schema = partyIdeaSchema;
        } else if (type === 'holiday') {
            if (!ageGroup || !location) return new Response(JSON.stringify({ error: 'Age group and location are required for holiday activities.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            prompt = getHolidayActivitiesPrompt(ageGroup, location);
            schema = holidayActivitySchema;
        } else {
            return new Response(JSON.stringify({ error: 'Invalid request type specified.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const genAIResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
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
