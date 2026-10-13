import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar, AdminTabId } from './AdminSidebar';
import { AdminDispatchScreen } from './AdminDispatchScreen';
import { AdminSafetyScreen } from './AdminSafetyScreen';
import { AdminArbitrationScreen } from './AdminArbitrationScreen';
import { AdminAccreditationScreen } from './AdminAccreditationScreen';
import { AdminSupportScreen } from './AdminSupportScreen';
import { AdminAnalyticsScreen } from './AdminAnalyticsScreen';

export interface AdminShellProps {
  readonly onSignOut?: () => void;
  readonly onSwitchRole?: (role: 'pet_parent' | 'veterinarian') => void;
  readonly initialTab?: AdminTabId;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  onSignOut,
  onSwitchRole,
  initialTab = 'dispatch',
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabId>(initialTab);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Situational Top Header */}
      <AdminHeader
        onSignOut={onSignOut}
        onSwitchRole={onSwitchRole}
        emergencyCount={activeTab === 'safety' ? 1 : 0}
      />

      {/* Main Two-Column Situational Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        {/* Left Persistent Navigation Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 min-w-0 overflow-y-auto max-w-7xl mx-auto w-full pb-16">
          {activeTab === 'dispatch' && (
            <AdminDispatchScreen
              onOpenSafety={() => setActiveTab('safety')}
              onOpenArbitration={() => setActiveTab('arbitration')}
            />
          )}

          {activeTab === 'safety' && (
            <AdminSafetyScreen
              onOpenDispatch={() => setActiveTab('dispatch')}
            />
          )}

          {activeTab === 'arbitration' && (
            <AdminArbitrationScreen
              onOpenDispatch={() => setActiveTab('dispatch')}
            />
          )}

          {activeTab === 'accreditation' && (
            <AdminAccreditationScreen
              onBackToDispatch={() => setActiveTab('dispatch')}
            />
          )}

          {activeTab === 'support' && (
            <AdminSupportScreen
              onOpenSafety={() => setActiveTab('safety')}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalyticsScreen
              onOpenSafety={() => setActiveTab('safety')}
            />
          )}
        </main>
      </div>
    </div>
  );
};

