function normalizeName(value) {
  return (value || '').trim().toLowerCase();
}

function namesMatch(student, teamMember) {
  return (
    normalizeName(student?.name) === normalizeName(teamMember?.firstName) &&
    normalizeName(student?.lastname) === normalizeName(teamMember?.lastName)
  );
}

function hasMeasurements(teamMember) {
  return Boolean(
    teamMember?.heightCm && teamMember?.weightKg && teamMember?.footLengthCm
  );
}

export function mapToRenterSkiLevel({ studentLevel, teamMemberSkiLevel }) {
  if (teamMemberSkiLevel != null) {
    if (teamMemberSkiLevel <= 2) return 'BEGINNER';
    if (teamMemberSkiLevel === 3) return 'INTERMEDIATE';
    return 'EXPERT';
  }

  if (!studentLevel) return 'INTERMEDIATE';

  const level = String(studentLevel).toUpperCase();
  if (['NEVER_EVER', 'BEGINNER', 'FIRST_TIME'].includes(level)) return 'BEGINNER';
  if (level === 'INTERMEDIATE') return 'INTERMEDIATE';
  if (['ADVANCED', 'EXPERT'].includes(level)) return 'EXPERT';
  return 'INTERMEDIATE';
}

export function pickTeamMemberForRental(student, teamMembers = []) {
  if (!teamMembers.length) return null;

  const matchingWithMeasurements = teamMembers.find(
    (teamMember) => namesMatch(student, teamMember) && hasMeasurements(teamMember)
  );
  if (matchingWithMeasurements) return matchingWithMeasurements;

  const matchingByName = teamMembers.find((teamMember) => namesMatch(student, teamMember));
  if (matchingByName) return matchingByName;

  const withMeasurements = teamMembers.find(hasMeasurements);
  if (withMeasurements) return withMeasurements;

  return teamMembers[0];
}

export function buildRentalRenterFromClient(student, teamMember) {
  if (!student) return {};

  const patch = {
    renterFirstName: student.name?.trim() || teamMember?.firstName?.trim() || '',
    renterLastName: student.lastname?.trim() || teamMember?.lastName?.trim() || '',
    renterSkiLevel: mapToRenterSkiLevel({
      studentLevel: student.studentLevel,
      teamMemberSkiLevel: teamMember?.skiLevel,
    }),
  };

  if (teamMember?.heightCm != null) patch.renterHeightCm = String(teamMember.heightCm);
  if (teamMember?.weightKg != null) patch.renterWeightKg = String(teamMember.weightKg);
  if (teamMember?.footLengthCm != null) patch.renterFootLengthCm = String(teamMember.footLengthCm);

  return patch;
}

export function clearRentalRenterFields(rental) {
  return {
    ...rental,
    renterFirstName: '',
    renterLastName: '',
    renterHeightCm: '',
    renterWeightKg: '',
    renterFootLengthCm: '',
    renterSkiLevel: 'INTERMEDIATE',
  };
}
