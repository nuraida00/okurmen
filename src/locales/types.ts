export type Language = 'kg' | 'ru';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    courses: string;
    about: string;
    team: string;
    graduates: string;
    reviews: string;
    contact: string;
    bookCourse: string;
  };
  // Hero
  hero: {
    title: string;
    subtitle: string;
    description: string;
    btnCourses: string;
    btnBook: string;
  };
  // Why us
  whyUs: {
    sectionTitle: string;
    sectionSubtitle: string;
  };
  // Courses
  courses: {
    sectionTitle: string;
    sectionSubtitle: string;
    btnDetails: string;
    btnBook: string;
    duration: string;
    format: string;
    price: string;
    seats: string;
    seatsAvailable: string;
    level: string;
    formats: {
      OFFLINE: string;
      ONLINE: string;
      HYBRID: string;
    };
    levels: {
      BEGINNER: string;
      INTERMEDIATE: string;
      ADVANCED: string;
      ALL_LEVELS: string;
    };
    empty: string;
  };
  // Team
  team: {
    sectionTitle: string;
    sectionSubtitle: string;
    experience: string;
    empty: string;
  };
  // Graduates
  graduates: {
    sectionTitle: string;
    sectionSubtitle: string;
    worksAt: string;
    course: string;
    year: string;
    empty: string;
  };
  // Reviews
  reviews: {
    sectionTitle: string;
    sectionSubtitle: string;
    studentReviews: string;
    parentReviews: string;
    empty: string;
  };
  // About
  about: {
    sectionTitle: string;
    mission: string;
    values: string;
    history: string;
    approach: string;
    results: string;
  };
  // Booking
  booking: {
    title: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    course: string;
    format: string;
    group: string;
    participants: string;
    comment: string;
    submit: string;
    success: string;
    error: string;
    required: string;
    invalidPhone: string;
    invalidEmail: string;
  };
  // Contact
  contact: {
    sectionTitle: string;
    phone: string;
    address: string;
    workingHours: string;
    sendMessage: string;
    name: string;
    message: string;
    submit: string;
  };
  // Footer
  footer: {
    rights: string;
    followUs: string;
    quickLinks: string;
    contacts: string;
  };
  // Common
  common: {
    loading: string;
    error: string;
    empty: string;
    viewAll: string;
    back: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    publish: string;
    hide: string;
    confirm: string;
    search: string;
    filter: string;
    noData: string;
    soonContent: string;
    readMore: string;
    close: string;
  };
  // Admin
  admin: {
    dashboard: string;
    courses: string;
    team: string;
    students: string;
    graduates: string;
    reviews: string;
    bookings: string;
    payments: string;
    gallery: string;
    socialLinks: string;
    settings: string;
    logout: string;
    login: string;
    loginTitle: string;
    emailOrUsername: string;
    password: string;
    loginBtn: string;
    loginError: string;
    totalCourses: string;
    totalTeam: string;
    totalStudents: string;
    totalGraduates: string;
    totalBookings: string;
    paidOrders: string;
    totalRevenue: string;
    newApplications: string;
    recentPayments: string;
  };
}
