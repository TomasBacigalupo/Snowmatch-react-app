function displayName(person, fallback = '') {
  if (!person || typeof person !== 'object') return fallback;
  const name = [person.name, person.lastname].filter(Boolean).join(' ').trim();
  if (name) return name;
  if (person.email) return person.email;
  return fallback;
}

/**
 * Unique rostered clients across booking.eventList (teacher-rostered clients).
 */
export function getBookingRosterClients(booking) {
  const events = Array.isArray(booking?.eventList) ? booking.eventList : [];
  const byId = new Map();

  events.forEach((event) => {
    const clients = Array.isArray(event?.clients)
      ? event.clients
      : event?.clients && typeof event.clients === 'object'
        ? Object.values(event.clients)
        : [];

    clients.forEach((client) => {
      if (!client || client.id == null) return;
      if (!byId.has(client.id)) {
        byId.set(client.id, client);
      }
    });
  });

  return Array.from(byId.values());
}

/**
 * Unique rostered platform students across booking.eventList.
 */
export function getBookingRosterStudents(booking) {
  const events = Array.isArray(booking?.eventList) ? booking.eventList : [];
  const byId = new Map();

  events.forEach((event) => {
    const students = Array.isArray(event?.students)
      ? event.students
      : event?.students && typeof event.students === 'object'
        ? Object.values(event.students)
        : [];

    students.forEach((student) => {
      if (!student || student.id == null) return;
      if (!byId.has(student.id)) {
        byId.set(student.id, student);
      }
    });
  });

  return Array.from(byId.values());
}

/**
 * Label for the customer column: booking.student, else roster students, else roster clients.
 */
export function getBookingCustomerLabel(booking, emptyValue = '—') {
  const bookingStudent = booking?.student;
  const bookingStudentName = displayName(bookingStudent);
  if (bookingStudentName) return bookingStudentName;

  const rosterStudents = getBookingRosterStudents(booking);
  if (rosterStudents.length > 0) {
    return rosterStudents.map((s) => displayName(s)).filter(Boolean).join(', ') || emptyValue;
  }

  const clients = getBookingRosterClients(booking);
  if (clients.length > 0) {
    return clients.map((c) => displayName(c)).filter(Boolean).join(', ') || emptyValue;
  }

  return emptyValue;
}

export function bookingMatchesCustomerSearch(booking, query) {
  const q = String(query || '')
    .toLowerCase()
    .trim();
  if (!q) return true;

  if (String(booking?.id || '').includes(q)) return true;

  const student = booking?.student;
  const studentFull = `${student?.name || ''} ${student?.lastname || ''}`.toLowerCase();
  if (studentFull.includes(q)) return true;

  const rosterStudents = getBookingRosterStudents(booking);
  if (
    rosterStudents.some((s) =>
      `${s?.name || ''} ${s?.lastname || ''} ${s?.email || ''}`.toLowerCase().includes(q)
    )
  ) {
    return true;
  }

  const clients = getBookingRosterClients(booking);
  return clients.some((c) =>
    `${c?.name || ''} ${c?.lastname || ''} ${c?.email || ''}`.toLowerCase().includes(q)
  );
}
