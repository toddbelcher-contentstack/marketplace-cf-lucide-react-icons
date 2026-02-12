import React, { useEffect, useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import UiLocation from "@contentstack/app-sdk/dist/src/uiLocation";
import { isNull } from "lodash";

import { KeyValueObj } from "../types/types";
import { AppFailed } from "../../components/AppFailed";
import { MarketplaceAppContext } from "../contexts/marketplaceContext";
import { useVerifyAppToken } from "../hooks/useVerifyAppToken";
import { getTokenFromUrl } from "../utils/functions";

type ProviderProps = {
  children?: React.ReactNode;
};

// Start SDK init at module load so the postRobot extensionEvent handler
// registers before Contentstack sends messages to the iframe.
const sdkPromise = ContentstackAppSDK.init();

/**
 * Marketplace App Provider
 * @param children: React.ReactNode
 */
export const MarketplaceAppProvider: React.FC<ProviderProps> = ({ children }) => {
  const [failed, setFailed] = useState<boolean>(false);
  const [appSdk, setAppSdk] = useState<UiLocation | null>(null);
  const [appConfig, setConfig] = useState<KeyValueObj | null>(null);
  const token = getTokenFromUrl();
  const { isValidAppToken } = useVerifyAppToken(token);

  // Consume the already-started SDK promise
  useEffect(() => {
    sdkPromise
      .then(async (appSdk) => {
        setAppSdk(appSdk);
        appSdk.location.CustomField?.frame?.enableAutoResizing?.();
        const appConfig = await appSdk.getConfig();
        setConfig(appConfig);
      })
      .catch(() => {
        setFailed(true);
      });
  }, []);

  // wait until the SDK is initialized. This will ensure the values are set
  // correctly for appSdk.
  if (!failed && isNull(appSdk)) {
    return <div>Loading...</div>;
  }

  // Token validation failed — in development, render children anyway
  if (isValidAppToken === false || failed) {
    if (import.meta.env.DEV) {
      return <MarketplaceAppContext.Provider value={{ appSdk: null, appConfig: null }}>{children}</MarketplaceAppContext.Provider>;
    }
    return <AppFailed />;
  }

  return <MarketplaceAppContext.Provider value={{ appSdk, appConfig }}>{children}</MarketplaceAppContext.Provider>;
};
