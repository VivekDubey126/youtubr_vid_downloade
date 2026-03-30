'use client';

import { useState, useEffect } from 'react';
import { Download, LayoutDashboard, History, Settings, Loader2, FileVideo, FileAudio, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type Format = { format_id: string; ext: string; resolution: string; filesize: number; format_note: string };
type Metadata = { title: string; id: string; thumbnail: string; formats: Format[] };
type HistoryItem = { id: string; title: string; format: string; status: string; file_path: string; error_message: string; created_at: string; progress?: string; };

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('download');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
      const interval = setInterval(() => {
         fetchHistory();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data);
    } catch(e) { console.error(e) }
  };

  const handleFetch = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch('/api/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMetadata(data);
      if (data.formats?.length) setSelectedFormat(data.formats[data.formats.length - 1].format_id);
    } catch(err: any) {
      alert(err.message || 'Error fetching metadata');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!metadata || !selectedFormat) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          title: metadata.title,
          thumbnail: metadata.thumbnail,
          formatId: selectedFormat,
          isAudioOnly
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('Download started in background!');
      setUrl('');
      setMetadata(null);
      setActiveTab('history');
    } catch(err: any) {
      alert(err.message || 'Download failed to start');
    } finally {
      setDownloading(false);
    }
  };

  const deleteHistory = async (id: string) => {
    if(!confirm('Are you sure you want to delete this file?')) return;
    try {
      await fetch(`/api/delete/${id}`, { method: 'DELETE' });
      fetchHistory();
    } catch(e) { console.error(e) }
  }

  return (
    <div className="flex bg-[#0A0A0A] min-h-screen text-white/90">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-4 bg-black/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2 px-2 py-4 mb-8">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg">Y</div>
          <span className="font-semibold text-lg tracking-wide text-white">OmniLoad</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: 'download', icon: Download, label: 'Downloader' },
            { id: 'history', icon: History, label: 'History' },
            { id: 'stats', icon: LayoutDashboard, label: 'Dashboard Stats' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                activeTab === item.id 
                  ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" 
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'download' && (
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">New Download</h1>
              <p className="text-white/40">Enter any video link from YouTube, Vimeo, Twitter, or thousands of other platforms.</p>
            </div>

            <div className="glass-card p-2 flex gap-2 w-full shadow-2xl">
              <input
                type="text"
                placeholder="https://example.com/video-url..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-white/80 placeholder:text-white/30 truncate"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              />
              <button 
                onClick={handleFetch}
                disabled={loading || !url}
                className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Fetch'}
              </button>
            </div>

            {metadata && (
              <div className="glass-card overflow-hidden w-full flex flex-col md:flex-row shadow-2xl animate-in slide-in-from-bottom-4">
                {/* Thumbnail */}
                <div className="md:w-1/3 relative bg-black/50 aspect-video md:aspect-auto">
                   <img src={metadata.thumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-80" />
                </div>
                {/* Details */}
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg leading-tight mb-2 text-white">{metadata.title}</h3>
                    <p className="text-sm text-white/40 mb-6">ID: {metadata.id}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      
                      <div className="space-y-2">
                         <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Format</label>
                         <select 
                           value={selectedFormat} 
                           onChange={(e) => setSelectedFormat(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 outline-none focus:ring-1 focus:ring-white/30"
                         >
                           {metadata.formats.map((f) => (
                             <option key={f.format_id} value={f.format_id} className="bg-[#111]">
                               {f.resolution} ({f.ext}) {f.filesize ? ' - ' + (f.filesize / 1e6).toFixed(1) + 'MB' : ''}
                             </option>
                           ))}
                         </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Type</label>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setIsAudioOnly(false)}
                            className={cn("flex-1 py-2 rounded-lg text-sm font-medium border border-white/10 transition-colors", !isAudioOnly ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-white/5 hover:bg-white/10 text-white/50")}
                          >
                            <FileVideo className="w-4 h-4 inline mr-2"/> Video
                          </button>
                          <button 
                            onClick={() => setIsAudioOnly(true)}
                            className={cn("flex-1 py-2 rounded-lg text-sm font-medium border border-white/10 transition-colors", isAudioOnly ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-white/5 hover:bg-white/10 text-white/50")}
                          >
                            <FileAudio className="w-4 h-4 inline mr-2"/> Audio
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleDownload}
                      disabled={downloading}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      Start Conversion
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
           <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
             <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">History</h1>
              <p className="text-white/40">Your past downloads and conversions.</p>
            </div>

            <div className="glass-card overflow-hidden">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-white/10 text-white/40 text-xs font-medium uppercase tracking-wider">
                     <th className="p-4 py-3">File</th>
                     <th className="p-4 py-3">Type</th>
                     <th className="p-4 py-3">Status</th>
                     <th className="p-4 py-3">Date</th>
                     <th className="p-4 py-3 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5 text-sm">
                   {history.map((h) => (
                     <tr key={h.id} className="hover:bg-white/[0.02] transition-colors group">
                       <td className="p-4 font-medium text-white/80 max-w-xs truncate" title={h.title}>{h.title}</td>
                       <td className="p-4 text-white/50 uppercase text-xs tracking-wider">{h.format}</td>
                       <td className="p-4">
                         <span className={cn(
                           "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/5 border",
                           h.status === 'done' ? "text-green-400 border-green-400/20 bg-green-400/10" :
                           h.status === 'processing' ? "text-blue-400 border-blue-400/20 bg-blue-400/10 animate-pulse" :
                           "text-red-400 border-red-400/20 bg-red-400/10"
                         )}>
                           {h.status === 'processing' ? `processing (${h.progress || '0%'})` : h.status}
                         </span>
                       </td>
                       <td className="p-4 text-white/40">{new Date(h.created_at).toLocaleDateString()}</td>
                       <td className="p-4 text-right flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         {h.status === 'done' && (
                           <a 
                             href={`/api/file/${h.id}`} 
                             download 
                             className="p-2 text-white/50 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors flex items-center justify-center"
                             title="Save File to Destination"
                           >
                             <Download className="w-4 h-4" />
                           </a>
                         )}
                         <button onClick={() => deleteHistory(h.id)} className="p-2 text-white/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center justify-center" title="Delete">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </td>
                     </tr>
                   ))}
                   {history.length === 0 && (
                     <tr>
                       <td colSpan={5} className="p-8 text-center text-white/30 italic">No history found. Go download something!</td>
                     </tr>
                   )}
                 </tbody>
               </table>
            </div>
           </div>
        )}
      </main>
    </div>
  );
}
