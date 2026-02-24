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

// --- GÉNÉRATEUR DE CIRCUIT IMPRIMÉ (PCB) HAUTE DENSITÉ ---
const CircuitBackground = () => {
  // Tracés structurés imitant un véritable circuit imprimé (Buses parallèles, angles 45°)
  const pcbPaths = [
    // Top Left quadrant
    "M -50 150 L 150 150 L 250 250 L 250 350",
    "M -50 180 L 120 180 L 220 280 L 220 350",
    "M -50 210 L 90 210 L 190 310 L 190 350",
    "M 150 -50 L 150 120 L 270 240 L 380 240",
    "M 180 -50 L 180 90 L 240 150 L 380 150",
    "M 210 -50 L 210 60 L 300 150 L 380 150",
    "M 80 280 L 130 280 L 180 330 L 180 380",
    "M 320 80 L 320 130 L 270 180 L 220 180",

    // Bottom Left quadrant
    "M -50 850 L 150 850 L 250 750 L 250 650",
    "M -50 820 L 120 820 L 220 720 L 220 650",
    "M -50 790 L 90 790 L 190 690 L 190 650",
    "M 150 1050 L 150 880 L 270 760 L 380 760",
    "M 180 1050 L 180 910 L 240 850 L 380 850",
    "M 210 1050 L 210 940 L 300 850 L 380 850",
    "M 80 720 L 130 720 L 180 670 L 180 620",
    "M 320 920 L 320 870 L 270 820 L 220 820",

    // Top Right quadrant
    "M 1050 150 L 850 150 L 750 250 L 750 350",
    "M 1050 180 L 880 180 L 780 280 L 780 350",
    "M 1050 210 L 910 210 L 810 310 L 810 350",
    "M 850 -50 L 850 120 L 730 240 L 620 240",
    "M 820 -50 L 820 90 L 760 150 L 620 150",
    "M 790 -50 L 790 60 L 700 150 L 620 150",
    "M 920 280 L 870 280 L 820 330 L 820 380",
    "M 680 80 L 680 130 L 730 180 L 780 180",

    // Bottom Right quadrant
    "M 1050 850 L 850 850 L 750 750 L 750 650",
    "M 1050 820 L 880 820 L 780 720 L 780 650",
    "M 1050 790 L 910 790 L 810 690 L 810 650",
    "M 850 1050 L 850 880 L 730 760 L 620 760",
    "M 820 1050 L 820 910 L 760 850 L 620 850",
    "M 790 1050 L 790 940 L 700 850 L 620 850",
    "M 920 720 L 870 720 L 820 670 L 820 620",
    "M 680 920 L 680 870 L 730 820 L 780 820",

    // Center peripheral buses
    "M 320 400 L 270 400 L 220 450 L 220 550 L 270 600 L 320 600",
    "M 680 400 L 730 400 L 780 450 L 780 550 L 730 600 L 680 600",
    "M 400 320 L 400 270 L 450 220 L 550 220 L 600 270 L 600 320",
    "M 400 680 L 400 730 L 450 780 L 550 780 L 600 730 L 600 680",
    
    // Abstract lines crossing
    "M 0 500 L 150 500 L 200 450",
    "M 1000 500 L 850 500 L 800 550",
    "M 500 0 L 500 150 L 550 200",
    "M 500 1000 L 500 850 L 450 800"
  ];

  // Sélection aléatoire de lignes qui seront animées avec la lumière blanche
  const animatedIndices = [0, 3, 8, 11, 16, 19, 24, 27, 32, 33, 34, 35, 36, 37];

  return (
    <svg className="pcb-bg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
      
      {/* Puce Centrale (Microprocesseur) */}
      <g className="pcb-chip">
        <rect x="380" y="380" width="240" height="240" rx="12" className="pcb-chip-outer" />
        <rect x="410" y="410" width="180" height="180" rx="8" className="pcb-chip-inner" />
        {/* Connecteurs de la puce */}
        {[420, 450, 480, 510, 540, 570].map(pos => (
          <React.Fragment key={pos}>
            <circle cx="395" cy={pos} r="3" className="pcb-pad" />
            <circle cx="605" cy={pos} r="3" className="pcb-pad" />
            <circle cx={pos} cy="395" r="3" className="pcb-pad" />
            <circle cx={pos} cy="605" r="3" className="pcb-pad" />
          </React.Fragment>
        ))}
      </g>

      {/* Rendu de toutes les pistes grises et des pastilles (pads) */}
      {pcbPaths.map((p, i) => {
        const points = p.split(' L ');
        const start = points[0].replace('M ', '').split(' ');
        const end = points[points.length - 1].split(' ');
        return (
          <g key={`static-${i}`}>
            <path d={p} className="pcb-trace" />
            {/* Ajout des pastilles (vias) au début et à la fin de chaque ligne */}
            <circle cx={start[0]} cy={start[1]} r="5" className="pcb-pad" />
            <circle cx={end[0]} cy={end[1]} r="5" className="pcb-pad" />
          </g>
        );
      })}

      {/* Rendu des lueurs blanches animées (sans filtre lourd, juste du compositing CSS) */}
      {animatedIndices.map((idx, i) => {
        const p = pcbPaths[idx];
        const dur = 6 + (i % 3) * 3; // Vitesses très ralenties (6s, 9s, 12s)
        const delay = (i % 5) * 2; // Délais variés
        return (
          <g key={`pulse-${i}`}>
            <path d={p} className="pcb-pulse-glow" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }} />
            <path d={p} className="pcb-pulse-core" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }} />
          </g>
        );
      })}
    </svg>
  );
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState('simulation');
  // eslint-disable-next-line no-unused-vars
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
          if (s && s.length > 0) setScenarios(s);
          if (q && q.length > 0) setQuiz(q);
        }
      } catch (e) {
        setIsOnline(false);
      }
    };
    fetchData();
  }, []);

  const handleAction = (type) => {
    const item = scenarios[currentScenario];
    if (!item) return;

    if (item.type === type) {
      setFeedback({ msg: `✅ ${item.feedback}`, type: 'success' });
    } else {
      setFeedback({ msg: `❌ Erreur : ${item.clues.join(', ')}`, type: 'error' });
    }
    
    setTimeout(() => {
      setFeedback(null);
      setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    }, 3500);
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
        } catch (e) { console.error("Échec de synchronisation du score", e); }
      }
    }
  };

  const resetQuiz = () => {
    setShowScore(false);
    setQuizIndex(0);
    setScore(0);
  };

  // --- PAGE D'ATTERRISSAGE (LANDING PAGE) ---
  if (!started) {
    return (
      <div className="landing-page fade-in">
        <CircuitBackground />
        <div className="landing-content glow-panel">
          <div className="landing-logo-wrapper">
            <div className="landing-logo-icon">🛡️</div>
            <h1 className="landing-title">AntiPhish<span>Lab</span></h1>
          </div>
          <p className="landing-subtitle">
            Aiguisez vos réflexes de cybersécurité. Apprenez à déjouer les pièges, 
            analysez des emails frauduleux en conditions réelles et testez vos connaissances 
            pour naviguer sur le web en toute sécurité.
          </p>
          <div className="cyber-button-wrapper">
            <button className="btn-cyber-crak" onClick={() => setStarted(true)}>
              Devenez un Cyber Crack
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- APPLICATION PRINCIPALE ---
  const currentScenarioData = scenarios[currentScenario] || FALLBACK_DATA.scenarios[0];
  const currentQuizData = quiz[quizIndex] || FALLBACK_DATA.quiz[0];

  return (
    <div className="app-container">
      <header className="header fade-in-header">
        <div className="logo" onClick={() => setStarted(false)} title="Retour à l'accueil">
          🛡️ AntiPhish<span>Lab</span>
        </div>
        <nav className="nav">
          <button onClick={() => setTab('simulation')} className={tab === 'simulation' ? 'active' : ''}>Simulation</button>
          <button onClick={() => setTab('quiz')} className={tab === 'quiz' ? 'active' : ''}>Quiz Interactif</button>
          <button onClick={() => setTab('checklist')} className={tab === 'checklist' ? 'active' : ''}>Checklist</button>
        </nav>
        {/* Voyant vert et statut de profil non cliquable */}
        <div className="profile-status" title="Profil connecté">
          <span className="status-light green"></span>
          <span className="profile-icon">👤</span>
          <span className="profile-text">Connecté(e)</span>
        </div>
      </header>

      {/* Animation d'apparition glamour depuis le bas vers le haut pour tout le contenu */}
      <main className="content content-enter-active">
        {feedback && (
          <div className={`toast ${feedback.type}`}>
            <div className="toast-content">{feedback.msg}</div>
            <div className="toast-progress"></div>
          </div>
        )}

        {tab === 'simulation' && (
          <section className="section-center">
            <h2 className="section-title">Analyse d'email en direct</h2>
            <div className="shimmer-frame">
              <div className="email-card">
                <div className="email-header">
                  <p><strong>Expéditeur :</strong> <span className="sender-chip">{currentScenarioData.sender}</span></p>
                  <p><strong>Objet :</strong> {currentScenarioData.title}</p>
                </div>
                <div className="email-body">
                  <p>{currentScenarioData.content}</p>
                  {currentScenarioData.type === 'phishing' ? (
                    <div className="mock-link" title="Lien suspect détecté">http://clic-securise-validation.com/login</div>
                  ) : (
                    <div className="mock-link safe-link" title="Lien sécurisé">https://espace-client.officiel.fr</div>
                  )}
                </div>
                <div className="email-actions">
                  <button className="btn btn-safe glow-hover" onClick={() => handleAction('legit')}>C'est légitime</button>
                  <button className="btn btn-danger glow-hover" onClick={() => handleAction('phishing')}>Signaler Phishing</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === 'quiz' && (
          <section className="section-center">
            <h2 className="section-title">Testez vos connaissances</h2>
            {!showScore ? (
              <div className="shimmer-frame">
                <div className="quiz-card">
                  {/* Suppression de l'indication "Question n°" comme demandé */}
                  <h3 className="quiz-question quiz-question-no-header">{currentQuizData.q}</h3>
                  <div className="options-grid">
                    {currentQuizData.options.map((opt, i) => (
                      <button key={i} className="option-btn" onClick={() => handleQuiz(i)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="shimmer-frame">
                <div className="quiz-card score-card">
                  <h3>Fin de la session !</h3>
                  <div className="score-circle">
                    <span>{score}</span>
                    <span className="score-points">bonnes réponses</span>
                  </div>
                  <p className="score-message">
                    L'apprentissage de la cybersécurité est continu. Gardez l'œil ouvert !
                  </p>
                  <button className="btn btn-primary glow-hover" onClick={resetQuiz}>Recommencer le test</button>
                </div>
              </div>
            )}
          </section>
        )}

        {tab === 'checklist' && (
          <section className="section-center">
            <h2 className="section-title">Réflexes de sécurité (Les 4 piliers)</h2>
            <div className="grid">
              <div className="shimmer-frame slim-shimmer">
                <div className="info-card">
                  <div className="info-icon">🔎</div>
                  <h4>Vérifier l'expéditeur</h4>
                  <p>Ne regardez pas seulement le nom affiché. Cliquez sur l'expéditeur pour révéler l'adresse email réelle (après le @).</p>
                </div>
              </div>
              <div className="shimmer-frame slim-shimmer">
                <div className="info-card">
                  <div className="info-icon">🔗</div>
                  <h4>Survoler les liens</h4>
                  <p>Laissez votre souris sur un bouton sans cliquer. Regardez en bas à gauche de votre navigateur l'URL réelle de destination.</p>
                </div>
              </div>
              <div className="shimmer-frame slim-shimmer">
                <div className="info-card">
                  <div className="info-icon">🚨</div>
                  <h4>L'urgence est suspecte</h4>
                  <p>Méfiez-vous des messages exigeant une action immédiate (ex: "Votre compte sera supprimé dans 2h"). Prenez votre temps.</p>
                </div>
              </div>
              <div className="shimmer-frame slim-shimmer">
                <div className="info-card">
                  <div className="info-icon">📎</div>
                  <h4>Attention aux pièces jointes</h4>
                  <p>N'ouvrez jamais de fichiers .exe, .scr ou n'activez pas les macros d'un document Word/Excel inattendu.</p>
                </div>
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