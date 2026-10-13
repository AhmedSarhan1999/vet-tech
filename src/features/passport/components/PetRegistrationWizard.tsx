import React, { useState, useEffect, useMemo } from 'react';
import { SpeciesCategory } from '../../../shared/types/species';
import { BreedDefinition } from '../../../shared/types/breeds';
import { BiologicalSex, SpbDistrict } from '../../../shared/types/veterinary';
import { DigitalVetPassport } from '../../../shared/types/vet-passport';
import { SpeciesRepository, PetPassportRepository } from '../../../dal';
import { vetIsVerificationService } from '../../../domain/services/vetis-verification.service';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  Dog,
  Cat,
  Rat,
  Rabbit,
  PawPrint,
  AlertTriangle,
} from 'lucide-react';

const ALL_SPB_DISTRICTS: readonly SpbDistrict[] = [
  'Центральный',
  'Петроградский',
  'Василеостровский',
  'Адмиралтейский',
  'Приморский',
  'Выборгский',
  'Калининский',
  'Красногвардейский',
  'Московский',
  'Кировский',
  'Фрунзенский',
  'Невский',
  'Красносельский',
  'Курортный',
  'Кронштадтский',
  'Петродворцовый',
  'Пушкинский',
  'Колпинский',
];

interface PetRegistrationWizardProps {
  readonly speciesRepo: SpeciesRepository;
  readonly passportRepo: PetPassportRepository;
  readonly currentUserId: string;
  readonly currentUserFullName: string;
  readonly currentUserPhone: string;
  readonly onComplete: (newPassport: DigitalVetPassport) => void;
  readonly onCancel: () => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

const SPECIES_OPTIONS: { category: SpeciesCategory; nameRu: string; description: string }[] = [
  { category: 'canine', nameRu: 'Собака (Canis lupus familiaris)', description: 'Стандарты РКФ / FCI' },
  { category: 'feline', nameRu: 'Кошка (Felis catus)', description: 'Стандарты WCF / FIFe' },
  { category: 'rodent', nameRu: 'Грызун (Rodentia)', description: 'Хомяки, дегу, шиншиллы, крысы' },
  { category: 'lagomorph', nameRu: 'Кролик (Lagomorpha)', description: 'Декоративные и карликовые' },
  { category: 'ferret', nameRu: 'Хорек (Mustela putorius furo)', description: 'Фретки' },
  { category: 'avian', nameRu: 'Птица (Aves)', description: 'Попугаи, певчие птицы' },
  { category: 'reptilian', nameRu: 'Рептилия (Reptilia)', description: 'Ящерицы, змеи, черепахи' },
  { category: 'exotic', nameRu: 'Экзотическое животное', description: 'Ежи, сахарные поссумы и др.' },
];

export const PetRegistrationWizard: React.FC<PetRegistrationWizardProps> = ({
  speciesRepo,
  passportRepo,
  currentUserId,
  currentUserFullName,
  currentUserPhone,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<WizardStep>(1);

  // Form states
  const [speciesCategory, setSpeciesCategory] = useState<SpeciesCategory>('canine');
  const [breedSearch, setBreedSearch] = useState<string>('');
  const [availableBreeds, setAvailableBreeds] = useState<readonly BreedDefinition[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<BreedDefinition | null>(null);
  const [isCustomBreed, setIsCustomBreed] = useState<boolean>(false);
  const [customBreedName, setCustomBreedName] = useState<string>('');

  // Physical parameters
  const [petName, setPetName] = useState<string>('');
  const [sex, setSex] = useState<BiologicalSex>('MALE_INTACT');
  const [isSterilized, setIsSterilized] = useState<boolean>(false);
  const [weightKg, setWeightKg] = useState<string>('');
  const [colorAndMarkings, setColorAndMarkings] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>(
    new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString().split('T')[0] ?? ''
  );

  // VetIS & Identification
  const [chipNumber, setChipNumber] = useState<string>('643098100' + Math.floor(100000 + Math.random() * 900000));
  const [horriotId, setHorriotId] = useState<string>('RU78-' + Math.floor(1000000 + Math.random() * 9000000) + '-0001');
  const [tattooNumber, setTattooNumber] = useState<string>('');
  const [district, setDistrict] = useState<string>('Петроградский');
  const [streetAddress, setStreetAddress] = useState<string>('Каменноостровский проспект, 10, кв. 15');

  // Rabies record
  const [hasRabiesVaccine, setHasRabiesVaccine] = useState<boolean>(true);
  const [rabiesVaccineName, setRabiesVaccineName] = useState<string>('Nobivac Rabies');
  const [rabiesSeries, setRabiesSeries] = useState<string>('NR-24-88');
  const [rabiesDate, setRabiesDate] = useState<string>(
    new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString().split('T')[0] ?? ''
  );

  // Loading & error states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load breeds when species changes
  useEffect(() => {
    async function loadBreeds() {
      const res = await speciesRepo.getBreedsBySpecies(speciesCategory);
      if (res.success) {
        setAvailableBreeds(res.data);
        const defaultBreed = res.data[0];
        if (defaultBreed) {
          setSelectedBreed(defaultBreed);
        } else {
          setSelectedBreed(null);
        }
      }
    }
    loadBreeds();
  }, [speciesCategory, speciesRepo]);

  // Filter breeds by search
  const filteredBreeds = useMemo(() => {
    if (!breedSearch.trim()) return availableBreeds;
    const q = breedSearch.toLowerCase().trim();
    return availableBreeds.filter(
      (b) =>
        b.russianName.toLowerCase().includes(q) ||
        b.internationalName.toLowerCase().includes(q) ||
        (b.registryCode && b.registryCode.toLowerCase().includes(q))
    );
  }, [availableBreeds, breedSearch]);

  // Validation checks
  const microchipValidation = useMemo(() => {
    if (!chipNumber) return null;
    return vetIsVerificationService.verifyMicrochip(chipNumber);
  }, [chipNumber]);

  const horriotValidation = useMemo(() => {
    if (!horriotId) return null;
    return vetIsVerificationService.verifyHorriotId(horriotId);
  }, [horriotId]);

  // Step 1: Species selection
  const handleSpeciesSelect = (cat: SpeciesCategory) => {
    setSpeciesCategory(cat);
  };

  // Step 2 validation
  const canProceedFromStep2 = Boolean(
    (selectedBreed && !isCustomBreed) || (isCustomBreed && customBreedName.trim().length > 1)
  );

  // Step 3 validation
  const parsedWeight = parseFloat(weightKg);
  const isWeightValid = !isNaN(parsedWeight) && parsedWeight > 0.05 && parsedWeight < 250;
  const canProceedFromStep3 = petName.trim().length > 0 && isWeightValid && birthDate.length > 0;

  // Step 4 validation
  const canProceedFromStep4 = Boolean(
    microchipValidation?.isValid && horriotValidation?.isValid && district && streetAddress.trim().length > 3
  );

  const handleSubmit = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const effectiveBreedName = isCustomBreed
        ? customBreedName.trim()
        : (selectedBreed?.russianName ?? 'Метис');
      const effectiveBreedId = isCustomBreed
        ? `br-custom-${Date.now()}`
        : (selectedBreed?.id ?? 'br-custom-unknown');

      const uniquePassportId = `pass-spb-78-${Date.now().toString().slice(-4)}`;
      const passportSeries = `78-ВЕТ-2026/${Math.floor(1000 + Math.random() * 9000)}`;

      const rabiesRecords = hasRabiesVaccine
        ? [
            {
              id: `vac-rab-${Date.now()}`,
              vaccineName: rabiesVaccineName,
              seriesNumber: rabiesSeries,
              administeredDateIso: new Date(rabiesDate).toISOString(),
              expirationDateIso: new Date(
                new Date(rabiesDate).getTime() + 365 * 24 * 3600 * 1000
              ).toISOString(),
              veterinarianFullName: 'Городская ветслужба СПб',
              veterinaryClinicLicense: '78-ВЕТ-ЛИЦ-00100',
              vetIsMercuryVsdUuid: `78mercury-${Math.random().toString(36).substring(2, 10)}`,
              isRabiesVaccine: true,
            },
          ]
        : [];

      const newPassport: DigitalVetPassport = {
        id: uniquePassportId,
        passportSeriesNumber: passportSeries,
        horriotId: horriotId.trim(),
        petName: petName.trim(),
        speciesCategory,
        breedId: effectiveBreedId,
        breedNameRu: effectiveBreedName,
        sex,
        birthDateIso: new Date(birthDate).toISOString(),
        weightKg: parsedWeight,
        colorAndMarkingsRu: colorAndMarkings.trim() || 'Особые приметы отсутствуют',
        isSterilized,
        microchip: {
          chipNumber: chipNumber.trim(),
          manufacturerOrCountryCode: microchipValidation?.countryCode ?? '643',
          implantationDateIso: new Date().toISOString(),
          anatomicalLocation: 'Холка / Левая сторона шеи',
          isVerified: true,
        },
        tattooRkfNumber: tattooNumber.trim() || undefined,
        latestVitals: {
          bodyWeightKg: parsedWeight,
          recordedAtIso: new Date().toISOString(),
        },
        ownerId: currentUserId || 'usr-spb-01',
        ownerFullName: currentUserFullName || 'Владелец питомца',
        ownerPhone: currentUserPhone || '+7 (921) 000-00-00',
        residentialAddress: {
          city: 'Санкт-Петербург',
          district,
          streetAddress: streetAddress.trim(),
        },
        status: 'ACTIVE',
        rabiesVaccinations: rabiesRecords,
        comprehensiveVaccinations: [],
        antiParasiteTreatments: [],
        quarantine: {
          isQuarantined: false,
        },
        issuedAtIso: new Date().toISOString(),
        issuingClinicName: 'СПб ГБУ «Городская ветеринарная станция»',
        issuingClinicVetIsId: 'RU78-CLINIC-0001',
        updatedAtIso: new Date().toISOString(),
      };

      const res = await passportRepo.create(newPassport);
      if (!res.success) {
        throw res.error;
      }

      onComplete(newPassport);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Ошибка при сохранении ветеринарного паспорта';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 animate-fadeIn">
      {/* Wizard Header & Progress */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <span className="text-[10px] font-black tracking-wider text-blue-700 uppercase bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            МАСТЕР РЕГИСТРАЦИИ • ШАГ {step} ИЗ 5
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-2">
            Новый электронный ветпаспорт
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Отмена
        </button>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-5 gap-1.5 mb-5">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              s <= step ? 'bg-blue-600' : 'bg-slate-100'
            }`}
          />
        ))}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Species Selection */}
      {step === 1 && (
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            1. Выберите биологический вид животного
          </h4>
          <p className="text-[11px] text-slate-500 mb-3">
            В соответствии со ст. 2.1 Закона РФ № 4979-1 «О ветеринарии»
          </p>

          <div className="grid grid-cols-1 gap-2">
            {SPECIES_OPTIONS.map((item) => {
              const isSelected = speciesCategory === item.category;
              return (
                <button
                  key={item.category}
                  type="button"
                  onClick={() => handleSpeciesSelect(item.category)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-100' : 'bg-slate-100'
                    }`}>
                      {item.category === 'canine' ? (
                        <Dog className="w-5 h-5 text-blue-600" />
                      ) : item.category === 'feline' ? (
                        <Cat className="w-5 h-5 text-amber-600" />
                      ) : item.category === 'rodent' ? (
                        <Rat className="w-5 h-5 text-slate-600" />
                      ) : item.category === 'lagomorph' ? (
                        <Rabbit className="w-5 h-5 text-pink-600" />
                      ) : (
                        <PawPrint className="w-5 h-5 text-teal-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{item.nameRu}</span>
                      <span className="text-[10px] text-slate-400">{item.description}</span>
                    </div>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Universal Step 1 Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <span>Далее →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Breed Selection */}
      {step === 2 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Порода по стандартам РКФ / WCF
            </h4>
            <button
              type="button"
              onClick={() => {
                setIsCustomBreed(!isCustomBreed);
                if (!isCustomBreed) setSelectedBreed(null);
              }}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              {isCustomBreed ? 'Выбрать из каталога' : 'Метис / Другая порода'}
            </button>
          </div>

          {!isCustomBreed ? (
            <>
              <input
                type="text"
                placeholder="Поиск породы по названию..."
                value={breedSearch}
                onChange={(e) => setBreedSearch(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-3"
              />

              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {filteredBreeds.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                    Порода не найдена в реестре. Нажмите «Метис / Другая порода».
                  </div>
                ) : (
                  filteredBreeds.map((breed) => (
                    <button
                      key={breed.id}
                      type="button"
                      onClick={() => setSelectedBreed(breed)}
                      className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        selectedBreed?.id === breed.id
                          ? 'border-blue-600 bg-blue-50/70 font-bold text-slate-900 ring-1 ring-blue-500'
                          : 'border-slate-100 hover:border-slate-200 text-slate-700 bg-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{breed.russianName}</div>
                        <div className="text-[10px] text-slate-400">
                          {breed.internationalName} • {breed.registryAuthority}
                        </div>
                      </div>
                      {selectedBreed?.id === breed.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Укажите породу или метисность:
              </label>
              <input
                type="text"
                placeholder="Например: Метис хаски и овчарки"
                value={customBreedName}
                onChange={(e) => setCustomBreedName(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                В ветпаспорте будет зафиксировано описание беспородного или смешанного фенотипа.
              </p>
            </div>
          )}

          <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-3.5 px-5 border border-slate-200 hover:bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-98 shrink-0"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Назад</span>
            </button>
            <button
              type="button"
              disabled={!canProceedFromStep2}
              onClick={() => setStep(3)}
              className="flex-1 py-3.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <span>Далее →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Vitals & Details */}
      {step === 3 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Кличка, пол и масса тела
          </h4>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Кличка животного *</label>
            <input
              type="text"
              placeholder="Кличка (например: Норд, Майло, Луна)"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Пол животного *</label>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as BiologicalSex)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="MALE_INTACT">Кобель / Самец (интактный)</option>
                <option value="MALE_CASTRATED">Кобель / Самец (кастрирован)</option>
                <option value="FEMALE_INTACT">Сука / Самка (интактная)</option>
                <option value="FEMALE_STERILIZED">Сука / Самка (стерилизована)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Точный вес (кг) *</label>
              <input
                type="number"
                step="0.1"
                placeholder="Например: 12.5"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Дата рождения *</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex items-center space-x-2 pt-5">
              <input
                type="checkbox"
                id="steril"
                checked={isSterilized}
                onChange={(e) => setIsSterilized(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="steril" className="text-xs font-medium text-slate-700">
                Стерилизован / Кастрирован
              </label>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Окрас и особые приметы</label>
            <input
              type="text"
              placeholder="Например: Чепрачный с белой отметиной на груди"
              value={colorAndMarkings}
              onChange={(e) => setColorAndMarkings(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-3.5 px-5 border border-slate-200 hover:bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-98 shrink-0"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Назад</span>
            </button>
            <button
              type="button"
              disabled={!canProceedFromStep3}
              onClick={() => setStep(4)}
              className="flex-1 py-3.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <span>Далее →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: VetIS Horriot & Microchip */}
      {step === 4 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              4. ФГИС «ВетИС» (Хорриот) & Микрочип
            </h4>
            <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              ISO 11784/11785
            </span>
          </div>

          {/* Microchip */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">Номер микрочипа (15 цифр) *</label>
              {microchipValidation && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    microchipValidation.isValid
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {microchipValidation.isValid
                    ? `✓ ${microchipValidation.countryName}`
                    : microchipValidation.error}
                </span>
              )}
            </div>
            <input
              type="text"
              maxLength={15}
              placeholder="643098100123456"
              value={chipNumber}
              onChange={(e) => setChipNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Horriot ID */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">Код ФГИС «Хорриот» *</label>
              {horriotValidation && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    horriotValidation.isValid
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {horriotValidation.isValid
                    ? `✓ ${horriotValidation.regionName}`
                    : horriotValidation.error}
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="RU78-1029384-0012"
              value={horriotId}
              onChange={(e) => setHorriotId(e.target.value.toUpperCase())}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Формат: RU[Код региона]-[7 цифр]-[4 цифры]</p>
          </div>

          {/* Tattoo (Optional) */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Клеймо РКФ / СКОР (опционально)</label>
            <input
              type="text"
              placeholder="SPB-1234"
              value={tattooNumber}
              onChange={(e) => setTattooNumber(e.target.value.toUpperCase())}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* District SPb */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Район Санкт-Петербурга *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {ALL_SPB_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist} район
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Улица, дом, квартира *</label>
              <input
                type="text"
                placeholder="ул. Ленина, д. 5, кв. 12"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="py-3.5 px-5 border border-slate-200 hover:bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-98 shrink-0"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Назад</span>
            </button>
            <button
              type="button"
              disabled={!canProceedFromStep4}
              onClick={() => setStep(5)}
              className="flex-1 py-3.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              <span>Далее →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Rabies Biosecurity & Final Confirmation */}
      {step === 5 && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-amber-900">
                Закон РФ № 4979-1 «О ветеринарии» (ст. 2.1)
              </h5>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                Вакцинация против бешенства обязательна для всех плотоядных животных на территории РФ.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Животное вакцинировано от бешенства?</span>
              <span className="text-[10px] text-slate-500">Срок действия вакцины составляет 12 месяцев</span>
            </div>
            <input
              type="checkbox"
              checked={hasRabiesVaccine}
              onChange={(e) => setHasRabiesVaccine(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </div>

          {hasRabiesVaccine ? (
            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Препарат:</label>
                  <select
                    value={rabiesVaccineName}
                    onChange={(e) => setRabiesVaccineName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Nobivac Rabies">Nobivac Rabies</option>
                    <option value="Рабикан (ФГБУ «ВНИИЗЖ»)">Рабикан (ФГБУ «ВНИИЗЖ»)</option>
                    <option value="Дефенсор-3">Дефенсор-3</option>
                    <option value="Рабизин">Рабизин</option>
                    <option value="Мультикан-8">Мультикан-8</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Серия / Партия:</label>
                  <input
                    type="text"
                    value={rabiesSeries}
                    onChange={(e) => setRabiesSeries(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Дата введения:</label>
                <input
                  type="date"
                  value={rabiesDate}
                  onChange={(e) => setRabiesDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Внимание:</strong> Без действующей отметки о вакцинации от бешенства при вызове врача
                будет применен протокол повышенной биологической безопасности.
              </div>
            </div>
          )}

          {/* Summary Box */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
            <div className="font-bold text-slate-900 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Паспорт готов к регистрации</span>
            </div>
            <div className="text-slate-600 text-[11px]">
              Кличка: <strong>{petName}</strong> • Порода: <strong>{isCustomBreed ? customBreedName : selectedBreed?.russianName}</strong>
            </div>
            <div className="text-slate-600 text-[11px]">
              Масса: <strong>{weightKg} кг</strong> • Чип: <strong className="font-mono">{chipNumber}</strong>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={isSubmitting}
              className="py-3.5 px-5 border border-slate-200 hover:bg-slate-50 rounded-2xl text-sm font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-98 shrink-0 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Назад</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex-1 py-3.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></div>
                  <span>Регистрация в ФГИС...</span>
                </div>
              ) : (
                <span>Зарегистрировать питомца в ВетИС →</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
