export const getBookingCutoffTime = (): Date => {
  // TODO: consider adding a buffer time (e.g., 5-10 minutes)
  // to prevent bookings for sessions starting imminently
  return new Date();
};
