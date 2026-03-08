import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../utils/api';

export default function Attendance() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        // Find the employee profile for the current user
        const { data: employees } = await api.get('/employees');
        const myProfile = employees.find(emp => emp.user?._id === user?._id);
        
        if (myProfile) {
          setEmployeeId(myProfile._id);
          // Fetch my attendance records
          const { data: records } = await api.get('/attendance');
          const myRecords = records.filter(rec => 
            rec.employee?._id === myProfile._id || rec.employee === myProfile._id
          );
          setAttendanceRecords(myRecords.reverse());
          
          // Check if checked in today
          const todayStarted = new Date().setHours(0,0,0,0);
          const todaysRecord = myRecords.find(rec => new Date(rec.date).getTime() >= todayStarted);
          
          if (todaysRecord && !todaysRecord.checkOut) {
            setIsCheckedIn(true);
            setCheckInTime(new Date(todaysRecord.checkIn));
          } else {
            setIsCheckedIn(false);
          }
        } else {
          console.warn("No employee profile found for user:", user?._id);
        }
      } catch (error) {
        console.error('Failed to fetch attendance status:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchStatus();
    }
  }, [user]);

  const handleCheckInOut = async () => {
    if (!employeeId) return alert('Employee profile not found. Please contact HR.');
    
    try {
      if (!isCheckedIn) {
        // Check In
        const res = await api.post('/attendance/check-in', { employeeId });
        setCheckInTime(new Date(res.data.checkIn));
        setIsCheckedIn(true);
      } else {
        // Check Out
        await api.post('/attendance/check-out', { employeeId });
        setIsCheckedIn(false);
        setCheckInTime(null);
        // Refresh records to show the updated list
        const { data: records } = await api.get('/attendance');
        const myRecords = records.filter(rec => rec.employee?._id === employeeId || rec.employee === employeeId);
        setAttendanceRecords(myRecords.reverse());
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating attendance');
      console.error(error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getWorkingDuration = () => {
    if (!checkInTime) return '0h 0m';
    const diff = Math.floor((new Date() - checkInTime) / 1000); // seconds
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">Log your daily working hours.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <Clock className="w-16 h-16 text-primary mb-4 opacity-80" />
          <h2 className="text-4xl font-mono font-bold tracking-tight text-foreground mb-2">
            {formatTime(currentTime)}
          </h2>
          <p className="text-muted-foreground mb-8">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <button
            onClick={handleCheckInOut}
            disabled={loading}
            className={`flex items-center px-8 py-4 rounded-full font-bold text-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 ${
              isCheckedIn 
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {loading ? 'Processing...' : isCheckedIn ? (
              <><LogOut className="w-6 h-6 mr-2" /> Check Out</>
            ) : (
              <><LogIn className="w-6 h-6 mr-2" /> Check In</>
            )}
          </button>

          {isCheckedIn && (
            <p className="mt-6 text-sm text-muted-foreground flex items-center bg-muted/50 px-4 py-2 rounded-lg border border-border">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              Checked in since {formatTime(checkInTime)}
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-foreground">Today&apos;s Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 sm:p-4 bg-muted/30 rounded-lg border border-border">
                <span className="text-muted-foreground flex items-center">
                  <LogIn className="w-4 h-4 mr-2" /> Entry Time
                </span>
                <span className="font-semibold text-foreground">{checkInTime ? formatTime(checkInTime) : '--:--:--'}</span>
              </div>
              <div className="flex justify-between items-center p-3 sm:p-4 bg-muted/30 rounded-lg border border-border">
                <span className="text-muted-foreground flex items-center">
                  <Clock className="w-4 h-4 mr-2" /> Duration Logged
                </span>
                <span className="font-semibold text-primary">{isCheckedIn ? getWorkingDuration() : '0h 0m'}</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 text-foreground">Recent Activity</h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
              {attendanceRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              ) : (
                attendanceRecords.slice(0, 5).map((rec, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 hover:bg-muted/30 rounded-lg transition-colors border border-transparent hover:border-border">
                    <div className="mt-0.5 p-1 bg-green-500/10 text-green-500 rounded flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">
                        {rec.checkOut ? `Completed Shift` : `Currently Working`}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(rec.date).toLocaleDateString()}
                        {rec.workingHours ? ` • ${rec.workingHours.toFixed(1)}h` : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
