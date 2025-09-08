import React, { useState, useCallback, useEffect } from 'react';
import { AgeGroup, ContentType, PartyIdea, HolidayActivity } from './types';
import { generatePartyIdeas, generateHolidayActivities } from './services/geminiService';
import Header from './components/Header';
import ContentDisplay from './components/ContentDisplay';
import { PartyIcon, BeachIcon, StarIcon } from './components/icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.PARTY);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(AgeGroup.YOUNGER);
  const [location, setLocation] = useState<string>('');
  const [partyIdeas, setPartyIdeas] = useState<PartyIdea[]>([]);
  const [holidayActivities, setHolidayActivities] = useState<HolidayActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Record<string, 'like' | 'dislike'>>({});

  useEffect(() => {
    try {
      const storedFeedback = localStorage.getItem('plannerFeedback');
      if (storedFeedback) {
        setFeedback(JSON.parse(storedFeedback));
      }
    } catch (error) {
      console.error("Failed to load feedback from localStorage", error);
    }
  }, []);

  const handleFeedback = useCallback((id: string, rating: 'like' | 'dislike') => {
    setFeedback(prevFeedback => {
      const newFeedback = { ...prevFeedback, [id]: rating };
      try {
        localStorage.setItem('plannerFeedback', JSON.stringify(newFeedback));
      } catch (error) {
        console.error("Failed to save feedback to localStorage", error);
      }
      return newFeedback;
    });
  }, []);


  const handleGenerateIdeas = useCallback(async () => {
    if (activeTab === ContentType.HOLIDAY && !location.trim()) {
      setError('Please enter a location to find holiday activities.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasGenerated(true);

    try {
      if (activeTab === ContentType.PARTY) {
        const ideas = await generatePartyIdeas(ageGroup);
        if (ideas) {
          const ideasWithIds: PartyIdea[] = (ideas as any[]).map((idea) => ({
            ...idea,
            id: crypto.randomUUID(),
          }));
          setPartyIdeas(ideasWithIds);
        } else {
          throw new Error('Could not fetch party ideas. The magic seems to be offline!');
        }
      } else {
        const activities = await generateHolidayActivities(ageGroup, location);
        if (activities) {
           const activitiesWithIds: HolidayActivity[] = (activities as any[]).map((activity) => ({
             ...activity,
             id: crypto.randomUUID(),
           }));
          setHolidayActivities(activitiesWithIds);
        } else {
          throw new Error('Could not fetch holiday activities. The adventure map is blank!');
        }
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, ageGroup, location]);

  const isHolidayTabDisabled = !location.trim();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header
        ageGroup={ageGroup}
        setAgeGroup={setAgeGroup}
        location={location}
        setLocation={setLocation}
        onGenerate={handleGenerateIdeas}
        isLoading={isLoading}
      />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="border-b border-slate-200 mb-8">
            <nav className="-mb-px flex flex-wrap gap-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab(ContentType.PARTY)}
                className={`${
                  activeTab === ContentType.PARTY
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200`}
              >
                <PartyIcon className="mr-3 h-6 w-6" />
                {ContentType.PARTY}
              </button>
              <button
                onClick={() => {
                  if (!isHolidayTabDisabled) setActiveTab(ContentType.HOLIDAY);
                }}
                disabled={isHolidayTabDisabled}
                className={`${
                  activeTab === ContentType.HOLIDAY
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isHolidayTabDisabled ? "Enter a location to enable" : ""}
              >
                <BeachIcon className="mr-3 h-6 w-6" />
                {ContentType.HOLIDAY}
              </button>
               <button
                onClick={() => setActiveTab(ContentType.LEAVE_IT_TO_ME)}
                className={`${
                  activeTab === ContentType.LEAVE_IT_TO_ME
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200`}
              >
                <StarIcon className="mr-3 h-6 w-6" />
                {ContentType.LEAVE_IT_TO_ME}
              </button>
            </nav>
          </div>
          
          <ContentDisplay
            isLoading={isLoading}
            error={error}
            hasGenerated={hasGenerated}
            activeTab={activeTab}
            partyIdeas={partyIdeas}
            holidayActivities={holidayActivities}
            location={location}
            feedback={feedback}
            onFeedback={handleFeedback}
          />
        </div>
      </main>

      <footer className="bg-white">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500">
            Powered by Magic & AI. Happy Planning!
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Inspired by the <a href="https://www.comedymagic.co.uk" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">ComedyMagic.co.uk</a> community tour.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;