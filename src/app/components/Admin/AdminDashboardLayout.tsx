'use client'

import { useState } from 'react'

import PostManager from '../PostManager'
import CommentManager from '../CommentManager'
import AboutEditor from '../AboutEditor'
import SettingsPanel from '../SettingsPanel'
import LinkManager from '../LinkManager'
import { DisplayHeading, Eyebrow, Lead } from '../ui'

const tabs = ['Posts', 'Comments', 'About Page', 'Settings', 'Articles & Links']

export default function AdminDashboardLayout() {
    const [activeTab, setActiveTab] = useState('Posts')

    return (
        <main className="min-h-screen bg-paper">
            <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
                {/* Heading */}
                <header>
                    <Eyebrow tone="oxblood">Admin</Eyebrow>
                    <DisplayHeading level={1} className="mt-3">
                        Dashboard.
                    </DisplayHeading>
                    <Lead className="mt-4">
                        Manage site content and settings.
                    </Lead>
                </header>

                {/* Tabs */}
                <div className="mt-10 flex flex-wrap gap-2 border-b border-rule pb-0">
                    {tabs.map((tab) => {
                        const active = activeTab === tab
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] px-4 py-2.5 transition-colors ${
                                    active
                                        ? 'text-ink border-b-2 border-ink -mb-px'
                                        : 'text-muted hover:text-ink border-b-2 border-transparent -mb-px'
                                }`}
                            >
                                {tab}
                            </button>
                        )
                    })}
                </div>

                {/* Panel Content */}
                <div className="mt-10">
                    {activeTab === 'Posts' && <PostManager />}
                    {activeTab === 'Comments' && <CommentManager />}
                    {activeTab === 'About Page' && <AboutEditor />}
                    {activeTab === 'Settings' && <SettingsPanel />}
                    {activeTab === 'Articles & Links' && <LinkManager />}
                </div>
            </div>
        </main>
    )
}
