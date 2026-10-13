import { useState, useEffect, useMemo } from 'react';
import { Skeleton } from '@/shared/components/ui';
import { MobileContainer, BottomNav, NavTabId } from '@/shared/components/layout';
import { DigitalVetPassport } from '@/shared/types/vet-passport';
import {
  SpeciesRepository,
  PetPassportRepository,
  BookingRepository,
  SeedService,
} from '@/dal';
import {
  AuthProvider,
  useAuth,
  LoginScreen,
} from '@/features/auth';
import { HomeScreen } from '@/features/dashboard';
import { PassportScreen } from '@/features/passport';
import { DispatchScreen } from '@/features/dispatch';
import { AppointmentsScreen } from '@/features/appointments';
import { VeterinaryChatsScreen } from '@/features/chat';
import { TelehealthHubScreen } from '@/features/telehealth';
import { ProfileScreen } from '@/features/profile';
import { DoctorShell } from '@/features/doctor';
import { AdminShell } from '@/features/admin';

function AppContent() {
  const { user, activeRole, setActiveRole, isLoading: isAuthLoading, signOut } = useAuth();

  // Persistent Bottom Navigation State
  const [currentNavTab, setCurrentNavTab] = useState<NavTabId>('home');
  const [isDispatchFlowActive, setIsDispatchFlowActive] = useState<boolean>(false);
  const [isTelehealthHubActive, setIsTelehealthHubActive] = useState<boolean>(false);
  const [selectedPetForPassport, setSelectedPetForPassport] = useState<string | undefined>(undefined);
  const [selectedPetForDispatch, setSelectedPetForDispatch] = useState<DigitalVetPassport | undefined>(undefined);

  // Repositories
  const speciesRepo = useMemo(() => new SpeciesRepository(), []);
  const passportRepo = useMemo(() => new PetPassportRepository(), []);
  const bookingRepo = useMemo(() => new BookingRepository(), []);

  // Initial seeding and repository population
  useEffect(() => {
    async function init() {
      await SeedService.seedAll(speciesRepo, passportRepo);
    }

    init();
  }, [speciesRepo, passportRepo]);

  // 1. Initial Loading State
  if (isAuthLoading) {
    return (
      <MobileContainer>
        <div className="space-y-4 pt-12 text-center">
          <Skeleton.Avatar size="lg" className="mx-auto" />
          <Skeleton shape="text" className="w-48 mx-auto" />
          <Skeleton shape="text" className="w-32 mx-auto" />
          <div className="pt-8">
            <Skeleton.Card />
          </div>
        </div>
      </MobileContainer>
    );
  }

  // 2. Unauthenticated State -> Show Login Screen (Stitch bdc8fcae371f4cf881a32cad5010cf43)
  if (!user) {
    return (
      <MobileContainer>
        <LoginScreen />
      </MobileContainer>
    );
  }

  // 3. Authenticated Admin Role -> VetTech Command Situational Center
  if (user.role === 'admin' || activeRole === 'admin') {
    return (
      <AdminShell
        onSignOut={signOut}
        onSwitchRole={(role) => setActiveRole(role)}
      />
    );
  }

  // 4. Authenticated Veterinarian Role -> Dedicated 4-Tab Doctor Shell
  if (user.role === 'veterinarian' || activeRole === 'veterinarian') {
    return (
      <MobileContainer>
        <DoctorShell
          onSignOut={signOut}
          onSwitchToPetParent={() => setActiveRole('pet_parent')}
        />
      </MobileContainer>
    );
  }

  // 4. Authenticated Pet Parent State -> Persistent 5-Tab Navigation Shell
  return (
    <MobileContainer
      bottomBar={
        <BottomNav
          activeTab={currentNavTab}
          onTabChange={(tab) => {
            setCurrentNavTab(tab);
            setIsDispatchFlowActive(false);
            setIsTelehealthHubActive(false);
          }}
          appointmentsBadgeCount={1}
        />
      }
    >
      {/* TAB 1: HOME DASHBOARD (STITCH SCREEN fc7cb2389101447a99bb1fe37d568c99) */}
      {currentNavTab === 'home' && (
        <HomeScreen
          onNavigateToTab={(tab) => {
            setCurrentNavTab(tab);
            setIsDispatchFlowActive(false);
            setIsTelehealthHubActive(false);
          }}
          onProfileClick={() => setCurrentNavTab('profile')}
          onOpenTelehealth={() => {
            setCurrentNavTab('chats');
            setIsTelehealthHubActive(true);
          }}
          onSelectPetForPassport={(petId) => {
            setSelectedPetForPassport(petId);
            setCurrentNavTab('passport');
          }}
          onSelectPetForDispatch={(pet) => {
            setSelectedPetForDispatch(pet);
            setIsDispatchFlowActive(true);
            setCurrentNavTab('appointments');
          }}
          onRequestHouseCall={() => {
            setIsDispatchFlowActive(true);
            setCurrentNavTab('appointments');
          }}
        />
      )}

      {/* TAB 2: APPOINTMENTS & HOUSE CALL DISPATCH (STITCH SCREEN 0a6d22b5da3149929340f0d52c0949ea) */}
      {currentNavTab === 'appointments' && (
        isDispatchFlowActive ? (
          <DispatchScreen
            passportRepo={passportRepo}
            speciesRepo={speciesRepo}
            bookingRepo={bookingRepo}
            preselectedPet={selectedPetForDispatch}
            onBackToHome={() => setIsDispatchFlowActive(false)}
            onNavigateToPassport={(petId) => {
              setSelectedPetForPassport(petId);
              setCurrentNavTab('passport');
            }}
            onCompleteBooking={() => {
              setIsDispatchFlowActive(false);
            }}
          />
        ) : (
          <AppointmentsScreen
            bookingRepo={bookingRepo}
            onRequestEmergency={() => setIsDispatchFlowActive(true)}
            onBookNewAppointment={() => setIsDispatchFlowActive(true)}
            onNavigateToPassport={(petId) => {
              setSelectedPetForPassport(petId);
              setCurrentNavTab('passport');
            }}
            onProfileClick={() => setCurrentNavTab('profile')}
          />
        )
      )}

      {/* TAB 3: VETERINARY TELE-HEALTH & CHATS (STITCH SCREEN 7c75f50e25e14f81a899043fdd742b63) */}
      {currentNavTab === 'chats' && (
        isTelehealthHubActive ? (
          <TelehealthHubScreen
            onBack={() => setIsTelehealthHubActive(false)}
            onProfileClick={() => setCurrentNavTab('profile')}
          />
        ) : (
          <VeterinaryChatsScreen
            onBack={() => setCurrentNavTab('home')}
            onProfileClick={() => setCurrentNavTab('profile')}
            onOpenTelehealth={() => setIsTelehealthHubActive(true)}
            onNavigateToPassport={(petId) => {
              setSelectedPetForPassport(petId);
              setCurrentNavTab('passport');
            }}
          />
        )
      )}

      {/* TAB 4: DIGITAL VETERINARY PASSPORTS (STITCH SCREEN 24a631500d994af69fdd8c3ba38e9128) */}
      {currentNavTab === 'passport' && (
        <PassportScreen
          passportRepo={passportRepo}
          speciesRepo={speciesRepo}
          initialSelectedPetId={selectedPetForPassport}
          onNavigateToAppointments={(pet) => {
            setSelectedPetForDispatch(pet);
            setIsDispatchFlowActive(true);
            setCurrentNavTab('appointments');
          }}
          onBackToHome={() => setCurrentNavTab('home')}
        />
      )}

      {/* TAB 5: CLIENT IDENTITY, LOGISTICS & FINANCES HUB (STITCH SCREEN 308e6c354b174edaa9901cb123591ccc) */}
      {currentNavTab === 'profile' && (
        <ProfileScreen
          onSignOut={signOut}
          onSwitchToDoctor={() => setActiveRole('veterinarian')}
        />
      )}
    </MobileContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
