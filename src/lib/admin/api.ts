const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

async function adminFetch(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('admin-token');
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-user');
      window.location.href = '/admin/login';
    }
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}

// ========== المصادقة ==========
export const authAPI = {
  login: (email: string, password: string) => adminFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  logout: () => adminFetch('/auth/logout', { method: 'POST' }),
  me: () => adminFetch('/auth/me'),
};

// ========== الأخبار ==========
export const adminNewsAPI = {
  getAll: () => adminFetch('/admin/news'),
  getOne: (id: number) => adminFetch(`/admin/news/${id}`),
  create: (data: any) => adminFetch('/admin/news', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => adminFetch(`/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => adminFetch(`/admin/news/${id}`, { method: 'DELETE' }),
};

// ========== البرامج ==========
export const adminProgramsAPI = {
  getAll: () => adminFetch('/admin/programs'),
  create: (data: any) => adminFetch('/admin/programs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => adminFetch(`/admin/programs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => adminFetch(`/admin/programs/${id}`, { method: 'DELETE' }),
};

// ========== المشاريع ==========
export const adminProjectsAPI = {
  getAll: () => adminFetch('/admin/projects'),
  create: (data: any) => adminFetch('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => adminFetch(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => adminFetch(`/admin/projects/${id}`, { method: 'DELETE' }),
};

// ========== قصص النجاح ==========
export const adminSuccessStoriesAPI = {
  getAll: () => adminFetch('/admin/success-stories'),
  create: (data: any) => adminFetch('/admin/success-stories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => adminFetch(`/admin/success-stories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => adminFetch(`/admin/success-stories/${id}`, { method: 'DELETE' }),
};

// ========== الوظائف ==========
export const adminCareersAPI = {
  getAll: () => adminFetch('/admin/careers'),
  create: (data: any) => adminFetch('/admin/careers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => adminFetch(`/admin/careers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => adminFetch(`/admin/careers/${id}`, { method: 'DELETE' }),
};

// ========== المناقصات ==========
export const adminTendersAPI = {
  getAll: () => adminFetch('/admin/tenders'),
  create: (data: any) => adminFetch('/admin/tenders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => adminFetch(`/admin/tenders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => adminFetch(`/admin/tenders/${id}`, { method: 'DELETE' }),
};

// ========== التقارير ==========
export const adminReportsAPI = {
  getAll: () => adminFetch('/admin/reports'),
  create: (data: any) => adminFetch('/admin/reports', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => adminFetch(`/admin/reports/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => adminFetch(`/admin/reports/${id}`, { method: 'DELETE' }),
};

// ========== معرض الصور ==========
export const adminGalleryAPI = {
  getAll: () => adminFetch('/admin/gallery'),
  create: (data: any) => adminFetch('/admin/gallery', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => adminFetch(`/admin/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => adminFetch(`/admin/gallery/${id}`, { method: 'DELETE' }),
};

// ========== الفيديوهات ==========
export const adminVideosAPI = {
  getAll: () => adminFetch('/admin/videos'),
  create: (data: any) => adminFetch('/admin/videos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => adminFetch(`/admin/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => adminFetch(`/admin/videos/${id}`, { method: 'DELETE' }),
};

// ========== المتطوعين ==========
export const adminVolunteersAPI = {
  getAll: () => adminFetch('/admin/volunteers'),
  updateStatus: (id: number, status: string) => adminFetch(`/admin/volunteers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id: number) => adminFetch(`/admin/volunteers/${id}`, { method: 'DELETE' }),
};

// ========== المشتركين ==========
export const adminSubscribersAPI = {
  getAll: () => adminFetch('/admin/subscribers'),
  delete: (id: number) => adminFetch(`/admin/subscribers/${id}`, { method: 'DELETE' }),
};

// ========== الإعدادات ==========
export const adminSettingsAPI = {
  getAll: () => adminFetch('/admin/settings'),
  update: (key: string, value: any) => adminFetch(`/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),
};

// ========== الإحصائيات ==========
export const adminStatsAPI = {
  getDashboard: () => adminFetch('/admin/dashboard/stats'),
  getRecent: () => adminFetch('/admin/dashboard/recent-activity'),
};
