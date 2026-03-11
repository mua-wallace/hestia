import { ConfigContext, ExpoConfig } from "expo/config";
import { version } from "./package.json";

const EAS_PROJECT_ID = "812d1d0f-dd1e-4634-9ebc-c3a124ab1aa5";
const PROJECT_SLUG = "hestia";
const OWNER = "wallice-dev";

const APP_NAME = "Hestia";
const BUNDLE_IDENTIFIER = "Hesia App - com.hestiahotels.app";
const PACKAGE_NAME = "Hesia App - com.hestiahotels.app";
const ICON = "./assets/app/icon.png";
const ADAPTIVE_ICON = "./assets/app/adaptive-icon.png";
const SCHEME = "hestia";

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", process.env.APP_ENV);

  const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
    getDynamicAppConfig(
      (process.env.APP_ENV as "development" | "preview" | "production") ||
        "development"
    );

  return {
    ...config,
    name,
    version,
    slug: PROJECT_SLUG,
    orientation: "portrait",
    userInterfaceStyle: "light",
    icon,
    scheme,
    assetBundlePatterns: ["**/*"],
    splash: {
      image: "./assets/app/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier,
      icon,
      backgroundColor: "#FFFFFF",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      icon,
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: "#FFFFFF",
      },
      package: packageName,
      splash: {
        image: "./assets/app/splash.png",
        resizeMode: "contain",
        backgroundColor: "#FFFFFF",
      },
      softwareKeyboardLayoutMode: "resize",
    },
    web: {
      favicon: "./assets/app/favicon.png",
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
    },
    owner: OWNER,
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    plugins: ["expo-font"],
  };
};

export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} Preview`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: `${SCHEME}-preview`,
    };
  }

  return {
    name: `${APP_NAME} Development`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: ICON,
    adaptiveIcon: ADAPTIVE_ICON,
    scheme: `${SCHEME}-dev`,
  };
};
