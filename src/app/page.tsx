import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />

      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVMMzkuNSAzOS41IiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNCkiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0zOS41IDBMMzkuNSAzOS41IiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNCkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] opacity-20" />

      <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-10 glass border-b-0 border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold">Y</div>
          <span className="font-bold tracking-tight text-xl">Youtubr</span>
        </div>
        <Link href="/dashboard" className="px-5 py-2.5 rounded-full bg-white text-black font-medium hover:bg-gray-100 transition-colors text-sm">
          Go to Dashboard
        </Link>
      </nav>

      <main className="z-10 flex flex-col items-center text-center max-w-4xl px-4 mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-white/80">Premium v2.0 is live</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 max-w-3xl">
          Download <br/>
          <span className="text-gradient">with precision.</span>
        </h1>

        <p className="text-lg md:text-2xl text-white/40 mb-12 max-w-2xl font-light">
          The most advanced, high-performance web tool to extract, convert and store videos in pristine quality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/dashboard" className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-all text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
            Start Downloading
          </Link>
          <a href="#features" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all text-lg backdrop-blur-sm">
            Explore Features
          </a>
        </div>
      </main>

      <div className="relative z-10 w-full max-w-6xl mt-24 px-4 pb-20" id="features">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
             { title: "Lossless Extraction", desc: "Download in 4K or extract uncompressed audio formats." },
             { title: "Concurrent Downloads", desc: "Queue multiple links and let the engine work in parallel." },
             { title: "Cloud Storage Ready", desc: "Save directly to the cloud or local encrypted vaults." },
          ].map((f, i) => (
            <div key={i} className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white/10 mb-6 flex items-center justify-center">
                 <span className="text-2xl font-bold opacity-80">{i+1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-white/50 leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
