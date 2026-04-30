import type { GalleryItem } from "@/lib/types";

export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-1",
    title: {
      fr: "Programme éducation",
      en: "Education program",
      ar: "برنامج التعليم"
    },
    image: "/assets/education.jpeg",
    category: ["photos", "education"],
    type: "image"
  },
  {
    id: "gallery-2",
    title: {
      fr: "Consultation santé",
      en: "Health consultation",
      ar: "استشارة صحية"
    },
    image: "/assets/consultation.jpeg",
    category: ["photos", "sante"],
    type: "image"
  },
  {
    id: "gallery-3",
    title: {
      fr: "Accès à l'eau",
      en: "Water access",
      ar: "الوصول إلى الماء"
    },
    image: "/assets/puits.jpeg",
    category: ["photos", "eau"],
    type: "image"
  }
];
