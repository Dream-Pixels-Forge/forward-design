export interface Project {
  id: string;
  title: string;
  category: "photo" | "design" | "impact";
  categoryLabel: string;
  description: string;
  image: string;
  impact?: string;
  year?: string;
}

export const projects: Project[] = [
  {
    id: "planification-familiale",
    title: "Planification Familiale — Bases Militaires",
    category: "impact",
    categoryLabel: "Impact Social",
    description:
      "Campagne de sensibilisation sur les bases militaires en RDC. Documenter l'importance de la planification familiale dans les communautés militaires.",
    image: "/hero_sequences/frame-001.webp",
    impact: "12 bases militaires touchées",
    year: "2022",
  },
  {
    id: "covid-sensibilisation",
    title: "COVID-19: Sensibilisation Communautaire",
    category: "impact",
    categoryLabel: "Impact Social",
    description:
      "Documentation visuelle de la réponse communautaire à Kinshasa pendant la pandémie. Images de solidarité et de résilience.",
    image: "/hero_sequences/frame-005.webp",
    impact: "Campagne nationale RDC",
    year: "2020",
  },
  {
    id: "visages-kinshasa",
    title: "Visages de Kinshasa",
    category: "photo",
    categoryLabel: "Photographie",
    description:
      "Série portraitiste capturant l'âme de la capitale congolaise. Chaque visage raconte une histoire de résilience, d'espoir et de dignité.",
    image: "/hero_sequences/frame-008.webp",
    year: "2023",
  },
  {
    id: "identite-visuelle",
    title: "Identité Visuelle — Marque Locale",
    category: "design",
    categoryLabel: "Design Graphique",
    description:
      "Création d'un système visuel complet pour une entreprise kinoise. Logo, charte graphique, supports de communication.",
    image: "/hero_sequences/frame-012.webp",
    year: "2023",
  },
  {
    id: "lumiere-ombre",
    title: "Lumière et Ombre",
    category: "photo",
    categoryLabel: "Photographie",
    description:
      "Exploration artistique du clair-obscur en milieu urbain. La lumière de Kinshasa sculptée par l'architecture.",
    image: "/hero_sequences/frame-015.webp",
    year: "2024",
  },
  {
    id: "affiches-sociales",
    title: "Affiches — Campagnes de Santé Publique",
    category: "design",
    categoryLabel: "Design Graphique",
    description:
      "Série d'affiches pour des campagnes de santé publique. Design percutant pour des messages qui sauvent des vies.",
    image: "/hero_sequences/frame-018.webp",
    year: "2021",
  },
  {
    id: "moments-quotidiens",
    title: "Moments Quotidiens",
    category: "photo",
    categoryLabel: "Photographie",
    description:
      "La beauté invisible du quotidien kinois. Ces instants suspendus qui révèlent la poésie de l'ordinaire.",
    image: "/hero_sequences/frame-020.webp",
    year: "2024",
  },
  {
    id: "enfance-avenir",
    title: "Enfance et Avenir",
    category: "impact",
    categoryLabel: "Impact Social",
    description:
      "Documentaire photo sur l'éducation dans les quartiers de Kinshasa. Les enfants d'aujourd'hui construisent le demain.",
    image: "/hero_sequences/frame-024.webp",
    impact: "Exposition à l'Institut Français",
    year: "2023",
  },
];

export const categories = [
  { id: "all", label: "Tout" },
  { id: "photo", label: "Photographie" },
  { id: "design", label: "Design Graphique" },
  { id: "impact", label: "Impact Social" },
];
