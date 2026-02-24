import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const FALLBACK_DATA = {
  scenarios: [
    { id: 1, type: 'phishing', title: 'Mondial Relay - Colis en attente', sender: 'noreply@mondial-relay-securite.com', content: 'Votre colis n°4429 est bloqué. Payez 1.99€ de frais de douane pour débloquer la livraison.', clues: ['Expéditeur suspect', 'Urgence créée', 'Lien non officiel'], feedback: 'Bien joué ! Un vrai mail proviendrait de mondialrelay.fr.' },
    { id: 2, type: 'legit', title: 'Amazon - Confirmation de commande', sender: 'confirmation@amazon.fr', content: 'Merci pour votre achat. Retrouvez le récapitulatif dans votre espace client.', clues: ['Domaine officiel', 'Pas de demande de paiement directe'], feedback: 'Exact. C’est un message transactionnel classique.' },
    { id: 3, type: 'phishing', title: 'Ameli - Remboursement', sender: 'service@ameli-info-france.net', content: 'Un nouveau remboursement de 145.00€ est disponible. Cliquez ici pour mettre à jour vos coordonnées bancaires.', clues: ['Demande de RIB par mail', 'Lien .net au lieu de .fr'], feedback: 'Correct ! L’Assurance Maladie ne demande jamais de coordonnées bancaires par email.' }
  ],
  quiz: [
    { q: "Qu'est-ce qu'un lien 'shortener' (bit.ly) cache souvent ?", options: ["Une réduction de prix", "L'URL réelle de destination", "Un virus automatique"], correct: 1 },
    { q: "Une icône de cadenas (HTTPS) garantit-elle que le site est honnête ?", options: ["Oui, c'est sécurisé", "Non, cela crypte juste les données", "Seulement sur mobile"], correct: 1 },
    { q: "Quel est le signal le plus fiable d'un phishing ?", options: ["L'absence de logo", "Les fautes d'orthographe", "L'adresse email de l'expéditeur incohérente"], correct: 2 }
  ]
};

export default function App() {
  const [tab, setTab] = useState('simulation');
  const [isOnline, setIsOnline] = useState(false);
  const [scenarios, setScenarios] = useState(FALLBACK_DATA.scenarios);
  const [quiz, setQuiz] = useState(FALLBACK_DATA.quiz);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const health = await fetch(`${API_BASE}/api/health`).then(res => res.json());
        if (health.ok) {
          setIsOnline(true);
          const s = await fetch(`${API_BASE}/api/scenarios`).then(res => res.json());
          const q = await fetch(`${API_BASE}/api/quiz`).then(res => res.json());
          setScenarios(s || FALLBACK_DATA.scenarios);
          setQuiz(q || FALLBACK_DATA.quiz);
        }
      } catch (e) {
        setIsOnline(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = (type) => {
    const item = scenarios[currentScenario];
    if (item.type === type) {
      setFeedback({ msg: `✅ ${item.feedback}`, type: 'success' });
    } else {
      setFeedback({ msg: `❌ Erreur : ${item.clues.join(', ')}`, type: 'error' });
    }
    setTimeout(() => {
      setFeedback(null);
      setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    }, 3000);
  };

  const handleQuiz = async (idx) => {
    let newScore = score;
    if (idx === quiz[quizIndex].correct) newScore += 1;
    setScore(newScore);

    if (quizIndex + 1 < quiz.length) {
      setQuizIndex(quizIndex + 1);
    } else {
      setShowScore(true);
      if (isOnline) {
        try {
          await fetch(`${API_BASE}/api/score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score: newScore })
          });
        } catch (e) { console.error("Score sync failed"); }
      }
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">🛡️ AntiPhish<span>Lab</span></div>
        <nav className="nav">
          <button onClick={() => setTab('simulation')} className={tab === 'simulation' ? 'active' : ''}>Simulation</button>
          <button onClick={() => setTab('quiz')} className={tab === 'quiz' ? 'active' : ''}>Quiz Interactif</button>
          <button onClick={() => setTab('checklist')} className={tab === 'checklist' ? 'active' : ''}>Checklist</button>
        </nav>
        <div className={`status-badge ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? '● API Connectée' : '● Mode démo (offline)'}
        </div>
      </header>

      <main className="content">
        {feedback && <div className={`toast ${feedback.type}`}>{feedback.msg}</div>}

        {tab === 'simulation' && (
          <section className="fade-in">
            <h2 className="section-title">Analyse d'email</h2>
            <div className="email-card">
              <div className="email-header">
                <p><strong>De :</strong> {scenarios[currentScenario].sender}</p>
                <p><strong>Objet :</strong> {scenarios[currentScenario].title}</p>
              </div>
              <div className="email-body">
                <p>{scenarios[currentScenario].content}</p>
                <div className="mock-link">http://clic-securise-validation.com/login</div>
              </div>
              <div className="email-actions">
                <button className="btn btn-safe glow-hover" onClick={() => handleAction('legit')}>C'est légitime</button>
                <button className="btn btn-danger glow-hover" onClick={() => handleAction('phishing')}>Signaler Phishing</button>
              </div>
            </div>
          </section>
        )}

        {tab === 'quiz' && (
          <section className="fade-in">
            <h2 className="section-title">Testez vos connaissances</h2>
            {!showScore ? (
              <div className="quiz-card">
                <h3>{quiz[quizIndex].q}</h3>
                <div className="options-grid">
                  {quiz[quizIndex].options.map((opt, i) => (
                    <button key={i} className="option-btn glow-hover" onClick={() => handleQuiz(i)}>{opt}</button>
                  ))}
                </div>
                <p className="progress">Question {quizIndex + 1} / {quiz.length}</p>
              </div>
            ) : (
              <div className="quiz-card score-card">
                <h3>Résultat Final</h3>
                <div className="score-circle">{score} / {quiz.length}</div>
                <button className="btn btn-primary" onClick={() => {setShowScore(false); setQuizIndex(0); setScore(0);}}>Recommencer</button>
              </div>
            )}
          </section>
        )}

        {tab === 'checklist' && (
          <section className="fade-in">
            <h2 className="section-title">Réflexes de sécurité</h2>
            <div className="grid">
              <div className="info-card glow-hover">
                <h4>🔎 Vérifier l'expéditeur</h4>
                <p>Ne regardez pas seulement le nom, mais l'adresse réelle (après le @).</p>
              </div>
              <div className="info-card glow-hover">
                <h4>🔗 Survoler les liens</h4>
                <p>Laissez votre souris sur un bouton sans cliquer pour voir l'URL réelle en bas du navigateur.</p>
              </div>
              <div className="info-card glow-hover">
                <h4>🚨 L'urgence est suspecte</h4>
                <p>Les services officiels ne vous menaceront jamais de clôturer un compte sous 2 heures par email.</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2026 AntiPhish Lab — Plateforme Pédagogique Cybersecurity</p>
      </footer>
    </div>
  );
}