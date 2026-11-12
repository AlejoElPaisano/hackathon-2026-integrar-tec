import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Copy,
  FileCheck2,
  Flame,
  Printer,
  QrCode,
  Scale,
  ShieldAlert,
  Sparkles,
  Stamp,
} from 'lucide-react';
import {
  ASADO_ROLES,
  AsadoSettlementReport,
  buildWhatsAppOfficialNotice,
  formatArgentinePesos,
} from '../logic/asadoTaxEngine';

interface OfficialReceiptCardProps {
  report: AsadoSettlementReport;
  eventTitle: string;
  locationName: string;
  paymentAlias: string;
}

export const OfficialReceiptCard: React.FC<OfficialReceiptCardProps> = ({
  report,
  eventTitle,
  locationName,
  paymentAlias,
}) => {
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [isStamped, setIsStamped] = useState(true);

  const handleCopyWhatsApp = async () => {
    const notice = buildWhatsAppOfficialNotice(report, eventTitle, paymentAlias);
    try {
      await navigator.clipboard.writeText(notice);
    } catch {
      // Fallback if clipboard permissions are restricted
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

  const handleTriggerStamp = () => {
    setIsStamped(true);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4fa3d1', '#ffffff', '#e06d1a'],
      });
    } catch {
      // Ignore confetti errors in headless environments
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <section
      aria-label="Comprobante Oficial Formulario 931-B"
      className="fiscal-paper-surface rounded-2xl border-2 border-[#c8bca1] p-5 sm:p-7 relative overflow-hidden transition-all"
    >
      {/* Argentine Top Ribbon (Celeste & Blanco subtle institutional bar) */}
      <div className="flex h-2 -mx-7 -mt-7 mb-5">
        <div className="flex-1 bg-[#4fa3d1]" />
        <div className="flex-1 bg-[#f8f3e6]" />
        <div className="flex-1 bg-[#4fa3d1]" />
      </div>

      {/* Official Document Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-[#141821] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#141821] text-[#f8f3e6] text-xs font-mono-fiscal font-bold tracking-wider uppercase mb-2">
            <Scale className="w-3.5 h-3.5 text-[#4fa3d1]" />
            INGREDIENTE IMPROBABLE · COMPROBANTE OFICIAL
          </div>
          <h2 className="font-serif-official text-3xl sm:text-4xl leading-none tracking-tight text-[#141821] font-normal">
            REPÚBLICA PARRILLERA ARGENTINA
          </h2>
          <p className="text-xs sm:text-sm font-bold tracking-wide text-[#423d35] mt-1 uppercase">
            ARCA-SADO · Agencia de Recaudación y Control del Asado · Ley N° 27.931
          </p>
        </div>

        <div className="sm:text-right font-mono-fiscal bg-[#efe6d1] border border-[#141821]/30 rounded-lg px-3.5 py-2 shrink-0">
          <div className="text-[11px] font-bold uppercase text-[#5a5246]">
            FORMULARIO OFICIAL 931-B
          </div>
          <div className="text-sm sm:text-base font-extrabold text-[#141821]">
            {report.expedientNumber}
          </div>
          <div className="text-[11px] text-[#5a5246]">Emisión: {currentDateStr}</div>
        </div>
      </div>

      {/* Metadata Strip: Event, Quincho & Total Pool */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3.5 border-b border-dashed border-[#141821]/40 text-xs">
        <div>
          <span className=" uppercase font-bold text-[#61594c] block text-[10px]">
            Hecho Imponible (Operativo)
          </span>
          <strong className="text-sm text-[#141821] font-bold block truncate">
            {eventTitle || 'Asado Oficial'}
          </strong>
          <span className="text-[#4a443b] text-[11px]">{locationName}</span>
        </div>

        <div className="sm:border-l sm:border-[#141821]/20 sm:pl-3">
          <span className="uppercase font-bold text-[#61594c] block text-[10px]">
            Gasto Total Auditado
          </span>
          <strong className="font-mono-fiscal text-lg font-extrabold text-[#141821]">
            {formatArgentinePesos(report.totalPoolPesos)}
          </strong>
          <span className="block text-[11px] text-[#5a5246]">
            Cuota Romana Base: {formatArgentinePesos(report.equalSharePerPerson)} c/u
          </span>
        </div>

        <div className="sm:border-l sm:border-[#141821]/20 sm:pl-3 bg-[#9f1d20]/10 rounded p-2">
          <span className="uppercase font-bold text-[#9f1d20] flex items-center gap-1 text-[10px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            Impuesto al Ratoneo Recaudado
          </span>
          <strong className="font-mono-fiscal text-lg font-extrabold text-[#9f1d20]">
            {formatArgentinePesos(report.totalRatoneoTaxCollected)}
          </strong>
          <span className="block text-[10px] text-[#6b2123]">
            Bonificado a favor del Asador y Sede
          </span>
        </div>
      </div>

      {/* Itemized Fiscal Table per Participant */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#141821]">
            I. Liquidación Individual por Comensal ({report.participantCount} declarados)
          </h3>
          <span className="text-[11px] font-mono-fiscal text-[#5a5246]">
            Valores expresados en ARS ($)
          </span>
        </div>

        <div className="overflow-x-auto border border-[#141821]/30 rounded-lg bg-[#fbf8f0]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#141821]/30 bg-[#efe6d1] text-[#141821] font-mono-fiscal text-[11px] uppercase">
                <th className="py-2 px-2.5">Comensal / Categoría</th>
                <th className="py-2 px-2 text-right">Puso ($)</th>
                <th className="py-2 px-2 text-right">Ajuste AFIP</th>
                <th className="py-2 px-2 text-right">Cuota Justa</th>
                <th className="py-2 px-2.5 text-right">Saldo Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141821]/15">
              {report.rows.map((row) => {
                const roleInfo = ASADO_ROLES[row.participant.role];
                const isDiscount = row.fiscalAdjustmentPesos < -10;
                const isPenalty = row.fiscalAdjustmentPesos > 10;

                return (
                  <tr key={row.participant.id} className="hover:bg-[#f2ead7] transition-colors">
                    <td className="py-2.5 px-2.5 align-top">
                      <div className="font-bold text-[#141821] text-xs sm:text-sm">
                        {row.participant.name}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-mono-fiscal px-1.5 py-0.5 rounded bg-[#141821]/10 text-[#2b303c] mt-0.5">
                        {roleInfo.taxCode} · {roleInfo.shortTag}
                      </div>
                      <div className="text-[11px] text-[#524b40] mt-1 leading-snug">
                        {row.appliedConcepts.join(' + ')}
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-right font-mono-fiscal font-semibold text-[#2b303c] align-top whitespace-nowrap">
                      {formatArgentinePesos(row.participant.amountSpent)}
                    </td>

                    <td className="py-2.5 px-2 text-right font-mono-fiscal font-bold align-top whitespace-nowrap">
                      {isDiscount && (
                        <span className="text-[#166534] bg-[#dcfce7] px-1.5 py-0.5 rounded">
                          {formatArgentinePesos(row.fiscalAdjustmentPesos)}
                        </span>
                      )}
                      {isPenalty && (
                        <span className="text-[#9f1d20] bg-[#fee2e2] px-1.5 py-0.5 rounded">
                          +{formatArgentinePesos(row.fiscalAdjustmentPesos)}
                        </span>
                      )}
                      {!isDiscount && !isPenalty && (
                        <span className="text-[#5a5246]">$ 0</span>
                      )}
                    </td>

                    <td className="py-2.5 px-2 text-right font-mono-fiscal font-bold text-[#141821] align-top whitespace-nowrap">
                      {formatArgentinePesos(row.fairAdjustedShare)}
                    </td>

                    <td className="py-2.5 px-2.5 text-right font-mono-fiscal font-extrabold align-top whitespace-nowrap">
                      {row.statusBadge === 'creditor' && (
                        <span className="inline-block px-2 py-0.5 rounded bg-[#15803d] text-white text-xs">
                          COBRA {formatArgentinePesos(row.netBalance)}
                        </span>
                      )}
                      {row.statusBadge === 'debtor' && (
                        <span className="inline-block px-2 py-0.5 rounded bg-[#9f1d20] text-white text-xs">
                          PAGA {formatArgentinePesos(Math.abs(row.netBalance))}
                        </span>
                      )}
                      {row.statusBadge === 'settled' && (
                        <span className="inline-block px-2 py-0.5 rounded bg-[#141821]/15 text-[#141821] text-xs">
                          SALDADO
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Transfers & Official Rubber Stamp */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#efe6d1] border-2 border-[#141821] rounded-xl p-4 relative">
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#141821]">
            <Flame className="w-4 h-4 text-[#e06d1a]" />
            II. Sentencia de Transferencia Inmediata (CBU / Alias)
          </div>

          {report.transfers.length === 0 ? (
            <p className="text-xs text-[#3f3a32] font-medium">
              Todos los comensales se encuentran al día con el fisco parrillero.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {report.transfers.map((tr, idx) => (
                <li
                  key={`${tr.fromName}-${tr.toName}-${idx}`}
                  className="flex items-center justify-between bg-[#fbf8f0] border border-[#141821]/25 rounded-lg px-3 py-1.5 text-xs font-mono-fiscal"
                >
                  <span>
                    <strong className="text-[#9f1d20]">{tr.fromName}</strong>
                    {' → '}
                    <strong className="text-[#15803d]">{tr.toName}</strong>
                  </span>
                  <span className="font-extrabold text-sm text-[#141821]">
                    {formatArgentinePesos(tr.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-[#4a443b]">Alias Oficial Recaudador:</span>
            <code className="font-mono-fiscal font-extrabold bg-[#141821] text-[#f8f3e6] px-2.5 py-0.5 rounded">
              {paymentAlias || 'tucu.asador.mp'}
            </code>
          </div>
        </div>

        {/* Interactive Official Rubber Stamp & QR Box */}
        <div className="md:col-span-5 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-[#141821]/30 pt-3 md:pt-0 md:pl-4">
          {isStamped && (
            <button
              type="button"
              onClick={handleTriggerStamp}
              title="Hacé clic para re-sellar el acta con aplauso parrillero"
              className="official-rubber-stamp px-3 py-2 rounded-md text-center cursor-pointer hover:scale-105 transition-transform mb-2"
            >
              <div className="text-[10px] font-mono-fiscal font-bold">
                REPÚBLICA DEL ASADO · LEY 27.931
              </div>
              <div className="text-sm font-extrabold tracking-widest">
                AUDITADO POR EL ASADOR
              </div>
              <div className="text-[9px] font-mono-fiscal">
                SIN DERECHO A RECLAMO NI LLANTO
              </div>
            </button>
          )}

          <div className="flex items-center gap-2 text-[10px] font-mono-fiscal text-[#4a443b] mt-1">
            <QrCode className="w-7 h-7 text-[#141821] shrink-0" />
            <div className="leading-tight">
              <div>CAE N°: 760931482019</div>
              <div>Vto. Transferencia: HOY 23:59 HS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar on the Comprobante Oficial */}
      <div className="mt-5 pt-4 border-t border-[#141821]/20 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2 text-xs text-[#4a443b]">
          <FileCheck2 className="w-4 h-4 text-[#15803d]" />
          <span>Comprobante válido para intimar deudores en grupos de WhatsApp</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleTriggerStamp}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border-2 border-[#141821] bg-[#efe6d1] hover:bg-[#e5d9bc] text-[#141821] font-bold text-xs cursor-pointer transition-colors"
          >
            <Stamp className="w-4 h-4 text-[#9f1d20]" />
            Sellar Acta
          </button>

          <button
            type="button"
            onClick={handlePrintReceipt}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg border-2 border-[#141821] bg-white hover:bg-[#f2ead7] text-[#141821] font-bold text-xs cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir / PDF Oficial
          </button>

          <button
            type="button"
            onClick={handleCopyWhatsApp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#141821] hover:bg-[#232a38] text-[#f8f3e6] font-bold text-xs cursor-pointer transition-all shadow-md"
          >
            {copiedWhatsApp ? (
              <>
                <Check className="w-4 h-4 text-[#4ade80]" />
                ¡Intimación Copiada para WhatsApp!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#e06d1a]" />
                Copiar Intimación para WhatsApp
                <Sparkles className="w-3.5 h-3.5 text-[#4fa3d1]" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
