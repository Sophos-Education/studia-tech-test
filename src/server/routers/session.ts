import { z } from "zod";
import { router, publicProcedure } from "../trpc";

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
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: Implement this procedure
      throw new Error("Not implemented");
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement this procedure
      throw new Error("Not implemented");
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement this procedure
      throw new Error("Not implemented");
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
        status: z.enum(["confirmed", "cancelled"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: Implement this procedure
      throw new Error("Not implemented");
    }),
});
