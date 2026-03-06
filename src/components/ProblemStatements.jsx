import React, { useState } from 'react';
import { Lock, ChevronDown, ChevronUp, Star } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

const ProblemStatements = ({ phase, nextUnlock }) => {
  const [openAccordion, setOpenAccordion] = useState({});

  const toggleAccordion = (id, section) => {
    setOpenAccordion(prev => ({
      ...prev,
      [`${id}-${section}`]: !prev[`${id}-${section}`]
    }));
  };

  const getDayUnlocksDate = (day) => {
    switch(day) {
      case 1: return "2026-03-23T18:30:00.000Z";
      case 2: return "2026-03-24T18:30:00.000Z";
      case 3: return "2026-03-25T18:30:00.000Z";
      default: return null;
    }
  };

  const isUnlocked = (day) => {
    if (phase === 'results' || phase === 'day3') return true;
    if (phase === 'day2' && day <= 2) return true;
    if (phase === 'day1' && day === 1) return true;
    return false;
  };

  const calculateBlur = (targetDateString) => {
    // 7 days = 604800000ms
    const maxMs = 7 * 24 * 60 * 60 * 1000; 
    const targetTime = new Date(targetDateString).getTime();
    const now = new Date().getTime();
    
    const diff = targetTime - now;
    
    if (diff <= 0) return 0;
    
    // Scale blur from 10px (max blur) down to 0px
    // Anything > 7 days out is fully blurred at 10px
    let blurPx = (diff / maxMs) * 10;
    if (blurPx > 10) blurPx = 10;
    if (blurPx < 0) blurPx = 0;
    
    return blurPx.toFixed(1);
  };

  const statements = [
    {
      id: "IAR-D1-PS01",
      day: 1,
      title: "VidyaSeva — AI-Powered Multilingual Tutoring Assistant for Underserved Students",
      domain: "Education",
      tech: ["Gen-AI", "NLP", "Speech-to-Text", "Translation API"],
      color: "border-[var(--color-day1)]",
      bgColor: "bg-[var(--color-day1)]/10",
      definition: "Over 250M school students in Tier-2/3 cities lack after-school tutoring support. Government schools face 1:50+ teacher-student ratio. Students speak regional languages but content is in English. Build a Gen-AI multilingual tutoring assistant for Class 6-10 students to ask doubts in any regional language via text or voice and get NCERT-aligned step-by-step explanations.",
      input: "Regional language text or voice query, subject selection (Math/Science/SST/English), class level (6-10), optional photo of question.",
      output: "Step-by-step solution in chosen language with audio, Simplify Further option, 3-point concept summary card, AI-generated practice question.",
      scalability: "22 Indian languages, all state board curricula, DIKSHA/PM-eVIDYA portal integration."
    },
    {
      id: "IAR-D2-PS01",
      day: 2,
      title: "NagarSeva AI — Multi-Modal Citizen Grievance Routing & Resolution Intelligence System",
      domain: "Smart Cities",
      tech: ["RAG", "Multi-modal AI", "NLP Classification", "REST API"],
      color: "border-[var(--color-day2)]",
      bgColor: "bg-[var(--color-day2)]/10",
      definition: "Urban local bodies receive 50,000+ complaints daily. Over 62% are misrouted to wrong departments causing 7-30 day delays. Complaints arrive as unstructured text, images, and voice in multiple languages. Build a RAG-powered system to auto-classify complaints to correct departments with priority tagging and SLA tracking.",
      input: "Complaint text/photo/voice in any language, optional GPS coordinates, historical complaint DB + SLA policy PDF as RAG source.",
      output: "Department routing classification, P1/P2/P3 priority tag with reasoning, structured work order ticket, citizen acknowledgment in their language, department dashboard with SLA heatmap.",
      scalability: "Integrates with CPGRAMS/Nivaran, expandable to 4000+ urban local bodies, predictive hotspot detection layer."
    },
    {
      id: "IAR-D3-PS01",
      day: 3,
      title: "FraudShield AI — Agentic Transaction Narrative Intelligence for Real-Time Banking Fraud Detection",
      domain: "Finance & Banking",
      tech: ["Agentic AI", "LLM", "Anomaly Detection", "RAG", "Real-time Streaming"],
      color: "border-[var(--color-day3)]",
      bgColor: "bg-[var(--color-day3)]/10",
      definition: "UPI processes 14B+ transactions/month. RBI reported Rs.30,252 crore in banking fraud (FY2023). Rule-based systems generate 40-60% false positives. Existing ML cannot explain WHY a transaction is fraudulent. Build an agentic AI system that detects fraud sequences in real-time, generates plain-English fraud narratives, and recommends Block/Alert/Monitor/Allow within 2 seconds.",
      input: "Real-time transaction stream JSON (ID, amount, merchant category, device, location, time delta), user behavioral baseline, RAG knowledge base of RBI circulars and known fraud patterns.",
      output: "Risk score 0-100 with Block/Alert/Monitor/Allow decision, plain-English fraud narrative explaining attack chain, analyst dashboard, auto-generated SAR draft, analyst override feedback loop.",
      scalability: "10,000+ TPS microservice architecture, NPCI/RBI SAR automation integration, deployable to any core banking system."
    }
  ];

  return (
    <section id="problems" className="py-20 bg-[var(--color-navy-primary)] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4 relative inline-block">
            Problem Statements
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-[var(--color-gold-primary)] to-transparent"></div>
          </h2>
          <p className="mt-4 text-xl text-gray-400">Time-gated challenges progressively revealed each day.</p>
          
          <div className="mt-6 inline-block bg-[var(--color-gold-primary)]/10 border border-[var(--color-gold-primary)]/20 rounded-lg px-6 py-3 text-[var(--color-gold-light)] text-sm font-medium shadow-sm">
            <span className="font-bold tracking-wider uppercase text-white mr-2">Notice:</span>
            Problem statements will be fully disclosed exactly 24 hours prior to each respective day's kickoff.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {statements.map((ps) => {
            const unlocked = isUnlocked(ps.day);

            if (!unlocked) {
              return (
                <div key={ps.id} className="bg-[var(--color-navy-mid)] border-2 border-dashed border-[var(--color-gold-primary)]/40 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[500px] card-shadow relative overflow-hidden group hover:border-[var(--color-gold-primary)] transition-colors">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  <div className="relative z-10 w-full">
                    <div className="bg-[var(--color-navy-primary)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--color-gold-primary)]/30 card-shadow">
                      <Lock className="w-10 h-10 text-[var(--color-gold-light)]" />
                    </div>
                    <h3 className="text-3xl font-bold tracking-widest text-[var(--color-gold-primary)] mb-2 uppercase">Classified</h3>
                    <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest mb-2 border border-[#2F8D46]/30 bg-[#2F8D46]/10 py-1 px-3 rounded-full inline-block">Day {ps.day} — {ps.day === 1 ? '1st' : ps.day === 2 ? '2nd' : '3rd'} Year</p>
                    <p className="text-xl text-white font-medium mb-8 flex items-center justify-center gap-2">
                      Domain: <span className="select-none transition-all duration-1000" style={{ filter: `blur(${calculateBlur(getDayUnlocksDate(ps.day))}px)` }}>{ps.domain}</span>
                    </p>
                    
                    <div className="mt-auto pt-8 border-t border-[var(--color-gold-primary)]/20 w-full">
                      <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">Unlocks In</p>
                      <div className="scale-75 origin-top mb-[-2rem]">
                        <CountdownTimer targetDate={getDayUnlocksDate(ps.day)} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={ps.id} className={`bg-[var(--color-navy-mid)] border-t-4 ${ps.color} rounded-2xl flex flex-col min-h-[500px] card-shadow transition-all duration-300 hover:-translate-y-2`}>
                <div className={`p-6 border-b border-gray-700 ${ps.bgColor}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-[var(--color-navy-primary)] text-gray-300 text-xs font-mono px-3 py-1 rounded border border-gray-600">{ps.id}</span>
                    <span className="bg-yellow-500/20 text-yellow-300 text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-300" /> High Win Probability
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{ps.title}</h3>
                  <p className="text-gray-300 text-sm font-medium mb-4">Domain: <span className="text-[var(--color-gold-light)]">{ps.domain}</span></p>
                  
                  <div className="flex flex-wrap gap-2">
                    {ps.tech.map(t => (
                      <span key={t} className="bg-white/5 text-gray-300 text-xs px-2 py-1 rounded border border-white/10">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col gap-3">
                  {[
                    { id: 'definition', title: 'Problem Definition', content: ps.definition },
                    { id: 'input', title: 'Expected Input', content: ps.input },
                    { id: 'output', title: 'Expected Output', content: ps.output },
                    { id: 'scalability', title: 'Scalability Hook', content: ps.scalability }
                  ].map((section) => (
                    <div key={section.id} className="border border-gray-700 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => toggleAccordion(ps.id, section.id)}
                        className="w-full flex justify-between items-center bg-[var(--color-navy-soft)] hover:bg-white/5 p-3 text-left transition-colors"
                      >
                        <span className="font-semibold text-sm text-[var(--color-gold-pale)]">{section.title}</span>
                        {openAccordion[`${ps.id}-${section.id}`] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      {openAccordion[`${ps.id}-${section.id}`] && (
                        <div className="p-4 bg-[var(--color-navy-mid)] text-sm text-gray-300 leading-relaxed border-t border-gray-700">
                          {section.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatements;
