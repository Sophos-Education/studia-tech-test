import { useRouter } from 'next/router';
import SessionCard from '~/components/SessionCard';
import { trpc } from '~/utils/trpc';
import { useState } from 'react';

/**
 * ============================================================
 *  TUTOR SESSIONS PAGE — YOUR TASK
 * ============================================================
 *
 *  Build a page that displays a tutor's available sessions
 *  and allows a student to book them.
 *
 *  Requirements:
 *    - Use the tRPC hook to fetch available sessions for the tutor
 *    - Display sessions using your SessionCard component
 *    - Implement booking via the bookSession mutation
 *    - Show appropriate loading and error states
 *    - After a successful booking, refresh the sessions list
 *    - For simplicity, hardcode the studentId as "student-01"
 *
 *  Hints:
 *    - The tutorId comes from the URL: /sessions/[tutorId]
 *    - Use `trpc.session.getAvailableSessions.useQuery()`
 *    - Use `trpc.session.bookSession.useMutation()`
 *    - Consider what happens to the UI during and after booking
 *
 *  We're NOT judging visual design here. Clean, functional React
 *  with proper TypeScript and state management is what we're after.
 * ============================================================
 */

const STUDENT_ID = 'student-01';

export default function TutorSessionsPage() {
  const router = useRouter();
  const tutorId = router.query.tutorId as string;
  const [bookingSessionId, setBookingSessionId] = useState<string | null>(null);

  const {
    data: sessions,
    isLoading,
    error,
    refetch,
  } = trpc.session.getAvailableSessions.useQuery(
    { tutorId },
    {
      enabled: !!tutorId,
    },
  );

  const bookSessionMutation = trpc.session.bookSession.useMutation({
    onSuccess: () => {
      refetch();
      setBookingSessionId(null);
    },
    onError: (error) => {
      alert(`Booking failed: ${error.message}`);
      setBookingSessionId(null);
    },
  });

  const handleBook = (sessionId: string) => {
    setBookingSessionId(sessionId);
    bookSessionMutation.mutate({
      studentId: STUDENT_ID,
      sessionId,
    });
  };

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto p-8 font-sans">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto p-8 font-sans">
        <div className="text-center py-12">
          <p className="text-red-600">
            Error loading sessions: {error.message}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <main className="max-w-4xl mx-auto p-8 font-sans">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Available Sessions
        </h1>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No available sessions at the moment. Check back later!
          </p>
        </div>
      </main>
    );
  }

  const tutorName = sessions[0]?.tutorName || 'Tutor';
  const tutorSubject = sessions[0]?.tutorSubject || '';

  return (
    <main className="max-w-4xl mx-auto p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          {tutorName}'s Sessions
        </h1>
        <p className="text-gray-600">{tutorSubject}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            id={session.id}
            title={session.title}
            startsAt={session.startsAt}
            endsAt={session.endsAt}
            spotsRemaining={session.spotsRemaining}
            tutorName={session.tutorName}
            tutorSubject={session.tutorSubject}
            isBooking={bookingSessionId === session.id}
            onBook={handleBook}
          />
        ))}
      </div>
    </main>
  );
}
