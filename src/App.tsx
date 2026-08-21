import React, { useState, useEffect } from 'react';
import { AcademyProvider, useAcademy } from './context/AcademyContext';
import { HeaderNavbar } from './components/layout/HeaderNavbar';
import { SidebarNav } from './components/layout/SidebarNav';

// Page Views
import { DashboardView } from './components/views/DashboardView';
import { CRMView } from './components/views/CRMView';
import { StudentsView } from './components/views/StudentsView';
import { CoursesView } from './components/views/CoursesView';
import { BatchesView } from './components/views/BatchesView';
import { ClassScheduleView } from './components/views/ClassScheduleView';
import { AssignmentsProjectsView } from './components/views/AssignmentsProjectsView';
import { AttendanceView } from './components/views/AttendanceView';
import { AccountsPaymentsView } from './components/views/AccountsPaymentsView';
import { DueManagementView } from './components/views/DueManagementView';
import { ExpensesView } from './components/views/ExpensesView';
import { FinancialReportsView } from './components/views/FinancialReportsView';
import { ExamsCertificatesView } from './components/views/ExamsCertificatesView';
import { PlacementsCareerCellView } from './components/views/PlacementsCareerCellView';
import { SeminarsWorkshopsView } from './components/views/SeminarsWorkshopsView';
import { MarketingView } from './components/views/MarketingView';
import { InventoryStaffView } from './components/views/InventoryStaffView';
import { ReportsCenterView } from './components/views/ReportsCenterView';
import { AIAssistantView } from './components/views/AIAssistantView';
import { SettingsView } from './components/views/SettingsView';
import { RecycleBinView } from './components/views/RecycleBinView';

// Modals
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { NewAdmissionModal } from './components/modals/NewAdmissionModal';
import { NewLeadModal } from './components/modals/NewLeadModal';
import { FollowUpModal } from './components/modals/FollowUpModal';
import { CollectPaymentModal } from './components/modals/CollectPaymentModal';
import { MoneyReceiptModal } from './components/modals/MoneyReceiptModal';
import { CertificateModal } from './components/modals/CertificateModal';
import { NewExpenseModal } from './components/modals/NewExpenseModal';
import { StudentProfileModal } from './components/modals/StudentProfileModal';
import { IdCardAdmitCardModal } from './components/modals/IdCardAdmitCardModal';

// Auth View
import { LoginView } from './components/auth/LoginView';

import { Lead } from './types';

const AcademyAppContent: React.FC = () => {
  const { leads, isAuthenticated } = useAcademy();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modal State Controllers (All hooks must be defined before any conditional return)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState<boolean>(false);
  const [prefilledLeadForAdmission, setPrefilledLeadForAdmission] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [followUpLeadId, setFollowUpLeadId] = useState<string | null>(null);
  const [collectPaymentAdmissionId, setCollectPaymentAdmissionId] = useState<string | null>(null);
  const [receiptNumberToPrint, setReceiptNumberToPrint] = useState<string | null>(null);
  const [certificateNumberToPrint, setCertificateNumberToPrint] = useState<string | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState<boolean>(false);
  const [selectedStudentProfileId, setSelectedStudentProfileId] = useState<string | null>(null);

  // Global Keyboard Shortcut: Ctrl/Cmd + K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If not authenticated, present the secure login portal
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const handleOpenAdmissionWithLead = (lead: Lead) => {
    setPrefilledLeadForAdmission(lead);
    setIsAdmissionModalOpen(true);
  };

  const handleOpenDirectAdmission = () => {
    setPrefilledLeadForAdmission(null);
    setIsAdmissionModalOpen(true);
  };

  const activeFollowUpLead = followUpLeadId ? leads.find(l => l.id === followUpLeadId) || null : null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased selection:bg-indigo-600 selection:text-white font-sans">
      {/* Top Universal Navbar */}
      <HeaderNavbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNewAdmission={handleOpenDirectAdmission}
        onOpenNewLead={() => setIsLeadModalOpen(true)}
        onOpenAddPayment={() => setCollectPaymentAdmissionId('')}
        onOpenAddExpense={() => setIsExpenseModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6 items-start">
        {/* Left Navigation Sidebar */}
        <SidebarNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          isOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Center Main Viewport */}
        <main className="flex-1 w-full min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenNewAdmission={handleOpenDirectAdmission}
              onOpenNewLead={() => setIsLeadModalOpen(true)}
              onOpenAddPayment={() => setCollectPaymentAdmissionId('')}
              onOpenAddExpense={() => setIsExpenseModalOpen(true)}
              onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)}
              onSelectLead={(leadId) => {
                setActiveTab('crm');
              }}
              onOpenFollowUp={(leadId) => setFollowUpLeadId(leadId)}
              onOpenCollectPayment={(admId) => setCollectPaymentAdmissionId(admId)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'crm' && (
            <CRMView
              onOpenNewLead={() => setIsLeadModalOpen(true)}
              onOpenFollowUp={(leadId) => setFollowUpLeadId(leadId)}
              onOpenAdmissionWithLead={handleOpenAdmissionWithLead}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              onOpenNewAdmission={handleOpenDirectAdmission}
              onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)}
              onOpenCollectPayment={(admId) => setCollectPaymentAdmissionId(admId)}
            />
          )}

          {activeTab === 'courses' && <CoursesView />}

          {activeTab === 'batches' && (
            <BatchesView onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)} />
          )}

          {activeTab === 'schedule' && <ClassScheduleView />}

          {(activeTab === 'assignments' || activeTab === 'projects') && <AssignmentsProjectsView />}

          {activeTab === 'attendance' && <AttendanceView />}

          {(activeTab === 'exams' || activeTab === 'certificates' || activeTab === 'exams_certificates') && (
            <ExamsCertificatesView
              onOpenCertificateModal={(certNum) => setCertificateNumberToPrint(certNum)}
            />
          )}

          {(activeTab === 'placements' || activeTab === 'careers') && <PlacementsCareerCellView />}

          {(activeTab === 'seminars' || activeTab === 'workshops') && (
            <SeminarsWorkshopsView
              onOpenNewAdmissionWithLead={handleOpenAdmissionWithLead}
            />
          )}

          {activeTab === 'payments' && (
            <AccountsPaymentsView
              onOpenAddPayment={() => setCollectPaymentAdmissionId('')}
              onOpenReceiptModal={(rNum) => setReceiptNumberToPrint(rNum)}
              onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)}
            />
          )}

          {activeTab === 'due' && (
            <DueManagementView
              onOpenCollectPayment={(admId) => setCollectPaymentAdmissionId(admId)}
              onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView onOpenAddExpense={() => setIsExpenseModalOpen(true)} />
          )}

          {(activeTab === 'financial-reports' || activeTab === 'financial_reports') && <FinancialReportsView />}

          {activeTab === 'marketing' && <MarketingView />}

          {(activeTab === 'inventory-staff' || activeTab === 'inventory_staff') && <InventoryStaffView />}

          {(activeTab === 'reports' || activeTab === 'reports_center') && <ReportsCenterView />}

          {(activeTab === 'ai-assistant' || activeTab === 'ai_copilot') && <AIAssistantView />}

          {activeTab === 'settings' && <SettingsView />}
          {(activeTab === 'recycle-bin' || activeTab === 'trash') && <RecycleBinView />}
        </main>
      </div>

      {/* Global Interactive Modals Suite */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStudent={(stuId) => setSelectedStudentProfileId(stuId)}
        onSelectLead={(leadId) => {
          setActiveTab('crm');
        }}
        onSelectCourse={(courseId) => {
          setActiveTab('courses');
        }}
        onSelectBatch={(batchId) => {
          setActiveTab('batches');
        }}
      />

      <NewAdmissionModal
        isOpen={isAdmissionModalOpen}
        onClose={() => {
          setIsAdmissionModalOpen(false);
          setPrefilledLeadForAdmission(null);
        }}
        initialLead={prefilledLeadForAdmission}
        onSuccessAdmission={(admId, rNum) => {
          if (rNum) {
            setReceiptNumberToPrint(rNum);
          }
        }}
      />

      <NewLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />

      <FollowUpModal
        isOpen={!!followUpLeadId}
        lead={activeFollowUpLead}
        onClose={() => setFollowUpLeadId(null)}
      />

      <CollectPaymentModal
        isOpen={collectPaymentAdmissionId !== null}
        targetAdmissionId={collectPaymentAdmissionId || undefined}
        onClose={() => setCollectPaymentAdmissionId(null)}
        onSuccessPayment={(rNum) => setReceiptNumberToPrint(rNum)}
      />

      <MoneyReceiptModal
        isOpen={!!receiptNumberToPrint}
        receiptNumber={receiptNumberToPrint || undefined}
        onClose={() => setReceiptNumberToPrint(null)}
      />

      <CertificateModal
        isOpen={!!certificateNumberToPrint}
        certificateId={certificateNumberToPrint || undefined}
        onClose={() => setCertificateNumberToPrint(null)}
      />

      <NewExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />

      <StudentProfileModal
        studentId={selectedStudentProfileId}
        onClose={() => setSelectedStudentProfileId(null)}
        onOpenCollectPayment={(admId) => setCollectPaymentAdmissionId(admId)}
        onOpenReceiptModal={(rNum) => setReceiptNumberToPrint(rNum)}
        onOpenCertificateModal={(certNum) => setCertificateNumberToPrint(certNum)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AcademyProvider>
      <AcademyAppContent />
    </AcademyProvider>
  );
}
