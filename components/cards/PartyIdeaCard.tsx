import React from 'react';
import { PartyIdea } from '../../types';
import { SparklesIcon, CakeIcon, GiftIcon } from '../icons';
import Feedback from '../Feedback';

interface PartyIdeaCardProps {
    idea: PartyIdea;
    feedback: 'like' | 'dislike' | null | undefined;
    onFeedback: (id: string, feedback: 'like' | 'dislike') => void;
}

const PartyIdeaCard: React.FC<PartyIdeaCardProps> = ({ idea, feedback, onFeedback }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden border border-slate-100">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-100">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">{idea.theme}</h3>
                <p className="mt-2 text-slate-600 text-sm">{idea.description}</p>
            </div>
            
            <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                    <div className="mb-4">
                        <h4 className="font-semibold text-slate-700 flex items-center"><SparklesIcon className="h-5 w-5 mr-2 text-purple-500"/>Activities</h4>
                        <ul className="mt-2 list-disc list-inside text-slate-500 text-sm space-y-1">
                            {idea.activities.map((activity, i) => <li key={i}>{activity}</li>)}
                        </ul>
                    </div>
                    <div className="mb-4">
                        <h4 className="font-semibold text-slate-700 flex items-center"><CakeIcon className="h-5 w-5 mr-2 text-purple-500"/>Food Ideas</h4>
                        <ul className="mt-2 list-disc list-inside text-slate-500 text-sm space-y-1">
                            {idea.foodIdeas.map((food, i) => <li key={i}>{food}</li>)}
                        </ul>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700 flex items-center"><GiftIcon className="h-5 w-5 mr-2 text-purple-500"/>Party Favor Idea</h4>
                    <p className="mt-1 text-slate-500 text-sm">{idea.partyFavor}</p>
                </div>
            </div>
            <div className="px-6 pb-4 border-t border-slate-100 bg-white">
                <Feedback contentId={idea.id} feedback={feedback} onFeedback={onFeedback} />
            </div>
        </div>
    );
};

export default PartyIdeaCard;