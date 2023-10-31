import React, { useEffect, useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Text, Button, Surface, TextInput, useTheme } from "react-native-paper";
import { resetState } from "../../store/fansReducer";
import { getPeopleFromServer } from "../../store/peopleReducer";
import Loader from "../../components/Loader";
import { homeScreenStyles as styles } from "./styles";
import { useDebounce } from "use-debounce";
import ErrorMessage from "../../components/ErrorMessage";
import PeopleTable from "./components/PeopleTable";

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { peopleResponse, loading, error } = useAppSelector(
    (state) => state.peopleReducer
  );
  const { favorites } = useAppSelector((state) => state.fansReducer);

  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(0);
  const [debouncedSearch] = useDebounce(searchString, 2000);

  useEffect(() => {
    dispatch(
      getPeopleFromServer({ searchString: debouncedSearch, page: page + 1 })
    );
  }, [debouncedSearch, page]);

  return (
    <SafeAreaView style={styles.container}>
      {peopleResponse && !loading ? (
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <Text variant={"displayMedium"}>Fans</Text>

            <Button
              onPress={() => dispatch(resetState())}
              style={[
                styles.header_button,
                { borderColor: theme.colors.error }
              ]}
              labelStyle={{ textTransform: "uppercase" }}
              textColor={theme.colors.error}
              mode={"outlined"}
            >
              Clear Fans
            </Button>
          </View>

          <View style={styles.fans}>
            {Object.entries(favorites).map((category) => (
              <Surface key={category[0]} style={styles.fans_card} elevation={1}>
                <Text style={styles.fans_cardText} variant={"headlineMedium"}>
                  {category[1].length}
                </Text>

                <Text style={styles.fans_cardText} variant={"bodySmall"}>
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

          <PeopleTable
            peopleResponse={peopleResponse}
            favorites={favorites}
            page={page}
            onChangePage={setPage}
          />
        </View>
      ) : (
        <>
          <Loader loading={loading} />
          {error && !loading && (
            <ErrorMessage
              errorMessage={error.message}
              onError={() =>
                dispatch(
                  getPeopleFromServer({
                    searchString: debouncedSearch,
                    page: page + 1
                  })
                )
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
