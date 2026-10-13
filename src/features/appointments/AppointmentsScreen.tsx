import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../auth/AuthContext';
import { BookingRepository } from '@/dal/booking.repository';
import { BookingOrder, ScheduledBookingOrder } from '@/shared/types/booking';
import { ArrivalHandshakeScreen } from './ArrivalHandshakeScreen';
import { ClinicalProtocolScreen, ClinicalProtocolData } from '@/features/history';
import {
  Calendar,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Car,
  FileText,
  Lock,
  PhoneCall,
  ChevronRight,
  Info,
  X,
  Zap,
  Stethoscope,
  Radio,
  FileCheck2,
  CheckCircle2,
  Receipt,
  RotateCcw,
  Key,
} from 'lucide-react';

export interface AppointmentsScreenProps {
  readonly bookingRepo?: BookingRepository;
  readonly onRequestEmergency?: () => void;
  readonly onBookNewAppointment?: () => void;
  readonly onNavigateToPassport?: (petId?: string) => void;
  readonly onProfileClick?: () => void;
  readonly onOpenArrivalHandshake?: () => void;
}

interface HistoricalCompletedVisit {
  readonly id: string;
  readonly completedDateText: string;
  readonly completedTimeText: string;
  readonly title: string;
  readonly doctor: {
    readonly name: string;
    readonly specialty: string;
    readonly almaMater: string;
    readonly vetIsLicense: string;
    readonly digitalSignatureVerified: boolean;
  };
  readonly patient: {
    readonly name: string;
    readonly speciesBreed: string;
    readonly ageGender: string;
    readonly verifiedWeightKg: number;
    readonly chipNumber: string;
    readonly passportSeriesNumber: string;
  };
  readonly anamnesisAndProcedures: {
    readonly chiefComplaint: string;
    readonly procedures: readonly string[];
    readonly clinicalNotes: string;
  };
  readonly vetIsProtocolNumber: string;
  readonly fiscalReceipt: {
    readonly totalRubles: number;
    readonly fiscalNumber: string;
    readonly paymentProvider: string;
    readonly lawCompliance: string;
  };
}

interface CancelledVisitItem {
  readonly id: string;
  readonly scheduledDateText: string;
  readonly scheduledTimeRange: string;
  readonly cancelledAtText: string;
  readonly cancellationReason: string;
  readonly doctorName: string;
  readonly doctorSpecialty: string;
  readonly petName: string;
  readonly petBreed: string;
  readonly escrowStatus: {
    readonly originalHoldRubles: number;
    readonly feeRubles: number;
    readonly refundStatusText: string;
    readonly escrowProvider: string;
  };
}

const COMPLETED_VISITS: readonly HistoricalCompletedVisit[] = [
  {
    id: 'comp-1',
    completedDateText: '14 мая 2026',
    completedTimeText: '15:42',
    title: 'Диспансеризация и забор биоматериалов (ОАК + Биохимия)',
    doctor: {
      name: 'Д-р Смирнова Екатерина В.',
      specialty: 'Ветврач-инфекционист / Терапевт',
      almaMater: 'СПбГУВМ (Стаж 8 лет)',
      vetIsLicense: 'ФГИС «ВетИС» #RU-78/VET-5418',
      digitalSignatureVerified: true,
    },
    patient: {
      name: 'Норд',
      speciesBreed: 'Собака • Сибирский хаски',
      ageGender: 'Кобель, 3 года',
      verifiedWeightKg: 26.4,
      chipNumber: '643094100234567',
      passportSeriesNumber: 'ВЕТ-491',
    },
    anamnesisAndProcedures: {
      chiefComplaint: 'Плановый профилактический чекап перед летним сезоном.',
      procedures: [
        'Клинический осмотр, термометрия (T 38.6°C), аускультация',
        'Люминесцентная диагностика лампой Вуда (отрицательно)',
        'Забор венозной крови на ОАК и биохимический профиль (12 показателей)',
      ],
      clinicalNotes: 'Паразитарных инвазий не обнаружено. Слизистые оболочки бледно-розовые. Показатели гемодинамики в пределах нормы.',
    },
    vetIsProtocolNumber: 'RU-78/VET-5418',
    fiscalReceipt: {
      totalRubles: 2900,
      fiscalNumber: 'ФН #92810001004',
      paymentProvider: 'ЮKassa Эскроу',
      lawCompliance: '54-ФЗ',
    },
  },
  {
    id: 'comp-2',
    completedDateText: '22 февраля 2026',
    completedTimeText: '11:15',
    title: 'Экстренная помощь: купирование острой аллергической реакции',
    doctor: {
      name: 'Д-р Романов Дмитрий С.',
      specialty: 'Ветврач-терапевт, хирург',
      almaMater: 'СПбГУВМ (Стаж 11 лет)',
      vetIsLicense: 'ФГИС «ВетИС» #RU-78/VET-4190',
      digitalSignatureVerified: true,
    },
    patient: {
      name: 'Норд',
      speciesBreed: 'Собака • Сибирский хаски',
      ageGender: 'Кобель, 3 года',
      verifiedWeightKg: 26.1,
      chipNumber: '643094100234567',
      passportSeriesNumber: 'ВЕТ-491',
    },
    anamnesisAndProcedures: {
      chiefComplaint: 'Отек морды и крапивница после контакта с бытовой химией.',
      procedures: [
        'Неотложная противошоковая терапия (Дексаметазон + Супрастин в/м)',
        'Мониторинг сатурации кислорода и частоты дыхания',
        'Обработка слизистых физиологическим раствором',
      ],
      clinicalNotes: 'Отек морды полностью купирован в течение 40 минут. Дыхание свободное, хрипы отсутствуют. Назначена элиминационная диета.',
    },
    vetIsProtocolNumber: 'RU-78/VET-4190',
    fiscalReceipt: {
      totalRubles: 3500,
      fiscalNumber: 'ФН #92810000892',
      paymentProvider: 'ЮKassa Эскроу',
      lawCompliance: '54-ФЗ',
    },
  },
  {
    id: 'comp-3',
    completedDateText: '18 октября 2025',
    completedTimeText: '14:20',
    title: 'Ежегодная ревакцинация Nobivac DHPPi + Lepto + Rabies',
    doctor: {
      name: 'Д-р Романов Дмитрий С.',
      specialty: 'Ветврач-терапевт, хирург',
      almaMater: 'СПбГУВМ (Стаж 11 лет)',
      vetIsLicense: 'ФГИС «ВетИС» #RU-78/VET-3022',
      digitalSignatureVerified: true,
    },
    patient: {
      name: 'Норд',
      speciesBreed: 'Собака • Сибирский хаски',
      ageGender: 'Кобель, 2.5 года',
      verifiedWeightKg: 25.8,
      chipNumber: '643094100234567',
      passportSeriesNumber: 'ВЕТ-491',
    },
    anamnesisAndProcedures: {
      chiefComplaint: 'Плановая ежегодная вакцинация и отметка в международном ветпаспорте.',
      procedures: [
        'Превакцинальный клинический осмотр, термометрия (T 38.5°C)',
        'Введение биопрепарата Nobivac DHPPi + L (серия А123В)',
        'Введение вакцины Nobivac Rabies (серия R982A) против бешенства',
        'Внесение записи во ФГИС «Меркурий» и «Хорриот»',
      ],
      clinicalNotes: 'Поствакцинальных осложнений не выявлено. Карантинный период 14 дней разъяснен владельцу под роспись.',
    },
    vetIsProtocolNumber: 'RU-78/VET-3022',
    fiscalReceipt: {
      totalRubles: 2800,
      fiscalNumber: 'ФН #92810000411',
      paymentProvider: 'ЮKassa Эскроу',
      lawCompliance: '54-ФЗ',
    },
  },
  {
    id: 'comp-4',
    completedDateText: '12 июня 2025',
    completedTimeText: '16:05',
    title: 'Первичный чип-скрининг и внесение в ФГИС «Хорриот»',
    doctor: {
      name: 'Д-р Васильев Кирилл М.',
      specialty: 'Ветеринарный врач общей практики',
      almaMater: 'СПбГАВМ (Стаж 6 лет)',
      vetIsLicense: 'ФГИС «ВетИС» #RU-78/VET-1854',
      digitalSignatureVerified: true,
    },
    patient: {
      name: 'Норд',
      speciesBreed: 'Собака • Сибирский хаски',
      ageGender: 'Кобель, 2 года',
      verifiedWeightKg: 25.2,
      chipNumber: '643094100234567',
      passportSeriesNumber: 'ВЕТ-491',
    },
    anamnesisAndProcedures: {
      chiefComplaint: 'Имплантация электронного транспондера ISO для международных поездок.',
      procedures: [
        'Проверка работоспособности микрочипа до имплантации сканером ISO 11784/11785',
        'Асептическая подкожная имплантация в область левой лопатки',
        'Контрольное считывание транспондера (код: 643094100234567)',
        'Регистрация в национальной базе «Хорриот» и выдача сертификата',
      ],
      clinicalNotes: 'Транспондер позиционирован корректно. Кровотечения нет. Сертификат чипирования выдан владельцу.',
    },
    vetIsProtocolNumber: 'RU-78/VET-1854',
    fiscalReceipt: {
      totalRubles: 2200,
      fiscalNumber: 'ФН #92810000102',
      paymentProvider: 'ЮKassa Эскроу',
      lawCompliance: '54-ФЗ',
    },
  },
];

const CANCELLED_VISITS: readonly CancelledVisitItem[] = [
  {
    id: 'canc-1',
    scheduledDateText: 'Понедельник, 11 октября 2026',
    scheduledTimeRange: '10:00 - 11:30',
    cancelledAtText: '10 октября в 18:30 (за 15.5 ч до визита)',
    cancellationReason: 'Отменено владельцем: симптомы вялости купированы диетой, питомец активен и принимает пищу.',
    doctorName: 'Д-р Романов Дмитрий С.',
    doctorSpecialty: 'Ветврач-терапевт, хирург',
    petName: 'Норд',
    petBreed: 'Сибирский хаски',
    escrowStatus: {
      originalHoldRubles: 2800,
      feeRubles: 0,
      refundStatusText: '100% средств разблокировано на карте МИР •••• 4412 (0 ₽ штрафа)',
      escrowProvider: 'ЮKassa Эскроу',
    },
  },
];

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({
  bookingRepo,
  onRequestEmergency,
  onBookNewAppointment,
  onNavigateToPassport,
  onProfileClick,
  onOpenArrivalHandshake,
}) => {
  const { user } = useAuth();
  const repo = useMemo(() => bookingRepo ?? new BookingRepository(), [bookingRepo]);

  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const [activeOrders, setActiveOrders] = useState<readonly BookingOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<BookingOrder | null>(null);

  // Dynamic lifecycle time-window state: State A (Before deadline) vs State B (Crew arrived)
  const [simulationState, setSimulationState] = useState<'before_deadline' | 'crew_arrived'>('before_deadline');

  // Internal Arrival Handshake View navigation
  const [isHandshakeScreenOpen, setIsHandshakeScreenOpen] = useState<boolean>(false);

  // Internal Clinical Protocol View navigation
  const [selectedProtocolVisit, setSelectedProtocolVisit] = useState<HistoricalCompletedVisit | null>(null);
  const [isProtocolScreenOpen, setIsProtocolScreenOpen] = useState<boolean>(false);

  // Modals
  const [isRestraintModalOpen, setIsRestraintModalOpen] = useState<boolean>(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load bookings from repo
  useEffect(() => {
    async function loadBookings() {
      const res = await repo.findAll();
      if (res.success && res.data.length > 0) {
        const active = res.data.filter((o) => o.status !== 'CANCELLED');
        setActiveOrders(active);
        setSelectedOrder(active[active.length - 1] ?? null);
      }
    }

    loadBookings();
  }, [repo]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCancelVisit = async () => {
    if (selectedOrder) {
      await repo.cancelBooking(selectedOrder.id, 'Отменено пользователем до наступления дедлайна 12:00');
      const res = await repo.findAll();
      if (res.success) {
        const active = res.data.filter((o) => o.status !== 'CANCELLED');
        setActiveOrders(active);
        setSelectedOrder(active[0] ?? null);
      }
    }
    setIsCancelModalOpen(false);
    showToast('Выезд успешно отменен. Сумма 2 800 ₽ полностью разблокирована на карте (0 ₽ штрафа).');
  };

  const handleOpenHandshake = () => {
    if (onOpenArrivalHandshake) {
      onOpenArrivalHandshake();
    } else {
      setIsHandshakeScreenOpen(true);
    }
  };

  // User initials
  const userInitials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ВЛ';

  // Planned order details
  const scheduledOrder = selectedOrder && selectedOrder.dispatchType === 'scheduled'
    ? (selectedOrder as ScheduledBookingOrder)
    : null;

  // Mount ArrivalHandshakeScreen if active
  if (isHandshakeScreenOpen) {
    return (
      <ArrivalHandshakeScreen
        onBack={() => setIsHandshakeScreenOpen(false)}
        pinCode="4819"
        doctorName={selectedOrder?.doctor.name ?? 'Д-р Романов К. В.'}
        doctorTitle={selectedOrder?.doctor.specialization ?? 'Ветврач-терапевт, хирург • Стаж 11 лет'}
        vehiclePlate="Е 742 ТХ 198"
        petName={selectedOrder?.pet.name ?? 'Норд'}
        addressText={selectedOrder?.address.fullAddressText ?? 'г. Санкт-Петербург, ул. Ленина, д. 28'}
      />
    );
  }

  // Mount ClinicalProtocolScreen if active
  if (isProtocolScreenOpen && selectedProtocolVisit) {
    const protocolPayload: ClinicalProtocolData = {
      visitId: `#${selectedProtocolVisit.vetIsProtocolNumber.replace('RU-78/', '')}`,
      protocolNumber: `#${selectedProtocolVisit.vetIsProtocolNumber.replace('RU-78/', '')}`,
      vetIsNumber: `#78-${selectedProtocolVisit.vetIsProtocolNumber.split('-')[1] ?? '9042'}`,
      dateText: selectedProtocolVisit.completedDateText,
      timeText: selectedProtocolVisit.completedTimeText,
      doctor: {
        name: selectedProtocolVisit.doctor.name,
        specialty: selectedProtocolVisit.doctor.specialty,
        almaMater: selectedProtocolVisit.doctor.almaMater,
        experienceYears: 11,
        vetIsLicense: selectedProtocolVisit.doctor.vetIsLicense,
        digitalSignatureVerified: selectedProtocolVisit.doctor.digitalSignatureVerified,
      },
      patient: {
        name: selectedProtocolVisit.patient.name,
        speciesBreed: selectedProtocolVisit.patient.speciesBreed,
        ageGender: selectedProtocolVisit.patient.ageGender,
        verifiedWeightKg: selectedProtocolVisit.patient.verifiedWeightKg,
        chipNumber: selectedProtocolVisit.patient.chipNumber,
        passportSeriesNumber: selectedProtocolVisit.patient.passportSeriesNumber,
        temperament: 'Спокойный при хозяине (стрессует при манипуляциях, осмотрен без седации)',
      },
      diagnosis: {
        code: 'МКБ-ВЕТ K52.9',
        title: selectedProtocolVisit.title,
        rectalTemperature: '38.6°C (Норма)',
        objectiveFindings: selectedProtocolVisit.anamnesisAndProcedures.chiefComplaint,
        prognosis: selectedProtocolVisit.anamnesisAndProcedures.clinicalNotes,
      },
      rapidTest: {
        title: 'Экспресс-тест Ag Parvovirus / Coronavirus: ОТРИЦАТЕЛЬНЫЙ (-)',
        result: 'NEGATIVE',
        lotNumber: '#VET-8831',
        expirationDate: '09/2026',
        interpretation: 'Проведено у постели пациента. Тест-система лот: #VET-8831. Парвовирусный и коронавирусный энтериты собак исключены.',
      },
      smartSchedule: {
        dayText: 'ДЕНЬ 1 ИЗ 7',
        medicationName: 'Синулокс 250 мг',
        activeSubstance: 'Амоксициллин + клавулановая кислота (жевательные таблетки)',
        dosageInstruction: `1.5 таблетки (355 мг) строго рассчитано на вес ${selectedProtocolVisit.patient.verifiedWeightKg} кг, 2 раза в день после кормления.`,
        warningText: 'Курс 7 дней строго: не прерывать досрочно во избежание рецидива и антибиотикорезистентности.',
        totalDoses: 14,
        initialTakenDoses: 1,
        nextDoseTime: '20:30',
        remainingDays: 6,
      },
      dietAndCare: {
        dietDirective: 'Гастроинтестинальная диета (Gastrointestinal). Дробное кормление 4 раза в сутки порциями по 90–100 г на 14 дней.',
        sorbentDirective: 'Энтеросгель ветеринарный: 15 г пасты развести в 30 мл теплой воды, выпаивать 3 раза в сутки в течение 3 дней.',
        hydrationDirective: 'Постоянный доступ к свежей фильтрованной воде комнатной температуры.',
      },
      payment: {
        orderRef: `#${selectedProtocolVisit.fiscalReceipt.fiscalNumber.replace('ФН #', 'ВЕТ-ОПЛ-')}`,
        totalRubles: selectedProtocolVisit.fiscalReceipt.totalRubles,
        baseExamRubles: 2800,
        rapidTestRubles: Math.max(0, selectedProtocolVisit.fiscalReceipt.totalRubles - 2800),
        cardMasked: 'МИР •••• 4412 (Сбербанк)',
        fiscalReceiptNumber: selectedProtocolVisit.fiscalReceipt.fiscalNumber,
      },
    };

    return (
      <ClinicalProtocolScreen
        onBack={() => setIsProtocolScreenOpen(false)}
        data={protocolPayload}
      />
    );
  }

  return (
    <div className="min-h-full pb-24 text-slate-900 bg-slate-50/50">
      {/* ========================================================= */}
      {/* 1. STICKY TOP BAR & REGULATORY BADGE                      */}
      {/* ========================================================= */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-slate-900 leading-tight truncate">
                СПб ВетСлужба 24/7
              </h1>
              <div className="flex items-center space-x-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="text-[10px] font-bold text-emerald-800 truncate">
                  ФГИС «ВетИС» Хорриот • #78-VET
                </span>
              </div>
            </div>
          </div>

          {/* User Avatar */}
          <button
            type="button"
            onClick={onProfileClick}
            aria-label="Профиль пользователя"
            className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs hover:ring-2 hover:ring-blue-400 transition-all"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'Аватар'}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <span>{userInitials}</span>
            )}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================= */}
        {/* 2. MAIN SCREEN TITLE & 3-TAB FILTER PILLS                 */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Записи и вызовы ветпомощи
            </h2>
            {onBookNewAppointment && (
              <button
                type="button"
                onClick={onBookNewAppointment}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-0.5"
              >
                <span>+ Новый вызов</span>
              </button>
            )}
          </div>

          {/* 3 Dedicated Filter Pills */}
          <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1">
            {/* Tab 1: Active and Planned */}
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'active'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="truncate">Активные</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === 'active'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {Math.max(1, activeOrders.length)}
              </span>
            </button>

            {/* Tab 2: Completed Historical Visits */}
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="truncate">Завершенные</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === 'completed'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {COMPLETED_VISITS.length}
              </span>
            </button>

            {/* Tab 3: Cancelled Visits */}
            <button
              type="button"
              onClick={() => setActiveTab('cancelled')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                activeTab === 'cancelled'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="truncate">Отмененные</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === 'cancelled'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-300 text-slate-700'
                }`}
              >
                {CANCELLED_VISITS.length}
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. TAB 1: ACTIVE TAB & DYNAMIC TIME-WINDOW TRANSITION     */}
        {/* ========================================================= */}
        {activeTab === 'active' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Quick Interactive Lifecycle Simulation Switcher */}
            <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-slate-500">
                Симуляция времени:
              </span>
              <div className="flex bg-slate-100 p-0.5 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setSimulationState('before_deadline')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                    simulationState === 'before_deadline'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  До дедлайна (&gt;2 ч)
                </button>
                <button
                  type="button"
                  onClick={() => setSimulationState('crew_arrived')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                    simulationState === 'crew_arrived'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Экипаж прибыл ✓
                </button>
              </div>
            </div>

            {/* HERO ACTIVE BOOKING CARD */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
              {/* Header Status & Escrow Badges */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                {/* Dynamic Status Pill */}
                {simulationState === 'before_deadline' ? (
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>ЗАПЛАНИРОВАН • ДО ВИЗИТА 23 Ч</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black tracking-wide shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>ЭКИПАЖ ПРИБЫЛ • У ПАРАДНОЙ</span>
                  </div>
                )}

                {/* YooKassa Escrow Pill */}
                <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
                  <Lock className="w-3 h-3 text-blue-600" />
                  <span>Холдирование 2 800 ₽ • ЮKassa</span>
                </div>
              </div>

              {/* State B: Urgent Arrival Telemetry Banner */}
              {simulationState === 'crew_arrived' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500/50 text-emerald-950 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center space-x-2 font-black text-emerald-900 text-xs">
                    <Car className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ветеринарный экипаж ожидает у парадной</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                    Врач прибыл по адресу: г. СПб, ул. Ленина, д. 28. Звонок в домофон выполнен. Подготовьте питомца и откройте код приема.
                  </p>
                </div>
              )}

              {/* Primary Scheduled Timestamp */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center space-x-2 text-slate-900 font-extrabold text-sm sm:text-base">
                  <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    {scheduledOrder?.scheduledDateText ?? 'Вторник, 12 октября 2026'}
                  </span>
                  <span>•</span>
                  <span className="text-blue-700">
                    {scheduledOrder?.timeWindow?.startTime ?? '14:00'} -{' '}
                    {scheduledOrder?.timeWindow?.endTime ?? '15:30'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium pl-6">
                  Интервал приезда врача на дом • Дорожная обстановка Петроградского р-на
                </div>
              </div>

              {/* PATIENT & CLINICAL CONTEXT BLOCK */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Пациент и клинический профиль</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateToPassport?.(selectedOrder?.pet.id)}
                    className="text-[10px] font-bold text-blue-600 hover:underline flex items-center space-x-0.5"
                  >
                    <span>Ветпаспорт #{selectedOrder?.pet.passportSeriesNumber ?? 'ВЕТ-491'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Patient Summary Card */}
                <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        Собака {selectedOrder?.pet.name ?? 'Норд'}
                      </div>
                      <div className="text-xs text-slate-600 font-medium">
                        {selectedOrder?.pet.breed ?? 'Сибирский хаски'} • 3 года • Самец (кастрирован)
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-500 block">Точный вес</span>
                      <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                        {selectedOrder?.pet.weightKg ?? 26.4} кг
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-600 pt-1 border-t border-blue-100/70">
                    <span>Чип ISO: #{selectedOrder?.pet.microchipNumber ?? '643094100234567'}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">Верифицирован в ВетИС</span>
                  </div>
                </div>

                {/* Clinical Reason & Behavior */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="text-[11px] font-bold text-slate-900 flex items-center space-x-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Цель визита и клинический протокол:</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed pl-5">
                      {selectedOrder?.anamnesis.clinicalPurpose ??
                        'Плановый осмотр, термометрия, чипирование и комплексная вакцинация Nobivac DHPPi + RL (включая бешенство).'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1 text-amber-950">
                    <div className="text-[11px] font-bold text-amber-900 flex items-center space-x-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Поведение и безопасность (Закон РФ № 4979-1):</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-900/90 pl-5">
                      Поведение: Дружелюбен и активен. Владелец надевает мягкий намордник перед термометрией согласно правилам ветпомощи.
                    </p>
                  </div>
                </div>
              </div>

              {/* ASSIGNED VETERINARIAN & EQUIPMENT PROFILE */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    Назначенный ветеринарный врач
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    УКЭП врача активна
                  </span>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                    {selectedOrder?.doctor.name ? selectedOrder.doctor.name.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'РД'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold text-slate-900">
                      {selectedOrder?.doctor.name ?? 'Д-р Романов Д. С.'}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {selectedOrder?.doctor.specialization ?? 'Ветврач-терапевт, хирург'}
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-[11px]">
                      <span className="font-bold text-amber-500 flex items-center space-x-0.5">
                        <span>★</span>
                        <span>{selectedOrder?.doctor.rating ?? 4.98}</span>
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-medium">
                        {selectedOrder?.doctor.callsCount ?? 320}+ выездов
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-blue-700 font-bold">
                        {selectedOrder?.doctor.licenseNumber ?? 'ФГИС «ВетИС» (Хорриот) #78-VET'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Clinic Specs */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-800">
                    <Car className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>Служебный авто: Renault Duster #В741АА198 (Вет-экипаж СПб)</span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-relaxed pl-6 space-y-1">
                    <div className="font-medium text-slate-800">
                      Оснащение мобильной вет-клиники:
                    </div>
                    <p className="text-[10px] text-slate-500">
                      • Сканер микрочипов ISO 11784/11785
                      <br />• Люминесцентная диагностическая лампа Вуда
                      <br />• Сертифицированный термоконтейнер для биопрепаратов (+2..+8°C)
                      <br />• Экспресс-тесты на инфекции (Parvo/Distemper)
                    </p>
                  </div>
                </div>
              </div>

              {/* DESTINATION ADDRESS & LIVE TELEMETRY ALERT */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                  Адрес прибытия и логистика
                </span>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">
                        {selectedOrder?.address.fullAddressText ??
                          'г. Санкт-Петербург, ул. Ленина, д. 28, подъезд 2, этаж 4, кв. 42'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Домофон: 42# • Въезд под шлагбаум через диспетчера охраны.
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    Примечание: Кот изолирован на кухне, собака ожидает в смотровой комнате.
                  </div>
                </div>

                {/* Live GPS Telemetry Alert */}
                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 space-y-1.5 text-xs">
                  <div className="flex items-center space-x-2 font-bold text-blue-900">
                    <Radio className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
                    <span className="text-xs">Телеметрия выезда экипажа</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-blue-900/90">
                    Ветврач начинает движение в ~13:40. В приложении активируется онлайн-трекинг экипажа по карте Санкт-Петербурга с динамическим расчетным временем прибытия (ETA).
                  </p>
                </div>
              </div>

              {/* DYNAMIC ACTION DIRECTIVES ACCORDING TO TIMING STATE */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                {simulationState === 'before_deadline' ? (
                  <>
                    {/* State A: Primary Guide Button */}
                    <button
                      type="button"
                      onClick={() => setIsRestraintModalOpen(true)}
                      className="w-full py-3.5 px-4 bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold rounded-2xl shadow-md flex items-center justify-center space-x-2 text-xs sm:text-sm transition-all active:scale-[0.99]"
                    >
                      <span>Инструкция по фиксации и подготовке питомца</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* State A: Secondary Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setIsRescheduleModalOpen(true)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all text-center"
                      >
                        Перенести время слота
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCancelModalOpen(true)}
                        className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all text-center"
                      >
                        Отменить выезд (до 12:00)
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* State B: Prominent Arrival Verification & Handshake PIN Button */}
                    <button
                      type="button"
                      onClick={handleOpenHandshake}
                      className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 text-sm sm:text-base transition-all active:scale-[0.99] animate-pulse"
                    >
                      <Key className="w-5 h-5 shrink-0" />
                      <span>Экипаж у парадной • Открыть код приема →</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center leading-tight">
                      Отмена и перенос заблокированы: экипаж прибыл по адресу. Назовите 4-значный код врачу при входе.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* EMERGENCY SERVICE SHORTCUT CARD */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-300/80 space-y-3">
              <div className="flex items-center space-x-2 text-amber-900">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                <span className="text-xs font-black uppercase tracking-wider">
                  24/7 Неотложная ветпомощь
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="text-xs font-extrabold text-slate-900">
                    Экстренная реанимационная вет-бригада
                  </div>
                  <p className="text-[11px] text-amber-950/80 leading-relaxed">
                    Если питомцу стало хуже до планового времени — вызовите дежурную бригаду. Прибытие за ~15–20 минут.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRequestEmergency}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
              >
                <span>Вызвать неотложку сейчас (~15-20 мин)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* FINANCIAL ESCROW SECURITY GUARANTEE CARD */}
            <div className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-900 font-extrabold">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Гарантия безопасного холдирования (ЮKassa Эскроу)</span>
              </div>
              <p className="text-[11px] text-emerald-950/90 leading-relaxed">
                Сумма 2 800 ₽ заморожена на вашей карте через ЮKassa. Списание произойдет исключительно после очного визита врача, считывания микрочипа и подписания протокола в приложении. Бесплатная отмена или перенос доступны до 12:00 дня визита.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. TAB 2: HISTORICAL COMPLETED VISITS (SCREEN 3c32b087)   */}
        {/* ========================================================= */}
        {activeTab === 'completed' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-xs font-bold text-slate-500 px-1 flex items-center justify-between">
              <span>Архив медицинских записей и протоколов ВетИС</span>
              <span className="text-[10px] text-emerald-700 font-extrabold">
                4 завершенных визита
              </span>
            </div>

            {COMPLETED_VISITS.map((visit) => (
              <div
                key={visit.id}
                onClick={() => {
                  setSelectedProtocolVisit(visit);
                  setIsProtocolScreenOpen(true);
                }}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 hover:border-blue-500/80 hover:shadow-md transition-all space-y-3.5 cursor-pointer active:scale-[0.99] group"
              >
                {/* Header: Date, Time & Fiscal Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider block">
                      {visit.completedDateText} • {visit.completedTimeText}
                    </span>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                        {visit.title}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900">
                      {visit.fiscalReceipt.totalRubles.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 block mt-0.5">
                      Оплачено (54-ФЗ)
                    </span>
                  </div>
                </div>

                {/* Attending Doctor Profile */}
                <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {visit.doctor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-slate-900 truncate">
                      {visit.doctor.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium truncate">
                      {visit.doctor.specialty} • {visit.doctor.almaMater}
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] font-semibold text-emerald-700">
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                      <span>{visit.doctor.vetIsLicense}</span>
                      <span>•</span>
                      <span>УКЭП подтверждена</span>
                    </div>
                  </div>
                </div>

                {/* Patient Summary */}
                <div className="text-[11px] text-slate-600 px-1 flex items-center justify-between flex-wrap gap-1">
                  <span className="font-bold text-slate-800">
                    Пациент: {visit.patient.name} ({visit.patient.speciesBreed})
                  </span>
                  <span className="font-mono text-slate-500">
                    Вес: {visit.patient.verifiedWeightKg} кг • Чип: #{visit.patient.chipNumber}
                  </span>
                </div>

                {/* Executed Procedures & Anamnesis */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5 text-xs">
                  <div className="text-[11px] font-bold text-slate-900 flex items-center space-x-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Выполненные манипуляции:</span>
                  </div>
                  <ul className="text-[11px] text-slate-700 space-y-1 pl-5 list-disc">
                    {visit.anamnesisAndProcedures.procedures.map((proc, pIdx) => (
                      <li key={pIdx} className="leading-relaxed">
                        {proc}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-600 leading-relaxed italic">
                    Заключение врача: {visit.anamnesisAndProcedures.clinicalNotes}
                  </div>
                </div>

                {/* Footer Protocols & Receipt Links */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] flex-wrap gap-2">
                  <div className="flex items-center space-x-1.5 text-slate-500 font-mono text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Протокол: #{visit.vetIsProtocolNumber}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`Электронный чек ${visit.fiscalReceipt.fiscalNumber} (54-ФЗ) скачан`);
                      }}
                      className="text-slate-600 hover:text-slate-900 font-semibold flex items-center space-x-1 text-[11px]"
                    >
                      <Receipt className="w-3.5 h-3.5 text-slate-500" />
                      <span>Чек (54-ФЗ)</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProtocolVisit(visit);
                        setIsProtocolScreenOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1 text-[11px] group-hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ветпротокол →</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. TAB 3: CANCELLED VISITS VIEW                           */}
        {/* ========================================================= */}
        {activeTab === 'cancelled' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="text-xs font-bold text-slate-500 px-1 flex items-center justify-between">
              <span>Журнал отмененных вызовов и статус эскроу</span>
              <span className="text-[10px] text-slate-400 font-semibold">
                Без финансовых удержаний
              </span>
            </div>

            {CANCELLED_VISITS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3.5"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      {item.scheduledDateText} • {item.scheduledTimeRange}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug mt-0.5">
                      Плановый выезд ветврача на дом
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 block">
                      ОТМЕНЕН (0 ₽)
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1.5 text-xs text-rose-950">
                  <div className="font-bold flex items-center space-x-1.5 text-rose-900 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Причина и время отмены:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-900/90 pl-5">
                    {item.cancellationReason}
                  </p>
                  <div className="text-[10px] text-rose-700 pl-5 font-medium">
                    Зафиксировано в системе: {item.cancelledAtText}
                  </div>
                </div>

                {/* Escrow Release Card */}
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1 text-xs">
                  <div className="font-extrabold text-emerald-900 flex items-center space-x-1.5 text-[11px]">
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Финансовый статус ЮKassa: Холдирование снято</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-900/90 pl-5">
                    {item.escrowStatus.refundStatusText}. Сумма {item.escrowStatus.originalHoldRubles.toLocaleString('ru-RU')} ₽ разблокирована на балансе без комиссий и штрафов согласно регламенту 12:00.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>Врач: {item.doctorName} ({item.doctorSpecialty})</span>
                  <span>Пациент: {item.petName} ({item.petBreed})</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. FOOTER DISPATCH HOTLINE                                */}
        {/* ========================================================= */}
        <div className="pt-2 text-center space-y-1">
          <a
            href="tel:+78124201503"
            className="inline-flex items-center space-x-1.5 text-xs font-black text-slate-700 hover:text-blue-600 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>Круглосуточный диспетчерский пульт СПб: 8 (812) 420-15-03</span>
          </a>
          <p className="text-[10px] text-slate-400">
            Федеральный закон № 4979-1 «О ветеринарии» • 152-ФЗ «О персональных данных»
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: RESTRAINT & BIOSECURITY INSTRUCTION GUIDE        */}
      {/* ========================================================= */}
      {isRestraintModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fadeIn"
          onClick={() => setIsRestraintModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-200 animate-slideUp max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Памятка владельцу питомца
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">
                    Закон РФ № 4979-1
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRestraintModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 space-y-1">
                <div className="font-bold text-blue-900">1. Подготовка животного к осмотру</div>
                <p className="text-[11px] text-blue-800">
                  За 15 минут до прибытия врача наденьте на собаку ошейник и поводок. Не кормите за 2 часа до термометрии и вакцинации.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 space-y-1">
                <div className="font-bold text-amber-900">2. Мягкий намордник и фиксация</div>
                <p className="text-[11px] text-amber-800">
                  Перед проведением термометрии и инъекций владелец обязан надеть мягкий намордник и зафиксировать питомца сбоку.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="font-bold text-slate-900">3. Изоляция других животных</div>
                <p className="text-[11px] text-slate-600">
                  Кошки и другие питомцы должны быть изолированы в отдельном помещении во избежание стресса и агрессии.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1">
                <div className="font-bold text-emerald-900">4. Ветеринарный паспорт</div>
                <p className="text-[11px] text-emerald-800">
                  Подготовьте бумажный паспорт (при наличии) для сверки с электронной записью в системе «Хорриот».
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsRestraintModalOpen(false)}
              className="w-full py-3 bg-[#0D6EFD] hover:bg-[#0B5ED7] text-white font-bold rounded-xl text-xs transition-all shadow-md"
            >
              Понятно, питомец будет готов
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: RESCHEDULE TIME SLOT                             */}
      {/* ========================================================= */}
      {isRescheduleModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fadeIn"
          onClick={() => setIsRescheduleModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-200 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                Перенос времени визита
              </h3>
              <button
                type="button"
                onClick={() => setIsRescheduleModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Вы можете перенести визит на другое время без комиссии до 12:00 завтрашнего дня.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsRescheduleModalOpen(false);
                  showToast('Запрос на перенос на 16:00 - 17:30 отправлен диспетчеру.');
                }}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-600 text-left text-xs font-bold text-slate-800 transition-all"
              >
                Перенести на 16:00 - 17:30 (12 октября)
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRescheduleModalOpen(false);
                  showToast('Запрос на перенос на следующий день (13 октября) отправлен диспетчеру.');
                }}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-600 text-left text-xs font-bold text-slate-800 transition-all"
              >
                Перенести на следующий день (13 октября)
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsRescheduleModalOpen(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CANCEL VISIT CONFIRMATION                        */}
      {/* ========================================================= */}
      {isCancelModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fadeIn"
          onClick={() => setIsCancelModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-200 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Отменить запланированный выезд?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Бесплатная отмена действует до 12:00 завтрашнего дня. Холдирование суммы 2 800 ₽ будет мгновенно снято.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span>Сумма к разморозке:</span>
                <span className="font-bold text-slate-900">2 800 ₽</span>
              </div>
              <div className="flex justify-between">
                <span>Комиссия за отмену:</span>
                <span className="font-bold text-emerald-600">0 ₽</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCancelVisit}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-md"
              >
                Подтвердить отмену вызова
              </button>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
              >
                Вернуться назад
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TOAST NOTIFICATION                                        */}
      {/* ========================================================= */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center pointer-events-none animate-slideUp">
          <div className="bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-xl border border-slate-700 max-w-sm text-center">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};
