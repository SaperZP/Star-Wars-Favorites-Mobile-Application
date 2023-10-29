import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { StackParamList } from "../../navigation/Navigation";
import { DataTable, Icon } from "react-native-paper";
import { toggleFanStatus } from "../../store/fansReducer";
import { defineGender } from "../../utils";
import { getPeopleFromServer } from "../../store/peopleReducer";
import Loader from "../../components/loader";

type HomeScreenProps = {
  navigation: NativeStackScreenProps<StackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { peopleResponse, loading } = useAppSelector(
    (state) => state.peopleReducer
  );
  const { favorites } = useAppSelector((state) => state.fansReducer);

  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(0);

  const from = page * 10;
  const to = Math.min(
    (page + 1) * 10,
    peopleResponse ? peopleResponse.count : 0
  );

  useEffect(() => {
    dispatch(getPeopleFromServer({ searchString, page: page + 1 }));
  }, [searchString, page]);

  return (
    <View style={styles.container}>
      {!peopleResponse ? (
        <Loader loading={loading} />
      ) : (
        <ScrollView horizontal>
          <Loader loading={loading} />
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

            {peopleResponse.results.map((person) => (
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
              numberOfPages={Math.ceil(peopleResponse.count / 10)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${peopleResponse.count}`}
            />
          </DataTable>
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%"
  }
});
