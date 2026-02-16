# Branding Margo Hospitality Guest App

## Éléments de branding

### Meta tags (index.html)
- **Title FR:** "Margo Guest App | Votre Conciergerie Digitale"
- **Title EN:** "Margo Guest App | Your Digital Concierge"
- **Description FR:** "Accédez à votre portail personnalisé pour le check-in, les services et les recommandations locales."
- **Description EN:** "Access your personalized guest portal for check-in, services, and local recommendations."

### Favicon
- Fichier: `public/favicon.ico` (256x256 PNG)
- Logo Margo Hospitality

### Logo
- Fichier: `public/margo-logo.png` (605x605 PNG)
- Logo principal Margo Hospitality

### Open Graph Image (pour social media previews)
**TODO:** Créer `public/og-image.png` (1200x630 px)

Recommandations :
- Fond: couleur turquoise Margo (#1a9a9a) ou gradient élégant
- Logo Margo centré
- Texte: "Margo Guest App" en grand
- Sous-titre: "Your Digital Concierge" / "Votre Conciergerie Digitale"
- Format: PNG, 1200x630px (ratio 1.91:1 pour Facebook/LinkedIn/Twitter)

**Outils pour créer l'image:**
1. Canva: template "Facebook Post" ou "LinkedIn Post" (1200x630)
2. Figma: nouveau frame 1200x630, exporter en PNG
3. Photoshop/GIMP: nouveau document 1200x630px

**Une fois créée:**
```bash
# Copier l'image dans public/
cp og-image.png ~/projets/riad-guest-hub/public/

# Mettre à jour index.html (déjà fait)
# Les meta tags pointent vers /og-image.png
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
