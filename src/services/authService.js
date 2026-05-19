import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { ensureUserProfile } from "./profileService";

let pendingGoogleLink = null;

function requireAuth() {
  if (!auth) throw new Error("Firebase is not configured.");
  return auth;
}

export async function registerWithEmail(values) {
  const activeAuth = requireAuth();
  const credential = await createUserWithEmailAndPassword(activeAuth, values.email, values.password);
  await ensureUserProfile(credential.user, values);
  return credential.user;
}

export async function loginWithEmail(email, password) {
  const activeAuth = requireAuth();
  const credential = await signInWithEmailAndPassword(activeAuth, email, password);
  await ensureUserProfile(credential.user);
  return credential.user;
}

export async function loginWithGoogle(profile = {}) {
  const activeAuth = requireAuth();
  try {
    const credential = await signInWithPopup(activeAuth, googleProvider);
    await ensureUserProfile(credential.user, profile);
    return credential.user;
  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      const pendingCredential = GoogleAuthProvider.credentialFromError(error);
      const email = error.customData?.email;
      const signInMethods = email ? await fetchSignInMethodsForEmail(activeAuth, email) : [];

      if (email && pendingCredential && signInMethods.includes("password")) {
        pendingGoogleLink = {
          email,
          credential: pendingCredential,
          profile
        };
        const linkError = new Error(`A password account already exists for ${email}. Enter its password to link Google.`);
        linkError.code = "auth/google-link-password-required";
        linkError.email = email;
        throw linkError;
      }
    }

    throw error;
  }
}

export async function completeGooglePasswordLink(password) {
  const activeAuth = requireAuth();
  if (!pendingGoogleLink) throw new Error("No Google account linking request is pending.");

  const { email, credential, profile } = pendingGoogleLink;
  const passwordCredential = await signInWithEmailAndPassword(activeAuth, email, password);
  const linkedCredential = await linkWithCredential(passwordCredential.user, credential);
  pendingGoogleLink = null;
  await ensureUserProfile(linkedCredential.user, profile);
  return linkedCredential.user;
}

export async function linkCurrentUserWithGoogle() {
  const activeAuth = requireAuth();
  if (!activeAuth.currentUser) throw new Error("Login required.");
  const result = await linkWithPopup(activeAuth.currentUser, googleProvider);
  await ensureUserProfile(result.user);
  return result.user;
}

export async function sendResetEmail(email) {
  const activeAuth = requireAuth();
  return sendPasswordResetEmail(activeAuth, email);
}

export async function changeCurrentPassword(currentPassword, newPassword) {
  const activeAuth = requireAuth();
  const currentUser = activeAuth.currentUser;
  if (!currentUser) throw new Error("Login required.");
  if (!currentUser.email) throw new Error("Email is required to change password.");

  const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
  await reauthenticateWithCredential(currentUser, credential);
  await updatePassword(currentUser, newPassword);
  await currentUser.reload();
  await ensureUserProfile(currentUser);
  return currentUser;
}

export async function setPasswordForGoogleUser(newPassword) {
  const activeAuth = requireAuth();
  const currentUser = activeAuth.currentUser;
  if (!currentUser) throw new Error("Login required.");
  if (!currentUser.email) throw new Error("Email is required to set password.");

  const credential = EmailAuthProvider.credential(currentUser.email, newPassword);
  const linkedCredential = await linkWithCredential(currentUser, credential);
  await linkedCredential.user.reload();
  await ensureUserProfile(linkedCredential.user);
  return linkedCredential.user;
}

export async function logoutUser() {
  const activeAuth = requireAuth();
  return signOut(activeAuth);
}
