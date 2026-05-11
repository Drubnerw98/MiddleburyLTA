'use client';

import HeroSection from '@/app/components/HeroSection';
import AdsSection from '@/app/components/AdsSection';
import PageWrapper from '@/app/components/PageWrapper';

export default function Home() {
    return (
        <PageWrapper>
            <HeroSection />
            <AdsSection />
        </PageWrapper>
    );
}
