import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Clock,
  Users2,
} from "lucide-react";

// Modal component
function DoctorModal({ doctor, onClose }: any) {
  if (!doctor) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-lg w-full p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-40 h-40 rounded-full mx-auto mb-6 object-cover border-4 border-teal-600 dark:border-teal-300"
        />
        <h3 className="text-2xl font-bold text-center text-teal-700 dark:text-teal-300 mb-2">
          {doctor.name}
        </h3>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-4 font-medium">
          {doctor.title}
        </p>
        <p className="text-center text-gray-500 dark:text-gray-400 leading-relaxed">
          {doctor.info}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const doctors = [
    {
      name: "Dr. Maya Fernando",
      title: "Chief Medical Officer",
      image: "/doctor3.jpg",
      info: "Specializes in general medicine and hospital administration.",
    },
    {
      name: "Dr. Anil Perera",
      title: "Head of Diagnostics",
      image: "/doctor1.jpg",
      info: "Expert in diagnostic imaging and lab management.",
    },
    {
      name: "Dr. Kavya Wijesinghe",
      title: "Consultant Cardiologist",
      image: "/doctor2.jpg",
      info: "Focused on cardiac care and patient wellness programs.",
    },
  ];

  return (
    <div className="w-full min-h-dvh flex flex-col bg-gradient-to-b from-teal-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* NAVBAR */}
      <header className="w-full bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <img src="/favicon.svg" alt="MedSync Logo" className="h-10 w-10" />
            <span className="text-xl font-semibold text-teal-700 dark:text-teal-300">
              MedSync Clinic
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition"
              onClick={() => {
                const element = document.getElementById("hero");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition"
              onClick={() => {
                const element = document.getElementById("about");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              About
            </Button>
            <Button
              variant="ghost"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 transition"
              onClick={() => {
                const element = document.getElementById("services");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Services
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white transition"
            >
              <Link to="/sign-in">Login</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 text-2xl p-2 hover:text-teal-600 transition"
            >
              ☰
            </button>

            {/* Dropdown menu */}
            <div
              className={`absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                mobileMenuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <Button
                variant="ghost"
                className="w-full text-left text-gray-700 dark:text-gray-300 hover:text-teal-600 px-4 py-2 transition"
                onClick={() => {
                  const element = document.getElementById("hero");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className="w-full text-left text-gray-700 dark:text-gray-300 hover:text-teal-600 px-4 py-2 transition"
                onClick={() => {
                  const element = document.getElementById("about");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                  setMobileMenuOpen(false);
                }}
              >
                About
              </Button>
              <Button
                variant="ghost"
                className="w-full text-left text-gray-700 dark:text-gray-300 hover:text-teal-600 px-4 py-2 transition"
                onClick={() => {
                  const element = document.getElementById("services");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                  setMobileMenuOpen(false);
                }}
              >
                Services
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white transition m-2"
              >
                <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative flex flex-col items-center justify-center text-center py-24 px-6"
      >
        <img
          src="/logo.svg"
          alt="MedSync Clinic Logo"
          className="w-48 h-24 mb-4 drop-shadow-lg md:h-50 md:w-100"
        />
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-700 dark:text-teal-300 mb-3 tracking-tight">
          Welcome to MedSync Clinic
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
          Delivering excellence in healthcare — powered by advanced technology
          and compassionate care.
        </p>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm py-16 px-6"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-teal-700 dark:text-teal-300">
              About MedSync Clinic
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At MedSync Clinic, we redefine healthcare through innovation and
              patient-centered technology. Our integrated medical management
              system ensures seamless coordination between departments,
              guaranteeing accurate, efficient, and personalized care for every
              patient.
            </p>
            <div className="text-left">
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                <li>Trusted by thousands of patients across Sri Lanka</li>
                <li>Electronic medical records for smooth consultations</li>
                <li>Modern facilities with 24/7 access to care</li>
                <li>ISO-certified data security and confidentiality</li>
              </ul>
            </div>
          </div>
          <img
            src="/clinic-interior.jpg"
            alt="Clinic interior"
            className="rounded-2xl shadow-xl object-cover w-full h-[350px]"
          />
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-100 to-green-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-lg p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-700 dark:text-teal-300 mb-6">
            Our Mission
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            To create a healthcare environment where medical excellence meets
            technological innovation — ensuring every patient receives timely,
            accurate, and compassionate treatment.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            We believe in prevention, precision, and partnership. Our mission is
            not only to treat but also to educate and empower our patients to
            lead healthier lives.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION (unchanged) */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-teal-700 dark:text-teal-300 mb-4">
            Our Core Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            A modern, connected clinic experience designed to make healthcare
            easier for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Card className="shadow-lg border-teal-100 dark:border-slate-700">
            <CardHeader className="flex flex-col items-center">
              <Stethoscope className="h-10 w-10 text-teal-600 mb-2" />
              <CardTitle>General Consultation</CardTitle>
              <CardDescription>Book with top physicians</CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg border-teal-100 dark:border-slate-700">
            <CardHeader className="flex flex-col items-center">
              <HeartPulse className="h-10 w-10 text-teal-600 mb-2" />
              <CardTitle>Patient-Centric Care</CardTitle>
              <CardDescription>We care beyond treatment</CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg border-teal-100 dark:border-slate-700">
            <CardHeader className="flex flex-col items-center">
              <ShieldCheck className="h-10 w-10 text-teal-600 mb-2" />
              <CardTitle>Secure Data</CardTitle>
              <CardDescription>Your health info stays safe</CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-lg border-teal-100 dark:border-slate-700">
            <CardHeader className="flex flex-col items-center">
              <Clock className="h-10 w-10 text-teal-600 mb-2" />
              <CardTitle>24/7 Support</CardTitle>
              <CardDescription>Anytime, anywhere</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="bg-white/60 dark:bg-slate-800/50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-teal-700 dark:text-teal-300 mb-4">
            Our Expert Team
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            A dedicated group of doctors, nurses, and specialists working
            together to provide holistic, reliable, and innovative healthcare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {doctors.map((doc) => (
            <Card
              key={doc.name}
              className="border-teal-100 dark:border-slate-700 text-center shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedDoctor(doc)}
            >
              <CardHeader>
                <Users2 className="h-10 w-10 text-teal-600 mx-auto mb-2" />
                <CardTitle>{doc.name}</CardTitle>
                <CardDescription>{doc.title}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Doctor Modal */}
      {selectedDoctor && (
        <DoctorModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-teal-700 text-white py-12 text-center">
        <div className="max-w-5xl mx-auto space-y-4">
          <p className="text-xl font-semibold">
            MedSync Clinic — Compassion Meets Technology
          </p>
          <p className="text-sm text-teal-100">
            123 Health Avenue, Colombo, Sri Lanka | +94 112 223344 |{" "}
            <a href="mailto:info@medsyncclinic.com" className="underline">
              info@medsyncclinic.com
            </a>
          </p>
          <p className="text-xs text-teal-200">
            © {new Date().getFullYear()} MedSync Clinic. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
