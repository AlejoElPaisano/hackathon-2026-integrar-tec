import React, { useEffect, useMemo, useState } from 'react';
import {
  Flame,
  Gauge,
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
  FISCAL_RIGOR_MODES,
  FiscalRigorMode,
  calculateAsadoSettlement,
  formatArgentinePesos,
} from './logic/asadoTaxEngine';
import { ASADO_PRESETS, AsadoScenarioPreset } from './data/asadoPresets';
import { OfficialReceiptCard } from './components/OfficialReceiptCard';
import {
  FileteadoCorner,
  RoleCulturalBadge,
  SolDeMayoIcon,
} from './components/ArgentineCulturalAssets';

const STORAGE_KEY = 'arca_sado_state_v2';

interface StoredAsadoState {
  activePresetId: string;
  rigorMode: FiscalRigorMode;
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
        if (
          parsed &&
          Array.isArray(parsed.participants) &&
          parsed.participants.length > 0
        ) {
          return {
            ...parsed,
            rigorMode: parsed.rigorMode || 'standard',
          };
        }
      }
    } catch {
      // Fallback to default preset if localStorage is unavailable or corrupted
    }
    return {
      activePresetId: defaultPreset.id,
      rigorMode: 'standard',
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
  const [newRole, setNewRole] = useState<AsadoRoleId>('regular_guest');

  // Game-feel audit state: selected suspect & seal lifecycle
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(
    () => state.participants[0]?.id ?? null
  );
  const [sealStatus, setSealStatus] = useState<'unsealed' | 'sealed' | 'stale'>('sealed');
  const [lastChangedParticipantId, setLastChangedParticipantId] = useState<string | null>(null);

  const markAuditModified = (changedId?: string) => {
    setSealStatus((prev) => (prev === 'sealed' ? 'stale' : prev));
    if (changedId) {
      setSelectedParticipantId(changedId);
      setLastChangedParticipantId(changedId);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const settlementReport = useMemo(
    () =>
      calculateAsadoSettlement(
        state.participants,
        '931-B/2026',
        state.rigorMode
      ),
    [state.participants, state.rigorMode]
  );

  const handleSelectPreset = (preset: AsadoScenarioPreset) => {
    setState((prev) => ({
      ...prev,
      activePresetId: preset.id,
      eventTitle: preset.eventTitle,
      locationName: preset.locationName,
      paymentAlias: preset.paymentAlias,
      participants: preset.participants.map((p) => ({
        ...p,
        behaviors: [...p.behaviors],
      })),
    }));
    setSelectedParticipantId(preset.participants[0]?.id ?? null);
    setSealStatus('unsealed');
  };

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      activePresetId: defaultPreset.id,
      rigorMode: 'standard',
      eventTitle: defaultPreset.eventTitle,
      locationName: defaultPreset.locationName,
      paymentAlias: defaultPreset.paymentAlias,
      participants: defaultPreset.participants.map((p) => ({
        ...p,
        behaviors: [...p.behaviors],
      })),
    });
    setSelectedParticipantId(defaultPreset.participants[0]?.id ?? null);
    setSealStatus('sealed');
  };

  const handleStartBlankTable = (count = 3) => {
    const defaultRoles: AsadoRoleId[] = [
      'grill_master',
      'house_host',
      'regular_guest',
      'regular_guest',
      'fernet_sommelier',
    ];
    const blankParticipants: AsadoParticipant[] = Array.from(
      { length: Math.max(2, count) },
      (_, idx) => ({
        id: `blank-${Date.now()}-${idx + 1}`,
        name: '',
        amountSpent: 0,
        whatTheyBrought: '',
        role: defaultRoles[idx % defaultRoles.length],
        behaviors: [],
      })
    );

    setState({
      activePresetId: 'custom_blank',
      rigorMode: 'standard',
      eventTitle: '',
      locationName: '',
      paymentAlias: '',
      participants: blankParticipants,
    });
    setSelectedParticipantId(blankParticipants[0]?.id ?? null);
    setSealStatus('unsealed');
  };

  const handleSetParticipantCount = (targetCount: number) => {
    const clamped = Math.max(2, Math.min(10, targetCount));
    markAuditModified();
    setState((prev) => {
      if (prev.participants.length === clamped) return prev;
      if (prev.participants.length > clamped) {
        return {
          ...prev,
          participants: prev.participants.slice(0, clamped),
        };
      }
      const extraNeeded = clamped - prev.participants.length;
      const added: AsadoParticipant[] = Array.from(
        { length: extraNeeded },
        (_, idx) => {
          const num = prev.participants.length + idx + 1;
          return {
            id: `extra-${Date.now()}-${num}`,
            name: '',
            amountSpent: 0,
            whatTheyBrought: '',
            role: 'regular_guest',
            behaviors: [],
          };
        }
      );
      return {
        ...prev,
        participants: [...prev.participants, ...added],
      };
    });
  };

  const handleUpdateParticipant = (
    id: string,
    patch: Partial<AsadoParticipant>
  ) => {
    markAuditModified(id);
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
    markAuditModified(participantId);
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
    markAuditModified();
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

    markAuditModified(created.id);
    setState((prev) => ({
      ...prev,
      participants: [...prev.participants, created],
    }));

    setNewName('');
    setNewAmount('');
    setNewBrought('');
    setNewRole('regular_guest');
  };

  return (
    <div className="min-h-screen flex flex-col mantel-quincho-pattern text-[#fdf8ef]">
      {/* Argentine Top Flag & Quincho Header */}
      <div className="h-2.5 flex w-full no-print">
        <div className="flex-1 bg-[#3898d4]" />
        <div className="flex-1 bg-[#fcf7eb]" />
        <div className="flex-1 bg-[#3898d4]" />
      </div>

      <header className="border-b-2 border-[#6e4f3a]/60 bg-[#2a1d17]/95 backdrop-blur-xs relative overflow-hidden no-print">
        {/* Animated Floating Embers in Header */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="animate-ember-1 absolute bottom-2 left-16 w-2 h-2 rounded-full bg-amber-400/80" />
          <span className="animate-ember-2 absolute bottom-3 left-36 w-2.5 h-2.5 rounded-full bg-orange-500/70" />
          <span className="animate-ember-3 absolute bottom-1 left-64 w-1.5 h-1.5 rounded-full bg-yellow-300/80" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="relative w-14 h-14 rounded-2xl bg-[#38261e] border-2 border-[#eab308]/60 flex items-center justify-center shrink-0 shadow-md">
              <SolDeMayoIcon className="w-11 h-11" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono-fiscal font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#3898d4]/25 text-[#9ad6ff] border border-[#3898d4]/50">
                  🇦🇷 Pabellón 1 · Molestias Cotidianas
                </span>
                <span className="text-[11px] font-mono-fiscal font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#eab308]/20 text-[#fde047] border border-[#eab308]/50">
                  📜 Ingrediente #3 · Comprobante Oficial
                </span>
              </div>
              <h1 className="font-serif-official text-3xl sm:text-4xl tracking-tight text-[#fcf7eb] mt-1">
                ARCA-SADO · Justicia Criolla en la Mesa del Asado
              </h1>
              <p className="text-xs sm:text-sm text-[#e5d5c3]">
                ¡Un aplauso para el asador! Al que prendió el fuego y puso el quincho se le descuenta; al que cayó con media bolsa de hielo le cabe el <strong>Impuesto al Ratoneo</strong>.
              </p>
            </div>
          </div>

          {/* 1-Click Argentine Scenario Presets */}
          <div className="flex flex-wrap items-center gap-2">
            {ASADO_PRESETS.map((preset) => {
              const isActive = state.activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-2 ${
                    isActive
                      ? 'bg-[#eab308] text-[#1c1613] border-[#fef08a] shadow-md scale-[1.02]'
                      : 'bg-[#38261e] text-[#f3e8ce] border-[#6e4f3a] hover:border-[#eab308]/70 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  {preset.badge}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handleStartBlankTable(3)}
              title="Vaciar los campos para cargar tu propio asado desde cero con placeholders"
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all border-2 inline-flex items-center gap-1.5 ${
                state.activePresetId === 'custom_blank'
                  ? 'bg-[#3898d4] text-[#1c1613] border-white shadow-md scale-[1.02]'
                  : 'bg-[#241914] hover:bg-[#38261e] text-[#9ad6ff] border-[#3898d4]/60'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Mesa desde Cero
            </button>

            <button
              type="button"
              onClick={handleResetDemo}
              title="Restaurar los datos originales del ejemplo"
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#38261e] hover:bg-[#473026] text-[#e5d5c3] hover:text-white border-2 border-[#6e4f3a] cursor-pointer transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#eab308]" />
              Restaurar Demo
            </button>
          </div>
        </div>
      </header>

      {/* Animated Termómetro de Brasa y Bronca Parrillera + Selector de Rigor Fiscal */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 no-print">
        <div className="bg-[#32231b] border-2 border-[#6e4f3a] rounded-2xl p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center relative overflow-hidden shadow-lg">
          <FileteadoCorner className="w-7 h-7 text-[#eab308]/40 absolute top-2 left-2 pointer-events-none" />

          {/* Left: Termómetro de Ratoneo en Vivo */}
          <div className="lg:col-span-6 space-y-1.5 pl-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-[#fde047] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#ea580c] animate-brasa-glow" />
                Termómetro de Bronca y Ratoneo en la Mesa
              </span>
              <span className="font-mono-fiscal font-extrabold text-sm text-[#fcf7eb]">
                {settlementReport.ratoneoHeatLevel}°C de Caradurez
              </span>
            </div>

            <div className="w-full h-3.5 rounded-full bg-[#1c1410] border border-[#6e4f3a] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${settlementReport.ratoneoHeatLevel}%`,
                  background:
                    'linear-gradient(90deg, #3898d4 0%, #eab308 50%, #ea580c 78%, #dc2626 100%)',
                }}
              />
            </div>

            <p className="text-xs text-[#e5d5c3] font-medium">
              {settlementReport.ratoneoHeatVerdict}
            </p>
          </div>

          {/* Right: Selector de Rigor Impositivo (Amistoso / Criollo Estándar / Mano Dura 2x) */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row sm:items-center justify-end gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#e5d5c3] flex items-center gap-1 shrink-0">
              <Gauge className="w-4 h-4 text-[#3898d4]" />
              Rigor del Asador:
            </span>
            <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
              {(Object.values(FISCAL_RIGOR_MODES) as (typeof FISCAL_RIGOR_MODES)[FiscalRigorMode][]).map(
                (mode) => {
                  const active = state.rigorMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        markAuditModified();
                        setState((prev) => ({ ...prev, rigorMode: mode.id }));
                      }}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                        active
                          ? 'bg-[#ea580c] text-white border-[#fed7aa] shadow-sm'
                          : 'bg-[#241914] text-[#d9c7b2] border-[#6e4f3a] hover:border-[#eab308]'
                      }`}
                    >
                      {mode.label}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simulador de Auditoría Parrillera — 3-Step Interactive Progress Strip */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-3 no-print">
        <div className="bg-[#241914]/90 border border-[#6e4f3a]/80 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-extrabold text-[#fde047] uppercase tracking-wider">
            <span>🕵️ Simulador de Auditoría Parrillera:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#fcf7eb]">
              <span className="w-5 h-5 rounded-full bg-[#3898d4] text-[#1c1613] font-mono-fiscal font-extrabold inline-flex items-center justify-center text-[11px]">
                1
              </span>
              Inspeccioná sospechosos ({state.participants.length})
            </span>
            <span className="text-[#6e4f3a]">→</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#fcf7eb]">
              <span className="w-5 h-5 rounded-full bg-[#eab308] text-[#1c1613] font-mono-fiscal font-extrabold inline-flex items-center justify-center text-[11px]">
                2
              </span>
              Fiscalizá méritos y ratoneos en vivo
            </span>
            <span className="text-[#6e4f3a]">→</span>
            <span
              className={`inline-flex items-center gap-1.5 font-extrabold px-2.5 py-0.5 rounded-full border ${
                sealStatus === 'sealed'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                  : 'bg-amber-500/20 border-amber-400 text-amber-200 animate-pulse'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#a81c24] text-white font-mono-fiscal font-extrabold inline-flex items-center justify-center text-[11px]">
                3
              </span>
              {sealStatus === 'sealed'
                ? 'Acta 931-B Sellada y Lista'
                : 'Falta Sellar el Acta 931-B'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Split Workstation: Left = Mesa del Quincho (Entrada) | Right = Formulario 931-B (Comprobante Oficial) */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* LEFT COLUMN: Interactive Input Panel (La Mesa de los Pibes) */}
        <section
          aria-label="Declaración Jurada de Comensales"
          className="lg:col-span-6 space-y-5 no-print"
        >
          {/* Event Metadata Card */}
          <div className="bg-[#32231b] border-2 border-[#6e4f3a] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-extrabold text-[#fcf7eb] flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#eab308]" />
                1. Datos de la Juntada y el Quincho
              </h2>
              <span className="text-[11px] font-mono-fiscal text-[#d9c7b2] bg-[#241914] px-2 py-0.5 rounded border border-[#6e4f3a]">
                Cálculo en vivo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="event-title-input"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#e5d5c3] mb-1"
                >
                  Motivo del Asado
                </label>
                <input
                  id="event-title-input"
                  type="text"
                  value={state.eventTitle}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, eventTitle: e.target.value }))
                  }
                  className="w-full rounded-xl bg-[#241914] border border-[#6e4f3a] px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#eab308]"
                  placeholder="Ej: Asado de Viernes"
                />
              </div>

              <div>
                <label
                  htmlFor="location-input"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#e5d5c3] mb-1"
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
                  className="w-full rounded-xl bg-[#241914] border border-[#6e4f3a] px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#eab308]"
                  placeholder="Ej: Patio de Mati"
                />
              </div>

              <div>
                <label
                  htmlFor="alias-input"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#e5d5c3] mb-1"
                >
                  Alias CBU para Cobrar
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
                  className="w-full rounded-xl bg-[#241914] border border-[#6e4f3a] px-3 py-2 text-xs font-mono-fiscal font-bold text-[#9ad6ff] focus:outline-none focus:border-[#eab308]"
                  placeholder="tucu.asador.mp"
                />
              </div>
            </div>
          </div>

          {/* Participants List */}
          <div className="bg-[#32231b] border-2 border-[#6e4f3a] rounded-2xl p-4 sm:p-5 space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-[#fcf7eb] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#3898d4]" />
                  2. Los Comensales de la Mesa ({state.participants.length})
                </h2>
                <p className="text-[11px] text-[#d9c7b2] mt-0.5">
                  Elegí cuántos son en la mesa (mínimo 2) o quitá/agregá amigos libremente:
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label
                  htmlFor="participant-count-select"
                  className="text-xs font-bold text-[#e5d5c3]"
                >
                  ¿Cuántos son?
                </label>
                <select
                  id="participant-count-select"
                  value={state.participants.length}
                  onChange={(e) =>
                    handleSetParticipantCount(Number(e.target.value))
                  }
                  className="rounded-xl bg-[#241914] border-2 border-[#eab308]/70 px-3 py-1.5 text-xs font-mono-fiscal font-extrabold text-[#fde047] focus:outline-none focus:border-[#eab308] cursor-pointer"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                    <option key={count} value={count}>
                      {count} comensales
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3.5">
              {state.participants.map((participant) => {
                const auditRow = settlementReport.rows.find(
                  (r) => r.participant.id === participant.id
                );
                const isSelected = selectedParticipantId === participant.id;

                return (
                  <div
                    key={participant.id}
                    onClick={() => setSelectedParticipantId(participant.id)}
                    onFocusCapture={() => setSelectedParticipantId(participant.id)}
                    className={`rounded-2xl bg-[#241914] border-2 p-3.5 space-y-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#eab308] ring-2 ring-[#eab308]/35 shadow-lg bg-[#2b1e18]'
                        : 'border-[#6e4f3a]/80 hover:border-[#eab308]/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 flex-1">
                        <RoleCulturalBadge role={participant.role} />

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2">
                          <div className="sm:col-span-5">
                            <label className="block text-[10px] uppercase text-[#d9c7b2] font-bold mb-0.5">
                              Apodo / Amigo
                            </label>
                            <input
                              type="text"
                              value={participant.name}
                              placeholder={`Ej: Comensal #${state.participants.indexOf(participant) + 1}`}
                              onChange={(e) =>
                                handleUpdateParticipant(participant.id, {
                                  name: e.target.value,
                                })
                              }
                              className="w-full rounded-lg bg-[#32231b] border border-[#6e4f3a] px-2.5 py-1.5 text-xs font-extrabold text-white placeholder:text-[#9c8470] placeholder:font-normal focus:outline-none focus:border-[#eab308]"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-[10px] uppercase text-[#d9c7b2] font-bold mb-0.5">
                              Puso ($ ARS)
                            </label>
                            <input
                              type="number"
                              min={0}
                              step={500}
                              value={participant.amountSpent || ''}
                              placeholder="Ej: 15000"
                              onChange={(e) =>
                                handleUpdateParticipant(participant.id, {
                                  amountSpent: Math.max(
                                    0,
                                    Number(e.target.value) || 0
                                  ),
                                })
                              }
                              className="w-full rounded-lg bg-[#32231b] border border-[#6e4f3a] px-2.5 py-1.5 text-xs font-mono-fiscal font-extrabold text-[#fde047] placeholder:text-[#9c8470] placeholder:font-normal focus:outline-none focus:border-[#eab308]"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <label className="block text-[10px] uppercase text-[#d9c7b2] font-bold mb-0.5">
                              Rol en el Asado
                            </label>
                            <select
                              value={participant.role}
                              onChange={(e) =>
                                handleUpdateParticipant(participant.id, {
                                  role: e.target.value as AsadoRoleId,
                                })
                              }
                              className="w-full rounded-lg bg-[#32231b] border border-[#6e4f3a] px-2 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-[#eab308]"
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
                      </div>

                      {state.participants.length > 2 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveParticipant(participant.id);
                          }}
                          title="Sacar de la mesa"
                          className="self-end sm:self-center px-2 py-1.5 rounded-lg text-[11px] font-bold text-rose-300 bg-rose-500/10 border border-rose-400/30 hover:bg-rose-500/25 cursor-pointer transition-colors inline-flex items-center gap-1 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Quitar
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
                        placeholder="¿Qué trajo a la mesa o qué excusa metió?"
                        className="flex-1 rounded-lg bg-[#32231b]/90 border border-[#6e4f3a]/70 px-2.5 py-1.5 text-xs text-[#f3e8ce] focus:outline-none focus:border-[#eab308]"
                      />

                      {auditRow && (
                        <div className="font-mono-fiscal text-xs bg-[#32231b] px-2.5 py-1 rounded-lg border border-[#6e4f3a] shrink-0">
                          <span className="text-[#d9c7b2]">Le toca pagar: </span>
                          <strong className="text-[#fde047]">
                            {formatArgentinePesos(auditRow.fairAdjustedShare)}
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* Behavior Modifiers (Méritos de Gaucho vs Infracciones de Garca) */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
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
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all border ${
                              active
                                ? isMerit
                                  ? 'bg-emerald-600/35 border-emerald-400 text-emerald-100 shadow-2xs'
                                  : 'bg-rose-600/40 border-rose-400 text-rose-100 shadow-2xs'
                                : 'bg-[#32231b] border-[#6e4f3a]/80 text-[#d9c7b2] hover:text-white hover:border-[#eab308]/50'
                            }`}
                          >
                            {isMerit ? '🧉 ' : '🐀 '}
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
              className="rounded-2xl bg-[#241914] border-2 border-dashed border-[#eab308]/60 p-4 space-y-3"
            >
              <div className="text-xs font-extrabold text-[#fde047] flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                Sumar otro amigo / colado de último momento
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Apodo (ej: El Polaco)"
                  className="sm:col-span-4 rounded-xl bg-[#32231b] border border-[#6e4f3a] px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#eab308]"
                />
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Puso $ (ej: 0)"
                  className="sm:col-span-3 rounded-xl bg-[#32231b] border border-[#6e4f3a] px-3 py-2 text-xs font-mono-fiscal font-bold text-white focus:outline-none focus:border-[#eab308]"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AsadoRoleId)}
                  className="sm:col-span-5 rounded-xl bg-[#32231b] border border-[#6e4f3a] px-2.5 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#eab308]"
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
                  className="flex-1 rounded-xl bg-[#32231b] border border-[#6e4f3a] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#eab308]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#eab308] hover:bg-[#facc15] text-[#1c1613] font-extrabold text-xs cursor-pointer transition-colors shrink-0 shadow-sm"
                >
                  Sentar a la Mesa
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
            selectedParticipantId={selectedParticipantId}
            lastChangedParticipantId={lastChangedParticipantId}
            sealStatus={sealStatus}
            onSelectParticipant={setSelectedParticipantId}
            onSealReceipt={() => setSealStatus('sealed')}
          />

          {/* Explainable Formula Box for Judges & Tuesday Defense */}
          <div className="bg-[#32231b] border-2 border-[#6e4f3a] rounded-2xl p-4 text-xs text-[#e5d5c3] space-y-1.5 no-print shadow-md">
            <div className="font-extrabold text-[#fcf7eb] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#3898d4]" />
              Cómo funciona el motor (`src/logic/asadoTaxEngine.ts`)
            </div>
            <p className="leading-relaxed">
              Suma el pozo total (<strong className="text-[#fde047]">{formatArgentinePesos(settlementReport.totalPoolPesos)}</strong>), aplica el multiplicador de rigor (<strong className="text-white">{FISCAL_RIGOR_MODES[state.rigorMode].label}</strong>) y normaliza las cuotas para premiar al <strong className="text-emerald-300">Asador (-30%)</strong>, a quien <strong className="text-emerald-300">Puso el Quincho (-25%)</strong> y a quien <strong className="text-emerald-300">Lavó los platos (-15%)</strong>, cobrándole la diferencia a quienes cayeron con las manos vacías.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
