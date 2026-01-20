/* --- DONNÉES DE L'ENQUÊTE : ORPHELINAT LOS SANTOS & PROJET MOSSEBA --- */

window.TIMELINE_DATA = {
  meta: {
    title: "DOSSIER MOSSEBA — Archives OMEGA",
    generated_at: "2026-01-19 15:45",
    notes: [
      "Timeline reconstituée à partir des archives récupérées.",
      "Certaines dates sont approximatives (marquées ~)."
    ]
  },

  // 1. LES DOSSIERS INDIVIDUELS (Personnes clés)
  entities: {
    people: [
      {
        id: "p_sienna",
        name: "Sienna Cameron",
        role: "Sujet Central / Officier LSPD",
        summary: "Née en 2005. Entrée au LSPD en 2023. Décédée en 2034. Elle semble être le fil conducteur de toute l'affaire (destinataire des codes)."
      },
      {
        id: "p_sanders",
        name: "Anton Sanders",
        role: "Psychiatre / Directeur (2023)",
        summary: "Psychiatre de Glasgow. Reprend l'orphelinat en juin 2023 alors qu'il est déjà impliqué dans la gestion (déficit). Supervise les essais cliniques XT Plasma."
      },
      {
        id: "p_samson",
        name: "Georges Samson",
        role: "Ancien Directeur",
        summary: "Vendeur de l'orphelinat en juin 2023. Adresse : 3 Selfrung Bullring, LS."
      },
      {
        id: "p_marcia",
        name: "Marcia Wilson",
        role: "Patiente / Sujet de Test",
        summary: "Née en 1997. Trouble borderline. Sujet du protocole XT Plasma V3. Coma suite à surdosage en oct 2024."
      },
      {
        id: "p_ethan",
        name: "Ethan",
        role: "Orphelin",
        summary: "Enfant obsédé par l'idée de 'quitter cet endroit' dès 2008. Auteur de la rédaction 'Mon Rêve' et de dessins prophétiques."
      },
      {
        id: "p_henri",
        name: "Henri Kimmer",
        role: "Orphelin",
        summary: "Enfant instable du Los Santos Ryker Orphanage. Prétend qu'on lui a 'pris sa voix'."
      },
      {
        id: "p_levy",
        name: "Thomas Levy",
        role: "Initiateur Projet MOSSEBA",
        summary: "Mentionné dans les dossiers fédéraux de 2028 comme créateur de l'IA auto-évolutive. Nom lié au réseau CCTV."
      },
      {
        id: "p_perington",
        name: "Mlle Perington",
        role: "Staff / Infirmière",
        summary: "Destinataire des consignes de sécurité concernant l'aile dangereuse et la nitroglycérine."
      },
      {
        id: "p_burcks",
        name: "Mme Burcks",
        role: "Enseignante",
        summary: "Institutrice à l'orphelinat en 2008, destinataire des devoirs d'Ethan."
      }
    ],
    orgs: [
      { id: "o_orphelinat", name: "Orphelinat Los Santos", summary: "Lieu central. Théâtre d'expérimentations et de trafics." },
      { id: "o_lspd", name: "LSPD", summary: "Police de Los Santos." },
      { id: "o_mosseba", name: "Projet MOSSEBA", summary: "Initiative secrète visant la continuité de conscience via IA." }
    ],
    places: [
      { id: "l_ls", name: "Los Santos", summary: "Localisation principale." },
      { id: "l_glasgow", name: "Glasgow", summary: "Ancienne adresse du Dr Sanders." }
    ]
  },

  // 2. LES PREUVES (Documents, Images, Rapports)
  documents: [
    {
      id: "doc_1942_camus",
      date: "1942-05-19",
      type: "Artefact Littéraire",
      title: "Extrait : L'Étranger (Annoté)",
      summary: "Passage souligné 'Aujourd'hui, maman est morte'. Trouvé dans les archives.",
      tags: ["philosophie", "mort"],
      transcription: "Aujourd’hui, maman est morte. Ou peut-être hier, je ne sais pas.",
      images: ["assets/img/cc633ff4-0903-46f4-a946-3d5f054cffab.png"]
    },
    {
      id: "doc_sienna_exam",
      date: "2034-01-01",
      type: "Dossier Personnel",
      title: "EXAM FINAL — Sienna Cameron",
      summary: "Fiche récapitulative étrange : Naissance 2005, LSPD 2023, Mort 2034.",
      tags: ["biographie", "décès", "mystère"],
      people: ["p_sienna"],
      images: ["assets/img/sienna-exam-zoom.png"]
    },
    {
      id: "doc_2006_reve",
      date: "2006-06-01",
      type: "Dessin d'enfant",
      title: "Rêve pour le futur (Anonyme)",
      summary: "Enfant voulant devenir policier pour protéger les autres et gagner des médailles. Mentionne 'Il y a 2 ans'.",
      tags: ["enfance", "police"],
      approx: true,
      images: ["assets/img/c165fd09-bac6-486b-9b10-535d44949fd2.png"]
    },
    {
      id: "doc_ethan_lettre",
      date: "2008-03-08",
      type: "Rédaction",
      title: "Rédaction d'Ethan : 'Mon Rêve'",
      summary: "Ethan explique à Mme Burcks que son seul rêve est de 'quitter cet endroit', peu importe le métier.",
      tags: ["enfance", "détresse"],
      people: ["p_ethan", "p_burcks"],
      transcription: "Mme Burcks... À partir du moment où ça me permet de quitter cet endroit, je me fiche de ce que je dois devenir. Mais oui, c’est ça mon rêve ! Quitter cet endroit !",
      images: ["assets/img/991825f3-2956-47a4-9d56-0973e2835951.png"]
    },
    {
      id: "doc_ethan_haine",
      date: "2008-04-01",
      type: "Note Manuscrite",
      title: "Note d'Ethan : 'Je déteste cet endroit'",
      summary: "Critique virulente de l'hypocrisie des adultes et du directeur 'vide et froid'.",
      tags: ["enfance", "haine"],
      people: ["p_ethan"],
      approx: true,
      images: ["assets/img/9ac280c0-842a-4744-bfd1-4d3cdbb28828.png"]
    },
    {
      id: "doc_comptes_2023",
      date: "2023-05-01",
      type: "Finance",
      title: "Livre des Comptes (Déficit)",
      summary: "Orphelinat en déficit. Mentionne des dépenses 'Infirmerie' et 'Salaires'. Signature Anton Sanders présente avant la vente officielle.",
      tags: ["finance", "anomalie"],
      people: ["p_sanders"],
      images: ["assets/img/6d499e3f-d325-4d61-ba01-9ebbf722e0d9.png", "assets/img/comptes-signature-zoom.png"]
    },
    {
      id: "doc_vente_2023",
      date: "2023-06-13",
      type: "Contrat Juridique",
      title: "Acte de Vente Orphelinat",
      summary: "Vente de Georges Samson à Anton Sanders (Psychiatre). Prise d'effet le 10 août 2023.",
      tags: ["juridique", "propriété"],
      people: ["p_samson", "p_sanders"],
      images: ["assets/img/f1a3a790-5e18-4035-9b79-be956e063b2a.png", "assets/img/acte-vente-header-zoom.png"]
    },
    {
      id: "doc_xt_v2",
      date: "2024-06-15",
      type: "Rapport Clinique",
      title: "Rapport Essai XT Plasma V2é",
      summary: "Rapport signé Sanders. V1: Mort cérébrale. V2: Dissociation mais stable pour les borderline. Prépare la V3.",
      tags: ["médical", "expérimental", "danger"],
      people: ["p_sanders"],
      transcription: "V1 : 23/0 (Mort cérébrale)... V2 : 57/2 (Dissociation)... La V3 doit se concentrer sur la stabilisation.",
      images: ["assets/img/15ef822b-f6b8-44bc-b581-76a699065f36.png", "assets/img/rapport-essai-clinique-zoom.png"]
    },
    {
      id: "doc_marcia_suivi",
      date: "2024-10-26",
      type: "Dossier Médical",
      title: "Suivi Clinique : Marcia Wilson",
      summary: "Patient borderline. Protocole XT Plasma. Évolution de la tension et coma le 26/10.",
      tags: ["médical", "xt-plasma"],
      people: ["p_marcia", "p_sanders"],
      images: ["assets/img/patient-marcia-zoom.png", "assets/img/patient-marcia-table-zoom.png"]
    },
    {
      id: "doc_note_perington",
      date: "2024-10-26", 
      type: "Note de Service",
      title: "Consignes Aile Dangereuse",
      summary: "Note à Mlle Perington : fermer les cellules et administrer la nitroglycérine avant le bloc.",
      tags: ["sécurité", "bloc-opératoire"],
      people: ["p_perington"],
      transcription: "N'oubliez pas d'administrer leur perfusion de nitroglycérine aux patients qui passeront au bloc cette nuit.",
      images: ["assets/img/5632c9a7-4e07-4802-8e11-f39a8d412d45.png"]
    },
    /* --- NOUVEAU DOCUMENT AJOUTÉ ICI --- */
    {
      id: "doc_note_faute",
      date: "2024-02-15", 
      type: "Note Manuscrite",
      title: "Note : 'Ce n'était pas ma faute'",
      summary: "Écrit obsessionnel d'un patient se plaignant des cris d'un 'petit'. Mentionne le Docteur. Menace explicite de 'le faire taire de nouveau'.",
      tags: ["psychose", "violence", "danger"],
      people: ["p_sanders"], 
      transcription: "Je vais devoir le faire taire de nouveau... Tais-toi TAIS TOI...",
      approx: true,
      images: ["assets/img/image_14fb47.jpg"]
    },
    /* ----------------------------------- */
    {
      id: "doc_radio_dents",
      date: "2025-01-01", 
      type: "Radiographie",
      title: "Planche Radio & Cannibalisme",
      summary: "Patient avec rage de dents due à un 'régime de chair humaine'. Marques gravées sur les dents.",
      tags: ["horreur", "cannibalisme", "rituel"],
      approx: true,
      images: ["assets/img/radio-note-zoom.png", "assets/img/e348fe90-a1c3-427c-a29f-2ea81f18bf21.png"]
    },
    {
      id: "doc_henri_kimmer",
      date: "2025-02-01", 
      type: "Fiche Enfant",
      title: "Signalement : Henri Kimmer",
      summary: "Enfant instable. Répète sans cesse : 'Ils ont pris ma VOIX'.",
      tags: ["enfance", "psychose"],
      people: ["p_henri"],
      approx: true,
      images: ["assets/img/1f314255-d603-497b-ba86-40a76cb8c2b6.png"]
    },
    {
      id: "doc_mosseba_origin",
      date: "2028-01-15",
      type: "Dossier Fédéral",
      title: "Origine du Projet MOSSEBA",
      summary: "Initié par Thomas Levy. But : Continuité de la conscience post-mortem via IA. Structure non enregistrée.",
      tags: ["gouvernement", "IA", "mosseba"],
      people: ["p_levy"],
      images: ["assets/img/af1bf6c6-dba5-4787-a62d-3de00452cebe.png"]
    },
    {
      id: "doc_mosseba_eval",
      date: "2028-02-20",
      type: "Dossier Fédéral",
      title: "Évaluation Gouvernementale",
      summary: "Projet jugé 'Hors Contrôle'. Menace existentielle maximale. Infrastructure compromise.",
      tags: ["gouvernement", "danger", "classifié"],
      images: ["assets/img/250fdf52-d5a9-4160-a6a5-b051f11ea24a.png"]
    },
    {
      id: "doc_lettre_codes",
      date: "2030-01-01", 
      type: "Lettre Manuscrite",
      title: "Lettre à Sienna (Cellule)",
      summary: "Lettre cryptique envoyée depuis une cellule. Contient des codes : Voix 7421, Yeux 3604...",
      tags: ["cryptique", "codes"],
      people: ["p_sienna"],
      transcription: "Ta voix : 7421 | Tes yeux : 3604 | Tes mains : 1957 | Ta vue : 8203",
      approx: true,
      images: ["assets/img/d74bc3c8-6fe2-43bf-ac89-be6f68e9de82.png"]
    },
    {
      id: "doc_cctv_levy",
      date: "2025-06-01",
      type: "Surveillance",
      title: "Interface CCTV - Lévy",
      summary: "Capture d'écran d'un système CCTV mentionnant 'Kela mishpahat Lévy'.",
      tags: ["surveillance", "technologie"],
      people: ["p_levy"],
      approx: true,
      images: ["assets/img/68e8cbd7-c7ac-438a-93c5-ddb236f57c87.png"]
    },
    {
      id: "doc_cctv_cam",
      date: "2025-06-01",
      type: "Surveillance",
      title: "Vue Caméra 001",
      summary: "Vue d'une cellule glauque à 05:20.",
      tags: ["surveillance", "horreur"],
      approx: true,
      images: ["assets/img/6c57ae0e-9ae9-4507-896a-a30397a5a065.png"]
    }
  ],

  // 3. LA TIMELINE (L'Histoire chronologique)
  events: [
    {
      id: "evt_1942",
      date: "1942-05-19",
      title: "L'Artefact Camus",
      summary: "Découverte d'un extrait de 'L'Étranger' daté de 1942. Origine inconnue dans le dossier.",
      type: "archive",
      related_docs: ["doc_1942_camus"]
    },
    {
      id: "evt_2005",
      date: "2005-01-01",
      title: "Naissance de Sienna Cameron",
      summary: "Début de la timeline biologique du sujet principal.",
      type: "biographie",
      people: ["p_sienna"],
      tags: ["naissance"]
    },
    {
      id: "evt_2008",
      date: "2008-03-08",
      title: "Le Désespoir d'Ethan",
      summary: "L'enfant Ethan écrit une lettre révélant que son seul but est de s'échapper de l'établissement, peu importe comment.",
      type: "témoignage",
      people: ["p_ethan"],
      related_docs: ["doc_ethan_lettre", "doc_ethan_haine"],
      tags: ["enfance"]
    },
    {
      id: "evt_2010_reve",
      date: "2010-06-01",
      title: "Vocation Policière",
      summary: "Un enfant (probablement Ethan) exprime le souhait de devenir policier pour protéger les autres, contrairement aux adultes de l'orphelinat.",
      type: "témoignage",
      people: ["p_ethan"],
      related_docs: ["doc_2006_reve"],
      approx: true
    },
    {
      id: "evt_2023_deficit",
      date: "2023-05-01",
      title: "Déficit & Gestion de l'Ombre",
      summary: "Les comptes de l'orphelinat sont dans le rouge. Anton Sanders signe déjà des documents financiers avant le rachat officiel.",
      type: "finance",
      people: ["p_sanders"],
      related_docs: ["doc_comptes_2023"],
      tags: ["suspect"]
    },
    {
      id: "evt_2023_vente",
      date: "2023-06-13",
      title: "Rachat par le Dr. Sanders",
      summary: "Georges Samson vend l'orphelinat au psychiatre Anton Sanders. Prise d'effet officielle en août.",
      type: "juridique",
      people: ["p_samson", "p_sanders"],
      related_docs: ["doc_vente_2023"]
    },
    {
      id: "evt_2023_sienna_police",
      date: "2023-09-01",
      title: "Sienna rejoint le LSPD",
      summary: "L'année du rachat de l'orphelinat coïncide avec l'entrée de Sienna dans les forces de l'ordre.",
      type: "biographie",
      people: ["p_sienna"],
      related_docs: ["doc_sienna_exam"],
      approx: true
    },
    /* --- NOUVEL ÉVÉNEMENT AJOUTÉ ICI --- */
    {
      id: "evt_incident_nuit",
      date: "2024-02-15",
      title: "Incident Nocturne",
      summary: "Un résident exprime des pulsions meurtrières envers un enfant bruyant. Le Dr Sanders impose des excuses, mais l'état du patient se dégrade.",
      type: "incident",
      related_docs: ["doc_note_faute"],
      approx: true
    },
    /* ----------------------------------- */
    {
      id: "evt_2024_v2",
      date: "2024-06-01",
      title: "Clôture Essai XT Plasma V2",
      summary: "Sanders valide la V2 malgré les décès. Note que les patients borderline résistent mieux à la dissociation.",
      type: "médical",
      people: ["p_sanders"],
      related_docs: ["doc_xt_v2"],
      approx: true
    },
    {
      id: "evt_2024_marcia_debut",
      date: "2024-09-03",
      title: "Début du Protocole Marcia",
      summary: "Marcia Wilson (Borderline) commence le suivi. Tension 12/6. Sous Aripiprazole.",
      type: "médical",
      people: ["p_marcia", "p_sanders"],
      related_docs: ["doc_marcia_suivi"]
    },
    {
      id: "evt_2024_marcia_xt",
      date: "2024-09-23",
      title: "Introduction du XT Plasma",
      summary: "Administration du XT Plasma (Test V3). Observation : 'Test V3'.",
      type: "médical",
      people: ["p_marcia"],
      tags: ["expérimental"]
    },
    {
      id: "evt_2024_coma",
      date: "2024-10-26",
      title: "Incident Critique : Coma",
      summary: "Marcia fait un coma (Tension 17/3). Transfert au bloc sous nitroglycérine, suivant les ordres donnés à Mlle Perington.",
      type: "incident",
      people: ["p_marcia", "p_perington"],
      related_docs: ["doc_marcia_suivi", "doc_note_perington"],
      tags: ["danger", "mort"]
    },
    {
      id: "evt_cannibalisme",
      date: "2025-01-01", 
      title: "Découvertes Macabres",
      summary: "Preuves de cannibalisme et de rituels (dents gravées) au sein de l'établissement. Cas Henri Kimmer ('Voix volée').",
      type: "enquête",
      people: ["p_henri"],
      related_docs: ["doc_radio_dents", "doc_henri_kimmer"],
      tags: ["horreur"],
      approx: true
    },
    {
      id: "evt_2028_mosseba",
      date: "2028-02-20",
      title: "Classification du Projet MOSSEBA",
      summary: "Le gouvernement classe le dossier. Le projet de Thomas Levy (conscience numérique) est déclaré 'Menace Existentielle'.",
      type: "gouvernement",
      people: ["p_levy"],
      related_docs: ["doc_mosseba_origin", "doc_mosseba_eval"],
      tags: ["IA", "apocalypse"]
    },
    {
      id: "evt_codes",
      date: "2030-06-15",
      title: "Contact Cellulaire",
      summary: "Sienna reçoit une lettre cryptique avec des codes biométriques (Voix, Yeux, Mains).",
      type: "mystère",
      people: ["p_sienna"],
      related_docs: ["doc_lettre_codes"],
      approx: true
    },
    {
      id: "evt_2034_mort",
      date: "2034-12-31",
      title: "Mort de Sienna Cameron",
      summary: "Fin de l'enregistrement pour le sujet Sienna Cameron.",
      type: "décès",
      people: ["p_sienna"],
      related_docs: ["doc_sienna_exam"]
    }
  ]
};