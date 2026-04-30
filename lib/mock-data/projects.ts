import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    id: "water-01",
    slug: "forage-nguekokh-phase-1",
    theme: "water",
    title: { fr: "Forage a Nguekokh - phase 1", en: "Nguekokh borehole - phase 1", ar: "حفر بئر في نغوكوخ - المرحلة 1" },
    description: {
      fr: "Mise en place d'un forage pour repondre aux besoins en eau potable de plusieurs familles.",
      en: "Borehole setup to answer clean water needs for several families.",
      ar: "إنشاء بئر لتلبية احتياجات المياه الصالحة للشرب لعدة أسر."
    },
    goalAmount: 4200000,
    collectedAmount: 2450000,
    coverImage: "/assets/puits.jpeg",
    status: "ongoing",
    location: { fr: "Nguekokh, Senegal", en: "Nguekokh, Senegal", ar: "نغوكوخ، السنغال" },
    beneficiaryLabel: { fr: "1 400 beneficiaires", en: "1,400 beneficiaries", ar: "1400 مستفيد" },
    createdAt: "2026-01-12"
  },
  {
    id: "water-02",
    slug: "rehabilitation-point-eau-kaolack",
    theme: "water",
    title: { fr: "Rehabilitation d'un point d'eau a Kaolack", en: "Water point rehabilitation in Kaolack", ar: "إعادة تأهيل نقطة مياه في كاولاك" },
    description: {
      fr: "Reprise d'un point d'eau existant et installation d'equipements plus fiables.",
      en: "Upgrade of an existing water point with more reliable equipment.",
      ar: "تجديد نقطة مياه قائمة وتركيب تجهيزات أكثر موثوقية."
    },
    goalAmount: 1900000,
    collectedAmount: 1900000,
    coverImage: "/assets/3.jpeg",
    status: "completed",
    location: { fr: "Kaolack, Senegal", en: "Kaolack, Senegal", ar: "كاولاك، السنغال" },
    beneficiaryLabel: { fr: "850 beneficiaires", en: "850 beneficiaries", ar: "850 مستفيد" },
    createdAt: "2025-11-02"
  },
  {
    id: "water-03",
    slug: "extension-reseau-eau-saint-louis",
    theme: "water",
    title: { fr: "Extension reseau eau a Saint-Louis", en: "Water network extension in Saint-Louis", ar: "توسعة شبكة المياه في سان لويس" },
    description: {
      fr: "Projet a venir pour etendre la desserte et reduire les trajets quotidiens des familles.",
      en: "Upcoming project to extend service and reduce daily family travel for water.",
      ar: "مشروع قادم لتوسيع الخدمة وتقليل تنقل الأسر اليومي من أجل الماء."
    },
    goalAmount: 5600000,
    collectedAmount: 0,
    coverImage: "/assets/whats.jpeg",
    status: "upcoming",
    location: { fr: "Saint-Louis, Senegal", en: "Saint-Louis, Senegal", ar: "سان لويس، السنغال" },
    beneficiaryLabel: { fr: "2 100 beneficiaires", en: "2,100 beneficiaries", ar: "2100 مستفيد" },
    createdAt: "2026-05-16"
  },
  {
    id: "education-01",
    slug: "kits-scolaires-mbour",
    theme: "education",
    title: { fr: "Kits scolaires a Mbour", en: "School kits in Mbour", ar: "حقائب مدرسية في مبور" },
    description: {
      fr: "Distribution de kits et appui a la rentree pour des eleves et familles vulnerables.",
      en: "School kit distribution and back-to-school support for vulnerable students and families.",
      ar: "توزيع أدوات مدرسية ودعم العودة إلى الدراسة للتلاميذ والأسر الهشة."
    },
    goalAmount: 2800000,
    collectedAmount: 1780000,
    coverImage: "/assets/classe.jpeg",
    status: "ongoing",
    location: { fr: "Mbour, Senegal", en: "Mbour, Senegal", ar: "مبور، السنغال" },
    beneficiaryLabel: { fr: "620 eleves accompagnes", en: "620 students supported", ar: "620 تلميذا مستفيدا" },
    createdAt: "2026-02-08"
  },
  {
    id: "education-02",
    slug: "renovation-salle-de-classe-thies",
    theme: "education",
    title: { fr: "Renovation d'une salle de classe a Thies", en: "Classroom renovation in Thies", ar: "تجديد قاعة دراسية في تييس" },
    description: {
      fr: "Amelioration d'un espace d'apprentissage pour elever les conditions d'etude.",
      en: "Upgrade of a learning space to improve study conditions.",
      ar: "تحسين فضاء للتعلم من أجل رفع ظروف الدراسة."
    },
    goalAmount: 3600000,
    collectedAmount: 3600000,
    coverImage: "/assets/educationn.jpeg",
    status: "completed",
    location: { fr: "Thies, Senegal", en: "Thies, Senegal", ar: "تييس، السنغال" },
    beneficiaryLabel: { fr: "4 classes impactees", en: "4 classes impacted", ar: "4 أقسام مستفيدة" },
    createdAt: "2025-10-20"
  },
  {
    id: "education-03",
    slug: "bourses-jeunes-filles-louga",
    theme: "education",
    title: { fr: "Bourses pour jeunes filles a Louga", en: "Scholarships for girls in Louga", ar: "منح للفتيات في لوغا" },
    description: {
      fr: "Programme a venir pour soutenir la poursuite scolaire et limiter les abandons.",
      en: "Upcoming program to support school continuity and reduce dropouts.",
      ar: "برنامج قادم لدعم الاستمرار الدراسي وتقليل الانقطاع."
    },
    goalAmount: 4800000,
    collectedAmount: 0,
    coverImage: "/assets/education.jpeg",
    status: "upcoming",
    location: { fr: "Louga, Senegal", en: "Louga, Senegal", ar: "لوغا، السنغال" },
    beneficiaryLabel: { fr: "120 bourses visees", en: "120 scholarships targeted", ar: "120 منحة مستهدفة" },
    createdAt: "2026-06-10"
  },
  {
    id: "health-01",
    slug: "consultations-mobiles-dakar-banlieue",
    theme: "health",
    title: { fr: "Consultations mobiles en banlieue dakaroise", en: "Mobile consultations in Dakar suburbs", ar: "استشارات متنقلة في ضواحي دكار" },
    description: {
      fr: "Campagne mobile de consultation et de prevention dans plusieurs quartiers.",
      en: "Mobile consultation and prevention campaign across several neighborhoods.",
      ar: "حملة متنقلة للاستشارات والوقاية في عدة أحياء."
    },
    goalAmount: 3000000,
    collectedAmount: 1350000,
    coverImage: "/assets/consultation.jpeg",
    status: "ongoing",
    location: { fr: "Dakar, Senegal", en: "Dakar, Senegal", ar: "دكار، السنغال" },
    beneficiaryLabel: { fr: "2 300 personnes touchees", en: "2,300 people reached", ar: "2300 شخص مستفيد" },
    createdAt: "2026-03-03"
  },
  {
    id: "health-02",
    slug: "campagne-prevention-paludisme-niger",
    theme: "health",
    title: { fr: "Campagne prevention paludisme au Niger", en: "Malaria prevention campaign in Niger", ar: "حملة الوقاية من الملاريا في النيجر" },
    description: {
      fr: "Distribution de materiel de prevention et relais d'information communautaire.",
      en: "Distribution of prevention materials and community relay information.",
      ar: "توزيع أدوات الوقاية ودعم التوعية المجتمعية."
    },
    goalAmount: 2200000,
    collectedAmount: 2200000,
    coverImage: "/assets/santee.jpg",
    status: "completed",
    location: { fr: "Maradi, Niger", en: "Maradi, Niger", ar: "مرادي، النيجر" },
    beneficiaryLabel: { fr: "1 900 foyers accompagnes", en: "1,900 households supported", ar: "1900 أسرة مستفيدة" },
    createdAt: "2025-09-12"
  },
  {
    id: "health-03",
    slug: "materiel-premiers-soins-ziguinchor",
    theme: "health",
    title: { fr: "Materiel de premiers soins a Ziguinchor", en: "First aid equipment in Ziguinchor", ar: "معدات إسعافات أولية في زيغينشور" },
    description: {
      fr: "Projet a venir pour equiper des relais de sante et renforcer la reponse de proximite.",
      en: "Upcoming project to equip health relays and strengthen local response.",
      ar: "مشروع قادم لتجهيز نقاط الصحة وتعزيز الاستجابة المحلية."
    },
    goalAmount: 3400000,
    collectedAmount: 0,
    coverImage: "/assets/about.jpeg",
    status: "upcoming",
    location: { fr: "Ziguinchor, Senegal", en: "Ziguinchor, Senegal", ar: "زيغينشور، السنغال" },
    beneficiaryLabel: { fr: "18 relais de sante", en: "18 health relays", ar: "18 نقطة صحية" },
    createdAt: "2026-07-02"
  },
  {
    id: "tabaski-01",
    slug: "don-tabaski-mbour",
    theme: "tabaski",
    title: { fr: "Donation Tabaski a Mbour", en: "Tabaski donation in Mbour", ar: "تبرعات عيد الأضحى في مبور" },
    description: {
      fr: "Collecte pour accompagner des familles pendant la Tabaski avec une aide ciblee.",
      en: "Fundraiser to support families during Tabaski with targeted aid.",
      ar: "حملة لدعم الأسر خلال عيد الأضحى بمساعدة موجهة."
    },
    goalAmount: 5000000,
    collectedAmount: 2900000,
    coverImage: "/assets/bouffe.jpeg",
    status: "ongoing",
    location: { fr: "Mbour, Senegal", en: "Mbour, Senegal", ar: "مبور، السنغال" },
    beneficiaryLabel: { fr: "400 familles visees", en: "400 families targeted", ar: "400 أسرة مستهدفة" },
    createdAt: "2026-05-01"
  },
  {
    id: "tabaski-02",
    slug: "campagne-tabaski-kaffrine",
    theme: "tabaski",
    title: { fr: "Campagne Tabaski a Kaffrine", en: "Tabaski campaign in Kaffrine", ar: "حملة عيد الأضحى في كافرين" },
    description: {
      fr: "Operation saisonniere pour completer l'aide alimentaire et celebrer dignement.",
      en: "Seasonal operation to complement food aid and celebrate with dignity.",
      ar: "عملية موسمية لتكملة المساعدة الغذائية والاحتفال بكرامة."
    },
    goalAmount: 2600000,
    collectedAmount: 2600000,
    coverImage: "/assets/alimentaire.jpeg",
    status: "completed",
    location: { fr: "Kaffrine, Senegal", en: "Kaffrine, Senegal", ar: "كافرين، السنغال" },
    beneficiaryLabel: { fr: "180 familles accompagnees", en: "180 families supported", ar: "180 أسرة مستفيدة" },
    createdAt: "2025-06-15"
  },
  {
    id: "tabaski-03",
    slug: "fonds-tabaski-sedhiou",
    theme: "tabaski",
    title: { fr: "Fonds Tabaski a Sedhiou", en: "Tabaski fund in Sedhiou", ar: "صندوق عيد الأضحى في سيدهيو" },
    description: {
      fr: "Campagne a venir pour preparer la prochaine Tabaski et anticiper les besoins de familles fragiles.",
      en: "Upcoming campaign to prepare next Tabaski and anticipate fragile family needs.",
      ar: "حملة قادمة للتحضير لعيد الأضحى المقبل وتوقع احتياجات الأسر الهشة."
    },
    goalAmount: 6200000,
    collectedAmount: 0,
    coverImage: "/assets/banner.jpeg",
    status: "upcoming",
    location: { fr: "Sedhiou, Senegal", en: "Sedhiou, Senegal", ar: "سيدييو، السنغال" },
    beneficiaryLabel: { fr: "520 familles ciblees", en: "520 families targeted", ar: "520 أسرة مستهدفة" },
    createdAt: "2026-08-01"
  },
  {
    id: "food-01",
    slug: "distribution-alimentaire-rufisque",
    theme: "food",
    title: { fr: "Distribution alimentaire a Rufisque", en: "Food distribution in Rufisque", ar: "توزيع غذائي في روفيسك" },
    description: {
      fr: "Appui alimentaire d'urgence pour des familles confrontees a une forte pression economique.",
      en: "Emergency food support for families under heavy economic pressure.",
      ar: "دعم غذائي عاجل للأسر التي تواجه ضغطا اقتصاديا شديدا."
    },
    goalAmount: 3100000,
    collectedAmount: 1820000,
    coverImage: "/assets/alimentaire.jpeg",
    status: "ongoing",
    location: { fr: "Rufisque, Senegal", en: "Rufisque, Senegal", ar: "روفيسك، السنغال" },
    beneficiaryLabel: { fr: "270 foyers accompagnes", en: "270 households supported", ar: "270 أسرة مستفيدة" },
    createdAt: "2026-02-28"
  },
  {
    id: "food-02",
    slug: "ramadan-solidarite-saint-louis",
    theme: "food",
    title: { fr: "Ramadan solidarite a Saint-Louis", en: "Ramadan solidarity in Saint-Louis", ar: "رمضان تضامن في سان لويس" },
    description: {
      fr: "Distribution de packs alimentaires pendant le Ramadan pour des menages identifies.",
      en: "Food pack distribution during Ramadan for identified households.",
      ar: "توزيع سلال غذائية خلال رمضان للأسر المستهدفة."
    },
    goalAmount: 2700000,
    collectedAmount: 2700000,
    coverImage: "/assets/bouffe.jpeg",
    status: "completed",
    location: { fr: "Saint-Louis, Senegal", en: "Saint-Louis, Senegal", ar: "سان لويس، السنغال" },
    beneficiaryLabel: { fr: "320 menages soutenus", en: "320 households supported", ar: "320 أسرة مدعومة" },
    createdAt: "2025-04-04"
  },
  {
    id: "food-03",
    slug: "banque-alimentaire-zones-rurales",
    theme: "food",
    title: { fr: "Banque alimentaire pour zones rurales", en: "Food bank for rural areas", ar: "بنك غذائي للمناطق الريفية" },
    description: {
      fr: "Projet a venir pour structurer une reserve logistique et mieux repondre aux urgences.",
      en: "Upcoming project to structure a logistics reserve and respond better to emergencies.",
      ar: "مشروع قادم لتنظيم احتياطي لوجستي وتحسين الاستجابة للطوارئ."
    },
    goalAmount: 7100000,
    collectedAmount: 0,
    coverImage: "/assets/logement.jpeg",
    status: "upcoming",
    location: { fr: "Plusieurs zones rurales", en: "Several rural areas", ar: "عدة مناطق ريفية" },
    beneficiaryLabel: { fr: "1 000 foyers cibles", en: "1,000 households targeted", ar: "1000 أسرة مستهدفة" },
    createdAt: "2026-09-11"
  }
];
