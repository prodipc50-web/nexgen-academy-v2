import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Tag, Plus, Edit2, Trash2, Check, X, AlertCircle, Layers } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ isOpen, onClose }) => {
  const { categories, courses, addCategory, updateCategory, deleteCategory } = useAcademy();
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMessage(`Category "${trimmed}" already exists.`);
      return;
    }
    addCategory(trimmed);
    setNewCatName('');
  };

  const handleStartEdit = (cat: string) => {
    setEditingCat(cat);
    setEditValue(cat);
    setErrorMessage(null);
  };

  const handleSaveEdit = (oldCat: string) => {
    setErrorMessage(null);
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === oldCat) {
      setEditingCat(null);
      return;
    }
    if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase() && c.toLowerCase() !== oldCat.toLowerCase())) {
      setErrorMessage(`Category "${trimmed}" already exists.`);
      return;
    }
    updateCategory(oldCat, trimmed);
    setEditingCat(null);
  };

  const handleDelete = (cat: string) => {
    setErrorMessage(null);
    const res = deleteCategory(cat);
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Manage Course Categories</h3>
              <p className="text-[11px] text-slate-400">Add, rename, or organize course categories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="space-y-1.5">
            <label className="block text-slate-700 font-bold text-xs">Add New Category</label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. AI & Robotics, Cyber Security..."
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </form>

          {/* Categories List */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Existing Categories ({categories.length})</span>
              <span>Assigned Courses</span>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {categories.map(cat => {
                const count = courses.filter(c => c.category === cat).length;
                const isEditing = editingCat === cat;

                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    {isEditing ? (
                      <div className="flex items-center space-x-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="flex-1 bg-white border border-indigo-500 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 outline-none"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveEdit(cat);
                            if (e.key === 'Escape') setEditingCat(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveEdit(cat)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCat(null)}
                          className="p-1 text-slate-400 hover:bg-slate-200 rounded-md"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                        <span className="font-bold text-slate-800 truncate">{cat}</span>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="flex items-center space-x-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            count > 0 ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {count} {count === 1 ? 'course' : 'courses'}
                        </span>
                        <button
                          onClick={() => handleStartEdit(cat)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-200 rounded-md transition-colors"
                          title="Rename Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={count > 0}
                          className={`p-1 rounded-md transition-colors ${
                            count > 0
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={count > 0 ? 'Reassign courses first to remove category' : 'Delete Category'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
