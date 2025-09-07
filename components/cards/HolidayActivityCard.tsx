import React from 'react';
import { HolidayActivity } from '../../types';
import { SunIcon, BuildingIcon, CashIcon, TagIcon } from '../icons';

interface HolidayActivityCardProps {
    activity: HolidayActivity;
}

const HolidayActivityCard: React.FC<HolidayActivityCardProps> = ({ activity }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col border border-slate-100">
            <div className="p-6 flex-grow">
                 <h3 className="text-xl font-bold text-slate-800">{activity.name}</h3>
                <p className="mt-2 text-slate-600 text-sm flex-grow">{activity.description}</p>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-start items-center gap-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    activity.type === 'Outdoor' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                    {activity.type === 'Outdoor' ? 
                        <SunIcon className="h-4 w-4 mr-1.5" /> : 
                        <BuildingIcon className="h-4 w-4 mr-1.5" />
                    }
                    {activity.type}
                </span>
                 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    activity.cost === 'Free' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                     {activity.cost === 'Free' ?
                        <TagIcon className="h-4 w-4 mr-1.5" /> :
                        <CashIcon className="h-4 w-4 mr-1.5" />
                    }
                    {activity.cost}
                </span>
            </div>
        </div>
    );
};

export default HolidayActivityCard;
