import React, { JSX } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackParamList } from "../../navigation/Navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppSelector } from "../../store/hooks";
import { Button, DataTable } from "react-native-paper";
import { Person } from "../../types/commonTypes";
import { isValidUrl } from "../../utils";

type DetailsScreenProps = {
  route: RouteProp<StackParamList, "Details">;
  navigation: NativeStackScreenProps<StackParamList, "Details">;
};

const PersonDetailsScreen: React.FC<DetailsScreenProps> = ({ route }) => {
  const { personUrl } = route.params;
  const { peopleResponse } = useAppSelector((state) => state.peopleReducer);
  let person: Person | undefined;

  if (peopleResponse) {
    person = peopleResponse.results.find(
      (person) => person.properties.url === personUrl
    )?.properties;
  }

  const formatTitle = (inputString: string): string => {
    const stringWithSpaces = inputString.replace(/_/g, " ");
    return stringWithSpaces[0].toUpperCase() + stringWithSpaces.slice(1);
  };

  const openWebsite = (url: string) => {
    Linking.openURL(url).catch((err) =>
      // eslint-disable-next-line no-console
      console.error("An error occurred: ", err)
    );
  };

  const formatValue = (
    inputString: string | string[] | null | undefined
  ): JSX.Element | JSX.Element[] => {
    if (!inputString?.length) {
      return <Text>no data</Text>;
    }

    if (Array.isArray(inputString)) {
      return inputString.map((link) =>
        isValidUrl(link) ? (
          <Button mode={"text"} key={link} onPress={() => openWebsite(link)}>
            {link}
          </Button>
        ) : (
          <Text key={link}>{link}</Text>
        )
      );
    }

    return <Text>{inputString}</Text>;
  };

  return (
    <ScrollView>
      {person ? (
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Characteristic</DataTable.Title>
            <DataTable.Title>Value</DataTable.Title>
          </DataTable.Header>

          {Object.entries(person).map(([key, value], index) => {
            const doNotUse = ["created", "edited", "url"];

            if (doNotUse.includes(key.toLowerCase())) {
              return undefined;
            }

            return (
              <DataTable.Row key={index}>
                <DataTable.Cell>{formatTitle(key)}</DataTable.Cell>
                <DataTable.Cell>
                  <Text>{formatValue(value)}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            );
          })}
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
