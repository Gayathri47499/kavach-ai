"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  Copy,
  Check,
  FileText,
  Globe,
  UploadCloud,
  X,
  ExternalLink,
  Sparkles,
  Info,
  Key,
  Shield,
  Smartphone,
  Flame,
} from "lucide-react";
import { LANGUAGES, UI_TRANSLATIONS, EMERGENCY_STEPS } from "../lib/constants";
import { SCAM_SAMPLES } from "../lib/samples";

export default function Home() {
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("text"); // 'text' | 'image'
  const [inputText, setInputText] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [imageMimeType, setImageMimeType] = useState("");
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isKeyMissing, setIsKeyMissing] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setError("Image size exceeds 6MB. Please upload a smaller screenshot.");
      return;
    }

    setError(null);
    setImageName(file.name);
    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setInputText("");
    setImageBase64("");
    setImageMimeType("");
    setImageName("");
    setResult(null);
    setError(null);
    setIsKeyMissing(false);
  };

  const handleSelectSample = (sample) => {
    setActiveTab("text");
    setInputText(sample.text);
    setLang(sample.lang || "en");
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (activeTab === "text" && !inputText.trim()) {
      setError("Please enter or paste the suspicious message text.");
      return;
    }
    if (activeTab === "image" && !imageBase64) {
      setError("Please upload a screenshot first.");
      return;
    }

    setLoading(true);
    setError(null);
    setIsKeyMissing(false);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: activeTab === "text" ? inputText : "",
          imageBase64: activeTab === "image" ? imageBase64 : "",
          imageMimeType: activeTab === "image" ? imageMimeType : "",
          language: lang,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.isKeyMissing) {
          setIsKeyMissing(true);
        }
        throw new Error(data.error || "Failed to analyze message.");
      }

      setResult(data.data);
    } catch (err) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Banner / Navigation */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                {t.appTitle}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-medium">
                v1.0
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400">{t.appSubtitle}</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-gray-900/80 p-1.5 rounded-xl border border-gray-800">
          <Globe className="w-4 h-4 text-gray-400 ml-1.5" />
          <span className="text-xs text-gray-400 hidden sm:inline">{t.chooseLang}</span>
          <div className="flex gap-1">
            {LANGUAGES.map((item) => (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  lang === item.code
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.flag}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* API Key Missing Alert Callout */}
      {isKeyMissing && (
        <div className="mt-6 p-4 rounded-xl bg-amber-950/50 border border-amber-600/60 text-amber-200 flex items-start gap-3">
          <Key className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold text-amber-300">Action Required: Google Gemini API Key Missing</p>
            <p className="mt-1 text-amber-200/90">
              Open your project folder, open <code className="bg-black/50 px-1 py-0.5 rounded">.env.local</code>, and
              paste your free key: <code className="bg-black/50 px-1 py-0.5 rounded">GEMINI_API_KEY=&quot;your_key&quot;</code>.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-cyan-400 underline font-medium hover:text-cyan-300"
            >
              Get Free Gemini API Key from Google AI Studio <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Input Form */}
      <section className="mt-6 glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl">
        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-gray-900/90 rounded-xl max-w-md border border-gray-800 mb-4">
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition ${
              activeTab === "text"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            {t.tabText}
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition ${
              activeTab === "image"
                ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/30"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            {t.tabImage}
          </button>
        </div>

        {/* Input Area: Text */}
        {activeTab === "text" && (
          <div className="space-y-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.textPlaceholder}
              rows={5}
              className="w-full bg-gray-950/70 border border-gray-800 rounded-xl p-3.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition resize-y font-sans"
            />
          </div>
        )}

        {/* Input Area: Screenshot Upload */}
        {activeTab === "image" && (
          <div className="space-y-4">
            {!imageBase64 ? (
              <label className="border-2 border-dashed border-gray-700 hover:border-cyan-500/60 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-950/40 hover:bg-gray-900/50 transition group">
                <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-cyan-400 transition mb-2" />
                <span className="text-sm font-medium text-gray-200 group-hover:text-cyan-300">
                  {t.uploadTitle}
                </span>
                <span className="text-xs text-gray-500 mt-1 text-center max-w-sm">
                  {t.uploadSubtitle}
                </span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-gray-950 p-2 max-w-md mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageBase64}
                  alt="Screenshot preview"
                  className="w-full max-h-72 object-contain rounded-lg"
                />
                <button
                  onClick={() => {
                    setImageBase64("");
                    setImageName("");
                  }}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="p-2 text-center text-xs text-gray-400 truncate">{imageName}</div>
              </div>
            )}
          </div>
        )}

        {/* Quick Test Samples */}
        <div className="mt-4 pt-4 border-t border-gray-800/80">
          <p className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {t.samplesTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {SCAM_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className="text-xs px-2.5 py-1 rounded-lg bg-gray-800/70 hover:bg-gray-700/80 border border-gray-700/70 text-gray-300 hover:text-white transition"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-700 text-red-200 text-xs sm:text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition shadow-lg ${
              loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold shadow-cyan-500/20"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                {t.analyzingBtn}
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-black" />
                {t.analyzeBtn}
              </>
            )}
          </button>

          {(inputText || imageBase64 || result) && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition"
            >
              {t.clearBtn}
            </button>
          )}
        </div>
      </section>

      {/* Analysis Result Section */}
      {result && (
        <section className="mt-8 space-y-6 animate-fadeIn">
          {/* Main Verdict Card */}
          <div
            className={`p-6 rounded-2xl border ${
              result.verdict === "SCAM"
                ? "bg-red-950/40 border-red-500/70 shadow-2xl shadow-red-500/10"
                : result.verdict === "SUSPICIOUS"
                ? "bg-amber-950/40 border-amber-500/70 shadow-2xl shadow-amber-500/10"
                : "bg-emerald-950/40 border-emerald-500/70 shadow-2xl shadow-emerald-500/10"
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {result.verdict === "SCAM" && (
                  <div className="p-3 rounded-xl bg-red-600 text-white">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                )}
                {result.verdict === "SUSPICIOUS" && (
                  <div className="p-3 rounded-xl bg-amber-500 text-black">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                )}
                {result.verdict === "SAFE" && (
                  <div className="p-3 rounded-xl bg-emerald-500 text-black">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h2
                    className={`text-2xl font-black tracking-tight ${
                      result.verdict === "SCAM"
                        ? "text-red-400"
                        : result.verdict === "SUSPICIOUS"
                        ? "text-amber-300"
                        : "text-emerald-300"
                    }`}
                  >
                    {result.verdict === "SCAM"
                      ? t.verdictScam
                      : result.verdict === "SUSPICIOUS"
                      ? t.verdictSuspicious
                      : t.verdictSafe}
                  </h2>
                  <p className="text-sm font-semibold text-gray-300 mt-0.5">
                    {t.scamType}:{" "}
                    <span className="text-white bg-gray-900/80 px-2 py-0.5 rounded border border-gray-700">
                      {result.scam_type}
                    </span>
                  </p>
                </div>
              </div>

              {/* Confidence / Risk Meter */}
              <div className="w-full md:w-56 bg-gray-950/80 p-3 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-400">{t.riskScore}</span>
                  <span
                    className={`font-black ${
                      result.confidence_score > 70
                        ? "text-red-400"
                        : result.confidence_score > 35
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {result.confidence_score}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      result.confidence_score > 70
                        ? "bg-gradient-to-r from-red-600 to-rose-400"
                        : result.confidence_score > 35
                        ? "bg-gradient-to-r from-amber-500 to-yellow-300"
                        : "bg-gradient-to-r from-emerald-600 to-teal-300"
                    }`}
                    style={{ width: `${result.confidence_score}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-200 leading-relaxed">
              <span className="font-semibold text-cyan-300">{t.summaryTitle}: </span>
              {result.summary}
            </div>
          </div>

          {/* Grid: Red Flags & Extracted Suspects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Red Flags Card */}
            <div className="glass-panel p-5 rounded-2xl border border-gray-800">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-red-400" />
                {t.redFlagsTitle}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
                {result.red_flags?.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suspect Entities */}
            <div className="glass-panel p-5 rounded-2xl border border-gray-800">
              <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                {t.suspectsTitle}
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-400 block text-xs">Phone Numbers:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {result.extracted_entities?.phone_numbers?.length ? (
                      result.extracted_entities.phone_numbers.map((phone, i) => (
                        <span key={i} className="px-2 py-1 bg-red-950/60 border border-red-800 text-red-300 rounded font-mono">
                          {phone}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">None detected</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block text-xs">Suspicious Links / URLs:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1 font-mono break-all">
                    {result.extracted_entities?.links_urls?.length ? (
                      result.extracted_entities.links_urls.map((link, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-900 border border-amber-800/80 text-amber-300 rounded text-xs">
                          {link}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">None detected</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 block text-xs">UPI IDs / Payment Handles:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1 font-mono">
                    {result.extracted_entities?.upi_ids?.length ? (
                      result.extracted_entities.upi_ids.map((upi, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-950/60 border border-purple-800 text-purple-300 rounded">
                          {upi}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">None detected</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Golden Hour Action Plan */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-800">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-amber-400" />
              {t.emergencyTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-300">
              {result.emergency_actions?.map((action, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 flex items-start gap-2">
                  <span className="text-amber-400 font-bold">{idx + 1}.</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official 1930 & cybercrime.gov.in Complaint Generator */}
          <div className="glass-panel-glow p-5 sm:p-6 rounded-2xl border border-cyan-500/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  {t.reportTitle}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Pre-formatted official statement ready to file on cybercrime.gov.in or report to 1930.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(result.cybercrime_complaint_draft)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t.copiedToast : t.copyReportBtn}
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-gray-950 border border-gray-800 text-xs sm:text-sm text-gray-200 font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {result.cybercrime_complaint_draft}
            </pre>

            {/* Quick Action Dial & Portal Links */}
            <div className="mt-4 pt-4 border-t border-gray-800/80 flex flex-wrap gap-3">
              <a
                href="tel:1930"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition"
              >
                <PhoneCall className="w-4 h-4" />
                {t.call1930Btn}
              </a>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-cyan-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-gray-700 transition"
              >
                <ExternalLink className="w-4 h-4" />
                {t.visitPortalBtn}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Cyber Security Quick Reference Footer */}
      <footer className="mt-12 pt-6 border-t border-gray-800/80 text-xs text-gray-500 text-center space-y-2">
        <p className="max-w-xl mx-auto">{t.footerText}</p>
        <p className="text-[11px] text-gray-600">
          Dial <code className="text-cyan-400 bg-gray-900 px-1 py-0.5 rounded">*#21#</code> to check for call/SMS forwarding. Never scan QR codes to receive funds.
        </p>
      </footer>
    </main>
  );
}
