import axios from "axios";
import { PeopleResponseType } from "../types/commonTypes";
import { setupCache } from "axios-cache-interceptor";
import { isValidUrl } from "../utils";

const BASE_URL = "https://www.swapi.tech/api/people/";

const api = setupCache(axios);

export async function getPeople(
  name = "",
  page = 1
): Promise<PeopleResponseType> {
  try {
    const response = await api.get(BASE_URL, {
      params: { page, limit: 10, name, expanded: true }
    });

    if (response.data.results) {
      return response.data;
    } else {
      return { ...response.data, results: response.data.result };
    }
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

    if (isValidUrl(person.properties.homeworld)) {
      homeworldPromise = api.get(person.properties.homeworld);

      homeworldPromise
        .then((homeworldResponse) => {
          person.properties.homeworld =
            homeworldResponse.data.result.properties.name;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error, "homeworldPromise");
        });
    }

    if (Array.isArray(person.properties.species)) {
      speciesPromise =
        person.properties.species.length > 0
          ? Promise.all(
            person.properties.species.map((specie: string) => api.get(specie))
          )
          : Promise.resolve([{ data: { name: "unknown" }, status: 200 }]);

      speciesPromise
        .then((speciesResponse) => {
          person.properties.species = speciesResponse
            .map((i) => i.data.name)
            .join(", ");
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
