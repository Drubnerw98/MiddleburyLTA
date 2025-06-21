'use client'

import { useState } from 'react'

import PostManager from '../PostManager'
import CommentManager from '../CommentManager'
import AboutEditor from '../AboutEditor'
import SettingsPanel from '../SettingsPanel'
import LinkManager from '../LinkManager' // ✅ NEW IMPORT

const tabs = ['Posts', 'Comments', 'About Page', 'Settings', 'Articles & Links'] // ✅ NEW TAB

export default function AdminDashboardLayout() {
    const [activeTab, setActiveTab] = useState('Posts')

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Heading */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-[#1A2E49]">Admin Dashboard</h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Manage site content and settings.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-all border ${
                                activeTab === tab
                                    ? 'bg-[#1A2E49] text-white border-[#1A2E49]'
                                    : 'bg-gray-100 text-[#1A2E49] border-gray-300 hover:bg-blue-50'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Panel Content */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
                    {activeTab === 'Posts' && <PostManager />}
                    {activeTab === 'Comments' && <CommentManager />}
                    {activeTab === 'About Page' && <AboutEditor />}
                    {activeTab === 'Settings' && <SettingsPanel />}
                    {activeTab === 'Articles & Links' && <LinkManager />}
                </div>
            </div>
        </div>
    )
}
