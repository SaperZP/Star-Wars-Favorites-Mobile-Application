export interface Person {
  birth_year: string;
  eye_color: string;
  films: string[];
  gender: string;
  hair_color: string;
  height: string;
  homeworld: string;
  mass: string;
  name: string;
  skin_color: string;
  created: string;
  edited: string;
  species: string[] | string;
  starships: string[];
  url: string;
  vehicles: string[];
}

export type PeopleResponseType = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Person[];
};

export type FansType = {
  favorites: {
    male: string[];
    female: string[];
    others: string[];
  };
};
