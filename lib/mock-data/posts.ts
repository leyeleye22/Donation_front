import type { Post } from "@/lib/types";

export const posts: Post[] = [
  {
    id: "post-1",
    slug: "distribution-alimentaire-mbour",
    title: {
      fr: "Distribution alimentaire a Mbour",
      en: "Food distribution in Mbour",
      ar: "توزيع غذائي في امبور"
    },
    excerpt: {
      fr: "Une journee de mobilisation pour soutenir des familles vulnerables avec des kits alimentaires et un meilleur suivi des besoins.",
      en: "A mobilization day supporting vulnerable families with food kits and clearer needs tracking.",
      ar: "يوم تعبئة لدعم أسر هشة بحصص غذائية ومتابعة أوضح للاحتياجات."
    },
    content: {
      fr: "Une publication terrain orientee images, chiffres clefs et chronologie de l'action pour montrer ce qui a ete fait et ce qui reste a couvrir.",
      en: "A field story built around imagery, key figures, and the action timeline to show what was done and what remains.",
      ar: "منشور ميداني قائم على الصور والأرقام الأساسية وتسلسل التدخل لشرح ما تم وما بقي."
    },
    image: "/assets/alimentaire.jpeg",
    category: "terrain",
    location: {
      fr: "Mbour, Senegal",
      en: "Mbour, Senegal",
      ar: "امبور، السنغال"
    },
    readTime: "4 min",
    published: true,
    createdAt: "2026-04-29"
  },
  {
    id: "post-2",
    slug: "avancee-forage-kaolack",
    title: {
      fr: "Avancee du forage a Kaolack",
      en: "Drilling progress in Kaolack",
      ar: "تقدم مشروع الحفر في كاولاك"
    },
    excerpt: {
      fr: "Le suivi de chantier montre les etapes deja bouclees, les contraintes techniques et les prochaines interventions prevues.",
      en: "The site follow-up highlights completed steps, technical constraints, and the next planned interventions.",
      ar: "متابعة الورشة توضح المراحل المنجزة والتحديات التقنية والتدخلات القادمة."
    },
    content: {
      fr: "Une mise a jour de projet pensee pour aider le visiteur a comprendre le chantier, la progression et le besoin de soutien.",
      en: "A project update designed to help visitors understand the works, progress, and support need.",
      ar: "تحديث مشروع يساعد الزائر على فهم الأشغال والتقدم والحاجة إلى الدعم."
    },
    image: "/assets/puits.jpeg",
    category: "project-update",
    location: {
      fr: "Kaolack, Senegal",
      en: "Kaolack, Senegal",
      ar: "كاولاك، السنغال"
    },
    readTime: "5 min",
    published: true,
    createdAt: "2026-04-26"
  },
  {
    id: "post-3",
    slug: "coordination-sante-communautaire",
    title: {
      fr: "Coordination sante communautaire",
      en: "Community health coordination",
      ar: "تنسيق الصحة المجتمعية"
    },
    excerpt: {
      fr: "Des relais locaux renforcent la diffusion des informations utiles, l'orientation et la prevention de proximite.",
      en: "Local relays strengthen useful information sharing, orientation, and nearby prevention.",
      ar: "تعزز الروابط المحلية نشر المعلومات المفيدة والتوجيه والوقاية القريبة."
    },
    content: {
      fr: "Un format journal axe sur l'organisation, la coordination et la presence de terrain autour des actions de sante.",
      en: "A journal format focused on organization, coordination, and field presence around health actions.",
      ar: "صيغة تحريرية تركز على التنظيم والتنسيق والحضور الميداني حول أنشطة الصحة."
    },
    image: "/assets/consultation.jpeg",
    category: "association",
    location: {
      fr: "Dakar, Senegal",
      en: "Dakar, Senegal",
      ar: "داكار، السنغال"
    },
    readTime: "3 min",
    published: true,
    createdAt: "2026-04-23"
  },
  {
    id: "post-4",
    slug: "carnet-terrain-education-diourbel",
    title: {
      fr: "Carnet de terrain education a Diourbel",
      en: "Field notes on education in Diourbel",
      ar: "مذكرات ميدانية عن التعليم في ديوربل"
    },
    excerpt: {
      fr: "Une visite plus narrative pour montrer les besoins scolaires, les visages du terrain et les priorites d'accompagnement.",
      en: "A more narrative visit highlighting school needs, field faces, and support priorities.",
      ar: "زيارة سردية تظهر احتياجات المدرسة ووجوه الميدان وأولويات المواكبة."
    },
    content: {
      fr: "Une entree editoriale qui relie les images, les besoins scolaires et les pistes d'action autour de l'education.",
      en: "An editorial entry connecting imagery, school needs, and action paths around education.",
      ar: "مدخل تحريري يربط بين الصور والاحتياجات المدرسية ومسارات العمل حول التعليم."
    },
    image: "/assets/classe.jpeg",
    category: "terrain",
    location: {
      fr: "Diourbel, Senegal",
      en: "Diourbel, Senegal",
      ar: "ديوربل، السنغال"
    },
    readTime: "6 min",
    published: true,
    createdAt: "2026-04-20"
  },
  {
    id: "post-5",
    slug: "preparation-tabaski-solidaire",
    title: {
      fr: "Preparation de la Tabaski solidaire",
      en: "Preparing the Tabaski solidarity campaign",
      ar: "التحضير لحملة تضامن العيد"
    },
    excerpt: {
      fr: "Avant la campagne, l'association documente la preparation, les besoins logistiques et la priorisation des foyers a accompagner.",
      en: "Before the campaign, the organization documents preparation, logistics, and the prioritization of households to support.",
      ar: "قبل الحملة توثق الجمعية التحضير والاحتياجات اللوجستية وترتيب الأسر المستهدفة."
    },
    content: {
      fr: "Une mise a jour orientee campagne a venir, besoins, logistique et intention de soutien ciblee.",
      en: "An update focused on an upcoming campaign, needs, logistics, and targeted support intent.",
      ar: "تحديث يركز على حملة قادمة واحتياجاتها ولوجستياتها ونية الدعم الموجه."
    },
    image: "/assets/1.jpeg",
    category: "project-update",
    location: {
      fr: "Thies, Senegal",
      en: "Thies, Senegal",
      ar: "تييس، السنغال"
    },
    readTime: "4 min",
    published: true,
    createdAt: "2026-04-16"
  },
  {
    id: "post-6",
    slug: "partenariats-locaux-sante",
    title: {
      fr: "Partenariats locaux pour la sante",
      en: "Local partnerships for health",
      ar: "شراكات محلية من أجل الصحة"
    },
    excerpt: {
      fr: "Comment des relais et partenaires locaux aident a deployer des actions plus utiles, plus lisibles et plus proches des besoins.",
      en: "How local relays and partners help deploy actions that are more useful, clearer, and closer to needs.",
      ar: "كيف تساعد الروابط والشراكات المحلية على تنفيذ أنشطة أكثر فائدة ووضوحا وقربا من الاحتياجات."
    },
    content: {
      fr: "Une publication association pour parler coordination, partenaires, maillage local et efficacite du terrain.",
      en: "An association post about coordination, partners, local networks, and field effectiveness.",
      ar: "منشور مؤسسي حول التنسيق والشركاء والنسج المحلي وفعالية العمل الميداني."
    },
    image: "/assets/partenaire.jpeg",
    category: "association",
    location: {
      fr: "Saint-Louis, Senegal",
      en: "Saint-Louis, Senegal",
      ar: "سانت لويس، السنغال"
    },
    readTime: "5 min",
    published: true,
    createdAt: "2026-04-13"
  },
  {
    id: "post-7",
    slug: "mission-niger-suivi-communautaire",
    title: {
      fr: "Mission au Niger et suivi communautaire",
      en: "Mission in Niger and community follow-up",
      ar: "مهمة في النيجر ومتابعة مجتمعية"
    },
    excerpt: {
      fr: "Des images de terrain et un recit plus sobre pour expliquer comment les besoins sont identifies et priorises.",
      en: "Field images and a sober narrative to explain how needs are identified and prioritized.",
      ar: "صور ميدانية وسرد هادئ لشرح كيفية تحديد الاحتياجات وترتيبها."
    },
    content: {
      fr: "Un article terrain centre sur l'observation, les besoins et la lisibilite des priorites humanitaires dans un autre contexte geographique.",
      en: "A field article centered on observation, needs, and the clarity of humanitarian priorities in another geographic context.",
      ar: "مقال ميداني يركز على الملاحظة والاحتياجات ووضوح الأولويات الإنسانية في سياق جغرافي آخر."
    },
    image: "/assets/whats.jpeg",
    category: "terrain",
    location: {
      fr: "Niamey, Niger",
      en: "Niamey, Niger",
      ar: "نيامي، النيجر"
    },
    readTime: "5 min",
    published: true,
    createdAt: "2026-04-10"
  },
  {
    id: "post-8",
    slug: "ligne-editoriale-transparence-terrain",
    title: {
      fr: "Pourquoi montrer plus clairement le terrain",
      en: "Why show the field more clearly",
      ar: "لماذا يجب إظهار الميدان بشكل أوضح"
    },
    excerpt: {
      fr: "Une publication plus institutionnelle sur la transparence, les images, les mises a jour et la facon de raconter les actions.",
      en: "A more institutional post on transparency, images, updates, and the way actions are told.",
      ar: "منشور مؤسسي أكثر حول الشفافية والصور والتحديثات وطريقة سرد الأعمال."
    },
    content: {
      fr: "Une publication de cadrage qui explique pourquoi le journal, la galerie et les pages projet doivent fonctionner ensemble.",
      en: "A framing publication explaining why the journal, gallery, and project pages need to work together.",
      ar: "منشور تأطيري يشرح لماذا يجب أن تعمل المدونة والمعرض وصفحات المشاريع معا."
    },
    image: "/assets/about.jpeg",
    category: "association",
    location: {
      fr: "Dakar, Senegal",
      en: "Dakar, Senegal",
      ar: "داكار، السنغال"
    },
    readTime: "4 min",
    published: true,
    createdAt: "2026-04-07"
  }
];
