export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';
export type DocStatus = 'AVAILABLE' | 'UNAVAILABLE';

export interface Faculty {
  id: number;
  name: string;
  code?: string | null;
  departments?: Department[];
  _count?: {
    users: number;
    documents: number;
  };
}

export interface Department {
  id: number;
  name: string;
  facultyId: number;
  faculty?: Faculty;
  _count?: {
    users: number;
    documents: number;
  };
}

export interface User {
  id: string;
  userCode: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  role: Role;
  facultyId?: number | null;
  departmentId?: number | null;
  faculty?: Faculty | null;
  department?: Department | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  _count?: {
    documents: number;
  };
}

export interface Document {
  id: string;
  title: string;
  abstract?: string | null;
  author: string;
  publishedYear?: number | null;
  status: DocStatus;
  fileUrl: string;
  coverUrl?: string | null;
  tags: string[];
  categoryId: number;
  category?: Category;
  facultyId: number;
  faculty?: Faculty;
  departmentId?: number | null;
  department?: Department | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    userActivities: number;
  };
}

export interface UserActivity {
  id: string;
  userId: string;
  user?: User;
  documentId: string;
  document?: Document;
  actionType: 'VIEW' | 'DOWNLOAD';
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface DashboardStats {
  overview: {
    totalDocuments: number;
    availableDocuments: number;
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalFaculties: number;
    totalViews: number;
    totalDownloads: number;
  };
  popularDocuments: Document[];
  recentActivities: UserActivity[];
}
