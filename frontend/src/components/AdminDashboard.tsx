/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EventItem } from '../types/types';
import EventList from './EventList';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllPermissionsAdmin,
  updatePermissionStatus,
  type Permissions,
} from '../services/permission';
import { logout } from '../services/auth';

// permission management

interface Props {
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
}

export default function AdminDashboard({ events, setEvents }: Props) {
  const [permissions, setPermissions] = useState<Permissions[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [eventForm, setEventForm] = useState({ name: '', details: '' });

  const submitEvent = (e: React.FormEvent) => {
    e.preventDefault();

    setEvents((prev) => [...prev, { ...eventForm }]);
    setEventForm({ name: '', details: '' });

    alert('Event published!');
  };

  async function load() {
    setLoading(true);
    try {
      const data = await getAllPermissionsAdmin();
      setPermissions(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onApprove(id: number) {
    await updatePermissionStatus(id, 'accepted');
    await load();
  }

  async function onDeny(id: number) {
    await updatePermissionStatus(id, 'denied');
    await load();
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const waiting = permissions.filter((p) => p.status === 'waiting');

  return (
    <div className="content-area active">
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 16,
        }}
      >
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
              waiting.map((app) => (
                <tr key={app.id}>
                  <td>{app.student_name}</td>
                  <td>{new Date(app.start_time).toLocaleString()}</td>
                  <td>{app.reason}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => onApprove(app.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => onDeny(app.id)}
                    >
                      Deny
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
              onChange={(e) =>
                setEventForm({ ...eventForm, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Details:</label>
            <textarea
              value={eventForm.details}
              onChange={(e) =>
                setEventForm({ ...eventForm, details: e.target.value })
              }
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
