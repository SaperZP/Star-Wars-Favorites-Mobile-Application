import { PeopleResponse } from "../types/commonTypes";

const BASE_URL = "https://swapi.dev/api/people/";

export async function safeFetchToJson(
  url: string,
  customSettings?: RequestInit
) {
  const response = await fetch(url, customSettings);
  if (!response.ok) {
    return Promise.reject(`${response.status} -- ${response.statusText}`);
  }
  if (!response.headers.get("content-type")?.includes("application/json")) {
    return Promise.reject("Not JSON");
  }
  return await response.json();
}

export function getPeople(search = "", page = 1): Promise<PeopleResponse> {
  return safeFetchToJson(
    `${BASE_URL}?search=${search}&page=${page.toString()}`
  );
}
