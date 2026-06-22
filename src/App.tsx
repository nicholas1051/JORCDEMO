import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/toaster";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Community from "@/pages/Community";
import Contact from "@/pages/Contact";
import Facility from "@/pages/Facility";
import Programs from "@/pages/Programs";
import StakeholderReport from "@/pages/StakeholderReport";
import Donate from "@/pages/Donate";

const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/community" element={<Community />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/facility" element={<Facility />} />
              <Route path="/programs" element={<Programs />} />
              <Route path="/stakeholder/report" element={<StakeholderReport />} />
              <Route path="/donate" element={<Donate />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
