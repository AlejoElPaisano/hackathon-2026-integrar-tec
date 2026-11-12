import { describe, expect, it } from 'vitest';
import {
  calculateAsadoSettlement,
  formatArgentinePesos,
  buildWhatsAppOfficialNotice,
} from '../logic/asadoTaxEngine';
import { ASADO_PRESETS } from '../data/asadoPresets';

describe('calculateAsadoSettlement', () => {
  it('balances total fairAdjustedShares to 100% of totalPoolPesos and rewards the grill master while penalizing parasites', () => {
    const preset = ASADO_PRESETS[0];
    const report = calculateAsadoSettlement(preset.participants, '931-B/2026');

    expect(report.participantCount).toBe(5);
    expect(report.totalPoolPesos).toBe(92200);

    const sumAdjusted = report.rows.reduce((acc, r) => acc + r.fairAdjustedShare, 0);
    expect(sumAdjusted).toBe(report.totalPoolPesos);

    const grillMasterRow = report.rows.find((r) => r.participant.role === 'grill_master')!;
    const parasiteRow = report.rows.find((r) => r.participant.role === 'pure_parasite')!;

    // Grill master gets a significant discount vs equal share
    expect(grillMasterRow.fairAdjustedShare).toBeLessThan(report.equalSharePerPerson);
    expect(grillMasterRow.netBalance).toBeGreaterThan(0);

    // Parasite pays a significant ratoneo surcharge vs equal share
    expect(parasiteRow.fairAdjustedShare).toBeGreaterThan(report.equalSharePerPerson);
    expect(parasiteRow.netBalance).toBeLessThan(0);
    expect(report.transfers.length).toBeGreaterThan(0);
  });

  it('handles empty or zero-amount edge cases safely without NaN or crashes', () => {
    const emptyReport = calculateAsadoSettlement([]);
    expect(emptyReport.totalPoolPesos).toBe(0);
    expect(emptyReport.rows).toHaveLength(0);

    expect(formatArgentinePesos(48500)).toContain('48.500');
    const notice = buildWhatsAppOfficialNotice(
      calculateAsadoSettlement(ASADO_PRESETS[0].participants),
      ASADO_PRESETS[0].eventTitle,
      ASADO_PRESETS[0].paymentAlias
    );
    expect(notice).toContain('FORMULARIO OFICIAL 931-B');
    expect(notice).toContain('tucu.asador.mp');
  });

  it('assigns placeholder names (Comensal #N) when starting a blank table with empty names', () => {
    const blankReport = calculateAsadoSettlement([
      {
        id: 'b1',
        name: '',
        amountSpent: 20000,
        whatTheyBrought: '',
        role: 'grill_master',
        behaviors: [],
      },
      {
        id: 'b2',
        name: '   ',
        amountSpent: 0,
        whatTheyBrought: '',
        role: 'ice_bringer',
        behaviors: [],
      },
    ]);

    expect(blankReport.participantCount).toBe(2);
    expect(blankReport.rows[0].participant.name).toBe('Comensal #1');
    expect(blankReport.rows[1].participant.name).toBe('Comensal #2');
    expect(blankReport.totalPoolPesos).toBe(20000);
  });
});
