import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootRouter from "./src/navigation/Navigation";
import { PaperProvider } from "react-native-paper";
import useThemeConfig from "./src/theme";

function App() {
  const theme = useThemeConfig();

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <RootRouter />
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
