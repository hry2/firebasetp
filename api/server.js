const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const scenarios = [
  { 
    id: 1, 
    type: 'phishing', 
    title: 'Mondial Relay - Colis en attente', 
    sender: 'noreply@mondial-relay-securite.com', 
    content: 'Votre colis n°4429 est bloqué. Payez 1.99€ de frais de douane pour débloquer la livraison.', 
    clues: ['Expéditeur suspect', 'Urgence créée', 'Lien non officiel'], 
    feedback: 'Bien joué ! Un vrai mail proviendrait de mondialrelay.fr.' 
  },
  { 
    id: 2, 
    type: 'legit', 
    title: 'Amazon - Confirmation de commande', 
    sender: 'confirmation@amazon.fr', 
    content: 'Merci pour votre achat. Retrouvez le récapitulatif dans votre espace client.', 
    clues: ['Domaine officiel', 'Pas de demande de paiement directe'], 
    feedback: 'Exact. C’est un message transactionnel classique.' 
  },
  { 
    id: 3, 
    type: 'phishing', 
    title: 'Ameli - Remboursement', 
    sender: 'service@ameli-info-france.net', 
    content: 'Un nouveau remboursement de 145.00€ est disponible. Cliquez ici pour mettre à jour vos coordonnées bancaires.', 
    clues: ['Demande de RIB par mail', 'Lien .net au lieu de .fr'], 
    feedback: 'Correct ! L’Assurance Maladie ne demande jamais de coordonnées bancaires par email.' 
  },
  {
    id: 4,
    type: 'phishing',
    title: 'Netflix - Paiement refusé',
    sender: 'support@netfIix-billing.com',
    content: 'Votre dernier paiement a échoué. Votre abonnement sera suspendu dans 24h. Mettez à jour votre carte bancaire ici.',
    clues: ['Domaine typosquatté (i majuscule au lieu de l)', 'Pression temporelle (24h)'],
    feedback: 'Bien vu ! Le domaine netfIix est une technique courante pour tromper l’œil.'
  },
  {
    id: 5,
    type: 'phishing',
    title: 'Info RH - Mise à jour de la grille salariale',
    sender: 'rh@votre-entreprise-portail.com',
    content: 'Veuillez trouver ci-joint la nouvelle grille salariale. Connectez-vous avec vos identifiants pour l\'ouvrir.',
    clues: ['Appel à la curiosité', 'Fausse adresse RH', 'Demande d\'identifiants pour un document'],
    feedback: 'C\'est du phishing interne ! Ne jamais saisir ses identifiants pour ouvrir une pièce jointe.'
  },
  {
    id: 6,
    type: 'phishing',
    title: 'Chronopost - Reprogrammation de livraison',
    sender: 'livraison@chrono-post-tracking.fr',
    content: 'Nous n\'avons pas pu livrer votre colis. Des frais de reprogrammation de 2.95€ s\'appliquent.',
    clues: ['Frais cachés demandés', 'Domaine non officiel avec tirets'],
    feedback: 'Excellent. Chronopost ou La Poste ne demandent jamais de payer pour reprogrammer une livraison.'
  },
  {
    id: 7,
    type: 'phishing',
    title: 'Impôts - Remboursement en votre faveur',
    sender: 'dgfip@finances-gouv-fr.org',
    content: 'Suite à un recalcul, vous êtes éligible à un remboursement de 214,00 €. Remplissez le formulaire de versement.',
    clues: ['Fausse extension (.org au lieu de .gouv.fr)', 'Promesse d\'argent inattendu'],
    feedback: 'Bravo. Le fisc français utilise exclusivement des adresses se terminant par @dgfip.finances.gouv.fr.'
  },
  {
    id: 8,
    type: 'phishing',
    title: 'Microsoft 365 - Mot de passe expiré',
    sender: 'admin@office365-alertes.com',
    content: 'Votre mot de passe expire dans 2 heures. Conservez-le en cliquant sur ce lien de sécurité.',
    clues: ['Contradiction (conserver un mot de passe expiré)', 'Urgence absolue (2h)'],
    feedback: 'C\'est un grand classique pour voler les accès professionnels (Business Email Compromise).'
  },
  {
    id: 9,
    type: 'phishing',
    title: 'ANTAI - Avis de contravention',
    sender: 'amendes@antai-gouv-dossier.fr',
    content: 'Vous avez une infraction impayée de 35€. Majoration à 135€ dans 48h. Payez maintenant.',
    clues: ['Menace de majoration immédiate', 'Faux domaine gouvernemental'],
    feedback: 'Bien joué. Les vrais avis de contravention se paient uniquement sur amendes.gouv.fr.'
  },
  {
    id: 10,
    type: 'phishing',
    title: 'Mon Compte Formation (CPF) - Droits expirés',
    sender: 'contact@cpf-france-droits.fr',
    content: 'Vos 1500€ de droits à la formation expirent ce soir. Convertissez-les immédiatement ici.',
    clues: ['Urgence irréaliste ("ce soir")', 'Arnaque connue'],
    feedback: 'Exact. C\'est une arnaque au CPF très répandue. Les droits ne disparaissent pas soudainement.'
  },
  {
    id: 11,
    type: 'legit',
    title: 'Doctolib - Rappel de rendez-vous',
    sender: 'no-reply@doctolib.fr',
    content: 'Rappel de votre rendez-vous demain à 14h30. En cas d\'empêchement, merci d\'annuler sur notre site.',
    clues: ['Informatif', 'Aucune demande d\'action urgente ou de mot de passe'],
    feedback: 'Parfait. Un mail purement informatif provenant d\'un domaine officiel.'
  },
  {
    id: 12,
    type: 'legit',
    title: 'Google - Alerte de sécurité',
    sender: 'no-reply@accounts.google.com',
    content: 'Connexion détectée sur un nouvel appareil. Si c\'est vous, ignorez. Sinon, vérifiez l\'activité.',
    clues: ['Laisse le choix à l\'utilisateur', 'Pas de lien direct de saisie de mot de passe', 'Domaine officiel'],
    feedback: 'C\'est un vrai mail Google. Ils informent mais ne forcent pas le clic en cas d\'alerte.'
  },
  {
    id: 13,
    type: 'legit',
    title: 'GitHub - Demande de réinitialisation',
    sender: 'support@github.com',
    content: 'Demande de réinitialisation de mot de passe reçue. Si vous n\'en êtes pas l\'auteur, ignorez cet email.',
    clues: ['Action initiée par l\'utilisateur', 'Option d\'ignorer explicite'],
    feedback: 'Correct. Tant que vous avez vous-même demandé cette réinitialisation, c\'est légitime.'
  },
  {
    id: 14,
    type: 'legit',
    title: 'EDF - Votre facture est disponible',
    sender: 'facture@client.edf.fr',
    content: 'Votre facture d\'un montant de 45.20€ est disponible. Elle sera prélevée le 15 du mois.',
    clues: ['Montant précis', 'Information de prélèvement (pas de demande de paiement)'],
    feedback: 'Exact ! EDF informe du prélèvement à venir sans demander de payer immédiatement via un lien.'
  },
  {
    id: 15,
    type: 'legit',
    title: 'LinkedIn - Nouvelle connexion',
    sender: 'messages-noreply@linkedin.com',
    content: 'Sophie Dubois souhaite se connecter avec vous. Acceptez ou ignorez sa demande sur l\'application.',
    clues: ['Domaine officiel', 'Action non critique', 'Redirige vers l\'app'],
    feedback: 'C\'est une notification réseau classique et inoffensive.'
  },
  {
    id: 16,
    type: 'phishing',
    title: 'CAF - Suspension de vos allocations',
    sender: 'contact@caf-miseajour-dossier.com',
    content: 'Vos droits ont été suspendus. Veuillez fournir une copie de votre carte d\'identité et votre RIB pour les rétablir.',
    clues: ['Demande de documents sensibles par mail', 'Menace de suspension'],
    feedback: 'Bien identifié ! La CAF demande toujours de passer par l\'espace sécurisé "Mon Compte".'
  },
  {
    id: 17,
    type: 'phishing',
    title: 'PayPal - Activité suspecte',
    sender: 'security@paypaI-support.com',
    content: 'Nous avons détecté un achat de 899.00€ chez Apple. Cliquez ici pour annuler la transaction.',
    clues: ['Faux montant élevé pour créer la panique', 'Typosquatting (paypaI)'],
    feedback: 'C\'est une arnaque classique pour vous faire paniquer et voler vos accès PayPal.'
  },
  {
    id: 18,
    type: 'legit',
    title: 'Apple - Reçu de votre abonnement',
    sender: 'no_reply@email.apple.com',
    content: 'Facture pour votre abonnement iCloud+ 50 Go (0,99 €/mois). Cet abonnement se renouvellera automatiquement.',
    clues: ['Expéditeur officiel', 'Petit montant cohérent', 'Aucun bouton d\'action urgent'],
    feedback: 'Vrai reçu Apple. Il n\'y a aucune pression pour cliquer sur un lien.'
  },
  {
    id: 19,
    type: 'phishing',
    title: 'La Poste - Colis affranchi',
    sender: 'noreply@laposte-suivi-france.net',
    content: 'Votre facteur n\'a pas pu déposer le colis dans votre boîte aux lettres. Réglez 1.50€ d\'affranchissement.',
    clues: ['Demande de paiement par carte', 'Extension de domaine .net suspecte'],
    feedback: 'Exact. La Poste ne vous demandera jamais de payer un supplément par email.'
  },
  {
    id: 20,
    type: 'phishing',
    title: 'Société Générale - Validation SecurPass',
    sender: 'alerte@sg-securite-pass.fr',
    content: 'Votre pass de sécurité expire aujourd\'hui. Sans validation, vos virements seront bloqués.',
    clues: ['Menace de blocage des virements', 'Domaine non officiel de la banque'],
    feedback: 'Parfait. Les banques communiquent ces alertes directement dans leur application mobile.'
  },
  {
    id: 21,
    type: 'legit',
    title: 'BlaBlaCar - Votre trajet de demain',
    sender: 'info@blablacar.com',
    content: 'N\'oubliez pas votre trajet Paris-Lyon de demain avec Thomas. Pensez à vérifier le point de rendez-vous.',
    clues: ['Information contextuelle précise', 'Domaine officiel', 'Pas de lien suspect'],
    feedback: 'Email légitime de rappel de trajet.'
  },
  {
    id: 22,
    type: 'phishing',
    title: 'Vinted - Article vendu !',
    sender: 'ventes@vinted-payement.com',
    content: 'Félicitations, un acheteur a payé 45€. Cliquez ici pour recevoir les fonds sur votre carte bancaire.',
    clues: ['Fausse procédure Vinted', 'Demande de carte bancaire pour recevoir de l\'argent'],
    feedback: 'Arnaque très courante ! Sur Vinted, l\'argent va dans le porte-monnaie intégré, pas via un lien externe.'
  },
  {
    id: 23,
    type: 'phishing',
    title: 'Orange - Erreur de facturation',
    sender: 'facture@orange-clientele.fr',
    content: 'Nous vous avons facturé deux fois votre abonnement par erreur. Demandez votre remboursement de 34,99€ ici.',
    clues: ['Promesse de remboursement', 'Lien qui demandera les numéros de carte bleue'],
    feedback: 'Bien vu ! Les opérateurs recréditent automatiquement sur la facture suivante en cas d\'erreur.'
  },
  {
    id: 24,
    type: 'legit',
    title: 'Free - Votre facture mobile',
    sender: 'freemobile@free-mobile.fr',
    content: 'Votre facture de ce mois est disponible dans votre Espace Abonné. Montant : 19.99€.',
    clues: ['Domaine officiel connu', 'Montant habituel', 'Pas de demande d\'action directe'],
    feedback: 'Facture légitime. L\'expéditeur et la formulation sont standards.'
  },
  {
    id: 25,
    type: 'phishing',
    title: 'Leboncoin - Paiement sécurisé bloqué',
    sender: 'securite@leboncoin-transaction.fr',
    content: 'Un acheteur a bloqué 150€ pour votre annonce. Validez votre identité avec votre carte d\'identité et votre CB pour débloquer les fonds.',
    clues: ['Demande de CB pour recevoir des fonds', 'Procédure hors plateforme'],
    feedback: 'Le paiement sécurisé Leboncoin se fait entièrement sur leur site ou application.'
  },
  {
    id: 26,
    type: 'phishing',
    title: 'URSSAF - Déclaration incomplète',
    sender: 'contact@urssaf-declarations.com',
    content: 'Votre dernière déclaration contient des erreurs. Une pénalité de 150€ sera appliquée si non corrigée d\'ici 24h.',
    clues: ['Menace financière immédiate', 'Faux domaine (.com au lieu de .fr)'],
    feedback: 'Les communications officielles de l\'URSSAF utilisent l\'extension .fr et n\'imposent pas de délai de 24h.'
  },
  {
    id: 27,
    type: 'legit',
    title: 'UPS - Mise à jour de suivi',
    sender: 'mcinfo@ups.com',
    content: 'Votre colis 1Z9999999999999999 est en cours de livraison aujourd\'hui entre 10h et 14h.',
    clues: ['Numéro de suivi standard', 'Information pure', 'Domaine officiel'],
    feedback: 'C\'est un suivi de colis légitime, sans demande de frais supplémentaires.'
  },
  {
    id: 28,
    type: 'phishing',
    title: 'DHL - Colis retenu en douane',
    sender: 'customs@dhl-express-eu.net',
    content: 'Un colis à votre nom est retenu en douane. Veuillez régler la taxe douanière de 3,99€ via notre portail.',
    clues: ['Frais de douane minimes (technique pour voler la CB)', 'Domaine suspect'],
    feedback: 'Typique arnaque au colis. Ne jamais payer de prétendus frais de douane par email.'
  },
  {
    id: 29,
    type: 'phishing',
    title: 'Amazon - Compte verrouillé',
    sender: 'alert@amazon-security-team.com',
    content: 'Suite à des connexions suspectes depuis la Russie, votre compte a été verrouillé. Restaurez-le maintenant.',
    clues: ['Création de panique (connexion depuis la Russie)', 'Lien pointant vers une fausse page de login'],
    feedback: 'Les escrocs jouent sur la peur du piratage pour obtenir vos vrais identifiants.'
  },
  {
    id: 30,
    type: 'legit',
    title: 'Spotify - Nouveau mix ajouté',
    sender: 'no-reply@spotify.com',
    content: 'Votre "Mix Découverte" a été mis à jour avec de nouveaux titres. Écoutez-le dès maintenant !',
    clues: ['Contenu inoffensif', 'Expéditeur officiel', 'Marketing classique'],
    feedback: 'Email promotionnel légitime et sans risque.'
  },
  {
    id: 31,
    type: 'phishing',
    title: 'Disney+ - Votre abonnement est annulé',
    sender: 'billing@disney-plus-renew.com',
    content: 'Le paiement de votre abonnement a échoué. Profitez d\'une offre de -50% en renouvelant aujourd\'hui.',
    clues: ['Mélange d\'alerte (annulation) et de promotion', 'Faux domaine'],
    feedback: 'Technique vicieuse : l\'escroc fait croire à un échec de paiement tout en offrant une fausse réduction.'
  },
  {
    id: 32,
    type: 'phishing',
    title: 'BNP Paribas - Nouvelle réglementation',
    sender: 'conformite@mabnp-paribas.net',
    content: 'En vertu de la loi DSP2, veuillez synchroniser votre lecteur de carte via ce lien sécurisé.',
    clues: ['Jargon technique (DSP2) pour intimider', 'Demande de manipulation matérielle'],
    feedback: 'Les banques ne demandent jamais de synchroniser des dispositifs de sécurité via un lien email.'
  },
  {
    id: 33,
    type: 'phishing',
    title: 'Booking.com - Annulation de réservation',
    sender: 'reservations@booking-confirm.net',
    content: 'Votre réservation à l\'Hôtel de la Plage est annulée suite à un problème de carte. Revalidez votre paiement ici.',
    clues: ['Urgence sur un voyage', 'Lien de paiement frauduleux'],
    feedback: 'Vérifiez toujours vos réservations directement dans l\'application Booking, jamais via le mail.'
  },
  {
    id: 34,
    type: 'legit',
    title: 'Airbnb - Conseils pour votre voyage',
    sender: 'express@airbnb.com',
    content: 'Préparez votre arrivée à Rome ! Voici quelques recommandations de votre hôte.',
    clues: ['Domaine officiel', 'Contenu personnalisé', 'Informatif'],
    feedback: 'Email automatique envoyé par Airbnb avant un séjour.'
  },
  {
    id: 35,
    type: 'phishing',
    title: 'SNCF Connect - Gagnez un an de voyages',
    sender: 'promo@sncf-cadeaux.fr',
    content: 'Vous avez été tiré au sort ! Répondez à ce sondage de 2 minutes pour gagner votre pass illimité.',
    clues: ['Cadeau trop beau pour être vrai', 'Sondage cachant une demande de frais de port'],
    feedback: 'Arnaque au faux concours. Le sondage finit toujours par demander 1€ pour "envoyer la carte".'
  },
  {
    id: 36,
    type: 'phishing',
    title: 'SFR - Important : Changement de RIB',
    sender: 'service-client@sfr-contact-fr.com',
    content: 'Suite à notre changement de banque, veuillez mettre à jour le mandat SEPA pour éviter toute coupure.',
    clues: ['Changement de RIB suspect', 'Menace de coupure'],
    feedback: 'Une entreprise ne change pas de banque en demandant à ses clients de refaire un mandat par mail.'
  },
  {
    id: 37,
    type: 'legit',
    title: 'Crédit Agricole - Relevé mensuel',
    sender: 'noreply@credit-agricole.fr',
    content: 'Votre relevé de compte numérique de Mars est disponible dans votre espace personnel sécurisé.',
    clues: ['Aucun lien cliquable', 'Procédure habituelle', 'Domaine officiel'],
    feedback: 'C\'est ainsi que les banques informent de la disponibilité des documents.'
  },
  {
    id: 38,
    type: 'phishing',
    title: 'Instagram - Copyright Violation Notice',
    sender: 'copyright@ig-support-team.com',
    content: 'Votre compte sera supprimé dans 24h pour violation des droits d\'auteur. Faites appel ici.',
    clues: ['Menace extrême (suppression)', 'Langue mélangée ou anglaise', 'Faux domaine IG'],
    feedback: 'Très fréquent chez les influenceurs. Instagram notifie in-app et n\'utilise pas de domaines bizarres.'
  },
  {
    id: 39,
    type: 'legit',
    title: 'Facebook - Vous avez un nouveau souvenir',
    sender: 'notification@facebookmail.com',
    content: 'Il y a 3 ans aujourd\'hui... Découvrez votre souvenir avec vos amis.',
    clues: ['Domaine officiel de notification de FB', 'Engagement positif'],
    feedback: 'Mail légitime. Bien que "facebookmail.com" paraisse étrange, c\'est le vrai domaine de notification de Meta.'
  },
  {
    id: 40,
    type: 'phishing',
    title: 'Support IT - Migration des serveurs',
    sender: 'helpdesk@it-support-interne.net',
    content: 'Une migration de la messagerie est prévue ce soir. Sauvegardez vos emails en validant votre mot de passe.',
    clues: ['Fausses instructions informatiques', 'Vol d\'identifiants d\'entreprise'],
    feedback: 'Le support IT interne a déjà les droits administratifs et n\'a pas besoin de votre mot de passe.'
  },
  {
    id: 41,
    type: 'phishing',
    title: 'URGENT : Confidentiel',
    sender: 'pdg.entreprise@gmail.com',
    content: 'Je suis en réunion. Fais-moi un virement urgent de 4500€ pour un fournisseur sur ce compte, je te rembourse ce soir. C\'est confidentiel.',
    clues: ['Demande hors procédure (virement)', 'Caractère urgent et secret', 'Adresse Gmail pour le PDG'],
    feedback: 'C\'est la "Fraude au Président" (FOVI). Toujours vérifier de vive voix ou par un autre canal.'
  },
  {
    id: 42,
    type: 'phishing',
    title: 'DocuSign - Vous avez un document à signer',
    sender: 'signature@docusign-secure-web.com',
    content: 'Le service RH vous a envoyé un avenant au contrat de travail. Cliquez pour examiner et signer le document.',
    clues: ['Faux domaine DocuSign', 'Pêche aux identifiants via un faux portail de signature'],
    feedback: 'Vérifiez toujours que le lien DocuSign mène vers le vrai domaine officiel (docusign.net ou docusign.com).'
  },
  {
    id: 43,
    type: 'phishing',
    title: 'Pôle Emploi - Actualisation échouée',
    sender: 'alerte@francetravail-actualisation.fr',
    content: 'Votre actualisation n\'a pas pu être prise en compte. Vos indemnités sont gelées. Recommencez ici.',
    clues: ['Menace sur les revenus', 'Faux domaine imitant le changement de nom Pôle Emploi / France Travail'],
    feedback: 'L\'actualisation se fait uniquement via le portail officiel ou l\'application, jamais par un lien direct en urgence.'
  },
  {
    id: 44,
    type: 'legit',
    title: 'Mutuelle - Décompte de remboursement',
    sender: 'no-reply@macif.fr',
    content: 'Un nouveau décompte de santé est disponible suite à votre consultation chez le médecin.',
    clues: ['Information de santé basique', 'Pas de demande d\'argent ou RIB', 'Domaine officiel'],
    feedback: 'Mail standard de la mutuelle informant qu\'un remboursement a été effectué.'
  },
  {
    id: 45,
    type: 'phishing',
    title: 'Revolut - Vérification KYC requise',
    sender: 'compliance@revolut-kyc-check.com',
    content: 'La loi exige une nouvelle vérification de votre identité. Prenez en photo votre passeport et votre carte bancaire ici.',
    clues: ['Demande de photo de la carte bancaire (jamais demandé pour le KYC)', 'Domaine frauduleux'],
    feedback: 'Les procédures KYC (Know Your Customer) se font exclusivement in-app pour les néobanques.'
  },
  {
    id: 46,
    type: 'phishing',
    title: 'Lydia - Vous avez reçu de l\'argent !',
    sender: 'cagnotte@lydia-app.net',
    content: 'Un ami vous a envoyé 30€ ! Entrez vos informations de carte bancaire pour les encaisser.',
    clues: ['Fausse réception d\'argent', 'Sur Lydia, l\'argent arrive sur le compte, on ne donne pas sa carte pour le recevoir'],
    feedback: 'Une arnaque très ciblée sur les étudiants et jeunes actifs utilisateurs de cagnottes.'
  },
  {
    id: 47,
    type: 'legit',
    title: 'PlayStation - Merci pour votre achat',
    sender: 'sony@email.sonyentertainmentnetwork.com',
    content: 'Merci d\'avoir acheté "God of War Ragnarök" sur le PlayStation Store. Montant: 79,99€.',
    clues: ['Achat réel du joueur', 'Domaine à rallonge mais officiel de Sony'],
    feedback: 'Ce domaine très long et complexe est bien le vrai domaine utilisé par Sony pour ses factures.'
  },
  {
    id: 48,
    type: 'phishing',
    title: 'Steam - Votre compte a été signalé',
    sender: 'support@steam-community-guard.com',
    content: 'Votre compte a reçu plusieurs signalements pour triche. Il sera banni dans 12h. Connectez-vous pour faire appel.',
    clues: ['Menace de bannissement', 'Appât lié au gaming'],
    feedback: 'Les faux mails Steam visent à voler l\'inventaire de jeux ou de skins des joueurs.'
  },
  {
    id: 49,
    type: 'phishing',
    title: 'Apple Pay - Carte suspendue',
    sender: 'wallet@apple-pay-services.com',
    content: 'Votre carte Mastercard finissant par 4920 a été suspendue d\'Apple Pay. Réactivez-la en entrant le code CVV.',
    clues: ['Demande explicite du code CVV (cryptogramme)', 'Peur de ne plus pouvoir payer'],
    feedback: 'Apple Pay ne gère pas la sécurité de la carte de cette manière. C\'est du phishing.'
  },
  {
    id: 50,
    type: 'legit',
    title: 'Uber - Votre course du vendredi matin',
    sender: 'receipts@uber.com',
    content: 'Voici le reçu de votre course avec Jean. Total : 12,40€.',
    clues: ['Facture standard', 'Domaine très clair', 'Montant réaliste'],
    feedback: 'Un simple reçu de course après un trajet.'
  },
  {
    id: 51,
    type: 'phishing',
    title: 'Uber Eats - Remboursement commande non livrée',
    sender: 'support@ubereats-refund.net',
    content: 'Nous nous excusons pour la commande non livrée. Cliquez pour recevoir un remboursement intégral de 45€.',
    clues: ['Exploite la frustration d\'un service', 'Domaine .net'],
    feedback: 'Si vous n\'avez rien commandé ou déjà été remboursé via l\'app, c\'est pour voler votre carte.'
  },
  {
    id: 52,
    type: 'legit',
    title: 'Deliveroo - Suivez votre commande',
    sender: 'info@deliveroo.fr',
    content: 'Le restaurant prépare votre commande. Vous pouvez suivre le livreur sur l\'application.',
    clues: ['Action en cours', 'Redirige vers l\'app', 'Domaine officiel'],
    feedback: 'Notification transactionnelle normale.'
  },
  {
    id: 53,
    type: 'phishing',
    title: 'Boursorama - Clôture de compte imminente',
    sender: 'service-client@boursorama-banque-fr.com',
    content: 'Suite à l\'inactivité de votre compte, ce dernier sera clôturé avec 450€ dessus. Connectez-vous pour l\'empêcher.',
    clues: ['Menace de perte d\'argent', 'Faux domaine imitant le vrai'],
    feedback: 'Une banque ne clôture pas un compte du jour au lendemain par email.'
  },
  {
    id: 54,
    type: 'phishing',
    title: 'Engie - Impayé électricité',
    sender: 'recouvrement@engie-urgence.fr',
    content: 'Dernier avis avant coupure d\'électricité. Payez votre solde de 184,30€ par carte bancaire avant ce soir.',
    clues: ['Menace de coupure d\'énergie (illégal sans longue procédure)', 'Paiement direct demandé'],
    feedback: 'Une coupure d\'électricité demande des semaines de préavis officiels par courrier, jamais un mail de 24h.'
  },
  {
    id: 55,
    type: 'legit',
    title: 'TotalEnergies - Évolution de vos mensualités',
    sender: 'noreply@totalenergies.fr',
    content: 'Votre consommation a baissé. Vos mensualités passeront à 65€/mois le mois prochain.',
    clues: ['Bonne nouvelle non conditionnée à un clic', 'Domaine officiel'],
    feedback: 'Ajustement légitime des mensualités.'
  },
  {
    id: 56,
    type: 'phishing',
    title: 'Ticketmaster - Vos billets pour Taylor Swift',
    sender: 'sales@ticketmaster-billetterie.net',
    content: 'Vos billets sont prêts ! Téléchargez-les en validant vos informations bancaires de vérification.',
    clues: ['Appât sur un concert très prisé', 'Vérification bancaire absurde pour télécharger un billet'],
    feedback: 'Arnaque très en vogue sur les événements où les billets sont sold-out.'
  },
  {
    id: 57,
    type: 'legit',
    title: 'Decathlon - Votre e-ticket de caisse',
    sender: 'noreply@decathlon.fr',
    content: 'Merci de votre visite en magasin. Retrouvez votre ticket de caisse dématérialisé en pièce jointe (PDF).',
    clues: ['Achat en magasin', 'Pièce jointe au format PDF (sans macro)'],
    feedback: 'Procédure écologique standard de plus en plus courante dans les magasins physiques.'
  },
  {
    id: 58,
    type: 'phishing',
    title: 'Fnac - Vous avez gagné un iPhone 15',
    sender: 'concours@fnac-cadeaux.com',
    content: 'Suite à votre dernier achat, vous êtes l\'heureux gagnant de notre grand jeu ! Payez juste 2€ de frais de livraison.',
    clues: ['Cadeau de grande valeur', 'Frais de port dérisoires pour obtenir les numéros de CB'],
    feedback: 'Le fameux "iPhone à 2€" est l\'une des plus vieilles et rentables arnaques du web.'
  },
  {
    id: 59,
    type: 'legit',
    title: 'Darty - Votre garantie expire bientôt',
    sender: 'sav@darty.fr',
    content: 'La garantie de votre Réfrigérateur Beko expire dans 1 mois. Pensez à l\'extension de garantie.',
    clues: ['Rappel commercial classique', 'Informations produit précises'],
    feedback: 'Email marketing légitime basé sur un achat précédent.'
  },
  {
    id: 60,
    type: 'phishing',
    title: 'WeTransfer - Fichiers envoyés (2.4 Go)',
    sender: 'noreply@we-transfer-files.com',
    content: 'Jean Dupont vous a envoyé 3 fichiers importants. Connectez-vous avec votre adresse email professionnelle pour les télécharger.',
    clues: ['Curiosité (fichiers lourds inconnus)', 'Demande de mot de passe pro pour télécharger un fichier public'],
    feedback: 'WeTransfer ne demande jamais de mot de passe email pour télécharger un fichier public.'
  },
  {
    id: 61,
    type: 'phishing',
    title: 'Colissimo - Échec de livraison',
    sender: 'contact@colissimo-suivi-online.com',
    content: 'Votre colis n°8H3920193 est en attente au centre de tri. Réglez 2.50€ de frais de garde pour planifier la livraison.',
    clues: ['Demande de paiement pour livraison', 'Faux domaine Colissimo'],
    feedback: 'Classique arnaque au colis. La Poste ne demande jamais de régler des frais de garde par email.'
  },
  {
    id: 62,
    type: 'legit',
    title: 'Colissimo - Votre colis est en route',
    sender: 'ne-pas-repondre@laposte.fr',
    content: 'Bonne nouvelle, votre colis n°8H3920193 vous sera livré aujourd\'hui avant 18h.',
    clues: ['Domaine officiel de La Poste', 'Information de suivi sans demande d\'action'],
    feedback: 'Email légitime de suivi de colis.'
  },
  {
    id: 63,
    type: 'phishing',
    title: 'Cdiscount - Alerte sécurité',
    sender: 'alerte@cdiscount-securite.net',
    content: 'Une connexion suspecte a été détectée sur votre compte Cdiscount. Confirmez votre identité pour éviter le blocage.',
    clues: ['Urgence et menace de blocage', 'Domaine non officiel'],
    feedback: 'Le faux service de sécurité essaie de récupérer vos identifiants e-commerce.'
  },
  {
    id: 64,
    type: 'legit',
    title: 'Cdiscount - Confirmation de commande',
    sender: 'commande@cdiscount.com',
    content: 'Merci pour votre achat. Votre commande n°2304958 sera préparée sous 24h. Retrouvez votre facture en pièce jointe.',
    clues: ['Domaine officiel', 'Contexte d\'achat habituel', 'Pas de demande d\'informations personnelles'],
    feedback: 'C\'est une confirmation de commande standard.'
  },
  {
    id: 65,
    type: 'phishing',
    title: 'AliExpress - Taxe douanière en attente',
    sender: 'customs@aliexpress-eu-support.com',
    content: 'Votre commande AE932840 est bloquée en douane. Veuillez payer la TVA de 1,99€ via notre portail sécurisé.',
    clues: ['Frais de douane minimes', 'Lien vers un portail externe'],
    feedback: 'Les taxes douanières sur AliExpress sont généralement payées lors de la commande (TVA), pas par un mail externe.'
  },
  {
    id: 66,
    type: 'legit',
    title: 'Vinted - Votre article a été mis en favori',
    sender: 'no-reply@vinted.fr',
    content: 'Bonne nouvelle, un membre a ajouté votre veste en jean à ses favoris. Baissez le prix pour l\'inciter à acheter !',
    clues: ['Notification in-app typique', 'Domaine officiel', 'Pas de lien malveillant'],
    feedback: 'Notification de la plateforme Vinted.'
  },
  {
    id: 67,
    type: 'phishing',
    title: 'LCL - Mise à jour de votre application',
    sender: 'clientele@lcl-mise-a-jour.fr',
    content: 'La nouvelle directive européenne DSP2 vous oblige à mettre à jour votre application LCL. Scannez ce QR code pour procéder.',
    clues: ['Usage d\'un QR code malveillant (Quishing)', 'Faux domaine bancaire'],
    feedback: 'Ne scannez jamais un QR code reçu par mail pour mettre à jour une application bancaire.'
  },
  {
    id: 68,
    type: 'legit',
    title: 'LCL - Votre relevé de compte',
    sender: 'documents@lcl.fr',
    content: 'Votre relevé de compte mensuel est disponible dans votre espace client sécurisé. Nous vous invitons à le consulter.',
    clues: ['Domaine officiel', 'Procédure habituelle', 'Aucun lien de connexion direct'],
    feedback: 'C\'est la procédure normale des banques pour les relevés.'
  },
  {
    id: 69,
    type: 'phishing',
    title: 'Caisse d\'Epargne - Authentification forte',
    sender: 'secur-pass@caisse-epargne-auth.com',
    content: 'Votre Sécur\'Pass est désactivé. Réactivez-le immédiatement en renseignant votre identifiant et mot de passe.',
    clues: ['Demande de mot de passe par mail', 'Domaine non officiel'],
    feedback: 'L\'activation de Sécur\'Pass se fait uniquement via l\'application officielle.'
  },
  {
    id: 70,
    type: 'phishing',
    title: 'Crédit Mutuel - Virement suspect bloqué',
    sender: 'fraude@creditmutuel-alertes.net',
    content: 'Nous avons bloqué un virement de 850€ vers l\'Espagne. Cliquez ici si vous n\'êtes pas à l\'origine de cette opération.',
    clues: ['Création de panique (virement frauduleux)', 'Lien d\'annulation factice'],
    feedback: 'Arnaque au faux conseiller : on vous fait croire à une fraude pour voler vos codes.'
  },
  {
    id: 71,
    type: 'legit',
    title: 'Boursorama - Alerte de solde',
    sender: 'alertes@boursorama.com',
    content: 'Votre solde est passé en dessous du seuil d\'alerte de 100€ que vous aviez configuré. Connectez-vous à votre espace client pour vérifier.',
    clues: ['Alerte configurée par l\'utilisateur', 'Pas de lien cliquable forcé', 'Domaine officiel'],
    feedback: 'Alerte bancaire légitime.'
  },
  {
    id: 72,
    type: 'phishing',
    title: 'Assurance Maladie - Nouvelle carte Vitale',
    sender: 'renouvellement@ameli-vitale-gouv.fr',
    content: 'La nouvelle carte Vitale V3 est obligatoire. Commandez-la dès maintenant. Les frais d\'expédition sont de 0.99€.',
    clues: ['Demande de frais d\'expédition pour la carte Vitale', 'Caractère obligatoire et urgent'],
    feedback: 'La carte Vitale est 100% gratuite. L\'Assurance Maladie ne demande jamais de frais de port.'
  },
  {
    id: 73,
    type: 'legit',
    title: 'Ameli - Notification de message',
    sender: 'ne-pas-repondre@assurance-maladie.fr',
    content: 'Vous avez reçu un nouveau message dans votre compte ameli. Connectez-vous sur ameli.fr pour en prendre connaissance.',
    clues: ['Information générique pour des raisons de confidentialité', 'Pas de lien direct', 'Domaine officiel'],
    feedback: 'Les messages de santé étant confidentiels, les notifications officielles ne contiennent jamais le détail du message.'
  },
  {
    id: 74,
    type: 'phishing',
    title: 'Gouvernement.fr - Prime d\'inflation',
    sender: 'aides@ministere-solidarite-gouv.org',
    content: 'Vous êtes éligible à la nouvelle prime d\'inflation de 250€. Remplissez le formulaire de demande avec votre RIB.',
    clues: ['Extension .org au lieu de .gouv.fr', 'Promesse de prime inattendue'],
    feedback: 'Les aides de l\'État sont généralement versées automatiquement ou demandées via des espaces personnels (.gouv.fr).'
  },
  {
    id: 75,
    type: 'phishing',
    title: 'Info Radars - Avis de contravention',
    sender: 'contact@antai-amendes-gouv.com',
    content: 'Vous avez été flashé à 95 km/h le 12 mai. Montant de l\'amende : 45€. Payez dans les 3 jours pour éviter la majoration.',
    clues: ['Urgence (3 jours)', 'Faux domaine .com (l\'ANTAI utilise .gouv.fr)'],
    feedback: 'Les vrais avis de contravention sont envoyés par courrier postal et payables sur amendes.gouv.fr.'
  },
  {
    id: 76,
    type: 'legit',
    title: 'Impôts - Votre avis d\'imposition',
    sender: 'ne-pas-repondre@dgfip.finances.gouv.fr',
    content: 'Votre avis d\'imposition sur les revenus est disponible dans votre espace particulier sur impots.gouv.fr.',
    clues: ['Domaine officiel de la DGFiP', 'Pas de demande de paiement dans l\'email'],
    feedback: 'Notification légitime de la Direction Générale des Finances Publiques.'
  },
  {
    id: 77,
    type: 'phishing',
    title: 'Prime Rénov\' - Validation de dossier',
    sender: 'dossier@maprimerenov-etat.fr',
    content: 'Votre demande d\'aide à la rénovation a été pré-approuvée. Validez votre dossier en fournissant vos informations fiscales.',
    clues: ['Demande d\'informations fiscales sensibles', 'Faux portail gouvernemental'],
    feedback: 'Le site officiel est maprimerenov.gouv.fr. Ne donnez jamais vos accès fiscaux.'
  },
  {
    id: 78,
    type: 'phishing',
    title: 'Canal+ - Problème de prélèvement',
    sender: 'facturation@mycanal-assistance.com',
    content: 'Votre abonnement Canal+ a été suspendu suite au rejet de votre prélèvement. Mettez à jour vos coordonnées bancaires pour retrouver l\'accès.',
    clues: ['Faux domaine d\'assistance', 'Urgence (suspension)'],
    feedback: 'Phishing ciblant les abonnés à des services de SVOD.'
  },
  {
    id: 79,
    type: 'legit',
    title: 'Netflix - Nouveautés de la semaine',
    sender: 'info@mailer.netflix.com',
    content: 'Découvrez les nouveaux films et séries ajoutés cette semaine sur Netflix. "Stranger Things" saison 5 est maintenant disponible !',
    clues: ['Contenu purement promotionnel', 'Domaine utilisé par Netflix pour ses mailings'],
    feedback: 'Email marketing classique.'
  },
  {
    id: 80,
    type: 'phishing',
    title: 'Prime Video - Concours exclusif',
    sender: 'promos@amazon-prime-gifts.net',
    content: 'En tant que membre Prime, vous avez été sélectionné pour gagner un téléviseur 4K. Confirmez votre adresse de livraison ici.',
    clues: ['Promesse de gain irréaliste', 'Demande de validation d\'adresse (qui mènera à une demande de paiement)'],
    feedback: 'Arnaque au faux sondage/cadeau.'
  },
  {
    id: 81,
    type: 'phishing',
    title: 'YouTube - Avertissement pour droits d\'auteur',
    sender: 'copyright@youtube-policy-team.com',
    content: 'Votre vidéo a enfreint nos règles sur les droits d\'auteur. Votre chaîne sera fermée dans 48h sans action de votre part.',
    clues: ['Menace de fermeture', 'Faux domaine (YouTube utilise @youtube.com)'],
    feedback: 'Très courant pour voler des chaînes YouTube. Toujours vérifier dans le YouTube Studio.'
  },
  {
    id: 82,
    type: 'legit',
    title: 'Twitch - Vous êtes en direct !',
    sender: 'no-reply@twitch.tv',
    content: 'Votre chaîne est actuellement en direct. N\'oubliez pas de partager le lien avec votre communauté sur les réseaux sociaux.',
    clues: ['Notification liée à une action de l\'utilisateur', 'Domaine officiel'],
    feedback: 'Notification Twitch légitime.'
  },
  {
    id: 83,
    type: 'phishing',
    title: 'WhatsApp - Sauvegarde vocale',
    sender: 'voicemail@whatsapp-web-record.com',
    content: 'Vous avez reçu un nouveau message vocal (0:45) de +33 6 XX XX XX XX. Écoutez le message en ligne.',
    clues: ['WhatsApp n\'envoie pas de messages vocaux par email', 'Lien malveillant'],
    feedback: 'Les messages WhatsApp restent dans l\'application. C\'est un leurre pour installer un malware.'
  },
  {
    id: 84,
    type: 'phishing',
    title: 'Tiktok - Badge vérifié',
    sender: 'verification@tiktok-creator-fund.net',
    content: 'Félicitations ! Vous êtes éligible au badge bleu vérifié. Connectez-vous via ce lien pour finaliser la demande.',
    clues: ['Offre attrayante (badge de certification)', 'Domaine frauduleux'],
    feedback: 'Le phishing visant les influenceurs promet souvent la certification pour voler les comptes.'
  },
  {
    id: 85,
    type: 'legit',
    title: 'X (Twitter) - Alerte de connexion',
    sender: 'verify@x.com',
    content: 'Nous avons détecté une nouvelle connexion à votre compte depuis un appareil Windows à Paris. Si c\'est vous, ignorez ce message.',
    clues: ['Alerte de sécurité classique', 'Laisse l\'option d\'ignorer', 'Domaine officiel'],
    feedback: 'Alerte de sécurité légitime.'
  },
  {
    id: 86,
    type: 'phishing',
    title: 'Microsoft Teams - Invitation à une réunion urgente',
    sender: 'invites@teams-microsoft-online.com',
    content: 'Votre manager vous a invité à une réunion confidentielle. Cliquez pour rejoindre et entrez vos identifiants Office 365.',
    clues: ['Demande d\'identifiants pour rejoindre une réunion', 'Faux domaine Teams'],
    feedback: 'Rejoindre une réunion Teams ne nécessite jamais de re-saisir ses identifiants sur une page web tierce.'
  },
  {
    id: 87,
    type: 'legit',
    title: 'Google Workspace - Espace de stockage presque plein',
    sender: 'drive-noreply@google.com',
    content: 'Votre espace de stockage Google Drive est plein à 90%. Pensez à faire du tri ou à mettre à niveau votre forfait.',
    clues: ['Alerte de service', 'Domaine officiel', 'Pas d\'urgence vitale'],
    feedback: 'Notification de quota de stockage.'
  },
  {
    id: 88,
    type: 'phishing',
    title: 'Ressources Humaines - Signature de la charte de télétravail',
    sender: 'rh@docusign-entreprise.com',
    content: 'Veuillez lire et signer la nouvelle charte de télétravail avant vendredi. Connectez-vous avec vos accès réseau.',
    clues: ['Demande d\'accès réseau via un outil externe', 'Pression temporelle'],
    feedback: 'Le spear-phishing (phishing ciblé) utilise souvent les sujets RH (télétravail, congés) pour piéger les employés.'
  },
  {
    id: 89,
    type: 'phishing',
    title: 'Support IT - Mise à jour de votre mot de passe',
    sender: 'admin@helpdesk-interne-it.net',
    content: 'La politique de sécurité a changé. Mettez à jour votre mot de passe de messagerie immédiatement sous peine de désactivation de votre compte.',
    clues: ['Menace de désactivation du compte pro', 'Adresse email générique non issue de votre entreprise'],
    feedback: 'Le support informatique ne vous menacera jamais de couper votre compte de la sorte.'
  },
  {
    id: 90,
    type: 'legit',
    title: 'Slack - Résumé quotidien',
    sender: 'notifications@slack.com',
    content: 'Voici les messages que vous avez manqués pendant votre absence dans le canal #général.',
    clues: ['Contenu de type digest', 'Domaine officiel'],
    feedback: 'Email récapitulatif légitime.'
  },
  {
    id: 91,
    type: 'phishing',
    title: 'Air France - Billet en attente de confirmation',
    sender: 'reservations@airfrance-booking-check.fr',
    content: 'Votre vol AF1234 pour New York n\'est pas confirmé. Il manque une vérification de la carte de crédit utilisée pour le paiement.',
    clues: ['Problème grave lié à un voyage', 'Vérification de la carte de crédit'],
    feedback: 'Les compagnies aériennes vérifient le paiement à la commande. Demander la CB a posteriori est suspect.'
  },
  {
    id: 92,
    type: 'legit',
    title: 'SNCF Connect - Votre e-billet',
    sender: 'contact@sncf-connect.com',
    content: 'Votre voyage approche. Retrouvez votre e-billet Paris-Marseille en pièce jointe ou dans l\'application.',
    clues: ['Domaine officiel', 'Pièce jointe au format PDF attendu', 'Contexte de voyage'],
    feedback: 'Envoi légitime de billet de train.'
  },
  {
    id: 93,
    type: 'phishing',
    title: 'OuiGo - Annulation de votre train',
    sender: 'alertes@ouigo-remboursements.com',
    content: 'Suite à une grève, votre train est annulé. Demandez le remboursement de vos billets en cliquant sur ce formulaire.',
    clues: ['Exploitation d\'événements d\'actualité (grève)', 'Lien vers un faux formulaire de remboursement'],
    feedback: 'Les escrocs surfent sur les grèves. Le vrai remboursement se fait automatiquement ou sur le site officiel.'
  },
  {
    id: 94,
    type: 'legit',
    title: 'Booking.com - Votre reçu',
    sender: 'customer.service@booking.com',
    content: 'Merci d\'avoir séjourné à l\'Hôtel Central. Vous trouverez votre facture et votre reçu en ligne.',
    clues: ['Domaine officiel', 'Après un séjour effectif'],
    feedback: 'Facture légitime post-séjour.'
  },
  {
    id: 95,
    type: 'phishing',
    title: 'Airbnb - Superhost - Demande de réservation',
    sender: 'booking@airbnb-superhost-auth.net',
    content: 'Un voyageur a demandé à réserver votre logement. Pour accepter, vous devez d\'abord vérifier votre identité via ce lien.',
    clues: ['Vérification d\'identité requise soudainement', 'Faux domaine Airbnb'],
    feedback: 'La vérification d\'identité se fait dans l\'application Airbnb, jamais via un email vous incitant à cliquer.'
  },
  {
    id: 96,
    type: 'phishing',
    title: 'Orange - Coupure internet imminente',
    sender: 'service-technique@orange-fibre-assistance.fr',
    content: 'Suite à un impayé, votre ligne fibre sera coupée dans 2 heures. Réglez la somme de 29.90€ en ligne.',
    clues: ['Délai irréaliste (2 heures)', 'Demande de paiement par CB'],
    feedback: 'Les opérateurs respectent des délais légaux avant coupure, ils n\'envoient pas de préavis de 2h.'
  },
  {
    id: 97,
    type: 'legit',
    title: 'Bouygues Telecom - Votre facture mensuelle',
    sender: 'facture@bouyguestelecom.fr',
    content: 'Votre facture Bbox de mai est disponible. Le montant de 34,99€ sera prélevé le 12 du mois.',
    clues: ['Information de prélèvement', 'Montant standard', 'Domaine officiel'],
    feedback: 'Mail de mise à disposition de facture standard.'
  },
  {
    id: 98,
    type: 'phishing',
    title: 'Free - Matériel non restitué',
    sender: 'restitutions@freebox-retours.com',
    content: 'Vous n\'avez pas restitué votre Freebox suite à votre résiliation. Une pénalité de 400€ sera prélevée sauf si vous payez les frais de retour de 5€ ici.',
    clues: ['Pénalité exorbitante pour faire peur', 'Frais de retour suspects'],
    feedback: 'Arnaque jouant sur la peur des pénalités de résiliation.'
  },
  {
    id: 99,
    type: 'phishing',
    title: 'Veolia - Fuite d\'eau détectée',
    sender: 'alertes@veolia-eau-services.net',
    content: 'Une surconsommation anormale a été détectée à votre domicile. Prenez rendez-vous d\'urgence avec un technicien via notre portail (frais de déplacement 15€).',
    clues: ['Frais de déplacement demandés par mail', 'Domaine non officiel'],
    feedback: 'Fausse alerte pour vous faire payer de soi-disant frais de déplacement.'
  },
  {
    id: 100,
    type: 'legit',
    title: 'IKEA - Votre commande est prête en Click & Collect',
    sender: 'no-reply@ikea.com',
    content: 'Votre commande 190283 est prête à être retirée au magasin IKEA Paris Nord. N\'oubliez pas votre pièce d\'identité.',
    clues: ['Information locale précise', 'Pas de paiement demandé', 'Domaine officiel'],
    feedback: 'Notification de retrait de commande légitime.'
  },
  {
    id: 101,
    type: 'phishing',
    title: 'Apple - Facture App Store',
    sender: 'receipts@apple-store-billing.net',
    content: 'Reçu pour l\'achat de "Clash of Clans - Gems" : 109,99€. Si vous n\'avez pas autorisé cet achat, annulez la transaction ici.',
    clues: ['Gros montant inattendu', 'Bouton d\'annulation d\'urgence', 'Domaine frauduleux'],
    feedback: 'Technique courante : envoyer une fausse facture élevée pour inciter la victime à cliquer sur le lien "Annuler".'
  },
  {
    id: 102,
    type: 'legit',
    title: 'Zalando - Vos retours ont été traités',
    sender: 'service@zalando.fr',
    content: 'Nous avons bien reçu votre colis de retour. Le remboursement de 45,00€ a été effectué sur votre compte bancaire ou PayPal.',
    clues: ['Confirmation d\'une action utilisateur', 'Domaine officiel'],
    feedback: 'Email de confirmation de remboursement suite à un retour de marchandise.'
  },
  {
    id: 103,
    type: 'phishing',
    title: 'Norton - Renouvellement automatique',
    sender: 'billing@norton-antivirus-renewal.com',
    content: 'Votre abonnement Norton 360 a été renouvelé pour 299€. Le montant sera prélevé aujourd\'hui. Contactez le +33 9 70 XX XX XX pour contester.',
    clues: ['Montant exorbitant', 'Incite à appeler un numéro de téléphone (Vishing)', 'Faux domaine'],
    feedback: 'C\'est une arnaque au support technique (Tech Support Scam) par téléphone.'
  },
  {
    id: 104,
    type: 'phishing',
    title: 'Mairie de Paris - Vignette Crit\'Air',
    sender: 'contact@certificat-air-gouv.fr',
    content: 'Votre vignette Crit\'Air est périmée. Les nouvelles vignettes de catégorie 2026 sont obligatoires. Commandez la vôtre pour 3,11€.',
    clues: ['La vignette Crit\'Air n\'expire pas', 'Faux domaine gouvernemental'],
    feedback: 'Les vignettes Crit\'Air n\'ont pas de date de validité. Le seul site officiel est certificat-air.gouv.fr.'
  },
  {
    id: 105,
    type: 'legit',
    title: 'Strava - Nouveau record personnel !',
    sender: 'no-reply@strava.com',
    content: 'Félicitations ! Vous avez battu votre record personnel sur le segment "Montée de la côte".',
    clues: ['Application de fitness', 'Gamification positive', 'Domaine officiel'],
    feedback: 'Notification d\'application de sport inoffensive.'
  },
  {
    id: 106,
    type: 'phishing',
    title: 'Tinder - Quelqu\'un a matché avec vous !',
    sender: 'matches@tinder-dates.net',
    content: 'Anna, 24 ans, a liké votre profil. Elle a laissé un message vocal privé. Cliquez ici pour l\'écouter.',
    clues: ['Curiosité amoureuse/affective', 'Promesse de message vocal externe', 'Faux domaine'],
    feedback: 'Arnaque ciblant les utilisateurs d\'applications de rencontre (Catfishing/Malware).'
  },
  {
    id: 107,
    type: 'phishing',
    title: 'WeTransfer - Fichier partagé par "Direction"',
    sender: 'share@wetransfer-files-pro.com',
    content: 'Le dossier "Licenciements_2026.pdf" a été partagé avec vous. Veuillez entrer vos identifiants d\'entreprise pour y accéder.',
    clues: ['Sujet anxiogène (licenciements)', 'Demande d\'identifiants pour WeTransfer'],
    feedback: 'Phishing interne classique jouant sur la peur et la curiosité.'
  },
  {
    id: 108,
    type: 'legit',
    title: 'Patreon - Nouveau post de votre créateur',
    sender: 'no-reply@patreon.com',
    content: 'Un nouveau post exclusif est disponible sur la page du créateur que vous soutenez.',
    clues: ['Notification de contenu', 'Domaine officiel'],
    feedback: 'Notification de plateforme de financement participatif.'
  },
  {
    id: 109,
    type: 'phishing',
    title: 'Instagram - Badge bleu refusé',
    sender: 'support@ig-verification-badge.com',
    content: 'Votre demande de badge bleu a été refusée. Pour faire appel de cette décision et valider votre notoriété, complétez ce formulaire.',
    clues: ['Thème très prisé (badge bleu)', 'Faux domaine de support IG'],
    feedback: 'Les hackers utilisent le désir d\'obtenir un badge certifié pour récupérer les mots de passe Instagram.'
  },
  {
    id: 110,
    type: 'legit',
    title: 'Zoom - Rappel de réunion',
    sender: 'no-reply@zoom.us',
    content: 'La réunion "Point d\'équipe" commence dans 15 minutes. Lien de la réunion ci-dessous.',
    clues: ['Domaine officiel zoom.us', 'Lien de réunion standard'],
    feedback: 'Rappel automatique de réunion.'
  },
  {
    id: 111,
    type: 'phishing',
    title: 'Santé Publique France - Rappel de vaccin',
    sender: 'vaccination@sante-publique-gouv.net',
    content: 'Votre dernier rappel de vaccin a expiré. Prenez rendez-vous d\'urgence et réglez les frais de dossier de 2€.',
    clues: ['Frais de dossier pour un vaccin', 'Urgence sanitaire feinte'],
    feedback: 'Les campagnes de vaccination officielles en France ne demandent jamais de payer des frais de dossier en ligne.'
  },
  {
    id: 112,
    type: 'phishing',
    title: 'PayPal - Mise à jour des CGU',
    sender: 'service@paypal-cgu-update.com',
    content: 'Acceptez nos nouvelles conditions générales d\'utilisation avant le 30 du mois, sinon votre compte sera restreint.',
    clues: ['Menace de restriction', 'Demande d\'action via un lien direct'],
    feedback: 'Une mise à jour des CGU est souvent annoncée par mail, mais l\'acceptation se fait en se connectant normalement à l\'application, pas en urgence.'
  },
  {
    id: 113,
    type: 'legit',
    title: 'Deliveroo - Votre reçu',
    sender: 'receipts@deliveroo.fr',
    content: 'Voici le reçu de votre commande chez "Burger House". Total : 22,50€.',
    clues: ['Domaine officiel', 'Facture post-commande'],
    feedback: 'Reçu classique de livraison de repas.'
  },
  {
    id: 114,
    type: 'phishing',
    title: 'SNCF - Carte Avantage expirée',
    sender: 'renouvellement@sncf-avantage-pro.fr',
    content: 'Votre Carte Avantage Adulte expire demain. Renouvelez-la aujourd\'hui pour bénéficier de -50%.',
    clues: ['Urgence (expire demain)', 'Promesse de grosse réduction (-50%)'],
    feedback: 'L\'urgence extrême est le signe typique d\'un phishing pour voler vos données de paiement.'
  },
  {
    id: 115,
    type: 'legit',
    title: 'Decathlon - Enquête de satisfaction',
    sender: 'avis@decathlon.fr',
    content: 'Suite à votre achat, que pensez-vous de vos nouvelles chaussures de running ? Laissez-nous un avis.',
    clues: ['Demande de feedback post-achat', 'Pas de demande d\'infos sensibles', 'Domaine officiel'],
    feedback: 'Demande d\'avis client légitime.'
  },
  {
    id: 116,
    type: 'phishing',
    title: 'TotalEnergies - Chèque énergie',
    sender: 'aide@totalenergies-cheque.com',
    content: 'Utilisez votre chèque énergie de 100€ dès maintenant en renseignant vos identifiants bancaires pour le versement.',
    clues: ['Le chèque énergie se déduit de la facture, il n\'est pas versé sur un compte bancaire', 'Faux domaine'],
    feedback: 'L\'utilisation du chèque énergie est encadrée par l\'État (chequeenergie.gouv.fr) et ne demande pas de RIB.'
  },
  {
    id: 117,
    type: 'phishing',
    title: 'Service Public - Dossier de retraite',
    sender: 'info@retraite-service-public.net',
    content: 'Votre demande de pension est bloquée. Fournissez vos fiches de paie et votre carte d\'identité via ce formulaire non sécurisé.',
    clues: ['Demande de documents hautement sensibles', 'Extension .net au lieu de .fr'],
    feedback: 'L\'envoi de documents d\'identité se fait toujours via l\'espace sécurisé FranceConnect ou l\'assurance retraite officielle.'
  },
  {
    id: 118,
    type: 'legit',
    title: 'SeLoger - Nouvelle annonce correspondant à vos critères',
    sender: 'alertes@seloger.com',
    content: 'Un nouvel appartement T3 à Paris a été publié. Découvrez l\'annonce.',
    clues: ['Alerte immobilière standard', 'Domaine officiel'],
    feedback: 'Alerte générée par une recherche sauvegardée par l\'utilisateur.'
  },
  {
    id: 119,
    type: 'phishing',
    title: 'Leboncoin - Paiement de votre annonce',
    sender: 'transaction@leboncoin-paiement-securise.com',
    content: 'Félicitations, votre canapé a été payé. Cliquez pour valider l\'expédition et recevoir les 200€.',
    clues: ['Validation d\'expédition via email', 'Faux domaine de paiement'],
    feedback: 'Le système de paiement sécurisé Leboncoin est intégré au site. Ne cliquez jamais sur des liens externes.'
  },
  {
    id: 120,
    type: 'phishing',
    title: 'SFR - Erreur de prélèvement',
    sender: 'facturation@sfr-contact-assistance.fr',
    content: 'Nous n\'avons pas pu prélever votre facture de 15€. Sans paiement manuel sous 24h, votre ligne sera restreinte.',
    clues: ['Menace de coupure immédiate', 'Faux domaine SFR'],
    feedback: 'Les relances d\'impayés opérateurs ne menacent pas d\'une coupure sous 24h.'
  },
  {
    id: 121,
    type: 'legit',
    title: 'La Redoute - Votre panier vous attend',
    sender: 'news@laredoute.fr',
    content: 'Vous avez oublié un article dans votre panier. Finalisez votre commande et profitez de la livraison offerte.',
    clues: ['Email de relance de panier abandonné', 'Pratique e-commerce courante', 'Domaine officiel'],
    feedback: 'Relance commerciale classique.'
  },
  {
    id: 122,
    type: 'phishing',
    title: 'Apple iCloud - Stockage saturé',
    sender: 'storage@icloud-apple-support.net',
    content: 'Vos photos et vidéos iCloud ne sont plus sauvegardées car votre stockage de 5Go est plein. Achetez 50Go supplémentaires ici.',
    clues: ['Lien d\'achat externe pour iCloud', 'Domaine .net'],
    feedback: 'L\'achat d\'espace iCloud se fait directement depuis les réglages de l\'iPhone ou du Mac, jamais via un navigateur web.'
  },
  {
    id: 123,
    type: 'phishing',
    title: 'Binance - Tentative de connexion',
    sender: 'security@binance-alerts-auth.com',
    content: 'Une connexion non autorisée depuis l\'Ukraine a été détectée sur votre portefeuille crypto. Transférez vos fonds vers ce portefeuille sécurisé temporaire.',
    clues: ['Demande de transfert de fonds', 'Urgence sécuritaire'],
    feedback: 'Arnaque courante dans les cryptomonnaies : aucune plateforme ne demandera de transférer des fonds vers un "portefeuille sécurisé".'
  },
  {
    id: 124,
    type: 'legit',
    title: 'Blizzard - Cadeau in-game',
    sender: 'newsletter@email.blizzard.com',
    content: 'Un familier exclusif vous attend dans World of Warcraft. Connectez-vous au jeu pour le récupérer !',
    clues: ['Demande de se connecter "au jeu" et non via un lien', 'Domaine officiel d\'emailing'],
    feedback: 'Email promotionnel de jeux vidéo incitant à ouvrir l\'application.'
  },
  {
    id: 125,
    type: 'phishing',
    title: 'Spotify - Premium offert pendant 1 an',
    sender: 'promo@spotify-free-premium.com',
    content: 'Vous avez été sélectionné pour 1 an de Spotify Premium gratuit. Entrez votre numéro de carte bleue pour la garantie.',
    clues: ['Offre irréaliste', 'Demande de CB pour un cadeau "gratuit"'],
    feedback: 'Si c\'est trop beau pour être vrai, c\'est du phishing.'
  },
  {
    id: 126,
    type: 'phishing',
    title: 'Amendes.gouv - Rejet de paiement',
    sender: 'recouvrement@antai-amendes-paiement.fr',
    content: 'Le paiement de votre contravention a été rejeté par votre banque. Veuillez recommencer le paiement avec une autre carte.',
    clues: ['Relance de paiement suspecte', 'Faux portail de paiement'],
    feedback: 'L\'administration française n\'envoie pas d\'email de relance de rejet de paiement bancaire de cette manière.'
  },
  {
    id: 127,
    type: 'legit',
    title: 'Fnac - Confirmation de réservation',
    sender: 'billetterie@fnac.com',
    content: 'Votre réservation pour le spectacle de ce week-end est confirmée. Vous pouvez imprimer vos billets.',
    clues: ['Achat confirmé', 'Domaine officiel'],
    feedback: 'Confirmation d\'achat de billetterie.'
  },
  {
    id: 128,
    type: 'phishing',
    title: 'LinkedIn - Votre profil est très consulté',
    sender: 'notifications@linkedin-premium-stats.com',
    content: '14 chasseurs de têtes ont vu votre profil cette semaine. Passez à la version Premium via ce lien pour voir qui ils sont.',
    clues: ['Faux domaine LinkedIn', 'Incite à cliquer pour découvrir une information cachée'],
    feedback: 'Les vrais emails LinkedIn utilisent le domaine @linkedin.com et redirigent vers l\'application.'
  },
  {
    id: 129,
    type: 'phishing',
    title: 'Allocations Familiales - Aide exceptionnelle',
    sender: 'contact@caf-aides-exceptionnelles.fr',
    content: 'La CAF vous accorde une prime inflation de 150€. Validez vos informations bancaires pour recevoir le virement.',
    clues: ['Promesse d\'argent', 'Domaine frauduleux'],
    feedback: 'La CAF verse les aides automatiquement sur le compte bancaire déjà renseigné dans votre dossier sécurisé.'
  },
  {
    id: 130,
    type: 'legit',
    title: 'GitHub - Nouveau commit sur votre dépôt',
    sender: 'noreply@github.com',
    content: 'L\'utilisateur "dev_jean" a poussé de nouveaux changements sur la branche main de votre projet.',
    clues: ['Notification technique standard', 'Domaine officiel'],
    feedback: 'Notification de développement logiciel.'
  },
  {
    id: 131,
    type: 'phishing',
    title: 'Discord - Nitro gratuit',
    sender: 'gifts@discord-nitro-free.com',
    content: 'Un ami vous a offert 1 mois de Discord Nitro ! Connectez-vous via Steam ou Epic Games pour le réclamer.',
    clues: ['Demande de connexion via des comptes tiers (Steam)', 'Domaine frauduleux'],
    feedback: 'C\'est une arnaque au "Fake Nitro" très répandue sur Discord pour voler des comptes Steam ou Discord.'
  },
  {
    id: 132,
    type: 'legit',
    title: 'Doctolib - Documents partagés',
    sender: 'no-reply@doctolib.fr',
    content: 'Le Dr Martin a partagé un document (ordonnance) dans votre espace sécurisé Doctolib.',
    clues: ['Ne met pas le document en pièce jointe (confidentialité)', 'Domaine officiel'],
    feedback: 'Procédure sécurisée standard pour les documents médicaux.'
  },
  {
    id: 133,
    type: 'phishing',
    title: 'Vinci Autoroutes - Télépéage impayé',
    sender: 'service-client@vinci-telepeage-alertes.fr',
    content: 'Le dernier passage au péage n\'a pas pu être prélevé (3,40€). Votre badge Ulys est désactivé. Réglez le solde ici.',
    clues: ['Menace de désactivation du badge', 'Faux domaine Vinci'],
    feedback: 'Les sociétés d\'autoroute gèrent les impayés via l\'espace abonné officiel, pas par des liens de paiement d\'urgence.'
  },
  {
    id: 134,
    type: 'phishing',
    title: 'Airbnb - Avis négatif',
    sender: 'reviews@airbnb-guest-feedback.com',
    content: 'Un hôte vient de vous laisser un avis de 1 étoile ! Lisez son commentaire et répondez-y avant sa publication publique.',
    clues: ['Sujet très anxiogène (mauvaise réputation)', 'Lien pointant vers un faux site de connexion'],
    feedback: 'Les escrocs utilisent la peur d\'une mauvaise réputation (Airbnb, Google Avis, etc.) pour vous faire cliquer sans réfléchir.'
  },
  {
    id: 135,
    type: 'legit',
    title: 'Pôle Emploi - Entretien téléphonique',
    sender: 'conseiller@francetravail.fr',
    content: 'Votre conseiller vous donne rendez-vous pour un point téléphonique le 12 juin à 14h. Soyez disponible.',
    clues: ['Information de rendez-vous', 'Domaine officiel de France Travail (ex Pôle Emploi)'],
    feedback: 'Convocation légitime à un entretien.'
  },
  {
    id: 136,
    type: 'phishing',
    title: 'L\'Assurance Retraite - Demande de certificat de vie',
    sender: 'certificat@retraite-cnav-france.net',
    content: 'Afin de continuer à percevoir votre pension, veuillez remplir et envoyer votre certificat de vie accompagné de votre pièce d\'identité.',
    clues: ['Demande de documents personnels', 'Extension en .net'],
    feedback: 'Les demandes de certificats de vie se font via le portail officiel (info-retraite.fr) de manière sécurisée.'
  },
  {
    id: 137,
    type: 'phishing',
    title: 'McAfee - Votre PC est infecté (5 virus trouvés)',
    sender: 'alertes@mcafee-protection-pc.com',
    content: 'Attention ! Votre ordinateur est fortement infecté. Cliquez sur le bouton "Nettoyer" pour supprimer les menaces.',
    clues: ['Création de panique extrême (5 virus)', 'Un antivirus n\'analyse pas votre PC depuis un email'],
    feedback: 'Technique de "Scareware" (logiciel faisant peur) pour vous faire installer un vrai malware en pensant nettoyer votre PC.'
  },
  {
    id: 138,
    type: 'legit',
    title: 'Google Maps - Vos statistiques du mois',
    sender: 'noreply-maps@google.com',
    content: 'Découvrez vos trajets du mois de mars : vous avez parcouru 450 km et visité 3 nouvelles villes.',
    clues: ['Résumé de statistiques', 'Domaine officiel de Google'],
    feedback: 'Email "Timeline" récapitulatif de Google Maps.'
  },
  {
    id: 139,
    type: 'phishing',
    title: 'Western Union - Virement en attente',
    sender: 'transfert@westernunion-secure-pay.com',
    content: 'M. Dubois vous a envoyé 500€. Pour retirer les fonds, veuillez payer les frais de dossier internationaux de 15€.',
    clues: ['Frais de dossier pour récupérer de l\'argent', 'Faux domaine'],
    feedback: 'L\'arnaque "à la nigériane" ou "avance de frais" : payer pour recevoir un faux pactole.'
  },
  {
    id: 140,
    type: 'phishing',
    title: 'IKEA - Programme IKEA Family',
    sender: 'fidelite@ikea-family-rewards.net',
    content: 'Vos 1500 points de fidélité expirent ce soir. Convertissez-les en bons d\'achat de 50€ via ce lien.',
    clues: ['Urgence sur les points de fidélité', 'Domaine frauduleux'],
    feedback: 'Les programmes de fidélité sont une cible de choix pour voler des comptes clients existants.'
  },
  {
    id: 141,
    type: 'legit',
    title: 'OVHcloud - Renouvellement de votre nom de domaine',
    sender: 'support@ovh.com',
    content: 'Le nom de domaine "mon-site.fr" arrive à expiration dans 30 jours. Pensez à configurer le renouvellement automatique.',
    clues: ['Préavis long (30 jours)', 'Domaine officiel d\'hébergeur', 'Rappel informatif'],
    feedback: 'Email de relance de renouvellement classique dans le milieu de l\'hébergement web.'
  },
  {
    id: 142,
    type: 'phishing',
    title: 'Banque Populaire - Alerte Cyber@ttaque',
    sender: 'urgence@banque-populaire-securite.com',
    content: 'Suite à une cyberattaque nationale, sécurisez immédiatement vos fonds en les transférant sur le RIB de sécurité ci-joint.',
    clues: ['Prétexte d\'une attaque globale pour justifier l\'urgence', 'Demande de virement vers un RIB externe'],
    feedback: 'Aucune banque ne vous demandera jamais de transférer votre argent vers un "compte de sécurité" externe.'
  },
  {
    id: 143,
    type: 'phishing',
    title: 'EDF - Erreur de compteur Linky',
    sender: 'technicien@edf-linky-intervention.fr',
    content: 'Une anomalie de comptage a été signalée sur votre Linky. Vous devez 450€ de régularisation. Payez maintenant pour éviter la coupure.',
    clues: ['Menace de coupure suite à une erreur technique inexpliquée', 'Faux domaine'],
    feedback: 'Les régularisations se font sur les factures officielles d\'EDF ou Enedis, avec un échéancier possible, jamais dans l\'urgence par mail.'
  },
  {
    id: 144,
    type: 'legit',
    title: 'Deliveroo - Vos avantages Deliveroo Plus',
    sender: 'hello@deliveroo.fr',
    content: 'Rappel de vos avantages : avec Deliveroo Plus, la livraison est offerte sur toutes vos commandes de plus de 12€.',
    clues: ['Communication marketing', 'Domaine officiel'],
    feedback: 'Email commercial légitime récapitulant les avantages d\'un abonnement.'
  },
  {
    id: 145,
    type: 'phishing',
    title: 'La Redoute - Erreur d\'adressage',
    sender: 'livraison@laredoute-suivi-commande.com',
    content: 'L\'adresse de livraison de votre dernière commande est incomplète. Mettez-la à jour rapidement pour que le colis parte ce soir.',
    clues: ['Urgence d\'expédition', 'Fausse plateforme de suivi', 'Peut mener à une demande de paiement pour relivraison'],
    feedback: 'Une arnaque très courante pour récupérer nom, adresse et numéro de téléphone (puis potentiellement faire du Smishing).'
  },
  {
    id: 146,
    type: 'phishing',
    title: 'Gendarmerie Nationale - Convocation en justice',
    sender: 'brigade@gendarmerie-cyber-justice.net',
    content: 'Vous êtes convoqué devant le tribunal pour des faits graves (pédopornographie). Téléchargez la convocation PDF ci-jointe pour en prendre connaissance.',
    clues: ['Accusation extrêmement grave pour paralyser la victime', 'Demande d\'ouverture de pièce jointe ou paiement d\'amende'],
    feedback: 'Arnaque au faux policier. La Gendarmerie ou la Police ne convoque jamais pour des faits de ce type par un simple email non signé.'
  },
  {
    id: 147,
    type: 'legit',
    title: 'Canva - Votre design a été partagé',
    sender: 'notifications@canva.com',
    content: 'Marie a partagé le design "Présentation Q3" avec vous. Vous avez les droits de modification.',
    clues: ['Notification d\'outil collaboratif', 'Domaine officiel'],
    feedback: 'Email automatique de Canva lorsqu\'un document est partagé.'
  },
  {
    id: 148,
    type: 'phishing',
    title: 'Instagram - Droit à l\'image',
    sender: 'legal@ig-copyright-complaints.com',
    content: 'Une de vos photos viole le droit à l\'image d\'une personne. Supprimez la photo via ce formulaire ou votre compte sera suspendu.',
    clues: ['Menace légale', 'Faux domaine de support'],
    feedback: 'Les demandes de retrait de contenu se font directement dans l\'interface de l\'application, pas via des formulaires externes.'
  },
  {
    id: 149,
    type: 'phishing',
    title: 'Carrefour - Carte Pass expirée',
    sender: 'service-client@carrefour-pass-finances.fr',
    content: 'Votre carte Pass arrive à expiration. Confirmez votre numéro de carte bleue actuel pour recevoir la nouvelle par courrier.',
    clues: ['Demande de numéro complet de CB', 'Faux portail financier'],
    feedback: 'Le renouvellement des cartes de crédit de magasin est automatique, on ne vous demandera pas de ressaisir la carte entière.'
  },
  {
    id: 150,
    type: 'legit',
    title: 'RATP - Info Trafic',
    sender: 'info-trafic@ratp.fr',
    content: 'En raison de travaux, le trafic sera interrompu sur la Ligne 1 ce week-end entre les stations Bastille et Nation.',
    clues: ['Information pure de service public', 'Aucun lien suspect', 'Domaine officiel'],
    feedback: 'Email informatif légitime d\'un service de transport public.'
  },
  {
    id: 151,
    type: 'phishing',
    title: 'FranceConnect - Nouvelle connexion suspecte',
    sender: 'alerte@france-connect-securite.fr',
    content: 'Une connexion à votre compte a été bloquée. Confirmez votre numéro de Sécurité Sociale et mot de passe pour le déverrouiller.',
    clues: ['Demande du numéro de SS par email', 'Faux domaine FranceConnect'],
    feedback: 'FranceConnect ne demande jamais d\'identifiants par email. Le service sert juste de passerelle sécurisée.'
  },
  {
    id: 152,
    type: 'legit',
    title: 'Ledger - Mise à jour du firmware disponible',
    sender: 'noreply@ledger.com',
    content: 'Une nouvelle version du firmware (v2.1) est disponible pour votre Ledger Nano. Mettez-le à jour via l\'application Ledger Live.',
    clues: ['Demande de passer par l\'application officielle', 'Domaine légitime', 'Pas de lien externe direct'],
    feedback: 'Email informatif légitime. La clé d\'une bonne sécurité crypto est de toujours passer par le logiciel officiel.'
  },
  {
    id: 153,
    type: 'phishing',
    title: 'MetaMask - Portefeuille compromis',
    sender: 'support@metamask-wallet-auth.com',
    content: 'Votre portefeuille a été ciblé par une attaque. Entrez votre "Seed Phrase" (phrase de récupération) de 12 mots ici pour le sécuriser.',
    clues: ['Demande de la Seed Phrase', 'Urgence critique'],
    feedback: 'Règle d\'or de la crypto : Ne JAMAIS donner sa Seed Phrase. Le support ne la demandera jamais.'
  },
  {
    id: 154,
    type: 'legit',
    title: 'Coinbase - Dépôt reçu',
    sender: 'no-reply@coinbase.com',
    content: 'Vous venez de recevoir 0.05 BTC sur votre portefeuille. La transaction a été confirmée sur la blockchain.',
    clues: ['Information de transaction standard', 'Domaine officiel'],
    feedback: 'Notification de dépôt de cryptomonnaie.'
  },
  {
    id: 155,
    type: 'phishing',
    title: 'N26 - Compte bloqué pour vérification fiscale',
    sender: 'compliance@n26-bank-europe.net',
    content: 'Conformément aux directives européennes, votre compte est gelé. Téléchargez le formulaire PDF joint, remplissez-le et renvoyez-le avec une copie de votre passeport.',
    clues: ['Demande de pièce d\'identité par retour de mail', 'Fausse directive européenne'],
    feedback: 'Les néobanques comme N26 gèrent les vérifications d\'identité exclusivement via l\'appareil photo de leur application.'
  },
  {
    id: 156,
    type: 'legit',
    title: 'Revolut - Votre carte virtuelle est prête',
    sender: 'no-reply@revolut.com',
    content: 'Votre nouvelle carte virtuelle éphémère a été créée. Vous pouvez l\'utiliser pour vos achats en ligne en toute sécurité.',
    clues: ['Action positive sans demande', 'Domaine officiel'],
    feedback: 'Notification de création de carte virtuelle.'
  },
  {
    id: 157,
    type: 'phishing',
    title: 'Paylib - Vous avez reçu un paiement',
    sender: 'transfert@paylib-reception.fr',
    content: 'Un proche vous a envoyé 45€. Pour encaisser ce montant, veuillez sélectionner votre banque et entrer vos identifiants web.',
    clues: ['Demande d\'identifiants bancaires pour RECEVOIR de l\'argent', 'Domaine non officiel'],
    feedback: 'Paylib verse l\'argent directement sur le compte lié au numéro de téléphone, sans demander de se connecter.'
  },
  {
    id: 158,
    type: 'legit',
    title: 'Benoit (via Lydia) - Remboursement pizza',
    sender: 'hello@lydia-app.com',
    content: 'Benoit vient de vous payer 12,50 € pour "Pizza hier soir". L\'argent est disponible sur votre solde Lydia.',
    clues: ['Montant faible et précis', 'Contexte social', 'Domaine officiel'],
    feedback: 'Notification classique de remboursement entre amis.'
  },
  {
    id: 159,
    type: 'phishing',
    title: 'Télépéage Ulys - Facture impayée',
    sender: 'facturation@ulys-vinci-autoroutes.net',
    content: 'Votre facture de péage de 34,20€ a été rejetée. Votre badge sera bloqué à la prochaine barrière. Payez immédiatement par carte.',
    clues: ['Menace d\'inconvénient fort (blocage au péage)', 'Domaine frauduleux'],
    feedback: 'Les rejets de prélèvement sont gérés dans l\'espace client, pas par des paiements directs par email.'
  },
  {
    id: 160,
    type: 'legit',
    title: 'AirBnB - Votre récapitulatif de voyage',
    sender: 'receipts@airbnb.com',
    content: 'Merci d\'avoir voyagé avec nous ! Voici votre reçu final pour votre séjour de 3 nuits à Lyon.',
    clues: ['Reçu post-voyage', 'Domaine officiel'],
    feedback: 'Facturation automatique post-séjour.'
  },
  {
    id: 161,
    type: 'phishing',
    title: 'Apple - Votre identifiant a été utilisé pour un achat',
    sender: 'noreply@apple-support-itunes-store.com',
    content: 'Un achat de 149,99€ (Abonnement Tinder Gold) a été effectué depuis un appareil inconnu. Si ce n\'est pas vous, cliquez ici pour annuler.',
    clues: ['Achat fictif pour déclencher la panique', 'Lien d\'annulation qui est une page de phishing'],
    feedback: 'Arnaque courante. Apple ne met pas de lien "Annuler" direct dans ses reçus.'
  },
  {
    id: 162,
    type: 'legit',
    title: 'Google Play - Confirmation d\'achat',
    sender: 'googleplay-noreply@google.com',
    content: 'Merci pour votre achat sur Google Play. Application : Minecraft (7,99€).',
    clues: ['Montant standard', 'Pas de pression', 'Domaine officiel'],
    feedback: 'Reçu d\'achat d\'application légitime.'
  },
  {
    id: 163,
    type: 'phishing',
    title: 'Ministère de l\'Intérieur - Plainte déposée contre vous',
    sender: 'convocation@police-nationale-dossier.org',
    content: 'Une plainte pour fraude fiscale a été déposée contre vous. Ouvrez le document joint (Convocation_Tribunal.pdf.exe) pour voir les détails.',
    clues: ['Double extension de fichier (.pdf.exe)', 'Faux domaine du ministère'],
    feedback: 'L\'extension .exe cachée derrière un faux PDF est un virus classique (Trojan/Ransomware).'
  },
  {
    id: 164,
    type: 'legit',
    title: 'Service-Public.fr - Suivi de votre démarche',
    sender: 'ne-pas-repondre@service-public.fr',
    content: 'Votre demande de changement d\'adresse a bien été transmise aux organismes partenaires. Vous pouvez suivre l\'état d\'avancement dans votre espace.',
    clues: ['Information de suivi', 'Domaine officiel en .fr', 'Aucun fichier sensible demandé'],
    feedback: 'Email de suivi de démarche administrative légitime.'
  },
  {
    id: 165,
    type: 'phishing',
    title: 'DHL Express - Adresse introuvable',
    sender: 'delivery@dhl-express-logistics.net',
    content: 'Le livreur n\'a pas trouvé votre adresse. Remplissez ce formulaire d\'informations et payez 1.50€ pour une relivraison demain.',
    clues: ['Demande de paiement pour relivraison', 'Domaine non officiel'],
    feedback: 'Une relivraison pour adresse introuvable est gratuite et se gère via le numéro de suivi officiel.'
  },
  {
    id: 166,
    type: 'legit',
    title: 'Mondial Relay - Votre colis est disponible au Point Relais',
    sender: 'noreply@mondialrelay.fr',
    content: 'Votre colis Vinted vous attend au point relais "Presse Café". Vous avez 8 jours pour le retirer avec une pièce d\'identité.',
    clues: ['Domaine officiel', 'Information locale précise', 'Pas de paiement demandé'],
    feedback: 'Notification de mise à disposition classique.'
  },
  {
    id: 167,
    type: 'phishing',
    title: 'Tesco / Carrefour - Vous avez gagné un chariot de courses !',
    sender: 'gagnant@carrefour-recompenses.com',
    content: 'Félicitations, vous faites partie des 10 gagnants du jour ! Réclamez votre carte cadeau de 500€ en payant uniquement les frais d\'envoi de 2€.',
    clues: ['Promesse de gain disproportionné', 'Demande de frais d\'envoi pour une carte cadeau (qui pourrait être numérique)'],
    feedback: 'Arnaque au faux concours très répandue.'
  },
  {
    id: 168,
    type: 'legit',
    title: 'Leclerc - Votre ticket de caisse',
    sender: 'ticket@e.leclerc',
    content: 'Merci de votre visite dans notre magasin. Retrouvez le détail de vos achats et vos tickets E.Leclerc cumulés en pièce jointe.',
    clues: ['Ticket dématérialisé', 'Domaine officiel court'],
    feedback: 'Email légitime de ticket de caisse dématérialisé.'
  },
  {
    id: 169,
    type: 'phishing',
    title: 'Norton 360 - Facture prélevée : 349.99€',
    sender: 'billing@norton-auto-renew.net',
    content: 'Votre abonnement a été renouvelé avec succès pour 3 ans (349.99€). Si vous souhaitez annuler, appelez immédiatement notre service client au 09 70 XX XX XX.',
    clues: ['Montant abusif pour faire réagir', 'Incite à appeler un numéro (vishing)'],
    feedback: 'L\'arnaque au support technique utilise ces faux reçus pour vous faire appeler un faux centre d\'appels.'
  },
  {
    id: 170,
    type: 'legit',
    title: 'Avast - Rapport mensuel de sécurité',
    sender: 'newsletter@avast.com',
    content: 'Ce mois-ci, Avast a bloqué 12 traqueurs et protégé votre connexion sur 4 réseaux Wi-Fi publics. Voir le rapport complet.',
    clues: ['Rapport informatif', 'Pas de menace', 'Domaine officiel'],
    feedback: 'Rapport périodique d\'antivirus.'
  },
  {
    id: 171,
    type: 'phishing',
    title: 'Netflix - Nous devons suspendre votre compte',
    sender: 'support@neftlix-assistance.com',
    content: 'Nous n\'avons pas pu facturer votre abonnement. Sans mise à jour de votre carte de crédit dans les 24h, vous perdrez vos profils.',
    clues: ['Faute de frappe dans le domaine (neftlix)', 'Menace de perte des profils', 'Urgence'],
    feedback: 'Le typosquatting (inverser deux lettres comme tf -> ft) est une technique redoutable.'
  },
  {
    id: 172,
    type: 'legit',
    title: 'Disney+ - Votre code d\'accès à usage unique',
    sender: 'no-reply@mail.disneyplus.com',
    content: 'Voici votre code à 6 chiffres pour vous connecter à votre téléviseur : 849201. Il expire dans 15 minutes.',
    clues: ['Code OTP standard', 'Expire rapidement, ce qui est normal', 'Domaine officiel'],
    feedback: 'Code de vérification légitime envoyé lors d\'une tentative de connexion.'
  },
  {
    id: 173,
    type: 'phishing',
    title: 'Tinder - Votre compte va être banni',
    sender: 'safety@tinder-moderation-team.com',
    content: 'Suite à de multiples signalements pour comportement inapproprié, votre compte va être fermé. Cliquez ici pour faire appel et prouver votre identité avec votre CB.',
    clues: ['Demande de CB pour prouver son identité', 'Menace de bannissement'],
    feedback: 'Les applications de rencontre ne demandent jamais de carte bancaire pour vérifier une identité suite à un signalement.'
  },
  {
    id: 174,
    type: 'legit',
    title: 'Meetic - Nouveau Like',
    sender: 'notifications@meetic.fr',
    content: 'Quelqu\'un a craqué pour votre profil ! Connectez-vous à l\'application pour découvrir de qui il s\'agit.',
    clues: ['Incite à ouvrir l\'application', 'Domaine officiel'],
    feedback: 'Notification de plateforme de rencontre.'
  },
  {
    id: 175,
    type: 'phishing',
    title: 'LinkedIn - Offre d\'emploi : Directeur Marketing (120k€)',
    sender: 'recrutement@linkedin-talent-scout.com',
    content: 'Votre profil correspond parfaitement à une offre confidentielle. Téléchargez la fiche de poste jointe (Fiche_Poste.docm) et activez les macros pour la lire.',
    clues: ['Offre très alléchante', 'Fichier .docm (Word avec Macros)', 'Faux domaine LinkedIn'],
    feedback: 'Le fichier .docm est extrêmement dangereux. Activer les macros permet l\'installation de malwares.'
  },
  {
    id: 176,
    type: 'legit',
    title: 'Indeed - Alerte Emploi : Développeur Web à Lyon',
    sender: 'alert@indeed.com',
    content: 'Voici 5 nouvelles offres d\'emploi correspondant à votre recherche "Développeur Web" autour de Lyon.',
    clues: ['Correspond à une recherche enregistrée', 'Domaine officiel'],
    feedback: 'Alerte emploi automatique.'
  },
  {
    id: 177,
    type: 'phishing',
    title: 'CAF - Ajustement de vos APL',
    sender: 'dossier@caf-allocations-ajustement.fr',
    content: 'Vos aides au logement ont été recalculées à la hausse. Pour percevoir le rattrapage de 340€, fournissez une photo de votre carte bancaire recto-verso.',
    clues: ['Demande de carte bancaire recto-verso (permet de faire des achats)', 'Faux domaine CAF'],
    feedback: 'Ne jamais envoyer de photo de sa carte bancaire. La CAF possède déjà votre RIB.'
  },
  {
    id: 178,
    type: 'legit',
    title: 'URSSAF - Déclaration de revenus des indépendants',
    sender: 'noreply@urssaf.fr',
    content: 'La campagne de déclaration des revenus 2025 est ouverte. Vous avez jusqu\'au 30 juin pour effectuer votre déclaration en ligne.',
    clues: ['Information de calendrier fiscal', 'Domaine officiel'],
    feedback: 'Rappel d\'échéance administrative.'
  },
  {
    id: 179,
    type: 'phishing',
    title: 'Spotify - Changement de politique de prix',
    sender: 'update@spotify-billing-team.com',
    content: 'Le prix de votre abonnement passe à 19.99€/mois. Pour conserver votre tarif actuel, revalidez vos conditions de paiement ici.',
    clues: ['Hausse de prix inventée pour forcer une action', 'Faux domaine de facturation'],
    feedback: 'Les hausses de prix sont généralement informatives. Devoir revalider une carte pour garder un ancien prix est une arnaque.'
  },
  {
    id: 180,
    type: 'legit',
    title: 'Deezer - Votre Flow de la semaine',
    sender: 'newsletter@deezer.com',
    content: 'Nous avons préparé une playlist sur mesure basée sur vos écoutes de la semaine dernière. Appuyez sur play !',
    clues: ['Contenu musical inoffensif', 'Domaine officiel'],
    feedback: 'Newsletter musicale légitime.'
  },
  {
    id: 181,
    type: 'phishing',
    title: 'IT Support - Désactivation de votre boîte mail',
    sender: 'postmaster@webmail-admin-portal.net',
    content: 'Vous avez dépassé le quota de votre messagerie d\'entreprise (2000 MB). Votre compte sera supprimé ce soir à minuit. Augmentez votre quota en vous connectant ici.',
    clues: ['Menace de suppression de compte pro', 'Expéditeur générique non lié à l\'entreprise'],
    feedback: 'Le support IT n\'efface pas les comptes professionnels pour dépassement de quota.'
  },
  {
    id: 182,
    type: 'legit',
    title: 'Google Workspace - Nouveau partage',
    sender: 'drive-shares-noreply@google.com',
    content: 'Sophie a partagé le dossier "Projet Alpha Q3" avec vous. Vous disposez d\'un accès en lecture seule.',
    clues: ['Notification de partage standard', 'Domaine Google officiel'],
    feedback: 'Notification de collaboration légitime.'
  },
  {
    id: 183,
    type: 'phishing',
    title: 'PDG - Demande confidentielle (URGENT)',
    sender: 'jean.dupont.ceo@gmail.com',
    content: 'Es-tu au bureau ? J\'ai besoin que tu m\'achètes 5 cartes cadeaux Transcash de 100€ pour fidéliser des clients importants. C\'est très urgent, je suis en réunion.',
    clues: ['Demande de cartes prépayées', 'Adresse Gmail pour un PDG', 'Urgence et confidentialité'],
    feedback: 'Arnaque "aux cartes cadeaux" ciblant les employés (variante de la Fraude au Président).'
  },
  {
    id: 184,
    type: 'legit',
    title: 'Service RH - Planning des congés d\'été',
    sender: 'rh@votre-entreprise.com',
    content: 'Veuillez saisir vos demandes de congés d\'été dans l\'outil SIRH avant le 15 avril pour validation par vos managers.',
    clues: ['Processus interne normal', 'Aucun fichier joint piégé, invite à aller sur l\'outil habituel'],
    feedback: 'Communication RH interne typique.'
  },
  {
    id: 185,
    type: 'phishing',
    title: 'DocuSign - Contrat de partenariat',
    sender: 'signature@docusign-secure-document.com',
    content: 'Le cabinet d\'avocats vous a envoyé un document via DocuSign. Pour le signer, vous devez vous authentifier avec vos identifiants Microsoft 365.',
    clues: ['Demande d\'identifiants M365 pour signer un document externe', 'Faux domaine DocuSign'],
    feedback: 'Technique pour voler les identifiants Office 365 des entreprises.'
  },
  {
    id: 186,
    type: 'legit',
    title: 'Slack - Invitation à rejoindre l\'espace de travail',
    sender: 'feedback@slack.com',
    content: 'Thomas vous invite à rejoindre l\'espace de travail "Projet Refonte Web" sur Slack. Cliquez pour créer votre compte.',
    clues: ['Invitation à collaborer', 'Domaine officiel'],
    feedback: 'Email d\'invitation légitime.'
  },
  {
    id: 187,
    type: 'phishing',
    title: 'WeTransfer - Fichiers de la comptabilité',
    sender: 'transfert@wetransfer-compta-pro.net',
    content: 'Le cabinet comptable vous a envoyé les bilans 2025. Attention, le lien expire dans 2 heures. Cliquez pour télécharger l\'archive ZIP.',
    clues: ['Urgence extrême (2h) pour WeTransfer (qui dure normalement 7 jours)', 'Faux domaine'],
    feedback: 'Le faux WeTransfer cachant un fichier ZIP vérolé est une méthode classique d\'infection d\'entreprise.'
  },
  {
    id: 188,
    type: 'legit',
    title: 'Zoom - L\'enregistrement de la réunion est disponible',
    sender: 'no-reply@zoom.us',
    content: 'L\'enregistrement dans le cloud de la réunion "Point Hebdo" est maintenant disponible. Vous pouvez le visionner ou le partager.',
    clues: ['Action post-réunion', 'Domaine officiel'],
    feedback: 'Notification de mise à disposition d\'un enregistrement.'
  },
  {
    id: 189,
    type: 'phishing',
    title: 'Microsoft Teams - Vous avez été mentionné',
    sender: 'notifications@teams-microsoft-alerts.com',
    content: 'Votre manager vous a mentionné dans le canal "Restructuration". Connectez-vous d\'urgence pour lire le message complet.',
    clues: ['Sujet anxiogène ("Restructuration")', 'Faux domaine de notification Teams'],
    feedback: 'Exploitation de la curiosité et de l\'anxiété professionnelle.'
  },
  {
    id: 190,
    type: 'legit',
    title: 'Trello - Vous avez été assigné à une carte',
    sender: 'do-not-reply@trello.com',
    content: 'Marc vous a assigné à la carte "Corriger le bug d\'affichage sur mobile" dans le tableau "Sprint 12".',
    clues: ['Notification de gestion de projet', 'Domaine officiel'],
    feedback: 'Email de suivi de tâche inoffensif.'
  },
  {
    id: 191,
    type: 'phishing',
    title: 'Binance - Vérification anti-blanchiment',
    sender: 'kyc-compliance@binance-security-check.com',
    content: 'Dans le cadre des lois anti-blanchiment, votre compte crypto est gelé. Cliquez ici pour procéder à un appel vidéo avec un conseiller et libérer vos fonds.',
    clues: ['Fausse procédure de visio externe', 'Domaine frauduleux'],
    feedback: 'Les vérifications KYC se font via des procédures automatisées in-app, jamais via des liens externes suspects.'
  },
  {
    id: 192,
    type: 'legit',
    title: 'Kraken - Nouvelle connexion détectée',
    sender: 'noreply@kraken.com',
    content: 'Une connexion depuis une nouvelle adresse IP a été détectée sur votre compte. Si c\'est vous, ignorez ce message.',
    clues: ['Alerte IP standard en crypto', 'Domaine officiel'],
    feedback: 'Alerte de sécurité classique sur les plateformes d\'échange.'
  },
  {
    id: 193,
    type: 'phishing',
    title: 'OpenSea - Votre NFT a été vendu !',
    sender: 'sales@opensea-market-alerts.io',
    content: 'Félicitations, votre NFT vient d\'être vendu pour 2.5 ETH. Connectez votre portefeuille (Wallet) pour réclamer vos gains.',
    clues: ['Incite à connecter son portefeuille sur un site tiers', 'Extension .io suspecte (OpenSea utilise .io de manière légitime, mais là c\'est un sous-domaine bidon)'],
    feedback: 'Technique de "Wallet Draining" : en connectant votre portefeuille, un smart contract malveillant vide vos fonds.'
  },
  {
    id: 194,
    type: 'legit',
    title: 'Sorare - Résultat de la Game Week',
    sender: 'hello@sorare.com',
    content: 'La Game Week est terminée. Vos joueurs ont récolté 340 points. Découvrez votre classement et vos récompenses.',
    clues: ['Jeu de fantasy sport', 'Aucune demande d\'action risquée', 'Domaine officiel'],
    feedback: 'Récapitulatif de jeu inoffensif.'
  },
  {
    id: 195,
    type: 'phishing',
    title: 'Compte Ameli - Remboursement refusé',
    sender: 'contact@ameli-remboursement-mutuelle.fr',
    content: 'Le remboursement de vos frais dentaires (140€) a été refusé car votre RIB est obsolète. Mettez-le à jour immédiatement.',
    clues: ['Problème de remboursement inventé', 'Faux domaine Ameli'],
    feedback: 'L\'Assurance Maladie signale les rejets dans l\'espace personnel, elle ne demande pas un RIB par lien email.'
  },
  {
    id: 196,
    type: 'legit',
    title: 'Doctolib - Annulation de rendez-vous',
    sender: 'no-reply@doctolib.fr',
    content: 'Votre rendez-vous avec le Dr Leroux prévu le 12 mai à 10h a été annulé par le praticien. Vous pouvez reprendre rendez-vous sur le site.',
    clues: ['Information factuelle', 'Domaine officiel'],
    feedback: 'Notification d\'annulation légitime.'
  },
  {
    id: 197,
    type: 'phishing',
    title: 'Ministère de la Santé - Nouvelle dose de rappel',
    sender: 'vaccin@sante-gouv-france.org',
    content: 'Une nouvelle campagne de vaccination est obligatoire pour votre tranche d\'âge. Prenez rendez-vous via ce portail gouvernemental (frais de dossier 1,50€).',
    clues: ['Frais de dossier pour un service public gratuit', 'Fausse obligation'],
    feedback: 'La vaccination publique en France n\'implique jamais de frais de dossier en ligne.'
  },
  {
    id: 198,
    type: 'legit',
    title: 'EFS - Don de sang',
    sender: 'contact@efs.sante.fr',
    content: 'Les réserves de sang sont faibles. Une collecte est organisée près de chez vous la semaine prochaine. Prenez rendez-vous !',
    clues: ['Appel au don', 'Domaine institutionnel officiel'],
    feedback: 'Email de mobilisation légitime de l\'Établissement Français du Sang.'
  },
  {
    id: 199,
    type: 'phishing',
    title: 'EDF - Prime énergie de 200€',
    sender: 'aides@edf-prime-etat.fr',
    content: 'Suite à l\'augmentation des prix, l\'État vous accorde une prime de 200€. Remplissez vos coordonnées bancaires pour que nous puissions créditer votre compte.',
    clues: ['Promesse de virement par EDF', 'Domaine non officiel'],
    feedback: 'EDF ne distribue pas de primes d\'État par virement bancaire sur demande.'
  },
  {
    id: 200,
    type: 'legit',
    title: 'Enedis - Relevé de compteur Linky',
    sender: 'noreply@enedis.fr',
    content: 'Votre relevé de consommation mensuel a bien été télétransmis à votre fournisseur d\'énergie. Vous n\'avez aucune action à effectuer.',
    clues: ['Information automatique sans action requise', 'Domaine officiel'],
    feedback: 'Information standard de télérelève.'
  },
  {
    id: 201,
    type: 'phishing',
    title: 'Free Mobile - Gagnez le dernier iPhone',
    sender: 'concours@free-cadeaux-mobile.com',
    content: 'En tant qu\'abonné fidèle, vous avez été tiré au sort pour recevoir l\'iPhone 15 Pro ! Payez simplement les 2,99€ de frais de douane.',
    clues: ['Cadeau de grande valeur', 'Frais cachés (douane)', 'Faux domaine Free'],
    feedback: 'L\'arnaque aux faux cadeaux opérateurs est un grand classique pour soutirer des données bancaires.'
  },
  {
    id: 202,
    type: 'legit',
    title: 'Sosh - Fin de votre période d\'engagement',
    sender: 'client@sosh.fr',
    content: 'Votre période promotionnelle prend fin le mois prochain. Votre forfait passera à son tarif normal de 19,99€/mois.',
    clues: ['Rappel légal et commercial', 'Domaine officiel'],
    feedback: 'Notification de changement de tarif légitime.'
  },
  {
    id: 203,
    type: 'phishing',
    title: 'Orange - Facture double (Remboursement)',
    sender: 'service-client@orange-remboursement.net',
    content: 'Nous avons accidentellement prélevé votre facture deux fois ce mois-ci. Cliquez ici pour demander le remboursement sur votre carte bancaire.',
    clues: ['Promesse de remboursement sur carte', 'Faux domaine'],
    feedback: 'Les opérateurs remboursent toujours automatiquement via le mandat SEPA ou sur la facture suivante.'
  },
  {
    id: 204,
    type: 'legit',
    title: 'Bouygues Telecom - Information sur la fibre',
    sender: 'fibre@bouyguestelecom.fr',
    content: 'La fibre optique est désormais disponible dans votre quartier. Découvrez nos offres pour mettre à niveau votre connexion.',
    clues: ['Démarche commerciale ciblée géographiquement', 'Domaine officiel'],
    feedback: 'Email marketing légitime pour le déploiement de la fibre.'
  },
  {
    id: 205,
    type: 'phishing',
    title: 'PayPal - Une action est requise',
    sender: 'service@paypal-verification-centre.com',
    content: 'Votre compte est restreint. Vous ne pouvez plus ni envoyer ni recevoir d\'argent. Soumettez une pièce d\'identité et un justificatif de domicile via ce lien.',
    clues: ['Restriction de compte', 'Faux centre de vérification PayPal'],
    feedback: 'Le "Centre de résolution" PayPal est directement dans l\'application. Les liens d\'emails pour lever une restriction sont frauduleux.'
  },
  {
    id: 206,
    type: 'legit',
    title: 'Lydia - Vos limites ont été augmentées',
    sender: 'support@lydia-app.com',
    content: 'Suite à la validation de votre identité, vos limites de paiement et de retrait ont été augmentées. Profitez pleinement de votre compte !',
    clues: ['Action positive suite à une démarche utilisateur', 'Domaine officiel'],
    feedback: 'Confirmation d\'augmentation de plafonds bancaires.'
  },
  {
    id: 207,
    type: 'phishing',
    title: 'Société Générale - Validation de sécurité (DSP2)',
    sender: 'securite@sg-dsp2-authentification.fr',
    content: 'Conformément à la nouvelle loi DSP2, vous devez synchroniser votre téléphone avec votre compte bancaire. Entrez votre identifiant client à 8 chiffres.',
    clues: ['Utilisation de jargon légal (DSP2)', 'Demande de l\'identifiant client', 'Faux domaine'],
    feedback: 'Les banques n\'envoient pas de lien externe pour "synchroniser" un appareil.'
  },
  {
    id: 208,
    type: 'legit',
    title: 'Crédit Mutuel - Votre relevé de carte',
    sender: 'ne-pas-repondre@creditmutuel.fr',
    content: 'L\'encours de votre carte à débit différé pour le mois de mai est disponible. Le prélèvement aura lieu le 30 du mois.',
    clues: ['Information sur le débit différé', 'Aucune action requise', 'Domaine officiel'],
    feedback: 'Notification bancaire standard.'
  },
  {
    id: 209,
    type: 'phishing',
    title: 'La Banque Postale - Nouveau RIB enregistré',
    sender: 'alerte@labanquepostale-securite.com',
    content: 'Un nouveau bénéficiaire "M. Dubois" a été ajouté à votre liste de virements. Si vous n\'êtes pas à l\'origine de cette opération, annulez-la ici.',
    clues: ['Alerte anxiogène (ajout de RIB inconnu)', 'Lien pour "annuler" qui vole les accès'],
    feedback: 'Technique pour créer la panique. Si vous doutez, connectez-vous toujours par vous-même à l\'application de votre banque.'
  },
  {
    id: 210,
    type: 'legit',
    title: 'Boursorama - Parrainez vos amis',
    sender: 'parrainage@boursorama.com',
    content: 'Ce week-end seulement : gagnez 130€ pour chaque ami parrainé qui ouvre un compte chez Boursorama Banque (Pink Weekend).',
    clues: ['Offre commerciale classique (Pink Weekend)', 'Montants conformes aux habitudes de la banque'],
    feedback: 'Offre promotionnelle de parrainage légitime.'
  },
  {
    id: 211,
    type: 'phishing',
    title: 'Uber - Facture de course (89,50€)',
    sender: 'receipts@uber-rides-billing.com',
    content: 'Voici le reçu de votre course Premium du 12 juin. Si vous n\'avez pas effectué ce trajet, signalez la fraude en entrant vos coordonnées de carte.',
    clues: ['Montant de course très élevé', 'Demande de CB pour signaler une fraude', 'Faux domaine'],
    feedback: 'Uber gère les signalements de fraude in-app. Demander la CB pour contester est un piège.'
  },
  {
    id: 212,
    type: 'legit',
    title: 'BlaBlaCar - On vous a laissé un avis',
    sender: 'no-reply@blablacar.com',
    content: 'Le passager de votre trajet Paris-Lille vous a laissé un avis 5 étoiles ! Lisez son commentaire sur l\'application.',
    clues: ['Notification d\'avis', 'Redirection vers l\'app', 'Domaine officiel'],
    feedback: 'Notification de communauté inoffensive.'
  },
  {
    id: 213,
    type: 'phishing',
    title: 'SNCF - Carte de réduction annulée',
    sender: 'service@sncf-cartes-avantages.fr',
    content: 'Suite à une erreur de paiement, votre carte Avantage TGV a été annulée. Réglez 49€ via ce lien pour la réactiver avant votre prochain voyage.',
    clues: ['Menace sur un outil de voyage très utilisé', 'Paiement direct demandé', 'Faux domaine'],
    feedback: 'Les erreurs de paiement de cartes SNCF se règlent via l\'espace client SNCF Connect.'
  },
  {
    id: 214,
    type: 'legit',
    title: 'Air France - L\'enregistrement est ouvert',
    sender: 'mail@airfrance.fr',
    content: 'L\'enregistrement pour votre vol AF7482 vers Rome est maintenant ouvert. Obtenez votre carte d\'embarquement.',
    clues: ['Rappel temporel exact (H-30)', 'Domaine officiel'],
    feedback: 'Email de service avant un vol.'
  },
  {
    id: 215,
    type: 'phishing',
    title: 'Booking.com - Réservation non garantie',
    sender: 'reservations@booking-hotel-confirm.com',
    content: 'L\'hôtel "Les Pins" signale que votre carte bleue a été refusée. Votre séjour dans 3 jours sera annulé. Entrez une nouvelle carte ici pour garantir la chambre.',
    clues: ['Urgence avant un voyage (3 jours)', 'Lien de paiement frauduleux externe à Booking'],
    feedback: 'Arnaque très courante où les pirates se font passer pour l\'hôtel. Le paiement se fait toujours via l\'interface sécurisée de Booking.'
  },
  {
    id: 216,
    type: 'legit',
    title: 'Expedia - Préparez votre voyage',
    sender: 'itinerary@expedia.fr',
    content: 'Votre voyage à Barcelone approche. N\'oubliez pas de réserver votre transfert aéroport ou vos activités locales.',
    clues: ['Vente incitative (cross-selling) post-réservation', 'Domaine officiel'],
    feedback: 'Email marketing lié à un voyage à venir.'
  },
  {
    id: 217,
    type: 'phishing',
    title: 'RATP - Amende impayée Majorée',
    sender: 'recouvrement@ratp-amendes-infractions.fr',
    content: 'Vous avez été verbalisé le 10 avril dans le métro (absence de titre de transport). L\'amende de 50€ passe à 180€ si non payée ce soir.',
    clues: ['Majoration soudaine', 'Menace temporelle forte (ce soir)'],
    feedback: 'La RATP n\'envoie pas de mise en demeure par email avec un préavis d\'une journée.'
  },
  {
    id: 218,
    type: 'legit',
    title: 'Ile-de-France Mobilités - Recharge Pass Navigo',
    sender: 'noreply@iledefrance-mobilites.fr',
    content: 'Votre abonnement mensuel Navigo a bien été rechargé. Voici votre justificatif d\'achat au format PDF.',
    clues: ['Confirmation d\'achat de titre de transport', 'Domaine officiel'],
    feedback: 'Envoi de justificatif pour notes de frais.'
  },
  {
    id: 219,
    type: 'phishing',
    title: 'Vinted - Colis perdu, remboursement',
    sender: 'support@vinted-litiges.net',
    content: 'L\'acheteur n\'a jamais reçu votre pull. Nous vous remboursons de 15€. Connectez votre compte bancaire pour recevoir les fonds.',
    clues: ['Connecter son compte bancaire pour un litige', 'Faux domaine Vinted'],
    feedback: 'Les remboursements Vinted vont directement dans le porte-monnaie intégré à l\'application.'
  },
  {
    id: 220,
    type: 'legit',
    title: 'Leboncoin - Nouveau message concernant "Vélo de ville"',
    sender: 'messagerie@leboncoin.fr',
    content: 'Thomas vous a envoyé un message : "Bonjour, le vélo est-il toujours disponible et quel est son état général ?". Répondez-lui sur l\'application.',
    clues: ['Alerte de message interne', 'Domaine officiel'],
    feedback: 'Notification de la messagerie interne Leboncoin.'
  },
  {
    id: 221,
    type: 'phishing',
    title: 'Amazon - Activité suspecte détectée',
    sender: 'security@amazon-alerts-account.com',
    content: 'Nous avons détecté une tentative d\'achat de 899€ (MacBook) depuis la Russie. Cliquez ici pour bloquer la transaction et sécuriser votre compte.',
    clues: ['Achat très cher pour paniquer', 'Localisation exotique (Russie)', 'Lien de sécurisation externe'],
    feedback: 'Phishing extrêmement classique pour voler les accès Amazon.'
  },
  {
    id: 222,
    type: 'legit',
    title: 'Cdiscount - Votre colis est en préparation',
    sender: 'suivi@cdiscount.com',
    content: 'Votre commande n°984029 est en cours de préparation dans notre entrepôt logistique. Vous serez prévenu dès son expédition.',
    clues: ['Etape de commande normale', 'Pas de lien cliquable forcé'],
    feedback: 'Suivi de commande e-commerce standard.'
  },
  {
    id: 223,
    type: 'phishing',
    title: 'AliExpress - Taxe douanière de 1.20€',
    sender: 'customs-service@aliexpress-eu-delivery.com',
    content: 'Votre petit colis est bloqué en douane pour un reste à payer de 1,20€. Réglez cette somme pour débloquer la livraison.',
    clues: ['Petit montant de douane', 'Demande de CB'],
    feedback: 'L\'arnaque aux frais de douane. AliExpress gère désormais la TVA à la source pour l\'Europe.'
  },
  {
    id: 224,
    type: 'legit',
    title: 'Fnac - Votre fidélité récompensée',
    sender: 'adherents@fnac.com',
    content: 'Vous avez cumulé 30€ sur votre cagnotte fidélité Fnac+. Ils sont valables lors de votre prochain passage en caisse.',
    clues: ['Information sur une cagnotte', 'Domaine officiel'],
    feedback: 'Email promotionnel pour les membres fidélité.'
  },
  {
    id: 225,
    type: 'phishing',
    title: 'Chronopost - reprogrammer votre livraison',
    sender: 'livraison@chrono-suivi-france.net',
    content: 'Vous étiez absent lors du passage de notre livreur. Cliquez ici pour choisir une nouvelle date de livraison (frais de traitement : 1,95€).',
    clues: ['Demande de paiement pour reprogrammer une livraison', 'Faux domaine'],
    feedback: 'Une reprogrammation chez un transporteur officiel est toujours gratuite.'
  },
  {
    id: 226,
    type: 'legit',
    title: 'UPS - Mise à jour d\'expédition',
    sender: 'mcinfo@ups.com',
    content: 'Votre colis 1Z00000000000 a quitté notre centre de tri de Chilly-Mazarin et est en transit.',
    clues: ['Tracking de colis', 'Domaine officiel UPS'],
    feedback: 'Information logistique légitime.'
  },
  {
    id: 227,
    type: 'phishing',
    title: 'Instagram - Offre de certification payante',
    sender: 'meta-verified@ig-blue-badge.com',
    content: 'Obtenez votre badge certifié bleu (Meta Verified) en accès anticipé pour 19,99€. Entrez vos coordonnées bancaires pour démarrer l\'abonnement.',
    clues: ['Souscription à Meta Verified via un lien email non officiel', 'Faux domaine Meta/IG'],
    feedback: 'L\'abonnement Meta Verified se souscrit exclusivement dans les paramètres de l\'application Instagram ou Facebook.'
  },
  {
    id: 228,
    type: 'legit',
    title: 'TikTok - Rapport d\'activité hebdomadaire',
    sender: 'noreply@tiktok.com',
    content: 'Cette semaine, vos vidéos ont été vues 1 500 fois et vous avez gagné 12 nouveaux abonnés. Continuez comme ça !',
    clues: ['Statistiques de créateur', 'Domaine officiel'],
    feedback: 'Email d\'engagement pour les créateurs de contenu.'
  },
  {
    id: 229,
    type: 'phishing',
    title: 'Twitch - Compte suspendu pour botting',
    sender: 'safety@twitch-moderation-support.net',
    content: 'Nous avons détecté une utilisation de "Viewbots" sur votre chaîne. Votre compte est suspendu. Faites appel en cliquant sur ce lien.',
    clues: ['Accusation de triche (botting)', 'Menace de suspension de chaîne', 'Domaine suspect'],
    feedback: 'Phishing ciblant les streamers pour voler leur compte et leurs revenus liés.'
  },
  {
    id: 230,
    type: 'legit',
    title: 'Steam - Un article de votre liste de souhaits est en promotion',
    sender: 'noreply@steampowered.com',
    content: 'Le jeu "Cyberpunk 2077" de votre liste de souhaits est actuellement en promotion à -50%. Profitez-en avant le 12 avril.',
    clues: ['Notification d\'achat liée à une action (liste de souhaits)', 'Domaine officiel'],
    feedback: 'Email promotionnel ciblé très courant sur les plateformes de jeux.'
  },
  {
    id: 231,
    type: 'phishing',
    title: 'PlayStation Network - Changement de mot de passe',
    sender: 'support@sony-playstation-network.com',
    content: 'Votre mot de passe PSN a été modifié avec succès. Si vous n\'êtes pas à l\'origine de cette action, récupérez votre compte en cliquant ici.',
    clues: ['Faux changement de mot de passe', 'Lien de récupération malveillant'],
    feedback: 'Le faux email de changement de mot de passe est un grand classique pour obtenir le vrai.'
  },
  {
    id: 232,
    type: 'legit',
    title: 'Epic Games - Reçu de transaction',
    sender: 'help@epicgames.com',
    content: 'Merci d\'avoir téléchargé le jeu gratuit de la semaine "GTA V". Total payé : 0,00€.',
    clues: ['Facture à 0€ (jeu gratuit)', 'Domaine officiel'],
    feedback: 'Reçu automatique généré lors de la récupération d\'un jeu gratuit.'
  },
  {
    id: 233,
    type: 'phishing',
    title: 'Impôts - Remboursement d\'un trop-perçu (210€)',
    sender: 'remboursement@dgfip-impots-france.org',
    content: 'Suite à un recalcul de votre taxe foncière, nous vous devons 210€. Veuillez confirmer votre carte bancaire pour le crédit.',
    clues: ['Demande de carte bancaire par le fisc', 'Extension .org'],
    feedback: 'La Direction Générale des Finances Publiques connaît votre RIB et procède par virement direct, jamais sur carte bancaire.'
  },
  {
    id: 234,
    type: 'legit',
    title: 'ANTS - Votre permis de conduire est prêt',
    sender: 'ne-pas-repondre@ants.gouv.fr',
    content: 'La fabrication de votre nouveau permis de conduire est terminée. Il vous sera expédié par courrier sécurisé sous 48h.',
    clues: ['Information de suivi administratif', 'Domaine gouvernemental en .gouv.fr'],
    feedback: 'Email officiel de l\'Agence Nationale des Titres Sécurisés.'
  },
  {
    id: 235,
    type: 'phishing',
    title: 'Ministère de l\'Intérieur - Vignette Crit\'Air obligatoire',
    sender: 'commande@certificat-air-vehicule.fr',
    content: 'La vignette Crit\'Air de classe supérieure est obligatoire dès lundi. Commandez-la en urgence pour 2,99€ pour éviter une amende de 135€.',
    clues: ['Urgence et menace d\'amende', 'Faux domaine de commande'],
    feedback: 'Le seul site officiel est certificat-air.gouv.fr. Les autres sont des arnaques.'
  },
  {
    id: 236,
    type: 'legit',
    title: 'Mon Compte Formation - Confirmation d\'inscription',
    sender: 'noreply@moncompteformation.gouv.fr',
    content: 'Votre inscription à la formation "Anglais Professionnel" a été validée par l\'organisme. Vos droits CPF ont été débités de 450€.',
    clues: ['Confirmation d\'une démarche initiée par l\'utilisateur', 'Domaine officiel'],
    feedback: 'Notification administrative après une inscription volontaire.'
  },
  {
    id: 237,
    type: 'phishing',
    title: 'Pôle Emploi / France Travail - Suspension des indemnités',
    sender: 'radiation@francetravail-dossier.com',
    content: 'Suite à une absence injustifiée, vos allocations chômage sont suspendues. Remplissez ce formulaire pour justifier de votre situation.',
    clues: ['Menace de perte de revenus', 'Lien vers un faux formulaire de recours'],
    feedback: 'Les menaces de radiation ou de perte de droits visent à vous faire agir sous la panique.'
  },
  {
    id: 238,
    type: 'legit',
    title: 'URSSAF - Accusé de réception de votre déclaration',
    sender: 'noreply@urssaf.fr',
    content: 'Nous vous confirmons la bonne réception de votre déclaration de chiffre d\'affaires pour le 1er trimestre. Montant des cotisations à payer : 340€.',
    clues: ['Accusé de réception formel', 'Domaine officiel'],
    feedback: 'Accusé de réception automatique après une démarche sur le site.'
  },
  {
    id: 239,
    type: 'phishing',
    title: 'Netflix - Sondage : Gagnez 1 an gratuit !',
    sender: 'rewards@netflix-survey-promo.net',
    content: 'Aidez-nous à améliorer Netflix ! Répondez à ce sondage de 3 questions et recevez 1 an d\'abonnement Premium gratuit.',
    clues: ['Récompense disproportionnée pour un sondage', 'Faux domaine'],
    feedback: 'Les faux sondages finissent par demander vos numéros de carte bancaire pour payer "des frais d\'activation".'
  },
  {
    id: 240,
    type: 'legit',
    title: 'Spotify - Votre Wrapped de l\'année est là !',
    sender: 'no-reply@spotify.com',
    content: 'Découvrez vos artistes, chansons et genres les plus écoutés de l\'année avec votre Spotify Wrapped. Partagez-le avec vos amis.',
    clues: ['Événement marketing annuel attendu', 'Domaine officiel'],
    feedback: 'Campagne de rétention et d\'engagement très connue.'
  },
  {
    id: 241,
    type: 'phishing',
    title: 'Canal+ - Renouvellement de votre décodeur',
    sender: 'equipement@canalplus-echanges.fr',
    content: 'Votre décodeur actuel va devenir obsolète. Commandez le nouveau modèle 4K gratuitement. Réglez uniquement les frais d\'envoi (4,99€).',
    clues: ['Frais d\'envoi pour un équipement gratuit', 'Faux prétexte d\'obsolescence'],
    feedback: 'Arnaque courante ciblant les abonnés TV pour leur soutirer de petites sommes, puis prélever des abonnements cachés.'
  },
  {
    id: 242,
    type: 'legit',
    title: 'Prime Video - Un nouvel appareil s\'est connecté',
    sender: 'account-update@amazon.com',
    content: 'Une connexion à Prime Video a été effectuée depuis une Smart TV Samsung. Vous pouvez gérer vos appareils dans les paramètres de votre compte.',
    clues: ['Alerte informative', 'Pas de lien d\'urgence', 'Domaine Amazon officiel'],
    feedback: 'Alerte de sécurité de connexion d\'appareil.'
  },
  {
    id: 243,
    type: 'phishing',
    title: 'LinkedIn - Votre compte est bloqué temporairement',
    sender: 'security@linkedin-helpdesk.com',
    content: 'Pour des raisons de sécurité, nous avons restreint l\'accès à votre compte professionnel. Débloquez-le en scannant une copie de votre carte d\'identité.',
    clues: ['Demande de pièce d\'identité via un lien email', 'Faux domaine helpdesk'],
    feedback: 'Les réseaux sociaux demandent rarement une pièce d\'identité, et si c\'est le cas, c\'est via l\'application officielle.'
  },
  {
    id: 244,
    type: 'legit',
    title: 'Twitter / X - Voici ce qui se passe aujourd\'hui',
    sender: 'info@twitter.com',
    content: 'Les sujets les plus discutés aujourd\'hui : #TechNews, #JeuxOlympiques et #CyberSecurite. Découvrez ce que les gens en disent.',
    clues: ['Newsletter algorithmique', 'Domaine officiel'],
    feedback: 'Email récapitulatif des tendances du réseau.'
  },
  {
    id: 245,
    type: 'phishing',
    title: 'YouTube - Collaboration commerciale (1500€/vidéo)',
    sender: 'marketing@nordvpn-sponsorships.net',
    content: 'Bonjour, nous adorons votre chaîne ! Nous vous proposons un partenariat sponsorisé. Téléchargez notre brief de campagne (Brief_Campagne.zip) avec notre logiciel à tester.',
    clues: ['Offre d\'argent facile pour un créateur', 'Fichier .zip contenant un malware déguisé en logiciel/brief'],
    feedback: 'Phishing ciblant les influenceurs ("Sponsorship Scam"). Le fichier ZIP contient souvent un "Stealer" qui vole les cookies de session YouTube.'
  },
  {
    id: 246,
    type: 'legit',
    title: 'Pinterest - Nouvelles idées pour "Déco Salon"',
    sender: 'pinbot@pinterest.com',
    content: 'Nous avons trouvé de nouvelles épingles qui pourraient vous plaire pour votre tableau "Déco Salon". Jetez-y un œil !',
    clues: ['Contenu basé sur l\'activité de l\'utilisateur', 'Domaine officiel'],
    feedback: 'Recommandation de contenu.'
  },
  {
    id: 247,
    type: 'phishing',
    title: 'Trello - Facture impayée (Espace de travail)',
    sender: 'billing@trello-workspace-atlassian.com',
    content: 'Le paiement de votre abonnement Trello Premium a échoué. Votre espace d\'équipe sera supprimé avec toutes ses données dans 2 heures.',
    clues: ['Menace de perte de données professionnelles', 'Urgence absolue (2h)'],
    feedback: 'Les logiciels SaaS n\'effacent jamais les données de leurs clients 2 heures après un échec de paiement.'
  },
  {
    id: 248,
    type: 'legit',
    title: 'Notion - Changements récents dans "Base de connaissances"',
    sender: 'notifications@mail.notion.so',
    content: 'Julie a modifié la page "Procédure d\'accueil des nouveaux employés" dans votre espace de travail.',
    clues: ['Notification de modification de document collaboratif', 'Domaine officiel'],
    feedback: 'Email de suivi d\'activité d\'équipe.'
  },
  {
    id: 249,
    type: 'phishing',
    title: 'Microsoft 365 - Quarantaine Email',
    sender: 'quarantine@microsoft-security-defender.net',
    content: '3 emails importants ont été bloqués par le filtre anti-spam aujourd\'hui. Cliquez ici pour examiner ces messages et les relâcher dans votre boîte de réception.',
    clues: ['Sujet professionnel courant', 'Faux domaine (Microsoft utilise des alertes système internes)'],
    feedback: 'Le phishing de quarantaine est utilisé pour voler les identifiants d\'entreprise.'
  },
  {
    id: 250,
    type: 'legit',
    title: 'Google Agenda - Événement à venir : Réunion Client',
    sender: 'calendar-notification@google.com',
    content: 'Rappel de l\'événement : Réunion Client Alpha prévu de 14:00 à 15:00. Lien de visioconférence Google Meet inclus.',
    clues: ['Rappel d\'agenda standard', 'Lien Meet officiel', 'Domaine Google'],
    feedback: 'Rappel de calendrier inoffensif et utile.'
  }
];

const quiz = [
  { q: "Qu'est-ce qu'un lien 'shortener' (bit.ly) cache souvent ?", options: ["Une réduction de prix", "L'URL réelle de destination", "Un virus automatique"], correct: 1 },
  { q: "Une icône de cadenas (HTTPS) garantit-elle que le site est honnête ?", options: ["Oui, c'est sécurisé", "Non, cela crypte juste les données", "Seulement sur mobile"], correct: 1 },
  { q: "Quel est le signal le plus fiable d'un phishing ?", options: ["L'absence de logo", "Les fautes d'orthographe", "L'adresse email de l'expéditeur incohérente"], correct: 2 },
  { q: "Que signifie le 'S' dans HTTPS ?", options: ["Standard", "Secure (Sécurisé)", "System"], correct: 1 },
  { q: "Une icône de cadenas fermé dans le navigateur signifie que :", options: ["Le site est 100% fiable et honnête", "La connexion est chiffrée entre vous et le site", "Le site appartient au gouvernement"], correct: 1 },
  { q: "Qu'est-ce que le 'Phishing' (hameçonnage) ?", options: ["Un virus qui détruit le disque dur", "Une technique de tromperie pour voler des données", "Un logiciel de protection des emails"], correct: 1 },
  { q: "Qu'est-ce que le 'Smishing' ?", options: ["Du phishing par SMS", "Le piratage d'une webcam", "Le vol d'un smartphone"], correct: 0 },
  { q: "Qu'est-ce que le 'Vishing' ?", options: ["Un phishing par appel vocal", "Un virus vidéo", "Le vol de carte bancaire sans contact"], correct: 0 },
  { q: "Quel est le meilleur moyen de vérifier un lien sans cliquer dessus sur ordinateur ?", options: ["Faire un clic droit et 'Propriétés'", "Survoler le lien avec la souris pour voir l'URL en bas", "Copier le lien dans un document Word"], correct: 1 },
  { q: "Qu'est-ce que le 'Typosquatting' ?", options: ["Un site web qui ne s'adapte pas aux mobiles", "Réserver un nom de domaine avec une faute (ex: netflixx.com)", "Un mot de passe trop court"], correct: 1 },
  { q: "Quelle pièce jointe est la plus dangereuse à ouvrir ?", options: ["Une image .jpg", "Un fichier texte .txt", "Un fichier exécutable .exe ou .scr"], correct: 2 },
  { q: "Que sont les 'Macros' dans un document Office (Word/Excel) ?", options: ["Des scripts pouvant exécuter des commandes malveillantes", "Des filtres de couleurs", "Des outils de correction orthographique"], correct: 0 },
  { q: "Si on vous demande d'activer les macros pour lire un document inattendu :", options: ["Je le fais pour voir le contenu", "Je refuse, c'est une technique courante d'infection", "Je demande l'avis de mon antivirus"], correct: 1 },
  { q: "Qu'est-ce qu'un 'Ransomware' (Rançongiciel) ?", options: ["Un logiciel qui bloque vos fichiers en exigeant un paiement", "Un faux antivirus", "Un email qui vous fait du chantage"], correct: 0 },
  { q: "Quelle est la meilleure protection contre un Ransomware ?", options: ["Payer la rançon", "Avoir des sauvegardes régulières et déconnectées", "Changer de mot de passe"], correct: 1 },
  { q: "Qu'est-ce que l'ingénierie sociale (Social Engineering) ?", options: ["Le codage de réseaux sociaux", "La manipulation psychologique pour obtenir des infos", "Un diplôme en informatique"], correct: 1 },
  { q: "Qu'est-ce que la 'Fraude au Président' (FOVI) ?", options: ["Se faire passer pour un dirigeant pour ordonner un virement", "Pirater le site de l'Élysée", "Falsifier des billets de banque"], correct: 0 },
  { q: "Quelle est la caractéristique principale d'un email de phishing ?", options: ["Il est toujours plein de fautes", "Il crée un sentiment d'urgence ou de peur", "Il est envoyé la nuit"], correct: 1 },
  { q: "À quoi sert l'A2F (Authentification à double facteur) ?", options: ["À doubler la vitesse de connexion", "À ajouter une couche de sécurité (mot de passe + code)", "À avoir deux comptes utilisateurs"], correct: 1 },
  { q: "Lequel de ces mots de passe est le plus sécurisé ?", options: ["P@ssw0rd123", "SoleilBleuMaisonVoiture!", "123456789"], correct: 1 },
  { q: "Pourquoi une phrase de passe (passphrase) est-elle recommandée ?", options: ["Elle est plus facile à retenir et plus longue à pirater", "Elle est imposée par la loi", "Les hackers ne savent pas lire les phrases"], correct: 0 },
  { q: "Qu'est-ce qu'une attaque par 'Force Brute' ?", options: ["Voler un ordinateur physiquement", "Tester toutes les combinaisons possibles d'un mot de passe", "Casser un pare-feu avec un malware"], correct: 1 },
  { q: "Quel est l'avantage d'un gestionnaire de mots de passe ?", options: ["Il crée et retient des mots de passe uniques pour chaque site", "Il crypte votre connexion internet", "Il bloque les publicités"], correct: 0 },
  { q: "Est-il sûr d'utiliser le même mot de passe partout ?", options: ["Oui, si le mot de passe est très compliqué", "Non, si un site est piraté, tous vos comptes sont en danger", "Oui, c'est recommandé par les experts"], correct: 1 },
  { q: "Pourquoi les mises à jour logicielles sont-elles cruciales ?", options: ["Pour changer le design de l'application", "Pour corriger des failles de sécurité exploitables", "Pour prendre plus de place sur le disque dur"], correct: 1 },
  { q: "Sur un réseau Wi-Fi public ouvert (gare, café) :", options: ["Je peux faire mes achats bancaires en toute sécurité", "Il est déconseillé de consulter des données sensibles", "Ma connexion est toujours chiffrée"], correct: 1 },
  { q: "Qu'est-ce qu'un VPN (Réseau Privé Virtuel) ?", options: ["Un antivirus gratuit", "Un outil qui crée un tunnel chiffré pour votre connexion", "Un logiciel de montage vidéo"], correct: 1 },
  { q: "Vous trouvez une clé USB sur le parking de votre entreprise :", options: ["Je la branche pour retrouver le propriétaire", "Je la donne au service informatique sans la brancher", "Je la formate pour l'utiliser"], correct: 1 },
  { q: "Qu'est-ce qu'un 'Keylogger' ?", options: ["Un logiciel qui enregistre tout ce que vous tapez au clavier", "Un outil pour générer des mots de passe", "Une clé de sécurité physique"], correct: 0 },
  { q: "Que faire si vous réalisez avoir cliqué sur un lien de phishing au travail ?", options: ["Ne rien dire par honte", "Débrancher l'écran", "Alerter immédiatement le support informatique"], correct: 2 },
  { q: "Un email vous informe d'une connexion suspecte sur votre compte Netflix. Que faire ?", options: ["Cliquer sur le lien fourni pour vérifier", "Aller soi-même sur le site Netflix depuis son navigateur", "Ignorer et supprimer son compte"], correct: 1 },
  { q: "Les organismes officiels (Banque, Impôts, CAF) peuvent-ils vous demander votre code secret par email ?", options: ["Oui, en cas de force majeure", "Seulement si l'email contient leur logo", "Non, absolument jamais"], correct: 2 },
  { q: "Le 'Tailgating' ou 'Talonnage' physique, c'est :", options: ["Suivre quelqu'un de près pour entrer dans un bâtiment sécurisé", "Espionner l'écran d'un collègue", "Voler un ordinateur portable"], correct: 0 },
  { q: "Qu'est-ce que le 'Shoulder Surfing' ?", options: ["Regarder par-dessus l'épaule de quelqu'un pour voler un mot de passe", "Surfer sur internet au travail", "Un sport de glisse"], correct: 0 },
  { q: "Un collègue vous demande votre mot de passe pour avancer sur un dossier urgent en votre absence :", options: ["Je lui donne car c'est urgent", "Je refuse, un mot de passe est strictement personnel", "Je le lui donne mais je le change demain"], correct: 1 },
  { q: "Pourquoi est-il important de verrouiller sa session (Windows+L) en quittant son bureau ?", options: ["Pour économiser l'électricité", "Pour empêcher quiconque d'utiliser votre session", "Pour lancer l'antivirus"], correct: 1 },
  { q: "Sur les réseaux sociaux, pourquoi limiter les informations personnelles publiques ?", options: ["Pour économiser de l'espace de stockage", "Pour compliquer la tâche des hackers (ingénierie sociale)", "Pour ne pas ennuyer ses amis"], correct: 1 },
  { q: "Votre banque vous appelle pour bloquer une fraude et vous demande de valider une opération sur votre application :", options: ["C'est une arnaque, je raccroche", "Je valide pour bloquer la fraude", "Je donne mes codes par téléphone"], correct: 0 },
  { q: "Vous recevez un SMS pour payer un retard d'amende (amendes.gouv) :", options: ["Je clique et je paie vite", "Les amendes officielles ne sont pas notifiées par SMS", "Je réponds au SMS pour contester"], correct: 1 },
  { q: "Qu'est-ce qu'une attaque 'Man-in-the-Middle' (Homme du milieu) ?", options: ["Un hacker qui intercepte les communications entre deux parties", "Un virus qui se cache dans la RAM", "Un spam publicitaire"], correct: 0 },
  { q: "Laquelle de ces adresses URL est probablement frauduleuse ?", options: ["https://www.paypal.com", "https://www.paypaI-securite.com", "https://www.google.fr"], correct: 1 },
  { q: "Qu'est-ce que le 'Spear Phishing' (Harponnage) ?", options: ["Un phishing envoyé au hasard à des millions de personnes", "Un phishing ultra-ciblé et personnalisé sur une victime", "Le vol de données bancaires en magasin"], correct: 1 },
  { q: "Qu'est-ce qu'un 'Malware' ?", options: ["Le terme générique pour tout logiciel malveillant", "Un dysfonctionnement matériel", "Un logiciel de nettoyage de PC"], correct: 0 },
  { q: "Un 'Cheval de Troie' (Trojan) c'est :", options: ["Un logiciel légitime en apparence mais qui cache un code malveillant", "Un virus qui détruit votre carte mère", "Un email écrit en grec"], correct: 0 },
  { q: "À quoi sert un Pare-feu (Firewall) ?", options: ["À refroidir le processeur", "À filtrer le trafic entrant et sortant du réseau", "À supprimer les spams"], correct: 1 },
  { q: "Qu'est-ce que la 'Seed Phrase' (Phrase de récupération) en cryptomonnaie ?", options: ["Le mot de passe pour se connecter au site", "La clé maîtresse qui permet de récupérer tous ses fonds", "L'adresse publique de son portefeuille"], correct: 1 },
  { q: "Un support technique Microsoft vous appelle pour vous dire que votre PC est infecté :", options: ["Je suis leurs instructions pour le nettoyer", "C'est une arnaque, Microsoft n'appelle jamais pour ça", "Je leur donne l'accès à distance"], correct: 1 },
  { q: "Quel risque représente une clé USB offerte lors d'un salon professionnel (Goodie) ?", options: ["Elle peut contenir un malware préinstallé", "Elle risque de griller le port USB", "Aucun risque si elle est neuve"], correct: 0 },
  { q: "Une alerte vous indique que votre compte CPF va expirer ce soir :", options: ["Les droits CPF n'expirent pas de cette manière, c'est une arnaque", "Je me connecte vite pour ne pas perdre mes euros", "J'appelle la police"], correct: 0 },
  { q: "Pourquoi les QR codes imprimés sur des parcmètres peuvent être dangereux ?", options: ["Ils consomment trop de batterie", "Un escroc a pu coller un faux QR code par-dessus (Quishing)", "Ils transmettent des virus par onde"], correct: 1 },
  { q: "Un ami Facebook vous demande soudainement de l'argent par message car il est coincé à l'étranger :", options: ["Je lui fais un virement immédiatement", "Son compte a probablement été piraté, je l'appelle sur son téléphone", "Je lui demande sa carte d'identité par message"], correct: 1 },
  { q: "Sur un site de e-commerce inconnu, quel est un signal d'alarme ?", options: ["Les prix sont 80% moins chers que partout ailleurs", "Le site propose la livraison à domicile", "Le site utilise HTTPS"], correct: 0 },
  { q: "À quoi sert le 'Mode navigation privée' du navigateur ?", options: ["À devenir totalement anonyme et invisible sur internet", "À ne pas enregistrer l'historique et les cookies sur l'ordinateur local", "À se protéger des virus"], correct: 1 },
  { q: "Qu'est-ce que le RGPD ?", options: ["Un réseau de protection des données", "Le Règlement Général sur la Protection des Données européen", "Un type de pare-feu"], correct: 1 },
  { q: "Si vous recevez un email contenant un mot de passe que vous utilisiez il y a 5 ans :", options: ["C'est la preuve que le hacker contrôle mon PC actuel", "C'est une arnaque utilisant d'anciennes fuites de données (Sextorsion)", "Je dois payer la rançon demandée"], correct: 1 },
  { q: "Comment sécuriser au mieux son réseau Wi-Fi personnel ?", options: ["Ne pas mettre de mot de passe", "Utiliser le chiffrement WPA2 ou WPA3 avec un mot de passe fort", "Cacher le routeur dans un placard"], correct: 1 },
  { q: "Qu'est-ce qu'une 'Fuite de données' (Data Breach) ?", options: ["Un câble réseau coupé", "L'exposition non autorisée de données confidentielles (identifiants, etc.)", "Une erreur de frappe sur un clavier"], correct: 1 },
  { q: "Où peut-on vérifier si son adresse email a fuité dans une base de données piratée ?", options: ["Sur HaveIBeenPwned.com", "En appelant son opérateur", "Sur Google Maps"], correct: 0 },
  { q: "Qu'est-ce que l'usurpation d'identité (Spoofing) par email ?", options: ["Falsifier l'adresse de l'expéditeur pour se faire passer pour un autre", "Copier le texte d'un email", "Traduire un email dans une autre langue"], correct: 0 },
  { q: "Les filtres anti-spam des messageries sont-ils infaillibles ?", options: ["Oui, aucun email malveillant ne passe", "Non, il faut toujours rester vigilant", "Ils ne bloquent que les publicités"], correct: 1 },
  { q: "Un recruteur sur LinkedIn vous envoie une offre d'emploi en format .ZIP :", options: ["Je l'ouvre, c'est habituel", "Je m'en méfie, le .ZIP peut cacher des fichiers exécutables", "Je le transfère à mon patron"], correct: 1 },
  { q: "Qu'est-ce que l'attaque du 'Faux Conseiller Bancaire' ?", options: ["Un robot qui gère votre compte", "Un escroc au téléphone qui vous fait annuler une fausse fraude pour vous voler", "Un bug de l'application bancaire"], correct: 1 },
  { q: "Si vous vendez un objet sur LeBonCoin et que l'acheteur vous demande d'utiliser un lien Paylib reçu par SMS :", options: ["C'est une arnaque courante, Paylib n'envoie pas de lien pour recevoir des fonds", "C'est la procédure normale", "J'accepte si le montant est petit"], correct: 0 },
  { q: "Qu'est-ce qu'une 'Porte dérobée' (Backdoor) ?", options: ["Un accès secret dans un logiciel créé par des hackers ou développeurs", "Le capot arrière d'un ordinateur", "Un mot de passe oublié"], correct: 0 },
  { q: "Quel est l'objectif du 'Baiting' (Appâtage) ?", options: ["Attirer la victime avec une promesse (clé USB abandonnée, film gratuit)", "Lancer des attaques DDoS", "Chiffrer le réseau Wi-Fi"], correct: 0 },
  { q: "Un site web affiche un pop-up : 'Votre abonnement antivirus a expiré ! Cliquez ici'.", options: ["C'est vrai, je dois cliquer", "C'est un 'Scareware' (logiciel faisant peur) pour vous faire installer un faux logiciel", "C'est un message de Windows"], correct: 1 },
  { q: "Pourquoi ne faut-il pas envoyer sa pièce d'identité par email à un inconnu ?", options: ["Parce que le fichier est trop lourd", "Pour éviter l'usurpation d'identité et l'ouverture de faux crédits", "Parce que c'est illégal"], correct: 1 },
  { q: "Que faire pour envoyer un document d'identité de manière plus sécurisée ?", options: ["L'envoyer en noir et blanc", "Ajouter un filigrane (watermark) précisant le destinataire et la date", "Le flouter entièrement"], correct: 1 },
  { q: "Le Bluetooth de votre téléphone doit-il rester activé en permanence ?", options: ["Oui, pour le réseau", "Non, il vaut mieux le désactiver s'il n'est pas utilisé pour limiter les risques", "Ça n'a aucune importance"], correct: 1 },
  { q: "Quel est le risque de charger son téléphone sur une borne USB publique dans un aéroport ?", options: ["Le 'Juice Jacking' : le vol de données ou l'infection via le port USB", "Le téléphone va charger trop vite", "La batterie va exploser"], correct: 0 },
  { q: "Qu'est-ce qu'une attaque DDoS (Déni de Service Distribué) ?", options: ["Rendre un site web indisponible en le saturant de requêtes", "Voler les mots de passe d'une base de données", "Détruire les serveurs physiquement"], correct: 0 },
  { q: "Qu'est-ce qu'un 'Botnet' ?", options: ["Un réseau de robots informatiques (ordinateurs infectés) contrôlés à distance", "Une intelligence artificielle qui joue aux échecs", "Un logiciel de discussion"], correct: 0 },
  { q: "Pourquoi faut-il être prudent avec les extensions de navigateur (Chrome/Firefox) ?", options: ["Elles ralentissent toujours le PC", "Certaines peuvent lire et modifier toutes les données des sites que vous visitez", "Elles sont toutes illégales"], correct: 1 },
  { q: "Est-ce qu'un Mac ou un iPhone peut attraper un virus ?", options: ["Non, c'est impossible", "Oui, aucun système n'est invulnérable", "Uniquement s'il est blanc"], correct: 1 },
  { q: "Qu'est-ce que le 'Cryptojacking' ?", options: ["Voler le code de la carte bleue", "L'utilisation à votre insu de votre ordinateur pour miner de la cryptomonnaie", "Un nouveau type de ransomware"], correct: 1 },
  { q: "Vous recevez un email de Netflix disant 'Paiement refusé', mais l'adresse est 'support@netfiix.com' (avec un i au lieu d'un L).", options: ["C'est du Typosquatting (Phishing)", "C'est normal", "C'est une erreur de frappe de Netflix"], correct: 0 },
  { q: "Laquelle de ces données est considérée comme une Donnée à Caractère Personnel (DCP) ?", options: ["L'adresse IP", "Le nom de votre entreprise", "La météo de votre ville"], correct: 0 },
  { q: "À quoi sert un 'Hameçon' (Hook) dans une attaque d'ingénierie sociale ?", options: ["À pêcher", "À capter l'attention et susciter une émotion (peur, curiosité, cupidité)", "À effacer les disques durs"], correct: 1 },
  { q: "Vous gagnez le dernier iPhone sur un site, on vous demande juste 2€ pour les frais de port :", options: ["C'est une aubaine !", "C'est une arnaque classique pour voler les numéros de votre carte bancaire", "Je préfère payer en liquide"], correct: 1 },
  { q: "Qu'est-ce qu'une faille 'Zero-Day' ?", options: ["Une faille de sécurité inédite, que le créateur du logiciel ne connaît pas encore", "Un virus qui agit à minuit", "Un logiciel qui efface tout en zéro jour"], correct: 0 },
  { q: "Quelle est la règle de la sauvegarde 3-2-1 ?", options: ["3 copies, 2 supports différents, 1 copie hors site", "3 disques durs, 2 PC, 1 cloud", "3 fois par jour, 2 fois par semaine, 1 fois par mois"], correct: 0 },
  { q: "Comment vérifier qu'un profil sur un réseau social est authentique (ex: marque ou célébrité) ?", options: ["S'il a beaucoup d'abonnés", "La présence du badge de vérification (bien qu'il faille rester vigilant)", "S'il vous demande de l'argent en privé"], correct: 1 },
  { q: "Qu'est-ce qu'un 'Deepfake' ?", options: ["Un plongeon très profond", "Une vidéo ou un audio falsifié par l'intelligence artificielle pour tromper", "Un faux mot de passe"], correct: 1 },
  { q: "On vous demande un virement urgent pour l'entreprise un vendredi à 17h. C'est l'arnaque au faux :", options: ["PDG ou fraude au président", "Informaticien", "Banquier"], correct: 0 },
  { q: "La sécurité informatique est la responsabilité de :", options: ["Seulement le service informatique", "Tout le monde, y compris les utilisateurs", "Le directeur uniquement"], correct: 1 },
  { q: "Un 'Cookie' informatique sert principalement à :", options: ["Infecter l'ordinateur", "Mémoriser des informations sur l'utilisateur (connexion, préférences)", "Nettoyer l'historique"], correct: 1 },
  { q: "Que signifie le sigle 'RGPD' ?", options: ["Règlement Général sur la Protection des Données", "Réseau Global de Partage de Données", "Registre Général des Personnes Déclarées"], correct: 0 },
  { q: "Quel comportement est suspect pour une application mobile (lampe torche par ex.) ?", options: ["Demander l'accès au flash", "Demander l'accès à vos contacts et vos SMS", "Être gratuite"], correct: 1 },
  { q: "Un attaquant récupère des documents jetés à la poubelle devant votre entreprise. C'est du :", options: ["Dumpster Diving (Fouille de poubelles)", "Clean Desk", "Phishing"], correct: 0 },
  { q: "Qu'est-ce que la règle du 'Clean Desk' (Bureau Propre) en entreprise ?", options: ["Ne laisser aucun document confidentiel visible sur son bureau en partant", "Passer l'aspirateur tous les soirs", "Avoir un fond d'écran uni"], correct: 0 },
  { q: "Un email de votre banque vous vouvoie mais n'utilise pas votre nom (ex: 'Cher client'). Est-ce normal ?", options: ["Oui, c'est pour être poli", "Non, les vrais emails bancaires vous appellent généralement par votre nom", "Seulement pour les nouveaux clients"], correct: 1 },
  { q: "Un site en 'HTTP' (sans le S) est-il dangereux pour lire un article de blog ?", options: ["Oui, il va exploser", "Non, mais il ne faut surtout pas y saisir de mots de passe ou de carte bancaire", "Il est totalement interdit"], correct: 1 },
  { q: "Dans le doute concernant un email reçu au travail, le mieux est de :", options: ["Le transférer à tous ses collègues", "Le signaler via le bouton dédié ou au service IT", "Cliquer pour être sûr"], correct: 1 },
  { q: "Qu'est-ce qu'une adresse IP ?", options: ["L'identifiant unique d'un appareil connecté à un réseau", "Le code postal d'un site web", "Le mot de passe du routeur"], correct: 0 },
  { q: "Qu'est-ce que le 'Piratage de compte' (Account Takeover) ?", options: ["Un hacker qui prend le contrôle total de votre compte en ligne", "Créer un nouveau compte", "Fermer un compte"], correct: 0 },
  { q: "Qu'est-ce que l'usurpation d'adresse IP (IP Spoofing) ?", options: ["Cacher son ordinateur", "Masquer ou falsifier son adresse IP pour se faire passer pour un autre système", "Accélérer sa connexion"], correct: 1 },
  { q: "Qu'est-ce qu'une 'Attaque par dictionnaire' ?", options: ["Frapper quelqu'un avec un livre", "Tester des mots de passe en utilisant des listes de mots courants", "Insulter quelqu'un en ligne"], correct: 1 },
  { q: "Le 'Whaling' (Chasse à la baleine) est une forme de phishing qui cible :", options: ["Les écologistes", "Les hauts dirigeants (PDG, cadres supérieurs) d'une entreprise", "Les administrateurs réseau"], correct: 1 },
  { q: "Pourquoi éviter de se connecter à sa banque sur le PC d'un hôtel ?", options: ["L'écran est trop petit", "Le PC pourrait contenir un keylogger (enregistreur de frappes)", "Le réseau est trop rapide"], correct: 1 },
  { q: "Qu'est-ce que l'hameçonnage ciblé (Spear Phishing) utilise souvent pour être crédible ?", options: ["Des emojis", "Des informations personnelles récupérées sur les réseaux sociaux", "Des couleurs flashy"], correct: 1 },
  { q: "Si votre navigateur vous avertit que 'La connexion n'est pas privée' :", options: ["Il faut ignorer et continuer", "Le certificat de sécurité du site est invalide, il vaut mieux rebrousser chemin", "Votre antivirus est désactivé"], correct: 1 },
  { q: "L'escroquerie 'Romance Scam' (Arnaque aux sentiments) consiste à :", options: ["Séduire une victime en ligne pour lui soutirer de l'argent", "Voler des photos de mariage", "Pirater un site de rencontre"], correct: 0 },
  { q: "Un pop-up vous indique que vous êtes le '1 millionième visiteur' :", options: ["C'est mon jour de chance !", "C'est une arnaque classique (Adware/Phishing)", "C'est une statistique officielle Google"], correct: 1 },
  { q: "En cryptographie, qu'est-ce que le 'Chiffrement de bout en bout' (End-to-End Encryption) ?", options: ["Seuls l'expéditeur et le destinataire peuvent lire le message", "Le serveur central lit tous les messages", "Le message est détruit après lecture"], correct: 0 },
  { q: "La compromission de la messagerie d'entreprise (BEC) sert souvent à :", options: ["Lire les potins", "Détourner des virements importants vers des comptes frauduleux", "Envoyer des spams publicitaires"], correct: 1 },
  { q: "Une extension de fichier en '.bat' ou '.vbs' est :", options: ["Un format d'image", "Un script pouvant exécuter des commandes système (potentiellement dangereux)", "Un document texte"], correct: 1 },
  { q: "L'application 'WhatsApp' utilise-t-elle le chiffrement de bout en bout ?", options: ["Non, c'est public", "Oui, par défaut", "Seulement pour les comptes payants"], correct: 1 },
  { q: "Qu'est-ce que le 'Watering Hole' (Point d'eau) en cybersécurité ?", options: ["Infecter un site web légitime que la cible a l'habitude de visiter", "Casser la machine à café de l'entreprise", "Noyer un serveur"], correct: 0 },
  { q: "Qu'est-ce que le 'Doxing' ?", options: ["Dormir devant son PC", "Rechercher et divulguer publiquement des informations privées sur quelqu'un", "Créer de faux documents"], correct: 1 },
  { q: "Le service 'Have I Been Pwned' est-il sûr à utiliser ?", options: ["Oui, il est reconnu par les experts en sécurité", "Non, c'est un site de hackers", "Seulement sur mobile"], correct: 0 },
  { q: "Un fichier joint nommé 'Facture_2025.pdf.exe' est :", options: ["Un PDF sécurisé", "Un exécutable déguisé en PDF, très dangereux", "Un fichier endommagé"], correct: 1 },
  { q: "Si vous recevez une notification d'approbation (MFA) sur votre téléphone alors que vous ne vous connectez pas :", options: ["Vous l'approuvez par réflexe", "Vous refusez, quelqu'un essaie d'utiliser votre mot de passe", "Vous éteignez le téléphone"], correct: 1 },
  { q: "Le 'SIM Swapping' (Échange de carte SIM) permet au pirate de :", options: ["Récupérer votre numéro de téléphone pour intercepter vos SMS (dont les codes 2FA)", "Avoir internet gratuitement", "Appeler l'étranger"], correct: 0 },
  { q: "Comment les pirates cachent-ils souvent de faux liens dans les emails ?", options: ["En utilisant du texte transparent", "En modifiant l'hyperlien derrière le texte du bouton", "En écrivant à l'envers"], correct: 1 },
  { q: "Le 'Pharming' consiste à :", options: ["Cultiver des virus", "Rediriger secrètement le trafic d'un site légitime vers un faux site", "Voler des tracteurs"], correct: 1 },
  { q: "Qu'est-ce qu'une attaque 'Zero-Click' ?", options: ["Un virus qui infecte l'appareil sans aucune interaction de l'utilisateur", "Une souris sans bouton", "Un spam inoffensif"], correct: 0 },
  { q: "Le système d'exploitation le plus ciblé par les malwares dans le monde est :", options: ["Linux", "macOS", "Windows"], correct: 2 },
  { q: "Que signifie l'acronyme 'OSINT' ?", options: ["Open Source Intelligence (Renseignement en sources ouvertes)", "Operating System Interface", "Online Security International"], correct: 0 },
  { q: "Est-ce qu'un antivirus garantit une sécurité à 100% ?", options: ["Oui, si l'abonnement est payant", "Non, il ne détecte pas toujours les menaces les plus récentes", "Oui, c'est infaillible"], correct: 1 },
  { q: "Un ami vous envoie un lien étrange sur Messenger : 'C'est toi dans cette vidéo ?' :", options: ["Je clique pour voir", "C'est un malware courant sur les réseaux sociaux, son compte est piraté", "Je partage à d'autres amis"], correct: 1 },
  { q: "Qu'est-ce qu'un 'Hacker éthique' (White Hat) ?", options: ["Un pirate qui vole pour les pauvres", "Un expert qui aide les entreprises à trouver et corriger leurs failles", "Un vendeur d'antivirus"], correct: 1 },
  { q: "Le principe de 'Moindre Privilège' en entreprise signifie :", options: ["Payer les employés le moins possible", "Donner à un utilisateur uniquement les accès strictement nécessaires à son travail", "Retirer internet aux employés"], correct: 1 },
  { q: "Les données biométriques (empreinte digitale, Face ID) sont utilisées pour :", options: ["Remplacer le mot de passe réseau", "Renforcer l'authentification (Ce que je suis)", "Améliorer les photos"], correct: 1 },
  { q: "Pourquoi est-il risqué de rooter (Android) ou jailbreaker (iOS) son téléphone ?", options: ["Ça fait sauter la garantie uniquement", "Ça désactive les mécanismes de sécurité du système d'exploitation", "Ça efface les photos"], correct: 1 },
  { q: "Une 'Attaque par rebond' c'est :", options: ["Jeter un PC par la fenêtre", "Infecter un sous-traitant vulnérable pour atteindre l'entreprise cible finale", "Un virus qui saute de fichier en fichier"], correct: 1 },
  { q: "L'usurpation d'URL par des caractères d'alphabets étrangers (ex: un 'a' cyrillique) s'appelle :", options: ["Le Phishing linguistique", "Une attaque Homographique", "Un bug d'affichage"], correct: 1 },
  { q: "Si on a un doute sur l'expéditeur d'un email (ex: Impôts), que faut-il vérifier en premier ?", options: ["L'adresse email complète et réelle de l'expéditeur, pas juste le nom affiché", "La couleur du logo", "La date de l'email"], correct: 0 },
  { q: "Qu'est-ce que l'usurpation de l'adresse MAC ?", options: ["Voler un ordinateur Apple", "Modifier l'identifiant matériel d'une carte réseau pour contourner un filtre", "Un vol d'adresse IP"], correct: 1 },
  { q: "Un 'Dark Pattern' sur un site web, c'est :", options: ["Un mode sombre pour reposer les yeux", "Une interface trompeuse conçue pour vous faire faire une action non voulue (ex: s'abonner)", "Un virus caché dans une image noire"], correct: 1 },
  { q: "Quel est le risque de répondre 'OUI' au téléphone à un interlocuteur inconnu ?", options: ["Qu'il enregistre votre voix pour valider des contrats frauduleux", "Aucun risque", "Qu'il connaisse votre opérateur"], correct: 0 },
  { q: "Pourquoi les cybercriminels aiment-ils utiliser les cryptomonnaies pour les rançons ?", options: ["Car c'est légal", "Car cela permet un anonymat relatif et complique la traçabilité pour la police", "Parce que c'est plus rapide que la carte bleue"], correct: 1 },
  { q: "L'arnaque 'Support Technique' vous demande souvent de télécharger :", options: ["Un jeu", "Un logiciel de prise de contrôle à distance (AnyDesk, TeamViewer)", "Un film pirate"], correct: 1 },
  { q: "Que faire de vos vieux disques durs avant de jeter l'ordinateur ?", options: ["Les mettre directement à la poubelle", "Les effacer de manière sécurisée (écrasement) ou les détruire physiquement", "Les donner à un inconnu"], correct: 1 },
  { q: "Qu'est-ce qu'une 'Politique de mots de passe' en entreprise ?", options: ["Des règles définissant la longueur, complexité et durée de vie des mots de passe", "Un parti politique pour les informaticiens", "Un dictionnaire de mots de passe"], correct: 0 },
  { q: "Le 'Scraping' de données consiste à :", options: ["Détruire des données", "Extraire massivement et automatiquement des données publiques depuis des sites web", "Chiffrer des disques"], correct: 1 },
  { q: "Un email prétend que vous avez été filmé par votre webcam en train de regarder du contenu intime. C'est :", options: ["Toujours vrai", "L'arnaque à la sextorsion, le pirate bluffe souvent", "Un message de votre opérateur"], correct: 1 },
  { q: "Quel est le but d'un programme 'Bug Bounty' ?", options: ["Récompenser les pirates qui trouvent des bugs et les signalent aux entreprises", "Acheter des insectes sur le dark web", "Créer des virus"], correct: 0 },
  { q: "Une attaque de 'Credential Stuffing' (Bourrage d'identifiants) utilise :", options: ["Des mots de passe volés sur un site pour essayer de se connecter sur d'autres sites", "Des fausses cartes d'identité", "Un virus caché dans un oreiller"], correct: 0 },
  { q: "La protection 'Windows Defender' est :", options: ["Inutile", "Un antivirus intégré à Windows, très performant pour un usage standard", "Un jeu vidéo"], correct: 1 },
  { q: "Le protocole WEP pour le Wi-Fi est :", options: ["Le plus sécurisé", "Obsolète et très facile à pirater", "Réservé aux professionnels"], correct: 1 },
  { q: "Pourquoi faut-il bloquer son téléphone avec un code ou la biométrie ?", options: ["Pour protéger les données et l'accès aux apps bancaires en cas de vol/perte", "Pour économiser l'écran", "Parce que c'est imposé par les constructeurs"], correct: 0 },
  { q: "Un message de l'ANTAI (Amendes) vous demandant d'acheter des 'Timbres Fiscaux' dans un bureau de tabac est :", options: ["Une arnaque à 100%", "La procédure légale", "Seulement pour les amendes de stationnement"], correct: 0 },
  { q: "Que signifie 'Patch Tuesday' chez Microsoft ?", options: ["Une fête d'entreprise", "Le deuxième mardi du mois où sont déployées les mises à jour de sécurité", "Un jour sans ordinateurs"], correct: 1 },
  { q: "Sur Discord ou Telegram, un utilisateur inconnu vous envoie un fichier .scr :", options: ["Je télécharge, c'est un écran de veille", "C'est très souvent un 'Stealer' (virus voleur de mots de passe)", "C'est un fichier son"], correct: 1 },
  { q: "Les 'Shadow IT' en entreprise désignent :", options: ["Des hackers cachés", "L'utilisation de logiciels et services par les employés sans l'accord de la DSI", "Le mode sombre de Windows"], correct: 1 },
  { q: "Qu'est-ce que l'attaque 'Evil Twin' (Jumeau Maléfique) ?", options: ["Un clone physique de l'ordinateur", "Créer un faux point d'accès Wi-Fi avec le même nom qu'un vrai (ex: 'FreeWifi')", "Un virus qui copie des fichiers en double"], correct: 1 },
  { q: "L'icône 'Cadenas' sur un faux site de banque prouve-t-elle qu'il est légitime ?", options: ["Non, les sites de phishing utilisent aussi le HTTPS (le cadenas)", "Oui, seuls les vrais sites l'ont", "Oui, c'est la preuve absolue"], correct: 0 },
  { q: "Qu'est-ce qu'une 'Attaque de l'homme dans le navigateur' (Man-in-the-Browser) ?", options: ["Un malware qui modifie les transactions bancaires directement dans votre navigateur", "Un pirate derrière votre écran", "Un pop-up publicitaire"], correct: 0 },
  { q: "Un 'Test d'intrusion' (Pentest) sert à :", options: ["Cambrioler un bâtiment", "Simuler une attaque informatique pour évaluer la sécurité d'un système", "Tester la résistance des disques durs"], correct: 1 },
  { q: "Les données stockées dans le 'Cloud' :", options: ["Ne peuvent jamais être piratées", "Sont hébergées sur les serveurs d'un prestataire (Google, Microsoft) et nécessitent des mots de passe forts", "Sont stockées dans la stratosphère"], correct: 1 },
  { q: "La fraude au 'Faux RIB' consiste à :", options: ["Imprimer de faux billets", "Pirater la boîte mail d'un fournisseur pour envoyer ses factures avec le RIB de l'escroc", "Utiliser la carte bleue d'un proche"], correct: 1 },
  { q: "Si votre navigateur vous propose de sauvegarder votre mot de passe bancaire :", options: ["C'est conseillé", "Il vaut mieux refuser et utiliser un gestionnaire externe ou l'apprendre par cœur", "C'est obligatoire"], correct: 1 },
  { q: "Qu'est-ce qu'un 'Spyware' ?", options: ["Un logiciel espion qui collecte vos informations à votre insu", "Un appareil photo discret", "Un logiciel antivirus"], correct: 0 }
];

/* ======================================================
   🔀 Fisher-Yates Shuffle (vraie randomisation propre)
====================================================== */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ======================================================
   🩺 HEALTH CHECK
====================================================== */
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: "antiphish-api" });
});

/* ======================================================
   📚 SCENARIOS
====================================================== */

/* ➜ Tous les scénarios mélangés */
app.get('/api/scenarios', (req, res) => {
  if (scenarios.length === 0) {
    return res.json([]);
  }

  const n = parseInt(req.query.n);

  const shuffled = shuffle(scenarios);

  if (!n || n > scenarios.length) {
    return res.json(shuffled);
  }

  return res.json(shuffled.slice(0, n));
});

/* ➜ Un seul scénario aléatoire */
app.get('/api/scenarios/random', (req, res) => {
  if (scenarios.length === 0) {
    return res.status(404).json({ error: "No scenarios available" });
  }

  const randomIndex = Math.floor(Math.random() * scenarios.length);
  res.json(scenarios[randomIndex]);
});

/* ======================================================
   🧠 QUIZ
====================================================== */

/* ➜ Toutes les questions mélangées */
app.get('/api/quiz', (req, res) => {
  if (quiz.length === 0) {
    return res.json([]);
  }

  const n = parseInt(req.query.n);

  const shuffled = shuffle(quiz);

  if (!n || n > quiz.length) {
    return res.json(shuffled);
  }

  return res.json(shuffled.slice(0, n));
});

/* ➜ Une question aléatoire */
app.get('/api/quiz/random', (req, res) => {
  if (quiz.length === 0) {
    return res.status(404).json({ error: "No quiz questions available" });
  }

  const randomIndex = Math.floor(Math.random() * quiz.length);
  res.json(quiz[randomIndex]);
});

/* ======================================================
   🎯 SCORE
====================================================== */
app.post('/api/score', (req, res) => {
  const { score } = req.body;
  console.log(`Score reçu: ${score}`);
  res.json({ received: score, stored: false });
});

app.get("/", (_req, res) => {
  res.json({
    message: "AntiPhish API is running",
    endpoints: [
      "/api/health",
      "/api/scenarios",
      "/api/quiz"
    ]
  });
});

/* ======================================================
   🚀 START SERVER
====================================================== */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API running on http://0.0.0.0:${PORT}`);
});