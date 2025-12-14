// src/utils/googleCalendar.js
// Módulo central para manejar Google Calendar en Renace

import { GOOGLE_CLIENT_ID } from "../firebase";

const SCOPES =
  "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly";

let tokenClient = null;
let gapiInited = false;
let gisInited = false;

/* --------------------------------------------------------------
   1. Cargar script de gapi (Google API)
-------------------------------------------------------------- */
export function loadGapiScript() {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      // Ya cargado
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = (err) => {
      console.error("Error cargando gapi:", err);
      reject(err);
    };

    document.body.appendChild(script);
  });
}

/* --------------------------------------------------------------
   2. Cargar script de Google Identity Services (GIS)
-------------------------------------------------------------- */
function loadGisScript() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      // Ya cargado
      return resolve(true);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = (err) => {
      console.error("Error cargando GIS:", err);
      reject(err);
    };

    document.body.appendChild(script);
  });
}

/* --------------------------------------------------------------
   3. Inicializar cliente GAPI para Calendar
-------------------------------------------------------------- */
export async function initGapiClient() {
  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      return reject("gapi no está disponible (¿llamaste a loadGapiScript?).");
    }

    if (gapiInited && window.gapi.client) {
      return resolve(true);
    }

    window.gapi.load("client", async () => {
      try {
        await window.gapi.client.init({
          apiKey: null, // No usamos API pública, solo OAuth
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
        });

        gapiInited = true;
        resolve(true);
      } catch (err) {
        console.error("Error inicializando GAPI:", err);
        reject(err);
      }
    });
  });
}

/* --------------------------------------------------------------
   4. Inicializar Google Identity Services (tokenClient)
-------------------------------------------------------------- */
export async function initTokenClient() {
  await loadGisScript();

  if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
    throw new Error("Google Identity Services no está disponible.");
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: SCOPES,
    callback: () => {}, // se asigna dinámicamente
  });

  gisInited = true;
  return true;
}

/* --------------------------------------------------------------
   5. Solicitar acceso a Google Calendar (OAuth 2.0)
-------------------------------------------------------------- */
export async function requestCalendarAccess() {
  return new Promise((resolve, reject) => {
    if (!gisInited || !tokenClient) {
      return reject("GIS no inicializado. Llama a initTokenClient() primero.");
    }

    if (!gapiInited || !window.gapi?.client) {
      return reject("GAPI no inicializado. Llama a initGapiClient() primero.");
    }

    tokenClient.callback = (resp) => {
      if (resp.error) {
        console.error("Error OAuth Calendar:", resp.error);
        reject(resp.error);
        return;
      }

      console.log("Token OAuth Calendar OK:", resp);
      resolve(resp.access_token);
    };

    // Esto abre el popup de permisos de Calendar
    tokenClient.requestAccessToken();
  });
}

/* --------------------------------------------------------------
   6. Obtener lista de eventos próximos del calendario
-------------------------------------------------------------- */
export async function getCalendarEvents() {
  try {
    if (!window.gapi?.client?.calendar) {
      console.warn("Calendar API no inicializada. ¿Llamaste a initGapiClient()?");
      return [];
    }

    const response = await window.gapi.client.calendar.events.list({
      calendarId: "primary",
      maxResults: 10,
      orderBy: "startTime",
      singleEvents: true,
      timeMin: new Date().toISOString(),
    });

    return response.result.items || [];
  } catch (err) {
    console.error("Error obteniendo eventos de Calendar:", err);
    return [];
  }
}

/* --------------------------------------------------------------
   7. Crear un evento en Google Calendar
      (para usarlo cuando sincronicemos tareas)
-------------------------------------------------------------- */
export async function createCalendarEvent({ title, description, start, end }) {
  try {
    if (!window.gapi?.client?.calendar) {
      console.warn("Calendar API no inicializada. ¿Llamaste a initGapiClient()?");
      return null;
    }

    const event = {
      summary: title,
      description,
      start: {
        dateTime: start,
        timeZone: "America/Santo_Domingo",
      },
      end: {
        dateTime: end,
        timeZone: "America/Santo_Domingo",
      },
    };

    const request = window.gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    const response = await request;
    return response.result; // aquí viene event.id
  } catch (err) {
    console.error("Error creando evento en Calendar:", err);
    return null;
  }
}

/* --------------------------------------------------------------
   8. Actualizar un evento existente en Google Calendar
-------------------------------------------------------------- */
export async function updateCalendarEvent(
  eventId,
  { title, description, start, end }
) {
  try {
    if (!window.gapi?.client?.calendar) {
      console.warn("Calendar API no inicializada. ¿Llamaste a initGapiClient()?");
      return null;
    }

    const event = {
      summary: title,
      description,
      start: {
        dateTime: start,
        timeZone: "America/Santo_Domingo",
      },
      end: {
        dateTime: end,
        timeZone: "America/Santo_Domingo",
      },
    };

    const request = window.gapi.client.calendar.events.update({
      calendarId: "primary",
      eventId,
      resource: event,
    });

    const response = await request;
    return response.result;
  } catch (err) {
    console.error("Error actualizando evento en Calendar:", err);
    return null;
  }
}

/* --------------------------------------------------------------
   9. Eliminar un evento de Google Calendar
-------------------------------------------------------------- */
export async function deleteCalendarEvent(eventId) {
  try {
    if (!window.gapi?.client?.calendar) {
      console.warn("Calendar API no inicializada. ¿Llamaste a initGapiClient()?");
      return null;
    }

    const response = await window.gapi.client.calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    return response;
  } catch (err) {
    console.error("Error eliminando evento de Calendar:", err);
    return null;
  }
}
