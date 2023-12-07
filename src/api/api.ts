import axios from "axios";
import { PeopleResponseType } from "../types/commonTypes";
import { setupCache } from "axios-cache-interceptor";
import { isValidUrl } from "../utils";

const BASE_URL = "https://swapi.dev/api/people/";

const api = setupCache(axios);

export async function getPeople(
  search = "",
  page = 1
): Promise<PeopleResponseType> {
  try {
    const response = await api.get(BASE_URL, {
      params: { search, page }
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("An error occurred while fetching data:", error);
    throw error;
  }
}

export async function getAdditionalData(data: PeopleResponseType) {
  const results = data.results;
  const fetchPromises = [];

  for (const person of results) {
    let homeworldPromise;
    let speciesPromise;

    if (isValidUrl(person.homeworld)) {
      homeworldPromise = api.get(person.homeworld);

      homeworldPromise
        .then((homeworldResponse) => {
          person.homeworld = homeworldResponse.data.name;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error, "homeworldPromise");
        });
    }

    if (Array.isArray(person.species)) {
      speciesPromise =
        person.species.length > 0
          ? Promise.all(person.species.map((specie) => api.get(specie)))
          : Promise.resolve([{ data: { name: "unknown" }, status: 200 }]);

      speciesPromise
        .then((speciesResponse) => {
          person.species = speciesResponse.map((i) => i.data.name).join(", ");
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error, "speciesPromise");
        });
    }

    fetchPromises.push(Promise.all([homeworldPromise, speciesPromise]));
  }

  await Promise.all(fetchPromises);

  return data;
}
