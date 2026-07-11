import axios from './axios';

async function fetchBookingsForPair(baseUrl, teacherId, studentId) {
  const params = new URLSearchParams();
  params.append('page', '0');
  params.append('size', '100');
  params.append('teacherId', teacherId);
  params.append('studentId', studentId);
  const response = await axios.get(`${baseUrl}?${params.toString()}`);
  return response.data ?? [];
}

export async function fetchBookingsBetweenParticipants(participantIds, { resortAdmin = false } = {}) {
  const ids = (participantIds ?? []).filter(Boolean);
  if (ids.length < 2) return [];

  const base = resortAdmin ? '/api/resort-admin/bookings/filter' : '/api/admin/bookings/filter';
  const [idA, idB] = ids;

  const [asTeacher, asStudent] = await Promise.all([
    fetchBookingsForPair(base, idA, idB),
    fetchBookingsForPair(base, idB, idA),
  ]);

  const byId = new Map();
  [...asTeacher, ...asStudent].forEach((booking) => {
    if (booking?.id != null) byId.set(booking.id, booking);
  });

  return [...byId.values()].sort((a, b) => Number(b.id) - Number(a.id));
}

export function participantDisplayName(participant) {
  if (!participant) return '—';
  const last = participant.lastname || participant.lastName || '';
  const name = [participant.name, last].filter(Boolean).join(' ').trim();
  return name || participant.email || String(participant.id);
}

export function resolveTeacherStudentParticipants(participants) {
  const list = participants ?? [];
  const teacher = list.find((p) => p.role === 'TEACHER');
  const student = list.find((p) => p.role === 'STUDENT');
  if (teacher && student) return { teacher, student };
  return { teacher: list[0] ?? null, student: list[1] ?? null };
}
