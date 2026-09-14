import React, { useState } from 'react';
import { Book, Search, Plus, CheckCircle2, AlertCircle, Bookmark } from 'lucide-react';
import { BookItem, BookBorrowing } from '../../types';
import { Language, translations } from '../../locales/translations';

interface LibraryManagementProps {
  books: BookItem[];
  borrowings: BookBorrowing[];
  onBorrowBook: (borrowing: BookBorrowing) => void;
  onReturnBook: (borrowingId: string) => void;
  language: Language;
}

export const LibraryManagement: React.FC<LibraryManagementProps> = ({
  books,
  borrowings,
  onBorrowBook,
  onReturnBook,
  language,
}) => {
  const t = translations[language];
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'activeBorrowings'>('catalog');

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Book className="w-5 h-5 text-emerald-600" />
            <span>School Library & Textbook Circulation</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            REB curriculum textbooks, literature readers, and barcode tracking for student loans.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'catalog' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Textbook Catalog
          </button>
          <button
            onClick={() => setActiveTab('activeBorrowings')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'activeBorrowings'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            Active Loans ({borrowings.filter((b) => b.status === 'Borrowed').length})
          </button>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by book title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-hidden focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((b) => (
              <div
                key={b.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {b.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{b.title}</h4>
                    <p className="text-xs text-slate-500">By {b.author}</p>
                  </div>
                  <Bookmark className="w-4 h-4 text-slate-300" />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-slate-400">ISBN: {b.isbn}</span>
                  <span className="font-bold text-emerald-700">
                    {b.availableCopies} of {b.totalCopies} Available
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activeBorrowings' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Borrowed By (Student)</th>
                <th className="py-3 px-4">Borrow Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {borrowings.map((bw) => (
                <tr key={bw.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">{bw.bookTitle}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{bw.studentName}</td>
                  <td className="py-3 px-4 text-slate-500">{bw.borrowDate}</td>
                  <td className="py-3 px-4 font-semibold text-rose-700">{bw.dueDate}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        bw.status === 'Returned'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {bw.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {bw.status === 'Borrowed' ? (
                      <button
                        onClick={() => onReturnBook(bw.id)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px]"
                      >
                        Check In / Return
                      </button>
                    ) : (
                      <span className="text-slate-400">Returned</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
