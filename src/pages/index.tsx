import Link from "next/link";

/**
 * Landing page — provided for you. No changes needed here.
 *
 * Use this to navigate to the tutor session pages once you've
 * built the [tutorId] page and components.
 */
export default function Home() {
  const tutors = [
    { id: "tutor-maths-01", name: "Dr Sarah Chen", subject: "GCSE Mathematics" },
    { id: "tutor-english-01", name: "James Wright", subject: "GCSE English Literature" },
    { id: "tutor-physics-01", name: "Dr Priya Patel", subject: "A-Level Physics" },
  ];

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Studia Tech Test</h1>
      <p>Select a tutor to view and book their sessions:</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tutors.map((tutor) => (
          <li key={tutor.id} style={{ marginBottom: "1rem" }}>
            <Link
              href={`/sessions/${tutor.id}`}
              style={{
                display: "block",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <strong>{tutor.name}</strong>
              <br />
              <span style={{ color: "#666" }}>{tutor.subject}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
