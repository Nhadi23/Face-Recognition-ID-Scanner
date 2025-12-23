import type { Application, EventItem } from '../types/types';
import { useState } from 'react';
import EventList from './EventList';
import { useNavigate } from 'react-router-dom';


interface Props {
  applications: Application[];
  approve: (id: number) => void;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
}

export default function AdminDashboard({ applications, approve, events, setEvents }: Props) {

  const navigate = useNavigate();
  const waiting = applications.filter((a) => a.status === 'waiting');

  const [eventForm, setEventForm] = useState({ name: '', details: '' });

  const submitEvent = (e: React.FormEvent) => {
    e.preventDefault();

    setEvents(prev => [...prev, { ...eventForm }]);
    setEventForm({ name: '', details: '' });

    alert("Event published!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }; 
  return (
    <div className="content-area active">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      <section className="card">
        <h2>📥 Pending Applications</h2>

        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Date</th>
              <th>Purpose</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {waiting.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  No pending applications.
                </td>
              </tr>
            ) : (
              waiting.map(app => (
                <tr key={app.id}>
                  <td>{app.student}</td>
                  <td>{app.date}</td>
                  <td>{app.purpose}</td>
                  <td>
                    <button className="action-btn" onClick={() => approve(app.id)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>🗓️ Add New Event</h2>

        <form onSubmit={submitEvent}>
          <div className="form-group">
            <label>Event Name:</label>
            <input
              type="text"
              value={eventForm.name}
              onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Details:</label>
            <textarea
              value={eventForm.details}
              onChange={(e) => setEventForm({ ...eventForm, details: e.target.value })}
              required
            />
          </div>

          <button className="submit-btn" type="submit">
            Publish Event
          </button>
        </form>
      </section>

      <EventList events={events} />
    </div>
  );
}
