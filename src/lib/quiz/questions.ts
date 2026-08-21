export interface QuizOption {
  icon: string;
  label: string;
  value: string;
}

export interface QuizQuestion {
  title: string;
  description: string;
  options: QuizOption[];
  multi?: boolean;
  max?: number;
}

export const QICON: Record<string, string> = {
  woody: '🪵', oriental: '🔥', citrus: '🍋', aromatic: '🌿',
  aquatic: '🌊', leather: '👞', spicy: '🌶️', floral: '🌸',
  gourmand: '🍰', fougere: '💈', boozy: '🍷',
};

export const questions: QuizQuestion[] = [
  {
    title: 'متى وأين ستلبس عطرك أكثر؟',
    description: 'اختر وقت ومكان الاستخدام الذي تخيله.',
    options: [
      { icon: '🌅', label: 'صباحاً ويومياً', value: 'daily' },
      { icon: '💼', label: 'دوام ومكتب', value: 'work' },
      { icon: '🌙', label: 'مساءً ومواعيد', value: 'evening' },
      { icon: '🎉', label: 'سهرات ومناسبات', value: 'night' },
    ],
  },
  {
    title: 'أي عائلة عطرية تجرّبك؟',
    description: 'يمكنك اختيار عائلتين كحد أقصى.',
    multi: true,
    max: 2,
    options: [
      { icon: '🪵', label: 'خشبية', value: 'woody' },
      { icon: '🔥', label: 'شرقية عنبرية', value: 'oriental' },
      { icon: '🍋', label: 'حمضية منعشة', value: 'citrus' },
      { icon: '🌿', label: 'أروماتيك', value: 'aromatic' },
      { icon: '🌊', label: 'مائية بحرية', value: 'aquatic' },
      { icon: '👞', label: 'جلدية وتبغ', value: 'leather' },
      { icon: '🌶️', label: 'حارة توابل', value: 'spicy' },
      { icon: '🌸', label: 'زهرية رجالية', value: 'floral' },
      { icon: '🍰', label: 'جورماند حلوة', value: 'gourmand' },
      { icon: '💈', label: 'فوجير كلاسيكي', value: 'fougere' },
      { icon: '🍷', label: 'بوزية', value: 'boozy' },
    ],
  },
  {
    title: 'كيف تريد حضور عطرك؟',
    description: 'اختر مستوى القوة الذي ترتاح له.',
    options: [
      { icon: '🤫', label: 'هادئ وقريب', value: 'soft' },
      { icon: '👌', label: 'متوازن وواضح', value: 'mid' },
      { icon: '💨', label: 'فواح ولافت', value: 'strong' },
    ],
  },
  {
    title: 'أي نوتة تفضل أن تكون واضحة؟',
    description: 'يمكنك اختيار خيارين كحد أقصى.',
    multi: true,
    max: 2,
    options: [
      { icon: '🧼', label: 'مسك ونظيف', value: 'musk' },
      { icon: '🍋', label: 'حمضيات وانتعاش', value: 'citrus' },
      { icon: '🌶️', label: 'بهارات وتوابل', value: 'spice' },
      { icon: '🪵', label: 'عود وخشب', value: 'wood' },
      { icon: '🍦', label: 'فانيليا وحلاوة', value: 'vanilla' },
      { icon: '🌫️', label: 'دخان وبخور', value: 'smoke' },
    ],
  },
  {
    title: 'كم تحب الحلاوة في عطرك؟',
    description: 'لا توجد إجابة صحيحة؛ فقط ذوقك الشخصي.',
    options: [
      { icon: '🚫', label: 'بدون حلاوة تقريباً', value: 'dry' },
      { icon: '🙂', label: 'خفيفة', value: 'light' },
      { icon: '🍯', label: 'متوسطة', value: 'mid' },
      { icon: '🍰', label: 'واضحة وجورماند', value: 'sweet' },
    ],
  },
  {
    title: 'أي طقس يمثل عطرك المثالي؟',
    description: 'فكّر في الأجواء التي تريد فيها أن يلمع العطر.',
    options: [
      { icon: '🔥', label: 'حر وصيف', value: 'hot' },
      { icon: '🌤️', label: 'معتدل', value: 'mild' },
      { icon: '🌧️', label: 'بارد وممطر', value: 'cold' },
      { icon: '❄️', label: 'شتاء قوي', value: 'winter' },
    ],
  },
];

export const noteMap: Record<string, string[]> = {
  musk: ['مسك', 'نظيف', 'لافندر'],
  citrus: ['ليمون', 'برغموت', 'جريب فروت', 'برتقال', 'نعناع'],
  spice: ['فلفل', 'توابل', 'هيل', 'قرفة', 'زنجبيل'],
  wood: ['عود', 'خشب', 'أرز', 'صندل', 'باتشولي'],
  vanilla: ['فانيليا', 'كراميل', 'شوكولاتة', 'تونكا', 'عسل'],
  smoke: ['بخور', 'دخان', 'تبغ', 'قطران'],
};
