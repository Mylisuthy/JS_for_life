// src/services/courses.js
// CRUD de cursos para el dashboard admin y vista pública
const API_URL = 'http://localhost:3000/courses';

export async function getCourses() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function getCourseById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function createCourse(course) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  return res.json();
}

export async function updateCourse(id, course) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  return res.json();
}

export async function deleteCourse(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return res.ok;
}
