import type { Language } from "./types.ts";

export interface CuratedSource { label: Record<Language, string>; url: string; }
export interface CuratedTopic {
  id: string; category: string; priority: number; exactOnly?: boolean;
  phrases: Record<Language, string[]>; keywords: string[];
  answer: Record<Language, string>; sources: CuratedSource[];
  followups: Record<Language, string[]>;
}

export const CURATED_TOPICS: CuratedTopic[] = [
  {
    "id": "conversation.greeting",
    "category": "conversation",
    "priority": 150,
    "exactOnly": true,
    "phrases": {
      "fr": [
        "bonjour",
        "salut",
        "bonsoir",
        "coucou"
      ],
      "en": [
        "hello",
        "hi",
        "hey",
        "good morning",
        "good evening"
      ]
    },
    "keywords": [],
    "answer": {
      "fr": "Bonjour ! Je suis Aura, l’assistante du portfolio d’Ibrahim. Je peux vous renseigner sur ses projets, ses compétences techniques, sa formation et ses expériences professionnelles. Que souhaitez-vous découvrir ?",
      "en": "Hello! I’m Aura, Ibrahim’s portfolio assistant. I can help you explore his projects, technical skills, education, and professional experience. What would you like to know?"
    },
    "sources": [],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "conversation.thanks",
    "category": "conversation",
    "priority": 150,
    "exactOnly": true,
    "phrases": {
      "fr": [
        "merci",
        "merci beaucoup"
      ],
      "en": [
        "thanks",
        "thank you",
        "many thanks"
      ]
    },
    "keywords": [],
    "answer": {
      "fr": "Avec plaisir ! Vous pouvez continuer avec une question sur un projet, un logiciel, une expérience ou une compétence technique d’Ibrahim.",
      "en": "You’re welcome! You can continue with a question about Ibrahim’s projects, software tools, professional experience, or technical skills."
    },
    "sources": [],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "conversation.goodbye",
    "category": "conversation",
    "priority": 150,
    "exactOnly": true,
    "phrases": {
      "fr": [
        "au revoir",
        "à bientôt",
        "bonne journée"
      ],
      "en": [
        "goodbye",
        "bye",
        "see you"
      ]
    },
    "keywords": [],
    "answer": {
      "fr": "À bientôt ! Si vous souhaitez reprendre l’exploration du portfolio, Aura restera disponible.",
      "en": "See you soon! Aura will remain available whenever you want to continue exploring the portfolio."
    },
    "sources": [],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "conversation.help",
    "category": "conversation",
    "priority": 150,
    "exactOnly": true,
    "phrases": {
      "fr": [
        "aide",
        "que peux-tu faire",
        "comment peux-tu aider"
      ],
      "en": [
        "help",
        "what can you do",
        "how can you help"
      ]
    },
    "keywords": [],
    "answer": {
      "fr": "Je peux présenter le profil d’Ibrahim, expliquer ses projets, montrer où il a utilisé un outil précis, résumer ses expériences professionnelles, présenter sa formation et fournir ses coordonnées publiques.",
      "en": "I can introduce Ibrahim’s profile, explain his projects, show where a specific tool was used, summarize professional experience, present his education, and provide approved public contact details."
    },
    "sources": [],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "profile.summary",
    "category": "profile",
    "priority": 120,
        "phrases": {
      "fr": [
        "qui est ibrahim",
        "présente ibrahim",
        "profil ibrahim",
        "résumé professionnel"
      ],
      "en": [
        "who is ibrahim",
        "introduce ibrahim",
        "ibrahim profile",
        "professional summary"
      ]
    },
    "keywords": [
      "profil",
      "profile",
      "engineer",
      "ingénieur"
    ],
    "answer": {
      "fr": "Ibrahim Khallouq est ingénieur en énergétique et énergies renouvelables, diplômé de l’Université Internationale de Rabat. Son profil combine systèmes thermiques et électriques, énergies renouvelables, stockage BESS, efficacité énergétique, simulation numérique et développement d’outils Python. Il sait couvrir plusieurs étapes d’un projet : faisabilité, dimensionnement, conception, simulation, optimisation et validation.",
      "en": "Ibrahim Khallouq is an Energy and Renewable Energies Engineer who graduated from the International University of Rabat. His profile combines thermal and electrical systems, renewable energy, BESS, energy efficiency, numerical simulation, and Python tool development. He can contribute across feasibility, sizing, design, simulation, optimization, and validation."
    },
    "sources": [
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [
        "Quels sont ses projets principaux ?",
        "Quelles sont ses compétences techniques ?"
      ],
      "en": [
        "What are his main projects?",
        "What are his technical skills?"
      ]
    }
  },
  {
    "id": "profile.domains",
    "category": "profile",
    "priority": 105,
        "phrases": {
      "fr": [
        "domaines de compétence",
        "spécialités",
        "expertise technique",
        "domaines techniques"
      ],
      "en": [
        "areas of expertise",
        "technical domains",
        "specializations",
        "technical expertise"
      ]
    },
    "keywords": [
      "thermodynamique",
      "electrical",
      "électrique",
      "thermal"
    ],
    "answer": {
      "fr": "Ses domaines couvrent la thermodynamique, les transferts thermiques, l’électrotechnique HT/MT/BT, les énergies renouvelables, l’efficacité énergétique, la CFD, les BESS, les micro-réseaux, l’hydrogène vert et l’automatisation IoT. Ses projets montrent également une capacité à relier l’ingénierie physique aux outils numériques.",
      "en": "His domains include thermodynamics, heat transfer, HV/MV/LV electrical engineering, renewable energy, energy efficiency, CFD, BESS, microgrids, green hydrogen, and IoT automation. His projects also demonstrate the ability to connect physical engineering with digital tools."
    },
    "sources": [
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "profile.differentiation",
    "category": "recruitment",
    "priority": 95,
        "phrases": {
      "fr": [
        "pourquoi recruter ibrahim",
        "points forts du profil",
        "qu’est-ce qui le différencie",
        "valeur ajoutée"
      ],
      "en": [
        "why hire ibrahim",
        "profile strengths",
        "what makes him different",
        "added value"
      ]
    },
    "keywords": [
      "hire",
      "recruter",
      "strengths",
      "forces"
    ],
    "answer": {
      "fr": "Le principal atout d’Ibrahim est la combinaison de trois dimensions : une base énergétique multidisciplinaire, une maîtrise d’outils de simulation spécialisés et la capacité de développer ses propres applications Python. Cette combinaison lui permet d’analyser un problème, de dimensionner une solution, de la simuler et de présenter les résultats dans un outil exploitable.",
      "en": "Ibrahim’s main strength is the combination of multidisciplinary energy engineering, specialized simulation tools, and the ability to develop custom Python applications. This allows him to analyze a problem, size a solution, simulate it, and present the results through a usable digital tool."
    },
    "sources": [
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      },
      {
        "label": {
          "fr": "IBWatts — Outil solaire technico-économique",
          "en": "IBWatts — Solar Techno-Economic Tool"
        },
        "url": "ibwatts.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "profile.languages",
    "category": "profile",
    "priority": 100,
        "phrases": {
      "fr": [
        "quelles langues",
        "langues parlées",
        "niveau en anglais",
        "niveau en français"
      ],
      "en": [
        "which languages",
        "languages spoken",
        "english level",
        "french level"
      ]
    },
    "keywords": [
      "arabe",
      "arabic",
      "french",
      "français",
      "english",
      "anglais"
    ],
    "answer": {
      "fr": "Ibrahim parle arabe comme langue maternelle, utilise le français couramment dans un contexte technique et dispose d’un niveau avancé C1 en anglais technique.",
      "en": "Ibrahim is a native Arabic speaker, uses French fluently in technical contexts, and has advanced C1-level technical English."
    },
    "sources": [
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "profile.education",
    "category": "education",
    "priority": 115,
        "phrases": {
      "fr": [
        "formation d’ibrahim",
        "où a-t-il étudié",
        "diplôme",
        "université"
      ],
      "en": [
        "ibrahim education",
        "where did he study",
        "degree",
        "university"
      ]
    },
    "keywords": [
      "uir",
      "education",
      "formation",
      "diplôme",
      "degree"
    ],
    "answer": {
      "fr": "Ibrahim a suivi un diplôme d’ingénieur en énergétique et énergies renouvelables à l’Université Internationale de Rabat entre 2021 et 2026. Sa formation couvre notamment la thermodynamique, les transferts thermiques, la mécanique des fluides, l’électrotechnique, l’audit énergétique, les smart grids, l’électronique embarquée et l’automatique. Il possède également un baccalauréat en Sciences et Technologies Électriques.",
      "en": "Ibrahim completed an Engineering Degree in Energy and Renewable Energies at the International University of Rabat from 2021 to 2026. The curriculum includes thermodynamics, heat transfer, fluid mechanics, electrical engineering, energy auditing, smart grids, embedded electronics, and control. He also holds a high-school diploma in Electrical Sciences and Technologies."
    },
    "sources": [
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "profile.location",
    "category": "contact",
    "priority": 90,
        "phrases": {
      "fr": [
        "où est basé ibrahim",
        "localisation",
        "mobilité"
      ],
      "en": [
        "where is ibrahim based",
        "location",
        "mobility"
      ]
    },
    "keywords": [
      "rabat",
      "maroc",
      "morocco",
      "location"
    ],
    "answer": {
      "fr": "Ibrahim est basé à Rabat, au Maroc. Son profil indique également une mobilité vers Ouarzazate, Casablanca et Dakhla.",
      "en": "Ibrahim is based in Rabat, Morocco. His profile also indicates mobility toward Ouarzazate, Casablanca, and Dakhla."
    },
    "sources": [
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "profile.contact",
    "category": "contact",
    "priority": 140,
        "phrases": {
      "fr": [
        "comment contacter ibrahim",
        "email ibrahim",
        "téléphone ibrahim",
        "linkedin ibrahim",
        "github ibrahim"
      ],
      "en": [
        "how can i contact ibrahim",
        "ibrahim email",
        "ibrahim phone",
        "ibrahim linkedin",
        "ibrahim github"
      ]
    },
    "keywords": [
      "contact",
      "email",
      "phone",
      "téléphone",
      "linkedin",
      "github"
    ],
    "answer": {
      "fr": "Vous pouvez contacter Ibrahim par email à khallouk.ibrahim@uir.ac.ma ou par téléphone au +212 650 93 18 50. Ses profils LinkedIn et GitHub sont également disponibles via la section Contact du portfolio.",
      "en": "You can contact Ibrahim by email at khallouk.ibrahim@uir.ac.ma or by phone at +212 650 93 18 50. His LinkedIn and GitHub profiles are also available through the portfolio’s Contact section."
    },
    "sources": [
      {
        "label": {
          "fr": "Contact",
          "en": "Contact"
        },
        "url": "index.html#contact"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "experience.overview",
    "category": "experience",
    "priority": 105,
        "phrases": {
      "fr": [
        "expérience professionnelle",
        "parcours professionnel",
        "stages d’ibrahim"
      ],
      "en": [
        "professional experience",
        "career experience",
        "ibrahim internships"
      ]
    },
    "keywords": [
      "experience",
      "expérience",
      "internship",
      "stage"
    ],
    "answer": {
      "fr": "Le parcours d’Ibrahim comprend une expérience de quatre mois comme Ingénieur Projet Énergie chez Novec en 2026, un stage en maintenance et opérations à Noor I CSP en 2023, une expérience en ingénierie solaire et pompage en 2022, ainsi qu’un stage d’optimisation des processus industriels chez Menara Holding en 2021.",
      "en": "Ibrahim’s experience includes four months as an Energy Project Engineer at Novec in 2026, a Maintenance and Operations internship at Noor I CSP in 2023, a Solar Engineering and Pumping internship in 2022, and an Industrial Process Optimization internship at Menara Holding in 2021."
    },
    "sources": [
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "experience.novec",
    "category": "experience",
    "priority": 120,
        "phrases": {
      "fr": [
        "expérience chez novec",
        "rôle chez novec",
        "travail chez novec"
      ],
      "en": [
        "experience at novec",
        "role at novec",
        "work at novec"
      ]
    },
    "keywords": [
      "novec"
    ],
    "answer": {
      "fr": "Chez Novec, Ibrahim a travaillé pendant quatre mois en 2026 comme Ingénieur Projet Énergie. Ses missions ont porté sur des études de faisabilité et technico-économiques, le dimensionnement PV+BESS, la conception électrique avec schémas unifilaires et des simulations utilisant PVSyst, HOMER Pro, Caneco BT et PowerFactory. La partie publique du portfolio met notamment en avant deux centrales PV+BESS de 580 kWc à Dakhla.",
      "en": "At Novec, Ibrahim worked for four months in 2026 as an Energy Project Engineer. His work covered feasibility and techno-economic studies, PV+BESS sizing, electrical design with single-line diagrams, and simulations using PVSyst, HOMER Pro, Caneco BT, and PowerFactory. The public portfolio highlights two 580 kWp PV+BESS plants in Dakhla."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "experience.noor",
    "category": "experience",
    "priority": 115,
        "phrases": {
      "fr": [
        "stage noor",
        "expérience noor",
        "noor i csp"
      ],
      "en": [
        "noor internship",
        "experience at noor",
        "noor i csp"
      ]
    },
    "keywords": [
      "noor",
      "csp",
      "ouarzazate"
    ],
    "answer": {
      "fr": "À Noor I CSP, Ibrahim a effectué un stage en maintenance et opérations en août 2023. Il a analysé des défaillances de systèmes CSP, interprété des schémas P&ID et électriques du champ solaire, et contribué à réduire le temps de diagnostic des défaillances de 15 %.",
      "en": "At Noor I CSP, Ibrahim completed a Maintenance and Operations internship in August 2023. He analyzed CSP system failures, interpreted P&ID and electrical diagrams for the solar field, and contributed to a 15% reduction in fault-diagnosis time."
    },
    "sources": [
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "experience.solaroffice",
    "category": "experience",
    "priority": 112,
        "phrases": {
      "fr": [
        "stage pompage solaire",
        "bureau d’études solaire",
        "ingénierie solaire 2022"
      ],
      "en": [
        "solar pumping internship",
        "solar engineering office",
        "solar engineering 2022"
      ]
    },
    "keywords": [
      "pompage",
      "pumping",
      "solar office"
    ],
    "answer": {
      "fr": "En août 2022, Ibrahim a participé à la supervision de l’installation et de la mise en service de systèmes de pompage solaire. Il a également suivi les performances des onduleurs et des panneaux photovoltaïques, ce qui lui a apporté une expérience de terrain complémentaire aux études de simulation.",
      "en": "In August 2022, Ibrahim participated in supervising the installation and commissioning of solar pumping systems. He also monitored inverter and PV-panel performance, adding field experience to his simulation and design background."
    },
    "sources": [
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "experience.menara",
    "category": "experience",
    "priority": 112,
        "phrases": {
      "fr": [
        "stage menara",
        "expérience menara holding",
        "optimisation processus industriels"
      ],
      "en": [
        "menara internship",
        "experience at menara holding",
        "industrial process optimization"
      ]
    },
    "keywords": [
      "menara"
    ],
    "answer": {
      "fr": "Chez Menara Holding en juillet 2021, Ibrahim a audité des équipements de production thermiques et mécaniques. L’analyse des données a permis d’identifier un potentiel de gain d’efficacité de 5 % dans le processus thermique.",
      "en": "At Menara Holding in July 2021, Ibrahim audited thermal and mechanical production equipment. Data analysis identified a potential 5% efficiency improvement in the thermal process."
    },
    "sources": [
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "projects.overview",
    "category": "projects",
    "priority": 105,
        "phrases": {
      "fr": [
        "quels sont les projets",
        "principaux projets",
        "liste des projets"
      ],
      "en": [
        "what are the projects",
        "main projects",
        "list the projects"
      ]
    },
    "keywords": [
      "projets",
      "projects"
    ],
    "answer": {
      "fr": "Les principaux projets présentés sont : les centrales PV+BESS de Dakhla, la centrale PV 67 MW avec modélisation EMS/BMS, IBWatts, la maison bioclimatique intelligente, HydroTwin et le système de prédiction énergétique par IA. Ensemble, ils couvrent le solaire, le stockage, les réseaux électriques, la thermique, l’hydrogène, l’IoT, la finance et le développement Python.",
      "en": "The main projects presented are the Dakhla PV+BESS plants, the 67 MW PV plant with EMS/BMS modeling, IBWatts, the Smart Bioclimatic House, HydroTwin, and the AI Energy Prediction System. Together they cover solar energy, storage, electrical grids, thermal engineering, hydrogen, IoT, finance, and Python development."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      },
      {
        "label": {
          "fr": "Centrale PV 67 MW + BESS",
          "en": "67 MW PV+BESS Plant"
        },
        "url": "solar-bess-67mw.html"
      },
      {
        "label": {
          "fr": "IBWatts — Outil solaire technico-économique",
          "en": "IBWatts — Solar Techno-Economic Tool"
        },
        "url": "ibwatts.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.dakhla.overview",
    "category": "project",
    "priority": 125,
        "phrases": {
      "fr": [
        "projet dakhla",
        "micro-réseaux dakhla",
        "centrales 580 kwc"
      ],
      "en": [
        "dakhla project",
        "dakhla microgrids",
        "580 kwp plants"
      ]
    },
    "keywords": [
      "dakhla",
      "580"
    ],
    "answer": {
      "fr": "Le projet public de Dakhla concerne deux centrales photovoltaïques avec stockage, chacune d’environ 580 kWc. Ibrahim a participé aux études de faisabilité, au dimensionnement, à la conception électrique, aux schémas unifilaires et aux simulations nécessaires pour évaluer le fonctionnement des systèmes PV+BESS.",
      "en": "The public Dakhla project covers two photovoltaic plants with battery storage, each around 580 kWp. Ibrahim contributed to feasibility studies, sizing, electrical design, single-line diagrams, and simulations used to assess PV+BESS system operation."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.dakhla.role",
    "category": "project",
    "priority": 118,
        "phrases": {
      "fr": [
        "rôle à dakhla",
        "contribution dakhla",
        "qu’a-t-il fait à dakhla"
      ],
      "en": [
        "role in dakhla",
        "contribution to dakhla",
        "what did he do in dakhla"
      ]
    },
    "keywords": [
      "dakhla",
      "role",
      "rôle"
    ],
    "answer": {
      "fr": "Pour les centrales PV+BESS de Dakhla, Ibrahim a couvert plusieurs étapes : analyse des besoins, dimensionnement des composants, étude technico-économique, conception électrique, préparation des SLD et validation par simulation. Les outils associés comprennent PVSyst, HOMER Pro, Caneco BT, PowerFactory et AutoCAD.",
      "en": "For the Dakhla PV+BESS plants, Ibrahim covered multiple stages: needs analysis, component sizing, techno-economic assessment, electrical design, SLD preparation, and simulation-based validation. The associated tools include PVSyst, HOMER Pro, Caneco BT, PowerFactory, and AutoCAD."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.67mw.overview",
    "category": "project",
    "priority": 125,
        "phrases": {
      "fr": [
        "projet 67 mw",
        "centrale 67 mw",
        "67mw pv bess"
      ],
      "en": [
        "67 mw project",
        "67 mw plant",
        "67mw pv bess"
      ]
    },
    "keywords": [
      "67mw",
      "67 mw"
    ],
    "answer": {
      "fr": "Le projet porte sur le dimensionnement et l’étude technico-économique d’une centrale photovoltaïque de 67 MW couplée à un BESS. Ibrahim a conçu l’architecture de contrôle EMS/BMS et créé un modèle dynamique sous MATLAB/Simulink afin d’étudier le contrôle en temps réel, l’intégration réseau et la stabilité du système.",
      "en": "The project covers the sizing and techno-economic assessment of a 67 MW photovoltaic plant coupled with BESS. Ibrahim designed the EMS/BMS control architecture and created a dynamic MATLAB/Simulink model to study real-time control, grid integration, and system stability."
    },
    "sources": [
      {
        "label": {
          "fr": "Centrale PV 67 MW + BESS",
          "en": "67 MW PV+BESS Plant"
        },
        "url": "solar-bess-67mw.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.67mw.results",
    "category": "project",
    "priority": 115,
        "phrases": {
      "fr": [
        "résultats 67 mw",
        "stabilité 67 mw",
        "résultat centrale 67"
      ],
      "en": [
        "67 mw results",
        "67 mw stability",
        "plant results"
      ]
    },
    "keywords": [
      "67mw",
      "stability",
      "stabilité"
    ],
    "answer": {
      "fr": "Les résultats vérifiés incluent l’étude de l’impact d’une injection de 67 MW sur le réseau haute tension, la validation de la stabilité sous contrainte et l’optimisation de la taille du BESS pour améliorer le compromis technico-économique et le ROI.",
      "en": "Verified outcomes include studying the impact of 67 MW injection on the high-voltage grid, validating stability under constraints, and optimizing BESS size to improve the techno-economic trade-off and ROI."
    },
    "sources": [
      {
        "label": {
          "fr": "Centrale PV 67 MW + BESS",
          "en": "67 MW PV+BESS Plant"
        },
        "url": "solar-bess-67mw.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.ibwatts.overview",
    "category": "project",
    "priority": 125,
        "phrases": {
      "fr": [
        "qu’est-ce que ibwatts",
        "projet ibwatts",
        "application solaire ibwatts"
      ],
      "en": [
        "what is ibwatts",
        "ibwatts project",
        "ibwatts solar app"
      ]
    },
    "keywords": [
      "ibwatts"
    ],
    "answer": {
      "fr": "IBWatts est une application web technico-économique développée en Python et Streamlit pour simuler et dimensionner des installations solaires au Maroc. Elle combine données météorologiques, physique solaire, sélection automatique d’équipements réels, tarification locale, analyse financière et génération de rapports.",
      "en": "IBWatts is a Python and Streamlit techno-economic web application for simulating and sizing solar installations in Morocco. It combines weather data, solar physics, automatic selection of real equipment, local tariff modeling, financial analysis, and report generation."
    },
    "sources": [
      {
        "label": {
          "fr": "IBWatts — Outil solaire technico-économique",
          "en": "IBWatts — Solar Techno-Economic Tool"
        },
        "url": "ibwatts.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.ibwatts.features",
    "category": "project",
    "priority": 112,
        "phrases": {
      "fr": [
        "fonctionnalités ibwatts",
        "que fait ibwatts",
        "features ibwatts"
      ],
      "en": [
        "ibwatts features",
        "what does ibwatts do",
        "ibwatts capabilities"
      ]
    },
    "keywords": [
      "ibwatts",
      "features",
      "fonctionnalités"
    ],
    "answer": {
      "fr": "IBWatts calcule l’inclinaison optimale, les pertes thermiques et l’irradiation, récupère des données météo via NASA POWER, modélise les tarifs ONE/Régies, sélectionne des combinaisons panneau-onduleur, simule le peak shaving et les prêts verts, puis calcule ROI, VAN, TRI et amortissement. L’outil propose aussi une visualisation de toiture et des exports PDF/Excel.",
      "en": "IBWatts calculates optimal tilt, thermal losses, and irradiation; retrieves weather data through NASA POWER; models ONE/Régies tariffs; selects panel-inverter combinations; simulates peak shaving and green loans; and calculates ROI, NPV, IRR, and payback. It also provides a roof visualizer and PDF/Excel exports."
    },
    "sources": [
      {
        "label": {
          "fr": "IBWatts — Outil solaire technico-économique",
          "en": "IBWatts — Solar Techno-Economic Tool"
        },
        "url": "ibwatts.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.ibwatts.role",
    "category": "project",
    "priority": 110,
        "phrases": {
      "fr": [
        "rôle sur ibwatts",
        "contribution ibwatts",
        "qui a développé ibwatts"
      ],
      "en": [
        "role in ibwatts",
        "ibwatts contribution",
        "who developed ibwatts"
      ]
    },
    "keywords": [
      "ibwatts",
      "role"
    ],
    "answer": {
      "fr": "IBWatts est un projet personnel développé de bout en bout par Ibrahim : moteur de calcul, logique de dimensionnement, base d’équipements, analyse financière, interface Streamlit et génération de rapports. Le projet démontre une capacité de développement full-stack Python appliquée à l’ingénierie solaire.",
      "en": "IBWatts is a personal project developed end-to-end by Ibrahim: calculation engine, sizing logic, equipment database, financial analysis, Streamlit interface, and report generation. It demonstrates full-stack Python development applied to solar engineering."
    },
    "sources": [
      {
        "label": {
          "fr": "IBWatts — Outil solaire technico-économique",
          "en": "IBWatts — Solar Techno-Economic Tool"
        },
        "url": "ibwatts.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.smarthouse.overview",
    "category": "project",
    "priority": 125,
        "phrases": {
      "fr": [
        "maison intelligente",
        "smart house",
        "maison bioclimatique"
      ],
      "en": [
        "smart house",
        "bioclimatic house",
        "intelligent house"
      ]
    },
    "keywords": [
      "smart house",
      "maison",
      "bioclimatique"
    ],
    "answer": {
      "fr": "La maison bioclimatique intelligente combine simulation thermique sous DesignBuilder/EnergyPlus et contrôle matériel IoT. Ibrahim a modélisé le bâtiment, optimisé l’enveloppe, intégré un système PV en toiture et développé un prototype Arduino R4 avec capteurs et boucle PID pour le contrôle climatique.",
      "en": "The Smart Bioclimatic House combines DesignBuilder/EnergyPlus thermal simulation with IoT hardware control. Ibrahim modeled the building, optimized the envelope, integrated rooftop PV, and developed an Arduino R4 prototype with sensors and PID climate control."
    },
    "sources": [
      {
        "label": {
          "fr": "Maison bioclimatique intelligente",
          "en": "Smart Bioclimatic House"
        },
        "url": "smart_house.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.smarthouse.results",
    "category": "project",
    "priority": 120,
        "phrases": {
      "fr": [
        "résultats maison intelligente",
        "performance smart house",
        "réduction refroidissement"
      ],
      "en": [
        "smart house results",
        "smart house performance",
        "cooling reduction"
      ]
    },
    "keywords": [
      "smart house",
      "cooling",
      "refroidissement",
      "results",
      "résultats"
    ],
    "answer": {
      "fr": "Les résultats vérifiés montrent une baisse de plus de 40 % des besoins de refroidissement grâce aux protections solaires et à la ventilation naturelle, ainsi qu’une réduction des besoins de chauffage par les gains solaires passifs et l’étanchéité à l’air. Le bâtiment surpasse les exigences minimales de la RTCM et son EUI est fortement réduit par rapport à une construction standard.",
      "en": "Verified results show a reduction of more than 40% in cooling demand through solar shading and natural ventilation, together with lower heating needs through passive solar gains and airtightness. The building outperforms minimum RTCM requirements and significantly reduces EUI compared with standard construction."
    },
    "sources": [
      {
        "label": {
          "fr": "Maison bioclimatique intelligente",
          "en": "Smart Bioclimatic House"
        },
        "url": "smart_house.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.smarthouse.iot",
    "category": "project",
    "priority": 112,
        "phrases": {
      "fr": [
        "iot maison intelligente",
        "arduino smart house",
        "capteurs maison"
      ],
      "en": [
        "smart house iot",
        "arduino smart house",
        "house sensors"
      ]
    },
    "keywords": [
      "arduino",
      "dht22",
      "iot",
      "pid"
    ],
    "answer": {
      "fr": "Le prototype IoT utilise un Arduino R4 programmé en C++, des capteurs DHT22, LDR et PIR, une connexion Wi-Fi vers un dashboard cloud et une boucle PID matérielle commandant les relais HVAC. Il s’agit d’une maquette à échelle réduite ; un déploiement réel nécessiterait une architecture industrielle adaptée.",
      "en": "The IoT prototype uses an Arduino R4 programmed in C++, DHT22, LDR, and PIR sensors, Wi-Fi connectivity to a cloud dashboard, and a hardware PID loop controlling HVAC relays. It is a scaled prototype; real deployment would require a suitable industrial architecture."
    },
    "sources": [
      {
        "label": {
          "fr": "Maison bioclimatique intelligente",
          "en": "Smart Bioclimatic House"
        },
        "url": "smart_house.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.hydrotwin.overview",
    "category": "project",
    "priority": 125,
        "phrases": {
      "fr": [
        "qu’est-ce que hydrotwin",
        "projet hydrotwin",
        "jumeau numérique hydrogène"
      ],
      "en": [
        "what is hydrotwin",
        "hydrotwin project",
        "hydrogen digital twin"
      ]
    },
    "keywords": [
      "hydrotwin",
      "hydrogen",
      "hydrogène",
      "power-to-x"
    ],
    "answer": {
      "fr": "HydroTwin est un jumeau numérique Power-to-X développé en Python. Il modélise la chaîne PV → électrolyseur PEM → stockage d’hydrogène, calcule les performances physiques et économiques, puis optimise le dimensionnement du champ PV, de l’électrolyseur et du stockage.",
      "en": "HydroTwin is a Python-based Power-to-X digital twin. It models the PV → PEM electrolyzer → hydrogen-storage chain, calculates physical and economic performance, and optimizes the sizing of the PV field, electrolyzer, and storage."
    },
    "sources": [
      {
        "label": {
          "fr": "HydroTwin — Power-to-X",
          "en": "HydroTwin — Power-to-X"
        },
        "url": "hydrotwin.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.hydrotwin.technical",
    "category": "project",
    "priority": 112,
        "phrases": {
      "fr": [
        "comment fonctionne hydrotwin",
        "modèle pem hydrotwin",
        "optimisation hydrotwin"
      ],
      "en": [
        "how hydrotwin works",
        "hydrotwin pem model",
        "hydrotwin optimization"
      ]
    },
    "keywords": [
      "hydrotwin",
      "pem",
      "lcoh",
      "optimization",
      "optimisation"
    ],
    "answer": {
      "fr": "Le moteur simule le productible PV horaire avec des modèles physiques, la courbe de polarisation et les surtensions de l’électrolyseur PEM, le stockage et l’énergie de compression. Une optimisation multiobjectif recherche un compromis entre tailles d’équipements et coût, tandis que le LCOH en €/kg sert d’indicateur économique principal.",
      "en": "The engine simulates hourly PV yield using physical models, the PEM electrolyzer polarization curve and overvoltages, storage behavior, and compression energy. Multi-objective optimization searches for a trade-off between equipment sizes and cost, while LCOH in €/kg is the main economic indicator."
    },
    "sources": [
      {
        "label": {
          "fr": "HydroTwin — Power-to-X",
          "en": "HydroTwin — Power-to-X"
        },
        "url": "hydrotwin.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.hydrotwin.role",
    "category": "project",
    "priority": 108,
        "phrases": {
      "fr": [
        "rôle hydrotwin",
        "contribution hydrotwin",
        "qui a développé hydrotwin"
      ],
      "en": [
        "hydrotwin role",
        "hydrotwin contribution",
        "who developed hydrotwin"
      ]
    },
    "keywords": [
      "hydrotwin",
      "role"
    ],
    "answer": {
      "fr": "Ibrahim a développé de manière indépendante le moteur physique, l’algorithme d’optimisation et l’interface utilisateur de HydroTwin. Le projet démontre ses compétences en modélisation énergétique, Python, optimisation et analyse technico-économique de l’hydrogène vert.",
      "en": "Ibrahim independently developed HydroTwin’s physical engine, optimization algorithm, and user interface. The project demonstrates skills in energy modeling, Python, optimization, and green-hydrogen techno-economic analysis."
    },
    "sources": [
      {
        "label": {
          "fr": "HydroTwin — Power-to-X",
          "en": "HydroTwin — Power-to-X"
        },
        "url": "hydrotwin.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.ai.overview",
    "category": "project",
    "priority": 125,
        "phrases": {
      "fr": [
        "projet prédiction ia",
        "système prédiction énergétique",
        "ai prediction project"
      ],
      "en": [
        "ai prediction project",
        "energy prediction system",
        "machine learning project"
      ]
    },
    "keywords": [
      "prediction",
      "prédiction",
      "machine learning"
    ],
    "answer": {
      "fr": "Le système de prédiction énergétique utilise la température, l’humidité et la date pour prévoir la consommation. Le workflow comprend nettoyage des données avec Pandas, normalisation, séparation entraînement/test, entraînement de modèles de régression sous Scikit-Learn et visualisation dans une application Streamlit.",
      "en": "The energy-prediction system uses temperature, humidity, and date to forecast consumption. The workflow includes Pandas data cleaning, normalization, train/test splitting, regression-model training with Scikit-Learn, and visualization through a Streamlit application."
    },
    "sources": [
      {
        "label": {
          "fr": "Prédiction énergétique par IA",
          "en": "AI Energy Prediction"
        },
        "url": "ai-prediction.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "project.ai.results",
    "category": "project",
    "priority": 115,
        "phrases": {
      "fr": [
        "précision modèle ia",
        "résultats prédiction",
        "92 précision"
      ],
      "en": [
        "ai model accuracy",
        "prediction results",
        "92 accuracy"
      ]
    },
    "keywords": [
      "92",
      "accuracy",
      "précision"
    ],
    "answer": {
      "fr": "Le résultat annoncé est une précision de prédiction de 92 %. L’interface permet aussi de charger de nouveaux jeux de données, de visualiser les prévisions et d’effectuer des scénarios What-If. La limite documentée est que le modèle dépend du climat représenté dans les données d’entraînement et doit être réentraîné pour d’autres zones.",
      "en": "The reported result is 92% prediction accuracy. The interface also allows users to upload new datasets, visualize forecasts, and run What-If scenarios. A documented limitation is that the model depends on the climate represented in the training data and requires retraining for other regions."
    },
    "sources": [
      {
        "label": {
          "fr": "Prédiction énergétique par IA",
          "en": "AI Energy Prediction"
        },
        "url": "ai-prediction.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.python",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "expérience python",
        "compétences python",
        "projets python"
      ],
      "en": [
        "python experience",
        "python skills",
        "python projects"
      ]
    },
    "keywords": [
      "python"
    ],
    "answer": {
      "fr": "Ibrahim utilise Python à un niveau avancé pour l’analyse de données, le développement web Streamlit, la modélisation physique, l’optimisation et le Machine Learning. Les preuves principales sont IBWatts, HydroTwin et le système de prédiction énergétique.",
      "en": "Ibrahim uses Python at an advanced level for data analysis, Streamlit web development, physical modeling, optimization, and machine learning. The strongest evidence comes from IBWatts, HydroTwin, and the energy-prediction system."
    },
    "sources": [
      {
        "label": {
          "fr": "IBWatts — Outil solaire technico-économique",
          "en": "IBWatts — Solar Techno-Economic Tool"
        },
        "url": "ibwatts.html"
      },
      {
        "label": {
          "fr": "HydroTwin — Power-to-X",
          "en": "HydroTwin — Power-to-X"
        },
        "url": "hydrotwin.html"
      },
      {
        "label": {
          "fr": "Prédiction énergétique par IA",
          "en": "AI Energy Prediction"
        },
        "url": "ai-prediction.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.powerfactory",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "expérience powerfactory",
        "maîtrise powerfactory",
        "projets powerfactory",
        "digsilent"
      ],
      "en": [
        "powerfactory experience",
        "powerfactory skills",
        "projects using powerfactory",
        "digsilent"
      ]
    },
    "keywords": [
      "powerfactory",
      "digsilent"
    ],
    "answer": {
      "fr": "Ibrahim utilise DIgSILENT PowerFactory pour la simulation de réseaux, les études RMS, la validation dynamique et l’intégration de systèmes solaires au réseau. Dans le portfolio public, cette compétence est principalement associée aux études PV+BESS de Dakhla réalisées dans le cadre de son expérience chez Novec.",
      "en": "Ibrahim uses DIgSILENT PowerFactory for grid simulation, RMS studies, dynamic validation, and solar-system grid integration. In the public portfolio, this skill is primarily associated with the Dakhla PV+BESS studies completed during his Novec experience."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.pvsyst",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "expérience pvsyst",
        "maîtrise pvsyst",
        "projets pvsyst"
      ],
      "en": [
        "pvsyst experience",
        "pvsyst skills",
        "projects using pvsyst"
      ]
    },
    "keywords": [
      "pvsyst"
    ],
    "answer": {
      "fr": "Ibrahim utilise PVSyst pour estimer le productible photovoltaïque, analyser les pertes et appuyer le dimensionnement de centrales solaires. PVSyst intervient notamment dans les études PV+BESS de Dakhla et dans l’étude de la centrale PV 67 MW.",
      "en": "Ibrahim uses PVSyst to estimate PV yield, analyze losses, and support solar-plant sizing. PVSyst is used notably in the Dakhla PV+BESS studies and the 67 MW PV-plant study."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      },
      {
        "label": {
          "fr": "Centrale PV 67 MW + BESS",
          "en": "67 MW PV+BESS Plant"
        },
        "url": "solar-bess-67mw.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.homer",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "expérience homer pro",
        "maîtrise homer",
        "projets homer"
      ],
      "en": [
        "homer pro experience",
        "homer skills",
        "projects using homer"
      ]
    },
    "keywords": [
      "homer"
    ],
    "answer": {
      "fr": "Ibrahim utilise HOMER Pro pour le dimensionnement et l’évaluation technico-économique de systèmes hybrides et de micro-réseaux. L’outil est associé aux études PV+BESS de Dakhla et à un audit énergétique hybride d’hôpital.",
      "en": "Ibrahim uses HOMER Pro for sizing and techno-economic assessment of hybrid systems and microgrids. It is associated with the Dakhla PV+BESS studies and a hybrid hospital energy-audit project."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      },
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.caneco",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "expérience caneco",
        "maîtrise caneco bt",
        "caneco"
      ],
      "en": [
        "caneco experience",
        "caneco bt skills",
        "caneco"
      ]
    },
    "keywords": [
      "caneco"
    ],
    "answer": {
      "fr": "Ibrahim utilise Caneco BT pour le dimensionnement des câbles, la vérification des chutes de tension et l’appui à la sélection des protections dans les études électriques basse tension. Cette compétence est démontrée dans les projets PV+BESS étudiés chez Novec.",
      "en": "Ibrahim uses Caneco BT for cable sizing, voltage-drop checks, and support for protection selection in low-voltage electrical studies. This skill is demonstrated in the PV+BESS projects studied at Novec."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.matlab",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "expérience matlab simulink",
        "maîtrise simulink",
        "projets matlab"
      ],
      "en": [
        "matlab simulink experience",
        "simulink skills",
        "matlab projects"
      ]
    },
    "keywords": [
      "matlab",
      "simulink"
    ],
    "answer": {
      "fr": "Ibrahim utilise MATLAB/Simulink pour modéliser des systèmes dynamiques et développer des logiques de contrôle EMS/BMS. L’exemple principal est la centrale PV 67 MW + BESS, où le modèle simule le contrôle en temps réel et la stabilité du réseau.",
      "en": "Ibrahim uses MATLAB/Simulink to model dynamic systems and develop EMS/BMS control logic. The main example is the 67 MW PV+BESS plant, where the model simulates real-time control and grid stability."
    },
    "sources": [
      {
        "label": {
          "fr": "Centrale PV 67 MW + BESS",
          "en": "67 MW PV+BESS Plant"
        },
        "url": "solar-bess-67mw.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.bess",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "expérience bess",
        "stockage batterie",
        "battery storage experience"
      ],
      "en": [
        "bess experience",
        "battery storage experience",
        "energy storage skills"
      ]
    },
    "keywords": [
      "bess",
      "battery",
      "batterie"
    ],
    "answer": {
      "fr": "L’expérience BESS d’Ibrahim couvre le dimensionnement et l’intégration de stockage dans les centrales PV+BESS de Dakhla, ainsi que la modélisation des logiques EMS/BMS pour une centrale PV de 67 MW. Cette expérience relie dimensionnement, gestion énergétique, simulation dynamique et analyse technico-économique.",
      "en": "Ibrahim’s BESS experience covers storage sizing and integration in the Dakhla PV+BESS plants, together with EMS/BMS logic modeling for a 67 MW PV plant. This experience connects sizing, energy management, dynamic simulation, and techno-economic analysis."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      },
      {
        "label": {
          "fr": "Centrale PV 67 MW + BESS",
          "en": "67 MW PV+BESS Plant"
        },
        "url": "solar-bess-67mw.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.ems",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "expérience ems",
        "développement ems",
        "gestion énergie"
      ],
      "en": [
        "ems experience",
        "ems development",
        "energy management system"
      ]
    },
    "keywords": [
      "ems",
      "energy management"
    ],
    "answer": {
      "fr": "Ibrahim a conçu et modélisé une architecture EMS/BMS pour une centrale PV de 67 MW couplée à un BESS. Sous MATLAB/Simulink, la logique représente le contrôle en temps réel, la coordination énergétique et les conditions nécessaires à la stabilité du réseau.",
      "en": "Ibrahim designed and modeled an EMS/BMS architecture for a 67 MW PV plant coupled with BESS. In MATLAB/Simulink, the logic represents real-time control, energy coordination, and conditions required for grid stability."
    },
    "sources": [
      {
        "label": {
          "fr": "Centrale PV 67 MW + BESS",
          "en": "67 MW PV+BESS Plant"
        },
        "url": "solar-bess-67mw.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.electrical",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "conception électrique",
        "schéma unifilaire",
        "dimensionnement câbles",
        "protections électriques"
      ],
      "en": [
        "electrical design",
        "single line diagram",
        "cable sizing",
        "electrical protection"
      ]
    },
    "keywords": [
      "sld",
      "cable",
      "câble",
      "electrical",
      "électrique"
    ],
    "answer": {
      "fr": "Ses compétences en conception électrique comprennent les schémas unifilaires, le dimensionnement de câbles, l’analyse des chutes de tension, la sélection des protections et l’intégration réseau. Elles sont principalement démontrées dans les études de centrales PV+BESS réalisées chez Novec.",
      "en": "His electrical-design skills include single-line diagrams, cable sizing, voltage-drop analysis, protection selection, and grid integration. They are mainly demonstrated through PV+BESS plant studies completed at Novec."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.thermal",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "compétences thermiques",
        "ingénierie thermique",
        "thermodynamique"
      ],
      "en": [
        "thermal engineering skills",
        "thermal experience",
        "thermodynamics"
      ]
    },
    "keywords": [
      "thermal",
      "thermique",
      "thermodynamique"
    ],
    "answer": {
      "fr": "La compétence thermique d’Ibrahim couvre thermodynamique, transferts thermiques, efficacité énergétique, simulation du bâtiment et optimisation de l’enveloppe. Elle est démontrée dans la maison bioclimatique, l’expérience Noor I CSP et l’audit de processus chez Menara Holding.",
      "en": "Ibrahim’s thermal-engineering background covers thermodynamics, heat transfer, energy efficiency, building simulation, and envelope optimization. It is demonstrated through the Smart House, Noor I CSP experience, and process audit at Menara Holding."
    },
    "sources": [
      {
        "label": {
          "fr": "Maison bioclimatique intelligente",
          "en": "Smart Bioclimatic House"
        },
        "url": "smart_house.html"
      },
      {
        "label": {
          "fr": "Profil professionnel",
          "en": "Professional profile"
        },
        "url": "index.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.iot",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "expérience iot",
        "arduino esp32",
        "automatisme iot"
      ],
      "en": [
        "iot experience",
        "arduino esp32",
        "iot automation"
      ]
    },
    "keywords": [
      "iot",
      "arduino",
      "esp32"
    ],
    "answer": {
      "fr": "Ibrahim a développé un prototype IoT pour la maison intelligente avec Arduino R4, capteurs DHT22/LDR/PIR, communication Wi-Fi, dashboard cloud et régulation PID de l’HVAC. Sa formation inclut également les plateformes ESP32 et l’électronique embarquée.",
      "en": "Ibrahim developed an IoT prototype for the Smart House using Arduino R4, DHT22/LDR/PIR sensors, Wi-Fi communication, a cloud dashboard, and PID HVAC control. His background also includes ESP32 platforms and embedded electronics."
    },
    "sources": [
      {
        "label": {
          "fr": "Maison bioclimatique intelligente",
          "en": "Smart Bioclimatic House"
        },
        "url": "smart_house.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.ml",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "expérience machine learning",
        "compétences ia",
        "modèles prédiction"
      ],
      "en": [
        "machine learning experience",
        "ai skills",
        "prediction models"
      ]
    },
    "keywords": [
      "machine learning",
      "scikit",
      "random forest"
    ],
    "answer": {
      "fr": "Ibrahim utilise Scikit-Learn pour préparer les données, entraîner et évaluer des modèles de régression tels que Random Forest et Gradient Boosting. Son projet de prédiction énergétique atteint une précision annoncée de 92 % et propose une interface Streamlit pour les scénarios What-If.",
      "en": "Ibrahim uses Scikit-Learn to prepare data and train and evaluate regression models including Random Forest and Gradient Boosting. His energy-prediction project reports 92% accuracy and provides a Streamlit interface for What-If scenarios."
    },
    "sources": [
      {
        "label": {
          "fr": "Prédiction énergétique par IA",
          "en": "AI Energy Prediction"
        },
        "url": "ai-prediction.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.financial",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "analyse financière",
        "étude technico-économique",
        "roi van tri amortissement"
      ],
      "en": [
        "financial analysis",
        "techno-economic analysis",
        "roi npv irr payback"
      ]
    },
    "keywords": [
      "roi",
      "van",
      "npv",
      "irr",
      "tri",
      "finance"
    ],
    "answer": {
      "fr": "Ibrahim applique l’analyse technico-économique au dimensionnement énergétique et au développement logiciel. IBWatts modélise prêts verts, flux de trésorerie, ROI, VAN, TRI et amortissement, tandis que HydroTwin calcule le LCOH et que les projets PV+BESS intègrent des critères de faisabilité et de rentabilité.",
      "en": "Ibrahim applies techno-economic analysis to energy sizing and software development. IBWatts models green loans, cash flows, ROI, NPV, IRR, and payback; HydroTwin calculates LCOH; and PV+BESS studies include feasibility and profitability criteria."
    },
    "sources": [
      {
        "label": {
          "fr": "IBWatts — Outil solaire technico-économique",
          "en": "IBWatts — Solar Techno-Economic Tool"
        },
        "url": "ibwatts.html"
      },
      {
        "label": {
          "fr": "HydroTwin — Power-to-X",
          "en": "HydroTwin — Power-to-X"
        },
        "url": "hydrotwin.html"
      },
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "skill.optimization",
    "category": "skill",
    "priority": 118,
        "phrases": {
      "fr": [
        "compétences optimisation",
        "algorithmes génétiques",
        "nsga ii"
      ],
      "en": [
        "optimization skills",
        "genetic algorithms",
        "nsga ii"
      ]
    },
    "keywords": [
      "optimization",
      "optimisation",
      "nsga"
    ],
    "answer": {
      "fr": "Ses compétences en optimisation sont démontrées par HydroTwin, où un algorithme multiobjectif recherche le meilleur compromis entre champ PV, électrolyseur, stockage et LCOH. Elles apparaissent aussi dans le dimensionnement technico-économique des systèmes énergétiques.",
      "en": "His optimization skills are demonstrated by HydroTwin, where a multi-objective algorithm searches for the best trade-off among PV field, electrolyzer, storage, and LCOH. Optimization also appears in techno-economic sizing of energy systems."
    },
    "sources": [
      {
        "label": {
          "fr": "HydroTwin — Power-to-X",
          "en": "HydroTwin — Power-to-X"
        },
        "url": "hydrotwin.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "compare.python",
    "category": "comparison",
    "priority": 100,
        "phrases": {
      "fr": [
        "quel projet démontre le mieux python",
        "meilleur projet python"
      ],
      "en": [
        "which project best demonstrates python",
        "best python project"
      ]
    },
    "keywords": [
      "best",
      "meilleur",
      "python"
    ],
    "answer": {
      "fr": "IBWatts est le projet le plus complet pour démontrer le développement Python full-stack, car il combine moteur de calcul, base de données, finance, interface et rapports. HydroTwin démontre davantage la modélisation physique et l’optimisation, tandis que le projet IA montre le traitement de données et le Machine Learning.",
      "en": "IBWatts is the most complete demonstration of full-stack Python development because it combines a calculation engine, database, finance, interface, and reports. HydroTwin demonstrates physical modeling and optimization, while the AI project demonstrates data processing and machine learning."
    },
    "sources": [
      {
        "label": {
          "fr": "IBWatts — Outil solaire technico-économique",
          "en": "IBWatts — Solar Techno-Economic Tool"
        },
        "url": "ibwatts.html"
      },
      {
        "label": {
          "fr": "HydroTwin — Power-to-X",
          "en": "HydroTwin — Power-to-X"
        },
        "url": "hydrotwin.html"
      },
      {
        "label": {
          "fr": "Prédiction énergétique par IA",
          "en": "AI Energy Prediction"
        },
        "url": "ai-prediction.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "compare.power",
    "category": "comparison",
    "priority": 100,
        "phrases": {
      "fr": [
        "projet le plus pertinent systèmes électriques",
        "meilleur projet power systems"
      ],
      "en": [
        "most relevant project for power systems",
        "best power systems project"
      ]
    },
    "keywords": [
      "power systems",
      "systèmes électriques"
    ],
    "answer": {
      "fr": "Pour les systèmes électriques, les études PV+BESS de Dakhla sont les plus directement pertinentes grâce à la conception électrique, aux SLD, au dimensionnement de câbles, aux protections et aux simulations PowerFactory. Le projet 67 MW complète ce profil avec la modélisation EMS/BMS et l’intégration réseau.",
      "en": "For power systems, the Dakhla PV+BESS studies are the most directly relevant because of electrical design, SLDs, cable sizing, protection, and PowerFactory simulations. The 67 MW project complements this with EMS/BMS modeling and grid integration."
    },
    "sources": [
      {
        "label": {
          "fr": "Micro-réseaux PV+BESS — Dakhla",
          "en": "Dakhla PV+BESS Microgrids"
        },
        "url": "solar-project.html"
      },
      {
        "label": {
          "fr": "Centrale PV 67 MW + BESS",
          "en": "67 MW PV+BESS Plant"
        },
        "url": "solar-bess-67mw.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "compare.ibwatts_hydrotwin",
    "category": "comparison",
    "priority": 102,
        "phrases": {
      "fr": [
        "différence ibwatts hydrotwin",
        "comparer ibwatts et hydrotwin"
      ],
      "en": [
        "difference between ibwatts and hydrotwin",
        "compare ibwatts and hydrotwin"
      ]
    },
    "keywords": [
      "ibwatts",
      "hydrotwin",
      "difference",
      "différence"
    ],
    "answer": {
      "fr": "IBWatts est un outil applicatif orienté dimensionnement solaire et décision financière pour le marché marocain. HydroTwin est un jumeau numérique scientifique centré sur la chaîne hydrogène Power-to-X, la modélisation physique et l’optimisation du LCOH. Les deux utilisent Python, mais répondent à des objectifs différents.",
      "en": "IBWatts is an application-oriented tool for solar sizing and financial decision support in the Moroccan market. HydroTwin is a scientific digital twin focused on the hydrogen Power-to-X chain, physical modeling, and LCOH optimization. Both use Python but address different objectives."
    },
    "sources": [
      {
        "label": {
          "fr": "IBWatts — Outil solaire technico-économique",
          "en": "IBWatts — Solar Techno-Economic Tool"
        },
        "url": "ibwatts.html"
      },
      {
        "label": {
          "fr": "HydroTwin — Power-to-X",
          "en": "HydroTwin — Power-to-X"
        },
        "url": "hydrotwin.html"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  },
  {
    "id": "conversation.availability",
    "category": "recruitment",
    "priority": 85,
        "phrases": {
      "fr": [
        "est-il disponible",
        "disponibilité emploi",
        "peut-il commencer"
      ],
      "en": [
        "is he available",
        "job availability",
        "when can he start"
      ]
    },
    "keywords": [
      "available",
      "disponible"
    ],
    "answer": {
      "fr": "Le portfolio public ne précise pas une date exacte de disponibilité. Pour obtenir une réponse à jour ou proposer un entretien, le mieux est de contacter Ibrahim directement.",
      "en": "The public portfolio does not specify an exact availability date. For an up-to-date answer or to propose an interview, the best option is to contact Ibrahim directly."
    },
    "sources": [
      {
        "label": {
          "fr": "Contact",
          "en": "Contact"
        },
        "url": "index.html#contact"
      }
    ],
    "followups": {
      "fr": [],
      "en": []
    }
  }
] as CuratedTopic[];
