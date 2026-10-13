import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Award,
  FileText,
  Car,
  Upload,
  Clock,
  AlertTriangle,
  Stethoscope,
  Building,
} from 'lucide-react';

export interface DoctorOnboardingScreenProps {
  readonly onBack: () => void;
  readonly onCompleted?: () => void;
}

export type AccreditationStatus = 'NOT_SUBMITTED' | 'PENDING_ACCREDITATION' | 'VERIFIED';

export const DoctorOnboardingScreen: React.FC<DoctorOnboardingScreenProps> = ({
  onBack,
  onCompleted,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [status, setStatus] = useState<AccreditationStatus>('NOT_SUBMITTED');

  // Step 1: Personal Credentials & Alma Mater
  const [fullName, setFullName] = useState('Романов Константин Васильевич');
  const [almaMater, setAlmaMater] = useState('СПбГУВМ (Санкт-Петербургская государственная академия ветеринарной медицины)');
  const [graduationYear, setGraduationYear] = useState('2018');
  const [specialization, setSpecialization] = useState('Терапия и хирургия мелких домашних животных');
  const [experienceYears, setExperienceYears] = useState('8');

  // Step 2: Federal Accreditation & FGIS VetIS IDs
  const [rosselkhozLicense, setRosselkhozLicense] = useState('ВЕТ-78-АККР-009412');
  const [vetisHorriotUuid, setVetisHorriotUuid] = useState('78-DOC-HORRIOT-5920-E');
  const [hasUkepSignature, setHasUkepSignature] = useState(true);

  // Step 3: Mobile Service Unit Vehicle Details
  const [carModel, setCarModel] = useState('Volkswagen Caddy Maxi (Специализированная ветпомощь)');
  const [licensePlate, setLicensePlate] = useState('О 812 ВТ 178');
  const [hasMobileMedicalBox, setHasMobileMedicalBox] = useState(true);

  // Step 4: Verification Document Upload Simulation
  const [uploadedDiploma, setUploadedDiploma] = useState(true);
  const [uploadedLicense, setUploadedLicense] = useState(true);
  const [uploadedPassport, setUploadedPassport] = useState(true);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission
      setStatus('PENDING_ACCREDITATION');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  // If application is submitted and in pending status
  if (status === 'PENDING_ACCREDITATION') {
    return (
      <div className="min-h-full pb-24 font-sans bg-slate-50/70 p-4 space-y-4">
        {/* Header */}
        <div className="bg-white border-b border-slate-200/80 -mx-4 -mt-4 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 border border-slate-200/80 shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
            </button>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">Аккредитация врача</h1>
              <p className="text-[10px] font-semibold text-slate-500">ФГИС «ВетИС» • Закон РФ № 4979-1</p>
            </div>
          </div>

          <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            На проверке
          </span>
        </div>

        {/* Status Callout Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-amber-200 space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs border border-amber-200">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
              Статус: PENDING_ACCREDITATION
            </span>
            <h2 className="text-base font-black text-slate-900 pt-2">
              Заявка на дежурство принята
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Заявка находится на верификации квалификационной комиссии СПб. Доступ к вызовам активируется после проверки документов.
            </p>
          </div>

          {/* Safety Notice regarding unverified doctors */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-700 space-y-2">
            <div className="flex items-center space-x-2 text-rose-700 font-bold text-[11px]">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Ограничение доступа к вызовам (Закон № 4979-1):</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              До подтверждения сертификата Россельхознадзора и валидации УКЭП аккаунт не может переключаться в статус «НА ЛИНИИ», не отображается на карте вызовов Санкт-Петербурга и не принимает экстренные назначения.
            </p>
          </div>

          {/* Details summary */}
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 text-left text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Кандидат:</span>
              <span className="font-bold text-slate-900">{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Вуз:</span>
              <span className="font-bold text-slate-900">СПбГУВМ (2018)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Реестр ВетИС:</span>
              <span className="font-bold text-blue-700">{vetisHorriotUuid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Автомобиль экипажа:</span>
              <span className="font-bold text-slate-900">{licensePlate}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={onCompleted || onBack}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              Вернуться в окно авторизации
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Назад"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 border border-slate-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">Аккредитация ветврача</h1>
            <p className="text-[10px] font-semibold text-slate-500">
              Шаг {currentStep} из 4 • СПбГУВМ & Россельхознадзор
            </p>
          </div>
        </div>

        <span className="text-xs font-black font-mono px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
          {Math.round((currentStep / 4) * 100)}%
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Wizard Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step <= currentStep ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Personal Credentials & Alma Mater */}
        {currentStep === 1 && (
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Шаг 1. Образование и специализация
                </h3>
                <p className="text-[10px] text-slate-500">Диплом государственного образца РФ</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  ФИО ветеринарного врача *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Высшее учебное заведение (Alma Mater) *
                </label>
                <input
                  type="text"
                  value={almaMater}
                  onChange={(e) => setAlmaMater(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Год выпуска *</label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono text-center focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Опыт работы (лет) *</label>
                  <input
                    type="text"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono text-center focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Клиническая специализация *
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Терапия и хирургия мелких домашних животных">Терапевт / Хирург общего профиля</option>
                  <option value="Ветеринарная дерматология">Ветеринарный дерматолог</option>
                  <option value="Интенсивная терапия и реанимация">Врач скорой помощи и ОРИТ</option>
                  <option value="Экзотические животные и герпетология">Специалист по экзотическим животным</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Federal Accreditation & FGIS VetIS IDs */}
        {currentStep === 2 && (
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Шаг 2. Государственная аккредитация ВетИС
                </h3>
                <p className="text-[10px] text-slate-500">ФГИС «Меркурий» и «Хорриот» • Россельхознадзор</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Номер лицензии / аккредитации Россельхознадзора *
                </label>
                <input
                  type="text"
                  value={rosselkhozLicense}
                  onChange={(e) => setRosselkhozLicense(e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  UUID врача в компоненте «Хорриот» (ФГИС ВетИС) *
                </label>
                <input
                  type="text"
                  value={vetisHorriotUuid}
                  onChange={(e) => setVetisHorriotUuid(e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Используется для автоматического подписания ВСД и чипирования.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasUkepSignature}
                    onChange={(e) => setHasUkepSignature(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Усиленная квалифицированная электронная подпись (УКЭП) активна
                  </span>
                </label>
                <p className="text-[10px] text-slate-500 pl-6 leading-tight">
                  Необходима для заверения протоколов осмотра и передачи данных вакцинаций против бешенства.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Mobile Service Unit Vehicle Details */}
        {currentStep === 3 && (
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Шаг 3. Транспорт и оборудование экипажа
                </h3>
                <p className="text-[10px] text-slate-500">Мобильный ветеринарный комплекс СПб</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Марка и модель служебного автомобиля *
                </label>
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Государственный регистрационный знак *
                </label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasMobileMedicalBox}
                    onChange={(e) => setHasMobileMedicalBox(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Медицинский бокс соответствует СанПиН и Минсельхоз РФ
                  </span>
                </label>
                <p className="text-[10px] text-slate-500 pl-6 leading-tight">
                  Включает термоконтейнер для биопрепаратов (+2..+8°C), сканер микрочипов ISO 11784/85 и стерильный инструментарий.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Verification Document Upload Simulation */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-4 animate-fadeIn">
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Шаг 4. Загрузка подтверждающих документов
                </h3>
                <p className="text-[10px] text-slate-500">Скан-копии высокого разрешения</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Document 1 */}
              <div className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Диплом СПбГУВМ</span>
                    <span className="text-[10px] text-slate-400">PDF, 3.4 МБ • Загружен</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedDiploma(!uploadedDiploma)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-colors ${
                    uploadedDiploma ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {uploadedDiploma ? 'Проверен' : 'Загрузить'}
                </button>
              </div>

              {/* Document 2 */}
              <div className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Лицензия Россельхознадзора</span>
                    <span className="text-[10px] text-slate-400">PDF, 1.8 МБ • Загружен</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedLicense(!uploadedLicense)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-colors ${
                    uploadedLicense ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {uploadedLicense ? 'Проверен' : 'Загрузить'}
                </button>
              </div>

              {/* Document 3 */}
              <div className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Stethoscope className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Паспорт гражданина РФ (152-ФЗ)</span>
                    <span className="text-[10px] text-slate-400">PNG, 2.1 МБ • Загружен</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedPassport(!uploadedPassport)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-colors ${
                    uploadedPassport ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {uploadedPassport ? 'Проверен' : 'Загрузить'}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-200/80 text-[10px] text-blue-900 leading-tight">
              Перед отправкой подтвердите точность данных. Заведомо ложные сведения влекут административную ответственность по ст. 10.6 КоАП РФ.
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <span>{currentStep === 4 ? 'Отправить заявку на верификацию ВетИС →' : 'Продолжить →'}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
            >
              Вернуться на шаг назад
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
