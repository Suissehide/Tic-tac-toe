export interface SlotData {
  title: string
  soignant: string
  location?: string
  isIndividual: boolean
  startTime: string
  endTime: string
  weekCalendar: number // Semaine dans le calendrier
  dayOfWeek: number // 0=Lundi, 4=Vendredi
}

export const PATHWAYS = {
  C_ETP_AM_1: { name: 'Contenu ETP AM 1', color: '#90EE90' }, // Vert clair (matin)
  C_ETP_PM_1: { name: 'Contenu ETP PM 1', color: '#5FCF5F' }, // Vert moyen (après-midi)
  C_ETP_AM_2: { name: 'Contenu ETP AM 2', color: '#87CEEB' }, // Bleu ciel (matin)
  C_ETP_PM_2: { name: 'Contenu ETP PM 2', color: '#5FA8D3' }, // Bleu moyen (après-midi)
  C_ETP_AM_3: { name: 'Contenu ETP AM 3', color: '#DDA0DD' }, // Prune clair (matin)
  C_ETP_PM_3: { name: 'Contenu ETP PM 3', color: '#C77FC7' }, // Prune moyen (après-midi)

  AC: { name: 'Ateliers à la carte', color: '#FFFF00' }, // Jaune
  C_ETP_SA: { name: 'Contenu ETP sans réadaptation', color: '#FFD700' }, // Or
  T2: { name: 'Parcours T1', color: '#FF8C00' }, // Orange dark
  T1: { name: 'Parcours T2', color: '#FF6347' }, // Tomate
}

// Map soignant names from slot data to index in SOIGNANTS array
export const SOIGNANT_MAP: Record<string, number> = {
  Medecin: 0,
  IDE: 1,
  'IDE SSR': 2,
  'IDE Educ1': 3,
  'IDE Educ2': 4,
  'IDE Educ3': 5,
  Psychologue: 6,
  Pharmacienne: 7,
  AS: 8, // Aide-soignante
  Dieteticienne: 9,
  Kine1: 10,
  Kine2: 11,
  APA: 12,
  SSR: 13,
}

export const PATHWAY_DATA: Record<string, SlotData[]> = {
  // ==========================================================================
  // PARCOURS Contenu ETP 1 - MATIN
  // ==========================================================================
  C_ETP_AM_1: [
    // SEMAINE 1
    // Lundi (jour 0)
    {
      title: 'Intro',
      soignant: 'AS',
      location: 'ens',
      isIndividual: false,
      startTime: '08:30',
      endTime: '09:45',
      weekCalendar: 1,
      dayOfWeek: 0,
    },
    {
      title: 'AP + Vélo',
      soignant: 'Kine1',
      location: 'ens',
      isIndividual: false,
      startTime: '09:45',
      endTime: '11:00',
      weekCalendar: 1,
      dayOfWeek: 0,
    },

    // Mardi (jour 1)
    {
      title: 'AP + Vélo',
      soignant: 'APA',
      location: 'ens',
      isIndividual: false,
      startTime: '08:30',
      endTime: '09:45',
      weekCalendar: 1,
      dayOfWeek: 1,
    },
    {
      title: 'AP + Vélo',
      soignant: 'Kine1',
      location: 'ens',
      isIndividual: false,
      startTime: '09:45',
      endTime: '11:00',
      weekCalendar: 1,
      dayOfWeek: 1,
    },

    // Mercredi (jour 2)
    {
      title: 'Intro',
      soignant: 'AS',
      location: 'ens',
      isIndividual: false,
      startTime: '08:30',
      endTime: '09:45',
      weekCalendar: 1,
      dayOfWeek: 2,
    },
    {
      title: 'AP + Vélo',
      soignant: 'Kine1',
      isIndividual: false,
      startTime: '09:45',
      endTime: '11:00',
      weekCalendar: 1,
      dayOfWeek: 2,
    },

    // Jeudi (jour 3)
    {
      title: 'Intro',
      soignant: 'AS',
      location: 'ens',
      isIndividual: false,
      startTime: '08:30',
      endTime: '09:45',
      weekCalendar: 1,
      dayOfWeek: 3,
    },
    {
      title: 'AP + Vélo',
      soignant: 'Kine1',
      isIndividual: false,
      startTime: '09:45',
      endTime: '11:00',
      weekCalendar: 1,
      dayOfWeek: 3,
    },

    // Vendredi (jour 4)
    {
      title: 'Intro',
      soignant: 'AS',
      location: 'ens',
      isIndividual: false,
      startTime: '08:30',
      endTime: '09:45',
      weekCalendar: 1,
      dayOfWeek: 4,
    },
    {
      title: 'AP + Vélo',
      soignant: 'Kine1',
      isIndividual: false,
      startTime: '09:45',
      endTime: '11:00',
      weekCalendar: 1,
      dayOfWeek: 4,
    },

    // SEMAINE 2
    // Lundi

    // Mardi

    // Mercredi

    // Jeudi

    // Vendredi

    // SEMAINE 3
    // Lundi

    // Mardi

    // Mercredi

    // Jeudi

    // Vendredi

    // SEMAINE 4
    // Lundi

    // Mardi

    // Mercredi

    // Jeudi

    // Vendredi

    // SEMAINE 5
    // Lundi

    // Mardi

    // Mercredi

    // Jeudi

    // Vendredi

    // SEMAINE 6
    // Lundi

    // Mardi

    // Mercredi

    // Jeudi

    // Vendredi
  ],

  // ==========================================================================
  // PARCOURS Contenu ETP 1 - APRÈS-MIDI
  // ==========================================================================
  C_ETP_PM_1: [
    // SEMAINE 1
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
    // SEMAINE 2
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
    // SEMAINE 3
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
    // SEMAINE 4
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
    // SEMAINE 5
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
    // SEMAINE 6
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
  ],

  // ==========================================================================
  // PARCOURS Contenu ETP 2 - MATIN (Structure similaire à G1, à extraire du PPT)
  // ==========================================================================
  C_ETP_AM_2: [
    // SEMAINE 1
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
    // SEMAINE 2
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
    // SEMAINE 3
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
    // SEMAINE 4
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
    // SEMAINE 5
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
    // SEMAINE 6
    // Lundi
    // Mardi
    // Mercredi
    // Jeudi
    // Vendredi
  ],

  // ==========================================================================
  // PARCOURS Contenu ETP 2 - APRÈS-MIDI
  // ==========================================================================
  C_ETP_PM_2: [],

  // ==========================================================================
  // PARCOURS Contenu ETP 3 - MATIN
  // ==========================================================================
  C_ETP_AM_3: [],

  // ==========================================================================
  // PARCOURS Contenu ETP 3 - APRÈS-MIDI
  // ==========================================================================
  C_ETP_PM_3: [],

  // ==========================================================================
  // PARCOURS Contenu ETP 3 - APRÈS-MIDI
  // ==========================================================================
  AC: [
    // SEMAINE 1
    // Lundi (jour 0)
    {
      title: 'Atelier Cuisine',
      soignant: 'Dieteticienne',
      location: 'therapeutic-kitchen',
      isIndividual: false,
      startTime: '11:00',
      endTime: '15:00',
      weekCalendar: 1,
      dayOfWeek: 0,
    },
  ],
}
