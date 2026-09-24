export const THEME_STORAGE_KEY = "theme";

/**
 * Runs in <head> before first paint so a saved choice never flashes the
 * other theme. Without a saved choice the CSS follows the system preference.
 * Lives outside the "use client" toggle so the server layout can inline it.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
