
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  useEffect(() => {
    // Animation functions
    const createAnimatedBackground = () => {
      const container = document.querySelector('.animated-background');
      if (!container) return;
      
      // Clear any existing elements
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      // Create medical-themed floating elements
      for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        
        // Randomly choose element type
        const elementType = Math.floor(Math.random() * 4);
        if (elementType === 0) {
          element.innerHTML = '❤️'; // Heart
          element.classList.add('heart');
        } else if (elementType === 1) {
          element.innerHTML = '🧬'; // DNA
          element.classList.add('dna');
        } else if (elementType === 2) {
          element.innerHTML = '💊'; // Pill
          element.classList.add('pill');
        } else {
          element.innerHTML = '🩺'; // Stethoscope
          element.classList.add('stethoscope');
        }
        
        // Set random position and animation duration
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;
        element.style.animationDuration = `${15 + Math.random() * 25}s`;
        element.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(element);
      }
    };
    
    createAnimatedBackground();
    // Re-create the animation when window is resized
    window.addEventListener('resize', createAnimatedBackground);
    
    return () => {
      window.removeEventListener('resize', createAnimatedBackground);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-radial from-accent via-background to-background relative overflow-hidden">
      <div className="animated-background absolute inset-0 z-0 pointer-events-none" />
      
      <header className="w-full p-4 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="MediSynth" className="h-8 w-8 logo-pulse" />
          <span className="text-xl font-bold">MediSynth</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="animate-fade-in transition-all duration-300 hover:bg-primary/20">Login</Button>
          </Link>
          <Link to="/signup">
            <Button className="animate-fade-in transition-all duration-300 hover:scale-105">Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <h1 className="text-5xl font-bold mb-6 animate-scale-in">
          <span className="text-primary">Medi</span>Synth
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in">
          Modern AI-powered medical report generation
          for healthcare professionals
        </p>
        <div className="flex gap-4 animate-fade-in">
          <Link to="/signup">
            <Button size="lg" className="form-button">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="transition-all duration-300 hover:scale-105">
              Sign In
            </Button>
          </Link>
        </div>
      </main>

      <section className="py-16 px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
          Powerful Medical Report Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <FeatureCard
            title="AI-Powered Analysis"
            description="Advanced machine learning algorithms analyze medical images with high accuracy"
          />
          <FeatureCard
            title="Structured Reports"
            description="Automatically generate professional, structured medical reports"
          />
          <FeatureCard
            title="Secure & Compliant"
            description="HIPAA-compliant platform ensures patient data is always protected"
          />
          <FeatureCard
            title="Time-Saving"
            description="Reduce report generation time by up to 80% compared to manual methods"
          />
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-500 relative z-10">
        <p>© 2025 MediSynth. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg animate-scale-in">
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;
