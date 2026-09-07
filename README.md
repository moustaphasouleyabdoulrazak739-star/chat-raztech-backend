# Chat RazTech — Backend

Backend temps réel pour l'application de chat **chat-raztech** : gestion des salons de discussion et diffusion des messages via WebSocket. Ne contient pas d'interface — c'est l'API/serveur consommé par le frontend [chat-raztech](https://chat-raztech.vercel.app).

## Fonctionnalités

- Salons de discussion prédéfinis : *Général*, *Tech*, *Détente*
- Rejoindre un salon avec un pseudo
- Diffusion des messages en temps réel aux membres du salon (Socket.IO)
- Messages système à l'arrivée / au départ d'un utilisateur

## Stack technique

- Node.js + Express 5
- Socket.IO 4
- CORS restreint au frontend déployé

## Lancer le projet en local

```bash
npm install
npm run dev
```
*(ou `node index.js` — le script `dev` avec rechargement automatique n'est pas configuré, ajoute `nodemon` si besoin)*

Le serveur écoute par défaut sur `http://localhost:3001` (configurable via la variable d'environnement `PORT`).

> ⚠️ L'origine CORS est actuellement codée en dur sur `https://chat-raztech.vercel.app`. Pour tester en local avec le frontend sur `http://localhost:5173`, adapte temporairement `origin` dans `index.js`.

## Événements Socket.IO

| Événement (client → serveur) | Payload | Description |
|---|---|---|
| `rejoindre_salon` | `{ salon, pseudo }` | Rejoint un salon existant |
| `envoyer_message` | `{ texte }` | Envoie un message au salon courant |

| Événement (serveur → client) | Payload | Description |
|---|---|---|
| `nouveau_message` | `{ pseudo, texte, horodatage }` | Nouveau message diffusé au salon |
| `message_systeme` | `{ texte, horodatage }` | Notification d'arrivée / départ d'un utilisateur |

## Déploiement

Pensé pour un déploiement sur Render (ou tout hébergeur Node compatible WebSocket). Penser à mettre à jour l'origine CORS avec l'URL réelle du frontend déployé.
