import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootRouter from "./src/navigation/Navigation";
import { Provider } from "react-redux";
import { persistor, store } from "./src/store/store";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <RootRouter />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
