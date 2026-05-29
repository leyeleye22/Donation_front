const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('entraide-admin-token');
}

function setToken(token: string): void {
  localStorage.setItem('entraide-admin-token', token);
}

function removeToken(): void {
  localStorage.removeItem('entraide-admin-token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  let res: Response;
  try {
    res = await fetch(`${API}${path}`, { ...options, headers });
  } catch (e) {
    throw new Error("Impossible de contacter le serveur. Verifiez votre connexion.");
  }

  if (res.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Non authentifie');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.status === 422 ? 'Donnees invalides' : 'Erreur serveur' }));
    throw new Error(err.message || `Erreur ${res.status}`);
  }

  if (res.status === 204) return null as T;

  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then(data => { setToken(data.token); return data; }),

  logout: () =>
    request('/logout', { method: 'POST' }).then(() => { removeToken(); }),

  getMe: () => request<any>('/me'),

  // Pages
  getPage: (slug: string) => request<any>(`/pages/${slug}`),
  updatePage: (slug: string, content: any) =>
    request<any>(`/pages/${slug}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    }),

  // Projects
  getProjects: (params?: string) => request<any>(`/projects${params ? '?' + params : ''}`),
  getProject: (id: string) => request<any>(`/projects/${id}`),
  createProject: (data: any) => request<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => request<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => request<void>(`/projects/${id}`, { method: 'DELETE' }),

  // Posts
  getPosts: (params?: string) => request<any>(`/posts${params ? '?' + params : ''}`),
  getPost: (id: string) => request<any>(`/posts/${id}`),
  getPostBySlug: (slug: string) => request<any>(`/posts/slug/${slug}`),
  createPost: (data: any) => request<any>('/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: (id: string, data: any) => request<any>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: (id: string) => request<void>(`/posts/${id}`, { method: 'DELETE' }),

  // Gallery
  getGallery: () => request<any>('/gallery'),
  createGalleryItem: (data: any) => request<any>('/gallery', { method: 'POST', body: JSON.stringify(data) }),
  updateGalleryItem: (id: string, data: any) => request<any>(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGalleryItem: (id: string) => request<void>(`/gallery/${id}`, { method: 'DELETE' }),

  // Media
  uploadMedia: (file: File, title?: Record<string, string>, categories?: string[]) => {
    const form = new FormData();
    form.append('file', file);
    if (title) form.append('title', JSON.stringify(title));
    if (categories) categories.forEach((c) => form.append('categories[]', c));
    return request<any>('/media/upload', { method: 'POST', body: form });
  },

  // Navigation
  getNavigation: () => request<any>('/navigation'),
  createNavigationItem: (data: any) => request<any>('/navigation', { method: 'POST', body: JSON.stringify(data) }),
  updateNavigationItem: (id: string, data: any) => request<any>(`/navigation/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNavigationItem: (id: string) => request<void>(`/navigation/${id}`, { method: 'DELETE' }),
  updateNavigationOrder: (items: { id: string; sort_order: number }[]) =>
    request<any>('/navigation/order', { method: 'PUT', body: JSON.stringify({ items }) }),

  // Settings
  getSettings: () => request<any>('/settings'),
  updateSettings: (data: any) => request<any>('/settings', { method: 'PUT', body: JSON.stringify(data) }),
  getVisibility: () => request<any>('/settings/visibility'),
  updateVisibility: (pageVisibility: any) =>
    request<any>('/settings/visibility', { method: 'PUT', body: JSON.stringify({ page_visibility: pageVisibility }) }),

  // Categories / Themes
  getCategories: (params?: string) => request<any>(`/categories${params ? '?' + params : ''}`),
  getCategory: (id: string) => request<any>(`/categories/${id}`),
  createCategory: (data: any) => request<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: any) => request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => request<void>(`/categories/${id}`, { method: 'DELETE' }),

  // Contact
  sendContactMessage: (data: { first_name: string; last_name: string; email: string; subject?: string; message: string }) =>
    request<any>('/contact', { method: 'POST', body: JSON.stringify(data) }),

  // Newsletter
  subscribeNewsletter: (email: string, name?: string) =>
    request<any>('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email, name }) }),

  unsubscribeNewsletter: (email: string) =>
    request<any>('/newsletter/unsubscribe', { method: 'POST', body: JSON.stringify({ email }) }),

  getNewsletterSubscribers: () => request<any>('/newsletter/subscribers'),

  deleteNewsletterSubscriber: (id: string) =>
    request<void>(`/newsletter/subscribers/${id}`, { method: 'DELETE' }),

  // Email templates
  getEmailTemplates: () => request<any>('/email-templates'),

  getEmailTemplate: (id: string) => request<any>(`/email-templates/${id}`),

  createEmailTemplate: (data: { name: string; subject: string; content: string }) =>
    request<any>('/email-templates', { method: 'POST', body: JSON.stringify(data) }),

  updateEmailTemplate: (id: string, data: { name?: string; subject?: string; content?: string }) =>
    request<any>(`/email-templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteEmailTemplate: (id: string) => request<void>(`/email-templates/${id}`, { method: 'DELETE' }),

  sendEmailTemplate: (id: string, overrides?: { subject?: string; content?: string }) =>
    request<any>(`/email-templates/${id}/send`, { method: 'POST', body: JSON.stringify(overrides || {}) }),

  // Dashboard
  getDashboardKpi: () => request<any>('/dashboard/kpi'),
};
