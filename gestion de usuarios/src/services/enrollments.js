// src/services/enrollments.js
// Gestión de inscripciones a cursos
const API_URL = 'http://localhost:3000/enrollments';

export async function getEnrollmentsByUser(userId) {
  const res = await fetch(`${API_URL}?userId=${userId}`);
  return res.json();
}

export async function enrollUserToCourse(userId, courseId) {
  // Evita duplicados
  const existing = await fetch(`${API_URL}?userId=${userId}&courseId=${courseId}`);
  const exists = await existing.json();
  if (exists.length > 0) throw new Error('Ya inscrito en este curso');
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, courseId })
  });
  return res.json();
}

export async function removeEnrollment(enrollmentId) {
  const res = await fetch(`${API_URL}/${enrollmentId}`, { method: 'DELETE' });
  return res.ok;
}
