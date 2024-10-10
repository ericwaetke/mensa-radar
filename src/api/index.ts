import { action, cache } from '@solidjs/router'
import { getMensa as gM1, getMensas as gM, getServings as gS } from './server'

// export const getUser = cache(gU, "user");
// export const loginOrRegister = action(lOR, "loginOrRegister");
// export const logout = action(l, "logout");
export const getMensas = cache(gM, 'mensas')
export const getServings = cache(gS, 'servings')
export const getMensa = cache(gM1, 'mensa')
