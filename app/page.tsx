import AttentionBar from "@/components/bariatric/AttentionBar";
import BookingModal from "@/components/bariatric/BookingModal";
import BeforeAfterSection from "@/components/bariatric/BeforeAfterSection";
import BenefitsSection from "@/components/bariatric/BenefitsSection";
import BookingSection from "@/components/bariatric/BookingSection";
import CandidateSection from "@/components/bariatric/CandidateSection";
import ConditionSection from "@/components/bariatric/ConditionSection";
import DoctorSection from "@/components/bariatric/DoctorSection";
import FaqSection from "@/components/bariatric/FaqSection";
import FinalCtaSection from "@/components/bariatric/FinalCtaSection";
import Footer from "@/components/bariatric/Footer";
import Header from "@/components/bariatric/Header";
import HeroSection from "@/components/bariatric/HeroSection";
import Marquee from "@/components/bariatric/Marquee";
import MetaBar from "@/components/bariatric/MetaBar";
import MistakesSection from "@/components/bariatric/MistakesSection";
import TextTestimonialsSection from "@/components/bariatric/TextTestimonialsSection";
import UrgencyBar from "@/components/bariatric/UrgencyBar";
import VideoTestimonialsSection from "@/components/bariatric/VideoTestimonialsSection";

export default function Home() {
  return (
    <>
      <AttentionBar />
      <Header />
      <HeroSection />
      <MetaBar />
      <Marquee />
      <CandidateSection />
      <MistakesSection />
      <ConditionSection />
      <BeforeAfterSection />
      <DoctorSection />
      <BenefitsSection />
      <VideoTestimonialsSection />
      <TextTestimonialsSection />
      <BookingSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
      <UrgencyBar />
      <BookingModal />
    </>
  );
}
