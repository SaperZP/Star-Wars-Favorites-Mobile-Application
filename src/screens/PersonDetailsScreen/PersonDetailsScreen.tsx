import React from "react";
import { Text, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { StackParamList } from "../../navigation/Navigation";

type DetailsScreenProps = {
  route: RouteProp<StackParamList, "Details">;
  navigation: StackNavigationProp<StackParamList, "Details">;
};

const PersonDetailsScreen: React.FC<DetailsScreenProps> = ({
  route,
  navigation
}) => {
  const { itemId } = route.params;

  return (
    <View>
      <Text>Details</Text>
    </View>
  );
};

export default PersonDetailsScreen;
