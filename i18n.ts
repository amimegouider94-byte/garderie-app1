export type Language = 'fr' | 'ar' | 'en';

export interface Translations {
  navDashboard: string;
  navChildren: string;
  navAttendance: string;
  navBilling: string;
  navJournal: string;
  navAnnouncements: string;
  navStaff: string;
  navParentPortal: string;

  childrenManagementTitle: string;
  addChildBtn: string;
  allSections: string;
  billingTitle: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    navDashboard: 'Tableau de Bord',
    navChildren: 'Enfants & Inscriptions',
    navAttendance: 'Pointage Quotidien',
    navBilling: 'Facturation & Reçus',
    navJournal: "Journal d'Éveil",
    navAnnouncements: 'Annonces & Infos',
    navStaff: 'Équipe & Personnel',
    navParentPortal: 'Espace Parent',

    childrenManagementTitle: 'Gestion des Enfants Inscrits',
    addChildBtn: 'Inscrire un Enfant',
    allSections: 'Toutes les Sections',
    billingTitle: 'Gestion de la Facturation',
  },
  ar: {
    navDashboard: 'لوحة التحكم',
    navChildren: 'الأطفال والتسجيلات',
    navAttendance: 'الحضور اليومي',
    navBilling: 'الفرترة والإيصالات',
    navJournal: 'دفتر المتابعة',
    navAnnouncements: 'الإعلانات والأخبار',
    navStaff: 'فريق العمل',
    navParentPortal: 'فضاء الأولياء',

    childrenManagementTitle: 'إدارة الأطفال المسجلين',
    addChildBtn: 'تسجيل طفل جديد',
    allSections: 'جميع الأقسام',
    billingTitle: 'إدارة الفوترة',
  },
  en: {
    navDashboard: 'Dashboard',
    navChildren: 'Children & Enrolment',
    navAttendance: 'Daily Attendance',
    navBilling: 'Billing & Invoices',
    navJournal: 'Daily Journal',
    navAnnouncements: 'Announcements',
    navStaff: 'Staff Directory',
    navParentPortal: 'Parent Portal',

    childrenManagementTitle: 'Children Management',
    addChildBtn: 'Enroll Child',
    allSections: 'All Sections',
    billingTitle: 'Billing Management',
  },
};
