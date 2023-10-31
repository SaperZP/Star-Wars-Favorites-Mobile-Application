import React from "react";
import { Button, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";

type IndexProps = {
  errorMessage?: string;
  onError: () => void;
};

const ErrorMessage: React.FC<IndexProps> = ({ errorMessage, onError }) => {
  return (
    <View style={styles.container}>
      <Text>{errorMessage}</Text>
      <Text>Try to reload</Text>
      <Button onPress={onError}>Reload</Button>
    </View>
  );
};

export default ErrorMessage;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1
  }
});
