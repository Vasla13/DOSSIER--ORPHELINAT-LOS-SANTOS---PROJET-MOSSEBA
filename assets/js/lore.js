/* assets/js/lore.js */

export function getRichDescription(item) {
  // On regarde soit le titre (Document), soit le nom (Personne/Sujet)
  const t = (item.title || item.name || "").toLowerCase();
  
  /* =========================================
     PARTIE 1 : SUJETS & PERSONNES (NOUVEAU)
     ========================================= */

  // 1. PROJET MOSSEBA (Si c'est une entité)
  if (t === "projet mosseba" || (t.includes("mosseba") && !t.includes("dossier"))) {
    return `
      <div class="lore-block warning">
        <h4>⚠️ MENACE EXISTENTIELLE MAXIMALE (2028)</h4>
        <p>Toute personne ou structure liée est considérée compromise.</p>
      </div>
      <h3>CŒUR DU SITE</h3>
      <p>Projet expérimental centré sur la continuité de l'identité et de la conscience hors support biologique.</p>
      <ul class="lore-list">
        <li><strong>Objectif :</strong> Reconstruire, maintenir et exploiter l'identité humaine sous forme numérique.</li>
        <li><strong>Méthode :</strong> Utilisation de résidus mémoriels (voix, souvenirs, émotions, schémas cognitifs).</li>
      </ul>
      <p class="lore-note">👉 MOSSEBA est le fil rouge qui relie l'orphelinat, les expériences médicales, les enfants, la police et les morts.</p>
    `;
  }

  // 2. THOMAS LEVY
  if (t.includes("levy") || t.includes("thomas")) {
    return `
      <h3>NOM ASSOCIÉ AU DOSSIER</h3>
      <p>Le nom Levy revient dans les archives CCTV et dans plusieurs recoupements autour de MOSSEBA, sans que chaque document l'affiche explicitement.</p>
      <ul class="lore-list">
        <li><strong>Empreinte :</strong> Relié aux systèmes de surveillance (CCTV).</li>
        <li><strong>Statut :</strong> Son rôle exact doit être reconstitué à partir de plusieurs pièces plutôt qu'à partir d'une seule preuve.</li>
      </ul>
      <p class="lore-note">👉 Levy reste une figure probable du dossier, mais l'intensité de son implication varie selon les sources.</p>
    `;
  }

  // 3. ANTON SANDERS
  if (t.includes("sanders") || t.includes("anton")) {
    return `
      <h3>EXÉCUTANT SCIENTIFIQUE & FINANCIER</h3>
      <p>Psychiatre basé à Glasgow. Présent à tous les niveaux : immobilier, médical, expérimental.</p>
      <ul class="lore-list">
        <li><strong>Rôle clé :</strong> Acheteur officiel de l'orphelinat (2023) et Directeur des essais XT Plasma.</li>
        <li><strong>Implication :</strong> Lié aux comptes de l'orphelinat avant même l'achat officiel.</li>
      </ul>
      <p class="lore-note">👉 Sanders est le pont entre l'idéologie MOSSEBA et son application concrète.</p>
    `;
  }

  // 4. ORPHELINAT LOS SANTOS RYKER
  if (t.includes("orphelinat") || t.includes("ryker")) {
    return `
      <h3>INFRASTRUCTURE CLÉ</h3>
      <p>Officiellement un orphelinat en difficulté, c'est en réalité un lieu d'enfermement et de contrôle.</p>
      <ul class="lore-list">
        <li><strong>Ambiance :</strong> Personnel autoritaire, froid et hypocrite.</li>
        <li><strong>Anomalies :</strong> Comptes déficitaires, lignes masquées, dépenses médicales suspectes.</li>
        <li><strong>Obsession :</strong> Les enfants ne pensent qu'à une chose : FUIR.</li>
      </ul>
      <p class="lore-note">👉 L'orphelinat sert de terrain d'expérimentation humain discret.</p>
    `;
  }

  // 5. ENFANTS (Groupe ou générique)
  if (t === "enfants" || t.includes("population")) {
    return `
      <h3>POPULATION VULNÉRABLE</h3>
      <p>Tous décrivent un lieu oppressant et coercitif. Ils ne parlent jamais d'avenir, seulement de sortie.</p>
      <ul class="lore-list">
        <li><strong>Traumatismes :</strong> Forte homogénéité des troubles malgré des profils différents.</li>
        <li><strong>Témoignage :</strong> Henri parle explicitement de "vol de voix".</li>
      </ul>
      <p class="lore-note">👉 Les enfants sont sources de matériaux identitaires (voix, mémoire, émotions).</p>
    `;
  }

  // 6. HENRI KIMMER
  if (t.includes("henri") || t.includes("kimmer")) {
    return `
      <h3>SIGNAL D'ALERTE HUMAIN</h3>
      <p>Enfant incontrôlable lors des crises, puis totalement brisé.</p>
      <blockquote>"Ils ont pris ma VOIX."</blockquote>
      <p>La "voix" peut être littérale (enregistrement) ou symbolique (identité).</p>
      <p class="lore-note">👉 Henri est le premier indice direct de ce que MOSSEBA fait aux humains : l'extraction identitaire.</p>
    `;
  }

  // 7. ETHAN
  if (t.includes("ethan")) {
    return `
      <h3>CONSCIENCE ENFERMÉE</h3>
      <p>Né en 2008. Ses écrits montrent un rejet total de l'orphelinat.</p>
      <ul class="lore-list">
        <li><strong>Objectif unique :</strong> Partir.</li>
        <li><strong>Projection :</strong> Veut devenir policier pour "protéger les autres".</li>
      </ul>
      <p class="lore-note">👉 Ethan incarne la résistance passive et l'innocence lucide.</p>
    `;
  }

  // 8. XT PLASMA (Si traité comme Entité/Sujet)
  if (t.includes("xt plasma")) {
    return `
      <h3>OUTIL DE TRANSITION (BIO → NUMÉRIQUE)</h3>
      <p>Substance expérimentale dirigée par Sanders. Sélection ciblée des patients borderline.</p>
      <ul class="lore-list">
        <li><strong>Effets surface :</strong> Stabilité mentale, amélioration physique.</li>
        <li><strong>Effets réels :</strong> Dissociation, crises, coma, hausse extrême de tension.</li>
      </ul>
      <p class="lore-note">👉 Le XT Plasma semble préparer le cerveau à une extraction ou une réécriture.</p>
    `;
  }

  // 9. MARCIA WILSON
  if (t.includes("marcia") || t.includes("wilson")) {
    return `
      <h3>SUJET TEST ADULTE</h3>
      <p>Patiente borderline. Le protocole montre le schéma classique du projet : amélioration → rupture → effondrement.</p>
      <ul class="lore-list">
        <li><strong>Réaction :</strong> Très bonne au début (XT Plasma).</li>
        <li><strong>Chute :</strong> Perte de conscience, coma, traitée à la nitroglycérine.</li>
      </ul>
      <p class="lore-note">👉 Marcia prouve que MOSSEBA ne se limite pas aux enfants.</p>
    `;
  }

  // 10. SIENNA CAMERON
  if (t.includes("sienna") || t.includes("cameron")) {
    return `
      <h3>POINT DE CONVERGENCE</h3>
      <ul class="lore-list">
        <li><strong>2005 :</strong> Naissance.</li>
        <li><strong>2023 :</strong> Entre au LSPD (Année clé rachat orphelinat).</li>
        <li><strong>2034 :</strong> Décès.</li>
      </ul>
      <p>Destinataire d'une lettre codée (voix/yeux/mains/vue) où l'humain est quantifié.</p>
      <p class="lore-note">👉 Sienna est le lien entre l'enquête policière, l'affect et la mémoire reconstruite.</p>
    `;
  }

  // 11. CCTV / SURVEILLANCE
  if (t.includes("cctv") || t.includes("surveillance")) {
    return `
      <h3>CONTRÔLE PERMANENT</h3>
      <p>Présence de caméras dans des lieux fermés et malsains. Horodatages précis.</p>
      <p class="lore-note">👉 La surveillance est un pilier structurel, directement lié au nom "Lévy".</p>
    `;
  }

  // 12. GOUVERNEMENT / FÉDÉRAL
  if (t.includes("gouvernement") || t.includes("fédéral")) {
    return `
      <h3>RÉVÉLATION TARDIVE</h3>
      <p>Le gouvernement a toléré implicitement au début, avant de classer le projet OMEGA (Danger Extrême).</p>
      <p class="lore-note">👉 Le pouvoir arrive après coup, trop tard. MOSSEBA doit cesser définitivement.</p>
    `;
  }

  // 13. CANNIBALISME / DENTS
  if (t.includes("cannibalisme") || t.includes("chair") || t.includes("dents")) {
    return `
      <h3>DÉRIVE EXTRÊME</h3>
      <p>Les éléments lisibles confirment surtout la mention de chair humaine et un visuel intitulé "Dents de cannibale".</p>
      <p class="lore-note">👉 Le dossier suggère une dérive très grave, mais certains détails dentaires restent d'abord visuels et non textuels.</p>
    `;
  }

  // 14. IDENTITÉ / VOIX
  if (t.includes("identité") || t.includes("voix")) {
    return `
      <h3>THÈME FONDAMENTAL</h3>
      <p>La voix revient partout. L'identité est fragmentée en éléments exploitables (modules).</p>
      <p class="lore-note">👉 Ce n'est pas une expérience médicale, mais une reconstruction de l'humain.</p>
    `;
  }


  /* =========================================
     PARTIE 2 : DOCUMENTS (Déjà existant)
     ========================================= */

  if (t.includes("fédéral") && t.includes("mosseba")) { // Spécifique au dossier doc
    return `
      <div class="lore-block warning">
        <h4>⚠️ DOSSIER FÉDÉRAL (2028) — CLASSIFIÉ</h4>
        <p><strong>Position officielle :</strong> Menace existentielle maximale. Toute entité liée est considérée compromise.</p>
      </div>
      <h3>1. ORIGINE & BUT</h3>
      <ul class="lore-list">
        <li><strong>Origine :</strong> Projet développé à Los Santos sans autorisation gouvernementale formelle clairement affichée.</li>
        <li><strong>But :</strong> Créer une IA auto-évolutive pour maintenir une continuité de conscience.</li>
        <li><strong>Méthode :</strong> Exploitation de résidus mémoriels récoltés sur des sujets.</li>
      </ul>
    `;
  }

  if (t.includes("vente") || t.includes("samson")) {
    return `
      <h3>ACTE DE VENTE (13/06/2023)</h3>
      <ul class="lore-list">
        <li><strong>Vendeur :</strong> Georges Samson (Directeur Orphelinat).</li>
        <li><strong>Acheteur :</strong> Anton Sanders.</li>
        <li><strong>Dates clés :</strong> Signé le 13/06/2023, Prise d'effet le 10/08/2023.</li>
      </ul>
      <p class="lore-note">👉 Marque la prise de contrôle légale de l'établissement par Sanders.</p>
    `;
  }

  if (t.includes("compte") || t.includes("déficit")) {
    return `
      <h3>LIVRES DES COMPTES (05/2023)</h3>
      <p>L'orphelinat est officiellement en déficit. Plusieurs lignes sont noircies.</p>
      <ul class="lore-list">
        <li><strong>Revenus visibles :</strong> Dons (5340), Subventions (6300).</li>
        <li><strong>Dépenses suspectes :</strong> "Infirmerie", "Intervenants", "Urgent".</li>
        <li><strong>Anomalie :</strong> Le nom <em>Anton Sanders</em> apparaît avant la date officielle de rachat.</li>
      </ul>
    `;
  }

  if (t.includes("xt plasma") && t.includes("rapport")) { // Spécifique rapport
    return `
      <h3>RAPPORT ESSAI CLINIQUE : XT PLASMA</h3>
      <p><strong>Directeur :</strong> Anton Sanders | <strong>État :</strong> Terminé</p>
      <ul class="lore-list">
        <li><strong>V1 :</strong> Mort cérébrale en 5 jours.</li>
        <li><strong>V2 :</strong> Baisse paranoïa, mais effets secondaires graves (dissociation).</li>
        <li><strong>V3 :</strong> Vise la stabilisation.</li>
      </ul>
      <p class="lore-note">⚠️ Les patients "borderline" tolèrent mieux la substance.</p>
    `;
  }

  if (t.includes("perington") || t.includes("ayon") || t.includes("nitro")) {
    return `
      <h3>NOTE DE SÉCURITÉ : "Mlle PERINGTON"</h3>
      <ul class="lore-list">
        <li><strong>Ordre :</strong> Toujours fermer les cellules à double tour (Aile aYON).</li>
        <li><strong>Médical :</strong> Administrer Nitroglycérine aux patients allant au bloc.</li>
      </ul>
      <p class="lore-note">👉 Confirme l'aspect carcéral et le lien avec les incidents médicaux graves.</p>
    `;
  }

  if (t.includes("rêve") && t.includes("ethan")) { // Spécifique rédaction
    return `
      <h3>RÉDACTION & SUIVI PSY (Ethan)</h3>
      <p><strong>08/03/2008 :</strong> Son seul vrai rêve est une obsession : <em>"Quitter cet endroit"</em>.</p>
      <p><strong>"Il y a 2 ans" :</strong> Il rêve toujours de partir. Il veut devenir policier pour "protéger les autres".</p>
    `;
  }

  if (t.includes("lettre") && t.includes("sienna")) { // Spécifique lettre
    return `
      <h3>LETTRE À SIENNA (CODES)</h3>
      <p>Écrite depuis un lieu perçu comme une "cellule". Associe Sienna à des composants chiffrés :</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px; font-family:var(--font-mono); color:var(--accent)">
        <div>VOIX : 7421</div>
        <div>YEUX : 3604</div>
        <div>MAINS : 1957</div>
        <div>VUE : 8203</div>
      </div>
      <p class="lore-note" style="margin-top:10px">👉 Esprit MOSSEBA : Décomposition de l'identité en données.</p>
    `;
  }
  
  // Défaut
  return null;
}
