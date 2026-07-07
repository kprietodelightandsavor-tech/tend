// src/lib/push.js
// Enable gentle push nudges: register the service worker, ask permission,
// subscribe with our VAPID key, and save the subscription to the account.

const VAPID_PUBLIC_KEY = "BM9ROmfHwbkkdodr35CDJbH7f8_g01u8n2Txfqf4eFhG0-BPxuh-ueYT39QKvyY5-Cqq5mjqeXAu0eUPu3a0GUU";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function pushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export async function enableNudges(userId) {
  if (!pushSupported()) {
    return { ok: false, reason: "This device doesn't support notifications. On iPhone, add Tend to your Home Screen first, then enable from there." };
  }
  const reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, reason: "Permission wasn't granted. You can allow notifications in your device settings." };
  }

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  const res = await fetch("/.netlify/functions/push-subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, subscription: sub.toJSON() }),
  });
  if (!res.ok) return { ok: false, reason: "Couldn't save the subscription. Try again in a moment." };
  return { ok: true };
}
