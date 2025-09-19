"use client";

import { Target, Eye, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">About RimCart</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          RimCart is your trusted e-commerce platform, designed to make online
          shopping simple, fast, and reliable.
          <br /> <br />
          We connect sellers and buyers with innovative technology, providing a
          smooth experience from product discovery to checkout.
        </p>
      </div>

      {/* 3 Cards */}
      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <Target className="w-10 h-10 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-3">Our Mission</h2>
          <p className="text-slate-600">
            To empower businesses and customers by making online commerce
            accessible and efficient for everyone.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <Eye className="w-10 h-10 text-emerald-600 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-3">Our Vision</h2>
          <p className="text-slate-600">
            To become the leading marketplace in the region, driven by trust,
            technology, and innovation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <Heart className="w-10 h-10 text-rose-600 mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-3">Our Values</h2>
          <p className="text-slate-600">
            Transparency, customer satisfaction, and continuous improvement guide
            everything we do.
          </p>
        </div>
      </div>
    </div>
  );
}
