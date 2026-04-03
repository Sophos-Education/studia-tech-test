import type { Booking, Session, Tutor } from '@prisma/client';

export type BookingWithRelations = Booking & {
  session: Session & {
    tutor: Tutor;
  };
};

export type BookingWithSession = Booking & {
  session: Session;
};

export interface StudentBookingDto {
  id: string;
  status: string;
  notes: string | null;
  createdAt: Date;
  session: {
    id: string;
    title: string;
    startsAt: Date;
    endsAt: Date;
  };
  tutorName: string;
}

export interface BookingMutationDto {
  id: string;
  status: string;
  notes: string | null;
  studentId: string;
  sessionId: string;
  createdAt: Date;
  session: {
    id: string;
    title: string;
    startsAt: Date;
    endsAt: Date;
    capacity: number;
  };
}

export const toStudentBookingDto = (
  booking: BookingWithRelations,
): StudentBookingDto => ({
  id: booking.id,
  status: booking.status,
  notes: booking.notes,
  createdAt: booking.createdAt,
  session: {
    id: booking.session.id,
    title: booking.session.title,
    startsAt: booking.session.startsAt,
    endsAt: booking.session.endsAt,
  },
  tutorName: booking.session.tutor.name,
});

export const toBookingMutationDto = (
  booking: BookingWithSession,
): BookingMutationDto => ({
  id: booking.id,
  status: booking.status,
  notes: booking.notes,
  studentId: booking.studentId,
  sessionId: booking.sessionId,
  createdAt: booking.createdAt,
  session: {
    id: booking.session.id,
    title: booking.session.title,
    startsAt: booking.session.startsAt,
    endsAt: booking.session.endsAt,
    capacity: booking.session.capacity,
  },
});
