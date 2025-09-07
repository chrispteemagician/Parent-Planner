import React from 'react';
import { StarIcon } from './icons';

interface PackageProps {
    title: string;
    price: string;
    description: string;
    highlight?: boolean;
}

const PackageCard: React.FC<PackageProps> = ({ title, price, description, highlight = false }) => (
    <div className={`rounded-xl shadow-lg flex flex-col border transition-all duration-300 ${highlight ? 'bg-purple-50 border-purple-500 scale-105 transform' : 'bg-white border-slate-200 hover:shadow-2xl'}`}>
        <div className={`p-6 rounded-t-xl ${highlight ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-slate-100'}`}>
            <h3 className={`text-2xl font-bold ${highlight ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
        </div>
        <div className="p-6 flex-grow flex flex-col">
            <p className={`text-4xl font-bold mb-4 ${highlight ? 'text-purple-600' : 'text-slate-800'}`}>{price}</p>
            <p className="text-slate-600 text-sm flex-grow mb-6">{description}</p>
            <button className={`mt-auto w-full font-bold py-3 px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 ${highlight ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white' : 'bg-white text-purple-600 ring-2 ring-purple-500'}`}>
                Book Now
            </button>
        </div>
    </div>
);


const ChrisPTeePackages: React.FC = () => {
    const packages = [
        {
            title: 'Comedy Magic Show',
            price: '£295',
            description: 'The perfect centerpiece for birthday parties and smaller events. A hilarious, high-energy, and interactive magic show that guarantees laughter for both kids and adults.',
        },
        {
            title: 'The Family Event',
            price: '£495',
            description: 'The ultimate stress-free package for larger family gatherings, BBQs, or celebrations. Includes the full comedy magic show, plus music, mini-disco, and games.',
            highlight: true,
        },
        {
            title: 'Evening Show & Mix n Mingle',
            price: '£995',
            description: 'Elevate your corporate event, wedding, or special occasion. Features sophisticated close-up magic during a mix-and-mingle session, followed by a comedy stage show.',
        },
    ];

    return (
        <div className="space-y-12">
            <div className="grid gap-12 md:grid-cols-1 lg:grid-cols-3 md:gap-8 items-stretch">
                {packages.map((pkg) => (
                    <PackageCard key={pkg.title} {...pkg} />
                ))}
            </div>

            <div className="text-center py-10 px-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg shadow-sm border border-teal-200">
                <StarIcon className="mx-auto h-12 w-12 text-teal-500" />
                <h3 className="mt-4 text-2xl font-semibold text-teal-800">Community Tours & Fundraising</h3>
                <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
                    Ask about special packages for community tours and fundraising events to bring magic and joy to your local area and support great causes.
                </p>
                <button className="mt-6 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300">
                    Enquire Now
                </button>
            </div>
        </div>
    );
};

export default ChrisPTeePackages;