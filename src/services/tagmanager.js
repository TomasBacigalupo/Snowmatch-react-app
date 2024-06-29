// Tracking function for viewing a teacher's profile
export const trackViewTeacher = (teacher) => {
  window.gtag('event', 'view_content', {
    content_name: `${teacher?.name} ${teacher?.lastname}`,
    content_category: 'Teacher',
    content_ids: [teacher?.id],
    content_type: 'product',
    value: teacher?.rates?.length > 0 ? teacher?.rates[0]?.price : 0,
    currency: 'USD',
  });
};

// Tracking function for searching teachers
export const searchTeachers = (filters) => {
  window.gtag('event', 'search', {
    search_string: filters.resort,
    contents: {
      resort: filters.resort,
      from: filters.from,
      to: filters.to,
      category: filters.category,
    },
  });
};

// Tracking function for premium lesson
export const premiumLesson = () => {
  window.gtag('event', 'premium');
};

// Tracking function for standard lesson
export const standardLesson = () => {
  window.gtag('event', 'standard');
};

// Tracking function for opening Catedral page
export const openCatedral = () => {
  window.gtag('event', 'page_view');
};

// Tracking function for viewing an experience
export const trackExperience = (experience) => {
  window.gtag('event', 'view_content', {
    content_name: experience?.name,
    content_category: 'Experience',
    content_ids: [experience?.id],
    content_type: 'product',
    value: experience?.price,
    currency: 'USD',
  });
};
