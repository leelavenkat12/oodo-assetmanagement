import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarCheck, Eye, XCircle, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export default function MyBookings() {
  const { bookings, currentUser, cancelBooking } = useAppContext();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const myBookings = bookings.filter(booking => !booking.employeeName || booking.employeeName === currentUser?.name);
  const downloadApproval = booking => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([`AssetFlow Booking\nResource: ${booking.resourceName}\nDate: ${booking.date}\nTime: ${booking.time}\nStatus: ${booking.status}`], { type: 'text/plain' }));
    link.download = `booking-${booking.id}.txt`;
    link.click();
    toast.success('Booking details downloaded');
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <CalendarCheck className="w-7 h-7 text-blue-500" />
          Booking History
        </h1>
        <p className="text-slate-400 mt-1">View the status of your requested resources.</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-sm whitespace-nowrap">
                <th className="px-6 py-4 font-medium">Resource</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Time & Duration</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">You have no booking history.</td>
                </tr>
              ) : myBookings.map((booking, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={booking.id} 
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-slate-200">{booking.resourceName}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{booking.date}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{booking.time} ({booking.duration})</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      booking.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      booking.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedBooking(booking)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => downloadApproval(booking)} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Download Approval">
                        <Download className="w-4 h-4" />
                      </button>
                      <button disabled={booking.status !== 'Pending'} onClick={() => { cancelBooking(booking.id); toast.success('Booking cancelled'); }} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30" title="Cancel Booking">
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>{selectedBooking && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80"><motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .95 }} className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6"><div className="flex justify-between"><h2 className="text-xl font-bold">Booking Details</h2><button onClick={() => setSelectedBooking(null)}><X /></button></div><dl className="mt-5 space-y-3 text-sm"><div><dt className="text-slate-500">Resource</dt><dd>{selectedBooking.resourceName}</dd></div><div><dt className="text-slate-500">Schedule</dt><dd>{selectedBooking.date} at {selectedBooking.time}</dd></div><div><dt className="text-slate-500">Purpose</dt><dd>{selectedBooking.purpose}</dd></div><div><dt className="text-slate-500">Status</dt><dd>{selectedBooking.status}</dd></div></dl></motion.div></div>}</AnimatePresence>
    </div>
  );
}
