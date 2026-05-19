import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, hasFirebaseConfig } from "../firebase/config";
import {
  changeCurrentPassword,
  completeGooglePasswordLink,
  linkCurrentUserWithGoogle,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  registerWithEmail,
  sendResetEmail,
  setPasswordForGoogleUser
} from "../services/authService";
import {
  ensureUserProfile,
  subscribeProfile,
  subscribeSettings,
  updateProfile,
  updateSettings
} from "../services/profileService";
import { mapFirebaseError } from "../utils/firebaseErrors";
import { useLocale } from "./LocaleContext";
import { useTheme } from "./ThemeContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { setLanguage, t } = useLocale();
  const { setTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [providerIds, setProviderIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasFirebaseConfig || !auth) {
      setLoading(false);
      return undefined;
    }

    let unsubscribeProfile = null;
    let unsubscribeSettings = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribeProfile?.();
      unsubscribeSettings?.();
      setError("");

      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setSettings(null);
        setProviderIds([]);
        setLoading(false);
        return;
      }

      try {
        await ensureUserProfile(firebaseUser);
        setUser(firebaseUser);
        setProviderIds(firebaseUser.providerData?.map((provider) => provider.providerId) || []);
        unsubscribeProfile = subscribeProfile(firebaseUser.uid, setProfile);
        unsubscribeSettings = subscribeSettings(firebaseUser.uid, (nextSettings) => {
          setSettings(nextSettings);
          if (nextSettings?.language) setLanguage(nextSettings.language);
          if (nextSettings?.theme) setTheme(nextSettings.theme);
        });
      } catch (currentError) {
        setError(mapFirebaseError(currentError, t));
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile?.();
      unsubscribeSettings?.();
    };
  }, [setLanguage, setTheme, t]);

  const withErrorHandling = useCallback(async (action) => {
    setError("");
    try {
      return await action();
    } catch (currentError) {
      const message = mapFirebaseError(currentError, t);
      setError(message);
      const wrappedError = new Error(message);
      wrappedError.code = currentError.code;
      wrappedError.email = currentError.email;
      throw wrappedError;
    }
  }, [t]);

  const hasPasswordProvider = providerIds.includes("password");
  const hasGoogleProvider = providerIds.includes("google.com");

  const refreshProviders = useCallback((nextUser) => {
    setProviderIds(nextUser?.providerData?.map((provider) => provider.providerId) || []);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      settings,
      loading,
      error,
      firebaseReady: hasFirebaseConfig,
      hasPasswordProvider,
      hasGoogleProvider,
      isGoogleOnlyUser: hasGoogleProvider && !hasPasswordProvider,
      registerEmail: (values) => withErrorHandling(() => registerWithEmail(values)),
      loginEmail: (values) => withErrorHandling(() => loginWithEmail(values.email, values.password)),
      loginGoogle: (profileValues) => withErrorHandling(() => loginWithGoogle(profileValues)),
      completeGoogleLink: (password) =>
        withErrorHandling(async () => {
          const nextUser = await completeGooglePasswordLink(password);
          refreshProviders(nextUser);
          return nextUser;
        }),
      linkGoogle: () =>
        withErrorHandling(async () => {
          const nextUser = await linkCurrentUserWithGoogle();
          refreshProviders(nextUser);
          return nextUser;
        }),
      sendPasswordReset: (email) => withErrorHandling(() => sendResetEmail(email)),
      changePassword: (currentPassword, newPassword) => withErrorHandling(() => changeCurrentPassword(currentPassword, newPassword)),
      setPassword: (newPassword) =>
        withErrorHandling(async () => {
          const nextUser = await setPasswordForGoogleUser(newPassword);
          refreshProviders(nextUser);
          return nextUser;
        }),
      updateProfileData: (values) => withErrorHandling(() => updateProfile(user.uid, values)),
      updateSettingsData: (values) => withErrorHandling(() => updateSettings(user.uid, values)),
      logout: () => withErrorHandling(logoutUser)
    }),
    [user, profile, settings, loading, error, hasPasswordProvider, hasGoogleProvider, withErrorHandling, refreshProviders]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
