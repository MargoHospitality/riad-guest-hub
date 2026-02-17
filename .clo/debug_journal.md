# riad-guest-hub — Debug Journal

## Focus actuel
Aucun incident bloquant.
Focus : validation E2E Sierra (flow check-in complet → note Cloudbeds → mise à jour statuts).

---

## Zones fragiles connues

### 1. Persistance du token (localStorage)
Si le guest vide son localStorage entre deux étapes, le token est perdu → écran vide.
Pas d'UI de récupération. Mitigation : token toujours dans les liens via `withToken()`.

### 2. Convention ID dans `useCheckinConfig`
Utilise `cloudbeds_property_id` (pas `property_id`). Si ce champ est absent dans la réponse
`validate-token`, le fetch config échoue silencieusement et toutes les étapes sont affichées.

### 3. Sélection explicite des colonnes côté GEA
`usePages` dépend du champ `external_url` retourné par GEA. A cassé une fois quand la
colonne a été ajoutée sans mettre à jour le `.select()` Drizzle. Règle : toujours des
colonnes explicites dans les requêtes GEA.

---

## Résolus

### [2026-02-16] Suppression des IDs property codés en dur
Tous les composants utilisent désormais `validation.reservation.property_id` depuis le contexte.
Commits : `54a6341`, `bbb8e6e`, `ca22388`.

### [2026-02-16] Calcul total adultes multi-chambres
`validate-token` somme les adultes sur toutes les chambres (pas uniquement `assigned[0]`).
Protégé par test dans GEA : `server/__tests__/publicApi.test.ts`.
