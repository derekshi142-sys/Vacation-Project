import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const MyTrips = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const q = query(
            collection(db, 'user-inputs-test'),
            where('userId', '==', u.uid),
            orderBy('createdAt', 'desc')
          );
          const snap = await getDocs(q);
          const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setItems(rows);
        } catch (e) {
          console.error('Failed to load trips:', e);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Loading your trips...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your saved trips.</p>
          <a href="/login" className="btn-primary inline-block">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Trips</h1>
        {items.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-4">Start planning your first adventure!</p>
            <a href="/plan" className="btn-primary inline-block">Plan New Trip</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it) => (
              <div key={it.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{it.destination || 'Trip'}</h3>
                    <span className="text-xs text-gray-500">{it.travelStyle}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {it.startDate} → {it.endDate}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{it.travelers} {it.travelers === 1 ? 'traveler' : 'travelers'}</span>
                    <span>${it.budget} ({it.budgetType})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrips;


