import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/moving-border';
import { Microscope, FileText, Lock, Stopwatch } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    // Animation functions for medical diagram background
    const createAnimatedBackground = () => {
      const container = document.querySelector('.animated-background');
      if (!container) return;
      
      // Clear any existing elements
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      // Add the main rotating medical diagram
      const medicalDiagram = document.createElement('div');
      medicalDiagram.className = 'medical-diagram';
      
      // Create an image element for the medical diagram
      const diagramImg = document.createElement('img');
      diagramImg.src = '/lovable-uploads/c3c1277a-5c1f-4589-b12d-7e9aa62a214f.png';
      diagramImg.alt = 'Medical Diagram';
      diagramImg.className = 'w-full h-full object-contain';
      
      medicalDiagram.appendChild(diagramImg);
      container.appendChild(medicalDiagram);
      
      // Create additional floating medical elements
      const medicalElements = ['test-tube', 'microscope', 'stethoscope', 'dna'];
      
      for (let i = 0; i < 10; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        
        // Randomly choose element type
        const elementType = medicalElements[Math.floor(Math.random() * medicalElements.length)];
        
        // Add specific medical icon based on type
        if (elementType === 'test-tube') {
          element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-test-tube"><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></svg>';
          element.classList.add('test-tube');
        } else if (elementType === 'microscope') {
          element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-microscope"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2Z"/><path d="M12 9a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1"/></svg>';
          element.classList.add('microscope');
        } else if (elementType === 'stethoscope') {
          element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-stethoscope"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>';
          element.classList.add('stethoscope');
        } else {
          element.innerHTML = '🧬';
          element.classList.add('dna');
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
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      <header className="w-full p-4 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Microscope className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">MediSynth</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button borderRadius="0.5rem" className="bg-white/10 backdrop-blur-sm border-neutral-200/10">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button borderRadius="0.5rem" className="bg-primary/10 backdrop-blur-sm hover:bg-primary/20">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <h1 className="text-5xl font-bold mb-6">
          <span className="text-primary">Medi</span>Synth
        </h1>
        <div className="text-xl mb-8 max-w-2xl">
          <span className="font-semibold text-primary">Professional</span>
          <span className="text-secondary">
            {" "}medical report generation for healthcare professionals
          </span>
        </div>
        <div className="flex gap-4">
          <Link to="/signup">
            <Button borderRadius="0.75rem" className="bg-white/10 backdrop-blur-sm">
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button 
              borderRadius="0.75rem"
              className="bg-primary/10 backdrop-blur-sm hover:bg-primary/20"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </main>

      <section className="py-16 px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Medical Report Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <FeatureCard
            icon={<Microscope className="h-10 w-10 text-primary mb-4" />}
            title="AI-Powered Analysis"
            description="Advanced machine learning algorithms analyze medical images with high accuracy"
          />
          <FeatureCard
            icon={<FileText className="h-10 w-10 text-primary mb-4" />}
            title="Structured Reports"
            description="Automatically generate professional, structured medical reports"
          />
          <FeatureCard
            icon={<Lock className="h-10 w-10 text-primary mb-4" />}
            title="Secure & Compliant"
            description="HIPAA-compliant platform ensures patient data is always protected"
          />
          <FeatureCard
            icon={<Stopwatch className="h-10 w-10 text-primary mb-4" />}
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

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string; description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex flex-col items-center">
      {icon}
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default Index;
