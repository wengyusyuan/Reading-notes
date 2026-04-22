import { motion } from 'motion/react';
import { Book as BookIcon, Calendar, Library, Quote, Trash2, Tag, Star } from 'lucide-react';
import { Book } from '../types';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface BookCardProps {
  book: Book;
  onDelete: (id: string) => void;
}

export default function BookCard({ book, onDelete }: BookCardProps) {
  const isOverdue = book.returnDate && new Date() > book.returnDate;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="geometric-card p-6 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-theme-ink text-white text-[10px] uppercase tracking-widest font-bold rounded-[2px]">
              {book.category}
            </span>
            {book.rating > 0 && (
              <div className="flex items-center gap-0.5 ml-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={cn(
                      i < book.rating ? "fill-amber-500 text-amber-500" : "text-theme-line"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
          <h3 className="text-xl font-serif font-bold text-theme-ink leading-tight">
            {book.title}
          </h3>
          <p className="text-theme-meta text-sm italic mt-1 uppercase tracking-tighter">By {book.author}</p>
        </div>
        <button
          onClick={() => onDelete(book.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-theme-line hover:text-red-500 transition-all duration-200"
          title="刪除紀錄"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {book.isbn && (
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-theme-meta uppercase tracking-widest">ISBN Code</span>
            <div className="flex items-center gap-2 text-theme-muted">
               <span className="font-mono bg-theme-sidebar px-2 py-0.5 rounded border border-theme-line text-xs">{book.isbn}</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-theme-line">
          {book.library && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-theme-meta uppercase tracking-widest">借閱地點</span>
              <span className="text-sm text-theme-muted font-medium">{book.library}</span>
            </div>
          )}

          {book.returnDate && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-theme-meta uppercase tracking-widest">預計還書</span>
              <span className={cn(
                "status-badge inline-flex w-fit",
                isOverdue ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"
              )}>
                {format(book.returnDate, 'yyyy/MM/dd', { locale: zhTW })}
              </span>
            </div>
          )}
        </div>
      </div>

      {book.thoughts && (
        <div className="mt-6 pt-6 border-t border-theme-line">
          <span className="text-[10px] font-bold text-theme-meta uppercase tracking-widest mb-2 block">心得筆記 Notes</span>
          <div className="relative p-4 border border-theme-line bg-theme-bg/50 rounded-[4px]">
            <Quote className="absolute -left-2 -top-2 text-theme-line bg-theme-bg" size={16} />
            <p className="text-theme-muted text-sm leading-relaxed line-clamp-4 italic">
              {book.thoughts}
            </p>
          </div>
        </div>
      )}


      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-amber-100/20 rounded-full blur-2xl group-hover:bg-amber-400/10 transition-all duration-500" />
    </motion.div>
  );
}
