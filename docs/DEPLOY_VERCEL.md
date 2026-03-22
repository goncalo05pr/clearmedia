# Deployer ClearMedia sur Vercel

## Automatisation (Windows)

Le depot Git est initialise en local avec un premier commit.

1. Installe **GitHub CLI** : `winget install GitHub.cli`
2. Connecte-toi : `gh auth login`
3. Connecte **Vercel** une fois : `npx vercel login` (ou suis le lien affiche)
4. Depuis la racine du projet :

```powershell
npm run deploy:script
```

Le script : commit les changements en attente, cree le repo GitHub `clearmedia` (prive) si besoin, pousse le code, puis lance `vercel deploy --prod`.

Ensuite sur [vercel.com](https://vercel.com) : lie le projet au repo Git importe (ou reutilise le deploiement CLI) et ajoute les **variables d environnement**.

---

## Avant tout

1. **Ne commite jamais** `.env.local` (deja ignore par `.gitignore`).
2. Le code doit etre sur un **depot Git** (GitHub, GitLab ou Bitbucket).

---

## Etape 1 : Pousser le projet sur Git

Dans le dossier du projet (si ce n est pas deja fait) :

```bash
git init
git add .
git commit -m "ClearMedia - ready for Vercel"
```

Cree un depot vide sur GitHub, puis :

```bash
git remote add origin https://github.com/TON_USER/TON_REPO.git
git branch -M main
git push -u origin main
```

---

## Etape 2 : Importer le projet sur Vercel

1. Va sur [vercel.com](https://vercel.com) et connecte-toi (GitHub recommande).
2. **Add New** > **Project** > choisis ton depot.
3. **Framework Preset** : Next.js (detecte automatiquement).
4. **Root Directory** : laisse vide si `package.json` est a la racine du repo. Si ton app est dans un sous-dossier, indique ce dossier.
5. **Build Command** : `npm run build` (par defaut).
6. **Output** : laisse Vercel gerer (App Router).

Ne clique pas encore sur Deploy si tu veux ajouter les variables d environnement avant la premiere build (recommande).

---

## Etape 3 : Variables d environnement (Vercel)

Dans **Settings** > **Environment** > **Environment Variables**, ajoute les memes cles que dans `.env.local`, pour **Production** (et **Preview** si tu veux tester les branches).

| Variable | Production | Preview (optionnel) |
|----------|------------|---------------------|
| `NEXT_PUBLIC_SITE_URL` | `https://ton-domaine.com` ou `https://ton-projet.vercel.app` | URL de preview Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | idem |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | cle anon | idem |
| `SUPABASE_SERVICE_ROLE_KEY` | cle **service role** (serveur uniquement) | idem si tu testes webhook |
| `STRIPE_SECRET_KEY` | cle secrete Stripe live ou test | idem |
| `STRIPE_WEBHOOK_SECRET` | secret du webhook **production** Stripe | secret webhook test si besoin |
| `STRIPE_PRICE_FORMATION_*` | tes `price_...` si tu les utilises | idem |

**Important : `NEXT_PUBLIC_SITE_URL`**

- Apres le **premier** deploiement, Vercel te donne une URL du type `https://clearmedia-xxxxx.vercel.app`.
- Mets cette URL (ou ton domaine custom) dans `NEXT_PUBLIC_SITE_URL` pour la prod.
- Puis **Redeploy** le projet pour que le build et le runtime utilisent la bonne valeur.

---

## Etape 4 : Supabase (obligatoire apres deploiement)

Dans Supabase : **Authentication** > **URL Configuration**

1. **Site URL** : ton URL de prod, ex. `https://clearmedia-xxxxx.vercel.app` (ou ton domaine).
2. **Redirect URLs** : ajoute au minimum :
   - `http://localhost:3000/**`
   - `https://*.vercel.app/**`
   - `https://ton-domaine.com/**` si tu as un domaine custom

Sans ca, les liens des emails (confirmation, reset mot de passe) peuvent echouer.

---

## Etape 5 : Stripe (paiements en prod)

1. **Stripe Dashboard** > **Developers** > **Webhooks** > **Add endpoint**
2. URL : `https://TON_URL_VERCEL_OU_DOMAINE/api/stripe-webhook`
3. Evenement : `checkout.session.completed`
4. Copie le **Signing secret** (`whsec_...`) dans Vercel comme `STRIPE_WEBHOOK_SECRET` (environnement Production).
5. Redeploie si necessaire.

---

## Etape 6 : Domaine custom (optionnel)

1. Vercel > ton projet > **Settings** > **Domains**
2. Ajoute ton domaine et suis les instructions DNS (chez ton registrar).

Mets a jour `NEXT_PUBLIC_SITE_URL` et Supabase **Site URL** + **Redirect URLs** avec ce domaine.

---

## En cas de probleme

| Probleme | Piste |
|----------|--------|
| Build qui echoue | Regarde les logs **Deployments** sur Vercel ; verifie `npm run build` en local. |
| Auth Supabase qui ne marche pas | Redirect URLs + Site URL + `NEXT_PUBLIC_SITE_URL`. |
| Paiement OK mais pas d acces formation | Webhook Stripe : URL prod, secret `whsec_` correct, `SUPABASE_SERVICE_ROLE_KEY` sur Vercel. |
| Variables non prises en compte | **Redeploy** apres chaque changement d env. |

---

## Commande utile

Redeploiement depuis ta machine (si CLI Vercel installee) :

```bash
npx vercel --prod
```

Sinon : onglet **Deployments** > **Redeploy** sur Vercel.
