import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CheckCircle2, AlertTriangle, XCircle, Volume2, VolumeX, User, Calendar, RefreshCw } from 'lucide-react';
import HostPageHeader from '../components/HostPageHeader';
import LatticeLoader from '../components/LatticeLoader';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

export default function HostScanner() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef(null);
  const { addToast } = useToast();

  // Web Audio API Synthesizer for confirmation sounds
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        // High, pleasant two-tone chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === 'warning') {
        // Double tone warning (already checked in)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(340, audioCtx.currentTime);
        osc.frequency.setValueAtTime(280, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        // Low buzz for error
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  };

  useEffect(() => {
    fetchHostEvents();
    return () => {
      stopScanner();
    };
  }, []);

  const fetchHostEvents = async () => {
    try {
      const { data: club } = await api.get('/clubs/my-club');
      if (club?._id) {
        const { data: evts } = await api.get(`/events?clubId=${club._id}`);
        setEvents(evts);
        if (evts.length > 0) {
          setSelectedEventId(evts[0]._id);
        }
      }
    } catch (err) {
      addToast('Failed to load events for scanner', 'error');
    }
  };

  const startScanner = async () => {
    if (!selectedEventId) {
      addToast('Please select an event first', 'error');
      return;
    }

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('qr-reader');
      }

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        onScanSuccess
      );
      setScanning(true);
    } catch (err) {
      addToast('Could not access camera. Please check camera permissions.', 'error');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Error stopping scanner', err);
      }
    }
    setScanning(false);
  };

  const onScanSuccess = async (decodedText) => {
    if (isProcessing) return;
    setIsProcessing(true);

    let token = decodedText.trim();
    // Support parsing if token was encoded as JSON
    try {
      const parsed = JSON.parse(token);
      if (parsed.qrToken) token = parsed.qrToken;
    } catch (e) {
      // It's a plain string token
    }

    try {
      const { data } = await api.post(`/events/${selectedEventId}/check-in`, { qrToken: token });
      playSound('success');
      setScanResult({
        status: 'success',
        message: data.message || 'Check-in Confirmed!',
        student: data.student,
        time: data.checkInTime || new Date().toISOString()
      });
      setRecentCheckIns(prev => [
        {
          id: Date.now(),
          student: data.student,
          time: new Date(data.checkInTime || Date.now()).toLocaleTimeString(),
          status: 'Confirmed'
        },
        ...prev.slice(0, 9)
      ]);
      addToast(`Checked in: ${data.student?.name || 'Student'}`, 'success');
    } catch (err) {
      const errData = err.response?.data?.error;
      if (errData?.code === 'ALREADY_CHECKED_IN') {
        playSound('warning');
        setScanResult({
          status: 'warning',
          message: errData.message || 'Already checked in!',
          student: err.response?.data?.student,
          time: err.response?.data?.checkInTime
        });
        addToast(errData.message || 'Already checked in', 'warning');
      } else {
        playSound('error');
        setScanResult({
          status: 'error',
          message: errData?.message || 'Invalid ticket or registration not found.',
        });
        addToast(errData?.message || 'Check-in failed: Invalid ticket', 'error');
      }
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500); // 1.5s debounce between scans
    }
  };

  const selectedEvent = events.find(e => e._id === selectedEventId);

  return (
    <div className="host-scanner" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
      <HostPageHeader
        title="Event Gate Check-in & QR Scanner"
        subtitle="Scan participant QR tickets to verify access and record attendance in real-time."
        action={
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="host-topbar__icon-btn"
            style={{ width: 'auto', padding: '8px 14px', gap: '8px', display: 'inline-flex' }}
            title={soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span style={{ fontSize: '13px' }}>{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>
        }
      />

      {/* Event Selection Bar */}
      <div style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={20} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Active Event:</span>
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setScanResult(null);
            }}
            className="host-tickets__filter"
            style={{ minWidth: '220px' }}
          >
            {events.map(evt => (
              <option key={evt._id} value={evt._id}>
                {evt.title} ({new Date(evt.dateTime).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div>
          {!scanning ? (
            <button
              onClick={startScanner}
              disabled={!selectedEventId}
              className="host-modal__btn host-modal__btn--primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            >
              <Camera size={18} />
              Start Camera Scanner
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="host-modal__btn host-modal__btn--secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', color: 'var(--danger)' }}
            >
              <XCircle size={18} />
              Stop Scanner
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Scanner Container */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            id="qr-reader"
            style={{
              width: '100%',
              maxWidth: '440px',
              minHeight: '320px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#000',
              border: '2px solid var(--border)',
            }}
          />

          {!scanning && (
            <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
              Click <strong>Start Camera Scanner</strong> above to begin scanning participant tickets.
            </p>
          )}

          {scanning && isProcessing && (
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LatticeLoader
                  status="working"
                  label="Verifying Ticket"
                  pattern="orbit"
                  grid={3}
                  shape="round"
                  cellSize={6}
                  gap={2}
                  fontSize={14}
                  step={90}
                  idleOpacity={0.15}
                  showTimer
                  color="#f5f5f5"
                />
              </div>
          )}
            </div>

        {/* Scan Result Feedback Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {scanResult ? (
              <div
                style={{
                  background: scanResult.status === 'success'
                    ? 'rgba(16, 185, 129, 0.08)'
                    : scanResult.status === 'warning'
                      ? 'rgba(245, 158, 11, 0.08)'
                      : 'rgba(239, 68, 68, 0.08)',
                  border: `1.5px solid ${scanResult.status === 'success'
                    ? '#10b981'
                    : scanResult.status === 'warning'
                      ? '#f59e0b'
                      : '#ef4444'
                    }`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  animation: 'fadeInUp 0.3s ease both',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  {scanResult.status === 'success' && <CheckCircle2 size={32} style={{ color: '#10b981' }} />}
                  {scanResult.status === 'warning' && <AlertTriangle size={32} style={{ color: '#f59e0b' }} />}
                  {scanResult.status === 'error' && <XCircle size={32} style={{ color: '#ef4444' }} />}
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {scanResult.message}
                    </h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(scanResult.time || Date.now()).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                {scanResult.student && (
                  <div style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '16px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#6D011A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px' }}>
                        {scanResult.student.name ? scanResult.student.name[0].toUpperCase() : 'S'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)' }}>
                          {scanResult.student.name}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {scanResult.student.email}
                        </div>
                        {scanResult.student.contactNumber && (
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            Contact: {scanResult.student.contactNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)', padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Camera size={36} strokeWidth={1.5} style={{ margin: '0 auto 12px', color: 'var(--text-tertiary)' }} />
                <h4 style={{ margin: '0 0 6px', color: 'var(--text-primary)' }}>Awaiting Scan</h4>
                <p style={{ margin: 0, fontSize: '13px' }}>Point camera at a participant's QR code to verify ticket entry.</p>
              </div>
            )}

            {/* Session Attendance Stream */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '20px' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Recent Check-ins ({recentCheckIns.length})
              </h4>
              {recentCheckIns.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>No check-ins recorded in this session yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recentCheckIns.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600 }}>{item.student?.name || 'Student'}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{item.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      );
}
