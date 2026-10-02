/**
 * OKURMEN — Database Seed
 *
 * Создаёт начальные данные:
 * - 1 admin (из ENV или дефолтные credentials)
 * - 1 реальный сотрудник (Азаматова Элона — предоставленные данные)
 * - 2 DEMO курса (помечены как DEMO)
 * - 1 DEMO отзыв
 * - Базовые social links (пустые URL, admin заполняет через панель)
 * - Базовые why-us features
 *
 * Запуск: npm run db:seed
 * ВАЖНО: Пароль хранится только в hashed виде (bcrypt).
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaPg } = require('@prisma/adapter-pg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require('bcryptjs');

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting OKURMEN seed...\n');

  // ─── 1. Admin ───────────────────────────────────────────────────────────────
  const adminEmail    = process.env.ADMIN_EMAIL    ?? 'admin@okurmen.kg';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@Okurmen2024';
  const passwordHash  = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where:  { email: adminEmail },
    update: {},
    create: {
      email:        adminEmail,
      username:     'admin',
      passwordHash,
      name:         'OKURMEN Admin',
      role:         'SUPER_ADMIN',
      isActive:     true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // ─── 2. Departments ─────────────────────────────────────────────────────────
  const deptSales = await prisma.department.upsert({
    where:  { id: 'dept-sales' },
    update: {},
    create: { id: 'dept-sales', nameKg: 'Сатуу бөлүмү', nameRu: 'Отдел продаж', sortOrder: 5 },
  });

  await prisma.department.upsert({
    where:  { id: 'dept-founders' },
    update: {},
    create: { id: 'dept-founders', nameKg: 'Негиздөөчүлөр', nameRu: 'Основатели', sortOrder: 1 },
  });

  await prisma.department.upsert({
    where:  { id: 'dept-teachers' },
    update: {},
    create: { id: 'dept-teachers', nameKg: 'Тренерлер', nameRu: 'Тренеры', sortOrder: 3 },
  });

  console.log('✅ Departments created');

  // ─── 3. Team Member — РЕАЛЬНЫЕ данные Элоны ─────────────────────────────────
  const elona = await prisma.teamMember.upsert({
    where:  { id: 'member-elona' },
    update: {},
    create: {
      id:           'member-elona',
      nameKg:       'Азаматова Элона Азаматовна',
      nameRu:       'Азаматова Элона Азаматовна',
      positionKg:   'Сатуу бөлүмүнүн башчысы',
      positionRu:   'Руководитель отдела продаж',
      experience:   '1 жыл 1 ай',
      photo:        '/images/okurmen/team/elona.jpg',
      departmentId: deptSales.id,
      sortOrder:    1,
      isPublished:  true,
    },
  });
  console.log(`✅ Team member created: ${elona.nameRu}`);

  // ─── 4. DEMO Courses ─────────────────────────────────────────────────────────
  const course1 = await prisma.course.upsert({
    where:  { id: 'demo-course-1' },
    update: {},
    create: {
      id:            'demo-course-1',
      titleKg:       '[DEMO] Frontend Разработка',
      titleRu:       '[DEMO] Frontend Разработка',
      shortDescKg:   'Заманбап веб-иштеп чыгуу. HTML, CSS, JavaScript, React.',
      shortDescRu:   'Современная веб-разработка. HTML, CSS, JavaScript, React.',
      descriptionKg: 'Бул DEMO курс. Чыныгы маалымат Admin Panel аркылуу кошулат.',
      descriptionRu: 'Это DEMO курс. Реальные данные добавляются через Admin Panel.',
      currency:      'KGS',
      duration:      '5 ай',
      format:        'OFFLINE',
      level:         'BEGINNER',
      totalSeats:    20,
      availableSeats: 20,
      isPublished:   true,
      sortOrder:     1,
    },
  });

  const course2 = await prisma.course.upsert({
    where:  { id: 'demo-course-2' },
    update: {},
    create: {
      id:            'demo-course-2',
      titleKg:       '[DEMO] Ораторлук Өнөр',
      titleRu:       '[DEMO] Ораторское Искусство',
      shortDescKg:   'Коомдун алдында сүйлөп, пикирди жеткирүүнү үйрөнүү.',
      shortDescRu:   'Учись говорить публично и убедительно.',
      descriptionKg: 'Бул DEMO курс. Чыныгы маалымат Admin Panel аркылуу кошулат.',
      descriptionRu: 'Это DEMO курс. Реальные данные добавляются через Admin Panel.',
      currency:      'KGS',
      duration:      '2 ай',
      format:        'OFFLINE',
      level:         'ALL_LEVELS',
      totalSeats:    15,
      availableSeats: 15,
      isPublished:   true,
      sortOrder:     2,
    },
  });

  console.log('✅ DEMO courses created');

  // ─── 5. DEMO Review ──────────────────────────────────────────────────────────
  await prisma.review.upsert({
    where:  { id: 'demo-review-1' },
    update: {},
    create: {
      id:          'demo-review-1',
      name:        '[DEMO] Студент',
      textKg:      'Бул DEMO пикир. Чыныгы пикирлер Admin Panel аркылуу кошулат.',
      textRu:      'Это DEMO отзыв. Реальные отзывы добавляются через Admin Panel.',
      rating:      5,
      courseId:    course1.id,
      isPublished: false,
    },
  });
  console.log('✅ DEMO review created (unpublished)');

  // ─── 6. Social Links ─────────────────────────────────────────────────────────
  const socialPlatforms = ['instagram', 'telegram', 'whatsapp', 'facebook', 'tiktok', 'youtube'];
  for (const platform of socialPlatforms) {
    await prisma.socialLink.upsert({
      where:  { platform },
      update: {},
      create: { platform, url: '#', isActive: false },
    });
  }
  console.log('✅ Social link placeholders created');

  // ─── 7. Why Us Features ──────────────────────────────────────────────────────
  const features = [
    { id: 'feature-1', icon: '🎯', titleKg: 'Практикалык билим',   titleRu: 'Практические знания',   descKg: 'Теория менен практиканы бириктирген окутуу',      descRu: 'Обучение, сочетающее теорию и практику',        sortOrder: 1 },
    { id: 'feature-2', icon: '👨‍🏫', titleKg: 'Күчтүү менторлор',     titleRu: 'Сильные менторы',        descKg: 'Тажрыйбалуу адистер тарабынан окутуу',           descRu: 'Обучение опытными специалистами',               sortOrder: 2 },
    { id: 'feature-3', icon: '🏛️', titleKg: 'Заманбап аудитория',   titleRu: 'Современная аудитория', descKg: 'Окуу үчүн ыңгайлуу заманбап чөйрө',               descRu: 'Современная среда для обучения',                sortOrder: 3 },
    { id: 'feature-4', icon: '🚀', titleKg: 'Реалдуу мүмкүнчүлүк', titleRu: 'Реальные возможности',   descKg: 'Билим алгандан кийин реалдуу мүмкүнчүлүктөр',    descRu: 'Реальные карьерные возможности после обучения', sortOrder: 4 },
    { id: 'feature-5', icon: '💡', titleKg: 'Өнүгүү жана колдоо',  titleRu: 'Развитие и поддержка',   descKg: 'Окутуу учурунда жана андан кийин толук колдоо',   descRu: 'Полная поддержка во время и после обучения',    sortOrder: 5 },
    { id: 'feature-6', icon: '📈', titleKg: 'Кесиптик өсүү',       titleRu: 'Профессиональный рост',  descKg: 'Кесиптик жактан өсүп, карьераңды куруп ал',       descRu: 'Расти профессионально и строй карьеру',         sortOrder: 6 },
  ];

  for (const f of features) {
    await prisma.feature.upsert({
      where:  { id: f.id },
      update: {},
      create: { ...f, isPublished: true },
    });
  }
  console.log('✅ Why Us features created');

  // ─── Done ────────────────────────────────────────────────────────────────────
  console.log('\n✨ Seed completed successfully!\n');
  console.log('📋 Summary:');
  console.log(`   Admin:    ${admin.email}`);
  console.log(`   Password: [stored as bcrypt hash — check .env.local ADMIN_PASSWORD]`);
  console.log(`   Courses:  2 DEMO (published)`);
  console.log(`   Team:     1 real member (Азаматова Элона)`);
  console.log(`   Reviews:  1 DEMO (unpublished)`);
  console.log(`   Features: 6 Why Us cards`);
  console.log(`   course2 id: ${course2.id}`);
  console.log('\n⚠️  DEMO данные помечены как [DEMO] — замени их реальными через Admin Panel.');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
