import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { useAppSelector } from "../store/hooks";

function useThemeConfig() {
  const currentTheme = useAppSelector((state) => state.themeReducer);
  const themeToUse = currentTheme === "light" ? MD3LightTheme : MD3DarkTheme;

  return {
    ...themeToUse,
    colors: {
      ...themeToUse.colors,
      primary: "tomato",
      secondary: "yellow",
    },
  };
}

export default useThemeConfig;
