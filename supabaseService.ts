import { supabase } from './supabaseClient';
import { Child, AttendanceRecord, Invoice } from './store';

// ─── CHILDREN MAPPER & SERVICES ───
export function mapRowToChild(row: any): Child {
  return {
    id: row.id,
    firstName: row.firstName ?? row.first_name ?? '',
    lastName: row.lastName ?? row.last_name ?? '',
    photo: row.photo ?? 'https://images.unsplash.com/photo-1595454116884-927636952897?auto=format&fit=crop&w=300&q=80',
    dateOfBirth: row.dateOfBirth ?? row.date_of_birth ?? '2024-01-01',
    gender: row.gender ?? 'M',
    sectionId: row.sectionId ?? row.section_id ?? 'petite',
    sectionName: row.sectionName ?? row.section_name ?? 'Petite Section',
    medicalNotes: Array.isArray(row.medicalNotes ?? row.medical_notes)
      ? (row.medicalNotes ?? row.medical_notes)
      : (row.medicalNotes ?? row.medical_notes) ? [String(row.medicalNotes ?? row.medical_notes)] : ['Aucune allergie'],
    hasMedicalAlert: Boolean(row.hasMedicalAlert ?? row.has_medical_alert ?? false),
    emergencyContact: typeof (row.emergencyContact ?? row.emergency_contact) === 'object' && (row.emergencyContact ?? row.emergency_contact) !== null
      ? (row.emergencyContact ?? row.emergency_contact)
      : { name: row.parentName ?? row.parent_name ?? '', relationship: 'Parent', phone: row.parentPhone ?? row.parent_phone ?? '' },
    parentId: row.parentId ?? row.parent_id ?? '',
    parentName: row.parentName ?? row.parent_name ?? '',
    parentPhone: row.parentPhone ?? row.parent_phone ?? '',
    parentEmail: row.parentEmail ?? row.parent_email ?? '',
    enrollmentDate: row.enrollmentDate ?? row.enrollment_date ?? new Date().toISOString().split('T')[0],
    status: row.status ?? 'active',
  };
}

export function mapChildToRow(child: Partial<Child>) {
  const row: any = {};
  if (child.id !== undefined) row.id = child.id;
  if (child.firstName !== undefined) { row.firstName = child.firstName; row.first_name = child.firstName; }
  if (child.lastName !== undefined) { row.lastName = child.lastName; row.last_name = child.lastName; }
  if (child.photo !== undefined) row.photo = child.photo;
  if (child.dateOfBirth !== undefined) { row.dateOfBirth = child.dateOfBirth; row.date_of_birth = child.dateOfBirth; }
  if (child.gender !== undefined) row.gender = child.gender;
  if (child.sectionId !== undefined) { row.sectionId = child.sectionId; row.section_id = child.sectionId; }
  if (child.sectionName !== undefined) { row.sectionName = child.sectionName; row.section_name = child.sectionName; }
  if (child.medicalNotes !== undefined) { row.medicalNotes = child.medicalNotes; row.medical_notes = child.medicalNotes; }
  if (child.hasMedicalAlert !== undefined) { row.hasMedicalAlert = child.hasMedicalAlert; row.has_medical_alert = child.hasMedicalAlert; }
  if (child.emergencyContact !== undefined) { row.emergencyContact = child.emergencyContact; row.emergency_contact = child.emergencyContact; }
  if (child.parentId !== undefined) { row.parentId = child.parentId; row.parent_id = child.parentId; }
  if (child.parentName !== undefined) { row.parentName = child.parentName; row.parent_name = child.parentName; }
  if (child.parentPhone !== undefined) { row.parentPhone = child.parentPhone; row.parent_phone = child.parentPhone; }
  if (child.parentEmail !== undefined) { row.parentEmail = child.parentEmail; row.parent_email = child.parentEmail; }
  if (child.enrollmentDate !== undefined) { row.enrollmentDate = child.enrollmentDate; row.enrollment_date = child.enrollmentDate; }
  if (child.status !== undefined) row.status = child.status;
  return row;
}

export async function fetchChildrenFromDB(): Promise<Child[]> {
  const { data, error } = await supabase.from('children').select('*');
  if (error) {
    console.warn('Supabase fetch children failed, using local/mock fallback:', error.message);
    return [];
  }
  return (data || []).map(mapRowToChild);
}

export async function insertChildToDB(child: Child): Promise<boolean> {
  const row = mapChildToRow(child);
  const { error } = await supabase.from('children').insert(row);
  if (error) {
    console.error('Supabase insert child failed:', error.message);
    return false;
  }
  return true;
}

export async function updateChildInDB(id: string, updatedFields: Partial<Child>): Promise<boolean> {
  const row = mapChildToRow(updatedFields);
  delete row.id;
  const { error } = await supabase.from('children').update(row).eq('id', id);
  if (error) {
    console.error('Supabase update child failed:', error.message);
    return false;
  }
  return true;
}

export async function deleteChildFromDB(id: string): Promise<boolean> {
  const { error } = await supabase.from('children').delete().eq('id', id);
  if (error) {
    console.error('Supabase delete child failed:', error.message);
    return false;
  }
  return true;
}

// ─── ATTENDANCE MAPPER & SERVICES ───
export function mapRowToAttendance(row: any): AttendanceRecord {
  return {
    id: row.id,
    childId: row.childId ?? row.child_id ?? '',
    date: row.date ?? new Date().toISOString().split('T')[0],
    status: row.status ?? 'present',
    checkInTime: row.checkInTime ?? row.check_in_time,
    checkOutTime: row.checkOutTime ?? row.check_out_time,
    note: row.note,
  };
}

export function mapAttendanceToRow(rec: Partial<AttendanceRecord>) {
  const row: any = {};
  if (rec.id !== undefined) row.id = rec.id;
  if (rec.childId !== undefined) { row.childId = rec.childId; row.child_id = rec.childId; }
  if (rec.date !== undefined) row.date = rec.date;
  if (rec.status !== undefined) row.status = rec.status;
  if (rec.checkInTime !== undefined) { row.checkInTime = rec.checkInTime; row.check_in_time = rec.checkInTime; }
  if (rec.checkOutTime !== undefined) { row.checkOutTime = rec.checkOutTime; row.check_out_time = rec.checkOutTime; }
  if (rec.note !== undefined) row.note = rec.note;
  return row;
}

export async function fetchAttendanceFromDB(): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase.from('attendance').select('*');
  if (error) {
    console.warn('Supabase fetch attendance failed, using local/mock fallback:', error.message);
    return [];
  }
  return (data || []).map(mapRowToAttendance);
}

export async function upsertAttendanceToDB(rec: AttendanceRecord): Promise<boolean> {
  const row = mapAttendanceToRow(rec);
  const { error } = await supabase.from('attendance').upsert(row, { onConflict: 'id' });
  if (error) {
    console.error('Supabase upsert attendance failed:', error.message);
    return false;
  }
  return true;
}

// ─── INVOICES MAPPER & SERVICES ───
export function mapRowToInvoice(row: any): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoiceNumber ?? row.invoice_number ?? '',
    childId: row.childId ?? row.child_id ?? '',
    childName: row.childName ?? row.child_name ?? '',
    parentId: row.parentId ?? row.parent_id ?? '',
    parentName: row.parentName ?? row.parent_name ?? '',
    month: row.month ?? '',
    issueDate: row.issueDate ?? row.issue_date ?? '',
    dueDate: row.dueDate ?? row.due_date ?? '',
    paidDate: row.paidDate ?? row.paid_date,
    items: Array.isArray(row.items) ? row.items : [],
    totalAmount: Number(row.totalAmount ?? row.total_amount ?? 0),
    paidAmount: Number(row.paidAmount ?? row.paid_amount ?? 0),
    status: row.status ?? 'pending',
    paymentMethod: row.paymentMethod ?? row.payment_method,
  };
}

export function mapInvoiceToRow(inv: Partial<Invoice>) {
  const row: any = {};
  if (inv.id !== undefined) row.id = inv.id;
  if (inv.invoiceNumber !== undefined) { row.invoiceNumber = inv.invoiceNumber; row.invoice_number = inv.invoiceNumber; }
  if (inv.childId !== undefined) { row.childId = inv.childId; row.child_id = inv.childId; }
  if (inv.childName !== undefined) { row.childName = inv.childName; row.child_name = inv.childName; }
  if (inv.parentId !== undefined) { row.parentId = inv.parentId; row.parent_id = inv.parentId; }
  if (inv.parentName !== undefined) { row.parentName = inv.parentName; row.parent_name = inv.parentName; }
  if (inv.month !== undefined) row.month = inv.month;
  if (inv.issueDate !== undefined) { row.issueDate = inv.issueDate; row.issue_date = inv.issueDate; }
  if (inv.dueDate !== undefined) { row.dueDate = inv.dueDate; row.due_date = inv.dueDate; }
  if (inv.paidDate !== undefined) { row.paidDate = inv.paidDate; row.paid_date = inv.paidDate; }
  if (inv.items !== undefined) row.items = inv.items;
  if (inv.totalAmount !== undefined) { row.totalAmount = inv.totalAmount; row.total_amount = inv.totalAmount; }
  if (inv.paidAmount !== undefined) { row.paidAmount = inv.paidAmount; row.paid_amount = inv.paidAmount; }
  if (inv.status !== undefined) row.status = inv.status;
  if (inv.paymentMethod !== undefined) { row.paymentMethod = inv.paymentMethod; row.payment_method = inv.paymentMethod; }
  return row;
}

export async function fetchInvoicesFromDB(): Promise<Invoice[]> {
  const { data, error } = await supabase.from('invoices').select('*');
  if (error) {
    console.warn('Supabase fetch invoices failed, using local/mock fallback:', error.message);
    return [];
  }
  return (data || []).map(mapRowToInvoice);
}

export async function createInvoiceInDB(invoice: Invoice): Promise<boolean> {
  const row = mapInvoiceToRow(invoice);
  const { error } = await supabase.from('invoices').insert(row);
  if (error) {
    console.error('Supabase insert invoice failed:', error.message);
    return false;
  }
  return true;
}

export async function updateInvoiceInDB(id: string, updatedFields: Partial<Invoice>): Promise<boolean> {
  const row = mapInvoiceToRow(updatedFields);
  delete row.id;
  const { error } = await supabase.from('invoices').update(row).eq('id', id);
  if (error) {
    console.error('Supabase update invoice failed:', error.message);
    return false;
  }
  return true;
}

export async function deleteInvoiceFromDB(id: string): Promise<boolean> {
  const { error } = await supabase.from('invoices').delete().eq('id', id);
  if (error) {
    console.error('Supabase delete invoice failed:', error.message);
    return false;
  }
  return true;
}

// ─── PROFILES & AUTHENTICATION HELPERS ───
export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'educator' | 'staff' | 'parent';
  name: string;
  assignedSectionId?: string;
  parentId?: string;
}

export async function getUserProfileFromDB(userId: string, email?: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`id.eq.${userId}${email ? `,email.eq.${email}` : ''}`)
      .maybeSingle();

    if (error || !data) {
      console.warn('Profile lookup note:', error?.message || 'No row in profiles table');
      return null;
    }

    return {
      id: data.id || userId,
      email: data.email || email || '',
      role: (data.role as any) || 'parent',
      name: data.name || data.full_name || data.email || 'Utilisateur',
      assignedSectionId: data.assigned_section_id || data.assignedSectionId,
      parentId: data.parent_id || data.parentId,
    };
  } catch (err: any) {
    console.warn('Profile fetch exception:', err.message);
    return null;
  }
}
