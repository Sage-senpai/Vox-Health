'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { HeaderBar } from '@/components/dashboard/header-bar';
import { RecordingModal } from '@/components/recording/recording-modal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showRecordingModal, setShowRecordingModal] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:block w-64 border-r border-border">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <HeaderBar onRecordClick={() => setShowRecordingModal(true)} />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Recording Modal */}
      <RecordingModal
        isOpen={showRecordingModal}
        onClose={() => setShowRecordingModal(false)}
        onSave={(data) => {
          console.log('[VoxHealth] Recording saved:', data);
          setShowRecordingModal(false);
        }}
      />
    </div>
  );
}
