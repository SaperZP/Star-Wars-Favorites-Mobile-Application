import React, { JSX } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useCustomDimentions } from "../../hooks/useCustomDimentions";

type OrientationType = {
  children: JSX.Element;
};

const Layout: React.FC<OrientationType> = ({ children }) => {
  const { orientation } = useCustomDimentions();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {orientation === "LANDSCAPE" ? (
        <ScrollView>{children}</ScrollView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
};

export default Layout;
