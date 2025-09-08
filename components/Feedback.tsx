import React from 'react';
import { ThumbUpIcon, ThumbDownIcon } from './icons';

interface FeedbackProps {
    contentId: string;
    feedback: 'like' | 'dislike' | null | undefined;
    onFeedback: (id: string, feedback: 'like' | 'dislike') => void;
}

const Feedback: React.FC<FeedbackProps> = ({ contentId, feedback, onFeedback }) => {
    return (
        <div className="mt-4 flex items-center justify-end gap-4">
            <p className="text-sm text-slate-500">Was this helpful?</p>
            <div className="flex gap-2">
                <button
                    onClick={() => onFeedback(contentId, 'like')}
                    className={`p-1.5 rounded-full transition-colors duration-200 ${
                        feedback === 'like' 
                        ? 'bg-green-100 text-green-600' 
                        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                    }`}
                    aria-label="Helpful"
                    title="Helpful"
                >
                    <ThumbUpIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={() => onFeedback(contentId, 'dislike')}
                    className={`p-1.5 rounded-full transition-colors duration-200 ${
                        feedback === 'dislike' 
                        ? 'bg-red-100 text-red-600' 
                        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                    }`}
                     aria-label="Not helpful"
                     title="Not helpful"
                >
                    <ThumbDownIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default Feedback;
