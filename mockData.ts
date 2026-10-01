export interface DaycareSettings {
  name: string;
  subtitle: string;
  logo: string;
  directorName: string;
  address: string;
  phone: string;
  email: string;
  siret: string;
  currency: string;
  monthlyFee: number;       // frais mensuel de scolarité de base
  registrationFee: number;  // frais d'inscription unique
}

export interface Expense {
  id: string;
  date: string;           // YYYY-MM-DD
  category: 'salaires' | 'loyer' | 'fournitures' | 'alimentation' | 'maintenance' | 'autre';
  description: string;
  amount: number;
  paymentMethod: 'Espèces' | 'Virement Bancaire' | 'Chèque' | 'Carte';
  month: string;          // ex: 'Septembre 2026'
}

export interface Section {
  id: string;
  name: string;
  codeName: string;
  ageRange: string;
  educatorId?: string;
  educatorName: string;
  roomNumber: string;
  color: string;
  capacity: number;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  childrenIds: string[];
  avatar: string;
  occupation: string;
  username: string;
  password: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  assignedSectionId?: string;
  assignedSectionName?: string;
  avatar: string;
  status: 'on_duty' | 'off_duty' | 'leave';
  username: string;
  password: string;
}

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'M' | 'F';
  sectionId: string;
  sectionName: string;
  medicalNotes: string[];
  hasMedicalAlert: boolean;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  enrollmentDate: string;
  status: 'active' | 'archived';
}

export interface AttendanceRecord {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'excused' | 'late';
  checkInTime?: string;
  checkOutTime?: string;
  note?: string;
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  childId: string;
  childName: string;
  parentId: string;
  parentName: string;
  month: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: 'Espèces' | 'Virement Bancaire' | 'Chèque' | 'Carte';
}

export interface DailyLog {
  id: string;
  childId: string;
  childName: string;
  sectionId: string;
  date: string;
  meal: 'all' | 'partial' | 'little' | 'refused';
  mealNote?: string;
  napStart?: string;
  napEnd?: string;
  napQuality?: 'paisible' | 'agite' | 'courte';
  mood: 'joyful' | 'calm' | 'tired' | 'crying' | 'energetic';
  hygiene: string;
  educatorNote: string;
  educatorName: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  type: 'info' | 'important' | 'event';
  targetAudience: 'all' | 'parents' | 'staff';
}

export const initialDaycareSettings: DaycareSettings = {
  name: 'Les Petits Champions 🎈',
  subtitle: 'Système de Gestion de Garderie & Crèche',
  logo: '🎈',
  directorName: 'Valérie Dupont (Directrice)',
  address: '14 Avenue de la Petite Enfance, Tunis',
  phone: '+216 71 123 456',
  email: 'contact@lespetitschampions.tn',
  siret: '894 123 456 00019',
  currency: 'DT',
  monthlyFee: 480,
  registrationFee: 200,
};

export const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    date: '2026-09-01',
    category: 'salaires',
    description: 'Salaires éducatrices — Septembre 2026',
    amount: 3200,
    paymentMethod: 'Virement Bancaire',
    month: 'Septembre 2026',
  },
  {
    id: 'exp-2',
    date: '2026-09-03',
    category: 'alimentation',
    description: 'Achat repas & collations enfants — Semaine 1',
    amount: 380,
    paymentMethod: 'Espèces',
    month: 'Septembre 2026',
  },
  {
    id: 'exp-3',
    date: '2026-09-05',
    category: 'fournitures',
    description: 'Matériel pédagogique & activités d\'éveil',
    amount: 175,
    paymentMethod: 'Chèque',
    month: 'Septembre 2026',
  },
];

export const initialSections: Section[] = [
  {
    id: 'petite',
    name: 'Petite Section',
    codeName: 'Les Poussins 🐣',
    ageRange: '1 - 2 ans',
    educatorId: 'stf-2',
    educatorName: 'Sophie Martin',
    roomNumber: 'Salle 101',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
    capacity: 10,
  },
  {
    id: 'moyenne',
    name: 'Moyenne Section',
    codeName: 'Les Lutins 🎨',
    ageRange: '2 - 3 ans',
    educatorId: 'stf-3',
    educatorName: 'Amina Benali',
    roomNumber: 'Salle 102',
    color: 'bg-teal-100 text-teal-900 border-teal-300',
    capacity: 12,
  },
  {
    id: 'grande',
    name: 'Grande Section',
    codeName: 'Les Explorateurs 🚀',
    ageRange: '3 - 4 ans',
    educatorId: 'stf-4',
    educatorName: 'Clara Dubois',
    roomNumber: 'Salle 103',
    color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    capacity: 12,
  },
];

export const initialParents: Parent[] = [
  {
    id: 'par-1',
    name: 'Marc & Sophie Martin',
    phone: '+216 98 123 456',
    email: 'marc.martin@email.com',
    address: 'Les Berges du Lac, Tunis',
    childrenIds: ['child-1'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    occupation: 'Ingénieur Informatique',
    username: 'parent_martin',
    password: 'password123',
  },
  {
    id: 'par-2',
    name: 'Youssef & Leïla Benjelloun',
    phone: '+216 22 987 654',
    email: 'y.benjelloun@email.com',
    address: 'El Menzah, Tunis',
    childrenIds: ['child-2', 'child-3'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    occupation: 'Médecin Biologiste',
    username: 'parent_benjelloun',
    password: 'password123',
  },
];

export const initialStaff: StaffMember[] = [
  {
    id: 'stf-1',
    name: 'Valérie Dupont',
    role: 'Directrice & Propriétaire',
    email: 'direction@lespetitschampions.tn',
    phone: '+216 71 000 999',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status: 'on_duty',
    username: 'admin',
    password: 'adminpassword',
  },
  {
    id: 'stf-2',
    name: 'Sophie Martin',
    role: 'Éducatrice Petite Section',
    email: 'sophie.m@lespetitschampions.tn',
    phone: '+216 22 111 000',
    assignedSectionId: 'petite',
    assignedSectionName: 'Petite Section',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    status: 'on_duty',
    username: 'educatrice_sophie',
    password: 'password123',
  },
  {
    id: 'stf-3',
    name: 'Amina Benali',
    role: 'Éducatrice Moyenne Section',
    email: 'amina.b@lespetitschampions.tn',
    phone: '+216 23 222 111',
    assignedSectionId: 'moyenne',
    assignedSectionName: 'Moyenne Section',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status: 'on_duty',
    username: 'educatrice_amina',
    password: 'password123',
  },
  {
    id: 'stf-4',
    name: 'Clara Dubois',
    role: 'Éducatrice Grande Section',
    email: 'clara.d@lespetitschampions.tn',
    phone: '+216 24 333 222',
    assignedSectionId: 'grande',
    assignedSectionName: 'Grande Section',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    status: 'on_duty',
    username: 'educatrice_clara',
    password: 'password123',
  },
];

export const initialChildren: Child[] = [
  {
    id: 'child-1',
    firstName: 'Léo',
    lastName: 'Martin',
    photo: 'https://images.unsplash.com/photo-1595454116884-927636952897?auto=format&fit=crop&w=300&q=80',
    dateOfBirth: '2024-05-12',
    gender: 'M',
    sectionId: 'petite',
    sectionName: 'Petite Section - Les Poussins',
    medicalNotes: ['Allergie arachides ⚠️', 'Lactose toléré'],
    hasMedicalAlert: true,
    emergencyContact: {
      name: 'Marc Martin',
      relationship: 'Père',
      phone: '+216 98 123 456',
    },
    parentId: 'par-1',
    parentName: 'Marc & Sophie Martin',
    parentPhone: '+216 98 123 456',
    parentEmail: 'marc.martin@email.com',
    enrollmentDate: '2025-09-01',
    status: 'active',
  },
  {
    id: 'child-2',
    firstName: 'Maya',
    lastName: 'Benjelloun',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    dateOfBirth: '2024-02-18',
    gender: 'F',
    sectionId: 'petite',
    sectionName: 'Petite Section - Les Poussins',
    medicalNotes: ['Asthme léger (Ventoline dans sac)'],
    hasMedicalAlert: true,
    emergencyContact: {
      name: 'Leïla Benjelloun',
      relationship: 'Mère',
      phone: '+216 22 987 654',
    },
    parentId: 'par-2',
    parentName: 'Youssef & Leïla Benjelloun',
    parentPhone: '+216 22 987 654',
    parentEmail: 'y.benjelloun@email.com',
    enrollmentDate: '2025-09-01',
    status: 'active',
  },
  {
    id: 'child-3',
    firstName: 'Adam',
    lastName: 'Benjelloun',
    photo: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=300&q=80',
    dateOfBirth: '2023-08-10',
    gender: 'M',
    sectionId: 'moyenne',
    sectionName: 'Moyenne Section - Les Lutins',
    medicalNotes: ['Aucune allergie connue'],
    hasMedicalAlert: false,
    emergencyContact: {
      name: 'Youssef Benjelloun',
      relationship: 'Père',
      phone: '+216 22 987 654',
    },
    parentId: 'par-2',
    parentName: 'Youssef & Leïla Benjelloun',
    parentPhone: '+216 22 987 654',
    parentEmail: 'y.benjelloun@email.com',
    enrollmentDate: '2024-09-01',
    status: 'active',
  },
];

export const initialAttendance: AttendanceRecord[] = [
  { id: 'att-1', childId: 'child-1', date: '2026-09-27', status: 'present', checkInTime: '08:20', note: 'Arrivé joyeux avec sa maman' },
  { id: 'att-2', childId: 'child-2', date: '2026-09-27', status: 'present', checkInTime: '08:35', note: 'Ventoline déposée en réserve' },
  { id: 'att-3', childId: 'child-3', date: '2026-09-27', status: 'present', checkInTime: '08:15', note: 'Dépôt par son père' },
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'FAC-2026-0901',
    childId: 'child-1',
    childName: 'Léo Martin',
    parentId: 'par-1',
    parentName: 'Marc & Sophie Martin',
    month: 'Septembre 2026',
    issueDate: '2026-09-01',
    dueDate: '2026-09-10',
    paidDate: '2026-09-04',
    items: [
      { description: 'Frais de Scolarité Mensuelle (Full-Time)', amount: 480 },
      { description: 'Restauration Bio & Goûters', amount: 120 },
      { description: 'Activités d\'Éveil Musique & Arts', amount: 45 },
    ],
    totalAmount: 645,
    paidAmount: 645,
    status: 'paid',
    paymentMethod: 'Virement Bancaire',
  },
  {
    id: 'inv-102',
    invoiceNumber: 'FAC-2026-0902',
    childId: 'child-2',
    childName: 'Maya Benjelloun',
    parentId: 'par-2',
    parentName: 'Youssef & Leïla Benjelloun',
    month: 'Septembre 2026',
    issueDate: '2026-09-01',
    dueDate: '2026-09-10',
    paidDate: '2026-09-05',
    items: [
      { description: 'Frais de Scolarité Mensuelle (Full-Time)', amount: 480 },
      { description: 'Restauration Bio & Goûters', amount: 120 },
    ],
    totalAmount: 600,
    paidAmount: 600,
    status: 'paid',
    paymentMethod: 'Espèces',
  },
  {
    id: 'inv-103',
    invoiceNumber: 'FAC-2026-0903',
    childId: 'child-3',
    childName: 'Adam Benjelloun',
    parentId: 'par-2',
    parentName: 'Youssef & Leïla Benjelloun',
    month: 'Septembre 2026',
    issueDate: '2026-09-01',
    dueDate: '2026-09-10',
    paidDate: undefined,
    items: [
      { description: 'Frais de Scolarité Mensuelle (Full-Time)', amount: 480 },
      { description: 'Restauration Bio & Goûters', amount: 120 },
    ],
    totalAmount: 600,
    paidAmount: 0,
    status: 'pending',
  },
];

export const initialDailyLogs: DailyLog[] = [
  {
    id: 'log-1',
    childId: 'child-1',
    childName: 'Léo Martin',
    sectionId: 'petite',
    date: '2026-09-27',
    meal: 'all',
    mealNote: 'A mangé toute sa purée de carottes et poulet, et sa compote de pommes.',
    napStart: '13:15',
    napEnd: '15:30',
    napQuality: 'paisible',
    mood: 'joyful',
    hygiene: '2 changes effectués (11h00, 15h45). Pas de rougeurs.',
    educatorNote: 'Léo a adoré l\'atelier de peinture avec les doigts ce matin! Très participatif et souriant.',
    educatorName: 'Sophie Martin',
    createdAt: '16:00',
  },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: '🎉 Fête de l\'Automne & Atelier Légumes de Saison',
    content: 'Chers parents, nous organisons une journée festive ce Vendredi 15 Octobre! Les enfants découvriront la soupe de potiron fait maison. Merci d\'apporter un petit fruit de saison.',
    date: '2026-09-25',
    author: 'Valérie Dupont (Directrice)',
    type: 'event',
    targetAudience: 'all',
  },
];
