import { StyleSheet } from "react-native";

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    padding: 10,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header_button: {
    borderRadius: 5,
  },
  fans: {
    flexDirection: "row",
    gap: 20,
  },
  fans_card: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  fans_cardText: {
    textTransform: "capitalize",
  },
  dataTable_wrapper: {},
  dataTable_header: {
    alignItems: "center",
    gap: 5,
  },
  dataTableSellSize: {
    justifyContent: "center",
    width: 100,
    marginLeft: 20,
  },
});
