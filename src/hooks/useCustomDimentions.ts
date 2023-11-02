import { useWindowDimensions } from "react-native";

export function useCustomDimentions() {
  const { width, height, scale, fontScale } = useWindowDimensions();
  const orientation: "PORTRAIT" | "LANDSCAPE" =
    width < height ? "PORTRAIT" : "LANDSCAPE";

  return { width, height, scale, fontScale, orientation };
}
