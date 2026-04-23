const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('admin-token');
  const res = await fetch(`${API_URL}${endpoint}`, {
  headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...options?.headers,
},
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// ========== المصادقة ==========
export const authAPI = {
  login: (email: string, password: string) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
  me: () => fetchAPI('/auth/me'),
};

// ========== الإحصائيات ==========
export const statsAPI = {
  getDashboard: () => fetchAPI('/admin/dashboard/stats'),
  getFullStats: () => fetchAPI('/admin/statistics/full'),
  getRecentActivity: () => fetchAPI('/admin/dashboard/recent-activity'),
};

// ========== الأخبار ==========
export const newsAPI = {
  getAll: () => fetchAPI('/admin/news'),
  getOne: (id: number) => fetchAPI(`/admin/news/${id}`),
  create: (data: any) => fetchAPI('/admin/news', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/admin/news/${id}`, { method: 'DELETE' }),
  stats: () => fetchAPI('/admin/news/stats/summary'),
};

// ========== البرامج ==========
export const programsAPI = {
  getAll: () => fetchAPI('/admin/programs'),
  getOne: (id: number) => fetchAPI(`/admin/programs/${id}`),
  create: (data: any) => fetchAPI('/admin/programs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/admin/programs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/admin/programs/${id}`, { method: 'DELETE' }),
  stats: () => fetchAPI('/admin/programs/stats/summary'),
};

// ========== المشاريع ==========
export const projectsAPI = {
  getAll: () => fetchAPI('/admin/projects'),
  getOne: (id: number) => fetchAPI(`/admin/projects/${id}`),
  create: (data: any) => fetchAPI('/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/admin/projects/${id}`, { method: 'DELETE' }),
  stats: () => fetchAPI('/admin/projects/stats/summary'),
};

// ========== قصص النجاح ==========
export const successStoriesAPI = {
  getAll: () => fetchAPI('/admin/success-stories'),
  getOne: (id: number) => fetchAPI(`/admin/success-stories/${id}`),
  create: (data: any) => fetchAPI('/admin/success-stories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/admin/success-stories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/admin/success-stories/${id}`, { method: 'DELETE' }),
  stats: () => fetchAPI('/admin/success-stories/stats/summary'),
};

// ========== الوظائف ==========
export const careersAPI = {
  getAll: () => fetchAPI('/admin/careers'),
  getOne: (id: number) => fetchAPI(`/admin/careers/${id}`),
  create: (data: any) => fetchAPI('/admin/careers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/admin/careers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/admin/careers/${id}`, { method: 'DELETE' }),
};

// ========== المناقصات ==========
export const tendersAPI = {
  getAll: () => fetchAPI('/admin/tenders'),
  getOne: (id: number) => fetchAPI(`/admin/tenders/${id}`),
  create: (data: any) => fetchAPI('/admin/tenders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/admin/tenders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/admin/tenders/${id}`, { method: 'DELETE' }),
};

// ========== التقارير ==========
export const reportsAPI = {
  getAll: () => fetchAPI('/admin/reports'),
  getOne: (id: number) => fetchAPI(`/admin/reports/${id}`),
  create: (data: any) => fetchAPI('/admin/reports', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/admin/reports/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/admin/reports/${id}`, { method: 'DELETE' }),
};

// ========== معرض الصور ==========
export const galleryAPI = {
  getAll: () => fetchAPI('/admin/gallery'),
  getOne: (id: number) => fetchAPI(`/admin/gallery/${id}`),
  create: (data: any) => fetchAPI('/admin/gallery', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/admin/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/admin/gallery/${id}`, { method: 'DELETE' }),
};

// ========== الفيديوهات ==========
export const videosAPI = {
  getAll: () => fetchAPI('/admin/videos'),
  getOne: (id: number) => fetchAPI(`/admin/videos/${id}`),
  create: (data: any) => fetchAPI('/admin/videos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/admin/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/admin/videos/${id}`, { method: 'DELETE' }),
};

// ========== المتطوعين ==========
export const volunteersAPI = {
  getAll: () => fetchAPI('/admin/volunteers'),
  updateStatus: (id: number, status: string) => fetchAPI(`/admin/volunteers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  delete: (id: number) => fetchAPI(`/admin/volunteers/${id}`, { method: 'DELETE' }),
};

// ========== المشتركين ==========
export const subscribersAPI = {
  getAll: () => fetchAPI('/admin/subscribers'),
  delete: (id: number) => fetchAPI(`/admin/subscribers/${id}`, { method: 'DELETE' }),
};

// ========== الإعدادات ==========
export const settingsAPI = {
  getAll: () => fetchAPI('/admin/settings'),
  update: (key: string, value: any) => fetchAPI(`/admin/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }),
};

// ========== المستخدمين ==========
export const usersAPI = {
  getAll: () => fetchAPI('/admin/users'),
  getOne: (id: number) => fetchAPI(`/admin/users/${id}`),
  create: (data: any) => fetchAPI('/admin/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => fetchAPI(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI(`/admin/users/${id}`, { method: 'DELETE' }),
  updateStatus: (id: number, status: string) => fetchAPI(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  stats: () => fetchAPI('/admin/users/stats/summary'),
  profile: () => fetchAPI('/admin/profile'),
  updateProfile: (data: any) => fetchAPI('/admin/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// ========== البحث ==========
export const searchAPI = {
  global: (q: string) => fetchAPI(`/search?q=${encodeURIComponent(q)}`),
  inTable: (table: string, q: string) => fetchAPI(`/search/${table}?q=${encodeURIComponent(q)}`),
  filtered: (q: string, tables: string[]) => fetchAPI('/search/filtered', { method: 'POST', body: JSON.stringify({ q, tables }) }),
  autocomplete: (q: string) => fetchAPI(`/search/autocomplete?q=${encodeURIComponent(q)}`),
};
