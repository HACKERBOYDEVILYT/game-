import React, { useState } from 'react';
import { generateGodotProjectFiles, createGodotProjectZipBlob } from '../godot/GodotProjectGenerator.ts';
import { X, Download, FileCode, Folder, Check, Terminal, Smartphone, Globe } from 'lucide-react';

interface GodotExportModalProps {
  onClose: () => void;
}

export const GodotExportModal: React.FC<GodotExportModalProps> = ({ onClose }) => {
  const files = generateGodotProjectFiles();
  const [selectedFile, setSelectedFile] = useState<string>('project.godot');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentFileContent = files.find((f) => f.path === selectedFile)?.content || '';

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await createGodotProjectZipBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '3AM_Delivery_Godot4_Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch {
      // Graceful error handle
    } finally {
      setIsDownloading(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'files' | 'apk_guide' | 'hosting_guide'>('files');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#0c1117] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080d12]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-blue-950/60 border border-blue-700/50">
              <Smartphone className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Godot 4.x সোর্স প্রজেক্ট, APK ও হোস্টিং গাইড</span>
              </h2>
              <p className="text-xs text-slate-400">
                Godot 4.2+ সোর্স ফাইল ডাউনলোড, অ্যান্ড্রয়েড APK তৈরি ও সম্পূর্ণ ফ্রি ওয়েবসাইট হোস্টিং
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              {isDownloading ? (
                <span>প্যাকেজিং হচ্ছে...</span>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>ডাউনলোড সম্পন্ন!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>প্রজেক্ট জিপ (.ZIP) ডাউনলোড</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-[#090e15] border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'files'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>সোর্স ফাইল ভিউয়ার</span>
          </button>
          <button
            onClick={() => setActiveTab('apk_guide')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'apk_guide'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>অ্যান্ড্রয়েড APK বানানোর নিয়ম</span>
          </button>
          <button
            onClick={() => setActiveTab('hosting_guide')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'hosting_guide'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>ফ্রি ওয়েবসাইট হোস্টিং গাইড</span>
          </button>
        </div>

        {/* Tab 1: Source Code Viewer */}
        {activeTab === 'files' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* File Tree Left Sidebar */}
            <div className="w-full md:w-64 border-r border-slate-800 bg-[#080c10] p-4 overflow-y-auto shrink-0">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-500" />
                <span>প্রজেক্ট ফাইল তালিকা</span>
              </div>
              <div className="space-y-1">
                {files.map((file) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file.path)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-mono transition-colors flex items-center gap-1.5 truncate ${
                      selectedFile === file.path
                        ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <span className="truncate">{file.path}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Viewer Right Panel */}
            <div className="flex-1 flex flex-col bg-[#05080c] overflow-hidden">
              <div className="px-4 py-2 bg-[#090e14] border-b border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>{selectedFile}</span>
                <span className="text-[10px] text-slate-500">
                  {currentFileContent.split('\n').length} lines
                </span>
              </div>
              <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-300 whitespace-pre leading-relaxed select-text">
                {currentFileContent}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: APK Building Guide */}
        {activeTab === 'apk_guide' && (
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#070b10] text-slate-200 space-y-6">
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5" />
                  <span>অ্যান্ড্রয়েড APK তৈরির দুটি সেরা ও সহজ পদ্ধতি</span>
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  আপনার গেমটি অ্যান্ড্রয়েড ফোনে ইনস্টলযোগ্য APK আকারে বিল্ড করার জন্য নিচে ২টি কার্যকর পদ্ধতি দেওয়া হলো:
                </p>
              </div>

              {/* Method 1 */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">পদ্ধতি ১</span>
                  <h4 className="text-base font-semibold text-slate-100">Godot 4.x দিয়ে Native 3D Android APK তৈরি</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  আমরা সম্পূর্ণ Godot 4 প্রজেক্ট তৈরি করে রেখেছি। উপরের <strong className="text-amber-300">প্রজেক্ট জিপ (.ZIP) ডাউনলোড</strong> বাটনে ক্লিক করে ফাইলটি নিন।
                </p>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 pl-1 leading-relaxed">
                  <li><strong>Godot 4 ডাউনলোড:</strong> <code className="px-1.5 py-0.5 rounded bg-black/60 text-emerald-400 font-mono">godotengine.org</code> থেকে Godot 4 (Standard) ডাউনলোড করুন।</li>
                  <li><strong>প্রজেক্ট Import করুন:</strong> ডাউনলোড করা <code className="px-1.5 py-0.5 rounded bg-black/60 text-amber-300 font-mono">3AM_Delivery_Godot4_Project.zip</code> আনজিপ করে Godot ওপেন করে <code className="px-1.5 py-0.5 rounded bg-black/60 text-slate-200">Import</code> বাটনে <code className="text-amber-300 font-mono">project.godot</code> ফাইলটি সিলেক্ট করুন।</li>
                  <li><strong>Android Export Template সেটআপ:</strong> Godot-এর মেনু থেকে <code className="px-1.5 py-0.5 rounded bg-black/60 text-slate-200">Editor &gt; Manage Export Templates</code>-এ গিয়ে বর্তমান ভার্সনের টেমপ্লেট ডাউনলোড করুন।</li>
                  <li><strong>Android SDK &amp; Keystore লিংক:</strong> <code className="px-1.5 py-0.5 rounded bg-black/60 text-slate-200">Editor &gt; Editor Settings &gt; Export &gt; Android</code>-এ আপনার Android SDK পাথ ও Debug Keystore লোকেশন দিন।</li>
                  <li><strong>APK Export করুন:</strong> প্রজেক্টের মেনুবার থেকে <code className="px-1.5 py-0.5 rounded bg-black/60 text-slate-200">Project &gt; Export...</code>-এ ক্লিক করে <code className="text-emerald-400">Android</code> প্রিসেটটি নির্বাচন করুন এবং <code className="px-2 py-1 rounded bg-emerald-700/60 text-white font-bold">Export Project</code> চাপলেই তৈরি হয়ে যাবে আপনার সম্পূর্ণ স্ট্যান্ডঅ্যালোন APK!</li>
                </ol>
              </div>

              {/* Method 2 */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-mono font-bold">পদ্ধতি ২</span>
                  <h4 className="text-base font-semibold text-slate-100">ওয়েব ভার্সনকে ১ ক্লিকে APK বানানো (Capacitor বা PWABuilder)</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  আপনার বর্তমান ব্রাউজার গেমটি যেহেতু সম্পূর্ণ থ্রিডি এবং টাচ কন্ট্রোল রয়েছে, তাই এটিকে কোডিং ছাড়াই সরাসরি APK-তে রূপান্তর করা যায়:
                </p>
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p><strong>A. PWABuilder (সবচেয়ে সহজ - কোনো সফটওয়্যার ইনস্টল ছাড়াই):</strong></p>
                  <ul className="list-disc list-inside pl-3 space-y-1 text-slate-400">
                    <li>গেমটি Vercel বা Netlify-তে হোস্ট করার পর ওয়েবসাইটের লিঙ্কটি কপি করুন।</li>
                    <li><code className="px-1.5 py-0.5 rounded bg-black/60 text-blue-400 font-mono">pwabuilder.com</code> ওয়েবসাইটে লিঙ্কটি পেস্ট করুন।</li>
                    <li><strong>Android Package</strong> অপশন সিলেক্ট করে সরাসরি Signed APK বা AAB ডাউনলোড করে ফোনে ইনস্টল করুন।</li>
                  </ul>

                  <p className="pt-2"><strong>B. Capacitor JS দিয়ে কমান্ড লাইনে APK তৈরি:</strong></p>
                  <div className="p-3 rounded bg-black/70 font-mono text-[11px] text-emerald-400 space-y-1">
                    <div>npm run build</div>
                    <div>npm install @capacitor/core @capacitor/cli @capacitor/android</div>
                    <div>npx cap init "3 AM Delivery" "com.bengali.horror.delivery" --web-dir dist</div>
                    <div>npx cap add android</div>
                    <div>npx cap open android   # Android Studio ওপেন হবে এবং Build APK দিলেই রেডি!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Free Web Hosting Guide */}
        {activeTab === 'hosting_guide' && (
          <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#070b10] text-slate-200 space-y-6">
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5" />
                  <span>বিনামূল্যে ওয়েবসাইট হোস্ট করার সেরা প্ল্যাটফর্মসমূহ</span>
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  এই থ্রিডি গেমটি একটি ক্লায়েন্ট-সাইড হাই-পারফরম্যান্স ওয়েব অ্যাপ্লিকেশন। কোনো টাকা খরচ ছাড়াই আজীবন বিনামূল্যে হোস্ট করার ৪টি সেরা প্ল্যাটফর্ম:
                </p>
              </div>

              {/* Vercel */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>১. Vercel (সবচেয়ে রিকমেন্ডেড ও সুপার ফাস্ট)</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">১০০% ফ্রি টিয়ার</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Vercel হলো Vite + React অ্যাপের জন্য বিশ্বের সেরা ক্লাউড হোস্টিং।
                </p>
                <div className="text-xs text-slate-400 space-y-1">
                  <div><strong>কীভাবে করবেন:</strong></div>
                  <ol className="list-decimal list-inside pl-2 space-y-0.5">
                    <li>প্রজেক্টটি আপনার GitHub একাউন্টে পুশ করুন (Export &gt; GitHub থেকে এক ক্লিকেই করা যায়)।</li>
                    <li><code className="text-emerald-400">vercel.com</code>-এ গিয়ে GitHub একাউন্ট দিয়ে Sign In করুন।</li>
                    <li><code className="text-amber-300">Add New Project</code> দিয়ে রিপোজিটরিটি সিলেক্ট করে <strong>Deploy</strong> চাপুন। ৩০ সেকেন্ডে লাইভ লিঙ্ক (<code className="text-blue-400">your-game.vercel.app</code>) পেয়ে যাবেন!</li>
                  </ol>
                </div>
              </div>

              {/* Cloudflare Pages */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                    <span>২. Cloudflare Pages (আনলিমিটেড ব্যান্ডউইথ ও বাংলাদেশে দ্রুততম)</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">আনলিমিটেড ট্রাফিক</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cloudflare-এর ঢাকার ডাটা সেন্টারের কারণে বাংলাদেশ থেকে গেমটি অত্যন্ত দ্রুত লোড হয় এবং কোনো ব্যান্ডউইথ লিমিট নেই।
                </p>
                <div className="text-xs text-slate-400 space-y-1">
                  <div><strong>কীভাবে করবেন:</strong></div>
                  <ol className="list-decimal list-inside pl-2 space-y-0.5">
                    <li><code className="text-amber-400">pages.cloudflare.com</code>-এ সাইন আপ করুন।</li>
                    <li>Connect to Git দিয়ে রিপোজিটরি সিলেক্ট করুন। Framework preset দিন <code className="text-white">Vite</code>, Build output directory দিন <code className="text-white">dist</code>।</li>
                    <li>Save and Deploy দিলেই লাইভ লিঙ্ক পেয়ে যাবেন।</li>
                  </ol>
                </div>
              </div>

              {/* Netlify */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                    <span>৩. Netlify (ড্র্যাগ অ্যান্ড ড্রপ সরাসরি ফোল্ডার আপলোড)</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">সহজতম</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  যদি আপনি গিটহাবও ব্যবহার করতে না চান, তবে শুধু টার্মিনালে <code className="font-mono text-cyan-300 bg-black/60 px-1">npm run build</code> চালিয়ে তৈরি হওয়া <code className="font-mono text-cyan-300 bg-black/60 px-1">dist</code> ফোল্ডারটি <code className="text-cyan-400">app.netlify.com/drop</code> এ ড্রপ করে দিন — সাথে সাথে সাইট লাইভ হয়ে যাবে!
                </p>
              </div>

              {/* GitHub Pages */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-purple-400 flex items-center gap-1.5">
                    <span>৪. GitHub Pages</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">GitHub ইন্টিগ্রেটেড</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  GitHub রিপোজিটরির Settings &gt; Pages থেকে GitHub Actions ওয়ার্কফ্লো অন করে দিলে প্রতি কমিটে সাইটটি ফ্রিতে পাবলিশ হয়।
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
