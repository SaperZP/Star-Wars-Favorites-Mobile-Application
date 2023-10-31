import React, { useEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { StackParamList } from "../../navigation/Navigation";
import {
  DataTable,
  Icon,
  Text,
  Button,
  Surface,
  TextInput,
  useTheme,
} from "react-native-paper";
import { resetState, toggleFanStatus } from "../../store/fansReducer";
import { defineGender } from "../../utils";
import { getPeopleFromServer } from "../../store/peopleReducer";
import Loader from "../../components/loader";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { homeScreenStyles } from "./styles";
import { useDebounce } from "use-debounce";

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { peopleResponse, loading } = useAppSelector(
    (state) => state.peopleReducer,
  );
  const { favorites } = useAppSelector((state) => state.fansReducer);

  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<"ascending" | "descending">(
    "ascending",
  );

  const sortedPeopleByName = useMemo(() => {
    if (!peopleResponse?.results) {
      return [];
    }

    const sorted = [...peopleResponse.results].sort(
      (firstPerson, secondPerson) =>
        firstPerson.name.localeCompare(secondPerson.name),
    );

    return sortOrder === "ascending" ? sorted : sorted.reverse();
  }, [peopleResponse, sortOrder]);
  const [debouncedSearch] = useDebounce(searchString, 1000);
  const from = page * 10;
  const to = Math.min(
    (page + 1) * 10,
    peopleResponse ? peopleResponse.count : 0,
  );

  useEffect(() => {
    dispatch(
      getPeopleFromServer({ searchString: debouncedSearch, page: page + 1 }),
    );
  }, [debouncedSearch, page]);

  return (
    <SafeAreaView style={homeScreenStyles.container}>
      {peopleResponse && !loading ? (
        <View style={homeScreenStyles.wrapper}>
          <View style={homeScreenStyles.header}>
            <Text variant={"displayMedium"}>Fans</Text>

            <Button
              onPress={() => dispatch(resetState())}
              style={[
                homeScreenStyles.header_button,
                { borderColor: theme.colors.error },
              ]}
              labelStyle={{ textTransform: "uppercase" }}
              textColor={theme.colors.error}
              mode={"outlined"}
            >
              Clear Fans
            </Button>
          </View>

          <View style={homeScreenStyles.fans}>
            {Object.entries(favorites).map((category) => (
              <Surface
                key={category[0]}
                style={homeScreenStyles.fans_card}
                elevation={1}
              >
                <Text
                  style={homeScreenStyles.fans_cardText}
                  variant={"headlineMedium"}
                >
                  {category[1].length}
                </Text>

                <Text
                  style={homeScreenStyles.fans_cardText}
                  variant={"bodySmall"}
                >
                  {category[0] !== "others"
                    ? `${category[0]} fans`
                    : `${category[0]}`}
                </Text>
              </Surface>
            ))}
          </View>

          <TextInput
            value={searchString}
            onChangeText={(input) => setSearchString(input)}
            activeUnderlineColor={theme.colors.background}
            underlineColor={theme.colors.background}
            style={[{ backgroundColor: theme.colors.background }]}
            label={"Search"}
            left={<TextInput.Icon icon={"magnify"} />}
          />

          <DataTable style={{ flex: 1 }}>
            <ScrollView horizontal>
              <FlatList
                ListHeaderComponent={
                  <DataTable.Header
                    style={[
                      homeScreenStyles.dataTable_header,
                      { backgroundColor: theme.colors.background },
                    ]}
                  >
                    <DataTable.Title>
                      <Icon size={20} source={"heart"} />
                    </DataTable.Title>
                    <DataTable.Title
                      sortDirection={sortOrder}
                      onPress={() =>
                        setSortOrder((order) =>
                          order === "ascending" ? "descending" : "ascending",
                        )
                      }
                      style={homeScreenStyles.dataTableSellSize}
                    >
                      Name
                    </DataTable.Title>
                    <DataTable.Title style={homeScreenStyles.dataTableSellSize}>
                      Birth Year
                    </DataTable.Title>
                    <DataTable.Title style={homeScreenStyles.dataTableSellSize}>
                      Gender
                    </DataTable.Title>
                    <DataTable.Title style={homeScreenStyles.dataTableSellSize}>
                      Home World
                    </DataTable.Title>
                    <DataTable.Title style={homeScreenStyles.dataTableSellSize}>
                      Species
                    </DataTable.Title>
                  </DataTable.Header>
                }
                stickyHeaderIndices={[0]}
                data={sortedPeopleByName}
                keyExtractor={(item) => item.url}
                renderItem={({ item }) => {
                  const inFavorites = favorites[
                    defineGender(item.gender)
                  ].includes(item.url);

                  const navigationHandler = () => {
                    navigation.navigate("Details", { personUrl: item.url });
                  };

                  const fanStatusHandler = () => {
                    dispatch(toggleFanStatus(item));
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
                      <DataTable.Cell
                        style={homeScreenStyles.dataTableSellSize}
                      >
                        {item.name}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={homeScreenStyles.dataTableSellSize}
                      >
                        {item.birth_year}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={homeScreenStyles.dataTableSellSize}
                      >
                        {item.gender}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={homeScreenStyles.dataTableSellSize}
                      >
                        {item.homeworld}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={homeScreenStyles.dataTableSellSize}
                      >
                        {item.species}
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                }}
              />
            </ScrollView>

            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(peopleResponse.count / 10)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${peopleResponse.count}`}
            />
          </DataTable>
        </View>
      ) : (
        <Loader loading={loading} />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
