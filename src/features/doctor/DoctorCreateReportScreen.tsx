import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  Eye,
  Stethoscope,
  Activity,
  HeartPulse,
  Pill,
  Clock,
  BellRing,
  FileSignature,
  FileText,
  AlertCircle,
  Search,
  ChevronDown,
  Download,
  Printer,
  X,
  Save,
  Thermometer,
} from 'lucide-react';

export interface DoctorCreateReportScreenProps {
  readonly onBack: () => void;
  readonly onSignAndProceed: () => void;
}

export interface SoapNarrativeItem {
  readonly id: string;
  readonly title: string;
  readonly iconType: 'eye' | 'stethoscope' | 'activity' | 'lymph' | 'thermometer';
  checked: boolean;
  narrative: string;
}

export interface ClinicalTemplate {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly nosologyCode: string;
  readonly diagnosisTitle: string;
  readonly pathogenesisSummary: string;
  readonly soapFindings: Array<{
    readonly id: string;
    readonly title: string;
    readonly iconType: 'eye' | 'stethoscope' | 'activity' | 'lymph' | 'thermometer';
    readonly defaultDescription: string;
    readonly checked: boolean;
  }>;
  readonly primaryMedication: {
    readonly drugName: string;
    readonly formulation: string;
    readonly calculatedDose: string;
    readonly frequencyTiming: string;
    readonly courseDuration: string;
    readonly administrationRoute: string;
    readonly specialNotes: string;
  };
  readonly supportiveTherapy: Array<{
    readonly id: string;
    readonly name: string;
    readonly regimen: string;
    readonly defaultChecked: boolean;
  }>;
  readonly specialInstructions: string;
}

const DEFAULT_TEMPLATE: ClinicalTemplate = {
  id: 'tracheobronchitis',
    title: 'Острый инфекционный трахеобронхит (Питомниковый кашель)',
    category: 'Респираторные патологии',
    nosologyCode: 'VET-RESP-104.2',
    diagnosisTitle: 'Острый инфекционный трахеобронхит собак (Bordetella bronchiseptica + CPiV)',
    pathogenesisSummary:
      'Острое респираторное заболевание с преимущественным поражением эпителия трахеи и крупных бронхов. Развитие катарального воспаления, гиперсекреции слизи и спастического кашлевого синдрома при интактной легочной паренхиме.',
    soapFindings: [
      {
        id: 'soap-1',
        title: 'Слизистые оболочки ротовой полости и конъюнктивы',
        iconType: 'eye',
        defaultDescription:
          'Слизистые оболочки ротовой полости бледно-розовые, влажные, блестящие. СНК = 1.2 сек (норма). Цианоза, наложений и эрозивных дефектов не выявлено.',
        checked: true,
      },
      {
        id: 'soap-2',
        title: 'Трахеальный кашлевой рефлекс и аускультация легких',
        iconType: 'stethoscope',
        defaultDescription:
          'Трахеальный рефлекс резко положительный: легкая поверхностная компрессия верхней трети трахеи провоцирует приступ сухих пароксизмальных звуков. Аускультация легких: жесткое везикулярное дыхание без патологических хрипов.',
        checked: true,
      },
      {
        id: 'soap-3',
        title: 'Пальпация брюшной стенки и органов ЖКТ',
        iconType: 'activity',
        defaultDescription:
          'Брюшная стенка мягкая, податливая, ненапряженная. Глубокая пальпация мезогастрия и эпигастрия безболезненная. Свободного газа и локальной спастичности петель не обнаружено.',
        checked: true,
      },
      {
        id: 'soap-4',
        title: 'Подчелюстные и регионарные лимфатические узлы',
        iconType: 'lymph',
        defaultDescription:
          'Подчелюстные лимфоузлы умеренно гипертрофированы (до 1.5 см), симметричные, подвижные, безболезненные при компрессии, плотно-эластической консистенции.',
        checked: true,
      },
      {
        id: 'soap-5',
        title: 'Клиническая термометрия и гемодинамика',
        iconType: 'thermometer',
        defaultDescription:
          'Ректальная температура T = 39.1°C (субфебрилитет воспалительного генеза). ЧСС = 96 уд/мин, ритм правильный, пульс на бедренных артериях синхронный, удовлетворительного наполнения.',
        checked: true,
      },
    ],
    primaryMedication: {
      drugName: 'Синулокс 250 мг (Synulox)',
      formulation: 'Таблетки (Амоксициллин 200 мг + Клавулановая кислота 50 мг)',
      calculatedDose: '1.5 таб. (375 мг) на массу 28.4 кг (13.2 мг/кг)',
      frequencyTiming: '2 раза в сутки (каждые 12 часов) строго после кормления',
      courseDuration: '10 дней (полный антибактериальный курс)',
      administrationRoute: 'Внутрь (per os) с небольшим объемом влажного корма',
      specialNotes: 'Не отменять курс досрочно при купировании кашля во избежание хронизации и рецидива.',
    },
    supportiveTherapy: [
      {
        id: 'sup-1',
        name: 'Бронхолитин / сироп солодки ветеринарный',
        regimen: 'По 5 мл 2 раза в день в течение 5 дней для снижения раздражения трахеи',
        defaultChecked: true,
      },
      {
        id: 'sup-2',
        name: 'Фосфалюгель (Al-Mg гастропротектор)',
        regimen: '1 пакетик за 30 минут до утреннего приема пищи 7 дней подряд',
        defaultChecked: true,
      },
      {
        id: 'sup-3',
        name: 'Режим прогулок: только анатомическая шлейка',
        regimen: 'Полное исключение механического сдавливания трахеи ошейником на 14 дней',
        defaultChecked: true,
      },
    ],
    specialInstructions:
      'Изолировать собаку от других восприимчивых животных на 7 дней. Контрольный дистанционный телемедицинский контакт с врачом через 48 часов. Обильное теплое питье 1.5 л/сутки.',
};

const BUILT_IN_TEMPLATES: readonly ClinicalTemplate[] = [
  DEFAULT_TEMPLATE,
  {
    id: 'gastroenteritis',
    title: 'Острый алиментарный гастроэнтерит (Кормовая погрешность)',
    category: 'Гастроэнтерология',
    nosologyCode: 'VET-GI-208.1',
    diagnosisTitle: 'Острый алиментарный гастроэнтерит с признаками умеренной дегидратации',
    pathogenesisSummary:
      'Катаральное воспаление слизистой оболочки желудка и тонкого отдела кишечника на фоне погрешности в кормлении. Нарушение моторной функции, дискинезия, спастический синдром без признаков обструкции.',
    soapFindings: [
      {
        id: 'soap-1',
        title: 'Слизистые оболочки ротовой полости и гидратация',
        iconType: 'eye',
        defaultDescription:
          'Слизистые оболочки бледно-розовые, незначительная сухость краевой каймы десен. СНК = 1.8 сек. Тургор кожи незначительно снижен (клиническая дегидратация ~5%).',
        checked: true,
      },
      {
        id: 'soap-2',
        title: 'Аускультация органов дыхания и сердца',
        iconType: 'stethoscope',
        defaultDescription:
          'Дыхание везикулярное, кашлевой рефлекс отрицательный. Тоны сердца ясные, ритмичные, патологических кардиоваскулярных шумов не прослушивается.',
        checked: true,
      },
      {
        id: 'soap-3',
        title: 'Пальпация брюшной стенки и перистальтика',
        iconType: 'activity',
        defaultDescription:
          'Брюшная стенка умеренно напряжена в эпигастральной области, спастическая реакция при глубокой пальпации. Перистальтические шумы кишечника усилены, урчание.',
        checked: true,
      },
      {
        id: 'soap-4',
        title: 'Лимфатические узлы',
        iconType: 'lymph',
        defaultDescription:
          'Подчелюстные, паховые и подколенные лимфоузлы безболезненны, не увеличены, нормальной плотности.',
        checked: true,
      },
      {
        id: 'soap-5',
        title: 'Температура тела',
        iconType: 'thermometer',
        defaultDescription:
          'Ректальная температура T = 38.6°C (физиологическая норма). Признаков пиретической реакции нет.',
        checked: true,
      },
    ],
    primaryMedication: {
      drugName: 'Метронидазол 250 мг (Metronidazole)',
      formulation: 'Таблетки пероральные',
      calculatedDose: '1.25 таб. (310 мг) 2 раза в день (11 мг/кг)',
      frequencyTiming: 'Каждые 12 часов с порцией диетического питания',
      courseDuration: '7 дней',
      administrationRoute: 'Внутрь (per os)',
      specialNotes: 'Разносить прием с энтеросорбентами с интервалом не менее 2 часов.',
    },
    supportiveTherapy: [
      {
        id: 'sup-1',
        name: 'Энтеросгель / Смекта',
        regimen: '1 столовая ложка разведенная с теплой водой за 2 часа до еды 3 раза/день',
        defaultChecked: true,
      },
      {
        id: 'sup-2',
        name: 'Диетический рацион Gastrointestinal',
        regimen: 'Дробное питание малыми порциями 4-5 раз в день теплой консистенции',
        defaultChecked: true,
      },
      {
        id: 'sup-3',
        name: 'Пероральная регидратация (Регидрон)',
        regimen: 'Выпаивание дробными дозами по 50 мл каждые 1.5-2 часа',
        defaultChecked: true,
      },
    ],
    specialInstructions:
      'Исключить любые лакомства, жирные продукты и кости на 14 дней. При появлении повторной неукротимой рвоты немедленный вызов ветбригады.',
  },
  {
    id: 'parvovirus',
    title: 'Парвовирусный энтерит собак (Острое течение)',
    category: 'Инфекционные болезни',
    nosologyCode: 'VET-INF-019.4',
    diagnosisTitle: 'Парвовирусный энтерит собак (Canine Parvovirus Type 2) с риском септицемии',
    pathogenesisSummary:
      'Тяжелая вирусная деструкция эпителия крипт тонкого кишечника, экссудация, синдром мальабсорбции, быстро прогрессирующий гемоконцентрационный эксикоз.',
    soapFindings: [
      {
        id: 'soap-1',
        title: 'Слизистые оболочки и гиповолемия',
        iconType: 'eye',
        defaultDescription:
          'Слизистые бледные, матовые, липкие, СНК = 2.4 сек. Тургор кожи существенно снижен, складка расправляется более 2 сек (дегидратация ~7-8%).',
        checked: true,
      },
      {
        id: 'soap-2',
        title: 'Аускультация и тонус мышц',
        iconType: 'stethoscope',
        defaultDescription:
          'Апатия, выраженная мышечная слабость. Тоны сердца глуховатые, тахикардия ЧСС = 138 уд/мин.',
        checked: true,
      },
      {
        id: 'soap-3',
        title: 'Пальпация брюшной полости',
        iconType: 'activity',
        defaultDescription:
          'Выраженная абдоминальная болезненность, петли кишечника утолщены, содержат жидкостный и газовый экссудат. Звуки плеска.',
        checked: true,
      },
      {
        id: 'soap-4',
        title: 'Мезентериальные лимфоузлы',
        iconType: 'lymph',
        defaultDescription:
          'Брыжеечные лимфатические узлы реактивно увеличены, болезненны при глубокой пальпации.',
        checked: true,
      },
      {
        id: 'soap-5',
        title: 'Температура тела',
        iconType: 'thermometer',
        defaultDescription:
          'Ректальная температура T = 39.8°C (пиретическая лихорадка вирусного происхождения).',
        checked: true,
      },
    ],
    primaryMedication: {
      drugName: 'Цефтриаксон 1.0 г + Раствор Рингера-Локка',
      formulation: 'Порошок для приготовления раствора для инъекций',
      calculatedDose: '0.7 г (25 мг/кг) внутримышечно 2 раза в сутки + инфузия 400 мл',
      frequencyTiming: 'Каждые 12 часов в/м + подкожные регидратационные болюсы',
      courseDuration: '7-10 дней под ежедневным контролем гемограммы',
      administrationRoute: 'Парентерально (в/м и п/к инфузии)',
      specialNotes: 'Антибактериальная протекция вторичного бактериального сепсиса.',
    },
    supportiveTherapy: [
      {
        id: 'sup-1',
        name: 'Серения (Маропитант 10 мг/мл)',
        regimen: '1 мг/кг (2.8 мл) п/к 1 раз в сутки для купирования рвотного рефлекса',
        defaultChecked: true,
      },
      {
        id: 'sup-2',
        name: 'Специфическая сыворотка Гискан-5',
        regimen: '2 дозы п/к двукратно с интервалом 24 часа',
        defaultChecked: true,
      },
      {
        id: 'sup-3',
        name: 'Нулевая пероральная нагрузка при рвоте',
        regimen: 'Полный голод до прекращения рвоты не менее 12 часов, только инфузии',
        defaultChecked: true,
      },
    ],
    specialInstructions:
      'Карантин по месту нахождения. Обработка помещения растворами четвертичных солей. Повторный осмотр ветврачом через 12 часов.',
  },
  {
    id: 'vaccination',
    title: 'Плановая диспансеризация и комплексная вакцинация',
    category: 'Профилактика',
    nosologyCode: 'VET-PREV-001.0',
    diagnosisTitle: 'Профилактический клинический осмотр и иммунизация клинически здорового животного',
    pathogenesisSummary:
      'Плановое обследование перед введением биопрепаратов. Патологических изменений органов и систем не выявлено. Животное клинически здорово, дегельминтизировано.',
    soapFindings: [
      {
        id: 'soap-1',
        title: 'Слизистые оболочки',
        iconType: 'eye',
        defaultDescription:
          'Слизистые оболочки ротовой полости розовые, влажные, блестящие, СНК < 1 сек. Признаков воспаления нет.',
        checked: true,
      },
      {
        id: 'soap-2',
        title: 'Органы дыхания и сердце',
        iconType: 'stethoscope',
        defaultDescription:
          'Дыхание ровное, чистое, везикулярное. Кашлевой рефлекс отрицательный. Тоны сердца ясные, ритмичные.',
        checked: true,
      },
      {
        id: 'soap-3',
        title: 'Пальпация органов брюшной полости',
        iconType: 'activity',
        defaultDescription:
          'Брюшная стенка мягкая, безболезненная, физиологической конфигурации во всех отделах.',
        checked: true,
      },
      {
        id: 'soap-4',
        title: 'Лимфатическая система',
        iconType: 'lymph',
        defaultDescription:
          'Поверхностные лимфатические узлы симметричны, подвижны, нормального размера и консистенции.',
        checked: true,
      },
      {
        id: 'soap-5',
        title: 'Температура тела',
        iconType: 'thermometer',
        defaultDescription:
          'Ректальная температура T = 38.4°C (полная физиологическая норма). Противопоказаний к вакцинации нет.',
        checked: true,
      },
    ],
    primaryMedication: {
      drugName: 'Nobivac DHPPi + Nobivac Lepto',
      formulation: 'Вакцина ассоциированная живая сухая с растворителем Нобивак Дилуент',
      calculatedDose: '1 доза (1.0 мл) независимо от массы и породы',
      frequencyTiming: 'Однократно подкожно в область холки',
      courseDuration: 'Однократно, плановая ревакцинация через 12 месяцев',
      administrationRoute: 'Подкожно (s.c.) с соблюдением правил асептики',
      specialNotes: 'Серия и номер занесены в ФГИС «ВетИС» (Хорриот) и международный ветпаспорт.',
    },
    supportiveTherapy: [
      {
        id: 'sup-1',
        name: 'Наблюдение за общим статусом',
        regimen: 'Мониторинг общего состояния и аппетита в течение первых 48 часов',
        defaultChecked: true,
      },
      {
        id: 'sup-2',
        name: 'Щадящий режим активности',
        regimen: 'Исключить переохлаждение, купание и стрессовые нагрузки в течение 3 дней',
        defaultChecked: true,
      },
      {
        id: 'sup-3',
        name: 'Иммунный карантин',
        regimen: 'Ограничить контакты с невакцинированными собаками на 14 дней',
        defaultChecked: true,
      },
    ],
    specialInstructions:
      'При появлении индивидуальной гиперчувствительности (отек морды, зуд) немедленно связаться с дежурным ветврачом.',
  },
];

export const DoctorCreateReportScreen: React.FC<DoctorCreateReportScreenProps> = ({
  onBack,
  onSignAndProceed,
}) => {
  // Templates state
  const [availableTemplates, setAvailableTemplates] = useState<ClinicalTemplate[]>([...BUILT_IN_TEMPLATES]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tracheobronchitis');
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState<boolean>(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState<string>('');

  // Custom template modal state
  const [isCustomTemplateModalOpen, setIsCustomTemplateModalOpen] = useState<boolean>(false);
  const [customTemplateName, setCustomTemplateName] = useState<string>('');
  const [customTemplateCategory, setCustomTemplateCategory] = useState<string>('Терапия');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Full Protocol Export / Preview Modal state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // Active clinical editable fields
  const [nosologyCode, setNosologyCode] = useState<string>(DEFAULT_TEMPLATE.nosologyCode);
  const [diagnosisTitle, setDiagnosisTitle] = useState<string>(DEFAULT_TEMPLATE.diagnosisTitle);
  const [pathogenesisSummary, setPathogenesisSummary] = useState<string>(
    DEFAULT_TEMPLATE.pathogenesisSummary
  );

  // SOAP narratives list
  const [soapList, setSoapList] = useState<SoapNarrativeItem[]>(
    DEFAULT_TEMPLATE.soapFindings.map((f) => ({
      id: f.id,
      title: f.title,
      iconType: f.iconType,
      checked: f.checked,
      narrative: f.defaultDescription,
    }))
  );

  // Medication fields (Fully editable)
  const [medDrugName, setMedDrugName] = useState<string>(DEFAULT_TEMPLATE.primaryMedication.drugName);
  const [medFormulation, setMedFormulation] = useState<string>(
    DEFAULT_TEMPLATE.primaryMedication.formulation
  );
  const [medCalculatedDose, setMedCalculatedDose] = useState<string>(
    DEFAULT_TEMPLATE.primaryMedication.calculatedDose
  );
  const [medFrequencyTiming, setMedFrequencyTiming] = useState<string>(
    DEFAULT_TEMPLATE.primaryMedication.frequencyTiming
  );
  const [medCourseDuration, setMedCourseDuration] = useState<string>(
    DEFAULT_TEMPLATE.primaryMedication.courseDuration
  );
  const [medAdminRoute, setMedAdminRoute] = useState<string>(
    DEFAULT_TEMPLATE.primaryMedication.administrationRoute
  );
  const [medSpecialNotes, setMedSpecialNotes] = useState<string>(
    DEFAULT_TEMPLATE.primaryMedication.specialNotes
  );

  // Reminders & supportive
  const [smartRemindersEnabled, setSmartRemindersEnabled] = useState<boolean>(true);
  const [supportiveItems, setSupportiveItems] = useState(
    DEFAULT_TEMPLATE.supportiveTherapy.map((s) => ({
      id: s.id,
      name: s.name,
      regimen: s.regimen,
      checked: s.defaultChecked,
    }))
  );
  const [instructionsText, setInstructionsText] = useState<string>(
    DEFAULT_TEMPLATE.specialInstructions
  );

  // Load custom templates from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vetteck_custom_clinical_templates');
      if (stored) {
        const parsed = JSON.parse(stored) as ClinicalTemplate[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAvailableTemplates([...BUILT_IN_TEMPLATES, ...parsed]);
        }
      }
    } catch {
      // Ignore storage read error
    }
  }, []);

  // Handler: Select and apply a template
  const handleSelectTemplate = (template: ClinicalTemplate) => {
    setSelectedTemplateId(template.id);
    setIsTemplateSelectorOpen(false);

    // Auto-populate all fields
    setNosologyCode(template.nosologyCode);
    setDiagnosisTitle(template.diagnosisTitle);
    setPathogenesisSummary(template.pathogenesisSummary);

    setSoapList(
      template.soapFindings.map((f) => ({
        id: f.id,
        title: f.title,
        iconType: f.iconType,
        checked: f.checked,
        narrative: f.defaultDescription,
      }))
    );

    setMedDrugName(template.primaryMedication.drugName);
    setMedFormulation(template.primaryMedication.formulation);
    setMedCalculatedDose(template.primaryMedication.calculatedDose);
    setMedFrequencyTiming(template.primaryMedication.frequencyTiming);
    setMedCourseDuration(template.primaryMedication.courseDuration);
    setMedAdminRoute(template.primaryMedication.administrationRoute);
    setMedSpecialNotes(template.primaryMedication.specialNotes);

    setSupportiveItems(
      template.supportiveTherapy.map((s) => ({
        id: s.id,
        name: s.name,
        regimen: s.regimen,
        checked: s.defaultChecked,
      }))
    );

    setInstructionsText(template.specialInstructions);
  };

  // Handler: Save current authored report as custom template
  const handleSaveCustomTemplate = () => {
    if (!customTemplateName.trim()) return;

    const newCustom: ClinicalTemplate = {
      id: `custom-${Date.now()}`,
      title: customTemplateName.trim(),
      category: customTemplateCategory.trim() || 'Пользовательские шаблоны',
      nosologyCode,
      diagnosisTitle,
      pathogenesisSummary,
      soapFindings: soapList.map((s) => ({
        id: s.id,
        title: s.title,
        iconType: s.iconType,
        defaultDescription: s.narrative,
        checked: s.checked,
      })),
      primaryMedication: {
        drugName: medDrugName,
        formulation: medFormulation,
        calculatedDose: medCalculatedDose,
        frequencyTiming: medFrequencyTiming,
        courseDuration: medCourseDuration,
        administrationRoute: medAdminRoute,
        specialNotes: medSpecialNotes,
      },
      supportiveTherapy: supportiveItems.map((s) => ({
        id: s.id,
        name: s.name,
        regimen: s.regimen,
        defaultChecked: s.checked,
      })),
      specialInstructions: instructionsText,
    };

    const updated = [...availableTemplates, newCustom];
    setAvailableTemplates(updated);
    setSelectedTemplateId(newCustom.id);

    try {
      const customsOnly = updated.filter((t) => t.id.startsWith('custom-'));
      localStorage.setItem('vetteck_custom_clinical_templates', JSON.stringify(customsOnly));
    } catch {
      // Ignore storage error
    }

    setSaveSuccessMessage(`Шаблон «${newCustom.title}» успешно сохранен!`);
    setTimeout(() => {
      setSaveSuccessMessage(null);
      setIsCustomTemplateModalOpen(false);
      setCustomTemplateName('');
    }, 1200);
  };

  const toggleSoapChecked = (id: string) => {
    setSoapList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const updateSoapNarrative = (id: string, text: string) => {
    setSoapList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, narrative: text } : item))
    );
  };

  const toggleSupportiveChecked = (id: string) => {
    setSupportiveItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const renderSoapIcon = (type: SoapNarrativeItem['iconType']) => {
    switch (type) {
      case 'eye':
        return <Eye className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'stethoscope':
        return <Stethoscope className="w-4 h-4 text-indigo-600 shrink-0" />;
      case 'activity':
        return <Activity className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'lymph':
        return <HeartPulse className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'thermometer':
        return <Thermometer className="w-4 h-4 text-amber-600 shrink-0" />;
    }
  };

  const filteredTemplates = availableTemplates.filter((t) =>
    t.title.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
    t.nosologyCode.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(templateSearchQuery.toLowerCase())
  );

  const selectedTemplate = availableTemplates.find((t) => t.id === selectedTemplateId) ?? DEFAULT_TEMPLATE;

  return (
    <div className="min-h-full pb-24 font-sans bg-slate-50/70">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-3.5 sticky top-0 z-20 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Назад к осмотру"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 border border-slate-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-slate-900 leading-tight">
                СПб ВетСлужба 24/7 • Протокол #ВЕТ-491
              </h1>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
              Интерактивная станция формирования ветпротокола
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
            ВетИС • 4979-1
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* A. Searchable Clinical Templates Selector & Custom Builder Trigger */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-blue-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              Клинический шаблон протокола
            </span>

            {/* Custom Template Action Button */}
            <button
              type="button"
              onClick={() => setIsCustomTemplateModalOpen(true)}
              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Сохранить как шаблон</span>
            </button>
          </div>

          {/* Active Template Selector Box */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTemplateSelectorOpen(!isTemplateSelectorOpen)}
              className="w-full p-3.5 bg-slate-50 hover:bg-blue-50/40 rounded-2xl border border-slate-300 flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <div className="pr-2">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  {selectedTemplate.category} • {selectedTemplate.nosologyCode}
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1">
                  {selectedTemplate.title}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${
                  isTemplateSelectorOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Searchable Dropdown Popup */}
            {isTemplateSelectorOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-slate-200 shadow-xl z-30 p-3 space-y-2 animate-fadeIn max-h-80 overflow-y-auto">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={templateSearchQuery}
                    onChange={(e) => setTemplateSearchQuery(e.target.value)}
                    placeholder="Поиск по диагнозу, коду или нозологии..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        template.id === selectedTemplateId
                          ? 'bg-blue-50 border-blue-400 font-bold text-blue-900'
                          : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-mono font-bold text-blue-700 bg-white px-1.5 py-0.2 rounded border border-blue-200">
                            {template.nosologyCode}
                          </span>
                          <span className="text-[10px] text-slate-400">{template.category}</span>
                        </div>
                        <p className="text-xs font-black mt-0.5 leading-snug">
                          {template.title}
                        </p>
                      </div>

                      {template.id === selectedTemplateId && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                      )}
                    </div>
                  ))}
                  {filteredTemplates.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">
                      Шаблонов не найдено
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Patient Capsule & Rapid Diagnostics Confirmation */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-slate-900">Хаски Норд</h2>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  3 года • Кобель кастрир.
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Вес: <strong className="font-mono text-slate-900">28.4 кг</strong> • Температура: <strong className="font-mono text-amber-600">Т 39.1°C</strong>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                RFID-чип: 643094100294182 • Владелец: Александр Н. Смирнов
              </p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          {/* Rapid Diagnostics Confirmation Pill */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">Экспресс-диагностика на выезде выполнена:</span>
            </div>
            <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold">
              <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">CPV Ag (-)</span>
              <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">Вуд (-)</span>
            </div>
          </div>
        </div>

        {/* Diagnosis & Pathogenesis Card (Fully Editable) */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900">
              Клинический диагноз и патогенез
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              Редактируемые поля
            </span>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Код ВетИС / МКБ-Вет</label>
                <input
                  type="text"
                  value={nosologyCode}
                  onChange={(e) => setNosologyCode(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-blue-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Основной диагноз</label>
                <input
                  type="text"
                  value={diagnosisTitle}
                  onChange={(e) => setDiagnosisTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Патогенетическое резюме и картина</label>
              <textarea
                rows={3}
                value={pathogenesisSummary}
                onChange={(e) => setPathogenesisSummary(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* D. Deep Clinical SOAP Narratives (Expandable/Inline Multi-line Edit) */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              <span>Объективный статус (SOAP) • Развернутые описания</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Врачебный нарратив
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            Каждое клиническое заключение доступно для прямого редактирования врачом. Текст в полном объеме экспортируется в официальный протокол.
          </p>

          <div className="space-y-3">
            {soapList.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      {renderSoapIcon(item.iconType)}
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      {item.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSoapChecked(item.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      item.checked ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={item.narrative}
                  onChange={(e) => updateSoapNarrative(item.id, e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none font-sans"
                />
              </div>
            ))}
          </div>
        </div>

        {/* C. Fully Editable Medication & Dosage Administration Block */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-indigo-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Электронный ветрецепт #СПБ-842 (Редактируемые параметры)
              </h3>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Rx • Фармакотерапия
            </span>
          </div>

          <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Препарат</label>
                <input
                  type="text"
                  value={medDrugName}
                  onChange={(e) => setMedDrugName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Форма выпуска</label>
                <input
                  type="text"
                  value={medFormulation}
                  onChange={(e) => setMedFormulation(e.target.value)}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Расчетная дозировка на вес 28.4 кг</label>
                <input
                  type="text"
                  value={medCalculatedDose}
                  onChange={(e) => setMedCalculatedDose(e.target.value)}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-xs font-mono font-bold text-indigo-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Кратность и интервалы приема</label>
                <input
                  type="text"
                  value={medFrequencyTiming}
                  onChange={(e) => setMedFrequencyTiming(e.target.value)}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Длительность курса</label>
                <input
                  type="text"
                  value={medCourseDuration}
                  onChange={(e) => setMedCourseDuration(e.target.value)}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Путь введения</label>
                <input
                  type="text"
                  value={medAdminRoute}
                  onChange={(e) => setMedAdminRoute(e.target.value)}
                  className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Указания по приему и взаимодействию с пищей</label>
              <textarea
                rows={2}
                value={medSpecialNotes}
                onChange={(e) => setMedSpecialNotes(e.target.value)}
                className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Daily Schedule Preview */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-indigo-100 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Утренний прием</span>
                  <span className="font-mono font-black text-slate-800">08:30 • 1.5 таб.</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-indigo-100 flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Вечерний прием</span>
                  <span className="font-mono font-black text-slate-800">20:30 • 1.5 таб.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Smart Reminders Switch */}
          <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Смарт-напоминания владельцу собаки
                </span>
                <span className="text-[10px] text-slate-500">
                  Push-уведомления Александру в 08:30 и 20:30 с кнопкой «Принято»
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSmartRemindersEnabled(!smartRemindersEnabled)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                smartRemindersEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  smartRemindersEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Supportive Therapy Presets */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
            Сопутствующая симптоматическая терапия и режим
          </h4>

          <div className="space-y-2 text-xs">
            {supportiveItems.map((sup) => (
              <div
                key={sup.id}
                onClick={() => toggleSupportiveChecked(sup.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  sup.checked ? 'bg-slate-50 border-blue-400' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-900 block">{sup.name}</span>
                  <span className="text-[10px] text-slate-500">{sup.regimen}</span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    sup.checked ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                  }`}
                >
                  {sup.checked && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            ))}
          </div>

          {/* Special Instructions (Editable) */}
          <div className="pt-2 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-500 block">
              Особые предписания и карантинные меры:
            </span>
            <textarea
              rows={2}
              value={instructionsText}
              onChange={(e) => setInstructionsText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* Regulatory note */}
        <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-[11px] text-blue-900 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-tight">
            Протокол формируется в соответствии со ст. 2.1 Закона РФ № 4979-1 и автоматически синхронизируется с ФГИС «ВетИС» (Хорриот) после заверения УКЭП врача.
          </div>
        </div>

        {/* E. Action Buttons: Full Protocol Export / Preview + UKEP Sign & Settle */}
        <div className="space-y-2.5 pt-2">
          {/* Secondary Action: Full Protocol Preview & Export Modal */}
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 rounded-2xl text-xs sm:text-sm font-black shadow-2xs transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Предпросмотр и экспорт полного протокола (А4 / PDF)</span>
          </button>

          {/* Primary Signing Trigger */}
          <button
            type="button"
            onClick={onSignAndProceed}
            className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <FileSignature className="w-4 h-4 shrink-0" />
            <span>Подписать протокол ветпомощи УКЭП и перейти к расчету →</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: Custom Template Builder ("Создать свой шаблон") */}
      {isCustomTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                  <Save className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Создать свой шаблон
                  </h3>
                  <p className="text-xs text-slate-500">
                    Сохранение текущих назначений
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomTemplateModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Текущий диагноз, формулировки SOAP и схема медикаментозной терапии будут сохранены в вашу персональную библиотеку пресетов.
            </p>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Название шаблона
                </label>
                <input
                  type="text"
                  value={customTemplateName}
                  onChange={(e) => setCustomTemplateName(e.target.value)}
                  placeholder="Например: Острый цистит / схема Норда"
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Категория
                </label>
                <input
                  type="text"
                  value={customTemplateCategory}
                  onChange={(e) => setCustomTemplateCategory(e.target.value)}
                  placeholder="Терапия / Хирургия / Пульмонология"
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {saveSuccessMessage && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold text-center">
                {saveSuccessMessage}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSaveCustomTemplate}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-98"
              >
                Сохранить шаблон в библиотеку
              </button>

              <button
                type="button"
                onClick={() => setIsCustomTemplateModalOpen(false)}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Full Clinical Protocol Export & Complete Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-black">
                    Официальный протокол ветпомощи
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    ГОСТ Р 34.12 • Закон РФ № 4979-1 • ФГИС «ВетИС» (Хорриот)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Unabridged Full Clinical Document */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800 leading-relaxed font-sans">
              {/* Document Stamp Header */}
              <div className="border-b-2 border-slate-800 pb-4 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                    VetTech PRO • Клинический сервис выездной службы Санкт-Петербурга
                  </span>
                  <h2 className="text-base font-black text-slate-900 mt-1">
                    ПРОТОКОЛ ВЕТЕРИНАРНОГО ОСМОТРА № ВЕТ-СПБ-78-491
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Дата и время: 13 октября 2026 г., 12:45 • Режим: Экстренный очный выезд
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-slate-600 block">
                    УКЭП #78-VET-2026-9812
                  </span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                    Верифицирован в ОФД
                  </span>
                </div>
              </div>

              {/* Parties & Patient Info */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Пациент:</span>
                    <strong className="text-slate-900">Хаски Норд</strong> (3 года, самец, 28.4 кг)
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Идентификационный чип:</span>
                    <span className="font-mono text-slate-900">ISO 11784/85: 643094100294182</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Владелец (Куратор):</span>
                    <span>Смирнов Александр Николаевич</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Адрес оказания помощи:</span>
                    <span>г. СПб, ул. Ленина, д. 28, кв. 42</span>
                  </div>
                </div>
                <div className="pt-1 text-[11px] text-slate-600">
                  <strong>Лечащий ветеринарный врач:</strong> Романов К. В. (Диплом СПбГУВМ, лицензия ВетИС).
                </div>
              </div>

              {/* Diagnosis & Nosology */}
              <div className="space-y-1.5 border-l-4 border-blue-600 pl-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {nosologyCode}
                  </span>
                  <h4 className="text-sm font-black text-slate-900">{diagnosisTitle}</h4>
                </div>
                <p className="text-xs text-slate-700">
                  {pathogenesisSummary}
                </p>
              </div>

              {/* Full Unabridged SOAP Findings */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-900 border-b border-slate-200 pb-1">
                  Объективный клинический статус (SOAP)
                </h4>
                <div className="space-y-2">
                  {soapList.map((soap) => (
                    <div key={soap.id} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <strong className="text-xs text-slate-900">{soap.title}</strong>
                      </div>
                      <p className="text-[11px] text-slate-700 pl-5">
                        {soap.narrative}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medication Protocol */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-900 border-b border-slate-200 pb-1">
                  Фармакотерапевтический лист (Электронный рецепт)
                </h4>
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-1 text-xs">
                  <p><strong>Препарат:</strong> {medDrugName} ({medFormulation})</p>
                  <p><strong>Расчетная дозировка:</strong> {medCalculatedDose}</p>
                  <p><strong>Кратность и режим:</strong> {medFrequencyTiming} • {medAdminRoute}</p>
                  <p><strong>Курс лечения:</strong> {medCourseDuration}</p>
                  <p className="text-indigo-900 italic"><strong>Особые указания:</strong> {medSpecialNotes}</p>
                </div>
              </div>

              {/* Supportive Therapy */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase text-slate-900 border-b border-slate-200 pb-1">
                  Сопутствующая терапия и рекомендации
                </h4>
                <ul className="space-y-1 text-xs list-disc pl-5 text-slate-700">
                  {supportiveItems.filter((s) => s.checked).map((s) => (
                    <li key={s.id}>
                      <strong>{s.name}:</strong> {s.regimen}
                    </li>
                  ))}
                  <li><strong>Особые предписания:</strong> {instructionsText}</li>
                </ul>
              </div>

              {/* Digital Signature Official Stamp */}
              <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5 text-emerald-900 font-black">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>ДОКУМЕНТ ЗАВЕРЕН УСИЛЕННОЙ КВАЛИФИЦИРОВАННОЙ ЭЦП (УКЭП)</span>
                  </div>
                  <p className="text-[10px] text-emerald-800">
                    Сертификат: 78-Vet-2026-9812 • Врач: Романов К. В. • Хэш ГОСТ Р 34.11-2012
                  </p>
                  <p className="text-[10px] text-emerald-700">
                    Передано в реестр клинических актов ФГИС «ВетИС» (Минсельхоз РФ)
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full border-2 border-emerald-600 bg-white flex items-center justify-center text-center p-1 shrink-0">
                  <span className="text-[8px] font-black uppercase text-emerald-800 leading-tight">
                    ВетИС OK
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsExportingPdf(true);
                    setTimeout(() => setIsExportingPdf(false), 1200);
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExportingPdf ? 'Экспорт PDF завершен!' : 'Экспорт в PDF (А4)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print?.()}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Печать протокола</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Закрыть предпросмотр
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
