import React from "react";
import { Text, View } from "react-native";
import { StackParamList } from "@navigation/Navigation";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type HomeScreenProps = {
  navigation: NativeStackScreenProps<StackParamList, "Home">;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View>
      <Text>Home</Text>
    </View>
  );
};

export default HomeScreen;
