import React, { JSX } from "react";
import { SafeAreaView, ScrollView } from "react-native";

const Layout: React.FC<{ children: JSX.Element; orientation: string }> = ({
  orientation,
  children
}) => {
  return (
    <SafeAreaView>
      {orientation === "LANDSCAPE" ? (
        <ScrollView>{children}</ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
};

export default Layout;
