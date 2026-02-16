import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // Your existing Supabase client

export default function BiotechSimulations() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedTextbook, setSelectedTextbook] = useState(null);
  const [activeLab, setActiveLab] = useState(null);
  const [currentStep, setCurrentStep] = useState('theory');
  const [videoUrl, setVideoUrl] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  // Class-wise data
  const classData = {
    'class-9': { title: 'Class 9 - Science', textbooks: [{ id: 'science-9', title: 'NCERT Science Textbook' }] },
    'class-10': { title: 'Class 10 - Science', textbooks: [{ id: 'science-10', title: 'NCERT Science Textbook' }] },
    'class-11': { title: 'Class 11 - Biology', textbooks: [{ id: 'biology-11', title: 'NCERT Biology Textbook' }] },
    'class-12': { title: 'Class 12 - Biology', textbooks: [{ id: 'biology-12', title: 'NCERT Biology Textbook' }] }
  };

  // Lab experiments per textbook
  const labExperiments = {
    'science-9': [
      { id: 'onion-peel', title: 'Onion Peel Cell Observation', type: 'microscopy' },
      { id: 'plant-cells', title: 'Plant Cell Structure Study', type: 'microscopy' }
    ],
    'science-10': [
      { id: 'stomata', title: 'Stomatal Observation', type: 'microscopy' },
      { id: 'food-test', title: 'Food Test Experiments', type: 'chemical' }
    ],
    'biology-11': [
      { id: 'mitosis', title: 'Mitosis Cell Division', type: 'microscopy' },
      { id: 'dna-extract', title: 'DNA Extraction from Onion', type: 'molecular' }
    ],
    'biology-12': [
      { id: 'pcr', title: 'PCR Simulation', type: 'molecular' },
      { id: 'gel-electro', title: 'Gel Electrophoresis', type: 'molecular' }
    ]
  };

  // Lab simulation data
  const labDetails = {
    'onion-peel': {
      name: 'Onion Peel Cell Observation',
      theory: 'This experiment is performed to study the basic structure of a plant cell using the epidermal peel of an onion bulb. Onion peel is ideal for observation because its cells are large, rectangular, and arranged in a regular pattern. When stained with iodine solution, important cell components such as the cell wall, cytoplasm, nucleus, and vacuole become clearly visible under a compound microscope.',
      procedure: [
        'Take a fresh onion bulb and cut it into layers.',
        'Using forceps, gently peel off a thin, transparent epidermal layer from the inner surface.',
        'Place the peel carefully on a clean glass slide.',
        'Add a few drops of iodine solution to stain the cells.',
        'Gently place a coverslip over the peel, avoiding air bubbles.',
        'Observe the slide under low power and then high power of the microscope.'
      ],
      guide: 'Ensure the peel is very thin for better clarity. Handle the peel gently with forceps to avoid tearing. While placing the coverslip, lower it slowly at an angle to prevent air bubbles. Clean the slide and coverslip properly before use for clear observation.'
    },
    'mitosis': {
      name: 'Mitosis Cell Division',
      theory: 'This experiment aims to study the different stages of mitosis using the actively dividing cells of an onion root tip. Mitosis is a type of cell division responsible for growth, repair, and maintenance in multicellular organisms. Onion root tips are used because they contain meristematic tissue where cells divide rapidly, allowing clear observation of stages such as prophase, metaphase, anaphase, and telophase.',
      procedure: [
        'Cut 1–2 cm long onion root tips from a healthy onion.',
        'Fix the root tips in a suitable fixative to preserve cell structure.',
        'Hydrolyze the root tips using dilute hydrochloric acid to soften tissues.',
        'Wash the root tips and stain them with acetocarmine or aceto-orcein.',
        'Place the stained root tip on a slide and gently squash it using a coverslip.',
        'Observe the slide under a microscope to identify different stages of mitosis.'
      ],
      guide: 'Use fresh root tips for maximum mitotic activity. Do not over-hydrolyze as it may damage the cells. Apply gentle pressure while squashing to spread the cells evenly without breaking them. Adjust the microscope focus carefully to distinguish each mitotic stage clearly.'
    }
  };

  // ✅ SUPABASE VIDEO PLAYER (REPLACES Canvas)
  const LabSimulation = ({ labId }) => {
    useEffect(() => {
      // Fetch video from Supabase Storage
      setLoadingVideo(true);
      const { data } = supabase.storage
        .from('lab-videos') // Your bucket name
        .getPublicUrl(`${labId}.mp4`); // onion-peel.mp4, mitosis.mp4, etc.
      
      setVideoUrl(data.publicUrl);
      setLoadingVideo(false);
    }, [labId]);

    const reloadVideo = () => {
      window.location.reload();
    };

    return (
      <div className="space-y-6">
        {/* SUPABASE VIDEO PLAYER */}
        <div className="aspect-video bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl overflow-hidden shadow-2xl relative">
          {loadingVideo ? (
            <div className="flex items-center justify-center h-full bg-gray-900 text-white">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mr-4"></div>
              Loading {labId}.mp4...
            </div>
          ) : videoUrl ? (
            <video 
              controls 
              autoPlay 
              className="w-full h-full"
              poster="https://via.placeholder.com/1280x720/10b981/ffffff?text=SIMULATION"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white text-center p-8">
              <div className="text-2xl mb-4">📹 Video Not Found</div>
              <div className="text-gray-400 mb-6">{labId}.mp4</div>
              <button 
                onClick={reloadVideo}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                🔄 Retry
              </button>
            </div>
          )}
        </div>
        
        {/* VIDEO CONTROLS - SAME DESIGN */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border flex items-center justify-between">
          <div>
            <h4 className="font-bold text-xl text-gray-800 mb-1">{labDetails[labId]?.name}</h4>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                SUPABASE • MP4 • HD
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full w-[70%] animate-pulse" />
                </div>
                <span>1:58 / 2:45</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 shadow-md transition-all">
              ⏸️ Pause
            </button>
            <button onClick={reloadVideo} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all">
              🔄 Reload Video
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ✅ REST OF YOUR CODE - EXACTLY SAME
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🧪 Virtual Lab Collection
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            NCERT Aligned Virtual Labs - Class 9 to 12
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* LEFT PANE: Class Selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border sticky top-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                📚 Select Class
              </h3>
              {Object.entries(classData).map(([clsId, clsData]) => (
                <button
                  key={clsId}
                  onClick={() => {
                    setSelectedClass(clsId);
                    setSelectedTextbook(null);
                    setActiveLab(null);
                  }}
                  className={`w-full p-6 rounded-2xl border-3 shadow-lg hover:shadow-2xl transition-all flex items-center gap-4 text-left group ${
                    selectedClass === clsId
                      ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-emerald-300'
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full transition-all ${selectedClass === clsId ? 'bg-emerald-500 scale-125' : 'bg-gray-300'}`} />
                  <div>
                    <div className="font-bold text-lg text-gray-800 group-hover:text-emerald-700">
                      {clsData.title}
                    </div>
                    <div className="text-sm text-gray-600">8+ Experiments</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT PANE */}
          <div className="lg:col-span-3 space-y-8">
            {/* Level 1: Textbook Selection */}
            {selectedClass && !selectedTextbook && !activeLab && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  📖 {classData[selectedClass].title} - Textbooks
                </h3>
                {classData[selectedClass].textbooks.map((textbook) => (
                  <div
                    key={textbook.id}
                    className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-white/50 hover:from-emerald-50 border border-white/30 hover:border-emerald-200 hover:shadow-xl transition-all"
                    onClick={() => {
                      setSelectedTextbook(textbook);
                      setActiveLab(null);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xl text-gray-800 mb-1">{textbook.title}</h4>
                      </div>
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-all">
                        →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Level 2: Lab Experiments - FIXED LINE 335 */}
            {selectedTextbook && !activeLab && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border">
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => {
                      setSelectedTextbook(null);
                      setActiveLab(null);
                    }}
                    className="p-2 bg-white/50 hover:bg-white rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    ← All Textbooks
                  </button>
                  <h3 className="text-2xl font-bold text-gray-800">
                    🧪 Lab Experiments - {selectedTextbook.title}
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {labExperiments[selectedTextbook.id]?.map((lab) => (
                    <div
                      key={lab.id}
                      className="group cursor-pointer p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-100 hover:shadow-2xl hover:-translate-y-2 transition-all hover:border-emerald-300"
                      onClick={() => {
                        setActiveLab(lab);
                        setCurrentStep('theory');
                      }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`px-4 py-2 rounded-xl text-xs font-bold ${
                          lab.type === 'microscopy' ? 'bg-blue-100 text-blue-800' :
                          lab.type === 'molecular' ? 'bg-purple-100 text-purple-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {lab.type.toUpperCase()}
                        </div>
                      </div>
                      <h4 className="font-bold text-xl text-gray-800 mb-3">{lab.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-20 bg-white px-3 py-1 rounded-full text-xs font-semibold text-emerald-700">
                          Simulation
                        </div>
                        <div className="w-20 bg-white px-3 py-1 rounded-full text-xs font-semibold text-blue-700">
                          Guide
                        </div>
                      </div>
                    </div>
                  )) || <p className="col-span-full text-center py-12 text-gray-500">No labs available</p>}
                </div>
              </div>
            )}

            {/* Level 3: Lab Simulation */}
            {activeLab && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border">
                <div className="flex items-center gap-4 mb-8">
                  <button
                    onClick={() => setActiveLab(null)}
                    className="p-3 bg-emerald-100 hover:bg-emerald-200 rounded-2xl shadow-md transition-all flex items-center gap-2 text-emerald-800 font-semibold"
                  >
                    ← Lab Experiments
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                      {activeLab.title}
                    </h2>
                    <div className={`px-4 py-2 rounded-full text-sm font-bold mt-1 ${
                      activeLab.type === 'microscopy' ? 'bg-blue-100 text-blue-800' :
                      activeLab.type === 'molecular' ? 'bg-purple-100 text-purple-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {activeLab.type.toUpperCase()} LAB
                    </div>
                  </div>
                </div>

                {/* 5-tab Navigation */}
                <div className="flex bg-gradient-to-r from-gray-50 to-emerald-50 rounded-2xl p-1 mb-8 shadow-sm">
                  {['theory', 'procedure', 'simulation', 'guide', 'viva'].map((step) => (
                    <button
                      key={step}
                      onClick={() => setCurrentStep(step)}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        currentStep === step
                          ? 'bg-white shadow-lg text-emerald-700 border-2 border-emerald-200'
                          : 'text-gray-600 hover:text-emerald-600 hover:bg-white'
                      }`}
                    >
                      {step === 'theory' && '📖 Theory'}
                      {step === 'procedure' && '📋 Procedure'}
                      {step === 'simulation' && '🧪 Simulation'}
                      {step === 'guide' && '📖 Guide'}
                      {step === 'viva' && '❓ Viva'}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {currentStep === 'theory' && (
                    <div className="p-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl text-lg text-gray-800">
                      {labDetails[activeLab.id]?.theory || 'Theory content will appear here...'}
                    </div>
                  )}
                  {currentStep === 'procedure' && (
                    <div className="p-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl text-lg text-gray-800">
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-blue-800 mb-4">Procedure Steps</h3>
                        {Array.isArray(labDetails[activeLab.id]?.procedure) ? (
                          labDetails[activeLab.id].procedure.map((step, index) => (
                            <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border-l-4 border-blue-400">
                              <span className="font-bold text-blue-600 w-8 flex-shrink-0">{index + 1}.</span>
                              <span>{step}</span>
                            </div>
                          ))
                        ) : (
                          <p>Procedure content will appear here...</p>
                        )}
                      </div>
                    </div>
                  )}
                  {currentStep === 'simulation' && (
                    <LabSimulation labId={activeLab.id} />
                  )}
                  {currentStep === 'guide' && (
                    <div className="p-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl text-lg text-gray-800">
                      {labDetails[activeLab.id]?.guide || 'Experiment guide will appear here...'}
                    </div>
                  )}
                  {currentStep === 'viva' && (
                    <div className="p-10 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl text-lg text-gray-800">
                      <h3 className="text-2xl font-bold text-orange-800 mb-6">Viva Voce Questions</h3>
                      <ul className="space-y-3">
                        <li className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-orange-400">
                          <strong>Q: What is the shape of onion peel cells?</strong><br/>
                          <span className="text-sm text-gray-600 ml-4">A: Rectangular</span>
                        </li>
                        <li className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-orange-400">
                          <strong>Q: What stain is used?</strong><br/>
                          <span className="text-sm text-gray-600 ml-4">A: Iodine solution</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
