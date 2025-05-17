"use client";

import { useEffect, useState, useTransition } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function SettingsPanel() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "admin", "settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEmailNotifications(!!docSnap.data().emailNotifications);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = () => {
    setStatus("Saving...");
    startTransition(() => {
      const docRef = doc(db, "admin", "settings");
      setDoc(docRef, { emailNotifications })
        .then(() => setStatus("✅ Saved"))
        .catch((err) => {
          console.error(err);
          setStatus("❌ Error saving");
        });
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-blue-400 border-b border-white/10 pb-2">
        Site Settings
      </h2>

      <label className="flex items-center gap-3 text-gray-300">
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={(e) => setEmailNotifications(e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        Enable email notifications
      </label>

      <button
        onClick={handleSave}
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Save Settings
      </button>

      {status && <p className="text-sm text-gray-300 italic">{status}</p>}
    </div>
  );
}
