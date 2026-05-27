import { PrismaClient, Role, PublishStatus, QuizStatus, QuestionType } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@lenslab.test" },
    update: { name: "Admin LensLab", passwordHash, role: Role.ADMIN },
    create: { name: "Admin LensLab", email: "admin@lenslab.test", passwordHash, role: Role.ADMIN }
  });

  const mentor = await prisma.user.upsert({
    where: { email: "mentor@lenslab.test" },
    update: { name: "Mentor Jurnalistik", passwordHash, role: Role.MENTOR },
    create: { name: "Mentor Jurnalistik", email: "mentor@lenslab.test", passwordHash, role: Role.MENTOR }
  });

  const siswa = await prisma.user.upsert({
    where: { email: "siswa@lenslab.test" },
    update: { name: "Siswa Demo", passwordHash, role: Role.STUDENT, className: "X-1" },
    create: { name: "Siswa Demo", email: "siswa@lenslab.test", passwordHash, role: Role.STUDENT, className: "X-1" }
  });

  const categories = [
    "Dasar Kamera DSLR",
    "Exposure Triangle",
    "Komposisi Foto",
    "Fotografi Jurnalistik",
    "Etika Foto Jurnalistik",
    "Caption Foto 5W+1H",
    "Editing Dasar",
    "Praktik Liputan Sekolah"
  ];

  const categoryRecords = [];
  for (const name of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: slugify(name, { lower: true }) },
      update: {},
      create: { name, slug: slugify(name, { lower: true }), description: `Kategori pembelajaran ${name}` }
    });
    categoryRecords.push(cat);
  }

  const material = await prisma.material.upsert({
    where: { slug: "memahami-exposure-triangle" },
    update: {},
    create: {
      title: "Memahami Exposure Triangle",
      slug: "memahami-exposure-triangle",
      summary: "Pelajari hubungan ISO, aperture, dan shutter speed dalam fotografi jurnalistik sekolah.",
      content: `# Memahami Exposure Triangle\n\nExposure triangle adalah hubungan antara ISO, aperture, dan shutter speed. Dalam liputan sekolah, ketiganya menentukan terang-gelap foto, ketajaman gerak, dan kedalaman ruang.\n\n## ISO\nISO mengatur sensitivitas sensor terhadap cahaya. ISO tinggi membantu di tempat gelap, tetapi dapat menambah noise.\n\n## Aperture\nAperture memengaruhi jumlah cahaya dan depth of field. f/1.8 menghasilkan latar lebih blur, sedangkan f/8 lebih tajam merata.\n\n## Shutter Speed\nShutter cepat membekukan gerak. Shutter lambat membuat motion blur. Untuk futsal indoor, shutter minimal 1/250 lebih aman.`,
      categoryId: categoryRecords[1].id,
      status: PublishStatus.PUBLISHED,
      orderNumber: 1,
      createdById: mentor.id
    }
  });

  const quiz = await prisma.quiz.upsert({
    where: { id: "seed-quiz-exposure" },
    update: {},
    create: {
      id: "seed-quiz-exposure",
      title: "Kuis Dasar Exposure",
      description: "Uji pemahaman dasar ISO, aperture, dan shutter speed.",
      durationMinutes: 10,
      minimumScore: 70,
      status: QuizStatus.PUBLISHED,
      materialId: material.id,
      createdById: mentor.id
    }
  });

  const questionCount = await prisma.question.count({ where: { quizId: quiz.id } });
  if (questionCount === 0) {
    await prisma.question.createMany({
      data: [
        {
          quizId: quiz.id,
          questionText: "Apa dampak ISO yang terlalu tinggi?",
          questionType: QuestionType.MULTIPLE_CHOICE,
          optionA: "Foto menjadi lebih gelap",
          optionB: "Noise foto meningkat",
          optionC: "Sudut pandang berubah",
          optionD: "Lensa menjadi lebih panjang",
          correctAnswer: "B",
          explanation: "ISO tinggi meningkatkan sensitivitas cahaya, tetapi biasanya menambah noise.",
          point: 10
        },
        {
          quizId: quiz.id,
          questionText: "Shutter speed cepat berguna untuk membekukan gerakan.",
          questionType: QuestionType.TRUE_FALSE,
          optionA: "Benar",
          optionB: "Salah",
          correctAnswer: "A",
          explanation: "Shutter cepat seperti 1/500 dapat membekukan gerakan lebih baik.",
          point: 10
        }
      ]
    });
  }

  const scenarios = [
    ["Liputan upacara pagi", 200, "f/8", "1/250", "Daylight", "35mm", "bright", "medium", "Dokumentasi suasana upacara dengan detail tajam"],
    ["Wawancara indoor", 800, "f/2.8", "1/125", "Fluorescent", "50mm", "indoor", "low", "Potret narasumber dengan latar sedikit blur"],
    ["Pertandingan futsal indoor", 1600, "f/2.8", "1/500", "Fluorescent", "85mm", "indoor", "high", "Membekukan aksi olahraga di ruangan"],
    ["Liputan malam hari", 3200, "f/1.8", "1/60", "Auto", "35mm", "dark", "medium", "Menangkap suasana malam dengan noise terkendali"],
    ["Foto human interest", 400, "f/2.8", "1/250", "Cloudy", "50mm", "soft", "low", "Menonjolkan ekspresi subjek"],
    ["Liputan kegiatan sekolah", 400, "f/5.6", "1/250", "Auto", "24mm", "mixed", "medium", "Menangkap aktivitas secara luas dan informatif"]
  ];
  for (const [title, iso, aperture, shutter, wb, focal, lighting, movement, goal] of scenarios) {
    await prisma.simulationScenario.upsert({
      where: { slug: slugify(String(title), { lower: true }) },
      update: {},
      create: {
        title: String(title),
        slug: slugify(String(title), { lower: true }),
        description: `Skenario simulasi: ${title}. Tujuan: ${goal}`,
        idealIso: Number(iso),
        idealAperture: String(aperture),
        idealShutter: String(shutter),
        idealWhiteBalance: String(wb),
        idealFocalLength: String(focal),
        lighting: String(lighting),
        movement: String(movement),
        goal: String(goal)
      }
    });
  }

  const badges = [
    ["Newbie Journalist", "Mulai aktif belajar jurnalistik.", "BookOpen", "score>=50", 50],
    ["Exposure Master", "Menguasai simulasi exposure.", "Camera", "simulation>=90", null],
    ["Fast Shutter", "Paham pengaturan shutter untuk aksi cepat.", "Zap", "simulation.shutter=20", null],
    ["Caption Expert", "Mampu membuat caption 5W+1H.", "PenLine", "work.caption", null],
    ["Photo Hunter", "Rajin mengunggah karya foto.", "Image", "works>=3", null],
    ["Lens Master", "Total skor sudah tinggi.", "Trophy", "score>=500", 500],
    ["Creative Editor", "Aktif memakai asset editing.", "Palette", "download>=5", null],
    ["Top Contributor", "Kontributor unggulan galeri.", "Star", "published>=3", null]
  ];
  for (const [name, description, icon, rule, minScore] of badges) {
    await prisma.badge.upsert({
      where: { name: String(name) },
      update: {},
      create: { name: String(name), description: String(description), icon: String(icon), rule: String(rule), minScore: minScore ? Number(minScore) : null }
    });
  }

  await prisma.scoreLog.create({ data: { userId: siswa.id, activity: "SEED_WELCOME", points: 25 } });
  await prisma.scoreLog.create({ data: { userId: siswa.id, activity: "READ_MATERIAL", points: 10, referenceId: material.id } });

  await prisma.asset.upsert({
    where: { id: "seed-asset-caption-template" },
    update: {},
    create: {
      id: "seed-asset-caption-template",
      title: "Template Caption 5W+1H",
      description: "Template latihan membuat caption foto jurnalistik sekolah.",
      category: "Template Caption",
      fileName: "template-caption-5w1h.pdf",
      fileType: "application/pdf",
      fileSize: 120000,
      driveFileId: "demo-drive-file-id",
      downloadUrl: "https://drive.google.com/file/d/demo-drive-file-id/view",
      uploadedById: mentor.id
    }
  });

  console.log("Seed selesai. Akun: admin@lenslab.test, mentor@lenslab.test, siswa@lenslab.test / password123");
}

main().finally(async () => prisma.$disconnect());
