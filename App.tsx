import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootRouter from "./src/navigation/Navigation";
import { Provider } from "react-redux";
import { store } from "./src/store/store";

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootRouter />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
