import React, { useMemo, useState } from "react";
import { PeopleTableStyles as styles } from "../styles";
import { FlatList, ScrollView } from "react-native";
import { DataTable, Icon, useTheme, Text } from "react-native-paper";
import { defineGender } from "../../../utils";
import { toggleFanStatus } from "../../../store/fansReducer";
import { PeopleResponseType } from "../../../types/commonTypes";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../../navigation/Navigation";
import { useAppDispatch } from "../../../store/hooks";
import { useCustomDimentions } from "../../../hooks/useCustomDimentions";

type PeopleTableProps = {
  peopleResponse: PeopleResponseType;
  favorites: { male: string[]; female: string[]; others: string[] };
  page: number;
  onChangePage: (page: number) => void;
};

const PeopleTable: React.FC<PeopleTableProps> = ({
  peopleResponse,
  favorites,
  page,
  onChangePage
}) => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const dispatch = useAppDispatch();
  const { orientation } = useCustomDimentions();

  const [sortOrder, setSortOrder] = useState<"ascending" | "descending">(
    "ascending"
  );
  const sortedPeopleByName = useMemo(() => {
    if (!peopleResponse?.results) {
      return null;
    }

    const sorted = [...peopleResponse.results].sort(
      (firstPerson, secondPerson) =>
        firstPerson.properties.name.localeCompare(secondPerson.properties.name)
    );

    return sortOrder === "ascending" ? sorted : sorted.reverse();
  }, [peopleResponse, sortOrder]);

  const from = page * 10;
  const total_records = peopleResponse.total_records
    ? peopleResponse.total_records
    : peopleResponse.results.length;
  const to = Math.min((page + 1) * 10, total_records);
  return (
    <DataTable style={styles.dataTable}>
      <ScrollView horizontal>
        <FlatList
          scrollEnabled={orientation === "PORTRAIT"}
          stickyHeaderIndices={[0]}
          data={sortedPeopleByName}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={
            <DataTable.Header
              style={[
                styles.dataTable_header,
                { backgroundColor: theme.colors.background }
              ]}
            >
              <DataTable.Title>
                <Icon size={20} source={"heart"} />
              </DataTable.Title>
              <DataTable.Title
                sortDirection={sortOrder}
                onPress={() =>
                  setSortOrder((order) =>
                    order === "ascending" ? "descending" : "ascending"
                  )
                }
                style={styles.dataTableSellSize}
              >
                Name
              </DataTable.Title>
              <DataTable.Title style={styles.dataTableSellSize}>
                Birth Year
              </DataTable.Title>
              <DataTable.Title style={styles.dataTableSellSize}>
                Gender
              </DataTable.Title>
              <DataTable.Title style={styles.dataTableSellSize}>
                Home World
              </DataTable.Title>
              <DataTable.Title style={styles.dataTableSellSize}>
                Species
              </DataTable.Title>
            </DataTable.Header>
          }
          renderItem={({ item }) => {
            const inFavorites = favorites[
              defineGender(item.properties.gender)
            ].includes(item.properties.url);

            const navigationHandler = () => {
              navigation.navigate("Details", {
                personUrl: item.properties.url
              });
            };

            const fanStatusHandler = () => {
              dispatch(toggleFanStatus(item.properties));
            };

            return (
              <DataTable.Row onPress={navigationHandler}>
                <DataTable.Cell onPress={fanStatusHandler}>
                  <Icon
                    color={theme.colors.error}
                    size={20}
                    source={inFavorites ? "heart" : "heart-outline"}
                  />
                </DataTable.Cell>
                <DataTable.Cell style={styles.dataTableSellSize}>
                  <Text style={{ textAlign: "center" }}>
                    {item.properties.name}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.dataTableSellSize}>
                  {item.properties.birth_year}
                </DataTable.Cell>
                <DataTable.Cell style={styles.dataTableSellSize}>
                  {item.properties.gender}
                </DataTable.Cell>
                <DataTable.Cell style={styles.dataTableSellSize}>
                  {item.properties.homeworld}
                </DataTable.Cell>
                <DataTable.Cell style={styles.dataTableSellSize}>
                  {item.properties.species}
                </DataTable.Cell>
              </DataTable.Row>
            );
          }}
        />
      </ScrollView>

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(total_records / 10)}
        onPageChange={(page) => onChangePage(page)}
        label={`${from + 1}-${to} of ${total_records}`}
      />
    </DataTable>
  );
};

export default PeopleTable;
