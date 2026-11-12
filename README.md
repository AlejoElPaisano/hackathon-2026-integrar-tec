# ARCA-SADO (AFIP del Asado y Justicia Parrillera)

**Pabellón:** Pabellón 1 - Molestias Cotidianas
**Ingrediente improbable:** 3. Comprobante oficial

## El problema
En toda juntada o asado argentino pasa siempre lo mismo: después de tres semanas en WhatsApp para coordinar, uno compra toda la carne y se fuma el humo de la parrilla durante tres horas, otro pone el quincho y limpia la grasa del piso, y nunca falta el amigo que cae a las 23:15 con media bolsa de hielo derretido de estación de servicio pero pretende que se divida todo "a la romana" en partes iguales.

## La solución
**ARCA-SADO (Agencia de Recaudación y Control del Asado)** audita lo que gastó, trajo e hizo cada comensal y reemplaza la injusta cuenta "a la romana" por el **Régimen Impositivo de Solidaridad Parrillera (Ley N° 27.931)**. Bonifica con descuentos fiscales al Asador Titular (-30%), a quien Puso la Sede (-25%) y a quien lavó los platos (-15%), financiando ese alivio con la **Percepción Solidaria por Ratoneo (+22% a +42%)** aplicada a los que cayeron con las manos vacías o hicieron bomba de humo antes de limpiar. Como resultado central, emite en vivo el **Formulario Oficial 931-B (Comprobante Oficial)** con sello de goma, desglose impositivo al centavo, orden de transferencia al Alias CBU y botón para copiar la intimación directamente al grupo de WhatsApp o imprimir el acta en PDF.

## Cómo probarlo
1. Instalar dependencias y levantar el servidor local:
   ```bash
   npm install
   npm run dev
   ```
2. Al abrir la aplicación en el navegador, ya viene precargada con un caso real argentino (*"Asado de Viernes con los Pibes"*) y 3 botones superiores de **Casos de Prueba en 1 Click** (*Clásico de Viernes*, *Festejo Universitario* y *Operativo Caza de Ratones*). Podés modificar en vivo cuánta plata puso cada amigo, cambiarle el rol (*Asador*, *Puso la Casa*, *Cayó con Hielo*, *Parásito VIP*), tildar méritos o infracciones (*Lavó los platos*, *Criticó el punto de la carne*, *Se borró antes de limpiar*) o declarar un nuevo colado en la mesa.
3. En el panel derecho vas a ver actualizarse en tiempo real el **Comprobante Oficial (Formulario 931-B)** con el expediente fiscal, el Impuesto al Ratoneo recaudado, el saldo final exacto de quién cobra y quién transfiere, el botón **"Sellar Acta"**, **"Imprimir / PDF Oficial"** y **"Copiar Intimación para WhatsApp"**.

## Herramientas de IA utilizadas
- **El Gentleman (Pi Coding Agent) + Claude/Gemini:** Estructuración de reglas de la hackathon (`AGENTS.md` y carpeta `rules/`), diseño de la interfaz inspirada en boletines y formularios fiscales argentinos (*Impeccable Design Skill*), implementación modular del motor impositivo en TypeScript (`src/logic/asadoTaxEngine.ts`), pruebas unitarias con Vitest y verificación visual en vivo mediante Chrome DevTools.
