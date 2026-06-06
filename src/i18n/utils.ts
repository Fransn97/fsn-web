import { ui, defaultLang, type Lang } from "./ui";

/** Detecta el idioma a partir de la URL (/en/... => en, resto => es). */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split("/");
  if (seg === "en") return "en";
  return defaultLang;
}

/** Devuelve una función t(key) para el idioma dado. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Prefija una ruta con el idioma (es = raíz, en = /en). */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return `/en${clean === "/" ? "" : clean}`;
}

/** Dada la URL actual, devuelve la ruta equivalente en el otro idioma. */
export function alternatePath(url: URL, to: Lang): string {
  let path = url.pathname;
  // quita el prefijo /en si está
  if (path.startsWith("/en/")) path = path.slice(3);
  else if (path === "/en") path = "/";
  return localizePath(path, to);
}
