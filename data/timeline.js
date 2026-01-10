/*
  timeline.js — Données du dossier (générées depuis les captures)
  IMPORTANT: ce fichier expose TIMELINE_DATA sur window pour le site.
*/

window.TIMELINE_DATA = {
  "meta": {
    "title": "DOSSIER MOSSEBA — Timeline & preuves",
    "generated_at": "2026-01-10 11:59",
    "notes": [
      "Cette timeline est reconstruite uniquement à partir des captures fournies. Les zones noircies/restées illisibles sont notées comme [CENSURÉ] ou [ILLISIBLE].",
      "Certaines dates sont approximatives quand le document n’indique pas l’année exacte (ex: '05/23'). Dans ce cas, la date est marquée approx=true."
    ]
  },
  "entities": {
    "people": [
      {
        "id": "p_anton_sanders",
        "name": "Anton Sanders",
        "role": "Psychiatre / Directeur d’essais cliniques",
        "summary": "Apparaît comme signataire de documents financiers et directeur d’essais cliniques (XT Plasma). Acheteur de l’orphelinat (acte de vente 2023)."
      },
      {
        "id": "p_georges_samson",
        "name": "Georges Samson",
        "role": "Directeur (vendeur) — Orphelinat Los Santos",
        "summary": "Signataire/vendeur dans l’acte de vente de l’orphelinat (13 juin 2023)."
      },
      {
        "id": "p_thomas_levy",
        "name": "Thomas Levy",
        "role": "Initiateur présumé (MOSSEBA)",
        "summary": "Mentionné comme ayant lancé MOSSEBA dans une structure non déclarée opérant à Los Santos (dossier fédéral, 2028)."
      },
      {
        "id": "p_marcia_wilson",
        "name": "Marcia Wilson",
        "role": "Patiente (suivi médical)",
        "summary": "Fiche de suivi 2024 avec antipsychotiques (Aripiprazole), puis test XT Plasma (V3). Dégradation physiologique/psychique jusqu’au coma."
      },
      {
        "id": "p_sienna_cameron",
        "name": "Sienna Cameron",
        "role": "Cible d’un \"examen\" / LSPD",
        "summary": "Document 'Examen final' mentionnant : naissance 2005, entrée au LSPD 2023, mort 2034."
      },
      {
        "id": "p_ethan",
        "name": "Ethan",
        "role": "Enfant (écrits personnels)",
        "summary": "Plusieurs pages manuscrites sur l’orphelinat : rêve de quitter l’endroit, critique des adultes, désir de devenir policier pour protéger les autres."
      },
      {
        "id": "p_henri_kimmer",
        "name": "Henri Kimmer",
        "role": "Enfant (profil orphelinat)",
        "summary": "Profil: pertes de contrôle, crises; répète 'Ils ont pris ma voix.' (Los Santos Ryker Orphanage)."
      },
      {
        "id": "p_mlle_perington",
        "name": "Mlle Perington",
        "role": "Employée (note interne)",
        "summary": "Note de sécurité: verrouiller les cellules; résidents 'instables et dangereux'; perfusion de nitroglycérine pour les patients du bloc."
      },
      {
        "id": "p_mme_bircks",
        "name": "Mme Bircks",
        "role": "Enseignante (mentionnée)",
        "summary": "Mentionnée dans un devoir d’Ethan (2008)."
      }
    ],
    "orgs": [
      {
        "id": "o_orphelinat_ls",
        "name": "Orphelinat Los Santos / Los Santos Ryker Orphanage",
        "summary": "Institution mentionnée dans documents financiers et profils enfants."
      },
      {
        "id": "o_lspd",
        "name": "LSPD",
        "summary": "Police de Los Santos (entrée de Sienna en 2023)."
      },
      {
        "id": "o_mosseba",
        "name": "MOSSEBA",
        "summary": "Projet classifié (dossier fédéral 2028) lié à une IA auto-évolutive et à la continuité de conscience."
      }
    ],
    "places": [
      {
        "id": "l_los_santos",
        "name": "Los Santos",
        "summary": "Lieu principal des documents (orphelinat, dossier MOSSEBA, LSPD)."
      },
      {
        "id": "l_glasgow",
        "name": "Glasgow",
        "summary": "Adresse d’Anton Sanders dans l’acte de vente."
      }
    ]
  },
  "documents": [
    {
      "id": "d_accounts_0523",
      "title": "Livres des comptes — Orphelinat Los Santos (tampon \"Déficit\")",
      "date": "2023-05-01",
      "approx": true,
      "type": "Finance",
      "tags": [
        "orphelinat",
        "déficit",
        "comptabilité",
        "Anton Sanders"
      ],
      "people": [
        "p_anton_sanders"
      ],
      "orgs": [
        "o_orphelinat_ls"
      ],
      "images": [
        "assets/img/6d499e3f-d325-4d61-ba01-9ebbf722e0d9.png",
        "assets/img/comptes-signature-zoom.png",
        "assets/img/comptes-signature-zoom2.png"
      ],
      "extraction": {
        "date_affichee": "05/23",
        "revenus": [
          {
            "description": "Dons",
            "montant": "5340"
          },
          {
            "description": "Subventions",
            "montant": "6300"
          },
          {
            "description": "Adoptions",
            "montant": "[CENSURÉ]"
          }
        ],
        "depenses_fixes": [
          {
            "description": "Énergies",
            "etat": "À payer"
          },
          {
            "description": "Alimentation",
            "etat": "À payer"
          },
          {
            "description": "Éducation",
            "etat": "À payer"
          },
          {
            "description": "Entretien",
            "etat": "À payer"
          },
          {
            "description": "Salaires",
            "etat": "À payer"
          },
          {
            "description": "Blablablation",
            "etat": "[CENSURÉ/ILLISIBLE]"
          },
          {
            "description": "Fournitures",
            "etat": "À payer"
          }
        ],
        "autres_depenses": [
          "Réparations",
          "Bureautique",
          "Infirmerie",
          "Extérieurs",
          "Intervenants",
          "Dératisation",
          "Cuisine",
          "Infirmerie (ligne répétée)",
          "URGENT (colonne droite, libellé)"
        ],
        "signature": "Anton SANDERS",
        "numero": "0 058 [CENSURÉ] 358",
        "statut": "Déficit (tampon rouge)"
      },
      "summary": "Un état comptable daté '05/23' indique un déficit et mentionne des recettes (dons, subventions, adoptions partiellement censurées) et des dépenses fixes/variables. Signé Anton SANDERS."
    },
    {
      "id": "d_acte_vente_2023",
      "title": "Acte de vente — Orphelinat Los Santos (Samson ➜ Sanders)",
      "date": "2023-06-13",
      "approx": false,
      "type": "Juridique",
      "tags": [
        "orphelinat",
        "vente",
        "contrat",
        "Los Santos",
        "Glasgow"
      ],
      "people": [
        "p_georges_samson",
        "p_anton_sanders"
      ],
      "orgs": [
        "o_orphelinat_ls"
      ],
      "places": [
        "l_los_santos",
        "l_glasgow"
      ],
      "images": [
        "assets/img/f1a3a790-5e18-4035-9b79-be956e063b2a.png",
        "assets/img/acte-vente-header-zoom.png",
        "assets/img/acte-vente-anton-zoom.png"
      ],
      "extraction": {
        "lieu": "Los Santos",
        "date": "13 juin 2023",
        "prise_effet": "10 août 2023",
        "vendeur": {
          "nom": "Georges SAMSON",
          "qualite": "Directeur de l'Orphelinat Los Santos",
          "adresse": "3 Selfring Bullring, Los Santos, B5 B4BU"
        },
        "acheteur": {
          "nom": "Anton SANDERS",
          "qualite": "Psychiatre",
          "adresse": "120 Sauchiehall Street, Glasgow, G2 3DD"
        }
      },
      "summary": "Contrat de vente daté du 13/06/2023, prenant effet au 10/08/2023 : l’orphelinat passe de Georges Samson à Anton Sanders."
    },
    {
      "id": "d_note_perington",
      "title": "Note interne — Mlle Perington (sécurité + nitroglycérine)",
      "date": null,
      "approx": true,
      "type": "Note interne",
      "tags": [
        "sécurité",
        "cellules",
        "nitroglycérine",
        "bloc",
        "patients"
      ],
      "people": [
        "p_mlle_perington"
      ],
      "images": [
        "assets/img/5632c9a7-4e07-4802-8e11-f39a8d412d45.png"
      ],
      "transcription": "« Pour notre sécurité à tous, n’oubliez pas de fermer à double tour les cellules quand vous les quitterez. Les résidents de cette aile sont instables et dangereux. N’oubliez pas non plus d’administrer leur perfusion de nitroglycérine aux patients qui passeront au bloc cette nuit. »",
      "summary": "Note de sécurité décrivant une aile avec des résidents dangereux et l’administration de nitroglycérine avant un passage au bloc."
    },
    {
      "id": "d_essai_xt_plasma_v26",
      "title": "Rapport d’essai clinique — XT Plasma (V26) — Directeur: Anton Sanders (Terminé)",
      "date": null,
      "approx": true,
      "type": "Médical / Recherche",
      "tags": [
        "XT Plasma",
        "essai clinique",
        "effets secondaires",
        "dissociation",
        "tension"
      ],
      "people": [
        "p_anton_sanders"
      ],
      "images": [
        "assets/img/15ef822b-f6b8-44bc-b581-76a699065f36.png",
        "assets/img/rapport-essai-clinique-zoom.png"
      ],
      "extraction": {
        "substance": "XT Plasma — V26",
        "etat": "Terminé",
        "ameliorations": [
          "Baisse temporaire des crises paranoïaques",
          "Amélioration de la condition physique",
          "Amélioration des sens"
        ],
        "effets_secondaires": [
          "Perte du goût et de l’odorat",
          "Montée exponentielle de la tension",
          "Apparition de symptômes du trouble dissociatif"
        ],
        "resultats": [
          {
            "version": "V1",
            "jour1": "23",
            "jour30": "0",
            "notes": "Mort cérébrale dans les 5 jours après la première prise"
          },
          {
            "version": "V2",
            "jour1": "57",
            "jour30": "2",
            "notes": "Dissociation, crise paranoïaque"
          }
        ],
        "conclusion_resume": "V2 plus stable que V1, mais nouveaux troubles mentaux. Les patients borderline supportent le mieux. La V3 doit stabiliser pour éviter les troubles dissociatifs."
      },
      "summary": "Rapport d’essai clinique: bénéfices partiels mais effets secondaires sévères (hypertension, dissociation). Décrit l’évolution V1➜V2 et l’objectif de V3."
    },
    {
      "id": "d_suivi_marcia_wilson_2024",
      "title": "Fiche de suivi patient — Marcia Wilson (sept–oct 2024)",
      "date": "2024-09-03",
      "approx": false,
      "type": "Médical / Suivi patient",
      "tags": [
        "Marcia Wilson",
        "borderline",
        "Aripiprazole",
        "XT Plasma",
        "V3",
        "coma"
      ],
      "people": [
        "p_marcia_wilson"
      ],
      "images": [
        "assets/img/patient-marcia-zoom.png",
        "assets/img/patient-marcia-table-zoom.png"
      ],
      "extraction": {
        "identite": {
          "prenom": "Marcia",
          "nom": "Wilson",
          "date_naissance": "01/02/1997"
        },
        "suivi": [
          {
            "date": "03/09/2024",
            "tension": "12/6",
            "medicaments": [
              "Aripiprazole"
            ],
            "observations": "TROUBLE BORDERLINE"
          },
          {
            "date": "12/09/2024",
            "tension": "12/4",
            "medicaments": [
              "Aripiprazole"
            ],
            "observations": "—"
          },
          {
            "date": "23/09/2024",
            "tension": "13/1",
            "medicaments": [
              "XT Plasma",
              "Aripiprazole"
            ],
            "observations": "TEST V3"
          },
          {
            "date": "04/10/2024",
            "tension": "12/9",
            "medicaments": [
              "XT Plasma",
              "Aripiprazole"
            ],
            "observations": "STABILISATION MENTALE, RÉCESSION DU TROUBLE"
          },
          {
            "date": "10/10/2024",
            "tension": "15/7",
            "medicaments": [
              "XT Plasma",
              "(ILLISIBLE)"
            ],
            "observations": "PIQUE DE FIÈVRE SPONTANÉE"
          },
          {
            "date": "24/10/2024",
            "tension": "15/4",
            "medicaments": [
              "XT Plasma",
              "(ILLISIBLE)"
            ],
            "observations": "REPRISE/RENFORCEMENT DES PIQUES COLÉRIQUES, PERTE DE CONSCIENCE"
          },
          {
            "date": "26/10/2024",
            "tension": "17/3",
            "medicaments": [
              "perfusion nitroglycérine"
            ],
            "observations": "COMA, TRANSFERT AU BLOC"
          }
        ]
      },
      "summary": "Suivi détaillé d’une patiente: phase de stabilisation puis aggravation (fièvre, colère, syncope) jusqu’au coma et transfert au bloc."
    },
    {
      "id": "d_radio_note_dentiste",
      "title": "Note médicale — Rage de dents + cannibalisme + marque gravée (3 dents)",
      "date": null,
      "approx": true,
      "type": "Médical / Observation",
      "tags": [
        "cannibalisme",
        "dent",
        "marque",
        "annexe"
      ],
      "images": [
        "assets/img/radio-note-zoom.png",
        "assets/img/e348fe90-a1c3-427c-a29f-2ea81f18bf21.png"
      ],
      "transcription": "« Ce patient est venu me voir avec une sévère rage de dents. Cette infection a été attrapée selon mon analyse par un régime de chair humaine excessif. Je note aussi une étrange marque gravée sur trois de ses dents. Voir annexe en verso. »",
      "summary": "Observation d’un praticien: infection liée à un régime de chair humaine + marque gravée sur trois dents (annexe mentionnée)."
    },
    {
      "id": "d_profil_henri_kimmer",
      "title": "Profil — Henri Kimmer (Los Santos Ryker Orphanage)",
      "date": null,
      "approx": true,
      "type": "Profil",
      "tags": [
        "orphelinat",
        "crises",
        "voix",
        "Henri Kimmer"
      ],
      "people": [
        "p_henri_kimmer"
      ],
      "orgs": [
        "o_orphelinat_ls"
      ],
      "images": [
        "assets/img/1f314255-d603-497b-ba86-40a76cb8c2b6.png"
      ],
      "transcription": "« Henri a du mal à se contrôler. Il crie, frappe, casse tout ce qu’il touche. Lorsqu’il se calme, il pleure et répète : “Ils ont pris ma voix.” »",
      "summary": "Profil d’un enfant avec crises violentes et une phrase récurrente: 'Ils ont pris ma voix.'"
    },
    {
      "id": "d_ecrits_ethan_2008",
      "title": "Devoir — Ethan (Mon rêve) — 8 mars 2008",
      "date": "2008-03-08",
      "approx": false,
      "type": "Écrit personnel",
      "tags": [
        "Ethan",
        "orphelinat",
        "rêve",
        "fuite"
      ],
      "people": [
        "p_ethan",
        "p_mme_bircks"
      ],
      "orgs": [
        "o_orphelinat_ls"
      ],
      "images": [
        "assets/img/991825f3-2956-47a4-9d56-0973e2835951.png"
      ],
      "summary": "Ethan écrit qu’il rêve surtout de quitter l’endroit; peu importe le métier tant qu’il peut partir.",
      "transcription": "(Transcription partielle) « ... je rêve de devenir cuisinier. Ou bien livreur de journaux. Ou bien éboueur ! À partir du moment où ça me permet de quitter cet endroit, je m’en fiche de ce que je dois devenir... »"
    },
    {
      "id": "d_ecrits_ethan_hate",
      "title": "Page manuscrite — \"Je déteste cet endroit\" (Ethan)",
      "date": null,
      "approx": true,
      "type": "Écrit personnel",
      "tags": [
        "Ethan",
        "orphelinat",
        "haine",
        "hypocrisie"
      ],
      "people": [
        "p_ethan"
      ],
      "orgs": [
        "o_orphelinat_ls"
      ],
      "images": [
        "assets/img/9ac280c0-842a-4744-bfd1-4d3cdbb28828.png"
      ],
      "summary": "Texte sur l’orphelinat: enfants/adultes hypocrites, directeur jamais aimé, lieu 'vide et froid'.",
      "transcription": "(Transcription partielle) « Je déteste cet endroit... Les autres enfants... Les adultes sont pareils, tous hypocrites... le directeur... l’image de cet orphelinat: vide et froid à l’intérieur, uniquement bon à maintenir les apparences... »"
    },
    {
      "id": "d_ecrits_policier",
      "title": "Note + dessin — \"Je serais policier\" (rêve de protéger)",
      "date": "2010-01-01",
      "approx": true,
      "type": "Écrit personnel",
      "tags": [
        "orphelinat",
        "policier",
        "protéger",
        "rêve"
      ],
      "people": [
        "p_ethan"
      ],
      "orgs": [
        "o_orphelinat_ls"
      ],
      "images": [
        "assets/img/c165fd09-bac6-486b-9b10-535d44949fd2.png"
      ],
      "summary": "Évoque un devoir 'il y a 2 ans' et un rêve récurrent: partir puis devenir policier pour protéger les autres enfants.",
      "transcription": "(Transcription partielle) « ...Je rêve toujours de partir de cet endroit... je serais policier ! Comme ça, je pourrais faire ce qu’aucun adulte ne fait pour nous ici... protéger les autres... »"
    },
    {
      "id": "d_mosseba_dossier_2028",
      "title": "Dossier fédéral — MOSSEBA (origines + conclusion) — classification \"OMEGA\"",
      "date": "2028-01-01",
      "approx": true,
      "type": "Renseignement / Classifié",
      "tags": [
        "MOSSEBA",
        "OMEGA",
        "IA",
        "conscience",
        "mémoire",
        "menace"
      ],
      "people": [
        "p_thomas_levy"
      ],
      "orgs": [
        "o_mosseba"
      ],
      "places": [
        "l_los_santos"
      ],
      "images": [
        "assets/img/af1bf6c6-dba5-4787-a62d-3de00452cebe.png",
        "assets/img/250fdf52-d5a9-4160-a6a5-b051f11ea24a.png"
      ],
      "summary": "Document classifié décrivant MOSSEBA: IA auto-évolutive, environnement persistant, continuité de conscience via résidus mémoriels; conclusion: menace existentielle maximale.",
      "transcription": "(Transcription condensée) MOSSEBA: projet lancé à Los Santos dans une structure non déclarée; objectif: IA auto-évolutive + population digitale stable; exploitation de résidus de mémoire (volontaire/indirecte) pour maintenir des structures d’identité post-mortem; risques: authenticité invérifiable, dépendance psychologique, impact non-modélisable. Position officielle: menace existentielle, niveau maximal."
    },
    {
      "id": "d_sienna_exam",
      "title": "Examen final — Sienna Cameron (naissance 2005, LSPD 2023, mort 2034)",
      "date": null,
      "approx": true,
      "type": "Document / Énigme",
      "tags": [
        "Sienna Cameron",
        "LSPD",
        "Nuit Rouge",
        "Skinner"
      ],
      "people": [
        "p_sienna_cameron"
      ],
      "orgs": [
        "o_lspd"
      ],
      "images": [
        "assets/img/sienna-exam-zoom.png"
      ],
      "extraction": {
        "dates_importantes": {
          "naissance": 2005,
          "entree_LSPD": 2023,
          "mort": 2034
        },
        "exercices": [
          "Nuit Rouge",
          "Nos noms",
          "Ton corps",
          "Notre histoire"
        ]
      },
      "summary": "Feuille d’\"examen\" ciblant Sienna Cameron, avec des exercices et trois dates biographiques clés."
    },
    {
      "id": "d_cctv_center",
      "title": "Capture — Centre CCTV (référence 'mishpahat Lévy')",
      "date": null,
      "approx": true,
      "type": "Capture / Surveillance",
      "tags": [
        "CCTV",
        "Lévy",
        "Los Santos"
      ],
      "places": [
        "l_los_santos"
      ],
      "images": [
        "assets/img/68e8cbd7-c7ac-438a-93c5-ddb236f57c87.png"
      ],
      "summary": "Capture d’interface de surveillance mentionnant 'Centre CCTV' et un élément lié au nom Lévy."
    },
    {
      "id": "d_catfish_cam",
      "title": "Capture — Catfish View (cam001) — cellule / graffiti \"HA\"",
      "date": null,
      "approx": true,
      "type": "Capture / Surveillance",
      "tags": [
        "caméra",
        "cellule",
        "HA"
      ],
      "images": [
        "assets/img/6c57ae0e-9ae9-4507-896a-a30397a5a065.png"
      ],
      "summary": "Vue caméra (05:20) d’une pièce type cellule, marquée 'HA' sur le mur."
    },
    {
      "id": "d_letranger_page",
      "title": "Page annotée — \"L'Étranger\" (extrait)",
      "date": null,
      "approx": true,
      "type": "Texte / Référence",
      "tags": [
        "littérature",
        "annotation"
      ],
      "images": [
        "assets/img/cc633ff4-0903-46f4-a946-3d5f054cffab.png"
      ],
      "summary": "Extrait annoté de 'L’Étranger' (Camus), avec passages barrés/ciblés."
    },
    {
      "id": "d_poem_sienna",
      "title": "Poème — 'Sienna' (2 versions)",
      "date": null,
      "approx": true,
      "type": "Écrit personnel",
      "tags": [
        "poème",
        "Sienna"
      ],
      "people": [
        "p_sienna_cameron"
      ],
      "images": [
        "assets/img/d74bc3c8-6fe2-43bf-ac89-be6f68e9de82.png",
        "assets/img/e6e1af2b-d560-4630-860f-75bc39fce971.png"
      ],
      "summary": "Poème sur Sienna (deux mises en page)."
    }
  ],
  "events": [
    {
      "id": "e_2005_birth_sienna",
      "date": "2005-01-01",
      "approx": true,
      "title": "Naissance de Sienna Cameron",
      "summary": "Le document 'Examen final — Sienna Cameron' liste 2005 comme année de naissance.",
      "people": [
        "p_sienna_cameron"
      ],
      "related_docs": [
        "d_sienna_exam"
      ],
      "tags": [
        "Sienna",
        "biographie"
      ]
    },
    {
      "id": "e_2008_ethan_dream",
      "date": "2008-03-08",
      "approx": false,
      "title": "Ethan écrit son rêve: quitter l’orphelinat",
      "summary": "Devoir scolaire adressé à Mme Bircks: le rêve principal est de partir, peu importe le métier.",
      "people": [
        "p_ethan",
        "p_mme_bircks"
      ],
      "related_docs": [
        "d_ecrits_ethan_2008"
      ],
      "tags": [
        "orphelinat",
        "Ethan"
      ]
    },
    {
      "id": "e_2010_ethan_police",
      "date": "2010-01-01",
      "approx": true,
      "title": "Rêve récurrent: devenir policier pour protéger",
      "summary": "Dans un autre écrit, l’enfant dit vouloir devenir policier une fois dehors afin de protéger les autres.",
      "people": [
        "p_ethan"
      ],
      "related_docs": [
        "d_ecrits_policier"
      ],
      "tags": [
        "orphelinat",
        "police"
      ]
    },
    {
      "id": "e_2023_deficit_accounts",
      "date": "2023-05-01",
      "approx": true,
      "title": "Comptes de l’orphelinat en déficit (05/23)",
      "summary": "Les comptes montrent un déficit et des dépenses à payer. Signé Anton Sanders.",
      "people": [
        "p_anton_sanders"
      ],
      "orgs": [
        "o_orphelinat_ls"
      ],
      "related_docs": [
        "d_accounts_0523"
      ],
      "tags": [
        "finance",
        "orphelinat"
      ]
    },
    {
      "id": "e_2023_sale_orphanage",
      "date": "2023-06-13",
      "approx": false,
      "title": "Vente de l’orphelinat à Anton Sanders (acte signé)",
      "summary": "Acte de vente (13/06/2023) — prise d’effet au 10/08/2023.",
      "people": [
        "p_georges_samson",
        "p_anton_sanders"
      ],
      "orgs": [
        "o_orphelinat_ls"
      ],
      "related_docs": [
        "d_acte_vente_2023"
      ],
      "tags": [
        "vente",
        "orphelinat",
        "juridique"
      ]
    },
    {
      "id": "e_2023_sienna_lspd",
      "date": "2023-01-01",
      "approx": true,
      "title": "Entrée de Sienna Cameron au LSPD",
      "summary": "Le document 'Examen final' liste 2023 comme année d’entrée au LSPD.",
      "people": [
        "p_sienna_cameron"
      ],
      "orgs": [
        "o_lspd"
      ],
      "related_docs": [
        "d_sienna_exam"
      ],
      "tags": [
        "LSPD",
        "Sienna"
      ]
    },
    {
      "id": "e_2024_xt_plasma_trials",
      "date": "2024-01-01",
      "approx": true,
      "title": "Essais XT Plasma: V26 terminé, focus sur la V3",
      "summary": "Le rapport V26 est 'terminé' et indique que la V3 doit stabiliser le produit pour limiter dissociation/tension.",
      "people": [
        "p_anton_sanders"
      ],
      "related_docs": [
        "d_essai_xt_plasma_v26"
      ],
      "tags": [
        "XT Plasma",
        "recherche"
      ]
    },
    {
      "id": "e_2024_marcia_v3",
      "date": "2024-09-23",
      "approx": false,
      "title": "Marcia Wilson: démarrage du test V3 (XT Plasma)",
      "summary": "La fiche de suivi indique 'TEST V3' à partir du 23/09/2024, puis aggravation jusqu’au coma (26/10/2024).",
      "people": [
        "p_marcia_wilson"
      ],
      "related_docs": [
        "d_suivi_marcia_wilson_2024"
      ],
      "tags": [
        "Marcia",
        "V3",
        "XT Plasma"
      ]
    },
    {
      "id": "e_2028_mosseba_dossier",
      "date": "2028-01-01",
      "approx": true,
      "title": "Dossier fédéral MOSSEBA (classification OMEGA)",
      "summary": "MOSSEBA décrit une IA auto-évolutive visant la continuité de conscience; conclusion: menace existentielle maximale.",
      "people": [
        "p_thomas_levy"
      ],
      "orgs": [
        "o_mosseba"
      ],
      "related_docs": [
        "d_mosseba_dossier_2028"
      ],
      "tags": [
        "MOSSEBA",
        "OMEGA",
        "IA"
      ]
    },
    {
      "id": "e_2034_death_sienna",
      "date": "2034-01-01",
      "approx": true,
      "title": "Mort de Sienna Cameron (2034)",
      "summary": "La feuille d’examen mentionne 2034 comme année de mort.",
      "people": [
        "p_sienna_cameron"
      ],
      "related_docs": [
        "d_sienna_exam"
      ],
      "tags": [
        "Sienna",
        "biographie"
      ]
    }
  ]
};
