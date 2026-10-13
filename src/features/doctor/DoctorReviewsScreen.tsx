import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  Heart,
  MessageSquare,
  X,
  FileSignature,
  Send,
} from 'lucide-react';

export interface DoctorReviewsScreenProps {
  readonly onBack: () => void;
}

interface ReviewItem {
  readonly id: string;
  readonly clientName: string;
  readonly petName: string;
  readonly date: string;
  readonly rating: number;
  readonly text: string;
  readonly tipRub?: number;
  doctorReply?: string;
}

export const DoctorReviewsScreen: React.FC<DoctorReviewsScreenProps> = ({
  onBack,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WITH_TIPS' | 'WITH_REPLY'>('ALL');
  const [replyModalReview, setReplyModalReview] = useState<ReviewItem | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [replySuccessMessage, setReplySuccessMessage] = useState<string | null>(null);

  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      clientName: 'Александр Смирнов',
      petName: 'Хаски Норд',
      date: 'Сегодня, 13:10',
      rating: 5,
      text: 'Врач приехал точно к назначенному времени, осмотр провел предельно аккуратно. Норд обычно нервничает при измерении температуры, но доктор сразу нашел подход. Прописал подробный курс Синулокса, все в приложении с напоминаниями. Спасибо огромное!',
      tipRub: 500,
    },
    {
      id: 'rev-2',
      clientName: 'Елена Кузнецова',
      petName: 'Мейн-кун Барс',
      date: 'Вчера, 18:40',
      rating: 5,
      text: 'Быстро купировали спазм кишечника, сделали экспресс-тест на месте за 10 минут. Очень удобно, что не пришлось тащить 9-килограммового кота в клинику под дождем. Настоящий профессионал!',
      tipRub: 1000,
      doctorReply: 'Спасибо за отзыв, Елена! Рад, что Барсу уже лучше. Не забывайте соблюдать диету Royal Canin Gastrointestinal еще 10 дней. Д-р Романов К. В. (УКЭП)',
    },
    {
      id: 'rev-3',
      clientName: 'Дмитрий Васильев',
      petName: 'Корги Оскар',
      date: '11 октября 2026',
      rating: 5,
      text: 'Вакцинировали Нобиваком, чип сразу внесли в Хорриот и ветпаспорт. Никаких побочек, песель бодр и весел. Отдельный плюс за термобокс с датчиком температуры.',
      tipRub: 500,
    },
    {
      id: 'rev-4',
      clientName: 'Ольга Михайлова',
      petName: 'Шпиц Майя',
      date: '9 октября 2026',
      rating: 5,
      text: 'Очень вежливый доктор, почистили ушки и взяли мазок. Майя даже не пикнула. Будем обращаться только к вам!',
      tipRub: 300,
    },
  ]);

  const handleOpenReply = (review: ReviewItem) => {
    setReplyModalReview(review);
    setReplyText(review.doctorReply || '');
  };

  const handleSendReply = () => {
    if (!replyModalReview || !replyText.trim()) return;

    const signatureStamp = `\n\n— Д-р Романов К. В. (Подписано УКЭП, Сертификат #78-Vet-2026)`;
    const fullReply = replyText.trim() + signatureStamp;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === replyModalReview.id ? { ...r, doctorReply: fullReply } : r
      )
    );

    setReplySuccessMessage('Ответ официально подписан УКЭП и опубликован!');
    setTimeout(() => {
      setReplySuccessMessage(null);
      setReplyModalReview(null);
      setReplyText('');
    }, 1200);
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === 'WITH_TIPS') return !!r.tipRub;
    if (activeFilter === 'WITH_REPLY') return !!r.doctorReply;
    return true;
  });

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Bar Header */}
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
            <h1 className="text-base font-black text-slate-900 leading-tight">
              Рейтинг и отзывы владельцев
            </h1>
            <p className="text-[10px] font-semibold text-slate-500">
              142 верифицированных отзыва • 4.98 ★
            </p>
          </div>
        </div>

        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
          Топ-1 Врач
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Rating & Tips Summary Hero */}
        <div className="grid grid-cols-2 gap-3">
          {/* Rating Capsule */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Общий рейтинг
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-black font-mono text-slate-900">
                4.98
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center space-x-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-[10px] text-slate-500">142 оценки кураторов</p>
          </div>

          {/* SBP Tips Capsule */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-4 shadow-xs space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider flex items-center space-x-1">
              <Heart className="w-3 h-3 text-white fill-white" />
              <span>Чаевые СБП</span>
            </span>
            <span className="text-2xl font-black font-mono block">
              24 500 ₽
            </span>
            <p className="text-[10px] text-emerald-100">
              18 прямых переводов за текущий месяц (0% комиссии)
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 py-1 select-none">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            Все отзывы (142)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('WITH_TIPS')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'WITH_TIPS'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            С чаевыми (18)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('WITH_REPLY')}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'WITH_REPLY'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            С ответом врача
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      {rev.clientName}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      • {rev.petName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {rev.tipRub && (
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                      <Heart className="w-2.5 h-2.5 text-emerald-600 fill-emerald-600" />
                      <span>+{rev.tipRub} ₽</span>
                    </span>
                  )}
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-xs font-bold font-mono text-slate-900 ml-1">
                      {rev.rating}.0
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {rev.text}
              </p>

              {/* Doctor Reply if exists */}
              {rev.doctorReply && (
                <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-1 text-xs text-blue-950">
                  <span className="text-[10px] font-bold uppercase text-blue-800 flex items-center space-x-1">
                    <FileSignature className="w-3 h-3 text-blue-600" />
                    <span>Официальный ответ врача (УКЭП)</span>
                  </span>
                  <p className="text-[11px] leading-relaxed text-blue-900">
                    {rev.doctorReply}
                  </p>
                </div>
              )}

              {/* Reply Button Trigger */}
              <div className="pt-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenReply(rev)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>{rev.doctorReply ? 'Изменить ответ' : 'Ответить с УКЭП'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Modal */}
      {replyModalReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Ответ на отзыв
                </h3>
                <p className="text-xs text-slate-500">
                  Клиент: {replyModalReview.clientName} ({replyModalReview.petName})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReplyModalReview(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              «{replyModalReview.text}»
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Текст официального ответа врача
              </label>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Благодарю за обратную связь! Норд отлично перенес..."
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <p className="text-[10px] text-slate-500 leading-tight">
              Ответ автоматически подписывается усиленной ЭЦП (УКЭП) врача по ГОСТ Р 34.10-2012 и публикуется в карточке специалиста.
            </p>

            {replySuccessMessage && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold text-center">
                {replySuccessMessage}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSendReply}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Опубликовать и заверить УКЭП</span>
              </button>

              <button
                type="button"
                onClick={() => setReplyModalReview(null)}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
