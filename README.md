# 📱 Auth App – React Native + Expo Router + Supabase

Une application mobile **React Native** construite avec **Expo** et **Expo Router**, intégrant un système d’**authentification avec Supabase** et une navigation par **onglets** (Accueil & Explorer).  

---

## 🚀 Fonctionnalités

- 👤 **Authentification sécurisée**
  - Inscription avec hashage du mot de passe (**bcryptjs**)
  - Connexion avec vérification des credentials
  - Gestion d’un profil utilisateur (prénom, nom, téléphone, email)
  - Redirection automatique vers le tableau de bord après connexion

- 🗂️ **Navigation multi-écrans**
  - (auth) : Connexion & Inscription
  - (tabs) : Accueil & Explorer

- 🔐 **Protection des routes**
  - Redirection automatique vers l’écran de connexion si l’utilisateur n’est pas authentifié
  - Accès au tableau de bord uniquement après login

- 🛠️ **Technos modernes**
  - [React Native](https://reactnative.dev/) ⚛️
  - [Expo](https://expo.dev/) 📱
  - [Expo Router](https://expo.github.io/router/docs) 🗂️
  - [Supabase](https://supabase.com/) 🗄️ (base de données & API)
  - [bcryptjs](https://www.npmjs.com/package/bcryptjs) 🔑 (hash des mots de passe)

---

## 📂 Structure du projet

```
/app
 ├── (auth)/               # Groupe Auth
 │    ├── _layout.tsx      # Stack Auth
 │    ├── index.tsx        # Redirect -> sign-in
 │    ├── sign-in.tsx      # Page de connexion
 │    └── sign-up.tsx      # Page d’inscription
 │
 ├── (tabs)/               # Groupe Tabs
 │    ├── _layout.tsx      # Tabs layout
 │    ├── index.tsx        # Accueil (tableau de bord)
 │    └── explore.tsx      # Explorer
 │
 └── _layout.tsx           # Root Layout (Stack racine)

/components                # Composants réutilisables (Button, FormInput…)
/lib                       # Supabase client & validation (Zod)
```

---

## ▶️ Installation et lancement

### 1. Cloner le projet
```bash
git clone https://github.com/ton-compte/auth-app.git
cd auth-app
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configurer Supabase
Crée un fichier `lib/supabase.ts` :

```ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

Ajoute tes clés dans `.env` ou `app.config.js` :

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyxxxx...
```

### 4. Lancer l’application
```bash
npx expo start -c
```

- 📱 Scanner le QR Code avec **Expo Go** (iOS/Android)  
- 🖥️ Ou lancer sur un simulateur (iOS : `i`, Android : `a`)

---

## 🗄️ Configuration Supabase

1. Crée un projet sur [app.supabase.com](https://app.supabase.com)  
2. Dans l’onglet **Table Editor**, crée deux tables :

### Table `users`
| Colonne        | Type      | Contraintes            |
|----------------|-----------|------------------------|
| id             | uuid      | primary key, default uuid_generate_v4() |
| email          | text      | unique                 |
| password_hash  | text      | non null               |

### Table `profiles`
| Colonne     | Type   | Contraintes      |
|-------------|--------|------------------|
| email       | text   | primary key, fk vers `users.email` |
| first_name  | text   |                  |
| last_name   | text   |                  |
| phone       | text   |                  |

---

## ⚙️ Scripts utiles

- **Start** : `npx expo start`  
- **Reset cache** : `npx expo start -c`  
- **Build** : `eas build --platform android` (ou iOS)  

---

## 📌 Améliorations prévues

- [ ] Ajouter une vraie gestion de session (SecureStore / AsyncStorage)  
- [ ] Implémenter la déconnexion  
- [ ] Thématisation (Dark/Light mode)  
- [ ] Tests unitaires (Jest, Testing Library)  
- [ ] CI/CD avec Expo EAS  

---

## 👨‍💻 Auteur

Projet développé avec ❤️ par **[Ton Nom]**.  
N’hésite pas à contribuer ou à proposer des améliorations 🚀  
