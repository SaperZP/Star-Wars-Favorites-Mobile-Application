import React, { FC } from "react";
import { View, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";

type ILoaderProps = {
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
};

const Loader: FC<ILoaderProps> = ({ loading, style }) => {
  if (!loading) {
    return null;
  }

  return (
    <View style={[styles.loaderView, style]}>
      <ActivityIndicator size={"large"} />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderView: {
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

export default Loader;
