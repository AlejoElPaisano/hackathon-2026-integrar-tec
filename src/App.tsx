import React, { useEffect, useMemo, useState } from 'react';
import {
  Flame,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react';
import {
  ASADO_ROLES,
  AsadoParticipant,
  AsadoRoleId,
  BEHAVIOR_MODIFIERS,
  BehaviorModifierId,
  calculateAsadoSettlement,
  formatArgentinePesos,
} from './logic/asadoTaxEngine';
import { ASADO_PRESETS, AsadoScenarioPreset } from './data/asadoPresets';
import { OfficialReceiptCard } from './components/OfficialReceiptCard';

const STORAGE_KEY = 'arca_sado_state_v1';

interface StoredAsadoState {
  activePresetId: string;
  eventTitle: string;
  locationName: string;
  paymentAlias: string;
  participants: AsadoParticipant[];
}

export function App() {
  const defaultPreset = ASADO_PRESETS[0];

  const [state, setState] = useState<StoredAsadoState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as StoredAsadoState;
        if (parsed && Array.isArray(parsed.participants) && parsed.participants.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default preset if localStorage is unavailable or corrupted
    }
    return {
      activePresetId: defaultPreset.id,
      eventTitle: defaultPreset.eventTitle,
      locationName: defaultPreset.locationName,
      paymentAlias: defaultPreset.paymentAlias,
      participants: defaultPreset.participants,
    };
  });

  // Quick-add participant form state
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newBrought, setNewBrought] = useState('');
  const [newRole, setNewRole] = useState<AsadoRoleId>('ice_bringer');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const settlementReport = useMemo(
    () => calculateAsadoSettlement(state.participants, '931-B/2026'),
    [state.participants]
  );

  const handleSelectPreset = (preset: AsadoScenarioPreset) => {
    setState({
      activePresetId: preset.id,
      eventTitle: preset.eventTitle,
      locationName: preset.locationName,
      paymentAlias: preset.paymentAlias,
      participants: preset.participants.map((p) => ({
        ...p,
        behaviors: [...p.behaviors],
      })),
    });
  };

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    handleSelectPreset(ASADO_PRESETS[0]);
  };

  const handleUpdateParticipant = (
    id: string,
    patch: Partial<AsadoParticipant>
  ) => {
    setState((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      ),
    }));
  };

  const handleToggleBehavior = (
    participantId: string,
    behaviorId: BehaviorModifierId
  ) => {
    setState((prev) => ({
      ...prev,
      participants: prev.participants.map((p) => {
        if (p.id !== participantId) return p;
        const exists = p.behaviors.includes(behaviorId);
        return {
          ...p,
          behaviors: exists
            ? p.behaviors.filter((b) => b !== behaviorId)
            : [...p.behaviors, behaviorId],
        };
      }),
    }));
  };

  const handleRemoveParticipant = (id: string) => {
    setState((prev) => {
      if (prev.participants.length <= 2) return prev;
      return {
        ...prev,
        participants: prev.participants.filter((p) => p.id !== id),
      };
    });
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newName.trim();
    if (!trimmedName) return;

    const created: AsadoParticipant = {
      id: `custom-${Date.now()}`,
      name: trimmedName,
      amountSpent: Math.max(0, Number(newAmount) || 0),
      whatTheyBrought:
        newBrought.trim() || 'Cayó con las manos en los bolsillos',
      role: newRole,
      behaviors:
        newRole === 'pure_parasite' ? ['left_before_cleaning'] : [],
    };

    setState((prev) => ({
      ...prev,
      participants: [...prev.participants, created],
    }));

    setNewName('');
    setNewAmount('');
    setNewBrought('');
    setNewRole('ice_bringer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#131110] text-[#f3ede2]">
      {/* Argentine Top Institutional Banner */}
      <header className="border-b border-white/10 bg-[#181513] no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#e06d1a]/15 border border-[#e06d1a]/40 flex items-center justify-center shrink-0">
              <Flame className="w-6 h-6 text-[#e06d1a]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono-fiscal font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#4fa3d1]/15 text-[#7cc4e8] border border-[#4fa3d1]/30">
                  Pabellón 1 · Molestias Cotidianas
                </span>
                <span className="text-[11px] font-mono-fiscal font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#e06d1a]/15 text-[#f49d5b] border border-[#e06d1a]/30">
                  Ingrediente #3 · Comprobante Oficial
                </span>
              </div>
              <h1 className="font-serif-official text-2xl sm:text-3xl tracking-tight text-[#f8f3e6] mt-1">
                ARCA-SADO · AFIP del Asado y Justicia Parrillera
              </h1>
              <p className="text-xs sm:text-sm text-[#b8afa2]">
                Basta de dividir &ldquo;a la romana&rdquo;: el que prende el fuego o pone la casa recibe descuento fiscal; el que cae con media bolsa de hielo paga Impuesto al Ratoneo.
              </p>
            </div>
          </div>

          {/* 1-Click Preset Selector & Reset */}
          <div className="flex flex-wrap items-center gap-2">
            {ASADO_PRESETS.map((preset) => {
              const isActive = state.activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#e06d1a] text-[#131110] border-[#e06d1a] font-bold shadow-sm'
                      : 'bg-[#221e1b] text-[#d6cdc0] border-white/10 hover:border-[#e06d1a]/50 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  {preset.badge}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleResetDemo}
              title="Restaurar datos originales de la demo"
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#221e1b] hover:bg-[#2c2623] text-[#b8afa2] hover:text-white border border-white/10 cursor-pointer transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar Demo
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Workstation: Left = Declaración Jurada (Input) | Right = Formulario 931-B (Comprobante Oficial) */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* LEFT COLUMN: Interactive Input Panel (Declaración Jurada de la Juntada) */}
        <section
          aria-label="Declaración Jurada de Comensales"
          className="lg:col-span-6 space-y-5 no-print"
        >
          {/* Event Metadata Card */}
          <div className="bg-[#1b1816] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#f8f3e6] flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#e06d1a]" />
                1. Datos del Operativo Parrillero (Entrada)
              </h2>
              <span className="text-[11px] font-mono-fiscal text-[#9e9487]">
                Edición en vivo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="event-title-input"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-[#b8afa2] mb-1"
                >
                  Nombre de la Juntada
                </label>
                <input
                  id="event-title-input"
                  type="text"
                  value={state.eventTitle}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, eventTitle: e.target.value }))
                  }
                  className="w-full rounded-lg bg-[#131110] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e06d1a]"
                  placeholder="Ej: Asado de Viernes"
                />
              </div>

              <div>
                <label
                  htmlFor="location-input"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-[#b8afa2] mb-1"
                >
                  Sede / Quincho
                </label>
                <input
                  id="location-input"
                  type="text"
                  value={state.locationName}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      locationName: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg bg-[#131110] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e06d1a]"
                  placeholder="Ej: Patio de Mati"
                />
              </div>

              <div>
                <label
                  htmlFor="alias-input"
                  className="block text-[11px] font-semibold uppercase tracking-wider text-[#b8afa2] mb-1"
                >
                  Alias CBU Recaudador
                </label>
                <input
                  id="alias-input"
                  type="text"
                  value={state.paymentAlias}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      paymentAlias: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg bg-[#131110] border border-white/15 px-3 py-2 text-xs font-mono-fiscal text-[#7cc4e8] focus:outline-none focus:border-[#e06d1a]"
                  placeholder="tucu.asador.mp"
                />
              </div>
            </div>
          </div>

          {/* Participants List */}
          <div className="bg-[#1b1816] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#f8f3e6] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4fa3d1]" />
                2. Declaración Jurada por Comensal ({state.participants.length})
              </h2>
              <span className="text-xs font-mono-fiscal text-[#e06d1a] font-semibold">
                Total: {formatArgentinePesos(settlementReport.totalPoolPesos)}
              </span>
            </div>

            <div className="space-y-3">
              {state.participants.map((participant) => {
                const auditRow = settlementReport.rows.find(
                  (r) => r.participant.id === participant.id
                );

                return (
                  <div
                    key={participant.id}
                    className="rounded-xl bg-[#131110] border border-white/10 p-3.5 space-y-3 hover:border-white/20 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2">
                        <div className="sm:col-span-5">
                          <label className="block text-[10px] uppercase text-[#9e9487] font-semibold mb-0.5">
                            Apodo / Comensal
                          </label>
                          <input
                            type="text"
                            value={participant.name}
                            onChange={(e) =>
                              handleUpdateParticipant(participant.id, {
                                name: e.target.value,
                              })
                            }
                            className="w-full rounded bg-[#1b1816] border border-white/15 px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#e06d1a]"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] uppercase text-[#9e9487] font-semibold mb-0.5">
                            Puso ($ ARS)
                          </label>
                          <input
                            type="number"
                            min={0}
                            step={500}
                            value={participant.amountSpent}
                            onChange={(e) =>
                              handleUpdateParticipant(participant.id, {
                                amountSpent: Math.max(
                                  0,
                                  Number(e.target.value) || 0
                                ),
                              })
                            }
                            className="w-full rounded bg-[#1b1816] border border-white/15 px-2.5 py-1.5 text-xs font-mono-fiscal font-bold text-[#f49d5b] focus:outline-none focus:border-[#e06d1a]"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-[10px] uppercase text-[#9e9487] font-semibold mb-0.5">
                            Rol en el Asado
                          </label>
                          <select
                            value={participant.role}
                            onChange={(e) =>
                              handleUpdateParticipant(participant.id, {
                                role: e.target.value as AsadoRoleId,
                              })
                            }
                            className="w-full rounded bg-[#1b1816] border border-white/15 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#e06d1a]"
                          >
                            {Object.values(ASADO_ROLES).map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.shortTag} (
                                {role.weightDelta > 0
                                  ? `+${Math.round(role.weightDelta * 100)}%`
                                  : `${Math.round(role.weightDelta * 100)}%`}
                                )
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {state.participants.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(participant.id)}
                          title="Eliminar comensal"
                          className="self-end sm:self-center p-1.5 rounded-lg text-[#9e9487] hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* What they brought + Live Tax Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <input
                        type="text"
                        value={participant.whatTheyBrought}
                        onChange={(e) =>
                          handleUpdateParticipant(participant.id, {
                            whatTheyBrought: e.target.value,
                          })
                        }
                        placeholder="¿Qué trajo o qué excusa metió?"
                        className="flex-1 rounded bg-[#1b1816]/70 border border-white/10 px-2.5 py-1 text-[11px] text-[#d6cdc0] focus:outline-none focus:border-[#e06d1a]"
                      />

                      {auditRow && (
                        <div className="font-mono-fiscal text-[11px] shrink-0">
                          <span className="text-[#9e9487]">Cuota AFIP: </span>
                          <strong className="text-white">
                            {formatArgentinePesos(auditRow.fairAdjustedShare)}
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* Behavior Modifiers (Méritos y Agravantes) */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.values(BEHAVIOR_MODIFIERS).map((mod) => {
                        const active = participant.behaviors.includes(mod.id);
                        const isMerit = mod.type === 'merit';
                        return (
                          <button
                            key={mod.id}
                            type="button"
                            onClick={() =>
                              handleToggleBehavior(participant.id, mod.id)
                            }
                            className={`px-2 py-1 rounded text-[11px] font-medium cursor-pointer transition-all border ${
                              active
                                ? isMerit
                                  ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200 font-semibold'
                                  : 'bg-rose-500/25 border-rose-400/60 text-rose-200 font-semibold'
                                : 'bg-[#1b1816] border-white/10 text-[#9e9487] hover:text-[#e2d9cc]'
                            }`}
                          >
                            {isMerit ? '✓ ' : '⚠ '}
                            {mod.label}{' '}
                            <span className="font-mono-fiscal text-[10px]">
                              ({mod.weightDelta > 0 ? '+' : ''}
                              {Math.round(mod.weightDelta * 100)}%)
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Participant Form */}
            <form
              onSubmit={handleAddParticipant}
              className="rounded-xl bg-[#131110] border border-dashed border-[#e06d1a]/40 p-3.5 space-y-3"
            >
              <div className="text-xs font-bold text-[#f49d5b] flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                Sumar otro amigo / colado a la mesa
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Apodo (ej: El Polaco)"
                  className="sm:col-span-4 rounded-lg bg-[#1b1816] border border-white/15 px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#e06d1a]"
                />
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Puso $ (ej: 0)"
                  className="sm:col-span-3 rounded-lg bg-[#1b1816] border border-white/15 px-2.5 py-2 text-xs font-mono-fiscal text-white focus:outline-none focus:border-[#e06d1a]"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AsadoRoleId)}
                  className="sm:col-span-5 rounded-lg bg-[#1b1816] border border-white/15 px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#e06d1a]"
                >
                  {Object.values(ASADO_ROLES).map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newBrought}
                  onChange={(e) => setNewBrought(e.target.value)}
                  placeholder="¿Qué aportó? (ej: Cayó con medio paquete de criollitas)"
                  className="flex-1 rounded-lg bg-[#1b1816] border border-white/15 px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#e06d1a]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#e06d1a] hover:bg-[#eb7a28] text-[#131110] font-bold text-xs cursor-pointer transition-colors shrink-0"
                >
                  Declarar Comensal
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* RIGHT COLUMN: Centerpiece Improbable Ingredient (#3 Comprobante Oficial) */}
        <section className="lg:col-span-6 lg:sticky lg:top-6 space-y-4">
          <OfficialReceiptCard
            report={settlementReport}
            eventTitle={state.eventTitle}
            locationName={state.locationName}
            paymentAlias={state.paymentAlias}
          />

          {/* Explainable Formula Box for Judges & Tuesday Defense */}
          <div className="bg-[#1b1816] border border-white/10 rounded-xl p-4 text-xs text-[#b8afa2] space-y-1.5 no-print">
            <div className="font-bold text-[#f8f3e6] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#4fa3d1]" />
              Cómo audita el algoritmo (`src/logic/asadoTaxEngine.ts`)
            </div>
            <p className="leading-relaxed">
              Calcula el pozo total (<strong className="text-white">{formatArgentinePesos(settlementReport.totalPoolPesos)}</strong>) y pondera el factor de esfuerzo/ratoneo de cada comensal: premia al <strong className="text-emerald-300">Asador (-30%)</strong>, a quien <strong className="text-emerald-300">Puso la Casa (-25%)</strong> y a quien <strong className="text-emerald-300">Lavó los platos (-15%)</strong>, financiando ese descuento con la <strong className="text-rose-300">Percepción por Ratoneo (+22% a +42%)</strong> de quienes cayeron con las manos vacías o se borraron antes de limpiar.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
