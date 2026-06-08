export type UtmPayload = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
};

const STORAGE_KEY = "qac.utm";

const EMPTY_UTM: UtmPayload = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
};

function readStorage(): UtmPayload {
  if (typeof window === "undefined") return EMPTY_UTM;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_UTM;
    const parsed = JSON.parse(raw) as Partial<UtmPayload>;
    return {
      utmSource: parsed.utmSource ?? "",
      utmMedium: parsed.utmMedium ?? "",
      utmCampaign: parsed.utmCampaign ?? "",
      utmContent: parsed.utmContent ?? "",
      utmTerm: parsed.utmTerm ?? "",
    };
  } catch {
    return EMPTY_UTM;
  }
}

function writeStorage(payload: UtmPayload) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // silencioso por design
  }
}

export function captureAndPersistUtms(): UtmPayload {
  if (typeof window === "undefined") return EMPTY_UTM;

  const params = new URLSearchParams(window.location.search);
  const fromUrl: UtmPayload = {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
    utmTerm: params.get("utm_term") ?? "",
  };

  const hasAnyFromUrl = Object.values(fromUrl).some(
    (value) => value && value.trim().length > 0,
  );

  if (hasAnyFromUrl) {
    writeStorage(fromUrl);
    return fromUrl;
  }

  return readStorage();
}

export function readUtms(): UtmPayload {
  return readStorage();
}
