import { PrismaClient } from "@prisma/client";
import { beforeAll, afterAll, beforeEach } from "vitest";

export const prisma = new PrismaClient();

beforeAll(async () => {
  // Ensure DB exists and is migrated
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Reseed before each test to ensure clean state
beforeEach(async () => {
  await prisma.booking.deleteMany();
  await prisma.session.deleteMany();
  await prisma.student.deleteMany();
  await prisma.tutor.deleteMany();

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

  await prisma.tutor.createMany({
    data: [
      {
        id: "tutor-maths-01",
        name: "Dr Sarah Chen",
        subject: "GCSE Mathematics",
        hourlyRate: 40,
      },
      {
        id: "tutor-english-01",
        name: "James Wright",
        subject: "GCSE English Literature",
        hourlyRate: 35,
      },
    ],
  });

  await prisma.student.createMany({
    data: [
      { id: "student-01", name: "Alex Thompson", email: "alex@example.com" },
      { id: "student-02", name: "Maya Johnson", email: "maya@example.com" },
      { id: "student-03", name: "Oliver Kim", email: "oliver@example.com" },
    ],
  });

  // Past session
  await prisma.session.create({
    data: {
      id: "session-past-01",
      title: "Past Session: Algebra",
      tutorId: "tutor-maths-01",
      startsAt: pastDate(2, 10),
      endsAt: pastDate(2, 11),
      capacity: 5,
    },
  });

  // Future sessions
  await prisma.session.create({
    data: {
      id: "session-future-01",
      title: "Quadratic Equations",
      tutorId: "tutor-maths-01",
      startsAt: futureDate(1, 10),
      endsAt: futureDate(1, 11),
      capacity: 5,
    },
  });

  await prisma.session.create({
    data: {
      id: "session-future-02",
      title: "Trigonometry",
      tutorId: "tutor-maths-01",
      startsAt: futureDate(2, 14),
      endsAt: futureDate(2, 15),
      capacity: 1, // Will be fully booked
    },
  });

  await prisma.session.create({
    data: {
      id: "session-future-03",
      title: "Statistics",
      tutorId: "tutor-maths-01",
      startsAt: futureDate(3, 16),
      endsAt: futureDate(3, 17),
      capacity: 10,
    },
  });

  await prisma.session.create({
    data: {
      id: "session-english-01",
      title: "Macbeth Analysis",
      tutorId: "tutor-english-01",
      startsAt: futureDate(1, 15),
      endsAt: futureDate(1, 16),
      capacity: 8,
    },
  });

  // Fully book the Trig session (capacity 1)
  await prisma.booking.create({
    data: {
      id: "booking-full-01",
      studentId: "student-02",
      sessionId: "session-future-02",
      status: "confirmed",
    },
  });

  // One confirmed booking on Quadratics
  await prisma.booking.create({
    data: {
      id: "booking-confirmed-01",
      studentId: "student-01",
      sessionId: "session-future-01",
      status: "confirmed",
    },
  });

  // One CANCELLED booking (should NOT count towards capacity)
  await prisma.booking.create({
    data: {
      id: "booking-cancelled-01",
      studentId: "student-03",
      sessionId: "session-future-01",
      status: "cancelled",
    },
  });
});
