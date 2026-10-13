import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Phone,
  Thermometer,
  CheckCircle2,
  Camera,
  Paperclip,
  FileText,
  Send,
  X,
  Sparkles,
  ZoomIn,
} from 'lucide-react';

export interface DoctorChatRoomModalProps {
  readonly channelId: string;
  readonly patientName: string;
  readonly breed: string;
  readonly ageWeight: string;
  readonly chipId?: string;
  readonly ownerName: string;
  readonly proxyPhone?: string;
  readonly topic: string;
  readonly onClose: () => void;
  readonly onOpenPrescription?: () => void;
}

interface MessageItem {
  readonly id: string;
  readonly sender: 'owner' | 'doctor' | 'system';
  readonly timestamp: string;
  readonly text?: string;
  readonly isTempLog?: boolean;
  readonly tempValue?: string;
  readonly isPhotoAttachment?: boolean;
  readonly photoCaption?: string;
  readonly isPrescription?: boolean;
  readonly rxNumber?: string;
}

export const DoctorChatRoomModal: React.FC<DoctorChatRoomModalProps> = ({
  channelId: _channelId,
  patientName,
  breed,
  ageWeight,
  chipId = '643098100234567',
  ownerName,
  proxyPhone = '+7 (812) 200-78-19',
  topic,
  onClose,
  onOpenPrescription,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'm-sys-1',
      sender: 'system',
      timestamp: '14:00',
      text: 'Защищенный телеконсилиум открыт в рамках наряда #ВЕТ-491 (Закон РФ № 4979-1, ГОСТ Р 34.12 • Шифрование данных владельца и медкарты по 152-ФЗ)',
    },
    {
      id: 'm-photo-1',
      sender: 'owner',
      timestamp: '14:15',
      isPhotoAttachment: true,
      photoCaption: 'Фото места инъекции (правая лопатка, вакцина Nobivac DHPPi)',
    },
    {
      id: 'm-temp-1',
      sender: 'owner',
      timestamp: '14:16',
      isTempLog: true,
      tempValue: '38.6°C',
    },
    {
      id: 'm-text-1',
      sender: 'owner',
      timestamp: '14:17',
      text: 'Добрый день, доктор! Сделали замер температуры, как вы просили. Место укола осмотрели — припухлости нет, собака активна, аппетит хороший. Фото прикрепил выше.',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const quickPresets = [
    'Температура в норме, продолжайте наблюдение.',
    'Прикрепите повторное фото через 12 часов.',
    'При признаках вялости немедленно вызовите бригаду.',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputText.trim();
    if (!content) return;

    const newMsg: MessageItem = {
      id: `m-doc-${Date.now()}`,
      sender: 'doctor',
      timestamp: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      text: content,
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) {
      setInputText('');
    }
    showToast('Клиническое указание отправлено владельцу в защищенный чат');
  };

  const handleSendPreset = (preset: string) => {
    handleSendMessage(preset);
  };

  const handleAttachPhoto = () => {
    showToast('Служба камеры активна: тестовый снимок прикреплен к диалогу');
    const photoMsg: MessageItem = {
      id: `m-doc-photo-${Date.now()}`,
      sender: 'doctor',
      timestamp: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isPhotoAttachment: true,
      photoCaption: 'Клиническая схема пальпации и контрольных зон (СПбГУВМ)',
    };
    setMessages((prev) => [...prev, photoMsg]);
  };

  const handleCreatePrescription = () => {
    if (onOpenPrescription) {
      onOpenPrescription();
      return;
    }
    const rxMsg: MessageItem = {
      id: `m-rx-${Date.now()}`,
      sender: 'doctor',
      timestamp: new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isPrescription: true,
      rxNumber: 'Вет-Rx #СПБ-842-ТЕЛЕ',
      text: 'Электронный рецепт: Антигистаминный сироп (цетиризин 0.5 мг/кг) при аллергической реакции. Подписан УКЭП.',
    };
    setMessages((prev) => [...prev, rxMsg]);
    showToast('Электронный рецепт ВетИС сформирован и отправлен в чат');
  };

  return (
    <div className="absolute inset-0 z-40 bg-white flex flex-col w-full h-full overflow-hidden select-none font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 border border-slate-700 animate-fadeIn max-w-[90%]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Native Sticky Mobile Header */}
      <div className="bg-white border-b border-slate-200/90 px-3.5 py-2.5 shrink-0 flex items-center justify-between shadow-2xs z-10">
        <div className="flex items-center space-x-2.5 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -ml-1 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Назад к списку чатов"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
          </button>

          <div className="min-w-0 truncate">
            <div className="flex items-center space-x-1.5 truncate">
              <h2 className="text-sm font-black text-slate-900 leading-tight truncate">
                {patientName}
              </h2>
              <span className="text-[10px] font-bold text-slate-500 shrink-0">
                ({breed}{ageWeight ? `, ${ageWeight}` : ''})
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0 hidden sm:inline">
                ISO {chipId}
              </span>
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5 text-[11px] text-slate-500 truncate">
              <span className="font-semibold text-slate-700 truncate">{ownerName}</span>
              <span>•</span>
              <span className="text-blue-700 font-mono font-bold flex items-center space-x-1 shrink-0">
                <Phone className="w-3 h-3 shrink-0 inline" />
                <span>{proxyPhone}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-1.5 pl-2">
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Курация 22:00</span>
          </span>
        </div>
      </div>

        {/* Topic Context Sub-Bar */}
        <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs text-blue-950 font-bold shrink-0">
          <div className="flex items-center space-x-2 truncate">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate">Тема: {topic}</span>
          </div>
          <span className="text-[10px] text-blue-700 shrink-0 ml-2 font-mono">
            Наряд #ВЕТ-491
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="max-w-md p-3 bg-white rounded-2xl border border-slate-200 text-center shadow-2xs space-y-1">
                    <div className="flex items-center justify-center space-x-1.5 text-[11px] font-black text-slate-700">
                      <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Защищенный медицинский канал</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            }

            if (msg.sender === 'owner') {
              return (
                <div key={msg.id} className="flex flex-col items-start space-y-1 max-w-[85%] sm:max-w-[75%]">
                  <span className="text-[10px] font-bold text-slate-500 pl-1">
                    {ownerName} • {msg.timestamp}
                  </span>

                  {msg.isPhotoAttachment && (
                    <div className="bg-white p-2.5 rounded-3xl rounded-tl-sm border border-slate-200 shadow-xs space-y-2">
                      <div className="relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
                        <div
                          onClick={() => setIsPhotoViewerOpen(true)}
                          className="w-64 h-40 bg-gradient-to-br from-amber-100 via-rose-50 to-slate-200 flex items-center justify-center relative overflow-hidden"
                        >
                          {/* Photofixation visual representation */}
                          <div className="absolute inset-0 bg-blue-900/10 flex flex-col items-center justify-center text-slate-700 p-4 text-center">
                            <Camera className="w-8 h-8 text-blue-600 mb-2 opacity-80" />
                            <span className="text-xs font-black text-slate-900">
                              Фото места инъекции
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono mt-1">
                              2400 × 1600 px • 14:15 МСК
                            </span>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-lg text-[10px] font-bold text-blue-900 flex items-center space-x-1 shadow-xs">
                            <ZoomIn className="w-3 h-3" />
                            <span>Увеличить</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-700 font-semibold px-1">
                        {msg.photoCaption}
                      </p>
                      <div className="flex items-center space-x-1.5 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Следов гематомы и воспаления нет</span>
                      </div>
                    </div>
                  )}

                  {msg.isTempLog && (
                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-amber-200 shadow-xs flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                        <Thermometer className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-900">
                            Замер температуры: {msg.tempValue}
                          </span>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Нормотермия
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          Электронный ветеринарный датчик • Норма для собак: 37.5°C – 39.0°C
                        </p>
                      </div>
                    </div>
                  )}

                  {msg.text && (
                    <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm border border-slate-200 shadow-xs text-xs text-slate-800 font-medium leading-relaxed">
                      {msg.text}
                    </div>
                  )}
                </div>
              );
            }

            // Doctor message
            return (
              <div key={msg.id} className="flex flex-col items-end space-y-1 ml-auto max-w-[85%] sm:max-w-[75%]">
                <span className="text-[10px] font-bold text-slate-500 pr-1">
                  Вы (Д-р Романов К. В.) • {msg.timestamp}
                </span>

                {msg.isPhotoAttachment && (
                  <div className="bg-blue-600 text-white p-2.5 rounded-3xl rounded-tr-sm shadow-xs space-y-2">
                    <div className="w-64 h-32 bg-blue-700 rounded-2xl flex items-center justify-center p-3 text-center">
                      <FileText className="w-8 h-8 text-blue-200 mb-1" />
                    </div>
                    <p className="text-[11px] font-bold px-1">{msg.photoCaption}</p>
                  </div>
                )}

                {msg.isPrescription && (
                  <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl rounded-tr-sm shadow-xs space-y-2 text-indigo-950">
                    <div className="flex items-center space-x-2 border-b border-indigo-100 pb-1.5">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-xs font-black">{msg.rxNumber}</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-200 text-indigo-900">
                        УКЭП ГОСТ
                      </span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
                  </div>
                )}

                {msg.text && !msg.isPrescription && (
                  <div className="bg-blue-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-xs text-xs font-medium leading-relaxed">
                    {msg.text}
                    <div className="flex justify-end mt-1 text-[10px] text-blue-200 font-bold items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Доставлено</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Presets Sub-Bar */}
        <div className="bg-white border-t border-slate-200 px-3 py-2 shrink-0">
          <div className="flex items-center space-x-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Быстрые клинические ответы
            </span>
          </div>
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x py-0.5">
            {quickPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSendPreset(preset)}
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 shrink-0 flex items-center space-x-2">
          <button
            type="button"
            onClick={handleAttachPhoto}
            className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Прикрепить фото / схему"
          >
            <Camera className="w-5 h-5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={handleCreatePrescription}
            className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer flex items-center space-x-1"
            title="Выписать рецепт Вет-Rx"
          >
            <Paperclip className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline text-xs font-bold text-slate-600">Вет-Rx</span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Введите клиническое указание для владельца..."
            className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              inputText.trim()
                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* Photofixation Full-Screen Inspector Confined in Mobile Shell */}
        {isPhotoViewerOpen && (
          <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    Детальная фотофиксация места инъекции
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPhotoViewerOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="h-64 rounded-2xl bg-gradient-to-br from-amber-50 to-slate-100 border border-slate-200 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <ShieldCheck className="w-10 h-10 text-emerald-600" />
                <p className="text-xs font-black text-slate-900">
                  Высокое разрешение (2400 × 1600 px) • Защищенный шлюз СПб
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed max-w-sm">
                  Зона правой лопатки чистая. Гиперемия, отек, болезненность и местная гипертермия отсутствуют. Реакция на антиген вакцины Nobivac DHPPi в пределах нормы.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-slate-400">
                  Хэш снимка: SHA-256 #8f921...c10b
                </span>
                <button
                  type="button"
                  onClick={() => setIsPhotoViewerOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Закрыть просмотр
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};
