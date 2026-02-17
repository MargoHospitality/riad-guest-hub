# riad-guest-hub — Contexte

## Stack
- React + Vite, déployé sur Vercel (auto-deploy sur push main)
- i18next (FR/EN, détection langue navigateur)
- React Query (cache + fetching)
- shadcn/ui + Tailwind
- Une seule variable d'env : `VITE_GEA_API_URL` (fallback codé : `https://gea.margo-hospitality.com/api/v1`)

## Détection du tenant
Pas de fichier de config runtime. La property est déterminée uniquement par le token guest :
1. Token depuis `?token=` (priorité) OU `localStorage['guest_app_token']`
2. `POST /validate-token {token}` → retourne `reservation.property_id` + `branding`
3. Tous les appels suivants utilisent `property_id` (pages/featured items) ou `cloudbeds_property_id` (config check-in)

## Flux de validation du token
```
URL ?token= → AppContext → POST /validate-token → {reservation, branding}
                                                        ↓
                                               applyBrandingColors() (variables CSS)
                                               useCheckinConfig() ← cloudbeds_property_id
                                               usePages() ← property_id
```

## Appels API GEA (base : `https://gea.margo-hospitality.com/api/v1`)
| Endpoint | Payload | Réponse |
|---|---|---|
| `POST /validate-token` | `{token}` | `{reservation, branding}` |
| `GET /branding/:propertyId` | — | objet branding |
| `GET /pages/:propertyId` | — | `[{code, title_fr, title_en, route, icon, external_url}]` |
| `GET /featured-items/:propertyId?lang=` | — | `[{id, title, image_url, link_url, order_index}]` |
| `GET /checkin/config/:cloudbedsPropertyId` | — | flags étapes + prix repas |
| `GET /checkin/reservation-info/:token` | — | liste guests + totaux |
| `POST /reviews` | note + réponses | — |

## Convention IDs (critique)
- `property_id` (interne GEA, ex: "3", "24") → pages, featured items, branding
- `cloudbeds_property_id` (ex: "9462", "319158") → config check-in UNIQUEMENT

## Persistance du token
Stocké dans `localStorage['guest_app_token']`. Le param URL a priorité à chaque visite.
Tous les liens de navigation construits via `withToken(path, token)` (`src/lib/navigation.ts`).

## Composants clés
- `AppContext` — état global token + branding + validation
- `MenuDrawer` — nav dynamique via `usePages()`, `external_url` → `<a target="_blank">`
- `CheckinGate` → `useCheckinNavigation` (saut automatique des étapes désactivées)
- `ReviewPage` — formulaire post-séjour, redirige vers Google Review si note ≥ 4
