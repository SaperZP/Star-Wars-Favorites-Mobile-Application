import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PeopleResponse } from "../../types/commonTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getPeople } from "../../api/api";
import { StackParamList } from "../../navigation/Navigation";
import { DataTable, Icon } from "react-native-paper";
import { toggleFanStatus } from "../../store/fansReducer";
import { defineGender } from "../../utils";

type HomeScreenProps = {
  navigation: NativeStackScreenProps<StackParamList, "Home">;
};

async function fetchAndReplaceNames(data: PeopleResponse) {
  const results = data.results;

  for (const person of results) {
    // Fetch and replace homeworld name
    const homeworldResponse = await fetch(person.homeworld);
    const homeworldData = await homeworldResponse.json();
    person.homeworld = homeworldData.name;

    // Fetch and replace species name
    if (person.species.length > 0) {
      const speciesResponse = await fetch(person.species[0]);
      const speciesData = await speciesResponse.json();
      person.species = speciesData.name;
    } else {
      // If no species, set to 'Unknown' or any other default value
      person.species = "unknown";
    }
  }

  return data;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [people, setPeople] = useState<PeopleResponse>();
  const { favorites } = useAppSelector((state) => state.fans);
  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(0);

  const dispatch = useAppDispatch();

  const from = page * 10;
  const to = Math.min((page + 1) * 10, people ? people.count : 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPeople(searchString, page + 1);
        const updatedData = await fetchAndReplaceNames(response);
        setPeople(updatedData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchString, page]);

  return (
    <View>
      <Text>Home</Text>
      {people && (
        <ScrollView horizontal>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>
                <Icon size={20} source={"heart"} />
              </DataTable.Title>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Birth Year</DataTable.Title>
              <DataTable.Title>Gender</DataTable.Title>
              <DataTable.Title>Home World</DataTable.Title>
              <DataTable.Title>Species</DataTable.Title>
            </DataTable.Header>

            {people.results.map((person) => (
              <DataTable.Row
                // onPress={() => console.log(person.url)}
                key={person.url}
              >
                <DataTable.Cell
                  onPress={() => dispatch(toggleFanStatus(person))}
                >
                  <Icon
                    size={20}
                    source={
                      favorites[defineGender(person.gender)].includes(
                        person.url
                      )
                        ? "heart"
                        : "heart-outline"
                    }
                  />
                </DataTable.Cell>
                <DataTable.Cell>{person.name}</DataTable.Cell>
                <DataTable.Cell>{person.birth_year}</DataTable.Cell>
                <DataTable.Cell>{person.gender}</DataTable.Cell>
                <DataTable.Cell>{person.homeworld}</DataTable.Cell>
                <DataTable.Cell>{person.species}</DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(people.count / 10)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${people.count}`}
            />
          </DataTable>
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
