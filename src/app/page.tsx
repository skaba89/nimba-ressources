"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Papa from "papaparse";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import {
  BarChart3, FlaskConical, Handshake, Briefcase, TrendingUp, Zap, Building2,
  Search, Lightbulb, FileSpreadsheet, CheckCircle2, Rocket,
  Link2, X,
  Hammer, Cpu, Wheat, Truck, ClipboardList, DollarSign,
  LayoutDashboard
} from "lucide-react";

// ─── Data ───────────────────────────────────────────────────────────────────

const projects = [
  { name: "Nimba Iron Mine", sector: "Mining", budget: 50, cost: 38, revenue: 89.5, roi: 79, status: "Active", country: "Guinée", countryFlag: "GN" },
  { name: "Solar Plant Dakar", sector: "Energy", budget: 20, cost: 16, revenue: 29.1, roi: 44, status: "Active", country: "Sénégal", countryFlag: "SN" },
  { name: "Lagos Real Estate", sector: "Real Estate", budget: 35, cost: 30, revenue: 52.5, roi: 50, status: "Active", country: "Nigeria", countryFlag: "NG" },
  { name: "Abidjan Tech Hub", sector: "Technology", budget: 15, cost: 12, revenue: 22.5, roi: 50, status: "Completed", country: "Côte d'Ivoire", countryFlag: "CI" },
  { name: "Kinshasa Agri-Business", sector: "Agriculture", budget: 25, cost: 20, revenue: 32.5, roi: 30, status: "Active", country: "RDC", countryFlag: "CD" },
  { name: "Accra Fintech", sector: "Technology", budget: 10, cost: 8, revenue: 16.0, roi: 60, status: "Active", country: "Ghana", countryFlag: "GH" },
  { name: "Nairobi Logistics", sector: "Logistics", budget: 30, cost: 24, revenue: 39.0, roi: 30, status: "Pending", country: "Kenya", countryFlag: "KE" },
  { name: "Douala Port Extension", sector: "Logistics", budget: 45, cost: 36, revenue: 63.0, roi: 40, status: "Active", country: "Cameroun", countryFlag: "CM" },
];

const projectImages: Record<string, string> = {
  "Nimba Iron Mine": "/images/projects/mining.png",
  "Solar Plant Dakar": "/images/projects/energy.png",
  "Lagos Real Estate": "/images/projects/realestate.png",
  "Abidjan Tech Hub": "/images/projects/technology.png",
  "Kinshasa Agri-Business": "/images/projects/agriculture.png",
  "Accra Fintech": "/images/projects/technology.png",
  "Nairobi Logistics": "/images/projects/logistics.png",
  "Douala Port Extension": "/images/projects/logistics.png",
};

const sectors = ["Mining", "Energy", "Real Estate", "Technology", "Agriculture", "Logistics"];
const statuses = ["Active", "Completed", "Pending"];

const navItems = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Simulateur ROI", href: "#simulateur" },
  { label: "Projets", href: "#projets" },
  { label: "Pipeline", href: "#pipeline" },
  { label: "Analytics", href: "#analytics" },
  { label: "Témoignages", href: "#temoignages" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Contact", href: "#contact" },
];

// ─── Chart Colors ──────────────────────────────────────────────────────────

const COLORS = ["#2B6CB0", "#13612e", "#f5a524", "#b82105", "#f7630c", "#2B9EB3", "#7C5CFC", "#E84393"];

const monthlyData = [
  { month: "Jan", revenue: 12, budget: 8, cost: 6 },
  { month: "Fév", revenue: 18, budget: 15, cost: 12 },
  { month: "Mar", revenue: 25, budget: 22, cost: 18 },
  { month: "Avr", revenue: 32, budget: 30, cost: 24 },
  { month: "Mai", revenue: 38, budget: 35, cost: 28 },
  { month: "Jun", revenue: 45, budget: 42, cost: 34 },
  { month: "Jul", revenue: 52, budget: 50, cost: 40 },
  { month: "Aoû", revenue: 58, budget: 55, cost: 44 },
  { month: "Sep", revenue: 67, budget: 60, cost: 48 },
  { month: "Oct", revenue: 75, budget: 68, cost: 54 },
  { month: "Nov", revenue: 82, budget: 73, cost: 58 },
  { month: "Déc", revenue: 95, budget: 85, cost: 68 },
];

const candlestickData = [
  { month: "Jan", open: 8.2, high: 10.5, low: 5.8, close: 12 },
  { month: "Fév", open: 14.5, high: 19.0, low: 11.0, close: 18 },
  { month: "Mar", open: 21.0, high: 26.5, low: 17.5, close: 25 },
  { month: "Avr", open: 29.5, high: 34.0, low: 25.0, close: 32 },
  { month: "Mai", open: 33.8, high: 38.5, low: 28.0, close: 38 },
  { month: "Jun", open: 40.2, high: 46.0, low: 34.0, close: 45 },
  { month: "Jul", open: 48.5, high: 55.0, low: 41.0, close: 52 },
  { month: "Aoû", open: 53.2, high: 59.5, low: 46.0, close: 58 },
  { month: "Sep", open: 57.8, high: 64.0, low: 49.0, close: 67 },
  { month: "Oct", open: 65.0, high: 72.0, low: 56.0, close: 75 },
  { month: "Nov", open: 70.5, high: 78.0, low: 60.0, close: 82 },
  { month: "Déc", open: 82.0, high: 95.0, low: 72.0, close: 95 },
];

// Revenue by sector data
const sectorRevenueData = (() => {
  const map: Record<string, number> = {};
  projects.forEach((p) => {
    map[p.sector] = (map[p.sector] || 0) + p.revenue;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }));
})();

// Budget allocation data
const budgetAllocationData = (() => {
  const map: Record<string, number> = {};
  projects.forEach((p) => {
    map[p.sector] = (map[p.sector] || 0) + p.budget;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
})();

// Pipeline funnel data
const pipelineData = [
  { stage: "Identification", value: 120, fill: "#2B6CB0" },
  { stage: "Due Diligence", value: 85, fill: "#2B9EB3" },
  { stage: "Négociation", value: 52, fill: "#f5a524" },
  { stage: "Approbation", value: 30, fill: "#f7630c" },
  { stage: "Signature", value: 18, fill: "#13612e" },
];

// Radar data for top 4 projects
const radarData = [
  { metric: "ROI", "Nimba Iron": 79, "Lagos Real Estate": 50, "Accra Fintech": 60, "Solar Plant Dakar": 44 },
  { metric: "Budget", "Nimba Iron": 80, "Lagos Real Estate": 56, "Accra Fintech": 16, "Solar Plant Dakar": 32 },
  { metric: "Rentabilité", "Nimba Iron": 85, "Lagos Real Estate": 55, "Accra Fintech": 70, "Solar Plant Dakar": 50 },
  { metric: "Risque", "Nimba Iron": 60, "Lagos Real Estate": 45, "Accra Fintech": 35, "Solar Plant Dakar": 25 },
  { metric: "Durée", "Nimba Iron": 70, "Lagos Real Estate": 60, "Accra Fintech": 50, "Solar Plant Dakar": 65 },
  { metric: "Impact", "Nimba Iron": 90, "Lagos Real Estate": 65, "Accra Fintech": 55, "Solar Plant Dakar": 45 },
];

// Cost structure data
const costStructureData = projects.map((p) => ({
  name: p.name.length > 15 ? p.name.slice(0, 15) + "…" : p.name,
  budget: p.budget,
  cost: p.cost,
  overhead: Math.round(p.cost * 0.15),
}));

// Cumulative ROI by sector
const cumulativeROIData = [
  { month: "Jan", Mining: 5, Technology: 3, Energy: 2, Logistics: 1 },
  { month: "Fév", Mining: 12, Technology: 7, Energy: 5, Logistics: 3 },
  { month: "Mar", Mining: 20, Technology: 12, Energy: 9, Logistics: 6 },
  { month: "Avr", Mining: 30, Technology: 18, Energy: 14, Logistics: 10 },
  { month: "Mai", Mining: 42, Technology: 25, Energy: 20, Logistics: 15 },
  { month: "Jun", Mining: 55, Technology: 34, Energy: 27, Logistics: 21 },
  { month: "Jul", Mining: 65, Technology: 42, Energy: 35, Logistics: 28 },
  { month: "Aoû", Mining: 72, Technology: 50, Energy: 42, Logistics: 33 },
  { month: "Sep", Mining: 80, Technology: 58, Energy: 50, Logistics: 39 },
  { month: "Oct", Mining: 88, Technology: 67, Energy: 58, Logistics: 46 },
  { month: "Nov", Mining: 95, Technology: 76, Energy: 67, Logistics: 52 },
  { month: "Déc", Mining: 100, Technology: 85, Energy: 75, Logistics: 60 },
];

// Waterfall data
const waterfallData = [
  { name: "Budget Total", value: 0, budget: 230, adjustment: 0, revenue: 0 },
  { name: "Coûts Opér.", value: 0, budget: 0, adjustment: -184, revenue: 0 },
  { name: "Ajustements", value: 0, budget: 0, adjustment: 38, revenue: 0 },
  { name: "Revenus", value: 0, budget: 0, adjustment: 0, revenue: 344.1 },
];

// ─── Types ──────────────────────────────────────────────────────────────────

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ProjectItem {
  name: string;
  sector: string;
  budget: number;
  cost: number;
  revenue: number;
  roi: number;
  status: string;
  country: string;
  countryFlag?: string;
}

// ─── Animated Counter Hook ──────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;
    const startTime = performance.now();
    let rafId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, decimals]);

  return count;
}

// ─── Section Observer Hook ──────────────────────────────────────────────────

function useSectionObserver(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return activeSection;
}

// ─── ROI Simulator Logic ────────────────────────────────────────────────────

const sectorROI: Record<string, [number, number]> = {
  Mining: [60, 80],
  Energy: [35, 55],
  "Real Estate": [40, 60],
  Technology: [45, 65],
  Agriculture: [25, 40],
  Logistics: [25, 45],
};

const riskMultiplier: Record<string, number> = { Low: 0.85, Medium: 1.0, High: 1.2 };
const durationMultiplier: Record<number, number> = { 1: 0.7, 2: 0.85, 3: 1.0, 4: 1.1, 5: 1.15 };

function calculateROI(sector: string, budget: number, duration: number, risk: string) {
  const [minROI, maxROI] = sectorROI[sector] || [30, 50];
  const baseROI = (minROI + maxROI) / 2;
  const adjustedROI = baseROI * (riskMultiplier[risk] || 1) * (durationMultiplier[duration] || 1);
  const projectedRevenue = budget * (1 + adjustedROI / 100);
  const annualReturn = projectedRevenue / duration;
  return {
    projectedRevenue,
    projectedROI: Math.round(adjustedROI * 10) / 10,
    annualReturn: Math.round(annualReturn * 10) / 10,
    riskLabel: risk,
    riskColor: risk === "Low" ? "#13612e" : risk === "Medium" ? "#f5a524" : "#b82105",
  };
}

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-[#1A202C] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-semibold">{p.value}M€</span>
        </p>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Home() {
  const sectionIds = ["dashboard", "simulateur", "projets", "pipeline", "analytics", "temoignages", "tarifs", "contact", "reporting", "demo"];
  const activeSection = useSectionObserver(sectionIds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []); // mount detection for Recharts SSR safety

  // Dashboard counters
  const budgetCount = useAnimatedCounter(230, 2000);
  const revenueCount = useAnimatedCounter(344.1, 2500, 1);
  const roiCount = useAnimatedCounter(47.9, 2200, 1);
  const activeCount = useAnimatedCounter(6, 1500);
  const [dashVisible, setDashVisible] = useState(false);
  const dashRef = useRef<HTMLDivElement>(null);

  // Simulator state
  const [simName, setSimName] = useState("");
  const [simSector, setSimSector] = useState("Technology");
  const [simBudget, setSimBudget] = useState(20);
  const [simDuration, setSimDuration] = useState(3);
  const [simRisk, setSimRisk] = useState("Medium");
  const [showResults, setShowResults] = useState(false);

  // CSV import state
  const [importedProjects, setImportedProjects] = useState<ProjectItem[]>([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Projects filter state
  const [filterSector, setFilterSector] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Demo modal state
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");
  const [demoCompany, setDemoCompany] = useState("");
  const [demoPhone, setDemoPhone] = useState("");
  const [demoProjects, setDemoProjects] = useState("5");
  const [demoMessage, setDemoMessage] = useState("");
  const [demoStatus, setDemoStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastIdRef = useRef(0);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Dashboard visibility observer
  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setDashVisible(true);
    }, { threshold: 0.2 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Simulator results
  const simResults = useMemo(() => {
    if (!showResults) return null;
    return calculateROI(simSector, simBudget, simDuration, simRisk);
  }, [showResults, simSector, simBudget, simDuration, simRisk]);

  // Filtered projects (merge original + imported)
  const filteredProjects = useMemo(() => {
    const all = [...projects, ...importedProjects];
    return all
      .filter((p) => filterSector === "All" || p.sector === filterSector)
      .filter((p) => filterStatus === "All" || p.status === filterStatus)
      .filter((p) =>
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.roi - a.roi);
  }, [filterSector, filterStatus, searchQuery, importedProjects]);

  const handleCalculate = useCallback(() => { setShowResults(true); }, []);

  const scrollToSection = useCallback((href: string) => {
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  // CSV import handler
  const handleCSVImport = useCallback((file: File) => {
    setCsvFileName(file.name);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim().toLowerCase(),
      complete: (result) => {
        const requiredCols = ["name", "sector", "budget", "cost", "revenue", "roi", "status", "country"];
        const headers = Object.keys(result.data[0] || {});
        const missing = requiredCols.filter((c) => !headers.includes(c));
        if (missing.length > 0) {
          addToast(`Format invalide — colonnes manquantes: ${missing.join(", ")}`, "error");
          setCsvFileName("");
          return;
        }
        const parsed: ProjectItem[] = result.data
          .map((row) => ({
            name: String(row.name || "").trim(),
            sector: String(row.sector || "").trim(),
            budget: parseFloat(row.budget) || 0,
            cost: parseFloat(row.cost) || 0,
            revenue: parseFloat(row.revenue) || 0,
            roi: parseFloat(row.roi) || 0,
            status: String(row.status || "Active").trim(),
            country: String(row.country || "").trim(),
            countryFlag: String(row.country || "").trim().slice(0, 2).toUpperCase(),
          }))
          .filter((p) => p.name.length > 0);
        setImportedProjects(parsed);
        addToast(`${parsed.length} projets importés`, "success");
      },
      error: () => {
        addToast("Erreur lors du parsing du fichier CSV", "error");
        setCsvFileName("");
      },
    });
  }, [addToast]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) {
      handleCSVImport(file);
    } else {
      addToast("Seuls les fichiers .csv sont acceptés", "error");
    }
  }, [handleCSVImport, addToast]);

  // Contact form submit
  const handleContactSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("sending");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, email: contactEmail, company: contactCompany, phone: contactPhone, message: contactMessage, type: "contact" }),
      });
      const data = await res.json();
      if (data.success) {
        setContactStatus("success");
        addToast(data.message, "success");
        setContactName(""); setContactEmail(""); setContactCompany(""); setContactPhone(""); setContactMessage("");
        setTimeout(() => setContactStatus("idle"), 5000);
      } else {
        setContactStatus("error");
        addToast(data.message || "Erreur", "error");
        setTimeout(() => setContactStatus("idle"), 5000);
      }
    } catch {
      setContactStatus("error");
      addToast("Erreur de connexion", "error");
      setTimeout(() => setContactStatus("idle"), 5000);
    }
  }, [contactName, contactEmail, contactCompany, contactPhone, contactMessage, addToast]);

  // Demo modal submit
  const handleDemoSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoStatus("sending");
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: demoName, email: demoEmail, company: demoCompany, phone: demoPhone, message: demoMessage, type: "demo" }),
      });
      const data = await res.json();
      if (data.success) {
        setDemoStatus("success");
        addToast(data.message, "success");
        setTimeout(() => { setDemoModalOpen(false); setDemoStatus("idle"); setDemoName(""); setDemoEmail(""); setDemoCompany(""); setDemoPhone(""); setDemoProjects("5"); setDemoMessage(""); }, 2000);
      } else {
        setDemoStatus("error");
        addToast(data.message || "Erreur", "error");
        setTimeout(() => setDemoStatus("idle"), 5000);
      }
    } catch {
      setDemoStatus("error");
      addToast("Erreur de connexion", "error");
      setTimeout(() => setDemoStatus("idle"), 5000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoName, demoEmail, demoCompany, demoPhone, demoProjects, demoMessage, addToast]);

  // PDF report handler
  const handleDownloadReport = useCallback(() => {
    addToast("Rapport généré avec succès ! Téléchargement en cours...", "success");
  }, [addToast]);

  // Helpers
  const statusStyle = (status: string) => {
    switch (status) {
      case "Active": return "bg-[#13612e]/10 text-[#13612e] border-[#13612e]/30";
      case "Completed": return "bg-[#2B6CB0]/10 text-[#2B6CB0] border-[#2B6CB0]/30";
      case "Pending": return "bg-[#f5a524]/10 text-[#f5a524] border-[#f5a524]/30";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    }
  };

  const sectorIcon = (sector: string) => {
    switch (sector) {
      case "Mining": return <Hammer className="w-4 h-4" />;
      case "Energy": return <Zap className="w-4 h-4" />;
      case "Real Estate": return <Building2 className="w-4 h-4" />;
      case "Technology": return <Cpu className="w-4 h-4" />;
      case "Agriculture": return <Wheat className="w-4 h-4" />;
      case "Logistics": return <Truck className="w-4 h-4" />;
      default: return <ClipboardList className="w-4 h-4" />;
    }
  };

  const demoTimelineSteps: Array<{ step: string; title: string; desc: string; icon: React.ReactNode; color: string }> = [
    { step: "01", title: "Dashboard en Temps Réel", desc: "Vision globale des performances de vos projets avec KPIs dynamiques et graphiques interactifs", icon: <LayoutDashboard className="w-5 h-5" />, color: "bg-[#2B6CB0] text-white" },
    { step: "02", title: "Simulation Rapide", desc: "Simulez des investissements en quelques clics avec des projections basées sur les données sectorielles africaines", icon: <FlaskConical className="w-5 h-5" />, color: "bg-[#f5a524] text-white" },
    { step: "03", title: "Structure Investisseurs", desc: "Présentez vos projets avec des rapports professionnels générés automatiquement", icon: <Handshake className="w-5 h-5" />, color: "bg-[#2B6CB0] text-white" },
    { step: "04", title: "Connectable à Vos Données", desc: "Intégrez vos systèmes existants et connectez vos sources de données en temps réel", icon: <Link2 className="w-5 h-5" />, color: "bg-[#2B6CB0] text-white" },
  ];

  return (
    <main className="min-h-screen bg-[#F7FAFC] text-[#1A202C]">
      {/* ═══════════════════════════════════════════════════════════════════════
          TOAST NOTIFICATION SYSTEM
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium max-w-sm animate-[slideIn_0.3s_ease-out] ${
              toast.type === "success" ? "bg-gradient-to-r from-[#13612e] to-[#1a7a3a]" : "bg-gradient-to-r from-[#b82105] to-[#d42a0a]"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          DEMO MODAL
          ═══════════════════════════════════════════════════════════════════════ */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDemoModalOpen(false)} />
          <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setDemoModalOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-[#718096] cursor-pointer"><X className="w-4 h-4" /></button>
            <h3 className="text-2xl font-bold mb-2">Demander une Démo</h3>
            <p className="text-sm text-[#718096] mb-6">Remplissez le formulaire ci-dessous et nous vous contacterons sous 24h.</p>
            {demoStatus === "success" ? (
              <div className="text-center py-8">
                <Rocket className="w-12 h-12 mx-auto mb-4 text-[#2B6CB0]" />
                <p className="text-lg font-semibold text-[#13612e]">Demande envoyée !</p>
                <p className="text-sm text-[#718096] mt-2">Nous vous contacterons sous 24h.</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-[#718096] mb-1.5">Nom complet *</label>
                  <input required value={demoName} onChange={(e) => setDemoName(e.target.value)} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0]" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="block text-sm text-[#718096] mb-1.5">Email *</label>
                  <input required type="email" value={demoEmail} onChange={(e) => setDemoEmail(e.target.value)} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0]" placeholder="vous@entreprise.com" />
                </div>
                <div>
                  <label className="block text-sm text-[#718096] mb-1.5">Entreprise</label>
                  <input value={demoCompany} onChange={(e) => setDemoCompany(e.target.value)} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0]" placeholder="Nom de l&apos;entreprise" />
                </div>
                <div>
                  <label className="block text-sm text-[#718096] mb-1.5">Téléphone</label>
                  <input value={demoPhone} onChange={(e) => setDemoPhone(e.target.value)} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0]" placeholder="+225 XX XX XX XX" />
                </div>
                <div>
                  <label className="block text-sm text-[#718096] mb-1.5">Nombre de projets</label>
                  <select value={demoProjects} onChange={(e) => setDemoProjects(e.target.value)} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0] cursor-pointer">
                    <option value="1-5">1 à 5 projets</option>
                    <option value="5-15">5 à 15 projets</option>
                    <option value="15-50">15 à 50 projets</option>
                    <option value="50+">Plus de 50 projets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#718096] mb-1.5">Message</label>
                  <textarea value={demoMessage} onChange={(e) => setDemoMessage(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0] resize-none" placeholder="Décrivez vos besoins..." />
                </div>
                {demoStatus === "error" && <p className="text-sm text-[#b82105]">Erreur lors de l&apos;envoi. Veuillez réessayer.</p>}
                <button type="submit" disabled={demoStatus === "sending"} className="w-full py-3 bg-[#2B6CB0] hover:bg-[#215387] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#2B6CB0]/25 cursor-pointer disabled:opacity-50">
                  {demoStatus === "sending" ? "Envoi en cours..." : "Envoyer la Demande"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          1. FIXED NAVIGATION BAR
          ═══════════════════════════════════════════════════════════════════════ */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="InvestFlow Africa" width={36} height={36} className="rounded-lg" />
              <span className="text-lg font-bold tracking-tight">InvestFlow <span className="text-[#2B6CB0]">Africa</span></span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button key={item.href} onClick={() => scrollToSection(item.href)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${activeSection === item.href.slice(1) ? "bg-[#2B6CB0]/10 text-[#2B6CB0]" : "text-[#4A5568] hover:text-[#1A202C] hover:bg-[#2B6CB0]/5"}`}>
                  {item.label}
                </button>
              ))}
              <button onClick={() => setDemoModalOpen(true)} className="ml-3 px-5 py-2 bg-[#2B6CB0] hover:bg-[#215387] text-white text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer">
                Demander une Démo
              </button>
            </div>
            <button className="md:hidden p-2 text-[#4A5568] hover:text-[#1A202C] cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button key={item.href} onClick={() => scrollToSection(item.href)} className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeSection === item.href.slice(1) ? "bg-[#2B6CB0]/10 text-[#2B6CB0]" : "text-[#4A5568] hover:text-[#1A202C] hover:bg-[#2B6CB0]/5"}`}>
                  {item.label}
                </button>
              ))}
              <button onClick={() => setDemoModalOpen(true)} className="w-full mt-2 px-5 py-2 bg-[#2B6CB0] hover:bg-[#215387] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer">
                Demander une Démo
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. HERO SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0"><Image src="/images/hero-bg.png" alt="" fill className="object-cover" priority /></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A202C]/85 via-[#1A202C]/60 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#2B6CB0] via-[#13612e] to-[#2B6CB0] opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="gradient-border inline-flex">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1A202C]/40 border border-white/20 rounded-full text-white text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#48BB78] rounded-full animate-pulse" />
                Plateforme de Gestion d&apos;Investissements
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight text-white">
              Pilotage Intelligent de{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#63B3ED] to-[#68D391]">
                Vos Projets &amp; Investissements
              </span>{" "}
              en Afrique
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              Centralisez vos données, analysez la rentabilité et présentez vos projets aux investisseurs avec une plateforme professionnelle.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button onClick={() => scrollToSection("#dashboard")} className="w-full sm:w-auto px-8 py-3.5 bg-[#2B6CB0] hover:bg-[#215387] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#2B6CB0]/25 cursor-pointer">
                Accéder au Dashboard
              </button>
              <button onClick={() => setDemoModalOpen(true)} className="w-full sm:w-auto px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl border border-white/30 hover:border-white/50 backdrop-blur-sm transition-all duration-200 cursor-pointer">
                Voir la Démo
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {([
                { icon: <BarChart3 className="w-7 h-7 text-[#63B3ED]" />, title: "Suivre la performance", desc: "des projets en temps réel" },
                { icon: <DollarSign className="w-7 h-7 text-[#68D391]" />, title: "Analyser la rentabilité", desc: "calculs ROI automatisés" },
                { icon: <FlaskConical className="w-7 h-7 text-[#F6AD55]" />, title: "Simuler des investissements", desc: "projets financiers scénarios" },
                { icon: <Handshake className="w-7 h-7 text-[#B794F4]" />, title: "Présenter vos projets", desc: "aux investisseurs clés" },
              ] as { icon: React.ReactNode; title: string; desc: string }[]).map((f, i) => (
                <div key={i} className="p-5 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl hover:border-white/40 shadow-sm transition-all duration-300 card-hover">
                  <div className="mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-sm mb-1 text-white">{f.title}</h3>
                  <p className="text-gray-300 text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "230M€", label: "Budget Total" },
                { value: "8", label: "Projets" },
                { value: "6", label: "Pays Africains" },
                { value: "47.9%", label: "ROI Moyen" },
              ].map((s, i) => (
                <div key={i} className="text-center p-4 bg-white/8 backdrop-blur-md border border-white/15 rounded-xl shadow-sm animate-float">
                  <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAND */}
      <div className="relative py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-[#A0AEC0] uppercase tracking-widest mb-4 font-medium">Ils nous font confiance en Afrique</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-40">
            {["Nimba Ressources", "SIFCA Group", "Afrika Capital", "Sahel Ventures", "Ecobank", "Afreximbank"].map((name) => (
              <span key={name} className="text-lg sm:text-xl font-bold text-[#4A5568] tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. DASHBOARD SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="dashboard" className="py-24 relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7FAFC] to-white opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={dashRef}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Dashboard <span className="text-gradient-blue">Financier</span></h2>
            <p className="text-[#718096] max-w-xl mx-auto">Vue d&apos;ensemble de vos performances et indicateurs clés</p>
          </div>

          {/* KPI Cards */}
          {dashVisible && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="p-6 card-modern stat-card card-hover relative before:bg-[#2B6CB0]">
                <div className="relative z-10"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#2B6CB0]/10 flex items-center justify-center"><Briefcase className="w-5 h-5 text-[#2B6CB0]" /></div><span className="text-sm text-[#718096]">Budget Total</span></div>
                <div className="text-3xl font-bold animate-count">{budgetCount}M€</div>
                <p className="text-xs text-[#718096] mt-2">Enveloppe globale</p></div>
              </div>
              <div className="p-6 card-modern stat-card card-hover glow-green relative before:bg-[#13612e]">
                <div className="relative z-10"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#13612e]/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-[#13612e]" /></div><span className="text-sm text-[#718096]">Revenus Totaux</span></div>
                <div className="text-3xl font-bold text-[#13612e] animate-count">{revenueCount}M€</div>
                <p className="text-xs text-[#13612e]/70 mt-2">↑ 49.6% vs budget</p></div>
              </div>
              <div className="p-6 card-modern stat-card card-hover shadow-gold relative before:bg-[#f5a524]">
                <div className="relative z-10"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#f5a524]/10 flex items-center justify-center"><Zap className="w-5 h-5 text-[#f5a524]" /></div><span className="text-sm text-[#718096]">ROI Moyen</span></div>
                <div className="text-3xl font-bold text-[#f5a524] animate-count">{roiCount}%</div>
                <p className="text-xs text-[#f5a524]/70 mt-2">Rentabilité moyenne</p></div>
              </div>
              <div className="p-6 card-modern stat-card card-hover relative before:bg-[#2B6CB0]">
                <div className="relative z-10"><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-[#2B6CB0]/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-[#2B6CB0]" /></div><span className="text-sm text-[#718096]">Projets Actifs</span></div>
                <div className="text-3xl font-bold animate-count">{activeCount}<span className="text-lg text-[#718096]">/8</span></div>
                <p className="text-xs text-[#718096] mt-2">En cours de réalisation</p></div>
              </div>
            </div>
          )}

          {/* Charts Grid - Interactive Recharts */}
          {mounted && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* ROI par Projet - Horizontal Bar Chart */}
                <div className="p-6 card-modern glow-green">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#13612e]" />ROI par Projet</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={[...projects].sort((a, b) => b.roi - a.roi)} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                      <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: "#718096" }} />
                      <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: "#4A5568" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="roi" radius={[0, 6, 6, 0]} animationDuration={1500}>
                        {[...projects].sort((a, b) => b.roi - a.roi).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Tendances Mensuelles - Line Chart */}
                <div className="p-6 card-modern glow-blue">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2B6CB0]" />Tendances Mensuelles</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={monthlyData} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#718096" }} />
                      <YAxis unit="M€" tick={{ fontSize: 11, fill: "#718096" }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                      <Area type="monotone" dataKey="revenue" stroke="#2B6CB0" fill="#2B6CB0" fillOpacity={0.05} name="Revenus" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="budget" stroke="#13612e" strokeWidth={2} name="Budget" dot={false} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="cost" stroke="#f7630c" strokeWidth={2} name="Coûts" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Revenus par Secteur - Pie Chart */}
                <div className="p-6 card-modern shadow-gold">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f5a524]" />Revenus par Secteur</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={sectorRevenueData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        animationDuration={1200}
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      >
                        {sectorRevenueData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}M€`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Allocation Budget - Donut Chart */}
                <div className="p-6 card-modern glow-blue">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2B6CB0]" />Allocation Budget</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={budgetAllocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        animationDuration={1200}
                        label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        labelLine={{ strokeWidth: 1 }}
                      >
                        {budgetAllocationData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-sm font-bold" fill="#1A202C">
                        <tspan x="50%" dy="-0.5em" fontSize="11" fill="#718096">Total</tspan>
                        <tspan x="50%" dy="1.2em" fontSize="16" fontWeight="bold" fill="#2B6CB0">230M€</tspan>
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Candlestick - Composed Chart */}
              <div className="p-6 card-modern">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#b82105]" />Performance en Chandeliers</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <ComposedChart data={candlestickData} margin={{ left: 0, right: 20, top: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#718096" }} />
                    <YAxis domain={[0, 100]} unit="M€" tick={{ fontSize: 11, fill: "#718096" }} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const d = candlestickData.find((c) => c.month === label);
                      if (!d) return null;
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
                          <p className="font-semibold mb-1">{label}</p>
                          <p className="text-[#718096]">Ouvert: {d.open}M€</p>
                          <p className="text-[#13612e]">Haut: {d.high}M€</p>
                          <p className="text-[#b82105]">Bas: {d.low}M€</p>
                          <p className="font-semibold">Fermé: {d.close}M€</p>
                        </div>
                      );
                    }} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    {/* Wicks (high-low lines) */}
                    <Line type="monotone" dataKey="high" stroke="#718096" strokeWidth={1} dot={false} name="Haut" legendType="none" />
                    <Line type="monotone" dataKey="low" stroke="#718096" strokeWidth={1} dot={false} name="Bas" legendType="none" connectNulls={false} />
                    {/* Candle body */}
                    <Bar dataKey="close" name="Fermé" radius={[4, 4, 0, 0]} animationDuration={1500}>
                      {candlestickData.map((d, i) => (
                        <Cell key={i} fill={d.close >= d.open ? "#13612e" : "#b82105"} />
                      ))}
                    </Bar>
                    {/* Open marker */}
                    <Line type="monotone" dataKey="open" stroke="#f5a524" strokeWidth={2} dot={{ r: 3, fill: "#f5a524" }} name="Ouvert" activeDot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. ROI SIMULATOR SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="simulateur" className="py-24 relative bg-[#F7FAFC]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7FAFC] via-[#EDF2F7] to-[#F7FAFC] opacity-60" />
        <div className="absolute inset-0 opacity-[0.05]"><Image src="/images/africa-map.png" alt="" fill className="object-cover" /></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simulateur <span className="text-gradient-blue">ROI</span></h2>
            <p className="text-[#718096] max-w-xl mx-auto">Estimez la rentabilité de votre prochain investissement</p>
          </div>

          {/* CSV Import Zone */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Import CSV</h3>
              {csvFileName && <span className="text-xs text-[#13612e] font-medium bg-[#13612e]/10 px-2.5 py-1 rounded-full">{csvFileName}</span>}
            </div>
            <div className="gradient-border">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => csvInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging ? "border-[#2B6CB0] bg-[#2B6CB0]/5" : "border-gray-300 bg-white hover:border-[#2B6CB0]/50"
              }`}
            >
              <input ref={csvInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCSVImport(f); }} />
              <div className="mb-3">{csvFileName ? <CheckCircle2 className="w-10 h-10 text-[#13612e] mx-auto" /> : <FileSpreadsheet className="w-10 h-10 text-[#718096] mx-auto" />}</div>
              <p className="text-sm text-[#718096]">
                {csvFileName ? (
                  <span className="text-[#13612e] font-medium">{csvFileName} — Cliquez pour changer</span>
                ) : (
                  <>Glissez-déposez votre fichier CSV ici ou <span className="text-[#2B6CB0] font-medium">parcourez</span></>
                )}
              </p>
              <p className="text-xs text-[#718096] mt-1">Colonnes requises: name, sector, budget, cost, revenue, roi, status, country</p>
            </div>
            </div>

            {/* Imported projects preview */}
            {importedProjects.length > 0 && (
              <div className="mt-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm max-h-48 overflow-y-auto">
                <p className="text-sm font-semibold mb-2 text-[#13612e]">{importedProjects.length} projets importés</p>
                <table className="w-full text-xs">
                  <thead><tr className="text-left text-[#718096] border-b border-gray-200">
                    <th className="pb-2 pr-2">Nom</th><th className="pb-2 pr-2">Secteur</th><th className="pb-2 pr-2">Budget</th><th className="pb-2 pr-2">ROI</th><th className="pb-2">Pays</th>
                  </tr></thead>
                  <tbody>
                    {importedProjects.map((p) => (
                      <tr key={p.name} className="border-b border-gray-100">
                        <td className="py-1.5 pr-2 font-medium">{p.name}</td>
                        <td className="py-1.5 pr-2">{p.sector}</td>
                        <td className="py-1.5 pr-2">{p.budget}M€</td>
                        <td className="py-1.5 pr-2 font-bold" style={{ color: p.roi >= 60 ? "#13612e" : p.roi >= 40 ? "#f5a524" : "#b82105" }}>{p.roi}%</td>
                        <td className="py-1.5">{p.country}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Simulator Form */}
            <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Paramètres du Projet</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-[#718096] mb-2">Nom du projet</label>
                  <input type="text" value={simName} onChange={(e) => setSimName(e.target.value)} placeholder="Ex: Mine de Cobalt Katanga" className="w-full px-4 py-3 bg-[#F7FAFC] border border-gray-300 rounded-xl text-[#1A202C] placeholder-gray-400 focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-[#718096] mb-2">Secteur</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {sectors.map((s) => (
                      <button key={s} onClick={() => setSimSector(s)} className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${simSector === s ? "bg-[#2B6CB0]/10 border-[#2B6CB0]/50 text-[#2B6CB0]" : "bg-[#F7FAFC] border-gray-300 text-[#718096] hover:border-gray-400"}`}>
                        {sectorIcon(s)} {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#718096] mb-2">Budget: <span className="text-[#2B6CB0] font-semibold">{simBudget}M€</span></label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={simBudget}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1 && val <= 100) setSimBudget(val);
                      }}
                      className="w-28 px-3 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm text-center font-semibold focus:outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0]/50 transition-colors"
                    />
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={simBudget}
                      onChange={(e) => setSimBudget(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs text-[#718096] font-medium whitespace-nowrap">M€</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#718096] mt-1"><span>1M€</span><span>50M€</span><span>100M€</span></div>
                </div>
                <div>
                  <label className="block text-sm text-[#718096] mb-2">Durée (années)</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <button key={d} onClick={() => setSimDuration(d)} className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${simDuration === d ? "bg-[#2B6CB0]/10 border-[#2B6CB0]/50 text-[#2B6CB0]" : "bg-[#F7FAFC] border-gray-300 text-[#718096] hover:border-gray-400"}`}>
                        {d} an{d > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#718096] mb-2">Niveau de Risque</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Low", "Medium", "High"].map((r) => (
                      <button key={r} onClick={() => setSimRisk(r)} className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${simRisk === r ? (r === "Low" ? "bg-[#13612e]/10 border-[#13612e]/50 text-[#13612e]" : r === "Medium" ? "bg-[#f5a524]/10 border-[#f5a524]/50 text-[#f5a524]" : "bg-[#b82105]/10 border-[#b82105]/50 text-[#b82105]") : "bg-[#F7FAFC] border-gray-300 text-[#718096] hover:border-gray-400"}`}>
                        <span className="inline-flex items-center gap-1.5">{r === "Low" ? <div className="w-2.5 h-2.5 rounded-full bg-[#13612e]" /> : r === "Medium" ? <div className="w-2.5 h-2.5 rounded-full bg-[#f5a524]" /> : <div className="w-2.5 h-2.5 rounded-full bg-[#b82105]" />} {r === "Low" ? "Faible" : r === "Medium" ? "Moyen" : "Élevé"}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleCalculate} className="w-full py-4 btn-primary cursor-pointer text-lg">
                  <FlaskConical className="w-5 h-5 inline mr-2" /> Calculer le ROI
                </button>
              </div>
            </div>

            {/* Results Card */}
            <div className="p-8 card-modern bg-gradient-to-br from-white to-[#F7FAFC]/80 min-h-[400px] flex flex-col justify-center">
              {simResults ? (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">Résultats de Simulation</h3>
                    {simName && <p className="text-[#718096] text-sm">{simName}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-[#13612e]/10 border border-[#13612e]/20 rounded-xl text-center">
                      <p className="text-xs text-[#718096] mb-1">Revenu Projeté</p>
                      <p className="text-2xl font-bold text-[#13612e]">{simResults.projectedRevenue.toFixed(1)}M€</p>
                    </div>
                    <div className="p-5 bg-[#f5a524]/10 border border-[#f5a524]/20 rounded-xl text-center">
                      <p className="text-xs text-[#718096] mb-1">ROI Projeté</p>
                      <p className="text-2xl font-bold text-[#f5a524]">{simResults.projectedROI}%</p>
                    </div>
                    <div className="p-5 bg-[#2B6CB0]/10 border border-[#2B6CB0]/20 rounded-xl text-center">
                      <p className="text-xs text-[#718096] mb-1">Rendement Annuel</p>
                      <p className="text-2xl font-bold text-[#2B6CB0]">{simResults.annualReturn.toFixed(1)}M€</p>
                    </div>
                    <div className="p-5 border rounded-xl text-center" style={{ background: `${simResults.riskColor}10`, borderColor: `${simResults.riskColor}33` }}>
                      <p className="text-xs text-[#718096] mb-1">Niveau de Risque</p>
                      <p className="text-2xl font-bold" style={{ color: simResults.riskColor }}>{simResults.riskLabel === "Low" ? "Faible" : simResults.riskLabel === "Medium" ? "Moyen" : "Élevé"}</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-[#F7FAFC] rounded-xl">
                    <div className="flex justify-between text-sm mb-2"><span className="text-[#718096]">Rentabilité</span><span className="text-[#2B6CB0] font-semibold">{simResults.projectedROI}%</span></div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(simResults.projectedROI, 100)}%`, background: simResults.projectedROI > 60 ? "linear-gradient(to right, #13612e, #228B22)" : simResults.projectedROI > 35 ? "linear-gradient(to right, #f5a524, #FBBF24)" : "linear-gradient(to right, #b82105, #EF4444)" }} />
                    </div>
                  </div>
                  <p className="text-xs text-[#718096] text-center mt-4">* Résultats estimatifs basés sur les moyennes sectorielles africaines</p>
                </div>
              ) : (
                <div className="text-center text-[#718096]">
                  <FlaskConical className="w-16 h-16 mx-auto mb-4 opacity-20 text-[#718096]" />
                  <p className="text-lg font-medium mb-2">Simulation Prête</p>
                  <p className="text-sm">Configurez les paramètres et cliquez sur &quot;Calculer le ROI&quot; pour voir les résultats</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. PROJECTS SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="projets" className="py-24 relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7FAFC] to-white opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Portefeuille <span className="text-gradient-blue">de Projets</span></h2>
            <p className="text-[#718096] max-w-xl mx-auto">Tous vos investissements africains en un coup d&apos;œil</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un projet ou pays..." className="w-full pl-10 pr-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-[#1A202C] placeholder-gray-400 focus:outline-none focus:border-[#2B6CB0] text-sm transition-colors" />
            </div>
            <select value={filterSector} onChange={(e) => setFilterSector(e.target.value)} className="px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-[#1A202C] text-sm focus:outline-none focus:border-[#2B6CB0] cursor-pointer transition-colors appearance-none min-w-[160px]">
              <option value="All">Tous les secteurs</option>
              {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-[#1A202C] text-sm focus:outline-none focus:border-[#2B6CB0] cursor-pointer transition-colors appearance-none min-w-[160px]">
              <option value="All">Tous les statuts</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <p className="text-sm text-[#718096] mb-6">{filteredProjects.length} projet{filteredProjects.length !== 1 ? "s" : ""} trouvé{filteredProjects.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.name} className="p-6 card-modern card-hover group">
                <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                  <Image src={projectImages[project.name] || "/images/projects/logistics.png"} alt={project.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-2 left-2 text-xs text-white/80 font-medium">{project.country}</span>
                  <span className={`absolute top-2 right-2 px-2.5 py-1 text-xs font-medium rounded-full border ${statusStyle(project.status)}`}>{project.status}</span>
                </div>
                <div className="mb-3">
                  <h3 className="font-semibold text-lg group-hover:text-[#2B6CB0] transition-colors">{project.name}</h3>
                  <p className="text-sm text-[#718096] flex items-center gap-1.5 mt-1"><span>{sectorIcon(project.sector)}</span>{project.country} ({project.countryFlag || "?"})</p>
                </div>
                <div className="mb-4"><span className="px-3 py-1 text-xs font-medium bg-[#EDF2F7] text-[#2D3748] rounded-full border border-gray-300">{project.sector}</span></div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div><p className="text-xs text-[#718096]">Budget</p><p className="font-semibold">{project.budget}M€</p></div>
                  <div><p className="text-xs text-[#718096]">Revenu</p><p className="font-semibold text-[#13612e]">{project.revenue}M€</p></div>
                  <div><p className="text-xs text-[#718096]">ROI</p><p className="font-bold" style={{ color: project.roi >= 60 ? "#13612e" : project.roi >= 40 ? "#f5a524" : "#b82105" }}>{project.roi}%</p></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-[#718096] mb-1.5"><span>Utilisation budget</span><span>{Math.round((project.cost / project.budget) * 100)}%</span></div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full animate-progress transition-all duration-1000" style={{ width: `${(project.cost / project.budget) * 100}%`, background: `linear-gradient(to right, ${project.cost / project.budget > 0.9 ? '#b82105' : project.cost / project.budget > 0.7 ? '#f5a524' : '#13612e'}, ${project.cost / project.budget > 0.9 ? '#EF4444' : project.cost / project.budget > 0.7 ? '#FBBF24' : '#228B22'})` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <div className="text-center py-16 text-[#718096]"><Search className="w-12 h-12 mx-auto mb-4 text-[#718096]/50" /><p className="text-lg">Aucun projet trouvé</p><p className="text-sm mt-2">Essayez de modifier vos filtres</p></div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. REPORTING SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="reporting" className="py-24 relative bg-[#F7FAFC]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7FAFC] via-[#EDF2F7] to-[#F7FAFC] opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Rapport <span className="text-gradient-blue">Investisseurs</span></h2>
            <p className="text-[#718096] max-w-xl mx-auto">Aperçu du rapport professionnel pour vos investisseurs</p>
          </div>
          <div className="p-8 card-modern">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2"><Image src="/logo.png" alt="InvestFlow" width={24} height={24} className="rounded" />InvestFlow Africa — Rapport Q4 2024</h3>
                <p className="text-sm text-[#718096] mt-1">Généré automatiquement • Confidentiel</p>
              </div>
              <button onClick={handleDownloadReport} className="mt-4 sm:mt-0 px-5 py-2.5 bg-[#2B6CB0]/10 border border-[#2B6CB0]/30 text-[#2B6CB0] text-sm font-medium rounded-xl hover:bg-[#2B6CB0]/20 transition-colors cursor-pointer flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Télécharger le Rapport PDF
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[{ label: "Total Projets", value: "8", color: "text-[#2B6CB0]" }, { label: "Budget Total", value: "230M€", color: "text-[#13612e]" }, { label: "ROI Moyen", value: "47.9%", color: "text-[#f5a524]" }, { label: "Revenus Totaux", value: "344.1M€", color: "text-[#13612e]" }].map((s, i) => (
                <div key={i} className="p-4 bg-[#F7FAFC] rounded-xl border border-gray-200"><p className="text-xs text-[#718096] mb-1">{s.label}</p><p className={`text-xl font-bold ${s.color}`}>{s.value}</p></div>
              ))}
            </div>
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4">Tableau de Performance</h4>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white"><tr className="text-left text-[#718096] border-b border-gray-200">
                    <th className="pb-3 pr-4 font-medium">Projet</th><th className="pb-3 pr-4 font-medium">Pays</th><th className="pb-3 pr-4 font-medium">Secteur</th><th className="pb-3 pr-4 font-medium text-right">Budget</th><th className="pb-3 pr-4 font-medium text-right">Revenu</th><th className="pb-3 font-medium text-right">ROI</th>
                  </tr></thead>
                  <tbody>
                    {[...projects].sort((a, b) => b.roi - a.roi).map((p) => (
                      <tr key={p.name} className="border-b border-gray-100 hover:bg-[#F7FAFC] transition-colors">
                        <td className="py-3 pr-4 font-medium">{p.name}</td>
                        <td className="py-3 pr-4 text-[#718096]">{p.country} ({p.countryFlag})</td>
                        <td className="py-3 pr-4"><span className="px-2 py-0.5 text-xs bg-[#EDF2F7] rounded-full border border-gray-300">{sectorIcon(p.sector)} {p.sector}</span></td>
                        <td className="py-3 pr-4 text-right">{p.budget}M€</td>
                        <td className="py-3 pr-4 text-right text-[#13612e]">{p.revenue}M€</td>
                        <td className="py-3 text-right font-bold" style={{ color: p.roi >= 60 ? "#13612e" : p.roi >= 40 ? "#f5a524" : "#b82105" }}>{p.roi}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="p-6 bg-[#2B6CB0]/5 border border-[#2B6CB0]/20 rounded-xl">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-[#f5a524]" /> Points Clés</h4>
              <ul className="space-y-3">
                {[
                  "Le secteur minier affiche le ROI le plus élevé à 79%, avec le projet Nimba Iron Mine en Guinée",
                  "Les projets technologiques présentent un ROI moyen de 55%, confirmant le potentiel digital africain",
                  "6 projets sur 8 sont actuellement actifs, démontrant une exécution solide",
                  "Le budget total de 230M€ génère 344.1M€ en revenus, soit un rendement global exceptionnel",
                  "Les projets au Nigeria et Cameroun représentent 35% du budget total mais 34% des revenus",
                ].map((insight, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#2D3748]"><span className="w-1.5 h-1.5 rounded-full bg-[#2B6CB0] mt-1.5 flex-shrink-0" />{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. DEMO / PITCH SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="demo" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0"><Image src="/images/demo-bg.png" alt="" fill className="object-cover" /></div>
        <div className="absolute inset-0 bg-[#1A202C]/88" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Démonstration <span className="text-gradient-gold">Interactive</span></h2>
            <p className="text-gray-300 max-w-xl mx-auto">Découvrez comment InvestFlow Africa peut transformer votre gestion d&apos;investissements</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2B6CB0] via-[#f5a524] to-[#2B6CB0]" />
                {demoTimelineSteps.map((item, i) => (
                  <div key={i} className="relative mb-10 last:mb-0">
                    <div className={`absolute -left-5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${item.color}`}>{item.step}</div>
                    <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm card-hover">
                      <div className="flex items-start gap-4">{item.icon}<div><h4 className="font-semibold text-lg mb-1">{item.title}</h4><p className="text-sm text-[#718096] leading-relaxed">{item.desc}</p></div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:sticky lg:top-24">
              <div className="pricing-popular p-8">
                <div className="text-center mb-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2B6CB0]/10 border border-[#2B6CB0]/20 rounded-full text-[#2B6CB0] text-xs font-medium mb-4 shimmer"><Rocket className="w-3.5 h-3.5" /> Offre Spéciale</span>
                  <h3 className="text-2xl font-bold mb-2">Offre Pilote</h3>
                  <div className="flex items-baseline justify-center gap-1"><span className="text-4xl font-bold text-[#2B6CB0]">15 000€</span></div>
                  <p className="text-sm text-[#718096] mt-2">Pour 3 mois d&apos;accompagnement</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {["Configuration complète de la plateforme", "Import de vos projets existants", "Formation de votre équipe", "Support dédié 24/7", "Rapports personnalisés", "Simulateur ROI illimité"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#2D3748]"><svg className="w-5 h-5 text-[#2B6CB0] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{f}</li>
                  ))}
                </ul>
                <button onClick={() => setDemoModalOpen(true)} className="w-full py-4 bg-[#2B6CB0] hover:bg-[#215387] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#2B6CB0]/25 cursor-pointer text-lg">
                  Demander une Démo
                </button>
              </div>
            </div>
          </div>
          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
            <div className="flex items-start gap-4"><Lightbulb className="w-7 h-7 flex-shrink-0 text-[#F6AD55]" /><p className="text-gray-200 leading-relaxed text-sm sm:text-base">Ce que je vous montre est une version simplifiée, mais on peut aller vers une plateforme complète connectée à vos systèmes.</p></div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          8. PIPELINE & RISK DASHBOARD
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="pipeline" className="py-24 relative bg-gradient-to-b from-white via-[#EDF2F7] to-white">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7FAFC]/60 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pipeline &amp; <span className="text-gradient-blue">Risques</span></h2>
            <p className="text-[#718096] max-w-xl mx-auto">Suivez votre pipeline d&apos;investissements et évaluez les risques projet par projet</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pipeline Funnel - Interactive Bar Chart */}
            <div className="p-6 card-modern glow-green">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#13612e]" />Pipeline d&apos;Investissement</h3>
              {mounted && (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={pipelineData} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                    <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#4A5568" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#718096" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1500}>
                      {pipelineData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Risk Assessment Matrix */}
            <div className="p-6 card-modern">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f5a524]" />Matrice de Risque</h3>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white"><tr className="text-left text-[#718096] border-b border-gray-200">
                    <th className="pb-3 pr-3 font-medium">Projet</th><th className="pb-3 pr-3 font-medium">Niveau</th><th className="pb-3 pr-3 font-medium text-center">Score</th><th className="pb-3 pr-3 font-medium">Volatilité</th><th className="pb-3 font-medium">Mitigation</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { name: "Nimba Iron Mine", risk: "Medium", score: "6/10", volatility: "Moderate", mitigation: "Hedging" },
                      { name: "Solar Plant Dakar", risk: "Low", score: "3/10", volatility: "Low", mitigation: "Diversif." },
                      { name: "Lagos Real Estate", risk: "Medium", score: "5/10", volatility: "Moderate", mitigation: "Insurance" },
                      { name: "Abidjan Tech Hub", risk: "Low", score: "2/10", volatility: "Low", mitigation: "Agile" },
                      { name: "Kinshasa Agri-Business", risk: "High", score: "8/10", volatility: "High", mitigation: "Insurance" },
                      { name: "Accra Fintech", risk: "Low", score: "2/10", volatility: "Low", mitigation: "Regulation" },
                      { name: "Nairobi Logistics", risk: "Medium", score: "6/10", volatility: "Moderate", mitigation: "Partners" },
                      { name: "Douala Port Extension", risk: "Medium", score: "5/10", volatility: "Moderate", mitigation: "Hedging" },
                    ].map((r) => (
                      <tr key={r.name} className="border-b border-gray-100 hover:bg-[#F7FAFC] transition-colors even:bg-[#F7FAFC]/50">
                        <td className="py-2.5 pr-3 font-medium text-[#1A202C] whitespace-nowrap">{r.name}</td>
                        <td className="py-2.5 pr-3">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${r.risk === "Low" ? "bg-[#13612e]/10 text-[#13612e] border-[#13612e]/30" : r.risk === "Medium" ? "bg-[#f5a524]/10 text-[#f5a524] border-[#f5a524]/30" : "bg-[#b82105]/10 text-[#b82105] border-[#b82105]/30"}`}>{r.risk}</span>
                        </td>
                        <td className="py-2.5 pr-3 text-center"><span className={`font-semibold ${r.risk === "Low" ? "text-[#13612e]" : r.risk === "Medium" ? "text-[#f5a524]" : "text-[#b82105]"}`}>{r.score}</span></td>
                        <td className="py-2.5 pr-3 text-[#718096]">{r.volatility}</td>
                        <td className="py-2.5 text-[#718096]">{r.mitigation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          9. ADVANCED ANALYTICS
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="analytics" className="py-24 relative bg-[#F7FAFC]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7FAFC] via-[#EDF2F7] to-[#F7FAFC] opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Analyses <span className="text-gradient-blue">Avancées</span></h2>
            <p className="text-[#718096] max-w-xl mx-auto">Visualisations multidimensionnelles pour une compréhension approfondie de vos investissements</p>
          </div>
          {mounted && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar Multidimensional */}
              <div className="p-6 card-modern glow-blue card-hover">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2B6CB0]" />Analyse Multidimensionnelle</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="#EDF2F7" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#4A5568" }} />
                    <Radar name="Nimba Iron" dataKey="Nimba Iron" stroke="#2B6CB0" fill="#2B6CB0" fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Lagos RE" dataKey="Lagos Real Estate" stroke="#13612e" fill="#13612e" fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="Accra Fintech" dataKey="Accra Fintech" stroke="#f5a524" fill="#f5a524" fillOpacity={0.1} strokeWidth={2} />
                    <Radar name="Solar Dakar" dataKey="Solar Plant Dakar" stroke="#b82105" fill="#b82105" fillOpacity={0.1} strokeWidth={2} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Stacked Bar Cost Structure */}
              <div className="p-6 card-modern shadow-gold card-hover">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f5a524]" />Structure des Coûts</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costStructureData} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#4A5568" }} />
                    <YAxis unit="M€" tick={{ fontSize: 11, fill: "#718096" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Bar dataKey="budget" stackId="a" name="Budget" fill="#2B6CB0" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="cost" stackId="a" name="Coûts" fill="#f7630c" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="overhead" stackId="a" name="Overhead" fill="#f5a524" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Area Cumulative ROI */}
              <div className="p-6 card-modern glow-green card-hover">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#13612e]" />ROI Cumulatif</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cumulativeROIData} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#718096" }} />
                    <YAxis unit="M€" tick={{ fontSize: 11, fill: "#718096" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Area type="monotone" dataKey="Mining" stackId="1" stroke="#2B6CB0" fill="#2B6CB0" fillOpacity={0.4} name="Mining" />
                    <Area type="monotone" dataKey="Technology" stackId="1" stroke="#13612e" fill="#13612e" fillOpacity={0.4} name="Technology" />
                    <Area type="monotone" dataKey="Energy" stackId="1" stroke="#f5a524" fill="#f5a524" fillOpacity={0.4} name="Energy" />
                    <Area type="monotone" dataKey="Logistics" stackId="1" stroke="#b82105" fill="#b82105" fillOpacity={0.4} name="Logistics" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Waterfall Budget to Revenue */}
              <div className="p-6 card-modern card-hover">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#2B6CB0]" />Pont Budget → Revenus</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={waterfallData} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4A5568" }} />
                    <YAxis unit="M€" tick={{ fontSize: 11, fill: "#718096" }} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
                          <p className="font-semibold mb-1">{label}</p>
                          {payload.map((p, i) => p.value !== 0 && <p key={i} style={{ color: p.color }}>{p.name}: {p.value}M€</p>)}
                        </div>
                      );
                    }} />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                    <Bar dataKey="budget" name="Budget" fill="#2B6CB0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="adjustment" name="Ajustement" radius={[4, 4, 0, 0]}>
                      {waterfallData.map((d, i) => (
                        <Cell key={i} fill={d.adjustment >= 0 ? "#13612e" : "#b82105"} />
                      ))}
                    </Bar>
                    <Bar dataKey="revenue" name="Revenus" fill="#13612e" radius={[4, 4, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          10. TESTIMONIALS
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="temoignages" className="py-24 relative bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F7FAFC] to-white opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ce que disent nos <span className="text-gradient-blue">Investisseurs</span></h2>
            <p className="text-[#718096] max-w-xl mx-auto">Retours d&apos;expérience de nos partenaires en Afrique</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Aminata Diallo", title: "PDG, Afrika Capital Group", quote: "InvestFlow Africa a transformé notre façon de gérer nos portefeuilles. La visibilité en temps réel et les rapports automatiques nous font gagner un temps précieux.", avatar: "/images/avatar-woman-1.png", gradient: "from-[#2B6CB0] to-[#13612e]" },
              { name: "Jean-Marc Kouassi", title: "Directeur Investissements, SIFCA Group", quote: "Le simulateur ROI est remarquable. Il nous permet d&apos;évaluer rapidement de nouvelles opportunités et de prendre des décisions éclairées en quelques minutes.", avatar: "/images/avatar-man-1.png", gradient: "from-[#f5a524] to-[#f7630c]" },
              { name: "Fatima Alhousseini", title: "Partner, Sahel Ventures", quote: "La présentation aux investisseurs est devenue un jeu d&apos;enfant. Les graphiques interactifs et les données en temps réel impressionnent à chaque réunion.", avatar: "/images/avatar-woman-2.png", gradient: "from-[#7C5CFC] to-[#2B9EB3]" },
            ].map((t, i) => (
              <div key={i} className="p-6 card-modern card-hover">
                <span className="quote-mark block mb-4 select-none">&ldquo;</span>
                <p className="text-sm text-[#4A5568] leading-relaxed mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-offset-2 ring-[#2B6CB0]/30 shadow-md">
                    <Image src={t.avatar} alt={t.name} width={48} height={48} className="object-cover" />
                  </div>
                  <div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-[#718096]">{t.title}</p></div>
                </div>
                <div className="flex gap-0.5 mt-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4 text-[#f5a524]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          11. PRICING
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="tarifs" className="py-24 relative bg-[#F7FAFC]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7FAFC] via-[#EDF2F7] to-[#F7FAFC] opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Nos <span className="text-gradient-blue">Tarifs</span></h2>
            <p className="text-[#718096] max-w-xl mx-auto">Des formules adaptées à votre taille et vos besoins</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {[
              {
                name: "Starter", price: "5 000€", period: "/mois", desc: "Pour les PME débutant en gestion d&apos;investissements",
                features: ["5 projets maximum", "Tableau de bord basique", "Rapports mensuels", "Support par email"],
                cta: "Demander une Démo", popular: false,
              },
              {
                name: "Professional", price: "15 000€", period: "/mois", desc: "Pour les entreprises avec un portefeuille actif",
                features: ["Projets illimités", "Dashboard avancé", "Simulateur ROI", "Rapports personnalisés", "Support prioritaire", "API d&apos;intégration"],
                cta: "Choisir Professional", popular: true,
              },
              {
                name: "Enterprise", price: "Sur mesure", period: "", desc: "Pour les grands groupes et fonds d&apos;investissement",
                features: ["Projets illimités", "Analytics avancés", "Multi-utilisateurs", "SAML/SSO", "SLA garanti", "Déploiement on-premise"],
                cta: "Nous Contacter", popular: false,
              },
            ].map((plan, i) => (
              <div key={i} className={`p-8 flex flex-col ${plan.popular ? "pricing-popular" : "card-modern"}`}>
                {plan.popular && <div className="absolute -mt-8 ml-8 px-3 py-1 bg-[#2B6CB0] text-white text-xs font-semibold rounded-full">POPULAIRE</div>}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-3xl font-bold ${plan.popular ? "text-[#2B6CB0]" : "text-[#1A202C]"}`}>{plan.price}</span>
                  <span className="text-[#718096] text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-[#718096] mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm"><svg className="w-4 h-4 text-[#2B6CB0] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{f}</li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    if (plan.name === "Enterprise") { scrollToSection("#contact"); }
                    else { setDemoModalOpen(true); }
                  }}
                  className={`w-full py-3 font-semibold rounded-xl transition-all duration-200 cursor-pointer ${plan.popular ? "btn-primary" : "bg-[#F7FAFC] border border-gray-300 text-[#1A202C] hover:bg-[#EDF2F7]"}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          12. CONTACT SECTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 relative bg-white">
        <div className="absolute inset-0 dot-pattern" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Contactez-<span className="text-gradient-blue">nous</span></h2>
            <p className="text-[#718096] max-w-xl mx-auto">Notre équipe est à votre disposition pour répondre à vos questions</p>
          </div>

          {contactStatus === "success" && (
            <div className="mb-6 p-4 bg-[#13612e]/10 border border-[#13612e]/30 rounded-xl text-[#13612e] text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Message envoyé avec succès ! Nous vous répondrons sous 24h.
            </div>
          )}
          {contactStatus === "error" && (
            <div className="mb-6 p-4 bg-[#b82105]/10 border border-[#b82105]/30 rounded-xl text-[#b82105] text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Erreur lors de l&apos;envoi. Veuillez réessayer.
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 p-8 card-modern">
              <h3 className="text-xl font-semibold mb-6">Envoyez-nous un message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-[#718096] mb-1.5">Nom complet *</label>
                    <input required value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0]" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#718096] mb-1.5">Email *</label>
                    <input required type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0]" placeholder="vous@entreprise.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-[#718096] mb-1.5">Entreprise</label>
                    <input value={contactCompany} onChange={(e) => setContactCompany(e.target.value)} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0]" placeholder="Nom de l&apos;entreprise" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#718096] mb-1.5">Téléphone</label>
                    <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0]" placeholder="+225 XX XX XX XX" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#718096] mb-1.5">Message *</label>
                  <textarea required value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows={5} className="w-full px-4 py-2.5 bg-[#F7FAFC] border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#2B6CB0] resize-none" placeholder="Décrivez votre besoin..." />
                </div>
                <button type="submit" disabled={contactStatus === "sending"} className="w-full py-3.5 btn-primary cursor-pointer disabled:opacity-50">
                  {contactStatus === "sending" ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="p-6 card-modern">
                <h4 className="font-semibold mb-4">Informations de Contact</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#2B6CB0]/10 flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-[#2B6CB0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                    <div><p className="text-sm text-[#718096]">Email</p><p className="text-sm font-medium">contact@investflow.africa</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#13612e]/10 flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-[#13612e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>
                    <div><p className="text-sm text-[#718096]">Téléphone</p><p className="text-sm font-medium">+225 01 23 45 67 89</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#f5a524]/10 flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-[#f5a524]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>
                    <div><p className="text-sm text-[#718096]">Adresse</p><p className="text-sm font-medium">Cocody Riviera, Abidjan, Côte d&apos;Ivoire</p></div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-[#2B6CB0]/5 border border-[#2B6CB0]/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#2B6CB0]/10 flex items-center justify-center"><svg className="w-4 h-4 text-[#2B6CB0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                  <h4 className="font-semibold">Réponse sous 24h</h4>
                </div>
                <p className="text-sm text-[#718096]">Notre équipe s&apos;engage à répondre à toutes les demandes dans un délai de 24 heures ouvrées.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          13. FOOTER
          ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="relative bg-gradient-to-br from-[#0F1A2E] to-[#1A202C] text-white py-16">
        <div className="section-divider w-full absolute top-0 left-0 right-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="InvestFlow" width={32} height={32} className="rounded-lg" />
                <span className="text-lg font-bold">InvestFlow <span className="text-[#2B6CB0]">Africa</span></span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Plateforme de gestion d&apos;investissements pour le marché africain.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                {navItems.slice(0, 5).map((item) => (
                  <li key={item.href}><button onClick={() => scrollToSection(item.href)} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">{item.label}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                {["Dashboard Financier", "Simulateur ROI", "Rapports Investisseurs", "Analytics Avancés", "API Intégration"].map((s) => (
                  <li key={s}><span className="text-sm text-gray-400">{s}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>contact@investflow.africa</li>
                <li>+225 01 23 45 67 89</li>
                <li>Abidjan, Côte d&apos;Ivoire</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
            © 2024 InvestFlow Africa. Tous droits réservés.
            <span className="block mt-2 text-xs text-gray-600">Powered by Nimba Ressources Company</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
