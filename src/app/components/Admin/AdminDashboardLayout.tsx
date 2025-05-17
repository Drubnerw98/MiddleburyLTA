"use client";

import { useState } from "react";

import PostManager from "../PostManager";
import CommentManager from "../CommentManager";
import AboutEditor from "../AboutEditor";
import SettingsPanel from "../SettingsPanel";

const tabs = ["Posts", "Comments", "About Page", "Settings"];

export default function AdminDashboardLayout() {
  const [activeTab, setActiveTab] = useState("Posts");

  return (
    <div className="max-w-5xl mx-auto py-8 text-white">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-white/10 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-[#1e2633] text-gray-300 hover:bg-blue-700/40"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === "Posts" && <PostManager />}
        {activeTab === "Comments" && <CommentManager />}
        {activeTab === "About Page" && <AboutEditor />}
        {activeTab === "Settings" && <SettingsPanel />}
      </div>
    </div>
  );
}
