import Navbar from "@/components/Navbar";
import CreateAgentSection from "@/components/CreateAgentSection";
import AllModelsSection from "@/components/AllModelsSection";
import ImageToolsFeaturesSection from "@/components/ImageToolsFeaturesSection";
import VideoToolsFeaturesSection from "@/components/VideoToolsFeaturesSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import PricingSection from "@/components/PricingSection";
import DevelopersSection from "@/components/DevelopersSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden w-full relative">
      {/* Neural Network Background - Full Page (except hero) */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80')`,
          opacity: 0.12,
          filter: 'blur(0.5px)',
        }}
      />
      
      {/* Additional overlay for better text readability */}
      <div className="fixed inset-0 bg-background/30 pointer-events-none z-0" />
      
      <div className="relative z-10">
        <Navbar />
        <CreateAgentSection />
        <AllModelsSection />
        {/* <ImageToolsFeaturesSection />
        <VideoToolsFeaturesSection /> */}
        <ShowcaseSection />
        <PricingSection />
        <DevelopersSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
