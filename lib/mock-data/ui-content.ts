export const siteChromeContent = {
  emergencyBanner: {
    ctaLabel: "Voir les mises a jour",
    productLabel: "Projets, journal et impact"
  },
  footer: {
    intro:
      "Une base front inspiree des meilleurs sites associatifs: mission lisible, projets visibles, journal editorial et transparence du terrain.",
    stats: [
      { value: "25", label: "projets" },
      { value: "4", label: "axes d'action" },
      { value: "2", label: "pays" },
      { value: "1000+", label: "beneficiaires" }
    ],
    transparencyTitle: "Transparence",
    transparencyText:
      "Le journal, les galeries et les pages projet servent ici de base de suivi avant l'integration Laravel.",
    copyright:
      "2026 Entr'aide Humanitaire. Front de demonstration base sur des contenus fictifs et des assets du projet."
  }
};

export const pageContent = {
  projects: {
    eyebrow: "Projets",
    title: "Des projets navigables, filtrables et deja presentables.",
    description:
      "Ici on simule un vrai catalogue de projets avec des cartes cliquables, des indicateurs visibles et une lecture plus produit.",
    allProjectsCta: "Voir tous les projets",
    openProjectCta: "Ouvrir la fiche projet",
    simulateDonationCta: "Simuler un don vers ce projet"
  },
  projectDetail: {
    eyebrow: "Fiche projet",
    updatesEyebrow: "Mises a jour projet",
    updatesTitle: "Un detail plus vivant, meme avant le back.",
    donationCta: "Simuler un don",
    updatesCta: "Lire les mises a jour"
  },
  about: {
    eyebrow: "A propos",
    title: "Une presentation plus forte, plus credible, plus utile.",
    description:
      "Cette page sert a poser la mission, la ligne editoriale et la promesse de transparence du site.",
    badge: "Mission et structure",
    statement: "Le site ne doit pas seulement paraitre beau. Il doit rassurer.",
    copy:
      "On construit ici un front qui aide a raconter les actions, a organiser les projets et a donner de la lisibilite aux publications avant de brancher Laravel."
  },
  gallery: {
    eyebrow: "Galerie",
    title: "Une galerie qui se filtre et se consulte vraiment.",
    description:
      "On utilise sans complexe les images du repo, y compris en duplication, pour valider la qualite du rendu et des parcours.",
    closeCta: "Fermer"
  },
  contact: {
    eyebrow: "Contact",
    title: "Une page contact qui ressemble deja a un vrai point d'entree.",
    description:
      "Meme sans backend, on peut valider le parcours, la clarte des infos et le feedback utilisateur.",
    formTitle: "Envoyer un message",
    successMessage:
      "Message simule envoye. Cette confirmation sert a valider le comportement front avant le branchement Laravel."
  }
} as const;
