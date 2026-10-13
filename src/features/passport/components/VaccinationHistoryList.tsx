import React, { useState } from 'react';
import { VaccinationRecord } from '../../../shared/types/veterinary';
import { Syringe } from 'lucide-react';

interface VaccinationHistoryListProps {
  readonly rabiesVaccinations: readonly VaccinationRecord[];
  readonly comprehensiveVaccinations: readonly VaccinationRecord[];
}

export const VaccinationHistoryList: React.FC<VaccinationHistoryListProps> = ({
  rabiesVaccinations,
  comprehensiveVaccinations,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'RABIES' | 'COMPREHENSIVE'>('ALL');

  const allRecords = [
    ...rabiesVaccinations.map((r) => ({ ...r, category: 'RABIES' as const })),
    ...comprehensiveVaccinations.map((c) => ({ ...c, category: 'COMPREHENSIVE' as const })),
  ].sort((a, b) => new Date(b.administeredDateIso).getTime() - new Date(a.administeredDateIso).getTime());

  const filteredRecords = allRecords.filter((rec) => {
    if (activeFilter === 'RABIES') return rec.category === 'RABIES';
    if (activeFilter === 'COMPREHENSIVE') return rec.category === 'COMPREHENSIVE';
    return true;
  });

  const formatDate = (isoString: string): string => {
    const d = new Date(isoString);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isExpired = (expirationIso: string): boolean => {
    return new Date(expirationIso).getTime() < Date.now();
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-vet-teal flex items-center justify-center font-bold text-sm">
            <Syringe className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Журнал вакцинаций</h4>
            <p className="text-[10px] text-slate-400">ФГИС «Меркурий» • Регистрация ветпрепаратов</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
          Всего: {allRecords.length}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1.5 p-1 bg-slate-100 rounded-xl mb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
            activeFilter === 'ALL'
              ? 'bg-white text-slate-900 shadow-sm font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Все ({allRecords.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('RABIES')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
            activeFilter === 'RABIES'
              ? 'bg-white text-rose-700 shadow-sm font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Бешенство ({rabiesVaccinations.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('COMPREHENSIVE')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
            activeFilter === 'COMPREHENSIVE'
              ? 'bg-white text-teal-700 shadow-sm font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Комплексные ({comprehensiveVaccinations.length})
        </button>
      </div>

      {/* Records list */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500 font-medium">Записи о вакцинации не найдены</p>
          <p className="text-[10px] text-slate-400 mt-1">
            Обратитесь к ветеринарному врачу для внесения данных в ФГИС «ВетИС»
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((item) => {
            const expired = isExpired(item.expirationDateIso);
            const isRabies = item.category === 'RABIES';

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all ${
                  isRabies
                    ? 'border-rose-100 bg-rose-50/30'
                    : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="text-xs font-bold text-slate-900">{item.vaccineName}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                          isRabies
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {isRabies ? 'БЕШЕНСТВО (ЗАКОН № 4979-1)' : 'КОМПЛЕКСНАЯ'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Серия: <span className="font-mono font-medium text-slate-700">{item.seriesNumber}</span>
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                      expired
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {expired ? 'ИСТЕКЛА' : 'ДЕЙСТВУЕТ'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Дата введения:</span>
                    <span className="font-semibold text-slate-800">{formatDate(item.administeredDateIso)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Действительна до:</span>
                    <span className={`font-semibold ${expired ? 'text-rose-600' : 'text-slate-800'}`}>
                      {formatDate(item.expirationDateIso)}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-600 bg-white/70 p-2 rounded-lg border border-slate-200/40">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">Врач: {item.veterinarianFullName}</span>
                  </div>
                  <div className="text-slate-400 mt-0.5 truncate">
                    Лицензия: {item.veterinaryClinicLicense}
                  </div>
                  {item.vetIsMercuryVsdUuid && (
                    <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-blue-600">
                      <span className="font-mono truncate">ВСД: {item.vetIsMercuryVsdUuid}</span>
                      <span className="font-semibold ml-1 shrink-0 text-emerald-600">✓ Меркурий</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
