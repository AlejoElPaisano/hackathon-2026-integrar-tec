# INVENTION SPEC: "ARCA-SADO" (Agencia de Recaudación y Control del Asado)
*(Alternative catchy names in UI: **CONAPAS** - Comisión Nacional de Auditoría del Asado / **AFIP DEL ASADO**)*

## 1. Official Hackathon Classification ("La Ficha del Invento")
- **Nombre del Invento:** **AFIP del Asado (CONAPAS)** — *Sistema Federal de Liquidación y Justicia Parrillera*
- **Pabellón:** **Pabellón 1 — Molestias Cotidianas** *(Dividir gastos del asado cuando siempre hay uno que pone el lomo, otro que cae con media bolsa de hielo derretido y otro que no lava ni un vaso).*
- **Ingrediente Improbable (ELEGIDO — UNO SOLO):** **3. Comprobante oficial**
  - *Qué genera:* Un **"Acta de Liquidación e Intimación Parrillera Oficial"** con estética de ticket fiscal / documento ministerial argentino (código QR, sello de goma de "AUDITADO POR EL ASADOR", CBU/Alias para transferir, desglose de impuestos al "ratoneo" y botón para imprimir o copiar el resumen para pegar en el grupo de WhatsApp).
- **Quién sufre el problema:** Todo grupo de amigos, familia o compañeros de facultad argentinos después de un asado cuando llega el momento de hacer las cuentas en WhatsApp.
- **El Problema:** Siempre se divide el total en partes iguales ("a la romana"), lo cual es profundamente injusto porque el que puso la casa, prendió el fuego y limpió termina pagando lo mismo que el que llegó a las 23:15 con un paquete de papas fritas abiertas.

---

## 2. How It Fulfills the 5 Mandatory Prototype Conditions

| # | Official Requirement | How Our Prototype Implements It |
|---|---|---|
| **1** | **Recibe una entrada** *(El usuario ingresa al menos un dato)* | Formulario interactivo bien argentino donde cargás a los comensales: **Nombre/Apodo**, **Gasto en pesos ($)**, **Rol en el asado** (*Asador Oficial, Puso la Casa, Trajo Escabio, Cayó con Hielo/Pan, Comensal Parásito*) y **Agravantes/Méritos** (*Hizo el fernet, Lavó los platos, Llegó a comer servido, Puso excusa para no transferir*). Incluye **3 Presets de 1-Click** (*"Asado de Viernes con los Pibes"*, *"Cumpleaños en el Quincho"*, *"El Amigo Fantasma"*). |
| **2** | **La procesa** *(Calcula, ordena, sortea, compara o genera)* | El motor `src/logic/asadoTaxEngine.ts` calcula el gasto base por cabeza y aplica el **Régimen Impositivo Parrillero**: bonifica al Asador (-25% por humo en la ropa), bonifica al que Puso la Casa (-20% por limpieza de grasa), y aplica el **"Impuesto al Ratoneo / Multa por Caer con las Manos Vacías"** (+15% a +30%) redistribuyendo los pesos exactos para que la cuenta cierre al centavo. |
| **3** | **Muestra una salida visible** *(El resultado aparece y cambia según la entrada)* | Panel dinámico en tiempo real que muestra cuánto puso cada uno, su ajuste impositivo (descuento por mérito o recargo por garca/fantasma) y el saldo final exacto: quién tiene que cobrar y cuánto tiene que transferir cada deudor. |
| **4** | **Destaca el ingrediente improbable** *(UNO SOLO: **3. Comprobante oficial**)* | En el centro/derecha brilla el **Comprobante Oficial Fiscal ("Formulario 931-B: Acta de Liquidación Parrillera")** con número de expediente, timbre oficial, detalle de cada comensal, botón **"Imprimir / Descargar PDF Oficial"** y botón **"Copiar Intimación para WhatsApp"**. |
| **5** | **Se puede probar en un minuto** *(Sin instrucciones, precargado desde el inicio)* | Al abrir la app ya viene cargada con una juntada argentina completa de 4 amigos (ej. *"El Tucu (Asador)"*, *"Mati (Puso el depto)"*, *"Nico (Cayó con 1 bolsa de hielo)"*, *"Tincho (Comió vacío y se fue)"*) con su Comprobante Oficial ya emitido y listo para tocar y modificar. |

---

## 3. Argentine Flavor & UI Dictionary (100% Spanish UI / 100% English Code)
- **Internal Code Identifiers (English):** `Participant`, `AsadoRole`, `calculateAsadoSettlement()`, `OfficialReceiptCard`, `taxAdjustmentRate`.
- **User Interface Copy (Bien Argentino):**
  - Roles: *"Asador Titular (Humo en los ojos)"*, *"Dueño de Sede (Puso el quincho/patio)"*, *"Sommelier de Fernet (Armó los tragos)"*, *"Aportante de Hielo / Pan Flauta"*, *"Parásito / Llegó para el aplauso"*.
  - Conceptos del Comprobante Oficial: *"Percepción Solidaria por Ratoneo"*, *"Bonificación por Esfuerzo de Brasa"*, *"Retención por Irse Antes de Lavar"*, *"Total a Transferir al Alias"*.
