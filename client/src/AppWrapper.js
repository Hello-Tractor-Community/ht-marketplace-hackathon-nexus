// AppWrapper.js
import React from 'react';
import {
  SDKProvider,
  useMiniApp,
  useThemeParams,
  useViewport,
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

const ENVIRONMENTS = {
  TELEGRAM: 'telegram',
  WEB: 'web'
};

// Detect environment - you can modify this logic based on your needs
const detectEnvironment = () => {
  // Check if window.Telegram exists or any other Telegram-specific objects
  if (window.Telegram?.WebApp) {
    // return ENVIRONMENTS.TELEGRAM;
    return ENVIRONMENTS.WEB;
  }
  return ENVIRONMENTS.WEB;
};

// Component for Telegram-specific functionality
const TelegramWrapper = ({ children }) => {
  const miniApp = useMiniApp();
  const themeParams = useThemeParams();
  const viewport = useViewport();

  React.useEffect(() => {
    const cleanupMiniApp = bindMiniAppCSSVars(miniApp, themeParams);
    const cleanupTheme = bindThemeParamsCSSVars(themeParams);
    const cleanupViewport = viewport && bindViewportCSSVars(viewport);

    return () => {
      cleanupMiniApp();
      cleanupTheme();
      cleanupViewport && cleanupViewport();
    };
  }, [miniApp, themeParams, viewport]);

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(miniApp.platform) ? 'ios' : 'base'}
    >
      {children}
    </AppRoot>
  );
};

// Web-specific wrapper
const WebWrapper = ({ children }) => {
  // Add any web-specific providers or context here if needed
  return <div className="web-root">{children}</div>;
};

// Main wrapper component
const AppWrapper = ({ children }) => {
  const environment = detectEnvironment();

  if (environment === ENVIRONMENTS.TELEGRAM) {
    return (
      <SDKProvider>
        <TelegramWrapper>{children}</TelegramWrapper>
      </SDKProvider>
    );
  }

  return <WebWrapper>{children}</WebWrapper>;
};

export default AppWrapper;