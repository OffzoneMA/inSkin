import Constants from "expo-constants";
import {
  API_URL,
} from "@env";

const settings = {
  dev: {
    apiUrl: API_URL,
  },
  staging: {

  },
  prod: {

  },
};

const getCurrentSettings = () => {
 /*  // eslint-disable-next-line no-undef
  if (__DEV__) return settings.dev;

  //   ?: Uncomment this if you want to have a seperate config for staging
  if (Constants.manifest.releaseChannel === "staging") return settings.staging; 
*/
  return settings.dev;
};

export default getCurrentSettings();
