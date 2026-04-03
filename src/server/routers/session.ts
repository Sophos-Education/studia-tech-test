import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { toAvailableSessionDto } from '~/mappers/session.mapper';
import {
  toStudentBookingDto,
  toBookingMutationDto,
} from '~/mappers/booking.mapper';
import { getBookingCutoffTime } from '~/utils/time';

/**
 * ============================================================
 *  SESSION ROUTER — YOUR TASK
 * ============================================================
 *
 *  Implement the four tRPC procedures below. Each procedure has:
 *    - A description of what it should do
 *    - The expected input schema (already defined)
 *    - Hints about edge cases to handle
 *
 *  The Prisma client is available via `ctx.prisma`.
 *  Refer to prisma/schema.prisma for the data model.
 *
 *  Run `npm test` to check your progress — all tests should pass.
 * ============================================================
 */

export const sessionRouter = router({
  /**
   * PROCEDURE 1: getAvailableSessions
   *
   * Return a tutor's FUTURE sessions that still have available capacity.
   *
   * Requirements:
   *   - Only return sessions where startsAt is in the future
   *   - Only return sessions that are NOT fully booked
   *   - A session's booked count should only include "confirmed" bookings
   *     (cancelled bookings do NOT count towards capacity)
   *   - Include the tutor's name and subject in the response
   *   - Include how many spots remain for each session
   *   - Order results by startsAt ascending (soonest first)
   */
  getAvailableSessions: publicProcedure
    .input(
      z.object({
        tutorId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const now = getBookingCutoffTime();

      const upcomingTutorSessionsAndConfirmedBookings =
        await ctx.prisma.session.findMany({
          where: {
            tutorId: input.tutorId,
            startsAt: {
              gt: now,
            },
          },
          include: {
            tutor: true,
            bookings: {
              where: {
                status: 'confirmed',
              },
            },
          },
          orderBy: {
            startsAt: 'asc',
          },
        });

      return upcomingTutorSessionsAndConfirmedBookings
        .filter((session) => session.bookings.length < session.capacity)
        .map(toAvailableSessionDto);
    }),

  /**
   * PROCEDURE 2: bookSession
   *
   * Book a student into a session.
   *
   * Requirements:
   *   - Validate the session exists and is in the future
   *   - Validate the session is not fully booked (confirmed bookings only)
   *   - Prevent duplicate bookings (same student + same session)
   *     BUT: if the student previously cancelled, allow them to re-book
   *   - Return the created booking with session details
   *
   * Error handling — throw descriptive errors for:
   *   - Session not found
   *   - Session is in the past
   *   - Session is fully booked
   *   - Student already has a confirmed booking for this session
   */
  bookSession: publicProcedure
    .input(
      z.object({
        studentId: z.string(),
        sessionId: z.string(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const now = getBookingCutoffTime();

      const session = await ctx.prisma.session.findUnique({
        where: { id: input.sessionId },
        include: {
          bookings: {
            where: { status: 'confirmed' },
          },
        },
      });

      // Validate the session exists
      if (!session) {
        throw new Error('Session not found');
      }

      // Validate the session is in the future
      if (session.startsAt <= now) {
        throw new Error('Session is in the past');
      }

      // Validate the session is not fully booked (confirmed bookings only)
      if (session.bookings.length >= session.capacity) {
        throw new Error('Session is fully booked');
      }

      // Prevent duplicate bookings (same student + same session)
      const existingBooking = await ctx.prisma.booking.findUnique({
        where: {
          studentId_sessionId: {
            studentId: input.studentId,
            sessionId: input.sessionId,
          },
        },
      });

      if (existingBooking && existingBooking.status === 'confirmed') {
        throw new Error(
          'Student already has a confirmed booking for this session',
        );
      }

      // if the student previously cancelled, allow them to re-book
      if (existingBooking && existingBooking.status === 'cancelled') {
        const updatedBooking = await ctx.prisma.booking.update({
          where: { id: existingBooking.id },
          data: {
            status: 'confirmed',
            notes: input.notes,
          },
          include: {
            session: true,
          },
        });
        return toBookingMutationDto(updatedBooking);
      }

      const newBooking = await ctx.prisma.booking.create({
        data: {
          studentId: input.studentId,
          sessionId: input.sessionId,
          notes: input.notes,
          status: 'confirmed',
        },
        include: {
          session: true,
        },
      });
      return toBookingMutationDto(newBooking);
    }),

  /**
   * PROCEDURE 3: cancelBooking
   *
   * Cancel an existing booking.
   *
   * Requirements:
   *   - Find the booking by ID
   *   - Only allow cancellation if the booking status is "confirmed"
   *   - Only allow cancellation if the session hasn't started yet
   *   - Set the booking status to "cancelled" (do NOT delete it)
   *   - Return the updated booking
   *
   * Error handling — throw descriptive errors for:
   *   - Booking not found
   *   - Booking is already cancelled
   *   - Session has already started or passed
   */
  cancelBooking: publicProcedure
    .input(
      z.object({
        bookingId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const booking = await ctx.prisma.booking.findUnique({
        where: { id: input.bookingId },
        include: {
          session: true,
        },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Validate if the booking status is "confirmed"
      if (booking.status !== 'confirmed') {
        throw new Error('Booking is already cancelled');
      }

      // Validate the session hasn't started yet
      const now = getBookingCutoffTime();

      if (booking.session.startsAt <= now) {
        throw new Error('Session has already started or passed');
      }

      // Update booking to cancelled
      const cancelledBooking = await ctx.prisma.booking.update({
        where: { id: input.bookingId },
        data: {
          status: 'cancelled',
        },
        include: {
          session: true,
        },
      });
      return toBookingMutationDto(cancelledBooking);
    }),

  /**
   * PROCEDURE 4: getStudentBookings
   *
   * Return all bookings for a given student.
   *
   * Requirements:
   *   - Include session details (title, startsAt, endsAt) and tutor name
   *   - Include the booking status
   *   - Order by session startsAt descending (most recent first)
   *   - Optionally filter by status if provided
   */
  getStudentBookings: publicProcedure
    .input(
      z.object({
        studentId: z.string(),
        status: z.enum(['confirmed', 'cancelled']).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const bookings = await ctx.prisma.booking.findMany({
        where: {
          studentId: input.studentId,
          ...(input.status && { status: input.status }),
        },
        include: {
          session: {
            include: {
              tutor: true,
            },
          },
        },
        orderBy: {
          session: {
            startsAt: 'desc',
          },
        },
      });

      return bookings.map(toStudentBookingDto);
    }),
});
