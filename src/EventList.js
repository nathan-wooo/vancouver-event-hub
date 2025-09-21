import React from 'react';
import EventCard from './EventCard';

function EventList({ events }) {
  if (events.length === 0) {
    return <div className="no-events">No events found in Vancouver area.</div>;
  }

  return (
    <div className="event-list">
      <h2>Upcoming Events ({events.length > 99 ? '99+' : events.length})</h2>
      <div className="events-grid">
        {events.map(event => (   // make card for each event
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default EventList;