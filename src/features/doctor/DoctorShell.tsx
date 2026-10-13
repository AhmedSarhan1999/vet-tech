import React, { useState } from 'react';
import {
  Radar,
  PawPrint,
  MessageSquare,
  Wallet,
  UserCheck,
} from 'lucide-react';
import { DoctorDashboardScreen } from './DoctorDashboardScreen';
import { DoctorPatientsScreen } from './DoctorPatientsScreen';
import { DoctorChatsScreen } from './DoctorChatsScreen';
import { DoctorWalletScreen } from './DoctorWalletScreen';
import { DoctorProfileScreen } from './DoctorProfileScreen';
import { DoctorCalendarScreen } from './DoctorCalendarScreen';
import { DoctorActiveVisitScreen, VisitPhase } from './DoctorActiveVisitScreen';
import { DoctorProceduresScreen } from './DoctorProceduresScreen';
import { DoctorCreateReportScreen } from './DoctorCreateReportScreen';
import { DoctorFinalSettlementScreen } from './DoctorFinalSettlementScreen';
import { DoctorShiftTariffScreen } from './DoctorShiftTariffScreen';

export type DoctorTabId = 'radar' | 'patients' | 'chats' | 'wallet' | 'profile';
export type DoctorSubView =
  | 'calendar'
  | 'active_visit'
  | 'procedures'
  | 'create_report'
  | 'final_settlement'
  | 'shift_tariffs';

export interface DoctorShellProps {
  readonly onSignOut?: () => void;
  readonly onSwitchToPetParent?: () => void;
}

export const DoctorShell: React.FC<DoctorShellProps> = ({
  onSignOut,
  onSwitchToPetParent,
}) => {
  const [activeTab, setActiveTab] = useState<DoctorTabId>('radar');
  const [activeSubView, setActiveSubView] = useState<DoctorSubView | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Persistent visit lifecycle state across subviews (Permanent Handshake Retirement)
  const [visitPhase, setVisitPhase] = useState<VisitPhase>('HANDSHAKE_PIN');
  const [pendingProcedureNotice, setPendingProcedureNotice] = useState<string | null>(null);
  const [proceduresTab, setProceduresTab] = useState<'procedures' | 'medications'>('procedures');

  // Sub-view: Shift & Tariff Configurator
  if (activeSubView === 'shift_tariffs') {
    return (
      <DoctorShiftTariffScreen
        onBack={() => setActiveSubView(null)}
      />
    );
  }

  // Sub-view: Full Calendar
  if (activeSubView === 'calendar') {
    return (
      <DoctorCalendarScreen
        onBack={() => setActiveSubView(null)}
        onSelectVisit={(_visitId) => {
          setActiveSubView('active_visit');
        }}
      />
    );
  }

  // Sub-view: Active Visit Handshake & Dead-Man Monitor
  if (activeSubView === 'active_visit') {
    return (
      <DoctorActiveVisitScreen
        initialPhase={visitPhase}
        onPhaseChange={(newPhase) => {
          setVisitPhase(newPhase);
        }}
        pendingProcedureNotice={pendingProcedureNotice}
        onBack={() => {
          setActiveSubView(null);
        }}
        onCompleteVisit={() => {
          setActiveSubView(null);
          setActiveTab('patients');
        }}
        onOpenProcedures={(tab) => {
          setProceduresTab(tab || 'procedures');
          setActiveSubView('procedures');
        }}
        onProceedToReport={() => {
          setActiveSubView('create_report');
        }}
      />
    );
  }

  // Sub-view: Mobile Kit & Bedside Add-On Procedures
  if (activeSubView === 'procedures') {
    return (
      <DoctorProceduresScreen
        initialTab={proceduresTab}
        onBack={() => {
          setVisitPhase('IN_EXAM_MONITOR');
          setActiveSubView('active_visit');
        }}
        onRequestConsent={(_addedAmount, details) => {
          setVisitPhase('IN_EXAM_MONITOR');
          setPendingProcedureNotice(details || `+${_addedAmount} ₽`);
          setActiveSubView('active_visit');
        }}
      />
    );
  }

  // Sub-view: Clinical Report & Smart e-Prescription Authoring
  if (activeSubView === 'create_report') {
    return (
      <DoctorCreateReportScreen
        onBack={() => {
          setVisitPhase('IN_EXAM_MONITOR');
          setActiveSubView('active_visit');
        }}
        onSignAndProceed={() => {
          setActiveSubView('final_settlement');
        }}
      />
    );
  }

  // Sub-view: Final Visit Settlement & SBP Payout
  if (activeSubView === 'final_settlement') {
    return (
      <DoctorFinalSettlementScreen
        onReturnToRadar={() => {
          setActiveSubView(null);
          setActiveTab('radar');
          setVisitPhase('HANDSHAKE_PIN');
          setPendingProcedureNotice(null);
        }}
        onBack={() => setActiveSubView('create_report')}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Tab Screen Content */}
      <main className="flex-1">
        {activeTab === 'radar' && (
          <DoctorDashboardScreen
            onOpenVisit={(_visitId) => {
              setActiveSubView('active_visit');
            }}
            onOpenCalendar={() => setActiveSubView('calendar')}
            onOpenWallet={() => setActiveTab('wallet')}
          />
        )}

        {activeTab === 'patients' && (
          <DoctorPatientsScreen
            onOpenCalendar={() => setActiveSubView('calendar')}
            onSelectVisit={(_visitId) => {
              setActiveSubView('active_visit');
            }}
            onOpenTelehealth={() => {
              setActiveTab('chats');
            }}
            onOpenShiftTariffs={() => {
              setActiveSubView('shift_tariffs');
            }}
          />
        )}

        {activeTab === 'chats' && (
          <DoctorChatsScreen
            onOpenVisit={(_visitId) => {
              setActiveSubView('active_visit');
            }}
            onChatOpenChange={setIsChatOpen}
          />
        )}

        {activeTab === 'wallet' && (
          <DoctorWalletScreen
            onOpenDashboard={() => {
              setIsChatOpen(false);
              setActiveTab('radar');
            }}
          />
        )}

        {activeTab === 'profile' && (
          <DoctorProfileScreen
            onSwitchToPetParent={onSwitchToPetParent}
            onSignOut={onSignOut}
          />
        )}
      </main>

      {/* Dedicated Doctor Bottom Navigation Shell (5-Tab Architecture) - Hidden when Chat Room is Active */}
      {!isChatOpen && (
        <nav
          aria-label="Навигация врача"
          className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 z-30 shadow-lg"
        >
          <div className="grid grid-cols-5 gap-1 text-center">
            {/* Tab 1: Радар */}
            <button
              type="button"
              onClick={() => {
                setIsChatOpen(false);
                setActiveSubView(null);
                setActiveTab('radar');
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'radar'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <Radar className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate">Радар</span>
            </button>

            {/* Tab 2: Пациенты */}
            <button
              type="button"
              onClick={() => {
                setIsChatOpen(false);
                setActiveSubView(null);
                setActiveTab('patients');
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'patients'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="relative">
                <PawPrint className="w-5 h-5 shrink-0" />
                <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[9px] font-black font-mono text-white bg-blue-600 rounded-full min-w-3.5 text-center leading-tight">
                  2
                </span>
              </div>
              <span className="text-[10px] mt-0.5 truncate">Пациенты</span>
            </button>

            {/* Tab 3: Чаты */}
            <button
              type="button"
              onClick={() => {
                setActiveSubView(null);
                setActiveTab('chats');
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'chats'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <div className="relative">
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[9px] font-black font-mono text-white bg-blue-600 rounded-full min-w-3.5 text-center leading-tight">
                  1
                </span>
              </div>
              <span className="text-[10px] mt-0.5 truncate">Чаты</span>
            </button>

            {/* Tab 4: Кошелек */}
            <button
              type="button"
              onClick={() => {
                setIsChatOpen(false);
                setActiveSubView(null);
                setActiveTab('wallet');
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'wallet'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <Wallet className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate">Кошелек</span>
            </button>

            {/* Tab 5: Профиль */}
            <button
              type="button"
              onClick={() => {
                setIsChatOpen(false);
                setActiveSubView(null);
                setActiveTab('profile');
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'text-blue-600 font-black'
                  : 'text-slate-500 hover:text-slate-900 font-semibold'
              }`}
            >
              <UserCheck className="w-5 h-5 shrink-0" />
              <span className="text-[10px] mt-0.5 truncate">Профиль</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};


