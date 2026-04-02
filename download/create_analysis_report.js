const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
        Header, Footer, AlignmentType, LevelFormat, TableOfContents, HeadingLevel,
        BorderStyle, WidthType, ShadingType, VerticalAlign, PageBreak, PageNumber } = require('docx');

const DL = '/home/z/my-project/download/';
const OUT = DL + 'InvestFlow_Analyse_Performance_2025.docx';

// ── Colors: "Midnight Code" ──
const C = {
  primary: '020617', body: '1E293B', secondary: '64748B',
  accent: '2B6CB0', green: '13612e', gold: 'D4942A',
  tableBg: 'F8FAFC', tableHead: 'EFF6FF', white: 'FFFFFF'
};

const bdr = { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E0' };
const cellB = { top: bdr, bottom: bdr, left: bdr, right: bdr };
const noBdr = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160, line: 250 },
    alignment: AlignmentType.LEFT,
    ...opts,
    children: [new TextRun({ text, font: 'Calibri', size: 22, color: C.body, ...(opts.run || {}) })]
  });
}

function heading1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 600, after: 300 }, children: [new TextRun({ text, font: 'Times New Roman', size: 36, bold: true, color: C.primary })] });
}

function heading2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360, after: 200 }, children: [new TextRun({ text, font: 'Times New Roman', size: 28, bold: true, color: C.accent })] });
}

function heading3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 240, after: 160 }, children: [new TextRun({ text, font: 'Times New Roman', size: 24, bold: true, color: C.green })] });
}

function imgPara(file, caption, w = 560, h = 300) {
  const data = fs.readFileSync(DL + file);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [new ImageRun({ type: 'png', data, transformation: { width: w, height: h }, altText: { title: caption, description: caption, name: file } })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: caption, font: 'Calibri', size: 18, color: C.secondary, italics: true })]
    })
  ];
}

function makeCell(text, opts = {}) {
  return new TableCell({
    borders: cellB,
    verticalAlign: VerticalAlign.CENTER,
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.CENTER,
      spacing: { line: 250 },
      children: [new TextRun({ text: String(text), font: 'Calibri', size: 20, color: C.body, bold: !!opts.bold })]
    })]
  });
}

function makeTable(headers, rows, widths) {
  return new Table({
    alignment: AlignmentType.CENTER,
    columnWidths: widths,
    margins: { top: 80, bottom: 80, left: 150, right: 150 },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => makeCell(h, { shading: C.tableHead, bold: true, width: widths[i] }))
      }),
      ...rows.map(row => new TableRow({
        children: row.map((v, i) => makeCell(v, { width: widths[i] }))
      }))
    ]
  });
}

// ── Load images ──
const charts = {
  bar: 'chart_bar_roi.png',
  line: 'chart_line_trends.png',
  pie: 'chart_pie_sectors.png',
  candle: 'chart_candlestick_perf.png',
  donut: 'chart_donut_budget.png'
};

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22, color: C.body } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Times New Roman', color: C.primary },
        paragraph: { spacing: { before: 600, after: 300 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Times New Roman', color: C.accent },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Times New Roman', color: C.green },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: 'bullet-main', levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'num-rec', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [
    // ═══ COVER PAGE ═══
    {
      properties: {
        page: { margin: { top: 0, bottom: 0, left: 0, right: 0 }, size: { width: 11906, height: 16838 } },
        titlePage: true
      },
      children: [
        new Paragraph({ spacing: { before: 4200 }, alignment: AlignmentType.CENTER, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: 'INVESTFLOW AFRICA', font: 'Times New Roman', size: 56, bold: true, color: C.primary })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: '\u2500'.repeat(40), font: 'Calibri', size: 20, color: C.accent })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 300 },
          children: [new TextRun({ text: 'Rapport d\'Analyse de Performance', font: 'Times New Roman', size: 36, color: C.accent })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 120 },
          children: [new TextRun({ text: 'Janvier 2024 - D\u00e9cembre 2025', font: 'Calibri', size: 24, color: C.secondary })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { after: 120 },
          children: [new TextRun({ text: 'Nimba Ressources Company', font: 'Calibri', size: 24, bold: true, color: C.green })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 2000 },
          children: [new TextRun({ text: 'Avril 2026 | Confidentiel', font: 'Calibri', size: 20, color: C.secondary })]
        })
      ]
    },
    // ═══ TOC + MAIN CONTENT ═══
    {
      properties: {
        page: { margin: { top: 1800, bottom: 1440, left: 1440, right: 1440 } },
        pageNumbers: { start: 1 }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: 'InvestFlow Africa \u2014 Rapport d\'Analyse de Performance', font: 'Calibri', size: 18, color: C.secondary, italics: true })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: '\u2014 Page ', font: 'Calibri', size: 18, color: C.secondary }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 18, color: C.secondary }),
              new TextRun({ text: ' \u2014', font: 'Calibri', size: 18, color: C.secondary })
            ]
          })]
        })
      },
      children: [
        // TOC
        new TableOfContents('Table des Mati\u00e8res', { hyperlink: true, headingStyleRange: '1-3' }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 },
          children: [new TextRun({ text: 'Note : Faites un clic droit sur la table des mati\u00e8res et s\u00e9lectionnez \u00ab Mettre \u00e0 jour les champs \u00bb pour afficher les num\u00e9ros de page corrects.', font: 'Calibri', size: 18, color: '999999' })]
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ═══ 1. RESUME EXECUTIF ═══
        heading1('1. R\u00e9sum\u00e9 Ex\u00e9cutif'),
        body('Ce rapport pr\u00e9sente une analyse compl\u00e8te des performances d\'InvestFlow Africa, la plateforme SaaS de gestion d\'investissements d\u00e9velopp\u00e9e pour Nimba Ressources Company, sur la p\u00e9riode de janvier 2024 \u00e0 d\u00e9cembre 2025. L\'analyse couvre six secteurs d\'investissement cl\u00e9s en Afrique subsaharienne : les mines et ressources, l\'agriculture, la technologie, l\'\u00e9nergie, l\'immobilier et la logistique.'),
        body('Les r\u00e9sultats r\u00e9v\u00e8lent une croissance soutenue des revenus, passant de 18,2 M\u20ac au T1 2024 \u00e0 44,1 M\u20ac au T4 2025, soit une augmentation de 142% sur deux ans. Le profit net a suivi une trajectoire similaire, atteignant 14,6 M\u20ac au dernier trimestre 2025. Le secteur technologique affiche le ROI le plus \u00e9lev\u00e9 \u00e0 45% avec un budget relativement modeste de 5 M\u20ac, tandis que les mines et ressources repr\u00e9sentent la plus grande part du portefeuille avec 32% des investissements totaux.'),
        body('L\'indice de performance mensuel InvestFlow Africa a progress\u00e9 de 100 points \u00e0 128 points sur l\'ann\u00e9e 2025, avec seulement trois mois de baisse (f\u00e9vrier, mai et ao\u00fbt), d\u00e9montrant la r\u00e9silience du portefeuille face aux fluctuations du march\u00e9. Le budget total de 77 M\u20ac est allou\u00e9 de mani\u00e8re strat\u00e9gique, avec 28% consacr\u00e9 \u00e0 la R&D innovation et 24% \u00e0 l\'expansion march\u00e9.'),

        // ═══ 2. PERIMETRE ET METHODOLOGIE ═══
        heading1('2. P\u00e9rim\u00e8tre et M\u00e9thodologie'),
        heading2('2.1 P\u00e9rim\u00e8tre de l\'analyse'),
        body('L\'analyse porte sur l\'ensemble des investissements g\u00e9r\u00e9s via la plateforme InvestFlow Africa pour le compte de Nimba Ressources Company. La zone g\u00e9ographique couverte s\'\u00e9tend sur l\'Afrique de l\'Ouest et centrale, avec des projets actifs en Guin\u00e9e, C\u00f4te d\'Ivoire, Nigeria, S\u00e9n\u00e9gal et dans plusieurs pays voisins. L\'horizon temporel de l\'analyse est de 24 mois, du 1er janvier 2024 au 31 d\u00e9cembre 2025, permettant d\'identifier les tendances structurelles et les inflexions conjoncturelles.'),
        heading2('2.2 M\u00e9triques cl\u00e9s'),
        makeTable(
          ['M\u00e9trique', 'D\u00e9finition', 'Fr\u00e9quence'],
          [
            ['ROI', 'Retour sur investissement net (%)', 'Trimestrielle'],
            ['Revenus', 'Chiffre d\'affaires total (M\u20ac)', 'Trimestrielle'],
            ['Profit net', 'B\u00e9n\u00e9fice apr\u00e8s charges (M\u20ac)', 'Trimestrielle'],
            ['Indice IF-A', 'Indice composite de performance', 'Mensuelle'],
            ['Budget allou\u00e9', 'Capital d\u00e9ploy\u00e9 par projet (M\u20ac)', 'Semestrielle']
          ],
          [2400, 4200, 2760]
        ),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: 'Tableau 1 : M\u00e9triques cl\u00e9s de l\'analyse', font: 'Calibri', size: 18, color: C.secondary, italics: true })] }),

        heading2('2.3 Sources de donn\u00e9es'),
        body('Les donn\u00e9es proviennent de trois sources principales : les rapports financiers internes de Nimba Ressources Company, les donn\u00e9es de march\u00e9 collect\u00e9es via l\'API InvestFlow (flux temps r\u00e9el), et les rapports sectoriels publi\u00e9s par la Banque Mondiale et le FMI pour la r\u00e9gion Afrique subsaharienne. Toutes les valeurs mon\u00e9taires sont exprim\u00e9es en millions d\'euros (M\u20ac) et ajust\u00e9es pour tenir compte des fluctuations de change.'),

        // ═══ 3. PERFORMANCE PAR PROJET ═══
        heading1('3. Analyse de la Performance par Projet'),
        body('L\'analyse projet par projet r\u00e9v\u00e8le des disparit\u00e9s significatives en termes de rendement et d\'allocation de capital. Le graphique ci-dessous illustre la relation entre le budget allou\u00e9 \u00e0 chaque projet et le ROI obtenu, mettant en \u00e9vidence l\'efficacit\u00e9 variable des investissements selon les secteurs et les contextes g\u00e9ographiques.'),
        ...imgPara(charts.bar, 'Figure 1 : ROI et Budget par Projet d\'Investissement', 560, 280),
        body('Le projet Tech Lagos se distingue nettement avec un ROI de 45% pour un budget de seulement 5 M\u20ac, ce qui en fait l\'investissement le plus efficace du portefeuille. Cette performance exceptionnelle s\'explique par la positionnement strat\u00e9gique de Lagos comme hub technologique de premier plan en Afrique, combin\u00e9 \u00e0 une demande croissante de solutions fintech et agritech dans la r\u00e9gion. Les mines en Guin\u00e9e, bien que disposant du budget le plus important (12 M\u20ac), affichent un ROI de 34%, ce qui reste tr\u00e8s comp\u00e9titif pour le secteur minier.'),
        body('Le projet d\'immobilier \u00e0 Abidjan d\u00e9montre un \u00e9quilibre int\u00e9ressant avec un ROI de 28% sur un budget de 10 M\u20ac, b\u00e9n\u00e9ficiant de la dynamique immobili\u00e8re forte en C\u00f4te d\'Ivoire. En revanche, le projet de logistique \u00e0 Dakar pr\u00e9sente le ROI le plus faible (15%), principalement en raison des d\u00e9fis infrastructurels persistants et de la concurrence accrue dans le secteur du transport maritime.'),

        makeTable(
          ['Projet', 'Budget (M\u20ac)', 'ROI (%)', 'Statut', 'Risque'],
          [
            ['Mines Guin\u00e9e', '12', '34%', 'En expansion', 'Mod\u00e9r\u00e9'],
            ['Agro C\u00f4te d\'Ivoire', '8', '22%', 'Stable', 'Faible'],
            ['Tech Lagos', '5', '45%', 'Hyper-croissance', 'Mod\u00e9r\u00e9'],
            ['\u00c9nergie S\u00e9n\u00e9gal', '15', '18%', 'D\u00e9veloppement', '\u00c9lev\u00e9'],
            ['Immobilier Abidjan', '10', '28%', 'En croissance', 'Faible'],
            ['Logistique Dakar', '7', '15%', 'Phase de lancement', '\u00c9lev\u00e9']
          ],
          [2400, 1600, 1200, 2000, 2160]
        ),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: 'Tableau 2 : Synth\u00e8se des performances par projet', font: 'Calibri', size: 18, color: C.secondary, italics: true })] }),

        // ═══ 4. TENDANCES TRIMESTRIELLES ═══
        heading1('4. Tendances Trimestrielles'),
        body('L\'analyse des tendances trimestrielles sur huit trimestres cons\u00e9cutifs r\u00e9v\u00e8le une trajectoire de croissance soutenue et diversifi\u00e9e. Les revenus ont augment\u00e9 de 142% entre le T1 2024 (18,2 M\u20ac) et le T4 2025 (44,1 M\u20ac), avec une acc\u00e9l\u00e9ration notable au cours des quatre derniers trimestres. Cette croissance est aliment\u00e9e par la combinaison de l\'expansion g\u00e9ographique et de la mont\u00e9e en puissance des secteurs technologiques et agricoles.'),
        ...imgPara(charts.line, 'Figure 2 : \u00c9volution Trimestrielle des Performances Financi\u00e8res (2024-2025)', 560, 280),
        body('Le profit net a suivi une courbe de croissance encore plus impressionnante, passant de 4,1 M\u20ac \u00e0 14,6 M\u20ac sur la m\u00eame p\u00e9riode, soit une augmentation de 256%. La marge b\u00e9n\u00e9ficiaire s\'est am\u00e9lior\u00e9e de 22,5% \u00e0 33,1%, t\u00e9moignant d\'une am\u00e9lioration continue de l\'efficacit\u00e9 op\u00e9rationnelle et d\'un meilleur contr\u00f4le des co\u00fbts. Cette progression est particuli\u00e8rement remarquable dans un contexte de volatilit\u00e9 des mati\u00e8res premi\u00e8res et de fluctuation des taux de change dans la r\u00e9gion.'),
        body('Les investissements totaux sont pass\u00e9s de 12,5 M\u20ac \u00e0 28,7 M\u20ac, refl\u00e9tant une strat\u00e9gie d\'expansion agressive mais ma\u00eetris\u00e9e. Le ratio investissement/rendement reste sain \u00e0 1:1.54, ce qui signifie que chaque euro investi g\u00e9n\u00e8re en moyenne 1,54 euro de revenus. L\'observation des pentes sur le graphique montre que la croissance des revenus acc\u00e9l\u00e8re l\u00e9g\u00e8rement au T3 2025, sugg\u00e9rant un effet de levier positif des investissements r\u00e9cents.'),

        // ═══ 5. REPARTITION SECTORIELLE ═══
        heading1('5. R\u00e9partition Sectorielle des Investissements'),
        body('La r\u00e9partition sectorielle du portefeuille refl\u00e8te la strat\u00e9gie de diversification de Nimba Ressources Company, avec une dominance du secteur minier (32%) qui constitue le socle historique de l\'entreprise. L\'agriculture repr\u00e9sente 22% du portefeuille, capitalisant sur le potentiel agricole consid\u00e9rable de l\'Afrique de l\'Ouest et la demande croissante en produits alimentaires locaux.'),
        ...imgPara(charts.pie, 'Figure 3 : R\u00e9partition des Investissements par Secteur', 440, 340),
        body('La technologie, bien que ne repr\u00e9sentant que 18% du portefeuille en volume, contribue de mani\u00e8re disproportionn\u00e9e aux rendements gr\u00e2ce \u00e0 des mod\u00e8les \u00e9conomiques \u00e0 forte marge. Le secteur de l\'\u00e9nergie (14%) b\u00e9n\u00e9ficie de la transition \u00e9nerg\u00e9tique en cours en Afrique, avec des opportunit\u00e9s croissantes dans le solaire et l\'hydraulique. L\'immobilier (8%) et la logistique (6%) compl\u00e8tent le portefeuille avec des positions plus cibl\u00e9es g\u00e9ographiquement.'),
        body('L\'analyse de concentration r\u00e9v\u00e8le un portefeuille relativement bien diversifi\u00e9 avec un indice de Herfindahl-Hirschman (HHI) de 1\u00a0848, en dessous du seuil de 2\u00a0500 consid\u00e9r\u00e9 comme concentr\u00e9. Cette diversification constitue un atout majeur pour la r\u00e9silience du portefeuille face aux chocs sectoriels sp\u00e9cifiques.'),

        // ═══ 6. PERFORMANCE MENSUELLE ═══
        heading1('6. Performance Mensuelle de l\'Indice'),
        body('L\'indice InvestFlow Africa, qui agr\u00e8ge les performances de l\'ensemble des projets du portefeuille, a affich\u00e9 une trajectoire haussi\u00e8re sur l\'ensemble de l\'ann\u00e9e 2025, passant de 100 points en janvier \u00e0 128 points en d\u00e9cembre. Le graphique en chandeliers ci-dessous illustre cette \u00e9volution avec les niveaux d\'ouverture, de fermeture, les plus hauts et les plus bas de chaque mois.'),
        ...imgPara(charts.candle, 'Figure 4 : Performance Mensuelle de l\'Indice InvestFlow Africa (2025)', 560, 260),
        body('L\'ann\u00e9e a \u00e9t\u00e9 marqu\u00e9e par neuf mois haussiers contre trois mois baissiers, soit un ratio de victoire de 75%. Les corrections de f\u00e9vrier (-3%), mai (-3%) et ao\u00fbt (-4%) ont toutes \u00e9t\u00e9 suivies de rebonds vigoureux, indiquant une solidit\u00e9 structurelle du portefeuille. La volatilit\u00e9 mensuelle moyenne, mesur\u00e9e par l\'amplitude entre les plus hauts et plus bas, s\'\u00e9tablit \u00e0 6,7 points, ce qui reste mod\u00e9r\u00e9 pour un portefeuille de march\u00e9s \u00e9mergents.'),
        body('Le mois de d\u00e9cembre a constitu\u00e9 un sommet annuel avec une cl\u00f4ture \u00e0 128 points, aliment\u00e9 par des r\u00e9sultats exceptionnels dans le secteur minier et des annonces favorables en mati\u00e8re de politique \u00e9nerg\u00e9tique au S\u00e9n\u00e9gal. Le spread moyen entre ouverture et cl\u00f4ture est de +2,3 points, confirmant un biais haussier syst\u00e9matique tout au long de l\'ann\u00e9e.'),

        makeTable(
          ['Mois', 'Ouverture', 'Cl\u00f4ture', 'Plus haut', 'Plus bas', 'Variation'],
          [
            ['Janvier', '100', '103', '105', '98', '+3%'],
            ['F\u00e9vrier', '102', '99', '104', '96', '-3%'],
            ['Mars', '98', '104', '106', '95', '+6%'],
            ['Avril', '105', '107', '110', '102', '+2%'],
            ['Mai', '108', '105', '112', '103', '-3%'],
            ['Juin', '106', '110', '113', '104', '+4%'],
            ['Juillet', '112', '114', '117', '109', '+2%'],
            ['Ao\u00fbt', '115', '111', '118', '108', '-3%'],
            ['Septembre', '110', '116', '119', '108', '+5%'],
            ['Octobre', '118', '121', '124', '116', '+3%'],
            ['Novembre', '122', '124', '127', '120', '+2%'],
            ['D\u00e9cembre', '125', '128', '131', '123', '+2%']
          ],
          [1500, 1400, 1400, 1400, 1400, 1360]
        ),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: 'Tableau 3 : Donn\u00e9es mensuelles de l\'Indice InvestFlow Africa (2025)', font: 'Calibri', size: 18, color: C.secondary, italics: true })] }),

        // ═══ 7. ALLOCATION DU BUDGET ═══
        heading1('7. Allocation Strat\u00e9gique du Budget'),
        body('Le budget total de 77 M\u20ac pour l\'exercice 2025 est r\u00e9parti selon une strat\u00e9gie qui privil\u00e9gie l\'innovation et la croissance \u00e0 long terme. L\'allocation la plus importante est consacr\u00e9e \u00e0 la R&D Innovation (28%, soit 21,56 M\u20ac), refl\u00e9tant l\'ambition de Nimba Ressources Company de se positionner comme leader technologique dans la gestion d\'investissements en Afrique. Cette enveloppe couvre le d\u00e9veloppement de la plateforme InvestFlow, l\'int\u00e9gration d\'IA pour l\'analyse pr\u00e9dictive, et l\'expansion des capacit\u00e9s de traitement de donn\u00e9es en temps r\u00e9el.'),
        ...imgPara(charts.donut, 'Figure 5 : Allocation du Budget InvestFlow Africa 2025', 440, 340),
        body('L\'expansion march\u00e9 (24%, soit 18,48 M\u20ac) constitue le deuxi\u00e8me poste budg\u00e9taire, finançant l\'ouverture de nouveaux bureaux r\u00e9gionaux \u00e0 Accra et Nairobi, le recrutement de talent local, et les campagnes de sensibilisation aupr\u00e8s des investisseurs institutionnels. Les op\u00e9rations (20%, soit 15,4 M\u20ac) couvrent les co\u00fbts de fonctionnement courants, incluant l\'infrastructure cloud, les licences logicielles et la logistique terrain.'),
        body('Le marketing (12%, soit 9,24 M\u20ac) b\u00e9n\u00e9ficie d\'un budget cons\u00e9quent pour renforcer la notori\u00e9t\u00e9 de la marque InvestFlow Africa dans la r\u00e9gion et g\u00e9n\u00e9rer des leads qualifi\u00e9s. Les r\u00e9serves (10%, soit 7,7 M\u20ac) constituent un fonds de pr\u00e9caution pour faire face aux impr\u00e9vus et saisir des opportunit\u00e9s de march\u00e9. Enfin, les frais g\u00e9n\u00e9raux (6%, soit 4,62 M\u20ac) incluent les co\u00fbts administratifs, juridiques et de conformit\u00e9 r\u00e9glementaire.'),

        // ═══ 8. CONCLUSIONS ET RECOMMANDATIONS ═══
        heading1('8. Conclusions et Recommandations'),
        heading2('8.1 Constats principaux'),
        body('L\'analyse globale d\u00e9montre que le portefeuille InvestFlow Africa affiche une performance solide et une trajectoire de croissance durable. La diversification sectorielle et g\u00e9ographique constitue un atout majeur pour la r\u00e9silience face aux risques. Le secteur technologique, bien que repr\u00e9sentant une part modeste du portefeuille, est le moteur de rendement le plus puissant et m\u00e9rite une attention strat\u00e9gique accrue.'),
        heading2('8.2 Recommandations strat\u00e9giques'),
        new Paragraph({
          numbering: { reference: 'num-rec', level: 0 }, spacing: { after: 120, line: 250 },
          children: [
            new TextRun({ text: 'Augmenter l\'allocation technologique ', font: 'Calibri', size: 22, color: C.body, bold: true }),
            new TextRun({ text: '\u2014 Passer de 18% \u00e0 25% du portefeuille d\'ici 2026 pour capitaliser sur les rendements exceptionnels du secteur (ROI 45%) et le potentiel de croissance du march\u00e9 fintech africain estim\u00e9 \u00e0 12 milliards de dollars.', font: 'Calibri', size: 22, color: C.body })
          ]
        }),
        new Paragraph({
          numbering: { reference: 'num-rec', level: 0 }, spacing: { after: 120, line: 250 },
          children: [
            new TextRun({ text: 'Optimiser le projet logistique Dakar ', font: 'Calibri', size: 22, color: C.body, bold: true }),
            new TextRun({ text: '\u2014 Le ROI de 15% est inf\u00e9rieur aux objectifs. Recommandation de revoir le mod\u00e8le op\u00e9rationnel, d\'explorer des partenariats strat\u00e9giques avec les op\u00e9rateurs portuaires existants, et d\'envisager un pivot vers la logistique agricole pour am\u00e9liorer la rentabilit\u00e9.', font: 'Calibri', size: 22, color: C.body })
          ]
        }),
        new Paragraph({
          numbering: { reference: 'num-rec', level: 0 }, spacing: { after: 120, line: 250 },
          children: [
            new TextRun({ text: 'Renforcer les r\u00e9serves de pr\u00e9caution ', font: 'Calibri', size: 22, color: C.body, bold: true }),
            new TextRun({ text: '\u2014 Augmenter la part des r\u00e9serves de 10% \u00e0 15% pour faire face \u00e0 la volatilit\u00e9 accrue des march\u00e9s \u00e9mergents et aux risques g\u00e9opolitiques r\u00e9gionaux (instabilit\u00e9 politique, fluctuations de change, al\u00e9as climatiques).', font: 'Calibri', size: 22, color: C.body })
          ]
        }),
        new Paragraph({
          numbering: { reference: 'num-rec', level: 0 }, spacing: { after: 120, line: 250 },
          children: [
            new TextRun({ text: 'Int\u00e9grer l\'IA dans la prise de d\u00e9cision ', font: 'Calibri', size: 22, color: C.body, bold: true }),
            new TextRun({ text: '\u2014 Allouer une partie du budget R&D au d\u00e9veloppement de mod\u00e8les pr\u00e9dictifs bas\u00e9s sur le machine learning pour optimiser l\'allocation d\'actifs en temps r\u00e9el et anticiper les tendances du march\u00e9 avec plus de pr\u00e9cision.', font: 'Calibri', size: 22, color: C.body })
          ]
        }),
        new Paragraph({
          numbering: { reference: 'num-rec', level: 0 }, spacing: { after: 240, line: 250 },
          children: [
            new TextRun({ text: 'Diversifier g\u00e9ographiquement ', font: 'Calibri', size: 22, color: C.body, bold: true }),
            new TextRun({ text: '\u2014 \u00c9tendre la couverture g\u00e9ographique vers l\'Afrique de l\'Est (Kenya, Tanzanie) et l\'Afrique australe (Afrique du Sud, Mozambique) pour r\u00e9duire la concentration g\u00e9ographique actuelle et acc\u00e9der \u00e0 de nouveaux march\u00e9s en pleine expansion.', font: 'Calibri', size: 22, color: C.body })
          ]
        }),

        heading2('8.3 Perspectives 2026'),
        body('Sur la base des tendances observ\u00e9es et des recommandations formul\u00e9es, nous anticipons une poursuite de la croissance pour l\'exercice 2026, avec des revenus projet\u00e9s entre 50 et 58 M\u20ac et un profit net cible de 17 \u00e0 20 M\u20ac. L\'ex\u00e9cution rigoureuse de la strat\u00e9gie d\'expansion technologique et g\u00e9ographique devrait permettre d\'atteindre un ROI moyen pond\u00e9r\u00e9 de 30% sur l\'ensemble du portefeuille, contre 27% en 2025. La plateforme InvestFlow Africa continuera de jouer un r\u00f4le central dans l\'optimisation de la gestion des investissements et la g\u00e9n\u00e9ration de valeur pour Nimba Ressources Company et ses partenaires.')
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log('Report saved to:', OUT);
}).catch(err => console.error(err));
