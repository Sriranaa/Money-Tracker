export function mapFirebaseError(error, t, fallback = "Something went wrong. Please try again.") {
  const code = error?.code || "";
  const messages = {
    "auth/email-already-in-use": "errorEmailAlreadyInUse",
    "auth/invalid-email": "emailInvalid",
    "auth/invalid-credential": "errorInvalidLogin",
    "auth/wrong-password": "errorInvalidLogin",
    "auth/user-not-found": "errorUserNotFound",
    "auth/weak-password": "passwordLength",
    "auth/popup-closed-by-user": "errorPopupClosed",
    "auth/too-many-requests": "errorTooManyRequests",
    "auth/requires-recent-login": "errorRequiresRecentLogin",
    "auth/provider-already-linked": "errorProviderAlreadyLinked",
    "auth/credential-already-in-use": "errorCredentialAlreadyInUse",
    "auth/google-link-password-required": "errorGoogleLinkPasswordRequired",
    "auth/billing-not-enabled": "errorBillingNotEnabled",
    "storage/unauthorized": "errorStorageUnauthorized"
  };
  if (messages[code] && t) return t(messages[code]);
  return messages[code] || error?.message || fallback;
}
