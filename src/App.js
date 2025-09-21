import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventList from './EventList';
import './App.css';

function App() {
  const [events, setEvents] = useState([]); // stores event data
  const [loading, setLoading] = useState(true); // tracks if it's still fetching
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // adding search func
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchEvents(); // grabs events from ticketmaster api
  }, []);

  const fetchEvents = async () => {
  try {
    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', { // await waits for api response
      params: {
        'city': 'Vancouver',
        'countryCode': 'CA',
        'radius': '25',
        'unit': 'km',
        'sort': 'date,asc',
        'size': '100',
        'apikey': process.env.REACT_APP_TICKETMASTER_API_KEY
      }
    });
    
    console.log('API Response:', response.data); 
    setEvents(response.data._embedded?.events || []); // feeds the data to here
    setLoading(false); // done loading
  } catch (err) {
    console.error('Error fetching events:', err);
    setError('Failed to load events');
    setLoading(false);
  }
};

const filteredEvents = events.filter(event => { 
  const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
  
  // date range filter
  let matchesDate = true;  
  if (startDate || endDate) {
      const eventDate = new Date(event.dates.start.dateTime || event.dates.start.localDate);
  
  if (startDate) {
    const filterStartDate = new Date(startDate + 'T00:00:00');
    matchesDate = matchesDate && eventDate >= filterStartDate;
    }
  
  if (endDate) {
    const filterEndDate = new Date(endDate + 'T23:59:59');
    filterEndDate.setHours(23, 59, 59); // dnclude the entire end date
    matchesDate = matchesDate && eventDate <= filterEndDate;
  }
}
  
  // price filter
  let matchesPrice = true;
  if (priceFilter === 'free') {
    matchesPrice = !event.priceRanges || event.priceRanges.length === 0 || event.priceRanges[0].min === 0;
  } else if (priceFilter === 'under25') {
    matchesPrice = event.priceRanges && event.priceRanges[0] && event.priceRanges[0].min < 25;
  } else if (priceFilter === 'under50') {
    matchesPrice = event.priceRanges && event.priceRanges[0] && event.priceRanges[0].min < 50;
  }
  
  // category filter
  let matchesCategory = true;
  if (categoryFilter !== 'all') {
    const eventCategory = event.classifications?.[0]?.segment?.name?.toLowerCase() || '';
    matchesCategory = eventCategory === categoryFilter;
  }
  
  return matchesSearch && matchesDate && matchesPrice && matchesCategory;
});

  return (
    <div className="App">
      <header className="app-header">
        <h1>Vancouver Events Hub</h1>
        <p>Discover events happening around Vancouver</p>
        
        <div className="search-and-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters-container">
            <div className="date-range-container">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
                placeholder="From date"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
                placeholder="To date"
              />
              {(startDate || endDate) && (
                <button 
                  onClick={() => {setStartDate(''); setEndDate('');}}
                  className="clear-dates-btn"
                >
                  Clear
                </button>
              )}
            </div>
            
            <select 
              value={priceFilter} 
              onChange={(e) => setPriceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Prices</option>
              <option value="free">Free Events</option>
              <option value="under25">Under $25</option>
              <option value="under50">Under $50</option>
            </select>
            
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="arts & theatre">Arts & Theatre</option>
              <option value="miscellaneous">Other</option>
            </select>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        {loading && <div className="loading">Loading events...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && <EventList events={filteredEvents} />}
      </main>
    </div>
  );
}

export default App;