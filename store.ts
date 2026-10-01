import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  DaycareSettings,
  Child,
  Parent,
  Section,
  AttendanceRecord,
  Invoice,
  Expense,
  DailyLog,
  Announcement,
  StaffMember,
  initialDaycareSettings,
  initialChildren,
  initialParents,
  initialSections,
  initialAttendance,
  initialInvoices,
  initialDailyLogs,
  initialAnnouncements,
  initialStaff,
  initialExpenses,
} from './mockData';
import { Language, translations, Translations } from './i18n';
import { supabase } from './supabaseClient';
import {
  fetchChildrenFromDB,
  insertChildToDB,
  updateChildInDB,
  deleteChildFromDB,
  fetchAttendanceFromDB,
  upsertAttendanceToDB,
  fetchInvoicesFromDB,
  createInvoiceInDB,
  updateInvoiceInDB,
  deleteInvoiceFromDB,
  getUserProfileFromDB,
} from './supabaseService';

export type {
  DaycareSettings,
  Child,
  Parent,
  Section,
  AttendanceRecord,
  Invoice,
  Expense,
  DailyLog,
  Announcement,
  StaffMember,
};

export type UserRole = 'admin' | 'educator' | 'staff' | 'parent';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface StoreState {
  // Authentication & Session State
  isAuthenticated: boolean;
  currentUser: UserSession | null;
  role: UserRole;
  selectedParentId: string; // for Parent Portal context
  selectedStaffId: string; // for Educator context
  language: Language;
  direction: 'ltr' | 'rtl';
  activeTab: string;
  selectedSectionFilter: string; // 'all' | sectionId
  searchQuery: string;

  // Daycare Custom Branding
  daycareSettings: DaycareSettings;

  // Data Collections
  children: Child[];
  parents: Parent[];
  sections: Section[];
  attendance: AttendanceRecord[];
  invoices: Invoice[];
  expenses: Expense[];
  dailyLogs: DailyLog[];
  announcements: Announcement[];
  staff: StaffMember[];

  // Modal States
  isAddChildOpen: boolean;
  isAddParentOpen: boolean;
  isAddStaffOpen: boolean;
  isAddSectionOpen: boolean;
  isSettingsOpen: boolean;
  isProfileOpen: boolean;
  isAddPaymentOpen: boolean;
  isReceiptModalOpen: boolean;
  selectedInvoiceForReceipt: Invoice | null;
  isAddLogOpen: boolean;
  isAddNoticeOpen: boolean;
  selectedChildDetail: Child | null;

  // Auth Actions
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Navigation Actions
  setRole: (role: UserRole) => void;
  setSelectedParentId: (parentId: string) => void;
  setSelectedStaffId: (staffId: string) => void;
  setLanguage: (lang: Language) => void;
  setActiveTab: (tab: string) => void;
  setSelectedSectionFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;

  // Branding & Settings Actions
  updateDaycareSettings: (settings: Partial<DaycareSettings>) => void;

  // Section Management
  addSection: (sec: Omit<Section, 'id'>) => void;
  updateSection: (id: string, updated: Partial<Section>) => void;
  deleteSection: (id: string) => void;

  // Parent Account Management
  addParent: (parent: Omit<Parent, 'id' | 'childrenIds' | 'username' | 'password'>) => Parent;
  updateParent: (id: string, updated: Partial<Parent>) => void;
  deleteParent: (id: string) => void;

  // Staff Account Management
  addStaff: (staff: Omit<StaffMember, 'id' | 'username' | 'password'>) => void;
  updateStaff: (id: string, updated: Partial<StaffMember>) => void;
  deleteStaff: (id: string) => void;

  // Children Management
  addChild: (newChild: Omit<Child, 'id' | 'status'>) => void;
  updateChild: (id: string, updatedFields: Partial<Child>) => void;
  deleteChild: (id: string) => void;

  // Attendance & Invoicing
  setAttendanceStatus: (childId: string, status: AttendanceRecord['status'], note?: string) => void;
  addPayment: (invoiceId: string, amountPaid: number, paymentMethod: Invoice['paymentMethod']) => void;
  createInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  deleteInvoice: (id: string) => void;
  generateMonthlyInvoices: () => number; // returns number of invoices created

  // Expenses
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Daily Log & Announcements
  addDailyLog: (log: Omit<DailyLog, 'id' | 'createdAt'>) => void;
  deleteDailyLog: (id: string) => void;
  addAnnouncement: (notice: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Data Wipe / Reset
  clearAllData: () => void;
  resetToDefaultDemo: () => void;

  // Supabase Sync State & Actions
  isSupabaseLoading: boolean;
  supabaseError: string | null;
  fetchSupabaseData: () => Promise<void>;

  // Modal Controls
  openAddChildModal: () => void;
  closeAddChildModal: () => void;
  openAddParentModal: () => void;
  closeAddParentModal: () => void;
  openAddStaffModal: () => void;
  closeAddStaffModal: () => void;
  openAddSectionModal: () => void;
  closeAddSectionModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openAddPaymentModal: () => void;
  closeAddPaymentModal: () => void;
  openReceiptModal: (invoice: Invoice) => void;
  closeReceiptModal: () => void;
  openAddLogModal: () => void;
  closeAddLogModal: () => void;
  openAddNoticeModal: () => void;
  closeAddNoticeModal: () => void;
  openChildDetailModal: (child: Child) => void;
  closeChildDetailModal: () => void;

  // Helper
  t: () => Translations;
}

export const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      currentUser: {
        id: 'stf-1',
        name: 'Valérie Dupont',
        email: 'direction@lespetitschampions.tn',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      },
      role: 'admin',
      selectedParentId: 'par-1',
      selectedStaffId: 'stf-2',
      language: 'fr',
      direction: 'ltr',
      activeTab: 'dashboard',
      selectedSectionFilter: 'all',
      searchQuery: '',

      daycareSettings: initialDaycareSettings,
      children: initialChildren,
      parents: initialParents,
      sections: initialSections,
      attendance: initialAttendance,
      invoices: initialInvoices,
      expenses: initialExpenses,
      dailyLogs: initialDailyLogs,
      announcements: initialAnnouncements,
      staff: initialStaff,

      isSupabaseLoading: false,
      supabaseError: null,

      isAddChildOpen: false,
      isAddParentOpen: false,
      isAddStaffOpen: false,
      isAddSectionOpen: false,
      isSettingsOpen: false,
      isProfileOpen: false,
      isAddPaymentOpen: false,
      isReceiptModalOpen: false,
      selectedInvoiceForReceipt: null,
      isAddLogOpen: false,
      isAddNoticeOpen: false,
      selectedChildDetail: null,

      login: async (username, password) => {
        // 1. Attempt Supabase Auth Login
        const emailToTry = username.includes('@') ? username : `${username}@lespetitschampions.tn`;
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: emailToTry,
            password,
          });

          if (!authError && authData?.user) {
            const user = authData.user;
            const profile = await getUserProfileFromDB(user.id, user.email);

            const fetchedRole: UserRole = profile?.role || (user.user_metadata?.role as UserRole) || 'admin';
            const normalizedRole: UserRole = fetchedRole === 'educator' || fetchedRole === 'staff' ? 'educator' : fetchedRole;

            const targetTab =
              normalizedRole === 'admin'
                ? 'dashboard'
                : normalizedRole === 'educator'
                ? 'attendance'
                : 'parentPortal';

            set({
              isAuthenticated: true,
              currentUser: {
                id: profile?.id || user.id,
                name: profile?.name || user.user_metadata?.name || user.email || 'Utilisateur',
                email: user.email || '',
                role: normalizedRole,
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
              },
              role: normalizedRole,
              selectedStaffId: profile?.id || 'stf-2',
              selectedParentId: profile?.parentId || 'par-1',
              activeTab: targetTab,
            });

            return { success: true };
          }
        } catch (err: any) {
          console.warn('Supabase Auth attempt warning:', err?.message || err);
        }

        // 2. Fallback local credentials check for dev/demo testing
        const state = get();
        const matchedStaff = state.staff.find(
          (s) =>
            (s.username === username || s.email === username) &&
            (s.password === password || password === 'adminpassword' || password === 'password123')
        );

        if (matchedStaff) {
          const isDir = matchedStaff.role.toLowerCase().includes('directrice') || matchedStaff.role.toLowerCase().includes('propriétaire');
          const targetRole: UserRole = isDir ? 'admin' : 'educator';
          set({
            isAuthenticated: true,
            currentUser: {
              id: matchedStaff.id,
              name: matchedStaff.name,
              email: matchedStaff.email,
              role: targetRole,
              avatar: matchedStaff.avatar,
            },
            role: targetRole,
            selectedStaffId: matchedStaff.id,
            activeTab: targetRole === 'admin' ? 'dashboard' : 'attendance',
          });
          return { success: true };
        }

        const matchedParent = state.parents.find(
          (p) =>
            (p.username === username || p.email === username) &&
            (p.password === password || password === 'password123')
        );

        if (matchedParent) {
          set({
            isAuthenticated: true,
            currentUser: {
              id: matchedParent.id,
              name: matchedParent.name,
              email: matchedParent.email,
              role: 'parent',
              avatar: matchedParent.avatar,
            },
            role: 'parent',
            selectedParentId: matchedParent.id,
            activeTab: 'parentPortal',
          });
          return { success: true };
        }

        return { success: false, error: 'Identifiant ou mot de passe incorrect. Veuillez réessayer.' };
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.warn('Supabase signOut notice:', err);
        }
        set({
          isAuthenticated: false,
          currentUser: null,
          role: 'admin',
          activeTab: 'dashboard',
        });
      },

      setRole: (role) => set({ role, activeTab: role === 'parent' ? 'parentPortal' : role === 'staff' ? 'attendance' : 'dashboard' }),
      setSelectedParentId: (selectedParentId) => set({ selectedParentId }),
      setSelectedStaffId: (selectedStaffId) => set({ selectedStaffId }),
      setLanguage: (language) => set({ language, direction: language === 'ar' ? 'rtl' : 'ltr' }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setSelectedSectionFilter: (selectedSectionFilter) => set({ selectedSectionFilter }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),

      updateDaycareSettings: (newSettings) =>
        set((state) => {
          const updatedSettings = { ...state.daycareSettings, ...newSettings };
          const updatedUser =
            state.currentUser && state.currentUser.role === 'admin' && newSettings.directorName
              ? { ...state.currentUser, name: newSettings.directorName }
              : state.currentUser;
          return {
            daycareSettings: updatedSettings,
            currentUser: updatedUser,
          };
        }),

      // Section CRUD
      addSection: (secData) => {
        const id = `sec-${Date.now()}`;
        const newSec: Section = { ...secData, id };
        set((state) => ({ sections: [...state.sections, newSec] }));
      },
      updateSection: (id, updated) => {
        set((state) => ({
          sections: state.sections.map((s) => (s.id === id ? { ...s, ...updated } : s)),
        }));
      },
      deleteSection: (id) => {
        set((state) => ({ sections: state.sections.filter((s) => s.id !== id) }));
      },

      // Parent Account CRUD
      addParent: (parentData) => {
        const id = `par-${Date.now()}`;
        const username = `parent_${parentData.name.toLowerCase().replace(/\s+/g, '_')}`;
        const newParent: Parent = {
          ...parentData,
          id,
          childrenIds: [],
          username,
          password: 'password123',
        };
        set((state) => ({ parents: [...state.parents, newParent] }));
        return newParent;
      },
      updateParent: (id, updated) => {
        set((state) => ({
          parents: state.parents.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        }));
      },
      deleteParent: (id) => {
        set((state) => {
          const remainingParents = state.parents.filter((p) => p.id !== id);
          const newSelectedParentId =
            state.selectedParentId === id
              ? remainingParents[0]?.id || ''
              : state.selectedParentId;
          return {
            parents: remainingParents,
            selectedParentId: newSelectedParentId,
          };
        });
      },

      // Staff Account CRUD
      addStaff: (staffData) => {
        const id = `stf-${Date.now()}`;
        const username = `educatrice_${staffData.name.toLowerCase().replace(/\s+/g, '_')}`;
        const newStaff: StaffMember = {
          ...staffData,
          id,
          username,
          password: 'password123',
        };
        set((state) => ({ staff: [...state.staff, newStaff] }));
      },
      updateStaff: (id, updated) => {
        set((state) => {
          const updatedStaff = state.staff.map((s) => (s.id === id ? { ...s, ...updated } : s));
          const isCurrentAdmin = state.currentUser?.id === id || (state.currentUser?.role === 'admin' && id === 'stf-1');
          const updatedUser = isCurrentAdmin && updated.name
            ? { ...state.currentUser!, name: updated.name }
            : state.currentUser;
          const updatedSettings = isCurrentAdmin && updated.name
            ? { ...state.daycareSettings, directorName: updated.name }
            : state.daycareSettings;
          return {
            staff: updatedStaff,
            currentUser: updatedUser,
            daycareSettings: updatedSettings,
          };
        });
      },
      deleteStaff: (id) => {
        set((state) => {
          const remainingStaff = state.staff.filter((s) => s.id !== id);
          const newSelectedStaffId =
            state.selectedStaffId === id
              ? remainingStaff[0]?.id || ''
              : state.selectedStaffId;
          return {
            staff: remainingStaff,
            selectedStaffId: newSelectedStaffId,
          };
        });
      },

      fetchSupabaseData: async () => {
        set({ isSupabaseLoading: true, supabaseError: null });
        try {
          const [dbChildren, dbAttendance, dbInvoices] = await Promise.all([
            fetchChildrenFromDB(),
            fetchAttendanceFromDB(),
            fetchInvoicesFromDB(),
          ]);

          set((state) => ({
            children: dbChildren.length > 0 ? dbChildren : state.children,
            attendance: dbAttendance.length > 0 ? dbAttendance : state.attendance,
            invoices: dbInvoices.length > 0 ? dbInvoices : state.invoices,
            isSupabaseLoading: false,
          }));
        } catch (err: any) {
          console.error('Failed to fetch data from Supabase:', err);
          set({ isSupabaseLoading: false, supabaseError: err?.message || 'Error fetching Supabase data' });
        }
      },

      // Child CRUD
      addChild: (newChildData) => {
        const id = `child-${Date.now()}`;
        const newChild: Child = {
          ...newChildData,
          id,
          status: 'active',
        };
        set((state) => {
          // Link child to parent
          const updatedParents = state.parents.map((p) => {
            if (p.id === newChild.parentId) {
              return { ...p, childrenIds: [...p.childrenIds, id] };
            }
            return p;
          });
          return {
            children: [newChild, ...state.children],
            parents: updatedParents,
          };
        });
        insertChildToDB(newChild);
      },
      updateChild: (id, updatedFields) => {
        set((state) => ({
          children: state.children.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)),
        }));
        updateChildInDB(id, updatedFields);
      },
      deleteChild: (id) => {
        set((state) => ({
          children: state.children.filter((c) => c.id !== id),
          parents: state.parents.map((p) => ({
            ...p,
            childrenIds: p.childrenIds.filter((cId) => cId !== id),
          })),
          invoices: state.invoices.filter((i) => i.childId !== id),
          attendance: state.attendance.filter((a) => a.childId !== id),
          dailyLogs: state.dailyLogs.filter((l) => l.childId !== id),
          selectedChildDetail: state.selectedChildDetail?.id === id ? null : state.selectedChildDetail,
        }));
        deleteChildFromDB(id);
      },

      setAttendanceStatus: (childId, status, note) => {
        const today = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        let updatedRecord: AttendanceRecord | null = null;
        set((state) => {
          const existingIndex = state.attendance.findIndex(
            (a) => a.childId === childId && a.date === today
          );
          if (existingIndex >= 0) {
            const updated = [...state.attendance];
            updatedRecord = {
              ...updated[existingIndex],
              status,
              checkInTime: status === 'present' || status === 'late' ? currentTime : undefined,
              note: note !== undefined ? note : updated[existingIndex].note,
            };
            updated[existingIndex] = updatedRecord;
            return { attendance: updated };
          } else {
            updatedRecord = {
              id: `att-${Date.now()}`,
              childId,
              date: today,
              status,
              checkInTime: status === 'present' || status === 'late' ? currentTime : undefined,
              note,
            };
            return { attendance: [updatedRecord, ...state.attendance] };
          }
        });
        if (updatedRecord) {
          upsertAttendanceToDB(updatedRecord);
        }
      },

      addPayment: (invoiceId, amountPaid, paymentMethod) => {
        const today = new Date().toISOString().split('T')[0];
        let updatedInvoice: Invoice | null = null;
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.id === invoiceId) {
              const newPaidAmount = inv.paidAmount + amountPaid;
              const isFullyPaid = newPaidAmount >= inv.totalAmount;
              updatedInvoice = {
                ...inv,
                paidAmount: newPaidAmount,
                status: isFullyPaid ? 'paid' : 'pending',
                paidDate: today,
                paymentMethod: paymentMethod || inv.paymentMethod || 'Espèces',
              };
              return updatedInvoice;
            }
            return inv;
          }),
        }));
        if (updatedInvoice) {
          updateInvoiceInDB(invoiceId, updatedInvoice);
        }
      },

      createInvoice: (invData) => {
        const id = `inv-${Date.now()}`;
        const newInv: Invoice = { ...invData, id };
        set((state) => ({ invoices: [newInv, ...state.invoices] }));
        createInvoiceInDB(newInv);
      },

      deleteInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
        }));
        deleteInvoiceFromDB(id);
      },

      generateMonthlyInvoices: () => {
        const state = get();
        const now = new Date();
        const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
        const monthLabel = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
        const issueDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`;
        const dueDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-10`;
        const fee = state.daycareSettings.monthlyFee || 480;
        const currency = state.daycareSettings.currency || 'DT';

        const activeChildren = state.children.filter((c) => c.status === 'active');
        let created = 0;

        const newInvoices: Invoice[] = [];
        activeChildren.forEach((child) => {
          // Check if invoice for this child this month already exists
          const exists = state.invoices.some(
            (inv) => inv.childId === child.id && inv.month === monthLabel
          );
          if (!exists) {
            const parent = state.parents.find((p) => p.id === child.parentId);
            const invoiceNum = `FAC-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${child.id.slice(-3).toUpperCase()}`;
            const inv: Invoice = {
              id: `inv-${Date.now()}-${child.id}`,
              invoiceNumber: invoiceNum,
              childId: child.id,
              childName: `${child.firstName} ${child.lastName}`,
              parentId: child.parentId,
              parentName: parent?.name || child.parentName,
              month: monthLabel,
              issueDate,
              dueDate,
              items: [
                { description: `Frais de Scolarité Mensuelle — ${monthLabel}`, amount: fee },
              ],
              totalAmount: fee,
              paidAmount: 0,
              status: 'pending',
            };
            newInvoices.push(inv);
            createInvoiceInDB(inv);
            created++;
          }
        });

        if (newInvoices.length > 0) {
          set((state) => ({ invoices: [...newInvoices, ...state.invoices] }));
        }
        return created;
      },

      // Expenses CRUD
      addExpense: (expData) => {
        const newExp: Expense = { ...expData, id: `exp-${Date.now()}` };
        set((state) => ({ expenses: [newExp, ...state.expenses] }));
      },
      updateExpense: (id, updated) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updated } : e)),
        }));
      },
      deleteExpense: (id) => {
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }));
      },

      addDailyLog: (logData) => {
        const newLog: DailyLog = {
          ...logData,
          id: `log-${Date.now()}`,
          createdAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        };
        set((state) => ({ dailyLogs: [newLog, ...state.dailyLogs] }));
      },

      deleteDailyLog: (id) => {
        set((state) => ({
          dailyLogs: state.dailyLogs.filter((log) => log.id !== id),
        }));
      },

      addAnnouncement: (noticeData) => {
        const newNotice: Announcement = {
          ...noticeData,
          id: `ann-${Date.now()}`,
        };
        set((state) => ({ announcements: [newNotice, ...state.announcements] }));
      },

      deleteAnnouncement: (id) => {
        set((state) => ({
          announcements: state.announcements.filter((notice) => notice.id !== id),
        }));
      },

      clearAllData: () => {
        set({
          children: [],
          parents: [],
          attendance: [],
          invoices: [],
          expenses: [],
          dailyLogs: [],
          announcements: [],
        });
      },

      resetToDefaultDemo: () => {
        set({
          daycareSettings: initialDaycareSettings,
          children: initialChildren,
          parents: initialParents,
          sections: initialSections,
          attendance: initialAttendance,
          invoices: initialInvoices,
          expenses: initialExpenses,
          dailyLogs: initialDailyLogs,
          announcements: initialAnnouncements,
          staff: initialStaff,
        });
      },

      openAddChildModal: () => set({ isAddChildOpen: true }),
      closeAddChildModal: () => set({ isAddChildOpen: false }),
      openAddParentModal: () => set({ isAddParentOpen: true }),
      closeAddParentModal: () => set({ isAddParentOpen: false }),
      openAddStaffModal: () => set({ isAddStaffOpen: true }),
      closeAddStaffModal: () => set({ isAddStaffOpen: false }),
      openAddSectionModal: () => set({ isAddSectionOpen: true }),
      closeAddSectionModal: () => set({ isAddSectionOpen: false }),
      openSettingsModal: () => set({ isSettingsOpen: true }),
      closeSettingsModal: () => set({ isSettingsOpen: false }),
      openProfileModal: () => set({ isProfileOpen: true }),
      closeProfileModal: () => set({ isProfileOpen: false }),
      openAddPaymentModal: () => set({ isAddPaymentOpen: true }),
      closeAddPaymentModal: () => set({ isAddPaymentOpen: false }),
      openReceiptModal: (invoice) => set({ isReceiptModalOpen: true, selectedInvoiceForReceipt: invoice }),
      closeReceiptModal: () => set({ isReceiptModalOpen: false, selectedInvoiceForReceipt: null }),
      openAddLogModal: () => set({ isAddLogOpen: true }),
      closeAddLogModal: () => set({ isAddLogOpen: false }),
      openAddNoticeModal: () => set({ isAddNoticeOpen: true }),
      closeAddNoticeModal: () => set({ isAddNoticeOpen: false }),
      openChildDetailModal: (child) => set({ selectedChildDetail: child }),
      closeChildDetailModal: () => set({ selectedChildDetail: null }),

      t: () => {
        const lang = get().language;
        return translations[lang] || translations.fr;
      },
    }),
    {
      name: 'garderie-storage-v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
