export const mockAdminCredentials = {
  email: "admin@entraide-humanitaire.org",
  password: "Admin2026!"
} as const;

export const mockAdminDashboard = {
  stats: [
    { label: "Total des dons", value: "12 450 000 FCFA", note: "simulation front" },
    { label: "Projets suivis", value: "15", note: "en cours, accomplis, a venir" },
    { label: "Articles publies", value: "8", note: "journal et mises a jour" },
    { label: "Medias disponibles", value: "64", note: "galerie et projets" }
  ],
  alerts: [
    { title: "Homepage", detail: "Le hero, le CTA principal et la newsletter sont les zones les plus consultees.", tone: "warning" },
    { title: "A propos", detail: "La section fondateur et les contenus de contexte demandent encore un vrai remplissage.", tone: "neutral" },
    { title: "Galerie", detail: "Des visuels existent deja, mais il faudra bientot une vraie bibliotheque media.", tone: "success" }
  ],
  quickActions: [
    { title: "Editer la homepage", detail: "Titre, CTA, image hero, mission, newsletter", href: "/dashboard/content/home" },
    { title: "Ouvrir le centre de contenu", detail: "Entrer page par page sans se perdre", href: "/dashboard/content" },
    { title: "Gerer les projets", detail: "Publier, modifier, archiver ou dupliquer", href: "/dashboard/projects" },
    { title: "Gerer le journal", detail: "Creer des articles et mises a jour terrain", href: "/dashboard/journal" }
  ],
  recentActivity: [
    { title: "Hero homepage", detail: "Titre principal modifie", time: "Il y a 2 min" },
    { title: "Projet forage Kaolack", detail: "Mise a jour preparee", time: "Il y a 18 min" },
    { title: "Galerie mission Niger", detail: "2 images ajoutees", time: "Il y a 42 min" },
    { title: "Page About", detail: "Texte association ajuste", time: "Il y a 1 h" }
  ],
  workflow: [
    { step: "1", title: "Choisir une page", text: "L'admin commence par Accueil, A propos, Contact ou une collection." },
    { step: "2", title: "Modifier le contenu", text: "Chaque champ est libelle clairement avec un apercu ou une aide." },
    { step: "3", title: "Verifier avant publication", text: "Le preview sert a valider le rendu avant le branchement Laravel." }
  ]
} as const;
