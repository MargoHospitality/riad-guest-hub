# Branding Margo Hospitality Guest App

## Éléments de branding

### Meta tags (index.html)
- **Title FR:** "Margo Guest App | Votre Conciergerie Digitale"
- **Title EN:** "Margo Guest App | Your Digital Concierge"
- **Description FR:** "Accédez à votre portail personnalisé pour le check-in, les services et les recommandations locales."
- **Description EN:** "Access your personalized guest portal for check-in, services, and local recommendations."

### Favicon
- Fichier: `public/margo-logo-blue.png` (utilisé comme favicon)
- Logo Margo Hospitality en turquoise/bleu

### Logo
- Fichier: `public/margo-logo-blue.png` (logo principal)
- Logo principal Margo Hospitality en turquoise
- Utilisé aussi pour apple-touch-icon

### Open Graph Image (pour social media previews)
**Temporaire:** `public/og-image.png` (copie du logo carré)
**TODO:** Créer une vraie image OG 1200x630 px

Recommandations :
- Fond: couleur turquoise Margo (#1a9a9a) ou gradient élégant
- Logo Margo centré
- Texte: "Margo Guest App" en grand
- Sous-titre: "Your Digital Concierge" / "Votre Conciergerie Digitale"
- Format: PNG, 1200x630px (ratio 1.91:1 pour Facebook/LinkedIn/Twitter)

**Outils pour créer l'image:**
1. **Nano Banana (Gemini Imagen):** Utiliser le prompt AI ci-dessus
2. **Canva:** template "Facebook Post" ou "LinkedIn Post" (1200x630)
3. **Figma:** nouveau frame 1200x630, exporter en PNG
4. **Photoshop/GIMP:** nouveau document 1200x630px

**Composition recommandée:**
- Fond: blanc cassé (#f7f9fa) ou gradient turquoise subtil
- Logo Margo bleu centré (400x400px environ)
- Texte "Margo Guest App" en gros (48pt, #2c3e50)
- Sous-texte "Your Digital Concierge" (28pt, #7a8fa0)
- Espacement vertical harmonieux

**Une fois créée:**
```bash
# Copier l'image dans public/
cp new-og-image.png ~/projets/riad-guest-hub/public/og-image.png

# L'index.html pointe déjà vers /og-image.png
# Commit et push
cd ~/projets/riad-guest-hub
git add public/og-image.png
git commit -m "Update OG image with proper 1200x630 design"
git push
```

### URLs de l'app
- **Production:** https://riad-guest-hub.vercel.app
- **Staging:** (si déployé sur une autre branche Vercel)

### Social Media
- **Twitter:** @MargoHospitality (à créer si n'existe pas)
- **Facebook/LinkedIn:** Margo Hospitality

## Multi-langue

Le `index.html` détecte automatiquement la langue du navigateur et met à jour :
- Le titre de la page (`<title>`)
- Les meta descriptions
- Les tags Open Graph
- Les tags Twitter Card

Langues supportées :
- **FR** (français)
- **EN** (anglais, par défaut)

## Vérification

Pour tester les previews social media :
1. **Facebook Debugger:** https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator:** https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector:** https://www.linkedin.com/post-inspector/

Entrer l'URL de l'app et vérifier que :
- Le titre est correct
- La description est correcte
- L'image OG s'affiche (1200x630)

## Assets

Tous les assets de branding sont dans `public/` :
- `favicon.ico` - Favicon (256x256)
- `margo-logo.png` - Logo principal (605x605)
- `og-image.png` - Image Open Graph (1200x630) - **TODO**

## Couleurs Margo Hospitality

- **Turquoise principal:** #1a9a9a
- **Fond clair:** #f7f9fa
- **Texte principal:** #2c3e50
- **Texte secondaire:** #7a8fa0
