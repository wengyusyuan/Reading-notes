import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, BookOpen, LogOut, Search, Filter, Library, BookText, Sparkles, Book as BookIcon } from 'lucide-react';
import { User } from 'firebase/auth';
import { initFirebase, loginWithGoogle, logout, saveBook, subscribeToBooks, deleteBookEntry } from './services/firebaseService';
import { classifyBook } from './services/geminiService';
import { Book, BookFormValues } from './types';
import BookCard from './components/BookCard';
import BookForm from './components/BookForm';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initFirebase((u) => {
      setUser(u);
      setIsInitializing(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToBooks(user.uid, (data) => {
        setBooks(data);
      });
      return () => unsubscribe();
    } else {
      setBooks([]);
    }
  }, [user]);

  const handleSaveBook = async (formData: BookFormValues) => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      // 1. AI Classification
      const category = await classifyBook(formData.title, formData.author, formData.thoughts);
      
      // 2. Save to Firestore
      await saveBook(user.uid, { ...formData, category });
      
      setIsFormOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("儲存失敗，請檢查網路連線或 Firebase 設定。");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <BookIcon className="text-stone-300" size={40} />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7F2] p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="flex flex-wrap gap-20 p-20">
            {[...Array(20)].map((_, i) => <BookIcon key={i} size={80} />)}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-md bg-white border border-stone-200 p-12 rounded-[40px] shadow-xl z-10"
        >
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <BookText className="text-amber-700" size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-serif font-bold text-stone-800">書香筆記</h1>
            <p className="text-stone-500 mt-3 font-medium">記錄你的閱讀足跡與心靈感悟</p>
          </div>
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-lg active:scale-95"
          >
            使用 Google 帳號登入
          </button>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Secure Library Access</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-theme-bg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] border-r border-theme-line p-10 flex flex-col bg-theme-sidebar shrink-0 overflow-y-auto">
        <h1 className="text-2xl font-black tracking-tighter leading-[0.9] mb-12 uppercase">
          BIBLIO<br/>LOG.
        </h1>
        
        <nav className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded bg-theme-line text-theme-ink font-bold text-sm cursor-pointer">
            <span>全部藏書</span>
            <span className="text-xs">{books.length}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded text-theme-muted hover:bg-theme-line/50 text-sm cursor-pointer transition-colors">
            <span>即將到期</span>
            <span className="text-red-600 font-bold">{books.filter(b => b.returnDate && new Date() > new Date(new Date().getTime() - 3*24*60*60*1000) && b.returnDate <= new Date()).length + books.filter(b => b.returnDate && new Date() > b.returnDate).length}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded text-theme-muted hover:bg-theme-line/50 text-sm cursor-pointer transition-colors">
            <span>借閱歷史</span>
          </div>
        </nav>

        <div className="mt-auto pt-8 border-t border-theme-line">
           <button
            onClick={() => setIsFormOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-theme-ink text-white rounded-[2px] text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95"
          >
            <Plus size={16} />
            記錄新書
          </button>
          
          <div className="geometric-card p-4 mt-6">
            <span className="text-[10px] font-bold text-theme-meta uppercase tracking-widest">閱讀進度</span>
            <div className="h-1 bg-theme-line rounded-full mt-3 mb-2 overflow-hidden">
              <div 
                className="h-full bg-theme-ink transition-all duration-1000" 
                style={{ width: `${Math.min(100, (books.length / 10) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-theme-muted">本月目標: {books.length} / 10 本</span>
          </div>

          <button 
            onClick={logout}
            className="mt-6 flex items-center gap-2 text-theme-meta hover:text-theme-ink text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <LogOut size={14} />
            登出端點
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-light text-theme-ink">借閱記錄回顧</h2>
            <p className="text-theme-meta text-sm mt-1">系統已根據書籍性質自動完成 AI 分類</p>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-meta group-focus-within:text-theme-ink transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜尋藏書..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-theme-line rounded-[2px] text-xs outline-none w-64 focus:border-theme-ink transition-all"
            />
          </div>
        </header>

        <section className="mb-8">
          <div className="text-xs font-bold text-theme-ink uppercase tracking-widest pb-3 border-b-2 border-theme-ink mb-6">
            閱讀書庫 (Active Collection)
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onDelete={(id) => deleteBookEntry(id)} 
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-40 geometric-card bg-theme-bg/50 border-dashed">
              <BookIcon className="text-theme-line mx-auto mb-4" size={32} />
              <h3 className="text-lg font-serif font-bold text-theme-ink">紀錄庫尚無數據</h3>
              <p className="text-theme-meta text-xs mt-2 uppercase tracking-widest">No matching records found</p>
            </div>
          )}
        </section>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {isFormOpen && (
          <BookForm 
            onSave={handleSaveBook} 
            onClose={() => setIsFormOpen(false)} 
          />
        )}
        {isLoading && (
          <div className="fixed inset-0 z-[60] bg-theme-bg/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
               <Sparkles className="text-theme-ink mb-6" size={40} />
            </motion.div>
            <p className="text-theme-ink font-bold uppercase tracking-[0.2em] text-sm">AI Classification in Progress</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
