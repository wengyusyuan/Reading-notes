import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, MapPin, Calendar, Sparkles, X, Star, Info, Loader2 } from 'lucide-react';
import { BookFormValues } from '../types';
import { getBookDetails } from '../services/geminiService';
import { cn } from '../lib/utils';

interface BookFormProps {
  onSave: (data: BookFormValues) => void;
  onClose: () => void;
}

export default function BookForm({ onSave, onClose }: BookFormProps) {
  const [formData, setFormData] = useState<BookFormValues>({
    title: '',
    author: '',
    isbn: '',
    library: '',
    borrowDate: null,
    returnDate: null,
    thoughts: '',
    rating: 0,
  });

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleAiAutoFill = async () => {
    if (!formData.title) return;
    setIsLoadingDetails(true);
    const details = await getBookDetails(formData.title + (formData.author ? ` by ${formData.author}` : ''));
    if (details) {
      setFormData(prev => ({
        ...prev,
        title: details.title || prev.title,
        author: details.author || prev.author,
        isbn: details.isbn || prev.isbn,
      }));
    }
    setIsLoadingDetails(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[4px] shadow-[12px_12px_0px_rgba(0,0,0,0.1)] border border-theme-ink flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-theme-sidebar border-b border-theme-line">
          <div>
            <h2 className="text-2xl font-serif font-bold text-theme-ink">新增閱讀紀錄</h2>
            <p className="text-theme-meta text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">New Reading Entry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-theme-line rounded-full transition-colors">
            <X size={20} className="text-theme-ink" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Main Info */}
          <section className="space-y-6">
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-theme-ink border-b border-theme-ink pb-1 w-fit">
              基本資訊 Basic Info
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label className="block text-[10px] font-bold text-theme-meta uppercase tracking-widest">書名 Book Title</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-theme-bg border border-theme-line rounded-[2px] px-4 py-3 text-theme-ink focus:border-theme-ink outline-none transition-all pr-12 text-sm"
                    placeholder="例如: 罪與罰"
                  />
                  <button
                    type="button"
                    onClick={handleAiAutoFill}
                    disabled={!formData.title || isLoadingDetails}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-theme-ink hover:scale-110 active:scale-95 disabled:text-theme-line transition-all"
                    title="AI 自動填寫詳細資訊"
                  >
                    {isLoadingDetails ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-theme-meta uppercase tracking-widest">作者 Author</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full bg-theme-bg border border-theme-line rounded-[2px] px-4 py-3 text-theme-ink focus:border-theme-ink outline-none transition-all text-sm"
                  placeholder="例如: 杜斯妥也夫斯基"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-theme-meta uppercase tracking-widest">ISBN (選填)</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full bg-theme-bg border border-theme-line rounded-[2px] px-4 py-3 text-theme-ink focus:border-theme-ink outline-none transition-all font-mono text-xs"
                  placeholder="9780140449136"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-theme-meta uppercase tracking-widest">評分 Rating</label>
                <div className="flex items-center gap-1 h-[46px]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={20}
                        className={cn(
                          formData.rating >= star ? "fill-theme-ink text-theme-ink" : "text-theme-line"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Library Info */}
          <section className="space-y-6">
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-theme-ink border-b border-theme-ink pb-1 w-fit">
              圖書館資訊 Library
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-theme-meta uppercase tracking-widest">圖書館名稱</label>
                <input
                  type="text"
                  value={formData.library}
                  onChange={e => setFormData({ ...formData, library: e.target.value })}
                  className="w-full bg-theme-bg border border-theme-line rounded-[2px] px-4 py-3 text-theme-ink focus:border-theme-ink outline-none transition-all text-sm"
                  placeholder="例如: 台北市立圖書館"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-theme-meta uppercase tracking-widest">還書日期</label>
                <input
                  type="date"
                  onChange={e => setFormData({ ...formData, returnDate: e.target.value ? new Date(e.target.value) : null })}
                  className="w-full bg-theme-bg border border-theme-line rounded-[2px] px-4 py-3 text-theme-ink focus:border-theme-ink outline-none transition-all text-sm"
                />
              </div>
            </div>
          </section>

          {/* Reflections */}
          <section className="space-y-6">
            <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-theme-ink border-b border-theme-ink pb-1 w-fit">
              心得感想 Reflections
            </div>
            <div className="space-y-2">
              <textarea
                value={formData.thoughts}
                rows={4}
                onChange={e => setFormData({ ...formData, thoughts: e.target.value })}
                className="w-full bg-theme-bg border border-theme-line rounded-[2px] px-4 py-4 text-theme-ink focus:border-theme-ink outline-none transition-all resize-none text-sm italic leading-relaxed"
                placeholder="寫下你的閱讀心得，AI 將會以此作為分類依據..."
              />
            </div>
          </section>
        </div>

        <div className="p-8 bg-theme-sidebar border-t border-theme-line flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 border border-theme-line text-theme-meta font-bold text-[10px] uppercase tracking-widest hover:bg-theme-bg transition-colors"
          >
            取消 Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="flex-[2] py-4 px-6 bg-theme-ink text-white font-bold text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,0.1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.15)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            儲存紀錄 Save Entry
          </button>
        </div>
      </motion.div>

    </motion.div>
  );
}
