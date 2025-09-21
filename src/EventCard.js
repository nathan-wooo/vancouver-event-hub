function EventCard({ event }) {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getEventImage = (event) => {
    return event.images?.[0]?.url || null;
  };

  const getVenueName = (event) => {
    return event._embedded?.venues?.[0]?.name || 'Venue TBA';
  };

  const getPriceRange = (event) => {
    if (event.priceRanges?.[0]) {
      const min = event.priceRanges[0].min;
      const max = event.priceRanges[0].max;
      return `$${min} - $${max} ${event.priceRanges[0].currency}`;
    }

  const eventName = event.name.toLowerCase();
    if (eventName.includes('free') || eventName.includes('complimentary')) {
      return 'Free';
  }

    return 'See pricing →';
  };

  return (
    <div className="event-card">
      <div className="event-image">
        {getEventImage(event) ? (
          <img src={getEventImage(event)} alt={event.name} />
        ) : (
          <div className="placeholder-image">No Image</div>
        )}
      </div>
      
      <div className="event-content">
        <h3 className="event-title">{event.name}</h3>
        
        <div className="event-details">
          <div className="event-date">
            📅 {formatDate(event.dates.start.dateTime || event.dates.start.localDate)}
          </div>
          
          <div className="event-location">
            📍 {getVenueName(event)}
          </div>
          
          <div className="event-price">
            💰 {getPriceRange(event)}
          </div>
        </div>

        <a 
          href={event.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="event-link"
        >
          View Event →
        </a>
      </div>
    </div>
  );
}

export default EventCard;