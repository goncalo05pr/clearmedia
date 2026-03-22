# ClearMedia - Next.js + Supabase + Stripe

Projet Next.js pour l'agence ClearMedia:

- page d accueil marketing (`/`)
- page formations avec 3 offres (`/formations`)
- inscription / connexion Supabase + emails confirmation / reset (`/connexion`, `/auth/callback`, `/auth/reset-password`)
- espace membre debloque apres achat (`/espace-membre`)
- programme par formation: modules et lecons video (`/formations/[id]`, protege si achat)
- paiements Stripe Checkout (Price IDs ou montant dynamique) + webhook

## 1) Installation

```bash
npm install
copy .env.example .env.local
```

Sur macOS/Linux: `cp .env.example .env.local`

Renseigne les variables dans `.env.local`.

## 2) Variables d environnement

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Optionnel (recommande en prod)
STRIPE_PRICE_FORMATION_SOCIAL_ADS=price_...
STRIPE_PRICE_FORMATION_FUNNEL_PREMIUM=price_...
STRIPE_PRICE_FORMATION_COPY_CLOSING=price_...
```

- **NEXT_PUBLIC_SITE_URL** : meme URL que celle ou tourne le site (local, domaine prod, ou URL Vercel). Necessaire pour les liens dans les emails Supabase.

## 3) Setup Supabase (SQL + URLs)

### SQL

Execute dans l editeur SQL Supabase:

```sql
create table if not exists public.purchases (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  formation_id text not null,
  stripe_session_id text unique not null,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

alter table public.purchases enable row level security;

create policy "Users can read their own purchases"
on public.purchases
for select
to authenticated
using (auth.uid() = user_id);
```

### URLs de redirection (Authentication > URL Configuration)

Dans **Site URL**, mets ton URL publique, par ex. `https://ton-domaine.com` ou `http://localhost:3000` en dev.

Dans **Redirect URLs**, ajoute au minimum:

- `http://localhost:3000/**`
- `https://ton-domaine.com/**`
- `https://*.vercel.app/**` (previews Vercel)

Les liens email (confirmation, reset mot de passe) pointent vers `/auth/callback` puis la route interne voulue.

### Emails

Les templates par defaut Supabase envoient les liens vers ton **Site URL**. Verifie **Authentication > Email Templates** si tu veux personnaliser le texte (marque ClearMedia, etc.).

## 4) Stripe : produits, prix, webhook

### Price IDs (recommande en production)

1. Stripe Dashboard > **Products** > creer un produit par formation (paiement unique, EUR).
2. Recupere chaque **Price ID** (`price_...`) et colle-le dans `.env.local` (variables `STRIPE_PRICE_FORMATION_*`).
3. Si une variable est vide, l app utilise le montant defini dans `src/lib/formations.ts` (mode developpement / fallback).

### Webhook

En local:

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Recupere le secret `whsec_...` dans `STRIPE_WEBHOOK_SECRET`.

En production (Stripe Dashboard > Webhooks), ajoute l endpoint:

`https://TON_DOMAINE/api/stripe-webhook`

Evenement: `checkout.session.completed`.

## 5) Deploiement Vercel

Guide pas a pas (Git, variables, Supabase, Stripe, domaine) : **[docs/DEPLOY_VERCEL.md](./docs/DEPLOY_VERCEL.md)**.

Resume :

1. Push le projet sur GitHub/GitLab/Bitbucket (ou import manuel).
2. [vercel.com](https://vercel.com) > **Add New Project** > import du repo.
3. **Environment Variables** : memes noms que `.env.local` (ne commite pas les secrets). Pour `NEXT_PUBLIC_SITE_URL`, mets l URL Vercel (`https://xxx.vercel.app`) ou ton domaine custom.
4. Redeploie apres chaque changement de variables.

Webhook Stripe prod: `https://ton-domaine-ou-vercel.app/api/stripe-webhook`.

Supabase Redirect URLs: ajoute `https://*.vercel.app/**` + ton domaine.

## 6) Lancer en local

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Routes principales

| Route | Role |
|-------|------|
| `/` | Accueil marketing |
| `/formations` | Catalogue (badge **Deja achete** si paye) |
| `/formations/[formationId]` | Programme + videos (achat requis) |
| `/connexion` | Inscription / connexion / mot de passe oublie |
| `/auth/callback` | Echange code Supabase (emails) |
| `/auth/reset-password` | Nouveau mot de passe apres email |
| `/auth/auth-code-error` | Lien email invalide |
| `/espace-membre` | Tableau de bord membre |
| `/api/checkout-session` | Session Stripe Checkout |
| `/api/stripe-webhook` | Validation paiement + enregistrement achat |
