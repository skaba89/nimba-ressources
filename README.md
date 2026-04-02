# InvestFlow Africa - Plateforme SaaS de Pilotage d'Investissements

## 🚀 Lancement rapide avec Docker

### Prérequis
- [Docker](https://docs.docker.com/get-docker/) installé
- [Docker Compose](https://docs.docker.com/compose/install/) installé

### 1. Construire et lancer

```bash
docker compose up --build -d
```

L'application sera accessible sur : **http://localhost:3000**

### 2. Accéder au SaaS

Ouvrez votre navigateur à l'adresse : http://localhost:3000

### 3. Arrêter

```bash
docker compose down
```

### 4. Reconstruire après modification

```bash
docker compose up --build -d
```

---

## 💻 Développement local (sans Docker)

```bash
# Installer les dépendances
bun install

# Lancer le serveur de développement
bun run dev

# Accéder à http://localhost:3000
```

---

## 📂 Structure du Projet

```
investflow-africa/
├── Dockerfile              # Configuration Docker multi-stage
├── docker-compose.yml      # Docker Compose pour un lancement rapide
├── .dockerignore           # Fichiers exclus du build Docker
├── next.config.ts          # Configuration Next.js (standalone output)
├── package.json            # Dépendances et scripts
├── public/
│   ├── logo.png            # Logo InvestFlow Africa
│   └── charts/             # Graphiques d'analyse (10 PNG)
│       ├── bar_roi_par_projet.png
│       ├── line_tendances.png
│       ├── pie_revenus_secteur.png
│       ├── donut_budget_allocation.png
│       ├── candlestick_performance.png
│       ├── radar_multidimensional.png
│       ├── stacked_bar_cost_structure.png
│       ├── area_cumulative_roi.png
│       ├── funnel_investment_pipeline.png
│       └── waterfall_budget_revenue.png
├── src/app/
│   ├── layout.tsx          # Layout racine
│   ├── globals.css         # Styles globaux + Tailwind
│   └── page.tsx            # Page principale (13 sections)
└── download/               # Rapports et screenshots
    ├── InvestFlow_Africa_Rapport_Analyse_2026.docx
    ├── InvestFlow_Africa_Rapport_Complet_v2_2026.docx
    └── preview_*.png       # 9 screenshots des sections
```

---

## 🌐 Sections de la Plateforme

| # | Section | Description |
|---|---------|-------------|
| 1 | Hero | Page d'accueil avec headline, features et stats |
| 2 | Dashboard | 4 KPI + 5 graphiques financiers |
| 3 | Simulateur ROI | Calcul interactif de rentabilité |
| 4 | Projets | Portefeuille filtrable (8 projets, 6 pays) |
| 5 | Pipeline & Risk | Funnel + matrice de risques |
| 6 | Analytics | 4 graphiques avancés (Radar, Stacked, Area, Waterfall) |
| 7 | Témoignages | 3 témoignages investisseurs |
| 8 | Tarifs | 3 plans commerciaux |
| 9 | Contact | Formulaire de contact |
| 10 | Demo | Timeline de démonstration |
| 11 | Reporting | Tableau de performance investor |

---

## 📊 Données du Portefeuille

- **Budget Total** : 230 M€
- **Revenus Totaux** : 344,1 M€
- **ROI Moyen** : 47,9%
- **Projets Actifs** : 6/8
- **Pays Couverts** : 6 (Guinée, Sénégal, Nigeria, Côte d'Ivoire, RDC, Ghana, Kenya, Cameroun)
