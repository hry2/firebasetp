const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "antiphish-api" });
});

// Scénarios pédagogiques (safe)
app.get("/api/scenarios", (_req, res) => {
  res.json([
    { id: "s1", title: "Colis en attente", type: "phishing", signals: ["Urgence", "Lien raccourci", "Domaine étrange"] },
    { id: "s2", title: "Facture disponible", type: "phishing", signals: ["Pièce jointe suspecte", "Langage alarmiste"] },
    { id: "s3", title: "Confirmation de RDV", type: "legit", signals: ["Domaine cohérent", "Pas d'urgence", "Info attendue"] }
  ]);
});

// Quiz pédagogique
app.get("/api/quiz", (_req, res) => {
  res.json([
    {
      id: "q1",
      question: "Quel est un indicateur fréquent de phishing ?",
      choices: ["URL cohérente", "Urgence + menace", "Signature complète"],
      answer: 1
    },
    {
      id: "q2",
      question: "Que faire avant de cliquer ?",
      choices: ["Cliquer vite", "Survoler le lien / vérifier le domaine", "Répondre au mail"],
      answer: 1
    }
  ]);
});

// Score (on ne stocke rien)
app.post("/api/score", (req, res) => {
  const score = Number(req.body?.score ?? 0);
  res.json({ received: score, stored: false });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`API listening on 0.0.0.0:${port}`));