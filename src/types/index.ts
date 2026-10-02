// ─── Shared enums (mirror Prisma enums for client use) ───────────────────────

export type CourseFormat = 'OFFLINE' | 'ONLINE' | 'HYBRID';
export type CourseLevel  = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED' | 'COMPLETED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

// ─── API Response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Course ───────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  titleKg: string;
  titleRu: string;
  descriptionKg?: string | null;
  descriptionRu?: string | null;
  shortDescKg?: string | null;
  shortDescRu?: string | null;
  price?: number | null;
  currency: string;
  duration?: string | null;
  format: CourseFormat;
  level: CourseLevel;
  totalSeats?: number | null;
  availableSeats?: number | null;
  image?: string | null;
  requirementsKg?: string | null;
  requirementsRu?: string | null;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Team Member ─────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  nameKg: string;
  nameRu: string;
  positionKg: string;
  positionRu: string;
  descriptionKg?: string | null;
  descriptionRu?: string | null;
  experience?: string | null;
  photo?: string | null;
  instagram?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
  facebook?: string | null;
  sortOrder: number;
  isPublished: boolean;
  department?: {
    id: string;
    nameKg: string;
    nameRu: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Graduate ─────────────────────────────────────────────────────────────────

export interface Graduate {
  id: string;
  name: string;
  photo?: string | null;
  graduationYear?: number | null;
  currentPosition?: string | null;
  descriptionKg?: string | null;
  descriptionRu?: string | null;
  isPublished: boolean;
  course?: Pick<Course, 'id' | 'titleKg' | 'titleRu'> | null;
  company?: { id: string; name: string; logo?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  name: string;
  photo?: string | null;
  textKg?: string | null;
  textRu?: string | null;
  rating: number;
  isPublished: boolean;
  course?: Pick<Course, 'id' | 'titleKg' | 'titleRu'> | null;
  createdAt: string;
}

export interface ParentReview {
  id: string;
  name: string;
  photo?: string | null;
  textKg?: string | null;
  textRu?: string | null;
  rating: number;
  childName?: string | null;
  isPublished: boolean;
  createdAt: string;
}

// ─── Booking ─────────────────────────────────────────────────────────────────

export interface BookingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  courseId: string;
  format: CourseFormat;
  groupName?: string;
  participants: number;
  comment?: string;
}

export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  format: CourseFormat;
  groupName?: string | null;
  participants: number;
  comment?: string | null;
  amount?: number | null;
  currency: string;
  status: BookingStatus;
  course: Pick<Course, 'id' | 'titleKg' | 'titleRu'>;
  createdAt: string;
  updatedAt: string;
}

// ─── Social Link ─────────────────────────────────────────────────────────────

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

// ─── Site Content ─────────────────────────────────────────────────────────────

export interface SiteContent {
  id: string;
  key: string;
  valueKg?: string | null;
  valueRu?: string | null;
  type: string;
}

// ─── Feature (Why Us cards) ───────────────────────────────────────────────────

export interface Feature {
  id: string;
  titleKg: string;
  titleRu: string;
  descKg?: string | null;
  descRu?: string | null;
  icon?: string | null;
  sortOrder: number;
  isPublished: boolean;
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export type GalleryType     = 'PHOTO' | 'VIDEO';
export type GalleryCategory = 'STUDENTS' | 'CLASSES' | 'EVENTS' | 'TEAM' | 'OFFICE' | 'GRADUATION' | 'OTHER';

export interface GalleryItem {
  id: string;
  titleKg?: string | null;
  titleRu?: string | null;
  url: string;
  type: GalleryType;
  category: GalleryCategory;
  sortOrder: number;
  isPublished: boolean;
}
