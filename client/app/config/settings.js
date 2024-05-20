import Constants from "expo-constants";
import {
  API_URL,
} from "@env";

const settings = {
  dev: {
    apiUrl: "http://192.168.0.133:8000",
    //apiUrl: "http://192.168.1.30:8000",
    //apiUrl:"http://100.100.33.107:8000",
  
  },
  staging: {
    //apiUrl:"http://staging.api.com"
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

module.exports = getCurrentSettings();
