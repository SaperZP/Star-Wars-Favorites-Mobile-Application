export interface Person {
  birth_year: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  mass: string;
  name: string;
  skin_color: string;
  url: string;
  species: string;
}

export interface PersonResult {
  properties: Person;
  _id: string;
}

export type PeopleResponseType = {
  message: string;
  total_records?: number;
  total_pages?: number;
  previous?: string | null;
  next?: string | null;
  results: PersonResult[];
};

export type FansType = {
  favorites: {
    male: string[];
    female: string[];
    others: string[];
  };
};
