import { QuickStatsRow } from '@/components/dashboard/quick-stats-row';
import { TodayView } from '@/components/dashboard/today-view';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <QuickStatsRow />

      {/* Today's View */}
      <TodayView />
    </div>
  );
}
