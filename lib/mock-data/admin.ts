export const mockAdminCredentials = {
  email: "admin@entraide-humanitaire.org",
  password: "Admin2026!"
} as const;

export const mockAdminDashboard = {
  kpis: [
    { label: "Total des dons", value: "12 450 000 FCFA", trend: "+12%", trendUp: true, icon: "donation" },
    { label: "Projets en cours", value: "15", trend: "+3", trendUp: true, icon: "projects" },
    { label: "Beneficiaires touches", value: "8 420", trend: "+1 240", trendUp: true, icon: "people" },
    { label: "Articles publies", value: "32", trend: "+5", trendUp: true, icon: "articles" }
  ],
  projectStats: {
    total: 15,
    ongoing: 7,
    completed: 5,
    upcoming: 3,
    totalFundingGoal: 52_400_000,
    totalFundingCollected: 32_150_000,
    byTheme: [
      { theme: "Eau / Forage", count: 3, color: "primary" },
      { theme: "Education", count: 3, color: "secondary" },
      { theme: "Sante", count: 3, color: "primary" },
      { theme: "Tabaski", count: 3, color: "secondary" },
      { theme: "Alimentaire", count: 3, color: "primary" }
    ]
  },
  alerts: [
    { title: "Page d'accueil", detail: "Le hero et la newsletter sont les zones les plus consultees.", tone: "warning" as const },
    { title: "Page A propos", detail: "La section fondateur necessite un vrai contenu.", tone: "neutral" as const },
    { title: "Galerie media", detail: "64 fichiers disponibles, pensez a organiser par projet.", tone: "success" as const }
  ],
  quickActions: [
    { title: "Editer l'accueil", detail: "Hero, CTA, mission, newsletter", href: "/dashboard/content/home" },
    { title: "Ajouter un projet", detail: "Creer une nouvelle fiche projet", href: "/dashboard/projects" },
    { title: "Publier un article", detail: "Rediger et publier dans le journal", href: "/dashboard/journal" },
    { title: "Gerer les medias", detail: "Images, videos et documents", href: "/dashboard/media" }
  ],
  recentActivity: [
    { title: "Hero homepage", detail: "Titre principal modifie", time: "Il y a 2 min" },
    { title: "Forage Nguekokh", detail: "Mise a jour de progression preparee", time: "Il y a 18 min" },
    { title: "Galerie mission Niger", detail: "2 nouvelles images ajoutees", time: "Il y a 42 min" },
    { title: "Page A propos", detail: "Texte de l'association ajuste", time: "Il y a 1 h" },
    { title: "Campagne Tabaski", detail: "Objectif de collecte mis a jour", time: "Il y a 3 h" }
  ],
  workflow: [
    { step: "1", title: "Choisir une page", text: "Accueil, A propos, Contact ou une collection (projets, journal, galerie)." },
    { step: "2", title: "Modifier le contenu", text: "Chaque champ est identifie clairement avec un apercu visuel." },
    { step: "3", title: "Verifier et publier", text: "L'apercu temps reel permet de valider le rendu avant mise en ligne." }
  ]
} as const;
