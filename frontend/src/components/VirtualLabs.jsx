import { useState } from 'react';

export default function VirtualLabs() {
  const [activeLab, setActiveLab] = useState('onion-peel');
  const [currentStep, setCurrentStep] = useState('theory');
  const [simStep, setSimStep] = useState(0);

  const labs = {
    'onion-peel': {
      name: 'Onion Peel Cell Observation',
      theory: 'Onion epidermal cells are rectangular plant cells ideal for microscopy. Iodine stains the starch-containing nucleus, making cell structures visible.',
      procedure: ['Peel thin layer from onion inner side', 'Place on glass slide', 'Add 1 drop iodine solution', 'Cover with coverslip', 'Observe under microscope'],
      viva: [
        { q: 'What stains the nucleus?', a: 'Iodine solution' },
        { q: 'Cell shape observed?', a: 'Rectangular' },
        { q: 'Purpose of coverslip?', a: 'Protect sample, even pressure' }
      ]
    },
    'dna-extract': {
      name: 'Strawberry DNA Extraction',
      theory: 'DNA is extracted by breaking cell walls, removing proteins/lipids, then precipitating DNA with cold alcohol.',
      procedure: ['Mash strawberry with detergent/salt', 'Filter liquid through cheesecloth', 'Add cold ethanol', 'Spool white DNA strands', 'Dry and observe'],
      viva: [
        { q: 'What breaks cell membranes?', a: 'Detergent' },
        { q: 'DNA precipitates in?', a: 'Cold alcohol' },
        { q: 'DNA appears?', a: 'White sticky strands' }
      ]
    }
  };

  const lab = labs[activeLab];
  const isSimulating = currentStep === 'simulation';

  const LabSimulation = ({ labName }) => {
    const steps = labs[labName].procedure;
    
    return (
      <div className="h-80 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.sin(i * 0.5) * 200 + 400}px`,
                top: `${Math.cos(i * 0.3) * 200 + 200}px`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between text-white">
          {/* Lab Title */}
          <div>
            <h4 className="text-2xl font-bold mb-2">{lab.name}</h4>
            <div className="flex gap-2 mb-4">
              {steps.map((step, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i <= simStep ? 'bg-emerald-400 scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Interactive Simulation Area */}
          <div className="flex-1 flex items-center justify-center">
            {simStep === 0 && activeLab === 'onion-peel' && (
              <div className="text-center">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 animate-pulse" />
                <p>Peel onion layer 👆 Click Next</p>
              </div>
            )}
            {simStep === 1 && activeLab === 'onion-peel' && (
              <div className="text-center">
                <div className="w-32 h-20 bg-yellow-300/30 border-4 border-yellow-400 rounded-lg mx-auto mb-4" />
                <p>Slide with peel ready</p>
              </div>
            )}
            {simStep === 2 && activeLab === 'onion-peel' && (
              <div className="text-center">
                <div className="w-32 h-20 bg-orange-400/50 border-4 border-orange-500 rounded-lg mx-auto mb-4 animate-pulse" />
                <p>Iodine stain added ✨</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setSimStep(Math.max(0, simStep - 1))}
              className="flex-1 bg-white/20 hover:bg-white/30 px-6 py-2 rounded-xl transition backdrop-blur-sm"
              disabled={simStep === 0}
            >
              Previous
            </button>
            <button
              onClick={() => setSimStep(Math.min(steps.length - 1, simStep + 1))}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 px-6 py-2 rounded-xl font-semibold transition backdrop-blur-sm"
            >
              {simStep === steps.length - 1 ? 'Finish' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-8">
        <h2 className="text-3xl font-bold text-emerald-700 mb-4">🧪 Virtual Labs</h2>
        <p className="text-gray-600 max-w-2xl">
          Interactive simulations aligned with NCERT curriculum. Theory → Procedure → Simulation → Assessment.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Lab Selector */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-3">
            <button
              onClick={() => { setActiveLab('onion-peel'); setCurrentStep('theory'); }}
              className={`w-full p-4 rounded-xl border-2 transition-all ${activeLab === 'onion-peel' ? 'border-emerald-500 bg-emerald-50 shadow-lg' : 'border-gray-200 hover:border-emerald-300'}`}
            >
              <div className="font-semibold text-emerald-800">Onion Peel Cells</div>
              <div className="text-sm text-gray-600 mt-1">Class 8-10 Biology</div>
            </button>
            <button
              onClick={() => { setActiveLab('dna-extract'); setCurrentStep('theory'); }}
              className={`w-full p-4 rounded-xl border-2 transition-all ${activeLab === 'dna-extract' ? 'border-emerald-500 bg-emerald-50 shadow-lg' : 'border-gray-200 hover:border-emerald-300'}`}
            >
              <div className="font-semibold text-emerald-800">DNA Extraction</div>
              <div className="text-sm text-gray-600 mt-1">Class 12 Biology</div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Step Tabs */}
          <div className="flex bg-gray-50 rounded-xl p-1">
            {['theory', 'procedure', 'animation', 'simulation', 'viva'].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  currentStep === step
                    ? 'bg-white shadow-sm text-emerald-700'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-100'
                }`}
              >
                {step === 'theory' && '📖 Theory'}
                {step === 'procedure' && '📋 Procedure'}
                {step === 'animation' && '🎬 Animation'}
                {step === 'simulation' && '🧪 Simulation'}
                {step === 'viva' && '❓ Quiz'}
              </button>
            ))}
          </div>

          {/* Content */}
          {currentStep === 'theory' && (
            <div className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border">
              <h3 className="text-2xl font-bold text-emerald-800 mb-4">{lab.name}</h3>
              <p className="text-lg text-gray-700 leading-relaxed">{lab.theory}</p>
            </div>
          )}

          {currentStep === 'procedure' && (
            <div className="grid md:grid-cols-2 gap-4 p-6 bg-white rounded-2xl shadow-sm border">
              {lab.procedure.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border-r-4 border-emerald-200">
                  <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-gray-800">{step}</span>
                </div>
              ))}
            </div>
          )}

          {currentStep === 'animation' && (
            <div className="aspect-video bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl flex items-center justify-center text-white text-xl font-semibold">
              Animation Preview (DIKSHA-style)
            </div>
          )}

          {currentStep === 'simulation' && <LabSimulation labName={activeLab} />}

          {currentStep === 'viva' && (
            <div className="space-y-4">
              {lab.viva.map((question, i) => (
                <div key={i} className="p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
                  <div className="font-semibold text-gray-800 mb-3">Q{i + 1}: {question.q}</div>
                  <div className="text-emerald-700 font-medium bg-emerald-50 p-3 rounded-lg">
                    {question.a}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
