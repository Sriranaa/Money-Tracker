import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase/config";

function requireDb() {
  if (!db) throw new Error("Firebase is not configured.");
  return db;
}

export function userRef(uid) {
  return doc(requireDb(), "users", uid);
}

export function profileRef(uid) {
  return doc(requireDb(), "users", uid, "profile", "details");
}

export function settingsRef(uid) {
  return doc(requireDb(), "users", uid, "settings", "preferences");
}

export async function ensureUserProfile(firebaseUser, profile = {}) {
  const uid = firebaseUser.uid;
  const profileSnapshot = await getDoc(profileRef(uid));
  const nameParts = firebaseUser.displayName?.split(" ") || [];
  const payload = {
    firstName: profile.firstName || profileSnapshot.data()?.firstName || nameParts[0] || "",
    lastName: profile.lastName || profileSnapshot.data()?.lastName || nameParts.slice(1).join(" ") || "",
    dateOfBirth: profile.dateOfBirth || profileSnapshot.data()?.dateOfBirth || "",
    mobile: profile.mobile || profileSnapshot.data()?.mobile || firebaseUser.phoneNumber || "",
    email: profile.email || firebaseUser.email || profileSnapshot.data()?.email || "",
    photoURL: firebaseUser.photoURL || profileSnapshot.data()?.photoURL || "",
    authProviders: firebaseUser.providerData.map((provider) => provider.providerId),
    updatedAt: serverTimestamp()
  };

  await setDoc(userRef(uid), { uid, updatedAt: serverTimestamp(), createdAt: serverTimestamp() }, { merge: true });
  await setDoc(profileRef(uid), payload, { merge: true });
  await setDoc(
    settingsRef(uid),
    {
      language: localStorage.getItem("mt_language") || "en",
      theme: localStorage.getItem("mt_theme") || "system",
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
  return payload;
}

export function subscribeProfile(uid, callback) {
  return onSnapshot(profileRef(uid), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null);
  });
}

export function subscribeSettings(uid, callback) {
  return onSnapshot(settingsRef(uid), (snapshot) => {
    callback(snapshot.exists() ? snapshot.data() : null);
  });
}

export async function updateProfile(uid, profile) {
  await updateDoc(profileRef(uid), {
    ...profile,
    updatedAt: serverTimestamp()
  });
}

export async function updateSettings(uid, settings) {
  await setDoc(
    settingsRef(uid),
    {
      ...settings,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
