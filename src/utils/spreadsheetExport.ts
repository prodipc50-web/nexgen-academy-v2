// Utility for exporting data into Excel-compatible Spreadsheets (CSV with UTF-8 BOM)
// UTF-8 BOM (\uFEFF) ensures Excel and Google Sheets correctly render Bengali & English characters, formulas, and numeric strings

export const downloadCSV = (filename: string, csvContent: string) => {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Helper to escape CSV fields safely
export const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`;
};

// 1. Export Customer Leads
export const exportLeadsSpreadsheet = (
  leads: any[],
  courses: any[],
  staffList: any[],
  filenamePrefix = 'Nexgen_Customer_Leads'
) => {
  const headers = [
    'SL',
    'Lead Code',
    'Lead Name',
    'Phone Number',
    'Alternate Phone',
    'Email Address',
    'Address / Area',
    'Occupation',
    'Interested Course',
    'Lead Source',
    'Assigned Counselor',
    'Pipeline Stage',
    'Visit Date',
    'Visitor Remarks / সে কী বলেছে',
    'Next Follow-up Date',
    'Next Follow-up Action',
    'Created Date'
  ];

  const rows = leads.map((lead, index) => {
    const course = courses.find(c => c.id === lead.interestedCourseId);
    const counselor = staffList.find(s => s.id === lead.counselorId);

    return [
      index + 1,
      escapeCSV(lead.leadCode || `LEAD-${index + 1}`),
      escapeCSV(lead.name),
      escapeCSV(lead.phone),
      escapeCSV(lead.altPhone || ''),
      escapeCSV(lead.email || ''),
      escapeCSV(lead.address || ''),
      escapeCSV(lead.occupation || ''),
      escapeCSV(course?.name || 'General Inquiry'),
      escapeCSV(lead.leadSource || ''),
      escapeCSV(counselor?.name || 'Unassigned'),
      escapeCSV(lead.status || 'New'),
      escapeCSV(lead.visitDate || lead.createdAt?.split('T')[0] || ''),
      escapeCSV(lead.comments || ''),
      escapeCSV(lead.nextFollowUpDate || ''),
      escapeCSV(lead.nextFollowUpNotes || ''),
      escapeCSV(lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '')
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`${filenamePrefix}_${dateStr}.csv`, csv);
};

// 2. Export Specific Batch Students or All Batches Students
export const exportBatchStudentsSpreadsheet = (
  batch: any,
  admissions: any[],
  students: any[],
  course: any,
  trainer?: any
) => {
  const batchAdmissions = admissions.filter(a => a.batchId === batch.id);

  const headers = [
    'SL',
    'Batch Number',
    'Course Name',
    'Trainer Name',
    'Class Days & Time',
    'Room / Lab',
    'Student ID / Code',
    'Student Full Name',
    'Phone Number',
    'Alternate Phone',
    'Email Address',
    'Address',
    'Occupation',
    'Guardian / Father Name',
    'Total Agreed Course Fee (BDT)',
    'Total Paid Amount (BDT)',
    'Due Balance (BDT)',
    'Payment Status',
    'Next Due Date',
    'Admission Date',
    'Admission ID'
  ];

  const rows = batchAdmissions.map((adm, index) => {
    const stu = students.find(s => s.id === adm.studentId);
    const status = adm.due === 0 ? 'Fully Paid' : adm.totalPaid > 0 ? 'Partially Paid' : 'Due / Unpaid';
    const dueDate = adm.nextPaymentDate || adm.nextDueDate || (adm.due > 0 ? 'Immediate' : 'N/A');

    return [
      index + 1,
      escapeCSV(`Batch #${batch.batchNumber}`),
      escapeCSV(course?.name || 'N/A'),
      escapeCSV(batch.trainerName || trainer?.name || 'Unassigned'),
      escapeCSV(`${batch.classDays || ''} (${batch.classTime || ''})`),
      escapeCSV(batch.room || 'Lab-1'),
      escapeCSV(stu?.studentCode || 'N/A'),
      escapeCSV(stu?.name || 'N/A'),
      escapeCSV(stu?.phone || 'N/A'),
      escapeCSV(stu?.altPhone || ''),
      escapeCSV(stu?.email || ''),
      escapeCSV(stu?.address || ''),
      escapeCSV(stu?.occupation || ''),
      escapeCSV(stu?.guardianName || stu?.fatherName || ''),
      adm.finalFee || 0,
      adm.totalPaid || 0,
      adm.due || 0,
      escapeCSV(status),
      escapeCSV(dueDate),
      escapeCSV(adm.admissionDate || ''),
      escapeCSV(adm.admissionCode || adm.admissionNumber || adm.id)
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const cleanBatchName = String(batch.batchNumber).replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`Batch_${cleanBatchName}_Students_${dateStr}.csv`, csv);
};

// 3. Export All Students Directory
export const exportAllStudentsSpreadsheet = (
  students: any[],
  admissions: any[],
  courses: any[],
  batches: any[]
) => {
  const headers = [
    'SL',
    'Student Code',
    'Full Name',
    'Phone Number',
    'Alternate Phone',
    'Email Address',
    'Gender',
    'Blood Group',
    'Father Name',
    'Mother Name',
    'Present Address',
    'Permanent Address',
    'Student Status',
    'Enrolled Course',
    'Enrolled Batch',
    'Total Course Fee (BDT)',
    'Total Paid (BDT)',
    'Due Balance (BDT)',
    'Join Date'
  ];

  const rows = students.map((stu, index) => {
    const adm = admissions.find(a => a.studentId === stu.id);
    const crs = courses.find(c => c.id === adm?.courseId);
    const b = batches.find(bt => bt.id === adm?.batchId);

    return [
      index + 1,
      escapeCSV(stu.studentCode || `STU-${index + 1}`),
      escapeCSV(stu.name),
      escapeCSV(stu.phone),
      escapeCSV(stu.altPhone || ''),
      escapeCSV(stu.email || ''),
      escapeCSV(stu.gender || ''),
      escapeCSV(stu.bloodGroup || ''),
      escapeCSV(stu.fatherName || ''),
      escapeCSV(stu.motherName || ''),
      escapeCSV(stu.address || ''),
      escapeCSV(stu.permanentAddress || ''),
      escapeCSV(stu.status || 'Active'),
      escapeCSV(crs?.name || 'Not Enrolled'),
      escapeCSV(b ? `Batch #${b.batchNumber}` : 'N/A'),
      adm?.finalFee || 0,
      adm?.totalPaid || 0,
      adm?.due || 0,
      escapeCSV(stu.enrollmentDate || stu.createdAt?.split('T')[0] || '')
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`Nexgen_Students_Directory_${dateStr}.csv`, csv);
};

// 4. Export Outstanding Dues Spreadsheet
export const exportDuesSpreadsheet = (
  admissions: any[],
  students: any[],
  courses: any[],
  batches: any[]
) => {
  const dueAdmissions = admissions.filter(a => a.due > 0);

  const headers = [
    'SL',
    'Student Code',
    'Student Name',
    'Phone Number',
    'Course Name',
    'Batch Number',
    'Agreed Course Fee (BDT)',
    'Total Paid (BDT)',
    'Outstanding Due (BDT)',
    'Next Due Date',
    'Payment Status',
    'Admission Date'
  ];

  const rows = dueAdmissions.map((adm, index) => {
    const stu = students.find(s => s.id === adm.studentId);
    const crs = courses.find(c => c.id === adm.courseId);
    const b = batches.find(bt => bt.id === adm.batchId);
    const dueDate = adm.nextPaymentDate || adm.nextDueDate || 'Immediate';

    return [
      index + 1,
      escapeCSV(stu?.studentCode || 'N/A'),
      escapeCSV(stu?.name || 'N/A'),
      escapeCSV(stu?.phone || 'N/A'),
      escapeCSV(crs?.name || 'N/A'),
      escapeCSV(b ? `Batch #${b.batchNumber}` : 'N/A'),
      adm.finalFee || 0,
      adm.totalPaid || 0,
      adm.due || 0,
      escapeCSV(dueDate),
      escapeCSV(adm.paymentStatus || 'Due'),
      escapeCSV(adm.admissionDate || '')
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`Nexgen_Outstanding_Dues_Report_${dateStr}.csv`, csv);
};

// 5. Export Payments & Collections
export const exportPaymentsSpreadsheet = (
  payments: any[],
  students: any[],
  admissions: any[],
  courses: any[],
  batches: any[]
) => {
  const headers = [
    'SL',
    'Receipt Number',
    'Collection Date',
    'Student Code',
    'Student Name',
    'Phone',
    'Course Name',
    'Batch',
    'Payment Method',
    'Installment #',
    'Collected Amount (BDT)',
    'Transaction ID',
    'Collected By'
  ];

  const rows = payments.map((p, index) => {
    const stu = students.find(s => s.id === p.studentId);
    const adm = admissions.find(a => a.id === p.admissionId);
    const crs = courses.find(c => c.id === adm?.courseId);
    const b = batches.find(bt => bt.id === adm?.batchId);

    return [
      index + 1,
      escapeCSV(p.receiptNumber),
      escapeCSV(p.date),
      escapeCSV(stu?.studentCode || 'N/A'),
      escapeCSV(stu?.name || 'N/A'),
      escapeCSV(stu?.phone || ''),
      escapeCSV(crs?.name || 'Course Fee'),
      escapeCSV(b ? `Batch #${b.batchNumber}` : 'N/A'),
      escapeCSV(p.paymentMethod),
      p.installmentNumber || 1,
      p.amount,
      escapeCSV(p.transactionId || ''),
      escapeCSV(p.collectedBy || 'Admin Office')
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`Nexgen_Payment_Collections_${dateStr}.csv`, csv);
};

// 6. Export Office Expenses Ledger
export const exportExpensesSpreadsheet = (expenses: any[]) => {
  const headers = [
    'SL',
    'Expense Date',
    'Voucher / Code',
    'Category',
    'Paid To',
    'Expense Description',
    'Payment Method',
    'Amount (BDT)',
    'Approved By'
  ];

  const rows = expenses.map((e, index) => [
    index + 1,
    escapeCSV(e.date),
    escapeCSV(e.receiptNumber || e.expenseCode || `EXP-${index + 1}`),
    escapeCSV(e.category),
    escapeCSV(e.paidTo || e.paidBy || 'Office'),
    escapeCSV(e.description || ''),
    escapeCSV(e.paymentMethod),
    e.amount,
    escapeCSV(e.approvedBy || 'Management')
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`Nexgen_Expenses_Ledger_${dateStr}.csv`, csv);
};

// 7. Export Seminars & Workshops Participants
export const exportSeminarsSpreadsheet = (seminars: any[]) => {
  const headers = [
    'SL',
    'Seminar Title',
    'Date & Time',
    'Speaker Name',
    'Venue / Room',
    'Status',
    'Participant Name',
    'Phone',
    'Email',
    'Registered Date',
    'Attended Status'
  ];

  const rows: string[] = [];
  let sl = 1;

  seminars.forEach(sem => {
    if (sem.registeredParticipants && sem.registeredParticipants.length > 0) {
      sem.registeredParticipants.forEach((p: any) => {
        rows.push([
          sl++,
          escapeCSV(sem.title),
          escapeCSV(`${sem.date} ${sem.time || ''}`),
          escapeCSV(sem.speaker || ''),
          escapeCSV(sem.venue || ''),
          escapeCSV(sem.status),
          escapeCSV(p.name || ''),
          escapeCSV(p.phone || ''),
          escapeCSV(p.email || ''),
          escapeCSV(p.registeredDate || ''),
          escapeCSV(p.attended ? 'Present' : 'Absent / Registered')
        ].join(','));
      });
    } else {
      rows.push([
        sl++,
        escapeCSV(sem.title),
        escapeCSV(`${sem.date} ${sem.time || ''}`),
        escapeCSV(sem.speaker || ''),
        escapeCSV(sem.venue || ''),
        escapeCSV(sem.status),
        'No Participants Registered',
        '',
        '',
        '',
        ''
      ].join(','));
    }
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`Nexgen_Seminars_Participants_${dateStr}.csv`, csv);
};

// 8. Master Complete Backup Export (All in one ZIP or individual files)
export const exportCompleteAcademySpreadsheets = (academyData: {
  leads: any[];
  students: any[];
  admissions: any[];
  batches: any[];
  courses: any[];
  payments: any[];
  expenses: any[];
  staffList: any[];
  seminars: any[];
}) => {
  const {
    leads,
    students,
    admissions,
    batches,
    courses,
    payments,
    expenses,
    staffList,
    seminars
  } = academyData;

  // Export Leads
  exportLeadsSpreadsheet(leads, courses, staffList, 'Nexgen_BACKUP_Customer_Leads');

  // Export Students Directory
  setTimeout(() => {
    exportAllStudentsSpreadsheet(students, admissions, courses, batches);
  }, 400);

  // Export Dues
  setTimeout(() => {
    exportDuesSpreadsheet(admissions, students, courses, batches);
  }, 800);

  // Export Payments
  setTimeout(() => {
    exportPaymentsSpreadsheet(payments, students, admissions, courses, batches);
  }, 1200);

  // Export Expenses
  setTimeout(() => {
    exportExpensesSpreadsheet(expenses);
  }, 1600);
};
