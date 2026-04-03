import type { Session, Tutor, Booking } from '@prisma/client';

/**
 * Type for a session with its related tutor and confirmed bookings
 */
export type SessionWithRelations = Session & {
  tutor: Tutor;
  bookings: Booking[];
};

/**
 * DTO for available session response
 */
export interface AvailableSessionDto {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  capacity: number;
  tutorName: string;
  tutorSubject: string;
  spotsRemaining: number;
}

/**
 * Maps a session entity to an available session DTO
 *
 * @param session - Session with tutor and bookings relations
 * @returns AvailableSessionDto with calculated spots remaining
 */
export const toAvailableSessionDto = (
  session: SessionWithRelations,
): AvailableSessionDto => ({
  id: session.id,
  title: session.title,
  startsAt: session.startsAt,
  endsAt: session.endsAt,
  capacity: session.capacity,
  tutorName: session.tutor.name,
  tutorSubject: session.tutor.subject,
  spotsRemaining: session.capacity - session.bookings.length,
});
