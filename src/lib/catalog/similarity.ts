import { normAr, normEn } from '@/lib/arabic';
import type { Perfume } from '@/domain/types';

// SIM dictionary — Arabic alt name (normalized) → base similarity score
const SIM: Record<string, number> = {
  /* 🎯 توائم موثقة 88–95 */
  'باروك روج إكستريه': 92,
  'كلوب دو نوي إنتنس مان': 90,
  'أمبر عود جولد': 90,
  'خمرة': 90,
  'ليو قام': 90,
  'بديع العود أوف جلوري': 90,
  'أسد': 88,
  '٩ بي إم': 88,
  'أمبر عود روبي': 88,
  'جان لو إيمورتال': 88,
  /* ≈ تطابق قوي 80–87 */
  'فطّان': 86,
  'تراثي بلو': 86,
  'ديتور نوار': 86,
  'بديع العود سبلايم': 86,
  'تريس نوي': 85,
  'كلوب دو نوي سيّاج': 85,
  'فاخر': 85,
  'وودي عود': 85,
  'فنتانا': 84,
  'نجدية': 84,
  'خمرة قهوة': 84,
  'أمبر عود توباكو': 84,
  'كلوب دو نوي أوربان مان': 83,
  'توسكانو ليذر': 82,
  'كلوب دو نوي مايلستون': 82,
  'خمرة دخان': 82,
  'رغبة وود إنتنس': 80,
  'هواس': 80,
  'قائد الفرسان': 80,
  'رمز سيلفر': 80,
  'أمير العود إنتنس': 80,
  'أنا أبيض': 80,
  'فيلفت جولد': 80,
  /* ◐ قريب 74–79 */
  'هانتر إنتنس': 79,
  'عود مود': 78,
  'أسد زنجبار': 78,
  'رمز جولد': 78,
  'تشوكو مسك': 78,
  'درهم': 78,
  'كورو': 76,
  'تريس جور': 76,
  'أوديسي أوم وايت': 76,
  'ليام غراي': 76,
  'عود مود إكسير': 76,
  'أنا أبيض لذر': 76,
  'عود ٢٤ ساعة': 76,
  'فيتيفر بامبلموس': 75,
  'رغبة': 74,
  'نجدية تريبيوت': 74,
  'ثروة جولد': 74,
  'أوبولنت مسك': 74,
  /* 🌫 بروح مشابهة — البدائل الفضفاضة (نتيجة التدقيق) */
  'إعجازي': 72,
  'حياتي': 72,
  'ثروة سيلفر': 72,
  'ماهر ليغاسي': 72,
  'ليام بلو شاين': 72,
  'أوديسي ميغا': 72,
  'ماهر': 72,
  'شادو': 70,
  'أريستوقراط': 70
};

// OVR overrides — [englishOriginalName, arabicAltNameNormalized, score]
const OVR: [string, string, number][] = [
  /* الدفعة السادسة: وحوش الميزانية */
  ['Althaïr', 'خمرة', 76],
  ['Ganymede', 'أنا أبيض لذر', 70],
  ['Kalemat', 'درهم', 74],
  ['Arabians Tonka', 'عود مود', 72],
  ['Instant Crush', 'أنا أبيض', 74],
  ['Boccanera', 'تشوكو مسك', 72],
  ['Narcotic Delight', 'خمرة دخان', 76],
  ['Oudh Infini', 'رغبة وود إنتنس', 74],
  ['Oud Maracujá', 'أسد زنجبار', 70],
  ['L\u2019Air du Désert Marocain', 'أمير العود إنتنس', 72],
  /* الدفعة السابعة: أصول عربية */
  ['Bukhoor Bani Hashim', 'عود ٢٤ ساعة', 82],
  ['Shumukh', 'عود مود', 80],
  ['Tomoh', 'انا ابيض لذر', 76],
  ['Waseem', 'ليام غراي', 74],
  ['Hob Musk', 'اوبولنت مسك', 80],
  ['Al Wisam Al Leil', 'رغبه وود انتنس', 82],
  ['Al Areej', 'عود مود', 80],
  ['Azhaar', 'ماهر ليغاسي', 72],
  ['Naseem', 'اعجازي', 72],
  ['Wistam', 'نجديه تريبيوت', 76],
  ['Dahn Al Oudh', 'بديع العود اوف جلوري', 74],
  ['Sultan', 'عود مود', 78],
  ['Sandal', 'ليام غراي', 72],
  ['Cool', 'حياتي', 70],
  ['Sultan Al Oud', 'رغبه', 76],
  ['Shampoo', 'فاخر', 72],
  ['Sultan Al Musk', 'اوبولنت مسك', 80],
  ['Oud Al Leil', 'رغبه وود انتنس', 82],
  ['Layali', 'عود مود', 80],
  ['Misk Al Ghazal', 'اوبولنت مسك', 80],
  ['Hajir', 'ثروه سيلفر', 74],
  ['Resala', 'عود مود', 80],
  ['Madawi', 'حياتي', 74],
  ['Hiss Al Emarat', 'بديع العود اوف جلوري', 76],
  ['Saqr', 'رغبه وود انتنس', 80],
  ['Hakeem Oud', 'عود مود', 80],
  ['Lamsa', 'نجديه تريبيوت', 76],
  ['Saif', 'رغبه', 76],
  ['Dira', 'انا ابيض لذر', 74],
  ['Fakhr', 'خمره', 74],
  /* الدفعة التاسعة: المكتب والصيف */
  ['Guerlain Homme', 'اعجازي', 72],
  ['Salvador Dali Pour Homme', 'ثروه سيلفر', 70],
  ['Italian Bergamot', 'اعجازي', 72],
  ['Orange Sanguine', 'حياتي', 70],
  ['Bergamotto di Calabria', 'اعجازي', 72],
  ['Eau de Pamplemousse Rose', 'ثروه سيلفر', 72],
  ['Clean Reserve Skin', 'اوبولنت مسك', 74],
  ['Jacomo de Jacomo', 'ثروه سيلفر', 68],
  ['Emanuel Ungaro III', 'اعجازي', 68],
  ['Karl Lagerfeld Classic', 'ثروه سيلفر', 68],
  ['Memoire d\u2019une Odeur', 'ماهر ليغاسي', 70],
  ['Code Colonia', 'اعجازي', 72],
  ['Egra', 'حياتي', 72],
  ['Rasasi Blue', 'فنتانا', 72],
  ['Warm Cotton', 'اوبولنت مسك', 74],
  ['Clémentine California', 'حياتي', 70],
  /* الدفعة العاشرة: الإصدارات الحديثة */
  ['Acqua di Gio Parfum', 'فنتانا', 78],
  ['Ombré Leather Parfum', 'انا ابيض لذر', 78],
  ['1 Million Royal', 'رمز جولد', 72],
  ['Phantom Intense', 'رمز جولد', 70],
  ['Stronger With You Forever', 'نجديه تريبيوت', 72],
  ['Armani Code Parfum', 'ليام بلو شاين', 70],
  /* 🔄 المراجعة — المرحلة ١: تخفيضات الأزواج ٨٠٪+ (OVR لكل زوج لحماية البدائل المشتركة) */
  ['Aventus', 'كلوب دو نوي إنتنس مان', 88],
  ['Baccarat Rouge 540', 'أمبر عود جولد', 88],
  ['Angels\u2019 Share', 'خمرة', 75],
  ['Tuscan Leather', 'ليو قام', 82],
  ['Ombre Nomade', 'جان لو إيمورتال', 75],
  ['Oud for Greatness', 'بديع العود أوف جلوري', 88],
  ['Oud Satin Mood', 'بديع العود سبلايم', 82],
  ['Interlude Man', 'رغبة وود إنتنس', 75],
  ['Naxos', 'خمرة قهوة', 75],
  ['Erba Pura', 'أمبر عود روبي', 82],
  ['Grand Soir', 'فيلفت جولد', 75],
  ['Reflection Man', 'كلوب دو نوي وايت إمبيريال', 72],
  ['Acqua di Gio', 'فنتانا', 80],
  ['Y EDP', 'فاخر', 80],
  ['Sauvage Elixir', 'أسد', 86],
  ['Eros', 'نجدية', 78],
  ['Layton', 'ديتور نوار', 82],
  ['Green Irish Tweed', 'تريس نوي', 78],
  ['Silver Mountain Water', 'كلوب دو نوي سيّاج', 84],
  ['Terre d\u2019Hermes', 'فطّان', 80],
  ['Allure Homme Sport', 'كلوب دو نوي أوربان مان', 80],
  ['Jazz Club', 'أمبر عود توباكو', 70],
  ['Tobacco Vanille', 'أمبر عود توباكو', 80],
  ['Baraonda', 'خمرة دخان', 68],
  /* 🔄 المراجعة — المرحلة ٢: الأصول الفريدة (سقف ٧٥؛ عائلة فقط ← ٧٠) */
  ['Kirke', 'أمبر عود روبي', 75],
  ['Telea', 'أمبر عود روبي', 75],
  ['Cassiopea', 'أمبر عود روبي', 75],
  ['Megamare', 'هواس', 70],
  ['Terroni', 'رغبة وود إنتنس', 72],
  ['Side Effect', 'خمرة دخان', 72],
  ['Black Afgano', 'رغبة وود إنتنس', 70],
  /* 🔄 المراجعة — المرحلة ٣أ: البوزية (بديل غير كحولي ← عائلة فقط ٧٠؛ تداخل ثانوي ← ٧٢؛ زوج توأم قهوة ← ٧٨) */
  ['Frapin 1270', 'خمرة', 72],
  ['Speakeasy', 'أمبر عود توباكو', 72],
  ['Dom Rosa', 'أنا أبيض', 70],
  ['The Blazing Mr Sam', 'رغبة وود إنتنس', 72],
  ['Angels\u2019 Share On The Rocks', 'خمرة', 75],
  ['Black Phantom', 'خمرة دخان', 70],
  ['Straight to Heaven', 'رغبة', 70],
  ['Apple Brandy', 'خمرة دخان', 70],
  ['Bitter Peach', 'خمرة دخان', 70],
  ['Spiritueuse Double Vanille', 'خمرة', 72],
  ['Enigma Pour Homme', 'خمرة دخان', 72],
  ['1740 Marquis de Sade', 'نجدية تريبيوت', 72],
  ['Vanille Fatale', 'خمرة قهوة', 72],
  ['Italica', 'خمرة قهوة', 70],
  ['Boss Bottled Elixir', 'خمرة قهوة', 70],
  ['Rehab', 'أمبر عود توباكو', 72],
  ['Boundless', 'أمبر عود توباكو', 72],
  ['Chergui', 'رغبة', 70],
  ['Kayali Vanilla 28', 'أنا أبيض', 70],
  ['Burberry London', 'خمرة', 72],
  ['Bentley For Men Intense', 'رغبة وود إنتنس', 72],
  ['Bentley For Men', 'رغبة وود إنتنس', 72],
  ['Eleventh Hour', 'ثروة جولد', 70],
  ['Duro', 'أنا أبيض لذر', 72],
  ['Intoxicated', 'خمرة قهوة', 78],
  ['By the Fireplace', 'أمير العود إنتنس', 72]
];

// Pre-compute normalized SIM keys
const SIMN: Record<string, number> = {};
for (const k in SIM) {
  SIMN[normAr(k)] = SIM[k];
}

// Pre-compute normalized OVR entries
const OVRN = OVR.map((r) => [normEn(r[0]), normAr(r[1]), r[2]] as [string, string, number]);

export function scoreOf(name: string): number {
  const sc = SIMN[normAr(name)];
  return sc == null ? 75 : sc;
}

export interface TierResult {
  t: string;
  c: string;
}

export function tierOf(sc: number): TierResult {
  if (sc >= 88) return { t: '🎯 توأم موثق', c: 'sim-twin' };
  if (sc >= 80) return { t: '≈ تطابق قوي', c: 'sim-strong' };
  if (sc >= 74) return { t: '◐ قريب', c: 'sim-close' };
  return { t: '🌫 بروح مشابهة', c: 'sim-vibe' };
}

export function assignScores(data: Perfume[]): void {
  data.forEach((d) => {
    const en = normEn(d.en);
    const an = normAr(d.an);
    let sc = scoreOf(d.an);
    for (const [ovrEn, ovrAn, ovrSc] of OVRN) {
      if (en === ovrEn && an === ovrAn) {
        sc = ovrSc;
        break;
      }
    }
    d.sim = sc;
  });
}
