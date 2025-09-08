import React from 'react';
import { ContentType, PartyIdea, HolidayActivity } from '../types';
import Spinner from './Spinner';
import PartyIdeaCard from './cards/PartyIdeaCard';
import HolidayActivityCard from './cards/HolidayActivityCard';
import ChrisPTeePackages from './ChrisPTeePackages';
import { InfoIcon, ExclamationTriangleIcon } from './icons';

interface ContentDisplayProps {
    isLoading: boolean;
    error: string | null;
    hasGenerated: boolean;
    activeTab: ContentType;
    partyIdeas: PartyIdea[];
    holidayActivities: HolidayActivity[];
    location: string;
    feedback: Record<string, 'like' | 'dislike'>;
    onFeedback: (id: string, feedback: 'like' | 'dislike') => void;
}

const WelcomeMessage: React.FC<{ activeTab: ContentType; location: string }> = ({ activeTab, location }) => (
    <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm border border-slate-200">
        <InfoIcon className="mx-auto h-12 w-12 text-purple-400" />
        <h3 className="mt-4 text-2xl font-semibold text-slate-800">Ready for some inspiration?</h3>
        <p className="mt-2 text-slate-500">
            {activeTab === ContentType.PARTY 
                ? "Select an age group and click 'Get Ideas' to discover amazing party themes." 
                : "Enter a location and hit 'Get Ideas' to find fun activities near you."
            }
        </p>
         {activeTab === ContentType.HOLIDAY && !location && <p className="mt-2 text-sm text-amber-600">Please provide a location above to search for activities.</p>}
    </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
     <div className="text-center py-16 px-6 bg-red-50 rounded-lg shadow-sm border border-red-200">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-4 text-2xl font-semibold text-red-800">Oops! Something went wrong.</h3>
        <p className="mt-2 text-red-600">{message}</p>
    </div>
);

const ContentDisplay: React.FC<ContentDisplayProps> = ({ isLoading, error, hasGenerated, activeTab, partyIdeas, holidayActivities, location, feedback, onFeedback }) => {
    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    if (activeTab === ContentType.LEAVE_IT_TO_ME) {
        return <ChrisPTeePackages />;
    }

    if (!hasGenerated) {
        return <WelcomeMessage activeTab={activeTab} location={location} />;
    }

    if (activeTab === ContentType.PARTY) {
        if(partyIdeas.length === 0) return <WelcomeMessage activeTab={activeTab} location={location} />;
        return (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {partyIdeas.map((idea) => (
                    <PartyIdeaCard 
                        key={idea.id} 
                        idea={idea} 
                        feedback={feedback[idea.id]}
                        onFeedback={onFeedback}
                    />
                ))}
            </div>
        );
    }

    if (activeTab === ContentType.HOLIDAY) {
        if(holidayActivities.length === 0) return <WelcomeMessage activeTab={activeTab} location={location} />;
        return (
             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {holidayActivities.map((activity) => (
                    <HolidayActivityCard 
                        key={activity.id} 
                        activity={activity} 
                        feedback={feedback[activity.id]}
                        onFeedback={onFeedback}
                    />
                ))}
            </div>
        );
    }
    
    return null;
};

export default ContentDisplay;