import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
  IonBadge,
  IonCard,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import { chevronBack, chevronForward, todayOutline } from 'ionicons/icons';
import { AppHeader } from '../../components/AppHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useHistory } from 'react-router-dom';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7am - 6pm

function getWeekDays(baseDate) {
  const start = new Date(baseDate);
  const day = start.getDay();
  // Start from Monday
  const monday = new Date(start);
  monday.setDate(start.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function timeToMinutes(dateStr) {
  const d = new Date(dateStr);
  return d.getHours() * 60 + d.getMinutes();
}

export default function Calendar() {
  const history = useHistory();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', color: 'danger' });

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Calendar', path: '/admin/calendar' },
  ];

  const weekDays = getWeekDays(currentDate);

  useEffect(() => {
    fetchSlots();
  }, [currentDate, viewMode]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      let dateFrom, dateTo;
      if (viewMode === 'week') {
        dateFrom = weekDays[0].toISOString();
        const end = new Date(weekDays[6]);
        end.setHours(23, 59, 59, 999);
        dateTo = end.toISOString();
      } else {
        // month view
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
        dateFrom = start.toISOString();
        dateTo = end.toISOString();
      }

      const params = new URLSearchParams({ date_from: dateFrom, date_to: dateTo });
      const response = await fetch(`/api/admin/slots?${params}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setSlots(Array.isArray(data) ? data : []);
      } else {
        setToast({ show: true, message: 'Failed to fetch slots', color: 'danger' });
      }
    } catch {
      setToast({ show: true, message: 'Failed to fetch slots', color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const navigate = (direction) => {
    const d = new Date(currentDate);
    if (viewMode === 'week') {
      d.setDate(d.getDate() + direction * 7);
    } else {
      d.setMonth(d.getMonth() + direction);
    }
    setCurrentDate(d);
  };

  const formatHeaderDate = () => {
    if (viewMode === 'week') {
      const start = weekDays[0];
      const end = weekDays[6];
      const startStr = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const endStr = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      return `${startStr} – ${endStr}`;
    }
    return currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  };

  const getSlotsForDay = (day) =>
    slots.filter((s) => isSameDay(new Date(s.start_at), day));

  const getSlotColor = (slot) => {
    if (slot.status === 'CANCELLED') return 'var(--ion-color-danger)';
    if (slot.walk_type === 'GROUP') return 'var(--ion-color-primary)';
    return 'var(--ion-color-success)';
  };

  const getSlotTop = (slot) => {
    const startMin = timeToMinutes(slot.start_at);
    const dayStartMin = 7 * 60;
    return Math.max(0, startMin - dayStartMin);
  };

  const getSlotHeight = (slot) => {
    const startMin = timeToMinutes(slot.start_at);
    const endMin = timeToMinutes(slot.end_at);
    return Math.max(20, endMin - startMin);
  };

  const HOUR_PX = 60;

  // Month view helpers
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Pad start to Monday
    const startPad = (firstDay.getDay() + 6) % 7;
    const days = [];
    for (let i = startPad; i > 0; i--) {
      const d = new Date(firstDay);
      d.setDate(d.getDate() - i);
      days.push({ date: d, currentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), currentMonth: true });
    }
    // Pad end to complete week rows
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1].date;
      const d = new Date(last);
      d.setDate(d.getDate() + 1);
      days.push({ date: d, currentMonth: false });
    }
    return days;
  };

  return (
    <IonPage>
      <AppHeader title="Calendar" />
      <IonContent>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="ion-padding">
          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IonButton fill="outline" size="small" onClick={() => navigate(-1)}>
                <IonIcon icon={chevronBack} />
              </IonButton>
              <IonButton fill="outline" size="small" onClick={() => setCurrentDate(new Date())}>
                <IonIcon icon={todayOutline} slot="start" />
                Today
              </IonButton>
              <IonButton fill="outline" size="small" onClick={() => navigate(1)}>
                <IonIcon icon={chevronForward} />
              </IonButton>
              <strong style={{ fontSize: '1rem' }}>{formatHeaderDate()}</strong>
            </div>
            <IonSegment
              value={viewMode}
              onIonChange={(e) => setViewMode(e.detail.value)}
              style={{ width: 'auto', minWidth: '160px' }}
            >
              <IonSegmentButton value="week"><IonLabel>Week</IonLabel></IonSegmentButton>
              <IonSegmentButton value="month"><IonLabel>Month</IonLabel></IonSegmentButton>
            </IonSegment>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '0.8rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--ion-color-primary)', display: 'inline-block' }} />
              Group Walk
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--ion-color-success)', display: 'inline-block' }} />
              Private Walk
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--ion-color-danger)', display: 'inline-block' }} />
              Cancelled
            </span>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <IonSpinner />
            </div>
          ) : viewMode === 'week' ? (
            /* Week View */
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: '600px' }}>
                {/* Day headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)', borderBottom: '1px solid var(--ion-color-light)' }}>
                  <div />
                  {weekDays.map((day, i) => {
                    const isToday = isSameDay(day, new Date());
                    return (
                      <div
                        key={i}
                        style={{
                          textAlign: 'center',
                          padding: '8px 2px',
                          fontWeight: isToday ? 'bold' : 'normal',
                          color: isToday ? 'var(--ion-color-primary)' : undefined,
                          fontSize: '0.8rem',
                        }}
                      >
                        <div>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</div>
                        <div style={{
                          width: 28,
                          height: 28,
                          margin: '2px auto 0',
                          borderRadius: '50%',
                          background: isToday ? 'var(--ion-color-primary)' : 'transparent',
                          color: isToday ? 'white' : undefined,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {day.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Time grid */}
                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '50px repeat(7, 1fr)' }}>
                  {/* Hour labels */}
                  <div>
                    {HOURS.map((h) => (
                      <div key={h} style={{ height: `${HOUR_PX}px`, borderBottom: '1px solid var(--ion-color-light)', paddingRight: '4px', fontSize: '0.7rem', color: 'var(--ion-color-medium)', textAlign: 'right', paddingTop: '2px' }}>
                        {h > 12 ? `${h - 12}pm` : h === 12 ? '12pm' : `${h}am`}
                      </div>
                    ))}
                  </div>

                  {/* Day columns */}
                  {weekDays.map((day, di) => {
                    const daySlots = getSlotsForDay(day);
                    return (
                      <div key={di} style={{ position: 'relative', borderLeft: '1px solid var(--ion-color-light)' }}>
                        {HOURS.map((h) => (
                          <div key={h} style={{ height: `${HOUR_PX}px`, borderBottom: '1px solid var(--ion-color-light)' }} />
                        ))}
                        {/* Slots */}
                        {daySlots.map((slot) => {
                          const top = (getSlotTop(slot) / 60) * HOUR_PX;
                          const height = (getSlotHeight(slot) / 60) * HOUR_PX;
                          return (
                            <div
                              key={slot.id}
                              onClick={() => history.push(`/admin/slots/${slot.id}`)}
                              style={{
                                position: 'absolute',
                                top: `${top}px`,
                                left: '2px',
                                right: '2px',
                                height: `${Math.max(20, height - 2)}px`,
                                background: getSlotColor(slot),
                                borderRadius: '4px',
                                padding: '2px 4px',
                                color: 'white',
                                fontSize: '0.7rem',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                opacity: slot.status === 'CANCELLED' ? 0.6 : 1,
                              }}
                            >
                              <div style={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                                {new Date(slot.start_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              {height > 30 && (
                                <div style={{ lineHeight: 1.2 }}>{slot.walker_name || slot.walk_type}</div>
                              )}
                              {height > 45 && slot.booked_count !== undefined && (
                                <div>{slot.booked_count}/{slot.capacity_dogs} 🐾</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Month View */
            <div>
              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.8rem', padding: '4px', color: 'var(--ion-color-medium)' }}>
                    {d}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {getMonthDays().map(({ date, currentMonth }, i) => {
                  const daySlots = getSlotsForDay(date);
                  const isToday = isSameDay(date, new Date());
                  return (
                    <div
                      key={i}
                      style={{
                        minHeight: '80px',
                        border: '1px solid var(--ion-color-light)',
                        borderRadius: '4px',
                        padding: '4px',
                        background: isToday ? 'var(--ion-color-primary-tint)' : currentMonth ? 'white' : 'var(--ion-color-light-tint)',
                        opacity: currentMonth ? 1 : 0.5,
                      }}
                    >
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: isToday ? 'bold' : 'normal',
                        color: isToday ? 'var(--ion-color-primary)' : undefined,
                        marginBottom: '2px',
                      }}>
                        {date.getDate()}
                      </div>
                      {daySlots.slice(0, 3).map((slot) => (
                        <div
                          key={slot.id}
                          onClick={() => history.push(`/admin/slots/${slot.id}`)}
                          style={{
                            background: getSlotColor(slot),
                            color: 'white',
                            borderRadius: '3px',
                            padding: '1px 4px',
                            fontSize: '0.65rem',
                            marginBottom: '2px',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {new Date(slot.start_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          {' '}{slot.walk_type === 'GROUP' ? 'G' : 'P'}
                        </div>
                      ))}
                      {daySlots.length > 3 && (
                        <div style={{ fontSize: '0.65rem', color: 'var(--ion-color-medium)' }}>
                          +{daySlots.length - 3} more
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <IonToast
          isOpen={toast.show}
          message={toast.message}
          color={toast.color}
          duration={3000}
          onDidDismiss={() => setToast({ ...toast, show: false })}
        />
      </IonContent>
    </IonPage>
  );
}
