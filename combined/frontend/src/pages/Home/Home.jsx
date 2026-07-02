import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  MessageCircle,
  Sparkles,
  Search,
  UtensilsCrossed,
  BookOpen,
  ArrowRight,
  Heart,
  PawPrint,
} from "lucide-react";
import heroDog from "../../assets/fullmascotfinal-Photoroom_01.png";

const FEATURES = [
  { icon: Camera, title: "Breed Identifier", path: "/identify",
    desc: "Snap a photo and let our AI vision tell you breed, origin, temperament & care." },
  { icon: MessageCircle, title: "Ask PawPal", path: "/chatbot",
    desc: "A friendly AI chat for care, training and vaccination questions — any time." },
  { icon: Sparkles, title: "Find My Dog", path: "/recommendation",
    desc: "Tell us about your life — get personalized breed matches that truly fit." },
  { icon: Search, title: "Smart Search", path: "/search",
    desc: "“Friendly dogs for kids,” “low-shedding apartment dogs” — just ask naturally." },
  { icon: UtensilsCrossed, title: "Nutrition Plans", path: "/nutrition",
    desc: "Age & breed-aware meal plans with foods to enjoy and foods to avoid." },
  { icon: BookOpen, title: "Encyclopedia", path: "/encyclopedia",
    desc: "Explore breeds by country, classification, behavior and grooming needs." },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16 flex flex-col gap-16 md:gap-24">
      {/* Hero */}
      <section className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="flex flex-col gap-6">
          <span className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-primary font-body-sm text-[0.72rem] font-bold uppercase tracking-wider">
            <PawPrint size={14} /> Made with tail wags
          </span>
          <h1 className="font-headline-xl text-on-surface leading-[1.05] text-[clamp(2.5rem,6vw,4.25rem)]">
            Every good dog,
            <br />
            <span className="italic text-primary">better understood.</span>
          </h1>
          <p className="font-body-md text-on-surface-variant text-[1.05rem] leading-relaxed max-w-[34rem]">
            PawPal is your warm, AI-powered companion for everything dog — identify breeds
            from a photo, get care advice, and discover the perfect pup for your life.
          </p>
          <div className="flex flex-wrap gap-3 mt-1">
            <button
              onClick={() => navigate("/identify")}
              className="inline-flex items-center gap-2 bg-primary hover:bg-[#b65a3d] text-on-tertiary font-body-md font-semibold px-6 py-3.5 rounded-full transition-colors cursor-pointer border-none"
            >
              <Camera size={18} /> Identify a dog
            </button>
            <button
              onClick={() => navigate("/chatbot")}
              className="inline-flex items-center gap-2 bg-surface-container-lowest hover:bg-primary-container text-on-surface font-body-md font-semibold px-6 py-3.5 rounded-full border border-primary/20 transition-colors cursor-pointer"
            >
              <Heart size={18} className="text-primary" /> Ask PawPal
            </button>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative">
          <div className="rounded-[2rem] bg-gradient-to-br from-primary-container to-surface-container-high p-4 sm:p-6 shadow-[0_24px_60px_-24px_rgba(203,106,75,0.45)]">
            <div className="rounded-[1.5rem] bg-surface-container-lowest aspect-[4/3] flex items-center justify-center overflow-hidden">
              <img src={heroDog} alt="A happy dog" className="h-[85%] w-auto object-contain drop-shadow-xl" />
            </div>
          </div>
          <div className="absolute -bottom-4 left-4 sm:left-8 bg-surface-container-lowest rounded-2xl shadow-[0_16px_40px_-16px_rgba(61,43,31,0.35)] px-4 py-3 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <PawPrint size={20} className="text-primary" />
            </span>
            <div className="leading-tight">
              <div className="font-body-sm text-[0.65rem] font-bold uppercase tracking-wider text-on-surface-variant">
                AI Confidence
              </div>
              <div className="font-headline-lg text-on-surface text-[1.05rem]">
                French Bulldog · 98%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="group text-left flex flex-col gap-4 bg-surface-container-lowest border border-primary/10 rounded-[1.5rem] p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-22px_rgba(61,43,31,0.35)] hover:border-primary/30"
          >
            <span className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
              <Icon size={22} className="text-primary" />
            </span>
            <h3 className="font-headline-lg text-on-surface text-[1.6rem]">{title}</h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed flex-1">{desc}</p>
            <span className="inline-flex items-center gap-1.5 text-primary font-body-md font-semibold">
              Open <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        ))}
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary-container via-surface-container-high to-primary-container px-8 py-12 sm:px-14 sm:py-16">
        <h2 className="font-headline-xl text-on-surface text-[clamp(2rem,5vw,3.25rem)] leading-tight max-w-[30rem]">
          Not sure where to start?
        </h2>
        <p className="font-body-md text-on-surface-variant text-[1.05rem] leading-relaxed max-w-[34rem] mt-4">
          Tell PawPal about your home and lifestyle — get a shortlist of breeds that will love
          living with you.
        </p>
        <button
          onClick={() => navigate("/recommendation")}
          className="inline-flex items-center gap-2 bg-tertiary hover:opacity-90 text-on-tertiary font-body-md font-semibold px-7 py-3.5 rounded-full mt-8 transition-opacity cursor-pointer border-none"
        >
          <Sparkles size={18} /> Find my perfect dog
        </button>
      </section>
    </div>
  );
}
