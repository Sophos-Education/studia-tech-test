import React from 'react';
import { formatDateTime, formatTime } from '~/utils/dateFormat';

/**
 * ============================================================
 *  SESSION CARD COMPONENT — YOUR TASK
 * ============================================================
 *
 *  Build a card component that displays a single tutoring session.
 *
 *  Props (define the TypeScript interface yourself):
 *    - Session title
 *    - Start and end times (formatted for display)
 *    - Number of remaining spots
 *    - Whether the session is bookable
 *    - An onBook callback
 *
 *  Requirements:
 *    - Display the session title, date/time, and spots remaining
 *    - Show a "Book" button that calls onBook when clicked
 *    - Disable the button and show "Full" when no spots remain
 *    - Show a loading/disabled state while a booking is in progress
 *    - Tailwind CSS is available for styling
 *
 *  This component is deliberately open-ended. We care about:
 *    - Clean TypeScript (proper typing of props)
 *    - Logical component structure
 *    - Handling of states (available, full, booking in progress)
 *    - Readable, maintainable code
 * ============================================================
 */

interface SessionCardProps {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  spotsRemaining: number;
  tutorName: string;
  tutorSubject: string;
  isBooking?: boolean;
  onBook: (sessionId: string) => void;
}

export default function SessionCard({
  id,
  title,
  startsAt,
  endsAt,
  spotsRemaining,
  tutorName,
  tutorSubject,
  isBooking = false,
  onBook,
}: SessionCardProps) {
  const isFull = spotsRemaining === 0;
  const isDisabled = isFull || isBooking;

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">
          {tutorName} • {tutorSubject}
        </p>
      </div>

      <div className="mb-3 text-sm text-gray-700">
        <div className="flex items-center gap-1">
          <span className="font-medium">📅</span>
          <span>{formatDateTime(startsAt)}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="font-medium">⏰</span>
          <span>
            {formatTime(startsAt)} - {formatTime(endsAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-medium ${
            isFull ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {isFull ? 'Fully booked' : `${spotsRemaining} spots remaining`}
        </span>

        <button
          onClick={() => onBook(id)}
          disabled={isDisabled}
          className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isBooking ? 'Booking...' : isFull ? 'Full' : 'Book'}
        </button>
      </div>
    </div>
  );
}
