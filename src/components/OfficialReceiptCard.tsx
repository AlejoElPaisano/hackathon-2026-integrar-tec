import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  Award,
  Check,
  Copy,
  FileCheck2,
  Flame,
  Megaphone,
  Printer,
  Scale,
  ShieldAlert,
  Sparkles,
  Stamp,
  X,
} from 'lucide-react';
import {
  ASADO_ROLES,
  AsadoSettlementReport,
  FISCAL_RIGOR_MODES,
  ParticipantAuditRow,
  buildWhatsAppOfficialNotice,
  formatArgentinePesos,
} from '../logic/asadoTaxEngine';
import {
  FileteadoCorner,
  FiscalMatrixQrSvg,
  SolDeMayoIcon,
  playRubberStampSound,
} from './ArgentineCulturalAssets';

interface OfficialReceiptCardProps {
  report: AsadoSettlementReport;
  eventTitle: string;
  locationName: string;
  paymentAlias: string;
  selectedParticipantId?: string | null;
  lastChangedParticipantId?: string | null;
  sealStatus?: 'unsealed' | 'sealed' | 'stale';
  onSelectParticipant?: (id: string) => void;
  onSealReceipt?: () => void;
}

export const OfficialReceiptCard: React.FC<OfficialReceiptCardProps> = ({
  report,
  eventTitle,
  locationName,
  paymentAlias,
  selectedParticipantId = null,
  lastChangedParticipantId = null,
  sealStatus = 'sealed',
  onSelectParticipant,
  onSealReceipt,
}) => {
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [stampAnimationKey, setStampAnimationKey] = useState(1);
  const [selectedDebtorEscrache, setSelectedDebtorEscrache] =
    useState<ParticipantAuditRow | null>(null);
  const [copiedEscrache, setCopiedEscrache] = useState(false);
  const [copiedTransferIdx, setCopiedTransferIdx] = useState<number | null>(null);
  const [sealedAtTime, setSealedAtTime] = useState<string>(() =>
    new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
  const [showQrCertificate, setShowQrCertificate] = useState(false);

  const rigorInfo = FISCAL_RIGOR_MODES[report.rigorMode];

  const handleCopyWhatsApp = async () => {
    const notice = buildWhatsAppOfficialNotice(report, eventTitle, paymentAlias);
    try {
      await navigator.clipboard.writeText(notice);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = notice;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2600);
  };

  const handleCopySingleEscrache = async (row: ParticipantAuditRow) => {
    const text = [
      `🚨 *CÉDULA DE INTIMACIÓN PARRILLERA — ARCA-SADO* 🚨`,
      `📋 Expediente: ${report.expedientNumber}`,
      `👤 *Contribuyente Intimado:* ${row.participant.name}`,
      `🏷️ *Categoría Fiscal:* ${row.fiscalCategory}`,
      `🥩 *Operativo:* ${eventTitle}`,
      `💸 *Puso en la mesa:* ${formatArgentinePesos(row.participant.amountSpent)} (${row.participant.whatTheyBrought})`,
      `⚖️ *Recargo por Ratoneo Aplicado:* +${formatArgentinePesos(Math.max(0, row.fiscalAdjustmentPesos))}`,
      `👉 *TOTAL INAPELABLE A TRANSFERIR YA:* ${formatArgentinePesos(Math.abs(row.netBalance))}`,
      `🏦 *Alias Oficial:* \`${paymentAlias || 'tucu.asador.mp'}\``,
      `⚠️ *Si no transfiere antes de las 23:59 hs, en el próximo asado toma agua de la canilla.*`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore fallback
    }
    setCopiedEscrache(true);
    setTimeout(() => setCopiedEscrache(false), 2400);
  };

  const handleTriggerStamp = () => {
    playRubberStampSound();
    setStampAnimationKey((prev) => prev + 1);
    setSealedAtTime(
      new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
    onSealReceipt?.();
    try {
      confetti({
        particleCount: 55,
        spread: 68,
        origin: { y: 0.68 },
        colors: ['#3898d4', '#ffffff', '#eab308', '#3898d4'],
      });
    } catch {
      // Ignore confetti errors in headless environments
    }
  };

  const handleCopySingleTransfer = async (
    fromName: string,
    toName: string,
    amount: number,
    idx: number
  ) => {
    const alias = paymentAlias || 'tucu.asador.mp';
    const text = `🥩 *INTIMACIÓN DE PAGO ARCA-SADO (${report.expedientNumber})*: Che *${fromName}*, según el Formulario Oficial 931-B te toca transferirle *${formatArgentinePesos(amount)}* a *${toName}*. Alias CBU: \`${alias}\` ¡Transferí antes de las 23:59 hs!`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore fallback
    }
    setCopiedTransferIdx(idx);
    setTimeout(() => setCopiedTransferIdx(null), 2200);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Identify Grill Master for signature and savings highlight
  const grillMasterRow =
    report.rows.find((r) => r.participant.role === 'grill_master') ?? report.rows[0];
  const heroSavingsPesos = grillMasterRow
    ? Math.max(0, -grillMasterRow.fiscalAdjustmentPesos)
    : 0;

  return (
    <section
      aria-label="Comprobante Oficial Formulario 931-B"
      className="fiscal-paper-surface rounded-2xl border-2 border-[#b89f78] p-5 sm:p-7 relative overflow-hidden transition-all"
    >
      {/* Fileteado Porteño Ornamental Corners */}
      <FileteadoCorner className="w-8 h-8 text-[#8c6747] absolute top-3 left-3 pointer-events-none opacity-80" />
      <FileteadoCorner className="w-8 h-8 text-[#8c6747] absolute top-3 right-3 rotate-90 pointer-events-none opacity-80" />

      {/* Argentine Flag Ribbon with Sol de Mayo */}
      <div className="flex items-center h-3 -mx-7 -mt-7 mb-5 border-b border-[#1c1613]/20 overflow-hidden">
        <div className="flex-1 h-full bg-[#3898d4]" />
        <div className="flex-1 h-full bg-[#fcf7eb] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#eab308]" />
        </div>
        <div className="flex-1 h-full bg-[#3898d4]" />
      </div>

      {/* Official Argentine Ministry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1c1613] pb-4">
        <div className="flex items-start gap-3">
          <SolDeMayoIcon className="w-12 h-12 shrink-0 mt-0.5" />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1c1613] text-[#fcf7eb] text-[10px] font-mono-fiscal font-bold tracking-wider uppercase mb-1">
              <Scale className="w-3 h-3 text-[#eab308]" />
              INGREDIENTE IMPROBABLE · COMPROBANTE OFICIAL
            </div>
            <h2 className="font-serif-official text-3xl sm:text-4xl leading-none tracking-tight text-[#1c1613] font-normal">
              REPÚBLICA PARRILLERA ARGENTINA
            </h2>
            <p className="text-xs font-extrabold tracking-wide text-[#5c4938] mt-1 uppercase">
              ARCA-SADO · Ministerio de Brasa, Achuras y Justicia Social · Ley 27.931
            </p>
          </div>
        </div>

        <div className="sm:text-right font-mono-fiscal bg-[#f2e4c6] border-2 border-[#1c1613] rounded-xl px-3.5 py-2 shrink-0 shadow-xs">
          <div className="text-[10px] font-extrabold uppercase text-[#6e5641]">
            FORMULARIO OFICIAL 931-B
          </div>
          <div className="text-sm sm:text-base font-extrabold text-[#1c1613]">
            {report.expedientNumber}
          </div>
          <div className="text-[10px] font-bold text-[#a81c24]">{rigorInfo.badgeText}</div>
          <div className="text-[10px] text-[#5c4938]">Fecha: {currentDateStr}</div>
        </div>
      </div>

      {/* Romana vs Justicia Criolla Savings Callout Banner */}
      {heroSavingsPesos > 0 && grillMasterRow && (
        <div className="mt-3.5 bg-[#e6f4ea] border-2 border-[#15803d] rounded-xl px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-[#14532d]">
            <Award className="w-5 h-5 text-[#15803d] shrink-0" />
            <span>
              <strong>¡Justicia para el que se fumó el humo!</strong> Si dividían &ldquo;a la romana&rdquo; cada uno pagaba{' '}
              <strong className="font-mono-fiscal">{formatArgentinePesos(report.equalSharePerPerson)}</strong>.
            </span>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#15803d] text-white font-mono-fiscal font-extrabold text-xs shrink-0">
            {grillMasterRow.participant.name} ahorra {formatArgentinePesos(heroSavingsPesos)}
          </span>
        </div>
      )}

      {/* Metadata Strip: Event, Quincho & Total Pool */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3.5 border-b border-dashed border-[#1c1613]/40 text-xs">
        <div>
          <span className="uppercase font-extrabold text-[#6e5641] block text-[10px]">
            Operativo Gastronómico
          </span>
          <strong className="text-sm text-[#1c1613] font-extrabold block truncate">
            {eventTitle || 'Asado Oficial'}
          </strong>
          <span className="text-[#5c4938] text-[11px]">📍 {locationName}</span>
        </div>

        <div className="sm:border-l sm:border-[#1c1613]/20 sm:pl-3">
          <span className="uppercase font-extrabold text-[#6e5641] block text-[10px]">
            Ticket Total de la Mesa
          </span>
          <strong className="font-mono-fiscal text-lg font-extrabold text-[#1c1613]">
            {formatArgentinePesos(report.totalPoolPesos)}
          </strong>
          <span className="block text-[11px] text-[#5c4938]">
            Romana Clásica: {formatArgentinePesos(report.equalSharePerPerson)} c/u
          </span>
        </div>

        <div className="sm:border-l sm:border-[#1c1613]/20 sm:pl-3 bg-[#a81c24]/10 border border-[#a81c24]/30 rounded-lg p-2">
          <span className="uppercase font-extrabold text-[#a81c24] flex items-center gap-1 text-[10px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            Multa al Ratoneo Recaudada
          </span>
          <strong className="font-mono-fiscal text-lg font-extrabold text-[#a81c24]">
            {formatArgentinePesos(report.totalRatoneoTaxCollected)}
          </strong>
          <span className="block text-[10px] font-semibold text-[#6b1d21]">
            Transferido a quienes pusieron el lomo
          </span>
        </div>
      </div>

      {/* Itemized Fiscal Table per Participant */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1c1613]">
            I. Padrón de Comensales y Liquidación ({report.participantCount} declarados)
          </h3>
          <span className="text-[11px] font-mono-fiscal text-[#6e5641]">
            Toque &ldquo;Escrachar&rdquo; en un deudor para emitir su cédula
          </span>
        </div>

        <div className="border-2 border-[#1c1613] rounded-xl bg-[#fffdf7] overflow-hidden divide-y divide-[#1c1613]/20">
          {report.rows.map((row) => {
            const roleInfo = ASADO_ROLES[row.participant.role];
            const isDiscount = row.fiscalAdjustmentPesos < -10;
            const isPenalty = row.fiscalAdjustmentPesos > 10;
            const isSelected = selectedParticipantId === row.participant.id;
            const isRecentlyChanged =
              lastChangedParticipantId === row.participant.id;

            return (
              <div
                key={row.participant.id}
                onClick={() => onSelectParticipant?.(row.participant.id)}
                className={`p-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#f8e7b5] ring-2 ring-inset ring-[#a81c24]/70'
                    : 'hover:bg-[#f6ecd6]'
                } ${isRecentlyChanged ? 'animate-receipt-row-flash' : ''}`}
              >
                {/* Top Row: Name + Role Tag on Left | Verdict Badge + Escrache Action on Right */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-[#1c1613] text-sm flex flex-wrap items-center gap-1.5">
                      {isSelected && (
                        <span
                          title="Sospechoso bajo inspección"
                          className="inline-block w-2.5 h-2.5 rounded-full bg-[#a81c24] shrink-0"
                        />
                      )}
                      <span>
                        {row.participant.name ||
                          `Comensal #${report.rows.indexOf(row) + 1}`}
                      </span>
                      <span className="text-[10px] font-mono-fiscal font-bold px-2 py-0.5 rounded bg-[#3898d4]/20 text-[#124e78] border border-[#3898d4]/40">
                        {roleInfo.shortTag}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-[#7c5836] mt-0.5">
                      {row.fiscalCategory}
                    </div>
                  </div>

                  {/* Verdict Pill */}
                  <div className="flex items-center gap-1.5 shrink-0 font-mono-fiscal font-extrabold">
                    {row.statusBadge === 'creditor' && (
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#15803d] text-white text-xs shadow-2xs whitespace-nowrap">
                        COBRA {formatArgentinePesos(row.netBalance)}
                      </span>
                    )}
                    {row.statusBadge === 'debtor' && (
                      <>
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-[#a81c24] text-white text-xs shadow-2xs whitespace-nowrap">
                          PAGA {formatArgentinePesos(Math.abs(row.netBalance))}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDebtorEscrache(row);
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-sans font-extrabold px-2 py-1 rounded-lg bg-[#eab308]/35 hover:bg-[#eab308]/65 text-[#1c1613] border border-[#1c1613]/40 cursor-pointer transition-colors no-print whitespace-nowrap"
                        >
                          <Megaphone className="w-3 h-3 text-[#a81c24]" />
                          Emitir Cédula
                        </button>
                      </>
                    )}
                    {row.statusBadge === 'settled' && (
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-[#1c1613]/15 text-[#1c1613] text-xs whitespace-nowrap">
                        AL DÍA
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Row: Compact 3-Column Accounting Strip */}
                <div className="mt-2 grid grid-cols-3 gap-2 bg-[#f4ead2]/90 border border-[#1c1613]/20 rounded-lg px-2.5 py-1.5 font-mono-fiscal text-xs">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-[#6e5641]">
                      Puso en mesa
                    </span>
                    <strong className="text-[#1c1613] font-extrabold whitespace-nowrap">
                      {formatArgentinePesos(row.participant.amountSpent)}
                    </strong>
                  </div>

                  <div className="border-l border-[#1c1613]/15 pl-2">
                    <span className="block text-[9px] uppercase font-bold text-[#6e5641]">
                      Premio / Multa
                    </span>
                    {isDiscount && (
                      <strong className="text-[#166534] font-extrabold whitespace-nowrap">
                        {formatArgentinePesos(row.fiscalAdjustmentPesos)}
                      </strong>
                    )}
                    {isPenalty && (
                      <strong className="text-[#a81c24] font-extrabold whitespace-nowrap">
                        +{formatArgentinePesos(row.fiscalAdjustmentPesos)}
                      </strong>
                    )}
                    {!isDiscount && !isPenalty && (
                      <strong className="text-[#6e5641] font-bold whitespace-nowrap">
                        $0
                      </strong>
                    )}
                  </div>

                  <div className="border-l border-[#1c1613]/15 pl-2">
                    <span className="block text-[9px] uppercase font-bold text-[#6e5641]">
                      Cuota Justa
                    </span>
                    <strong className="text-[#1c1613] font-extrabold whitespace-nowrap">
                      {formatArgentinePesos(row.fairAdjustedShare)}
                    </strong>
                  </div>
                </div>

                {/* Bottom Row: Concise Fiscal Justification */}
                <div className="mt-1.5 text-[11px] text-[#5c4938] leading-snug">
                  <span className="font-bold text-[#4a3a2c]">Concepto: </span>
                  {row.appliedConcepts.join(' · ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Debtor Escrache Card (When selected) */}
      {selectedDebtorEscrache && (
        <div className="mt-4 bg-[#fff5f5] border-2 border-[#a81c24] rounded-xl p-4 relative shadow-md no-print">
          <button
            type="button"
            onClick={() => setSelectedDebtorEscrache(null)}
            className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-[#a81c24]/10 hover:bg-[#a81c24]/20 text-[#a81c24] cursor-pointer"
            title="Cerrar Cédula"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-mono-fiscal font-extrabold uppercase text-[#a81c24] mb-1">
            <AlertTriangle className="w-4 h-4" />
            CÉDULA DE INTIMACIÓN INDIVIDUAL · VERAZ PARRILLERO
          </div>
          <p className="text-sm font-extrabold text-[#1c1613]">
            Se intima a <span className="underline">{selectedDebtorEscrache.participant.name}</span> ({selectedDebtorEscrache.fiscalCategory}) a abonar en el acto la suma de{' '}
            <span className="font-mono-fiscal text-[#a81c24] text-base">
              {formatArgentinePesos(Math.abs(selectedDebtorEscrache.netBalance))}
            </span>{' '}
            al alias <code className="bg-[#1c1613] text-white px-1.5 py-0.5 rounded">{paymentAlias}</code>.
          </p>
          <p className="text-xs text-[#5c4938] mt-1">
            Motivo del expediente: Declaró aportar <em>&ldquo;{selectedDebtorEscrache.participant.whatTheyBrought}&rdquo;</em> ({formatArgentinePesos(selectedDebtorEscrache.participant.amountSpent)}).
          </p>
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => handleCopySingleEscrache(selectedDebtorEscrache)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#a81c24] hover:bg-[#8b161d] text-white text-xs font-bold cursor-pointer"
            >
              {copiedEscrache ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  ¡Cédula de {selectedDebtorEscrache.participant.name} copiada!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar escrache individual para WhatsApp
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mandatory Transfers, Real Scannable QR & Official Rubber Stamp */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#f2e4c6] border-2 border-[#1c1613] rounded-xl p-4 relative">
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1c1613]">
            <Flame className="w-4 h-4 text-[#ea580c]" />
            II. Orden de Transferencia Bancaria / Mercado Pago
          </div>

          {report.transfers.length === 0 ? (
            <p className="text-xs text-[#4a3a2c] font-semibold">
              Cuentas en paz: ningún comensal registra deuda parrillera.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {report.transfers.map((tr, idx) => (
                <li
                  key={`${tr.fromName}-${tr.toName}-${idx}`}
                  className="flex items-center justify-between gap-2 bg-[#fcf7eb] border border-[#1c1613]/30 rounded-lg px-3 py-2 text-xs font-mono-fiscal"
                >
                  <span className="min-w-0 flex-1 leading-snug">
                    <strong className="text-[#a81c24]">{tr.fromName}</strong>
                    <span className="text-[#6e5641] mx-1">→</span>
                    <strong className="text-[#15803d]">{tr.toName}</strong>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-extrabold text-sm text-[#1c1613] bg-[#f2e4c6] border border-[#1c1613]/25 px-2 py-0.5 rounded whitespace-nowrap">
                      {formatArgentinePesos(tr.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopySingleTransfer(
                          tr.fromName,
                          tr.toName,
                          tr.amount,
                          idx
                        )
                      }
                      title={`Copiar cobro para ${tr.fromName}`}
                      className="px-2 py-1 rounded bg-[#1c1613] hover:bg-[#38261e] text-[#fcf7eb] text-[10px] font-sans font-bold cursor-pointer transition-colors inline-flex items-center gap-1 no-print whitespace-nowrap"
                    >
                      {copiedTransferIdx === idx ? (
                        <>
                          <Check className="w-3 h-3 text-[#4ade80]" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#eab308]" />
                          Cobrar
                        </>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="font-bold text-[#5c4938]">Alias CBU Oficial: </span>
              <code className="font-mono-fiscal font-extrabold bg-[#1c1613] text-[#fcf7eb] px-2.5 py-0.5 rounded">
                {paymentAlias || 'tucu.asador.mp'}
              </code>
            </div>
            <div className="font-serif-official italic text-sm text-[#4a3a2c]">
              Firma Juez de Brasas: <strong className="underline">{grillMasterRow?.participant.name || 'El Asador'}</strong>
            </div>
          </div>
        </div>

        {/* Interactive Official Rubber Stamp & Dynamic SVG QR */}
        <div className="md:col-span-5 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l-2 border-dashed border-[#1c1613]/30 pt-3 md:pt-0 md:pl-4">
          <button
            key={stampAnimationKey}
            type="button"
            onClick={handleTriggerStamp}
            title="Hacé clic para sellar el acta con sonido de oficina pública y aplauso"
            className={`official-rubber-stamp px-3 py-2 rounded-md text-center cursor-pointer hover:scale-105 transition-transform mb-2.5 ${
              sealStatus === 'sealed'
                ? 'bg-[#fcf7eb]/90 opacity-100'
                : 'bg-[#fff5f5]/90 opacity-75 border-dashed'
            }`}
          >
            <div className="text-[9px] font-mono-fiscal font-extrabold">
              REPÚBLICA DEL ASADO · LEY 27.931
            </div>
            <div className="text-sm font-extrabold tracking-widest">
              {sealStatus === 'sealed'
                ? 'AUDITADO POR EL ASADOR'
                : sealStatus === 'stale'
                  ? 'RECTIFICATIVA · VOLVER A SELLAR'
                  : 'PENDIENTE DE SELLO OFICIAL'}
            </div>
            <div className="text-[9px] font-mono-fiscal font-bold">
              {sealStatus === 'sealed'
                ? `SELLADO HOY ${sealedAtTime} HS · PROHIBIDO LLORAR`
                : 'CLIC AQUÍ PARA ESTAMPAR EL SELLO'}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setShowQrCertificate((prev) => !prev)}
            title="Ver Certificado Digital de Autenticidad del QR"
            className="flex items-center gap-2.5 text-left text-[10px] font-mono-fiscal text-[#4a3a2c] hover:bg-[#fcf7eb]/80 p-1.5 rounded-lg border border-transparent hover:border-[#1c1613]/25 cursor-pointer transition-all"
          >
            <FiscalMatrixQrSvg
              seedText={`${report.expedientNumber}-${paymentAlias}-${report.totalPoolPesos}`}
              size={60}
            />
            <div className="leading-tight space-y-0.5">
              <div className="font-bold text-[#1c1613] underline decoration-dotted">
                QR FISCAL VERIFICADO (Ver)
              </div>
              <div>CAE: 760931482019</div>
              <div className="text-[#a81c24] font-bold">Vto: HOY 23:59 HS</div>
            </div>
          </button>

          {showQrCertificate && (
            <div className="mt-2 w-full rounded-lg bg-[#1c1613] text-[#fcf7eb] p-2.5 text-[10px] font-mono-fiscal space-y-1 no-print">
              <div className="flex items-center justify-between text-[#eab308] font-bold">
                <span>✓ FIRMA DIGITAL AFIP-ASADO</span>
                <button
                  type="button"
                  onClick={() => setShowQrCertificate(false)}
                  className="text-[#fcf7eb]/70 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div>Hash Mesa: {report.expedientNumber}</div>
              <div>Pozo Verificado: {formatArgentinePesos(report.totalPoolPesos)}</div>
              <div className="text-[#4ade80]">
                Balance cuadrado al 100% sin desvíos
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar on the Comprobante Oficial */}
      <div className="mt-5 pt-4 border-t-2 border-[#1c1613]/20 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-col gap-0.5 text-xs font-semibold text-[#5c4938]">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#15803d]" />
            <span>Documento público con validez moral en todo grupo de WhatsApp argentino</span>
          </div>
          <span className="text-[10px] font-mono-fiscal text-[#7c5836]">
            Documento humorístico · Simulación parrillera sin validez fiscal real
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleTriggerStamp}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 font-extrabold text-xs cursor-pointer transition-colors ${
              sealStatus === 'sealed'
                ? 'border-[#1c1613] bg-[#f2e4c6] hover:bg-[#e8d5ae] text-[#1c1613]'
                : 'border-[#a81c24] bg-[#a81c24] hover:bg-[#8b161d] text-white shadow-md'
            }`}
          >
            <Stamp className="w-4 h-4" />
            {sealStatus === 'sealed'
              ? 'Re-estampar Sello'
              : '¡Sellar Acta 931-B!'}
          </button>

          <button
            type="button"
            onClick={handlePrintReceipt}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 border-[#1c1613] bg-white hover:bg-[#f2ead7] text-[#1c1613] font-extrabold text-xs cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir / PDF
          </button>

          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c1613] hover:bg-[#312620] text-[#fcf7eb] font-extrabold text-xs cursor-pointer transition-all shadow-md"
          >
            {copiedWhatsApp ? (
              <>
                <Check className="w-4 h-4 text-[#4ade80]" />
                ¡Copiado! Pegalo en el grupo de WhatsApp
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#eab308]" />
                Copiar Intimación para WhatsApp
                <Sparkles className="w-3.5 h-3.5 text-[#3898d4]" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
