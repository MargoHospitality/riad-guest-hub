# riad-guest-hub — Runbook

## Développement local
```bash
cd ~/projets/riad-guest-hub
npm run dev       # Serveur Vite → http://localhost:8080
npm run build     # Build production → dist/
npm run preview   # Prévisualiser le build en local
npm test          # Vitest
```

## Tester la validation de token (manuel)
```bash
curl -s -X POST https://gea.margo-hospitality.com/api/v1/validate-token \
  -H "Content-Type: application/json" \
  -d '{"token":"<TOKEN>"}' | jq '{property_id:.data.reservation.property_id, branding:.data.branding.property_name}'
```

Tokens de test (ne pas versionner les valeurs réelles) :
- `MASSIBA_TEST_TOKEN=<replace-with-local-env>`
- `SIERRA_TEST_TOKEN=<replace-with-local-env>`

Stocker les vraies valeurs dans un `.env.local` non commité ou dans ton gestionnaire de secrets.

## Tester le changement de branding entre properties
1. Ouvrir `http://localhost:8080/?token=$MASSIBA_TEST_TOKEN` → vérifier branding Massiba (couleurs, logo, nom)
2. Ouvrir `http://localhost:8080/?token=$SIERRA_TEST_TOKEN` → vérifier branding Sierra
3. Contrôler : variable CSS `--primary`, URL du logo, nom property dans le header

## Déploiement Vercel
- Auto-deploy sur push `main` (aucune action manuelle)
- Confirmer le commit déployé : https://vercel.com/margo-hospitality/riad-guest-hub → onglet "Deployments"
- URL de preview : `https://riad-guest-hub-git-<branche>.vercel.app`

## Activer / vérifier PostHog
1. Ajouter `VITE_POSTHOG_KEY=<clé>` dans Vercel → Settings → Environment Variables
2. Redéployer (push sur main suffit)
3. Vérifier les events : PostHog dashboard → Live Events
4. En dev local : ajouter `VITE_POSTHOG_KEY=<clé>` dans `.env.local` (non commité)
5. Sans clé configurée : aucun event envoyé, aucune erreur — app fonctionne normalement
