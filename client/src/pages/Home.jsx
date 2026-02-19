import React from 'react';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import TrustSection from '../components/TrustSection';
import FeaturesSection from '../components/FeaturesSection';
import PricingSection from '../components/PricingSection';
import AddOnsSection from '../components/AddOnsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <>
            <Navbar />
            <div id="home">
                <HeroSection />
            </div>
            <TrustSection />
            <div id="features">
                <FeaturesSection />
            </div>
            <div id="pricing">
                <PricingSection />
            </div>
            <AddOnsSection />
            <div id="reviews">
                <TestimonialsSection />
            </div>
            <div id="faq">
                <FAQSection />
            </div>
            <CTASection />
            <Footer />
        </>
    );
}

export default Home;
