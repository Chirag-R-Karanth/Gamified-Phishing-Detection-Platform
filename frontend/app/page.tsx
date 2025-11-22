'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="text-4xl group-hover:scale-110 transition-transform">🎯</div>
              <span className="text-2xl font-black text-white tracking-tight">
                Phish<span className="gradient-text-vibrant">Guard</span>
              </span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-6 py-2.5 text-white font-medium hover:text-purple-300 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 hover:from-purple-500 hover:to-pink-500"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className={`relative z-10 max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-purple-200 text-sm font-medium mb-8 border border-purple-400/30 hover:border-purple-400/50 transition-all">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            🚀 Interactive Cybersecurity Training Platform
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
            Master{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text animate-gradient">
              Phishing Detection
            </span>
            <br />
            <span className="text-5xl md:text-6xl lg:text-7xl">
              Protect Your Team
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Train your organization to identify and combat phishing attacks through 
            <span className="text-purple-300 font-semibold"> realistic scenarios</span>, 
            earn badges, and become cybersecurity experts.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-6 justify-center flex-wrap mb-20">
            <Link
              href="/register"
              className="group px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-3 animate-glow"
            >
              Start Training Free
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="px-10 py-5 glass text-white rounded-2xl font-bold text-lg border-2 border-white/30 hover:border-white/50 hover:bg-white/10 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-24">
            {[
              { num: '6+', label: 'Training Scenarios', color: 'from-blue-400 to-blue-600' },
              { num: '5', label: 'Achievement Badges', color: 'from-purple-400 to-purple-600' },
              { num: '100%', label: 'Hands-On Learning', color: 'from-pink-400 to-pink-600' }
            ].map((stat, i) => (
              <div key={i} className="text-center hover:scale-110 transition-transform duration-300 cursor-pointer">
                <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2`}>
                  {stat.num}
                </div>
                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-20">
          {[
            {
              icon: '🎮',
              title: 'Gamified Learning',
              desc: 'Earn XP, unlock levels, and collect badges as you master phishing detection.',
              gradient: 'from-violet-600 to-purple-600'
            },
            {
              icon: '📧',
              title: 'Realistic Scenarios',
              desc: 'Practice with real-world phishing emails from PayPal, Amazon, Microsoft & more.',
              gradient: 'from-purple-600 to-pink-600'
            },
            {
              icon: '🏆',
              title: 'Compete & Excel',
              desc: 'Climb leaderboards and become your organization\'s top cyber defender.',
              gradient: 'from-pink-600 to-red-600'
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative glass-dark rounded-3xl p-8 hover:scale-105 transition-all duration-500 card-hover cursor-pointer overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className="relative z-10">
                <div className="text-6xl mb-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 mt-20 border-t border-white/10">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © 2025 PhishGuard. Protecting organizations one click at a time. 🛡️
          </p>
        </div>
      </div>
    </div>
  );
}
