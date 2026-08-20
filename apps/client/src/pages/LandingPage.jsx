import { useState } from "react";
// import "../landing.css";
import Hero from "../components/Hero";
import BridgeSection from "../components/BridgeSection";
import Lifecycle from "../components/Lifecycle";
import Capabilities from "../components/Capabilities";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";

export default function LandingPage() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState("vendor");


  return (
    <div className="landing-page">
      <Hero loginHandler={() => setLoginOpen(true)} />
      <BridgeSection />
      <Lifecycle />
      <Capabilities />
      <CtaBanner />
      <Footer />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
