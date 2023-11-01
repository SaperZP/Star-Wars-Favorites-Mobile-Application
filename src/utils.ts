export const defineGender = (gender: string) => {
  let result: "male" | "female" | "others";

  switch (gender) {
    case "male":
      result = "male";
      break;
    case "female":
      result = "female";
      break;
    default:
      result = "others";
  }

  return result;
};

export function isValidUrl(url: string): boolean {
  const urlPattern = /^https:\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(url);
}
