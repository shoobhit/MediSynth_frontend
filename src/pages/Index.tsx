
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-radial from-accent via-background to-background">
      <header className="w-full p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="MediSynth" className="h-8 w-8" />
          <span className="text-xl font-bold">MediSynth</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold mb-6">
          <span className="text-primary">Medi</span>Synth
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Modern AI-powered medical report generation
          for healthcare professionals
        </p>
        <div className="flex gap-4">
          <Link to="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </main>

      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
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

      <footer className="py-8 text-center text-sm text-gray-500">
        <p>© 2025 MediSynth. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;
