import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.session.deleteMany();
  await prisma.student.deleteMany();
  await prisma.tutor.deleteMany();

  // Create tutors
  const mathsTutor = await prisma.tutor.create({
    data: {
      id: "tutor-maths-01",
      name: "Dr Sarah Chen",
      subject: "GCSE Mathematics",
      bio: "15 years teaching experience. Specialist in Higher Maths.",
      hourlyRate: 40,
    },
  });

  const englishTutor = await prisma.tutor.create({
    data: {
      id: "tutor-english-01",
      name: "James Wright",
      subject: "GCSE English Literature",
      bio: "Former examiner. Passionate about making literature accessible.",
      hourlyRate: 35,
    },
  });

  const physicsTutor = await prisma.tutor.create({
    data: {
      id: "tutor-physics-01",
      name: "Dr Priya Patel",
      subject: "A-Level Physics",
      bio: "PhD in Astrophysics. Makes complex concepts simple.",
      hourlyRate: 45,
    },
  });

  // Create students
  const student1 = await prisma.student.create({
    data: {
      id: "student-01",
      name: "Alex Thompson",
      email: "alex@example.com",
    },
  });

  const student2 = await prisma.student.create({
    data: {
      id: "student-02",
      name: "Maya Johnson",
      email: "maya@example.com",
    },
  });

  const student3 = await prisma.student.create({
    data: {
      id: "student-03",
      name: "Oliver Kim",
      email: "oliver@example.com",
    },
  });

  // Helper to create dates relative to now
  const futureDate = (daysFromNow: number, hour: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  const pastDate = (daysAgo: number, hour: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(hour, 0, 0, 0);
    return d;
  };

  // Create sessions for Dr Sarah Chen (Maths)
  // Past session (should NOT appear in available sessions)
  const pastSession = await prisma.session.create({
    data: {
      id: "session-past-01",
      title: "GCSE Maths: Algebra Foundations",
      tutorId: mathsTutor.id,
      startsAt: pastDate(2, 10),
      endsAt: pastDate(2, 11),
      capacity: 5,
    },
  });

  // Future sessions with varying capacity
  const mathsSession1 = await prisma.session.create({
    data: {
      id: "session-maths-01",
      title: "GCSE Maths: Quadratic Equations",
      tutorId: mathsTutor.id,
      startsAt: futureDate(1, 10),
      endsAt: futureDate(1, 11),
      capacity: 5,
    },
  });

  const mathsSession2 = await prisma.session.create({
    data: {
      id: "session-maths-02",
      title: "GCSE Maths: Trigonometry Deep Dive",
      tutorId: mathsTutor.id,
      startsAt: futureDate(2, 14),
      endsAt: futureDate(2, 15),
      capacity: 1, // Only 1 spot - will be fully booked
    },
  });

  const mathsSession3 = await prisma.session.create({
    data: {
      id: "session-maths-03",
      title: "GCSE Maths: Statistics & Probability",
      tutorId: mathsTutor.id,
      startsAt: futureDate(3, 16),
      endsAt: futureDate(3, 17),
      capacity: 10,
    },
  });

  const mathsSession4 = await prisma.session.create({
    data: {
      id: "session-maths-04",
      title: "GCSE Maths: Exam Technique Workshop",
      tutorId: mathsTutor.id,
      startsAt: futureDate(5, 9),
      endsAt: futureDate(5, 10),
      capacity: 20,
    },
  });

  // English sessions
  const englishSession1 = await prisma.session.create({
    data: {
      id: "session-english-01",
      title: "GCSE English: Macbeth Analysis",
      tutorId: englishTutor.id,
      startsAt: futureDate(1, 15),
      endsAt: futureDate(1, 16),
      capacity: 8,
    },
  });

  // Physics sessions
  const physicsSession1 = await prisma.session.create({
    data: {
      id: "session-physics-01",
      title: "A-Level Physics: Quantum Mechanics Intro",
      tutorId: physicsTutor.id,
      startsAt: futureDate(2, 11),
      endsAt: futureDate(2, 12),
      capacity: 3,
    },
  });

  // Create some existing bookings
  // Book Maya into the Trig session (capacity 1 - making it full)
  await prisma.booking.create({
    data: {
      studentId: student2.id,
      sessionId: mathsSession2.id,
      status: "confirmed",
    },
  });

  // Book Alex into the Quadratics session
  await prisma.booking.create({
    data: {
      studentId: student1.id,
      sessionId: mathsSession1.id,
      status: "confirmed",
    },
  });

  // Book Alex into the past session
  await prisma.booking.create({
    data: {
      studentId: student1.id,
      sessionId: pastSession.id,
      status: "confirmed",
    },
  });

  // A cancelled booking (should not count towards capacity)
  await prisma.booking.create({
    data: {
      studentId: student3.id,
      sessionId: mathsSession1.id,
      status: "cancelled",
    },
  });

  console.log("Database seeded successfully.");
  console.log(`  Tutors: ${await prisma.tutor.count()}`);
  console.log(`  Students: ${await prisma.student.count()}`);
  console.log(`  Sessions: ${await prisma.session.count()}`);
  console.log(`  Bookings: ${await prisma.booking.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
