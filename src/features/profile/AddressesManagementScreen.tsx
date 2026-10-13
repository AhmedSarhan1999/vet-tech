import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  MapPin,
  ShieldCheck,
  Navigation,
  Plus,
  Trash2,
  Pencil,
  Car,
  Building,
  Compass,
  Check,
} from 'lucide-react';
import { SpbDistrict } from '../../shared/types/veterinary';

export interface AddressesManagementScreenProps {
  readonly onBack: () => void;
}

interface AddressRecord {
  readonly id: string;
  readonly title: string;
  readonly isPrimary: boolean;
  readonly regionType: 'SPB_CITY' | 'LEN_OBLAST';
  readonly fullAddress: string;
  readonly district: string;
  readonly coordinates: string;
  readonly entrance: string;
  readonly floor: string;
  readonly aptOffice: string;
  readonly intercom: string;
  readonly barrierGateNote: string;
  readonly biosecurityNote: string;
}

const ALL_DISTRICTS_WITH_SURCHARGE: readonly { district: SpbDistrict | string; surchargeRub: number; isOblast: boolean }[] = [
  { district: 'Петроградский', surchargeRub: 0, isOblast: false },
  { district: 'Центральный', surchargeRub: 0, isOblast: false },
  { district: 'Василеостровский', surchargeRub: 0, isOblast: false },
  { district: 'Адмиралтейский', surchargeRub: 0, isOblast: false },
  { district: 'Приморский', surchargeRub: 0, isOblast: false },
  { district: 'Выборгский', surchargeRub: 0, isOblast: false },
  { district: 'Калининский', surchargeRub: 0, isOblast: false },
  { district: 'Красногвардейский', surchargeRub: 0, isOblast: false },
  { district: 'Московский', surchargeRub: 0, isOblast: false },
  { district: 'Кировский', surchargeRub: 0, isOblast: false },
  { district: 'Фрунзенский', surchargeRub: 0, isOblast: false },
  { district: 'Невский', surchargeRub: 0, isOblast: false },
  { district: 'Красносельский', surchargeRub: 0, isOblast: false },
  { district: 'Курортный', surchargeRub: 500, isOblast: false },
  { district: 'Кронштадтский', surchargeRub: 600, isOblast: false },
  { district: 'Петродворцовый', surchargeRub: 500, isOblast: false },
  { district: 'Пушкинский', surchargeRub: 400, isOblast: false },
  { district: 'Колпинский', surchargeRub: 400, isOblast: false },
  { district: 'Всеволожский (ЛО)', surchargeRub: 700, isOblast: true },
  { district: 'Гатчинский (ЛО)', surchargeRub: 800, isOblast: true },
];

export const AddressesManagementScreen: React.FC<AddressesManagementScreenProps> = ({ onBack }) => {
  const [addresses, setAddresses] = useState<AddressRecord[]>([
    {
      id: 'addr-01',
      title: 'Основная городская квартира',
      isPrimary: true,
      regionType: 'SPB_CITY',
      fullAddress: 'г. Санкт-Петербург, ул. Ленина, д. 28, кв. 42',
      district: 'Петроградский',
      coordinates: '59.9654° N, 30.3012° E',
      entrance: '2',
      floor: '4',
      aptOffice: '42',
      intercom: '42#',
      barrierGateNote: 'Шлагбаум открывается звонком на диспетчерский номер дома. Код калитки 1234.',
      biosecurityNote: 'Кот изолирован в комнате, подготовлен стол, яркое освещение и впитывающая пеленка.',
    },
    {
      id: 'addr-02',
      title: 'Сезонный загородный дом',
      isPrimary: false,
      regionType: 'LEN_OBLAST',
      fullAddress: 'Ленинградская область, Всеволожский р-н, пос. Токсово, ул. Озерная, д. 14',
      district: 'Всеволожский (ЛО)',
      coordinates: '60.1528° N, 30.5311° E',
      entrance: '1',
      floor: '1',
      aptOffice: 'дом',
      intercom: 'звонок у ворот',
      barrierGateNote: 'Автоматические ворота, свободная парковка для скорой ветпомощи перед домом.',
      biosecurityNote: 'Огороженная территория. Сторожевая собака зафиксирована на поводке до захода врача.',
    },
  ]);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newStreet, setNewStreet] = useState('');
  const [newDistrict, setNewDistrict] = useState('Петроградский');
  const [newApt, setNewApt] = useState('');
  const [newEntrance, setNewEntrance] = useState('');
  const [newFloor, setNewFloor] = useState('');
  const [newIntercom, setNewIntercom] = useState('');
  const [hasBarrier, setHasBarrier] = useState(false);
  const [barrierInstruction, setBarrierInstruction] = useState('');
  const [temperament, setTemperament] = useState<'CALM' | 'STRESSED' | 'RESTRAINT_NEEDED'>('CALM');
  const [isLocating, setIsLocating] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const handleMakePrimary = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isPrimary: addr.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    if (addresses.length <= 1) {
      alert('В профиле должен оставаться как минимум один сохраненный адрес вызова ветслужбы.');
      return;
    }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (editingAddressId === id) {
      handleCancelEdit();
    }
  };

  const handleDetectLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setNewStreet('Каменноостровский проспект, 12');
      setNewDistrict('Петроградский');
      setNewApt('18');
      setNewEntrance('1');
      setNewFloor('3');
      setNewIntercom('18B');
    }, 900);
  };

  const handleStartEdit = (addr: AddressRecord) => {
    setEditingAddressId(addr.id);

    let streetPart = addr.fullAddress.replace(/^г\.\s*Санкт-Петербург,\s*/i, '');
    streetPart = streetPart.replace(/^Ленинградская область,\s*[^,]+,\s*/i, '');
    if (addr.aptOffice && addr.aptOffice !== '—' && addr.aptOffice !== 'дом') {
      streetPart = streetPart.replace(new RegExp(`,\\s*кв\\.\\s*${addr.aptOffice}$`, 'i'), '');
    }
    setNewStreet(streetPart.trim() || addr.fullAddress);
    setNewDistrict(addr.district);
    setNewApt(addr.aptOffice === '—' || addr.aptOffice === 'дом' ? '' : addr.aptOffice);
    setNewEntrance(addr.entrance);
    setNewFloor(addr.floor);
    setNewIntercom(addr.intercom === '—' ? '' : addr.intercom);

    const isBarrierActive = addr.barrierGateNote !== 'Свободный въезд';
    setHasBarrier(isBarrierActive);
    setBarrierInstruction(isBarrierActive ? addr.barrierGateNote : '');

    if (addr.biosecurityNote.includes('фиксация') || addr.biosecurityNote.includes('поводке')) {
      setTemperament('RESTRAINT_NEEDED');
    } else if (addr.biosecurityNote.includes('стресс') || addr.biosecurityNote.includes('изолирован')) {
      setTemperament('STRESSED');
    } else {
      setTemperament('CALM');
    }

    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setIsFormOpen(false);
    setNewStreet('');
    setNewDistrict('Петроградский');
    setNewApt('');
    setNewEntrance('');
    setNewFloor('');
    setNewIntercom('');
    setHasBarrier(false);
    setBarrierInstruction('');
    setTemperament('CALM');
  };

  const handleSaveAddress = () => {
    if (!newStreet.trim()) {
      alert('Пожалуйста, укажите улицу и номер дома.');
      return;
    }

    const isOblast = newDistrict.includes('(ЛО)');
    const prefix = isOblast ? 'Ленинградская область' : 'г. Санкт-Петербург';
    const generatedFullAddress = `${prefix}, ${newStreet.trim()}${newApt ? `, кв. ${newApt.trim()}` : ''}`;

    const biosecNote =
      temperament === 'RESTRAINT_NEEDED'
        ? 'Требуется предварительная фиксация животного'
        : temperament === 'STRESSED'
        ? 'Животное испытывает стресс при визите чужих'
        : 'Животное дружелюбно';

    const barrierNote = hasBarrier ? barrierInstruction || 'Шлагбаум во дворе' : 'Свободный въезд';

    if (editingAddressId) {
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr.id !== editingAddressId) return addr;
          return {
            ...addr,
            regionType: isOblast ? 'LEN_OBLAST' : 'SPB_CITY',
            fullAddress: generatedFullAddress,
            district: newDistrict,
            entrance: newEntrance || '1',
            floor: newFloor || '1',
            aptOffice: newApt || '—',
            intercom: newIntercom || '—',
            barrierGateNote: barrierNote,
            biosecurityNote: biosecNote,
          };
        })
      );
    } else {
      const created: AddressRecord = {
        id: `addr-${Date.now()}`,
        title: addresses.length === 0 ? 'Основной адрес' : `Адрес вызова ${addresses.length + 1}`,
        isPrimary: addresses.length === 0,
        regionType: isOblast ? 'LEN_OBLAST' : 'SPB_CITY',
        fullAddress: generatedFullAddress,
        district: newDistrict,
        coordinates: '59.9343° N, 30.3351° E',
        entrance: newEntrance || '1',
        floor: newFloor || '1',
        aptOffice: newApt || '—',
        intercom: newIntercom || '—',
        barrierGateNote: barrierNote,
        biosecurityNote: biosecNote,
      };
      setAddresses((prev) => [...prev, created]);
    }

    handleCancelEdit();
  };

  const selectedDistrictInfo = ALL_DISTRICTS_WITH_SURCHARGE.find((d) => d.district === newDistrict);

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Назад в профиль"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 border border-slate-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">Адреса вызова ветслужбы</h1>
            <p className="text-[10px] font-semibold text-slate-500">Логистика выездной ветеринарной службы СПб</p>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
          АИ
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Express Arrival Logistics Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                  <Car className="w-3 h-3 shrink-0 mr-1" />
                  Экспресс-выезд бригады
                </span>
                <span className="text-[10px] text-blue-200 font-mono">ETA ~20 мин</span>
              </div>
              <h3 className="text-sm font-black text-white leading-snug">
                Мгновенный трансфер координат в планшет экипажа
              </h3>
              <p className="text-[11px] text-blue-100/90 leading-tight">
                Точные координаты домофона, шлагбаума и протокол фиксации питомца гарантируют быстрое прибытие скорой ветпомощи без задержек.
              </p>
            </div>
          </div>
        </div>

        {/* Saved Addresses List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Сохраненные локации ({addresses.length})</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                if (isFormOpen && !editingAddressId) {
                  setIsFormOpen(false);
                } else {
                  handleCancelEdit();
                  setIsFormOpen(true);
                  setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 60);
                }
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Добавить адрес</span>
            </button>
          </div>

          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-3xl p-4 shadow-xs border transition-all space-y-3 ${
                addr.isPrimary
                  ? 'border-blue-400 ring-2 ring-blue-500/20'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-900">{addr.title}</span>
                    {addr.isPrimary && (
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Основной адрес
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-800 leading-snug mt-1">
                    {addr.fullAddress}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {addr.district} р-н • GPS: {addr.coordinates}
                  </p>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(addr)}
                    aria-label="Редактировать адрес"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    aria-label="Удалить адрес"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Detail capsules */}
              <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-center">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-sans">Подъезд</span>
                  <span className="font-bold text-slate-800">{addr.entrance}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-sans">Этаж</span>
                  <span className="font-bold text-slate-800">{addr.floor}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-sans">Кв/Офис</span>
                  <span className="font-bold text-slate-800">{addr.aptOffice}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-sans">Домофон</span>
                  <span className="font-bold text-slate-800">{addr.intercom}</span>
                </div>
              </div>

              {/* Barrier and access note */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <Car className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Въезд и доступ:</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {addr.barrierGateNote}
                </p>
              </div>

              {/* Embedded biosecurity note */}
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-950 space-y-1">
                <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Протокол ветбезопасности дома:</span>
                </div>
                <p className="text-[10px] text-emerald-800 leading-tight">
                  {addr.biosecurityNote}
                </p>
              </div>

              {/* Footer Actions */}
              {!addr.isPrimary && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleMakePrimary(addr.id)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Сделать основным адресом</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Address Form Section (Add / Edit) */}
        {isFormOpen && (
          <div
            ref={formRef}
            className="bg-white rounded-3xl p-5 shadow-md border-2 border-blue-200 space-y-3.5 animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                {editingAddressId ? (
                  <>
                    <Pencil className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Редактирование адреса</span>
                  </>
                ) : (
                  <>
                    <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Новый адрес вызова в СПб и ЛО</span>
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {editingAddressId ? 'Отмена редактирования' : 'Отмена'}
              </button>
            </div>

            {/* GPS Detection */}
            <div className="flex items-center justify-between p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-bold text-blue-900">Определить геопозицию</span>
              </div>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {isLocating ? 'Поиск спутников...' : 'Мое местоположение'}
              </button>
            </div>

            {/* Street & House */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Улица, номер дома, корпус *
              </label>
              <input
                type="text"
                placeholder="например: Каменноостровский пр-кт, 14, корп. 2"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>

            {/* District Selector & Regional Surcharge */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">Район Санкт-Петербурга / ЛО *</label>
                {selectedDistrictInfo && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      selectedDistrictInfo.surchargeRub === 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {selectedDistrictInfo.surchargeRub === 0
                      ? 'Городской тариф (0 ₽ наценка)'
                      : `+${selectedDistrictInfo.surchargeRub} ₽ пригородный коэфф.`}
                  </span>
                )}
              </div>
              <select
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
              >
                {ALL_DISTRICTS_WITH_SURCHARGE.map((d) => (
                  <option key={d.district} value={d.district}>
                    {d.district} {d.surchargeRub > 0 ? `(+${d.surchargeRub} ₽)` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Apartment, Entrance, Floor, Intercom Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Кв/Офис</label>
                <input
                  type="text"
                  placeholder="42"
                  value={newApt}
                  onChange={(e) => setNewApt(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono text-center focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Подъезд</label>
                <input
                  type="text"
                  placeholder="2"
                  value={newEntrance}
                  onChange={(e) => setNewEntrance(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono text-center focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Этаж</label>
                <input
                  type="text"
                  placeholder="4"
                  value={newFloor}
                  onChange={(e) => setNewFloor(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono text-center focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-1">Домофон</label>
                <input
                  type="text"
                  placeholder="42#"
                  value={newIntercom}
                  onChange={(e) => setNewIntercom(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-mono text-center focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Barrier / Closed Courtyard Toggle */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBarrier}
                  onChange={(e) => setHasBarrier(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-800">
                  Закрытый двор / Шлагбаум / Охрана на въезде
                </span>
              </label>

              {hasBarrier && (
                <input
                  type="text"
                  placeholder="Инструкция водителю: код ворот, телефон консьержа или номер квартиры для открытия"
                  value={barrierInstruction}
                  onChange={(e) => setBarrierInstruction(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-white"
                />
              )}
            </div>

            {/* Temperament Selector */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Темперамент питомца при визите ветврача:
              </label>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
                <button
                  type="button"
                  onClick={() => setTemperament('CALM')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    temperament === 'CALM'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Спокойный
                </button>
                <button
                  type="button"
                  onClick={() => setTemperament('STRESSED')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    temperament === 'STRESSED'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Стресс / Пугливый
                </button>
                <button
                  type="button"
                  onClick={() => setTemperament('RESTRAINT_NEEDED')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    temperament === 'RESTRAINT_NEEDED'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Фиксация
                </button>
              </div>
            </div>

            {/* Mini route map preview */}
            <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                <span className="flex items-center space-x-1.5">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Клиническая зона покрытия Санкт-Петербурга</span>
                </span>
                <span className="text-emerald-700">В зоне дежурства</span>
              </div>
              <div className="h-16 w-full rounded-xl bg-slate-200/80 border border-slate-300/80 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                [Логистический сектор СПб • Координаты зафиксированы]
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSaveAddress}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <span>{editingAddressId ? 'Обновить данные адреса →' : 'Сохранить адрес для выезда бригад →'}</span>
              </button>

              {editingAddressId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Отмена редактирования
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200 text-[10px] text-slate-500 text-center space-y-1">
          <p className="font-semibold text-slate-700">
            Шифрование логистических данных по ГОСТ Р 34.12-2015
          </p>
          <p>
            Адреса и инструкции доступа используются исключительно дежурным экипажем скорой ветпомощи и защищены 152-ФЗ РФ.
          </p>
        </div>
      </div>
    </div>
  );
};
