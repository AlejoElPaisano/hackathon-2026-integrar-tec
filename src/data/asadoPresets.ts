import { AsadoParticipant } from '../logic/asadoTaxEngine';

export interface AsadoScenarioPreset {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  eventTitle: string;
  locationName: string;
  paymentAlias: string;
  participants: AsadoParticipant[];
}

export const ASADO_PRESETS: AsadoScenarioPreset[] = [
  {
    id: 'viernes-pibes',
    badge: 'Caso 1 · Clásico de Viernes',
    title: 'Asado de Viernes con los Pibes',
    subtitle: 'El Tucu compró todo el vacío, Mati puso el patio y Tincho cayó 23:15 con media bolsa de hielo.',
    eventTitle: 'Peña del Viernes — Vacío, Chori y Fernet',
    locationName: 'Quincho de Mati (Fondo con Parrilla)',
    paymentAlias: 'tucu.asador.mp',
    participants: [
      {
        id: 'p-1',
        name: 'El Tucu (Asador)',
        amountSpent: 48500,
        whatTheyBrought: '3.5kg Vacío, Chorizos, Morcilla y Carbón',
        role: 'grill_master',
        behaviors: ['brought_picada'],
      },
      {
        id: 'p-2',
        name: 'Mati (Dueño de Casa)',
        amountSpent: 14000,
        whatTheyBrought: 'Ensaladas, pan casero, servilletas y puso el quincho',
        role: 'house_host',
        behaviors: ['washed_dishes'],
      },
      {
        id: 'p-3',
        name: 'Cami (Capitana Fernet)',
        amountSpent: 26500,
        whatTheyBrought: '2 Branca de litro y 3 Cocas de vidrio bien frías',
        role: 'fernet_sommelier',
        behaviors: ['washed_dishes'],
      },
      {
        id: 'p-4',
        name: 'Nico "Hielito"',
        amountSpent: 3200,
        whatTheyBrought: '1 bolsa de hielo de estación de servicio (mitad agua)',
        role: 'ice_bringer',
        behaviors: ['complained_about_meat'],
      },
      {
        id: 'p-5',
        name: 'Tincho (El Fantasma)',
        amountSpent: 0,
        whatTheyBrought: 'Cayó 23:20 directo para el aplauso con hambre',
        role: 'pure_parasite',
        behaviors: ['left_before_cleaning', 'invited_unannounced'],
      },
    ],
  },
  {
    id: 'fin-parciales',
    badge: 'Caso 2 · Festejo Universitario',
    title: 'Festejo Post-Parcial en Terraza',
    subtitle: 'Se aprobó Análisis II: dos compraron todo en el súper y tres cayeron directo de la facu.',
    eventTitle: 'Asado de Supervivencia — Fin de Cursada',
    locationName: 'Terraza del Depto de Sofi',
    paymentAlias: 'sofi.terraza.bru',
    participants: [
      {
        id: 'u-1',
        name: 'Sofi (Anfitriona)',
        amountSpent: 19000,
        whatTheyBrought: 'Puso el depto, carbón, limones y ensalada mixta',
        role: 'house_host',
        behaviors: ['washed_dishes'],
      },
      {
        id: 'u-2',
        name: 'Juanchi (Parrillero)',
        amountSpent: 42000,
        whatTheyBrought: 'Tira de asado, bondiola, provoletas y pan flauta',
        role: 'grill_master',
        behaviors: ['brought_picada'],
      },
      {
        id: 'u-3',
        name: 'Luli (Logística)',
        amountSpent: 22000,
        whatTheyBrought: 'Vino malbec, gaseosas y helado de postre',
        role: 'butcher_buyer',
        behaviors: [],
      },
      {
        id: 'u-4',
        name: 'Fede (El Crítico)',
        amountSpent: 2500,
        whatTheyBrought: 'Un paquete de papas fritas abiertas en el bondi',
        role: 'ice_bringer',
        behaviors: ['complained_about_meat', 'left_before_cleaning'],
      },
    ],
  },
  {
    id: 'alerta-garca',
    badge: 'Caso 3 · Emergencia Impositiva',
    title: 'Operativo "Caza de Ratones"',
    subtitle: 'Un solo héroe bancó la carne y el fuego mientras tres comensales aplicaron tácticas de evasión.',
    eventTitle: 'Cumpleaños de Chicho — Auditoría de Emergencia',
    locationName: 'Club Social y Deportivo El Rescoldo',
    paymentAlias: 'chicho.parrilla.uala',
    participants: [
      {
        id: 'g-1',
        name: 'Chicho (Héroe Solitario)',
        amountSpent: 74000,
        whatTheyBrought: 'Costillar entero, achuras, bebida, leña y picada',
        role: 'grill_master',
        behaviors: ['brought_picada', 'washed_dishes'],
      },
      {
        id: 'g-2',
        name: 'Rama (Trajo el Hielo)',
        amountSpent: 4000,
        whatTheyBrought: 'Dos bolsas de hielo y media flauta de pan',
        role: 'ice_bringer',
        behaviors: [],
      },
      {
        id: 'g-3',
        name: 'Gonzalito (Evasor Serial)',
        amountSpent: 0,
        whatTheyBrought: '"Uh pensé que compraban todo y después dividíamos"',
        role: 'pure_parasite',
        behaviors: ['complained_about_meat', 'invited_unannounced'],
      },
      {
        id: 'g-4',
        name: 'El Primo (Bomba de Humo)',
        amountSpent: 0,
        whatTheyBrought: 'Comió tres choripanes, pidió tupper y se fue a dormir',
        role: 'pure_parasite',
        behaviors: ['left_before_cleaning', 'invited_unannounced'],
      },
    ],
  },
];
