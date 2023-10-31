import React from "react";
import { ScrollView, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackParamList } from "../../navigation/Navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppSelector } from "../../store/hooks";
import { DataTable } from "react-native-paper";
import { Person } from "../../types/commonTypes";

type DetailsScreenProps = {
  route: RouteProp<StackParamList, "Details">;
  navigation: NativeStackScreenProps<StackParamList, "Details">;
};

const PersonDetailsScreen: React.FC<DetailsScreenProps> = ({ route }) => {
  const { personUrl } = route.params;
  const { peopleResponse } = useAppSelector((state) => state.peopleReducer);
  let person: Person | undefined;

  if (peopleResponse) {
    person = peopleResponse.results.find((person) => person.url === personUrl);
  }

  function formatString(inputString: string): string {
    const stringWithSpaces = inputString.replace(/_/g, " ");
    return stringWithSpaces[0].toUpperCase() + stringWithSpaces.slice(1);
  }

  return (
    <ScrollView>
      {person ? (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Characteristic</DataTable.Title>
            <DataTable.Title>Value</DataTable.Title>
          </DataTable.Header>

          {Object.entries(person).map(([key, value], index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{formatString(key)}</DataTable.Cell>
              <DataTable.Cell>
                <Text>{value}</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      ) : (
        <View>
          <Text>Person not found</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default PersonDetailsScreen;
