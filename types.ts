export enum AgeGroup {
  YOUNGER = '3-7 years',
  OLDER = '8-11 years',
}

export enum ContentType {
  PARTY = 'Party Ideas',
  HOLIDAY = 'Holiday Activities',
  LEAVE_IT_TO_ME = 'Leave it to Me, Chris P Tee',
}

export interface PartyIdea {
  theme: string;
  description: string;
  activities: string[];
  foodIdeas: string[];
  partyFavor: string;
}

export interface HolidayActivity {
  name: string;
  description: string;
  type: 'Indoor' | 'Outdoor';
  cost: 'Free' | 'Paid';
}