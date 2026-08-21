import React, { useState, useEffect } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Course, CourseModule, CourseStatus, DurationUnit } from '../../types';
import { DEFAULT_LEARNING_FEATURES, DEFAULT_TARGET_AUDIENCES } from '../../data/seedData';
import {
  X,
  BookOpen,
  Layers,
  Clock,
  DollarSign,
  Users,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Tag,
  Info
} from 'lucide-react';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: Course | null;
  onOpenCategoryManager?: () => void;
}

type TabType = 'basic' | 'duration_fee' | 'curriculum' | 'trainers_audience' | 'prerequisites';

const PRESET_THUMBNAILS = [
  { label: 'Computer Office', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80' },
  { label: 'Graphic Design', url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80' },
  { label: 'Video Editing', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80' },
  { label: 'Digital Marketing', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80' },
  { label: 'UI/UX Design', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Web Development', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80' },
  { label: 'AI & Automation', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80' }
];

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  initialCourse,
  onOpenCategoryManager
}) => {
  const { categories, courses, staffList, addCourse, updateCourse } = useAcademy();
  const isEditing = !!initialCourse;

  const [activeTab, setActiveTab] = useState<TabType>('basic');

  // Basic Information
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Computer & Office');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [status, setStatus] = useState<CourseStatus>('Active');

  // Duration & Schedule
  const [durationValue, setDurationValue] = useState<number>(3);
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('Months');
  const [totalClasses, setTotalClasses] = useState<number>(36);
  const [classDuration, setClassDuration] = useState('2 Hours');
  const [totalHours, setTotalHours] = useState<number>(72);

  // Fees
  const [regularFee, setRegularFee] = useState<number>(15000);
  const [offerFee, setOfferFee] = useState<number>(12000);
  const [scholarshipAvailable, setScholarshipAvailable] = useState<boolean>(true);
  const [maxScholarship, setMaxScholarship] = useState<number>(3000);
  const [minInstallmentAmount, setMinInstallmentAmount] = useState<number>(4000);

  // Curriculum & Modules
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [curriculumHighlights, setCurriculumHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState('');

  // Module Builder Helper State
  const [newTopicInput, setNewTopicInput] = useState<{ [moduleId: string]: string }>({});
  const [newOutcomeInput, setNewOutcomeInput] = useState<{ [moduleId: string]: string }>({});

  // Trainers & Target Audience
  const [trainerIds, setTrainerIds] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [customAudienceInput, setCustomAudienceInput] = useState('');

  // Prerequisites & Features
  const [requiredSkillLevel, setRequiredSkillLevel] = useState('No Prior Knowledge');
  const [minimumEducation, setMinimumEducation] = useState('SSC / Equivalent');
  const [recommendedAge, setRecommendedAge] = useState('16+ Years');
  const [requiredSoftwareHardware, setRequiredSoftwareHardware] = useState('');
  const [previousCourse, setPreviousCourse] = useState('');
  const [learningFeatures, setLearningFeatures] = useState<string[]>(['Live Class', 'Offline Class', 'Certificate']);

  // Reset or initialize form values
  useEffect(() => {
    if (initialCourse) {
      setCode(initialCourse.code);
      setName(initialCourse.name);
      setShortName(initialCourse.shortName || '');
      setCategory(initialCourse.category || categories[0] || 'Computer & Office');
      setDescription(initialCourse.description || '');
      setThumbnailUrl(initialCourse.thumbnailUrl || '');
      setStatus(initialCourse.status || 'Active');
      setDurationValue(initialCourse.durationValue || 3);
      setDurationUnit(initialCourse.durationUnit || 'Months');
      setTotalClasses(initialCourse.totalClasses || 36);
      setClassDuration(initialCourse.classDuration || '2 Hours');
      setTotalHours(initialCourse.totalHours || (initialCourse.totalClasses ? initialCourse.totalClasses * 2 : 72));
      setRegularFee(initialCourse.regularFee || 0);
      setOfferFee(initialCourse.offerFee || 0);
      setScholarshipAvailable(initialCourse.scholarshipAvailable ?? false);
      setMaxScholarship(initialCourse.maxScholarship || 0);
      setMinInstallmentAmount(initialCourse.minInstallmentAmount || 3000);
      setModules(initialCourse.modules ? JSON.parse(JSON.stringify(initialCourse.modules)) : []);
      setCurriculumHighlights(initialCourse.curriculumHighlights || initialCourse.syllabusHighlights || []);
      setTrainerIds(initialCourse.trainerIds || (initialCourse.trainerId ? [initialCourse.trainerId] : []));
      setTargetAudience(initialCourse.targetAudience || []);
      setRequiredSkillLevel(initialCourse.requiredSkillLevel || 'No Prior Knowledge');
      setMinimumEducation(initialCourse.minimumEducation || 'SSC / Equivalent');
      setRecommendedAge(initialCourse.recommendedAge || '16+ Years');
      setRequiredSoftwareHardware(initialCourse.requiredSoftwareHardware || '');
      setPreviousCourse(initialCourse.previousCourse || '');
      setLearningFeatures(initialCourse.learningFeatures || ['Live Class', 'Offline Class', 'Certificate']);
    } else {
      // Auto generate placeholder code for new course
      const nextCode = `NCA-CRS-${String(courses.length + 1).padStart(2, '0')}`;
      setCode(nextCode);
      setName('');
      setShortName('');
      setCategory(categories[0] || 'Computer & Office');
      setDescription('');
      setThumbnailUrl(PRESET_THUMBNAILS[0].url);
      setStatus('Active');
      setDurationValue(3);
      setDurationUnit('Months');
      setTotalClasses(36);
      setClassDuration('2 Hours');
      setTotalHours(72);
      setRegularFee(15000);
      setOfferFee(12000);
      setScholarshipAvailable(true);
      setMaxScholarship(3000);
      setMinInstallmentAmount(4000);
      setModules([
        {
          id: `mod-${Date.now()}-1`,
          moduleNumber: 1,
          moduleName: 'Fundamentals & Setup',
          moduleDescription: 'Introduction, core environment setup, and basic tools.',
          topics: ['Introduction & Overview', 'Tooling & Environment Setup', 'Basic Concepts & Workflow'],
          estimatedClasses: 6,
          learningOutcomes: ['Understand core terminology', 'Setup working environment']
        },
        {
          id: `mod-${Date.now()}-2`,
          moduleNumber: 2,
          moduleName: 'Advanced Techniques & Application',
          moduleDescription: 'Deep dive into advanced topics, workflows, and hands-on exercises.',
          topics: ['Intermediate Tools', 'Professional Workflow Techniques', 'Troubleshooting & Optimization'],
          estimatedClasses: 12,
          learningOutcomes: ['Apply advanced methods in practical scenarios']
        },
        {
          id: `mod-${Date.now()}-3`,
          moduleNumber: 3,
          moduleName: 'Real-world Capstone Project & Portfolio',
          moduleDescription: 'Complete real client project, portfolio preparation, and marketplace strategy.',
          topics: ['Capstone Project Building', 'Portfolio Presentation', 'Freelance & Career Guidelines'],
          estimatedClasses: 8,
          learningOutcomes: ['Build a job-ready portfolio project']
        }
      ]);
      setCurriculumHighlights(['Core Fundamentals & Setup', 'Advanced Industry Workflows', 'Hands-on Real-world Project', 'Marketplace & Career Readiness']);
      const defaultTrainer = staffList.find(s => s.role === 'TRAINER')?.id || staffList[0]?.id;
      setTrainerIds(defaultTrainer ? [defaultTrainer] : []);
      setTargetAudience(['University Student', 'Job Seeker', 'Freelancer', 'Beginner']);
      setRequiredSkillLevel('No Prior Knowledge');
      setMinimumEducation('SSC / Equivalent');
      setRecommendedAge('16+ Years');
      setRequiredSoftwareHardware('Computer with broadband internet');
      setPreviousCourse('');
      setLearningFeatures(['Live Class', 'Offline Class', 'Recorded Class', 'PDF Materials', 'Assignment', 'Project', 'Certificate']);
    }
    setActiveTab('basic');
  }, [initialCourse, isOpen]);

  // Auto calculate total hours whenever classes or duration changes
  const handleClassesChange = (num: number) => {
    setTotalClasses(num);
    const durationHours = parseFloat(classDuration) || 2;
    setTotalHours(Math.round(num * durationHours));
  };

  // Module Management Functions
  const handleAddModule = () => {
    const newNum = modules.length + 1;
    const newMod: CourseModule = {
      id: `mod-${Date.now()}-${newNum}`,
      moduleNumber: newNum,
      moduleName: `Module ${newNum}: New Learning Topic`,
      moduleDescription: '',
      topics: ['Topic 1'],
      estimatedClasses: 6,
      learningOutcomes: []
    };
    setModules([...modules, newMod]);
  };

  const handleUpdateModule = (modId: string, updates: Partial<CourseModule>) => {
    setModules(modules.map(m => (m.id === modId ? { ...m, ...updates } : m)));
  };

  const handleDeleteModule = (modId: string) => {
    const filtered = modules.filter(m => m.id !== modId);
    // Renumber remaining modules
    const renumbered = filtered.map((m, idx) => ({ ...m, moduleNumber: idx + 1 }));
    setModules(renumbered);
  };

  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === modules.length - 1) return;
    const newModules = [...modules];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newModules[index];
    newModules[index] = newModules[targetIdx];
    newModules[targetIdx] = temp;
    // Renumber
    setModules(newModules.map((m, idx) => ({ ...m, moduleNumber: idx + 1 })));
  };

  const handleAddTopicToModule = (modId: string) => {
    const topicText = (newTopicInput[modId] || '').trim();
    if (!topicText) return;
    setModules(
      modules.map(m => {
        if (m.id === modId) {
          return { ...m, topics: [...m.topics, topicText] };
        }
        return m;
      })
    );
    setNewTopicInput({ ...newTopicInput, [modId]: '' });
  };

  const handleRemoveTopic = (modId: string, topicIdx: number) => {
    setModules(
      modules.map(m => {
        if (m.id === modId) {
          return { ...m, topics: m.topics.filter((_, i) => i !== topicIdx) };
        }
        return m;
      })
    );
  };

  const handleAddOutcomeToModule = (modId: string) => {
    const outcomeText = (newOutcomeInput[modId] || '').trim();
    if (!outcomeText) return;
    setModules(
      modules.map(m => {
        if (m.id === modId) {
          return { ...m, learningOutcomes: [...(m.learningOutcomes || []), outcomeText] };
        }
        return m;
      })
    );
    setNewOutcomeInput({ ...newOutcomeInput, [modId]: '' });
  };

  const handleRemoveOutcome = (modId: string, outcomeIdx: number) => {
    setModules(
      modules.map(m => {
        if (m.id === modId) {
          return { ...m, learningOutcomes: (m.learningOutcomes || []).filter((_, i) => i !== outcomeIdx) };
        }
        return m;
      })
    );
  };

  // Highlights Adder
  const handleAddHighlight = () => {
    const text = highlightInput.trim();
    if (!text || curriculumHighlights.includes(text)) return;
    setCurriculumHighlights([...curriculumHighlights, text]);
    setHighlightInput('');
  };

  const handleRemoveHighlight = (index: number) => {
    setCurriculumHighlights(curriculumHighlights.filter((_, i) => i !== index));
  };

  // Audience Adder
  const handleToggleAudience = (aud: string) => {
    if (targetAudience.includes(aud)) {
      setTargetAudience(targetAudience.filter(a => a !== aud));
    } else {
      setTargetAudience([...targetAudience, aud]);
    }
  };

  const handleAddCustomAudience = () => {
    const text = customAudienceInput.trim();
    if (!text || targetAudience.includes(text)) return;
    setTargetAudience([...targetAudience, text]);
    setCustomAudienceInput('');
  };

  // Learning Features Toggle
  const handleToggleFeature = (feat: string) => {
    if (learningFeatures.includes(feat)) {
      setLearningFeatures(learningFeatures.filter(f => f !== feat));
    } else {
      setLearningFeatures([...learningFeatures, feat]);
    }
  };

  // Trainer Toggle
  const handleToggleTrainer = (staffId: string) => {
    if (trainerIds.includes(staffId)) {
      setTrainerIds(trainerIds.filter(id => id !== staffId));
    } else {
      setTrainerIds([...trainerIds, staffId]);
    }
  };

  if (!isOpen) return null;

  const calculatedDiscount = Math.max(0, regularFee - offerFee);
  const discountPercent = regularFee > 0 ? Math.round((calculatedDiscount / regularFee) * 100) : 0;
  const formattedDuration = `${durationValue} ${durationUnit}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a course title.');
      setActiveTab('basic');
      return;
    }
    if (!category.trim()) {
      alert('Please select or enter a category.');
      setActiveTab('basic');
      return;
    }

    const durationWeeksComputed =
      durationUnit === 'Weeks' ? durationValue : durationUnit === 'Months' ? durationValue * 4 : Math.ceil(durationValue / 7);

    const durationMonthsComputed =
      durationUnit === 'Months' ? durationValue : durationUnit === 'Weeks' ? Math.round((durationValue / 4) * 10) / 10 : Math.round((durationValue / 30) * 10) / 10;

    const coursePayload: Partial<Course> & { name: string; category: string } = {
      code: code.trim() || `NCA-CRS-${String(courses.length + 1).padStart(2, '0')}`,
      name: name.trim(),
      shortName: shortName.trim() || undefined,
      category: category.trim(),
      description: description.trim(),
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      status,
      durationValue,
      durationUnit,
      duration: formattedDuration,
      durationWeeks: durationWeeksComputed,
      durationMonths: durationMonthsComputed,
      totalClasses,
      classDuration,
      totalHours,
      regularFee: Number(regularFee) || 0,
      offerFee: Number(offerFee) || 0,
      discount: calculatedDiscount,
      scholarshipAvailable,
      maxScholarship: scholarshipAvailable ? Number(maxScholarship) : 0,
      minInstallmentAmount: Number(minInstallmentAmount) || 0,
      modules,
      curriculumHighlights,
      syllabusHighlights: curriculumHighlights,
      learningFeatures,
      trainerId: trainerIds[0] || staffList[0]?.id || 'st-05',
      trainerIds,
      requiredSkillLevel,
      minimumEducation,
      recommendedAge,
      requiredSoftwareHardware,
      previousCourse: previousCourse || undefined,
      targetAudience
    };

    if (isEditing && initialCourse) {
      updateCourse(initialCourse.id, coursePayload);
    } else {
      addCourse(coursePayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black tracking-tight">
                  {isEditing ? `Edit Course: ${initialCourse?.name}` : 'Create New Academy Course'}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : status === 'Draft'
                      ? 'bg-amber-500/20 text-amber-300'
                      : status === 'Archived'
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {status}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure curriculum, modules, fee defaults, prerequisites, and learning features
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'basic'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Basic Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('duration_fee')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'duration_fee'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>2. Duration & Fee Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('curriculum')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Curriculum & Modules ({modules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trainers_audience')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'trainers_audience'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>4. Trainers & Audience</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prerequisites')}
            className={`flex items-center space-x-2 py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'prerequisites'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>5. Prerequisites & Features</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NCA-WD-01"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold focus:bg-white focus:border-indigo-600 outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Unique system identifier</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Course Full Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Web Development with React & Node.js"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-sm focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Short / Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Full-Stack Web"
                    value={shortName}
                    onChange={e => setShortName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-bold">Category *</label>
                    {onOpenCategoryManager && (
                      <button
                        type="button"
                        onClick={onOpenCategoryManager}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                      >
                        + Manage
                      </button>
                    )}
                  </div>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-indigo-600 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Course Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as CourseStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:bg-white focus:border-indigo-600 outline-none"
                  >
                    <option value="Active">Active (Open for Admissions)</option>
                    <option value="Draft">Draft (Under Review)</option>
                    <option value="Inactive">Inactive (Paused)</option>
                    <option value="Archived">Archived (Retired)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Course Description & Overview</label>
                <textarea
                  rows={3}
                  placeholder="Provide an overview of the course objectives, tools taught, industry prospects, and practical focus..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-medium leading-relaxed focus:bg-white focus:border-indigo-600 outline-none"
                />
              </div>

              {/* Cover Image & Presets */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-800">Cover Thumbnail URL</span>
                  </div>
                  <span className="text-[10px] text-slate-400">High-res Web Image Link</span>
                </div>

                <div className="flex space-x-3">
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt="Preview"
                      className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                  )}
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={thumbnailUrl}
                    onChange={e => setThumbnailUrl(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:border-indigo-600 outline-none"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Quick Preset Thumbnails:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_THUMBNAILS.map(preset => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setThumbnailUrl(preset.url)}
                        className={`text-[10px] px-2.5 py-1 rounded-lg border transition-colors ${
                          thumbnailUrl === preset.url
                            ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DURATION & FEES */}
          {activeTab === 'duration_fee' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-2.5 text-blue-900 text-xs">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Template Fee Settings</span>
                  <span>
                    Fee settings configured here serve as defaults when enrolling new students. Individual student
                    admissions maintain their own agreed fee, custom discounts, and scholarship records to guarantee
                    historical financial integrity.
                  </span>
                </div>
              </div>

              {/* Duration Settings */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="font-bold text-slate-800 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Duration & Class Schedule</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Duration Value</label>
                    <input
                      type="number"
                      min={1}
                      value={durationValue}
                      onChange={e => setDurationValue(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Duration Unit</label>
                    <select
                      value={durationUnit}
                      onChange={e => setDurationUnit(e.target.value as DurationUnit)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                    >
                      <option value="Days">Days</option>
                      <option value="Weeks">Weeks</option>
                      <option value="Months">Months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Formatted Duration Display</label>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2 text-indigo-950 font-black">
                      {formattedDuration}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Total Classes (Sessions)</label>
                    <input
                      type="number"
                      min={1}
                      value={totalClasses}
                      onChange={e => handleClassesChange(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Session Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Hours"
                      value={classDuration}
                      onChange={e => {
                        setClassDuration(e.target.value);
                        const dur = parseFloat(e.target.value) || 2;
                        setTotalHours(Math.round(totalClasses * dur));
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Total Learning Hours</label>
                    <input
                      type="number"
                      value={totalHours}
                      onChange={e => setTotalHours(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fee Settings */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Fee Structure & Payment Templates</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Standard Regular Fee (৳) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={regularFee}
                      onChange={e => setRegularFee(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-black text-sm outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Default Offer / Payable Fee (৳) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={offerFee}
                      onChange={e => setOfferFee(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-indigo-700 font-black text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Computed Discount Summary */}
                <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Standard Discount (৳)</span>
                    <span className="text-sm font-bold text-slate-800">৳{calculatedDiscount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Discount Percentage</span>
                    <span className="text-sm font-bold text-emerald-600">{discountPercent}% Off</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Scholarship Eligible?</label>
                    <button
                      type="button"
                      onClick={() => setScholarshipAvailable(!scholarshipAvailable)}
                      className={`w-full py-2 px-3 rounded-xl border font-bold text-xs transition-colors flex items-center justify-center space-x-2 ${
                        scholarshipAvailable
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${scholarshipAvailable ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>{scholarshipAvailable ? 'Scholarship Available' : 'No Scholarship'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Max Scholarship Limit (৳)</label>
                    <input
                      type="number"
                      disabled={!scholarshipAvailable}
                      value={maxScholarship}
                      onChange={e => setMaxScholarship(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none disabled:opacity-40"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Min Installment Amount (৳)</label>
                    <input
                      type="number"
                      min={0}
                      value={minInstallmentAmount}
                      onChange={e => setMinInstallmentAmount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CURRICULUM & MODULES BUILDER */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Course Syllabus & Curriculum Modules</h4>
                  <p className="text-slate-500 text-[11px]">
                    Build detailed learning modules, lecture topics, and expected practical outcomes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Module</span>
                </button>
              </div>

              {/* Modules List */}
              <div className="space-y-3.5">
                {modules.map((mod, index) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                          {mod.moduleNumber}
                        </span>
                        <input
                          type="text"
                          value={mod.moduleName}
                          onChange={e => handleUpdateModule(mod.id, { moduleName: e.target.value })}
                          placeholder="Module Name (e.g. Advanced Vector Art & Generative AI)"
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-900 outline-none focus:border-indigo-600 text-xs"
                        />
                      </div>

                      {/* Reorder & Actions */}
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveModule(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveModule(index, 'down')}
                          disabled={index === modules.length - 1}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteModule(mod.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={mod.moduleDescription || ''}
                          onChange={e => handleUpdateModule(mod.id, { moduleDescription: e.target.value })}
                          placeholder="Module summary or learning focus..."
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          min={1}
                          value={mod.estimatedClasses || 6}
                          onChange={e => handleUpdateModule(mod.id, { estimatedClasses: Number(e.target.value) })}
                          placeholder="Classes"
                          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-900 font-bold outline-none text-xs text-center"
                          title="Estimated Classes"
                        />
                      </div>
                    </div>

                    {/* Topics Sub-section */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Topics Covered ({mod.topics.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {mod.topics.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center space-x-1 bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            <span>{t}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTopic(mod.id, tIdx)}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Add Topic Input */}
                      <div className="flex space-x-1.5 pt-1">
                        <input
                          type="text"
                          placeholder="Add topic (e.g. Master Pen Tool, Flexbox, API Keys) and click Add"
                          value={newTopicInput[mod.id] || ''}
                          onChange={e => setNewTopicInput({ ...newTopicInput, [mod.id]: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTopicToModule(mod.id);
                            }
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-indigo-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddTopicToModule(mod.id)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs"
                        >
                          + Add Topic
                        </button>
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Learning Outcomes / Practical Deliverables
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(mod.learningOutcomes || []).map((out, oIdx) => (
                          <span
                            key={oIdx}
                            className="inline-flex items-center space-x-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            <span>{out}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveOutcome(mod.id, oIdx)}
                              className="text-emerald-500 hover:text-rose-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-1.5 pt-0.5">
                        <input
                          type="text"
                          placeholder="Add practical deliverable or outcome..."
                          value={newOutcomeInput[mod.id] || ''}
                          onChange={e => setNewOutcomeInput({ ...newOutcomeInput, [mod.id]: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOutcomeToModule(mod.id);
                            }
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 outline-none focus:border-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddOutcomeToModule(mod.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
                        >
                          + Add Outcome
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Course Highlights / Quick Badges */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 mt-4">
                <span className="text-xs font-bold text-slate-800 block">
                  Curriculum Highlights (Short Badges for Course Cards)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {curriculumHighlights.map((hl, hIdx) => (
                    <span
                      key={hIdx}
                      className="inline-flex items-center space-x-1 bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold px-2.5 py-1 rounded-lg text-xs"
                    >
                      <span>{hl}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(hIdx)}
                        className="text-indigo-400 hover:text-rose-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2 pt-1">
                  <input
                    type="text"
                    placeholder="e.g. Advanced Excel, Generative AI Art, REST APIs..."
                    value={highlightInput}
                    onChange={e => setHighlightInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                  >
                    Add Highlight
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRAINERS & AUDIENCE */}
          {activeTab === 'trainers_audience' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              {/* Assigned Trainers */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900">Assigned Faculty / Trainers</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Select faculty certified to teach this program</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {staffList.map(staff => {
                    const isSelected = trainerIds.includes(staff.id);
                    return (
                      <div
                        key={staff.id}
                        onClick={() => handleToggleTrainer(staff.id)}
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={staff.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={staff.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="text-xs font-bold block">{staff.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{staff.designation}</span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Target Audience */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">Target Student Audience</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Who is this course best suited for?</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {DEFAULT_TARGET_AUDIENCES.map(aud => {
                    const isSelected = targetAudience.includes(aud);
                    return (
                      <button
                        key={aud}
                        type="button"
                        onClick={() => handleToggleAudience(aud)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-bold transition-colors ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {aud}
                      </button>
                    );
                  })}
                  {targetAudience
                    .filter(a => !DEFAULT_TARGET_AUDIENCES.includes(a))
                    .map(aud => (
                      <button
                        key={aud}
                        type="button"
                        onClick={() => handleToggleAudience(aud)}
                        className="text-xs px-3 py-1.5 rounded-xl border font-bold bg-indigo-600 text-white border-indigo-600 shadow-2xs flex items-center space-x-1"
                      >
                        <span>{aud}</span>
                        <X className="w-3 h-3 ml-1" />
                      </button>
                    ))}
                </div>

                <div className="flex space-x-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add custom target audience..."
                    value={customAudienceInput}
                    onChange={e => setCustomAudienceInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomAudience();
                      }
                    }}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAudience}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PREREQUISITES & FEATURES */}
          {activeTab === 'prerequisites' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              {/* Prerequisites Grid */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Academic & Technical Prerequisites</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Required Skill Level</label>
                    <select
                      value={requiredSkillLevel}
                      onChange={e => setRequiredSkillLevel(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    >
                      <option value="No Prior Knowledge">No Prior Knowledge</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Minimum Education</label>
                    <select
                      value={minimumEducation}
                      onChange={e => setMinimumEducation(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    >
                      <option value="Any">Any</option>
                      <option value="SSC / Equivalent">SSC / Equivalent</option>
                      <option value="HSC / Equivalent">HSC / Equivalent</option>
                      <option value="Diploma / Graduate">Diploma / Graduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Recommended Age</label>
                    <input
                      type="text"
                      placeholder="e.g. 16+ Years"
                      value={recommendedAge}
                      onChange={e => setRecommendedAge(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Required Hardware & Software Specs</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Laptop with 8GB RAM, Dedicated GPU for 3D/Video, Windows 10/11"
                      value={requiredSoftwareHardware}
                      onChange={e => setRequiredSoftwareHardware(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Previous Course Prerequisite (Optional)</label>
                    <select
                      value={previousCourse}
                      onChange={e => setPreviousCourse(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold outline-none"
                    >
                      <option value="">None (Entry Level Course)</option>
                      {courses
                        .filter(c => !initialCourse || c.id !== initialCourse.id)
                        .map(c => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.code})
                          </option>
                        ))}
                    </select>
                    <span className="text-[10px] text-slate-400 mt-1 block">Students must complete this course before enrolling</span>
                  </div>
                </div>
              </div>

              {/* Learning Features Checklist */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900">Included Learning Features & Assets</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Features provided to enrolled students</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DEFAULT_LEARNING_FEATURES.map(feat => {
                    const isChecked = learningFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => handleToggleFeature(feat)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          isChecked
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-950 font-bold'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <span className="text-xs">{feat}</span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center ${
                            isChecked ? 'bg-amber-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">
                {isEditing ? `Editing ID: ${initialCourse?.id}` : 'Auto-generating new unique ID'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs transition-colors"
              >
                {isEditing ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
