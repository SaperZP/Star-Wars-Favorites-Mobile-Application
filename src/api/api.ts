import axios from "axios";
import { PeopleResponseType } from "../types/commonTypes";
import { setupCache } from "axios-cache-adapter";

const BASE_URL = "https://swapi.dev/api/people/";

const cache = setupCache({
  maxAge: 15 * 60 * 1000, // Cache responses for 15 minutes
});

const api = axios.create({
  adapter: cache.adapter,
});

export async function getPeople(
  search = "",
  page = 1,
): Promise<PeopleResponseType> {
  try {
    const response = await api.get(BASE_URL, {
      params: { search, page },
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

  const handleError = (error: any, errorMessage: any) => {
    // eslint-disable-next-line no-console
    console.log(errorMessage);
    // eslint-disable-next-line no-console
    console.error(error);
  };

  for (const person of results) {
    const homeworldPromise = api.get(person.homeworld);
    const speciesPromise =
      person.species.length > 0
        ? api.get(person.species[0])
        : Promise.resolve({ data: { name: "unknown" }, status: 200 });

    homeworldPromise
      .then((homeworldResponse) => {
        person.homeworld = homeworldResponse.data.name;
      })
      .catch((error) => {
        handleError(error, "Unhandled error in homeworldPromise");
      });

    speciesPromise
      .then((speciesResponse) => {
        person.species = speciesResponse.data.name;
      })
      .catch((error) => {
        handleError(error, "Unhandled error in speciesPromise");
      });

    fetchPromises.push(Promise.all([homeworldPromise, speciesPromise]));
  }

  await Promise.all(fetchPromises);

  return data;
}
