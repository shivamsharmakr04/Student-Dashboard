const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('edupulse_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export function setAuthToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('edupulse_auth_token', token);
  } else {
    localStorage.removeItem('edupulse_auth_token');
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { cache: 'no-store' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch (e) {
    return false;
  }
}

// ================= AUTH API =================
export async function apiLogin(email: string, pass: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const data = await res.json();
    if (data.success && data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Backend connection error' };
  }
}

export async function apiSignup(details: any, preferences: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...details, preferences })
    });
    const data = await res.json();
    if (data.success && data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (e: any) {
    return { success: false, error: e?.message || 'Backend connection error' };
  }
}

export async function apiUpdateProfile(userId: string, profile: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, ...profile })
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e?.message || 'Backend connection error' };
  }
}

export async function apiUpdatePreferences(userId: string, preferences: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/preferences`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, preferences })
    });
    return await res.json();
  } catch (e: any) {
    return { success: false, error: e?.message || 'Backend connection error' };
  }
}

// ================= COURSES API =================
export async function apiGetCourses(userId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/courses?userId=${encodeURIComponent(userId)}`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.courses || null;
  } catch (e) {
    return null;
  }
}

export async function apiUpdateCourseProgress(courseId: string, progress: number, completedLessons?: number) {
  try {
    const res = await fetch(`${BACKEND_URL}/courses/${courseId}/progress`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ progress, completed_lessons: completedLessons })
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
}

// ================= ASSIGNMENTS API =================
export async function apiGetAssignments(userId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/assignments?userId=${encodeURIComponent(userId)}`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.assignments || null;
  } catch (e) {
    return null;
  }
}

export async function apiSubmitAssignment(assignmentId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/assignments/${assignmentId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
}

export async function apiCreateAssignment(userId: string, assignment: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/assignments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, ...assignment })
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
}

// ================= SCHEDULE API =================
export async function apiGetSchedule(userId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/schedule?userId=${encodeURIComponent(userId)}`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.events || null;
  } catch (e) {
    return null;
  }
}

export async function apiAddScheduleEvent(userId: string, event: any) {
  try {
    const res = await fetch(`${BACKEND_URL}/schedule`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userId, ...event })
    });
    return await res.json();
  } catch (e) {
    return { success: false };
  }
}

// ================= ANALYTICS API =================
export async function apiGetAnalytics(userId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/analytics?userId=${encodeURIComponent(userId)}`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}
