/**
 * ARCA-SADO (Agencia de Recaudación y Control del Asado)
 * Core Fiscal Settlement & Social Equity Engine
 *
 * Pure, deterministic TypeScript module designed for clarity and explainability.
 * All identifiers and comments are in English per repository rules;
 * all user-facing strings and tax concepts are in Argentine Spanish.
 */

export type AsadoRoleId =
  | 'grill_master'
  | 'house_host'
  | 'butcher_buyer'
  | 'fernet_sommelier'
  | 'ice_bringer'
  | 'pure_parasite';

export type BehaviorModifierId =
  | 'washed_dishes'
  | 'brought_picada'
  | 'left_before_cleaning'
  | 'complained_about_meat'
  | 'invited_unannounced';

export interface RoleDefinition {
  id: AsadoRoleId;
  label: string;
  shortTag: string;
  taxCode: string;
  /** Weight multiplier relative to base share (1.0 = normal share, <1.0 = discount, >1.0 = surcharge) */
  weightDelta: number;
  fiscalReason: string;
}

export interface BehaviorDefinition {
  id: BehaviorModifierId;
  label: string;
  type: 'merit' | 'infraction';
  /** Weight delta added to the participant's fiscal index */
  weightDelta: number;
  fiscalConcept: string;
}

export interface AsadoParticipant {
  id: string;
  name: string;
  amountSpent: number;
  whatTheyBrought: string;
  role: AsadoRoleId;
  behaviors: BehaviorModifierId[];
}

export interface ParticipantAuditRow {
  participant: AsadoParticipant;
  equalShareBase: number;
  rawWeightFactor: number;
  fairAdjustedShare: number;
  fiscalAdjustmentPesos: number;
  /** Positive = must receive money (A Cobrar); Negative = must pay money (A Transferir) */
  netBalance: number;
  fiscalCategory: string;
  statusBadge: 'creditor' | 'debtor' | 'settled';
  appliedConcepts: string[];
}

export interface TransferInstruction {
  fromName: string;
  toName: string;
  amount: number;
}

export interface AsadoSettlementReport {
  expedientNumber: string;
  totalPoolPesos: number;
  participantCount: number;
  equalSharePerPerson: number;
  totalRatoneoTaxCollected: number;
  rows: ParticipantAuditRow[];
  transfers: TransferInstruction[];
  chiefCollectorName: string;
}

export const ASADO_ROLES: Record<AsadoRoleId, RoleDefinition> = {
  grill_master: {
    id: 'grill_master',
    label: 'Asador Titular (Humo en los ojos)',
    shortTag: 'Asador Oficial',
    taxCode: 'BON-BRASA-01',
    weightDelta: -0.30,
    fiscalReason: 'Bonificación 30% por insalubridad térmica y olor a humo en el buzo',
  },
  house_host: {
    id: 'house_host',
    label: 'Puso la Sede / Quincho',
    shortTag: 'Puso la Casa',
    taxCode: 'BON-SEDE-02',
    weightDelta: -0.25,
    fiscalReason: 'Exención 25% por amortización de vajilla y grasa en el piso',
  },
  butcher_buyer: {
    id: 'butcher_buyer',
    label: 'Fue a la Carnicería y Verdulería',
    shortTag: 'Comprador Oficial',
    taxCode: 'BON-LOG-03',
    weightDelta: -0.10,
    fiscalReason: 'Descuento 10% por gestión logística y fila en la carnicería',
  },
  fernet_sommelier: {
    id: 'fernet_sommelier',
    label: 'Sommelier de Fernet / Picada',
    shortTag: 'Barra & Fernet',
    taxCode: 'REG-GENERAL-04',
    weightDelta: 0.0,
    fiscalReason: 'Alícuota estándar equilibrada (hidratación espiritual del grupo)',
  },
  ice_bringer: {
    id: 'ice_bringer',
    label: 'Cayó con 1 Bolsa de Hielo / Pan',
    shortTag: 'Aporte Mínimo',
    taxCode: 'PERC-HIELO-05',
    weightDelta: 0.22,
    fiscalReason: 'Percepción +22% por aporte simbólico de baja densidad calórica',
  },
  pure_parasite: {
    id: 'pure_parasite',
    label: 'Llegó para el Aplauso (Manos Vacías)',
    shortTag: 'Parásito VIP',
    taxCode: 'MULTA-GARCA-99',
    weightDelta: 0.42,
    fiscalReason: 'Impuesto Solidario al Ratoneo (+42%) por caer directo a comer servido',
  },
};

export const BEHAVIOR_MODIFIERS: Record<BehaviorModifierId, BehaviorDefinition> = {
  washed_dishes: {
    id: 'washed_dishes',
    label: 'Lavó platos y tabla con grasa',
    type: 'merit',
    weightDelta: -0.15,
    fiscalConcept: 'Crédito Fiscal por Higiene Post-Asado (-15%)',
  },
  brought_picada: {
    id: 'brought_picada',
    label: 'Salvó con salame y queso de previa',
    type: 'merit',
    weightDelta: -0.10,
    fiscalConcept: 'Deducción por Contención del Hambre Temprana (-10%)',
  },
  left_before_cleaning: {
    id: 'left_before_cleaning',
    label: 'Hizo bomba de humo antes de limpiar',
    type: 'infraction',
    weightDelta: 0.20,
    fiscalConcept: 'Recargo por Fuga Prematura de Sobremesa (+20%)',
  },
  complained_about_meat: {
    id: 'complained_about_meat',
    label: 'Criticó el punto de la carne sin asar',
    type: 'infraction',
    weightDelta: 0.18,
    fiscalConcept: 'Multa por Opinólogo de Parrilla Ajena (+18%)',
  },
  invited_unannounced: {
    id: 'invited_unannounced',
    label: 'Comió de la costilla y pidió tupper',
    type: 'infraction',
    weightDelta: 0.15,
    fiscalConcept: 'Tasa por Extracción de Sobras en Tupper (+15%)',
  },
};

/**
 * Classifies the participant's fiscal status using authentic Argentine humor
 */
function resolveFiscalCategory(rawWeightFactor: number, role: AsadoRoleId): string {
  if (role === 'grill_master' && rawWeightFactor <= 0.75) {
    return 'Héroe Nacional de la Parrilla (Exento VIP)';
  }
  if (rawWeightFactor <= 0.78) {
    return 'Pilar Fundamental del Quincho';
  }
  if (rawWeightFactor <= 1.05) {
    return 'Monotributista Parrillero Cumplidor';
  }
  if (rawWeightFactor <= 1.32) {
    return 'Contribuyente Bajo Observación por Ratoneo';
  }
  return 'Deudor Crónico — Intimación Inmediata';
}

/**
 * Main calculation engine:
 * 1. Sums total money spent across all participants.
 * 2. Computes each participant's effort/ratoneo weight factor (clamped to [0.35, 2.20]).
 * 3. Normalizes weights so the sum of all fairAdjustedShares equals 100% of totalPoolPesos.
 * 4. Computes exact transfers from debtors to creditors.
 */
export function calculateAsadoSettlement(
  participants: AsadoParticipant[],
  expedientSeed = '931-B/2026'
): AsadoSettlementReport {
  try {
    const safeParticipants = participants.filter((p) => p && p.name.trim().length > 0);

    if (safeParticipants.length === 0) {
      return {
        expedientNumber: `EXP-${expedientSeed}-000`,
        totalPoolPesos: 0,
        participantCount: 0,
        equalSharePerPerson: 0,
        totalRatoneoTaxCollected: 0,
        rows: [],
        transfers: [],
        chiefCollectorName: 'Sin Designar',
      };
    }

    const totalPoolPesos = safeParticipants.reduce(
      (sum, p) => sum + Math.max(0, Number(p.amountSpent) || 0),
      0
    );
    const participantCount = safeParticipants.length;
    const equalSharePerPerson = totalPoolPesos / participantCount;

    // Step 1: Compute unnormalized weight factors for each participant
    const preliminary = safeParticipants.map((p) => {
      const roleDef = ASADO_ROLES[p.role] ?? ASADO_ROLES.fernet_sommelier;
      let factor = 1.0 + roleDef.weightDelta;
      const appliedConcepts: string[] = [roleDef.fiscalReason];

      for (const bId of p.behaviors) {
        const mod = BEHAVIOR_MODIFIERS[bId];
        if (mod) {
          factor += mod.weightDelta;
          appliedConcepts.push(mod.fiscalConcept);
        }
      }

      // Clamp so nobody pays less than 35% of base share or more than 220%
      const clampedFactor = Math.min(2.2, Math.max(0.35, factor));
      return {
        participant: {
          ...p,
          amountSpent: Math.max(0, Number(p.amountSpent) || 0),
        },
        rawWeightFactor: clampedFactor,
        appliedConcepts,
      };
    });

    const totalWeightUnits = preliminary.reduce((acc, item) => acc + item.rawWeightFactor, 0);

    // Step 2: Normalize shares so the sum matches totalPoolPesos to the exact peso
    let runningShareSum = 0;
    const rows: ParticipantAuditRow[] = preliminary.map((item, idx) => {
      const isLast = idx === preliminary.length - 1;
      const exactShare =
        totalWeightUnits > 0
          ? Math.round((totalPoolPesos * item.rawWeightFactor) / totalWeightUnits)
          : Math.round(equalSharePerPerson);

      const fairAdjustedShare = isLast
        ? Math.max(0, Math.round(totalPoolPesos) - runningShareSum)
        : exactShare;

      runningShareSum += fairAdjustedShare;

      const equalShareRounded = Math.round(equalSharePerPerson);
      const fiscalAdjustmentPesos = fairAdjustedShare - equalShareRounded;
      const netBalance = Math.round(item.participant.amountSpent) - fairAdjustedShare;

      const statusBadge: ParticipantAuditRow['statusBadge'] =
        netBalance > 50 ? 'creditor' : netBalance < -50 ? 'debtor' : 'settled';

      return {
        participant: item.participant,
        equalShareBase: equalShareRounded,
        rawWeightFactor: item.rawWeightFactor,
        fairAdjustedShare,
        fiscalAdjustmentPesos,
        netBalance,
        fiscalCategory: resolveFiscalCategory(item.rawWeightFactor, item.participant.role),
        statusBadge,
        appliedConcepts: item.appliedConcepts,
      };
    });

    // Step 3: Total Ratoneo Surcharges redistributed to the heroes
    const totalRatoneoTaxCollected = rows
      .filter((r) => r.fiscalAdjustmentPesos > 0)
      .reduce((acc, r) => acc + r.fiscalAdjustmentPesos, 0);

    // Step 4: Match Debtors to Creditors with greedy settlement algorithm
    const creditors = rows
      .filter((r) => r.netBalance > 10)
      .map((r) => ({ name: r.participant.name, remaining: r.netBalance }))
      .sort((a, b) => b.remaining - a.remaining);

    const debtors = rows
      .filter((r) => r.netBalance < -10)
      .map((r) => ({ name: r.participant.name, owing: Math.abs(r.netBalance) }))
      .sort((a, b) => b.owing - a.owing);

    const transfers: TransferInstruction[] = [];
    let cIdx = 0;
    let dIdx = 0;

    while (cIdx < creditors.length && dIdx < debtors.length) {
      const creditor = creditors[cIdx];
      const debtor = debtors[dIdx];
      const settledAmount = Math.min(creditor.remaining, debtor.owing);

      if (settledAmount >= 10) {
        transfers.push({
          fromName: debtor.name,
          toName: creditor.name,
          amount: Math.round(settledAmount),
        });
      }

      creditor.remaining -= settledAmount;
      debtor.owing -= settledAmount;

      if (creditor.remaining <= 10) cIdx++;
      if (debtor.owing <= 10) dIdx++;
    }

    const topCreditor = [...rows].sort((a, b) => b.netBalance - a.netBalance)[0];
    const chiefCollectorName = topCreditor?.participant.name ?? safeParticipants[0].name;

    const hashDigits = Math.abs(Math.round(totalPoolPesos) % 8999) + 1000;

    return {
      expedientNumber: `ARCA-${expedientSeed}-${hashDigits}`,
      totalPoolPesos: Math.round(totalPoolPesos),
      participantCount,
      equalSharePerPerson: Math.round(equalSharePerPerson),
      totalRatoneoTaxCollected,
      rows,
      transfers,
      chiefCollectorName,
    };
  } catch {
    return {
      expedientNumber: 'ARCA-FALLBACK-931',
      totalPoolPesos: 0,
      participantCount: 0,
      equalSharePerPerson: 0,
      totalRatoneoTaxCollected: 0,
      rows: [],
      transfers: [],
      chiefCollectorName: 'Asador',
    };
  }
}

/**
 * Formats an amount in Argentine Pesos ($ 45.200)
 */
export function formatArgentinePesos(amount: number): string {
  const rounded = Math.round(Number(amount) || 0);
  const sign = rounded < 0 ? '-' : '';
  const absFormatted = Math.abs(rounded).toLocaleString('es-AR');
  return `${sign}$ ${absFormatted}`;
}

/**
 * Builds the official plain-text intimation message to paste directly into the WhatsApp group
 */
export function buildWhatsAppOfficialNotice(
  report: AsadoSettlementReport,
  eventTitle: string,
  paymentAlias: string
): string {
  const lines: string[] = [
    `🇦🇷 *ARCA-SADO | FORMULARIO OFICIAL 931-B*`,
    `📋 *Expediente:* ${report.expedientNumber}`,
    `🥩 *Operativo:* ${eventTitle}`,
    `💰 *Gasto Total Auditado:* ${formatArgentinePesos(report.totalPoolPesos)} (${report.participantCount} comensales)`,
    `⚖️ *Cuota Base Romana:* ${formatArgentinePesos(report.equalSharePerPerson)} c/u`,
    `🚨 *Impuesto al Ratoneo Redistribuido:* ${formatArgentinePesos(report.totalRatoneoTaxCollected)}`,
    ``,
    `*DETALLE DE LIQUIDACIÓN POR COMENSAL:*`,
  ];

  for (const row of report.rows) {
    const deltaSign = row.fiscalAdjustmentPesos > 0 ? '+' : '';
    const balanceText =
      row.netBalance > 50
        ? `COBRA ${formatArgentinePesos(row.netBalance)} ✅`
        : row.netBalance < -50
          ? `DEBE TRANSFERIR ${formatArgentinePesos(Math.abs(row.netBalance))} ❌`
          : `AL DÍA (SALDADO) 🤝`;

    lines.push(
      `• *${row.participant.name}* (${ASADO_ROLES[row.participant.role].shortTag}): Puso ${formatArgentinePesos(row.participant.amountSpent)} | Cuota Justa: ${formatArgentinePesos(row.fairAdjustedShare)} (${deltaSign}${formatArgentinePesos(row.fiscalAdjustmentPesos)}) 👉 *${balanceText}*`
    );
  }

  lines.push(``, `*ORDEN DE TRANSFERENCIA INMEDIATA:*`);
  if (report.transfers.length === 0) {
    lines.push(`• Cuentas saldadas sin transferencias pendientes.`);
  } else {
    for (const t of report.transfers) {
      lines.push(`👉 *${t.fromName}* transfiere *${formatArgentinePesos(t.amount)}* a *${t.toName}*`);
    }
  }

  lines.push(
    ``,
    `🏦 *Alias Oficial Recaudador:* \`${paymentAlias || 'el.tucu.parrilla.mp'}\``,
    `⚠️ *Fallo inapelable auditado bajo Ley de Solidaridad Parrillera N° 27.931.*`
  );

  return lines.join('\n');
}
