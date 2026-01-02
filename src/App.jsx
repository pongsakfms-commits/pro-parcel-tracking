import React, { useState } from 'react';
import { Package, Truck, MapPin, Search, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

import LiveMap from './components/LiveMap';
import { db } from './firebase';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';

function App() {
    const [orderId, setOrderId] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // --- REAL-TIME TRACKING ---
    const handleTrack = async (e) => {
        e.preventDefault();
        if (!orderId) return;

        setLoading(true);
        setError('');
        setTrackingData(null);

        // Reference to the order in Firestore
        const docRef = doc(db, "orders", orderId.trim());

        // 1. Check if exists first
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            setLoading(false);
            setError('Order ID not found. Try creating a test order first.');
            return;
        }

        // 2. Listen for Real-time Updates (Magic happens here!)
        onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                // Helper to generate timeline based on status
                const getSteps = (currentStatus) => {
                    const allSteps = ['Order Received', 'Picked Up', 'In Transit', 'Delivered'];
                    const currentIndex = allSteps.indexOf(currentStatus);

                    return allSteps.map((step, index) => ({
                        title: step,
                        time: index <= currentIndex ? 'Completed' : 'Pending',
                        completed: index <= currentIndex,
                        current: index === currentIndex
                    }));
                };

                setTrackingData({
                    id: doc.id,
                    status: data.status,
                    eta: data.eta,
                    progress: data.progress,
                    location: { lat: data.lat, lng: data.lng },
                    proofPhoto: data.proofPhoto || null,
                    steps: getSteps(data.status) // Use the helper
                });
            }
            setLoading(false);
        });
    };

    // --- HELPER: CREATE TEST DATA ---
    const createTestOrder = async () => {
        setLoading(true);
        try {
            await setDoc(doc(db, "orders", "ORD-999"), {
                status: "Picked Up",
                eta: "18:00 PM Today",
                progress: 30,
                lat: 13.7563,
                lng: 100.5018, // Bangkok
                steps: [
                    { title: 'Order Received', time: '10:00 AM', completed: true },
                    { title: 'Picked Up', time: '11:30 AM', completed: true, current: true },
                    { title: 'In Transit', time: 'Pending', completed: false },
                    { title: 'Delivered', time: 'Pending', completed: false },
                ]
            });
            alert("✅ Created ORD-999 in Firebase!");
            setOrderId("ORD-999");
        } catch (err) {
            console.error(err);
            alert("Error creating data: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="container">
            {/* Header */}
            <header className="animate-enter" style={{ marginBottom: '40px', marginTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
                        <Package color="white" size={24} />
                    </div>
                    <h1 style={{ margin: 0, fontSize: '24px' }}>ProTrack</h1>
                </div>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>Premium Logistics Partner</p>
            </header>

            {/* Search Box */}
            <div className="glass-panel animate-enter" style={{ padding: '24px', marginBottom: '24px', animationDelay: '0.1s' }}>
                <h2 style={{ fontSize: '18px', marginTop: 0 }}>Track your Package</h2>
                <form onSubmit={handleTrack} style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter Order ID (e.g. ORD-999)"
                            style={{ paddingLeft: '44px' }}
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Searching...' : 'Track Package'}
                    </button>

                    {/* Dev Button */}
                    <button type="button" onClick={createTestOrder} style={{ background: 'transparent', border: '1px dashed #555', color: '#888', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>
                        + Create Test Order "ORD-999" (Dev Only)
                    </button>
                </form>
                {error && <p style={{ color: '#ef4444', marginTop: '12px', textAlign: 'center' }}>{error}</p>}
            </div>

            {/* Tracking Result */}
            {trackingData && (
                <div className="animate-enter" style={{ animationDelay: '0.2s' }}>

                    {/* Map Section */}
                    {trackingData.location && (
                        <div className="glass-panel" style={{ padding: '0', marginBottom: '16px', overflow: 'hidden' }}>
                            <LiveMap center={trackingData.location} />
                        </div>
                    )}

                    {/* Status Card */}
                    <div className="glass-panel" style={{ padding: '24px', marginBottom: '16px', backgroundImage: 'var(--accent-gradient)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <p style={{ margin: 0, opacity: 0.8, fontSize: '14px' }}>Status</p>
                                <h2 style={{ margin: '4px 0 0', fontSize: '24px' }}>{trackingData.status}</h2>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
                                <Truck color="white" size={24} />
                            </div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${trackingData.progress}%`, background: 'white', height: '100%' }}></div>
                        </div>
                        <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '14px', opacity: 0.9 }}>
                            Arriving by {(() => {
                                if (!trackingData.eta) return '-';
                                const date = new Date(trackingData.eta);
                                return !isNaN(date)
                                    ? date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                                    : trackingData.eta;
                            })()}
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Timeline</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {trackingData.steps.map((step, index) => (
                                <div key={index} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                    {/* Line connector */}
                                    {index !== trackingData.steps.length - 1 && (
                                        <div style={{
                                            position: 'absolute', left: '11px', top: '24px', bottom: '-24px', width: '2px',
                                            background: step.completed ? 'var(--primary)' : 'rgba(255,255,255,0.1)'
                                        }}></div>
                                    )}

                                    {/* Icon */}
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        background: step.completed ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        zIndex: 1
                                    }}>
                                        {step.completed ? <CheckCircle2 size={14} color="white" /> : <Clock size={14} color="gray" />}
                                    </div>

                                    {/* Text */}
                                    <div>
                                        <h4 style={{ margin: '0 0 4px', color: step.completed ? 'white' : 'var(--text-muted)' }}>{step.title}</h4>
                                        <p style={{ margin: 0, fontSize: '12px', color: step.completed ? 'var(--text-muted)' : '#555' }}>{step.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Proof of Delivery Section (New) */}
                    {trackingData.proofPhoto && (
                        <div className="glass-panel" style={{ padding: '24px', marginTop: '16px', borderLeft: '4px solid #10b981' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle2 color="#10b981" size={20} />
                                Proof of Delivery
                            </h3>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '14px', opacity: 0.8 }}>Image Reference Code:</p>
                                <code style={{ display: 'block', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '4px', fontSize: '12px', wordBreak: 'break-all' }}>
                                    {trackingData.proofPhoto}
                                </code>
                                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#10b981' }}>
                                    (Image secured in Admin Database)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}


        </div>
    );
}

export default App;
