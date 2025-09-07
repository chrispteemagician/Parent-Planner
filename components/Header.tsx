import React from 'react';
import { AgeGroup } from '../types';
import { LocationIcon } from './icons';

interface HeaderProps {
    ageGroup: AgeGroup;
    setAgeGroup: (ageGroup: AgeGroup) => void;
    location: string;
    setLocation: (location: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ ageGroup, setAgeGroup, location, setLocation, onGenerate, isLoading }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8 text-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-b-3xl -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-brand">Parent's Planner</h1>
                <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">AI-powered ideas for unforgettable childhood moments.</p>

                <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-full shadow-lg">
                    {/* Age Group Selector */}
                    <div className="flex-shrink-0 w-full sm:w-auto">
                        <span className="isolate inline-flex rounded-full shadow-sm">
                            <button
                                type="button"
                                onClick={() => setAgeGroup(AgeGroup.YOUNGER)}
                                className={`relative inline-flex items-center rounded-l-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                    ageGroup === AgeGroup.YOUNGER ? 'bg-purple-600 text-white z-10' : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {AgeGroup.YOUNGER}
                            </button>
                            <button
                                type="button"
                                onClick={() => setAgeGroup(AgeGroup.OLDER)}
                                className={`relative -ml-px inline-flex items-center rounded-r-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                                    ageGroup === AgeGroup.OLDER ? 'bg-purple-600 text-white z-10' : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {AgeGroup.OLDER}
                            </button>
                        </span>
                    </div>

                    {/* Location Input */}
                    <div className="relative flex-grow w-full sm:w-auto">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <LocationIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="e.g., Bristol, UK"
                            className="block w-full rounded-full border-0 py-2 pl-10 bg-slate-800 text-white ring-1 ring-inset ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 transition-colors duration-200"
                        />
                    </div>
                    
                    {/* Generate Button */}
                    <button
                        onClick={onGenerate}
                        disabled={isLoading}
                        className="w-full sm:w-auto flex-shrink-0 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isLoading ? 'Thinking...' : 'Get Ideas'}
                    </button>
                </div>
            </div>
          </div>
        </header>
    );
};

export default Header;