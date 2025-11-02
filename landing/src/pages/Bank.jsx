import React, { useState } from 'react';
import { Menu, X, ChevronRight, Brain, TrendingUp, Users, Network, Check, Star, ArrowRight, CreditCard, Building2 } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md flex items-center justify-center">
              <span className="text-white font-semibold text-sm">FP</span>
            </div>
            <span className="text-xl font-light text-gray-900 tracking-tight">FinPlatform</span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <a href="#home" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="#features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#products" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Products</a>
            <a href="#about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">About</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Login</button>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2.5 rounded-md text-sm hover:shadow-lg transition-all">
              Sign Up
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-6 py-6 space-y-4">
            <a href="#home" className="block text-sm text-gray-600">Home</a>
            <a href="#features" className="block text-sm text-gray-600">Features</a>
            <a href="#products" className="block text-sm text-gray-600">Products</a>
            <a href="#about" className="block text-sm text-gray-600">About</a>
            <a href="#contact" className="block text-sm text-gray-600">Contact</a>
            <button className="block w-full text-left text-sm text-gray-600">Login</button>
            <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2.5 rounded-md text-sm">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-light text-gray-900 leading-tight tracking-tight">
                Empowering Financial Inclusion
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                AI-powered lending solutions designed to democratize access to financial services for underserved communities.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-4 rounded-md text-sm hover:shadow-lg transition-all flex items-center justify-center">
                Get Started
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </button>
              <button className="bg-white text-gray-900 px-8 py-4 rounded-md border border-gray-200 text-sm hover:border-blue-400 transition-all">
                Learn More
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
              <div>
                <div className="text-3xl font-light text-gray-900 mb-1">50K+</div>
                <div className="text-sm text-gray-500">Loans Disbursed</div>
              </div>
              <div>
                <div className="text-3xl font-light text-gray-900 mb-1">₹500Cr+</div>
                <div className="text-sm text-gray-500">Capital Deployed</div>
              </div>
              <div>
                <div className="text-3xl font-light text-gray-900 mb-1">95%</div>
                <div className="text-sm text-gray-500">Approval Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 space-y-6 border border-blue-100">
              <div className="flex items-center justify-between pb-6 border-b border-blue-100">
                <span className="text-sm text-gray-900 font-medium">Credit Analysis</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-xs text-gray-600">Live</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-blue-100">
                  <span className="text-sm text-gray-600">Credit Score</span>
                  <span className="text-sm text-gray-900 font-medium">750</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-blue-100">
                  <span className="text-sm text-gray-600">Risk Assessment</span>
                  <span className="text-sm text-cyan-600 font-medium">Low Risk</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-blue-100">
                  <span className="text-sm text-gray-600">Decision Time</span>
                  <span className="text-sm text-gray-900 font-medium">2.3 seconds</span>
                </div>
                <div className="flex items-center justify-between py-4">
                  <span className="text-sm text-gray-600">Approval Status</span>
                  <Check className="text-cyan-500" size={18} />
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-md text-sm hover:shadow-lg transition-all">
                View Full Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Brain size={24} />,
      title: "AI Underwriting",
      description: "Advanced machine learning algorithms analyze alternative data for instant credit decisions."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Credit Builder Loans",
      description: "Structured programs designed to establish and improve credit scores systematically."
    },
    {
      icon: <Users size={24} />,
      title: "Targeted Programs",
      description: "Specialized lending for rural entrepreneurs and women-led businesses."
    },
    {
      icon: <Network size={24} />,
      title: "Phygital Network",
      description: "Seamless integration of physical touchpoints with digital platforms."
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Built for Financial Inclusion
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Cutting-edge technology designed to create opportunities for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-lg border border-blue-100 hover:border-blue-400 transition-all h-full">
                <div className="text-blue-600 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Products = () => {
  return (
    <section id="products" className="py-24 bg-gradient-to-br from-cyan-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Our Products
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Comprehensive solutions for lenders and borrowers.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg overflow-hidden border border-blue-100 shadow-sm">
            <div className="h-64 bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <CreditCard className="text-white" size={64} strokeWidth={1.5} />
            </div>
            <div className="p-10">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Credit Builder Loan</h3>
              <p className="text-gray-600 mb-8 leading-relaxed font-light">
                Help individuals with limited credit history establish a strong financial foundation through structured repayment programs.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="text-cyan-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-gray-600">No existing credit score required</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-cyan-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-gray-600">Flexible repayment terms</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-cyan-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-gray-600">Report to all major credit bureaus</span>
                </li>
              </ul>
              <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center">
                Learn More <ArrowRight className="ml-2" size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden border border-blue-100 shadow-sm">
            <div className="h-64 bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Building2 className="text-white" size={64} strokeWidth={1.5} />
            </div>
            <div className="p-10">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Aggregator Portal</h3>
              <p className="text-gray-600 mb-8 leading-relaxed font-light">
                Connect multiple lending partners through our intelligent aggregator platform. Streamline operations and expand reach instantly.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="text-cyan-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-gray-600">Multi-lender integration</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-cyan-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-gray-600">Real-time analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-cyan-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
                  <span className="text-sm text-gray-600">Automated compliance checks</span>
                </li>
              </ul>
              <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center">
                Learn More <ArrowRight className="ml-2" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Small Business Owner",
      text: "The Credit Builder Loan helped me establish my credit score from scratch. Within 6 months, I secured funding for expanding my business."
    },
    {
      name: "Rajesh Kumar",
      role: "Rural Entrepreneur",
      text: "Their phygital approach made it easy for me to access financial services despite being in a remote area."
    },
    {
      name: "Anita Desai",
      role: "Women's Cooperative Head",
      text: "We've helped over 200 women access credit and start their own businesses through this platform."
    }
  ];

  const partners = ["HDFC Bank", "ICICI Bank", "Axis Bank", "SBI", "Kotak Mahindra", "YES Bank"];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600 font-light">
            Real stories from people building their financial future.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-lg border border-blue-100">
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-blue-500 fill-current" size={16} />
                ))}
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed font-light text-sm">
                "{testimonial.text}"
              </p>
              <div>
                <div className="font-medium text-gray-900 text-sm">{testimonial.name}</div>
                <div className="text-xs text-gray-500 mt-1">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-center text-sm text-gray-500 mb-8 uppercase tracking-wider">Our Partners</h3>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {partners.map((partner, index) => (
              <div key={index} className="text-gray-400 font-light text-sm">
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-500 to-cyan-400">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-light text-white mb-6 tracking-tight">
          Ready to Transform Financial Inclusion?
        </h2>
        <p className="text-lg text-blue-50 mb-12 font-light">
          Join thousands building a more inclusive financial ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-md text-sm hover:shadow-lg transition-all">
            Request a Demo
          </button>
          <button className="bg-transparent text-white border border-white px-8 py-4 rounded-md text-sm hover:bg-white hover:text-blue-600 transition-all">
            Start Today
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-md flex items-center justify-center">
                <span className="text-white font-semibold text-sm">FP</span>
              </div>
              <span className="text-xl font-light text-gray-900 tracking-tight">FinPlatform</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed font-light max-w-sm">
              Empowering financial inclusion through innovative AI-powered lending solutions.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Features</a></li>
              <li><a href="#products" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Products</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Blog</a></li>
              <li><a href="#contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Terms</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2025 FinPlatform. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="min-h-screen antialiased">
      <Navbar />
      <Hero />
      <Features />
      <Products />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default App;