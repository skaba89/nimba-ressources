#!/usr/bin/env python3
"""
InvestFlow Africa — Complete Chart Generation Script
Nimba Light Theme — 10 professional charts
All saved to /home/z/my-project/public/charts/
"""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
from matplotlib.patches import FancyBboxPatch
import os

# ────────────────────────────────────────────────────────
# NIMBA LIGHT THEME PALETTE
# ────────────────────────────────────────────────────────
PRIMARY_BLUE = '#2B6CB0'
GREEN = '#13612e'
GOLD = '#f5a524'
RED = '#b82105'

BG_FIG = '#ffffff'         # figure background
BG_AX = '#F7FAFC'          # axes background
TEXT_PRIMARY = '#1A202C'   # main text
TEXT_SECONDARY = '#4A5568' # secondary text
GRID_COLOR = '#E2E8F0'     # grid lines
BORDER_COLOR = '#CBD5E0'   # spine color

# Chart element colors (8 project colors)
COLORS = ['#2B6CB0', '#13612e', '#f5a524', '#3182CE', '#38A169', '#D69E2E', '#4299E1', '#48BB78']

# ────────────────────────────────────────────────────────
# GLOBAL RC SETTINGS
# ────────────────────────────────────────────────────────
plt.rcParams.update({
    'font.sans-serif': ['DejaVu Sans', 'Arial', 'Helvetica', 'sans-serif'],
    'axes.unicode_minus': False,
    'figure.dpi': 200,
    'savefig.dpi': 200,
})

# ────────────────────────────────────────────────────────
# PROJECT DATA
# ────────────────────────────────────────────────────────
projects = {
    'Nimba Iron Mine': {'sector': 'Mining', 'budget': 50, 'cost': 38, 'revenue': 89.5, 'roi': 79, 'status': 'Active', 'country': 'Guinée'},
    'Solar Plant Dakar': {'sector': 'Energy', 'budget': 20, 'cost': 16, 'revenue': 29.1, 'roi': 44, 'status': 'Active', 'country': 'Sénégal'},
    'Lagos Real Estate': {'sector': 'Real Estate', 'budget': 35, 'cost': 30, 'revenue': 52.5, 'roi': 50, 'status': 'Active', 'country': 'Nigeria'},
    'Abidjan Tech Hub': {'sector': 'Technology', 'budget': 15, 'cost': 12, 'revenue': 22.5, 'roi': 50, 'status': 'Completed', 'country': "Côte d'Ivoire"},
    'Kinshasa Agri-Business': {'sector': 'Agriculture', 'budget': 25, 'cost': 20, 'revenue': 32.5, 'roi': 30, 'status': 'Active', 'country': 'RDC'},
    'Accra Fintech': {'sector': 'Technology', 'budget': 10, 'cost': 8, 'revenue': 16.0, 'roi': 60, 'status': 'Active', 'country': 'Ghana'},
    'Nairobi Logistics': {'sector': 'Logistics', 'budget': 30, 'cost': 24, 'revenue': 39.0, 'roi': 30, 'status': 'Pending', 'country': 'Kenya'},
    'Douala Port Extension': {'sector': 'Logistics', 'budget': 45, 'cost': 36, 'revenue': 63.0, 'roi': 40, 'status': 'Active', 'country': 'Cameroun'},
}

names = list(projects.keys())
budgets = [projects[n]['budget'] for n in names]
costs = [projects[n]['cost'] for n in names]
revenues = [projects[n]['revenue'] for n in names]
rois = [projects[n]['roi'] for n in names]
sectors = [projects[n]['sector'] for n in names]

OUTPUT_DIR = '/home/z/my-project/public/charts'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ────────────────────────────────────────────────────────
# STYLE HELPER
# ────────────────────────────────────────────────────────
def style_ax(ax, title, subtitle=None):
    """Apply Nimba light theme to an axes."""
    ax.set_facecolor(BG_AX)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(BORDER_COLOR)
    ax.spines['bottom'].set_color(BORDER_COLOR)
    ax.tick_params(colors=TEXT_SECONDARY, labelsize=10)
    ax.yaxis.label.set_color(TEXT_SECONDARY)
    ax.xaxis.label.set_color(TEXT_SECONDARY)

    if subtitle:
        ax.set_title(f'{title}\n{subtitle}', fontsize=15, fontweight='bold',
                      color=TEXT_PRIMARY, pad=16, loc='left', linespacing=1.5)
    else:
        ax.set_title(title, fontsize=15, fontweight='bold',
                      color=TEXT_PRIMARY, pad=16, loc='left')

    ax.grid(axis='y', color=GRID_COLOR, alpha=0.7, linestyle='--', linewidth=0.8)


def style_fig(fig):
    """Apply white background to figure."""
    fig.patch.set_facecolor(BG_FIG)


def save_chart(fig, filename):
    """Save chart with tight bounding box."""
    filepath = os.path.join(OUTPUT_DIR, filename)
    fig.savefig(filepath, dpi=200, bbox_inches='tight', facecolor=BG_FIG,
                edgecolor='none', pad_inches=0.3)
    plt.close(fig)
    print(f"  ✓ {filename}")


# ════════════════════════════════════════════════════════
#  1. BAR CHART — ROI par projet (horizontal)
# ════════════════════════════════════════════════════════
def chart_bar_roi():
    # Sort by ROI descending
    sorted_data = sorted(zip(names, rois, COLORS), key=lambda x: x[1], reverse=True)
    s_names, s_rois, s_colors = zip(*sorted_data)

    fig, ax = plt.subplots(figsize=(12, 7))
    style_fig(fig)
    style_ax(ax, 'ROI par Projet', 'Rendement sur investissement par projet (%)')

    bars = ax.barh(s_names, s_rois, color=s_colors, height=0.6, edgecolor='none', alpha=0.9)

    # Value labels
    for bar, roi in zip(bars, s_rois):
        ax.text(bar.get_width() + 1.5, bar.get_y() + bar.get_height() / 2,
                f'{roi}%', va='center', ha='left', color=TEXT_PRIMARY,
                fontweight='bold', fontsize=11)

    ax.set_xlabel('ROI (%)', fontsize=12, color=TEXT_SECONDARY)
    ax.set_xlim(0, max(s_rois) + 15)
    ax.invert_yaxis()

    save_chart(fig, 'bar_roi_par_projet.png')


# ════════════════════════════════════════════════════════
#  2. LINE CHART — Tendances mensuelles
# ════════════════════════════════════════════════════════
def chart_line_tendances():
    months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    rev_trend = [12, 18, 25, 32, 38, 45, 52, 58, 67, 75, 82, 95]
    budget_trend = [8, 15, 22, 30, 35, 42, 50, 55, 60, 68, 73, 85]
    cost_trend = [6, 12, 18, 24, 28, 34, 40, 44, 48, 54, 58, 68]

    fig, ax = plt.subplots(figsize=(14, 7))
    style_fig(fig)
    style_ax(ax, 'Tendances Mensuelles', 'Budget, Coûts & Revenus sur 12 mois (M€)')

    ax.plot(months, rev_trend, color=PRIMARY_BLUE, linewidth=2.8, marker='o', markersize=7,
            label='Revenus (M€)', zorder=5)
    ax.plot(months, budget_trend, color=GOLD, linewidth=2.8, marker='s', markersize=7,
            label='Budget (M€)', zorder=4)
    ax.plot(months, cost_trend, color=RED, linewidth=2.8, marker='^', markersize=7,
            label='Coûts (M€)', zorder=3)

    # Subtle fill between revenue and cost
    ax.fill_between(months, rev_trend, cost_trend, alpha=0.08, color=GREEN)

    ax.legend(fontsize=11, facecolor='white', edgecolor=GRID_COLOR,
              labelcolor=TEXT_PRIMARY, loc='upper left', framealpha=0.95)
    ax.set_ylabel('Montant (M€)', fontsize=12, color=TEXT_SECONDARY)

    save_chart(fig, 'line_tendances.png')


# ════════════════════════════════════════════════════════
#  3. PIE CHART — Revenus par secteur
# ════════════════════════════════════════════════════════
def chart_pie_revenus():
    sector_rev = {}
    for n in names:
        s = projects[n]['sector']
        sector_rev[s] = sector_rev.get(s, 0) + projects[n]['revenue']

    # Sort descending
    sector_rev = dict(sorted(sector_rev.items(), key=lambda x: x[1], reverse=True))
    labels = list(sector_rev.keys())
    values = list(sector_rev.values())

    fig, ax = plt.subplots(figsize=(10, 8))
    style_fig(fig)
    style_ax(ax, 'Répartition des Revenus par Secteur')
    ax.set_facecolor('none')
    ax.grid(False)

    wedges, texts, autotexts = ax.pie(
        values, labels=None, autopct='%1.1f%%',
        colors=COLORS[:len(values)], startangle=140,
        pctdistance=0.78,
        wedgeprops=dict(width=0.55, edgecolor='white', linewidth=2.5)
    )

    for t in autotexts:
        t.set_color('white')
        t.set_fontweight('bold')
        t.set_fontsize(11)

    # Legend
    legend_labels = [f'{l} — {v:.1f} M€' for l, v in zip(labels, values)]
    ax.legend(wedges, legend_labels, fontsize=11, facecolor='white', edgecolor=GRID_COLOR,
              labelcolor=TEXT_PRIMARY, loc='center left', bbox_to_anchor=(1.0, 0.5),
              framealpha=0.95)

    save_chart(fig, 'pie_revenus_secteur.png')


# ════════════════════════════════════════════════════════
#  4. DONUT CHART — Budget allocation par projet
# ════════════════════════════════════════════════════════
def chart_donut_budget():
    total_budget = sum(budgets)

    fig, ax = plt.subplots(figsize=(11, 9))
    style_fig(fig)
    style_ax(ax, 'Allocation du Budget par Projet', f'Total : {total_budget} M€')
    ax.set_facecolor('none')
    ax.grid(False)

    wedges, texts, autotexts = ax.pie(
        budgets, labels=None, autopct='%1.1f%%',
        colors=COLORS[:len(names)], startangle=90,
        pctdistance=0.82,
        wedgeprops=dict(width=0.42, edgecolor='white', linewidth=2.5)
    )

    for t in autotexts:
        t.set_color('white')
        t.set_fontweight('bold')
        t.set_fontsize(9)

    # Center text
    ax.text(0, 0.04, f'{total_budget}', ha='center', va='center',
            fontsize=28, fontweight='bold', color=PRIMARY_BLUE)
    ax.text(0, -0.08, 'M€ Budget', ha='center', va='center',
            fontsize=12, color=TEXT_SECONDARY)

    # Legend
    legend_labels = [f'{n} — {b} M€' for n, b in zip(names, budgets)]
    ax.legend(wedges, legend_labels, fontsize=9, facecolor='white', edgecolor=GRID_COLOR,
              labelcolor=TEXT_PRIMARY, loc='center left', bbox_to_anchor=(1.0, 0.5),
              framealpha=0.95)

    save_chart(fig, 'donut_budget_allocation.png')


# ════════════════════════════════════════════════════════
#  5. CANDLESTICK CHART — Performance mensuelle
# ════════════════════════════════════════════════════════
def chart_candlestick():
    months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    opens  = [8.2, 14.5, 21.0, 29.5, 33.8, 40.2, 48.5, 53.2, 57.8, 65.0, 70.5, 82.0]
    highs  = [10.5, 19.0, 26.5, 34.0, 38.5, 46.0, 55.0, 59.5, 64.0, 72.0, 78.0, 95.0]
    lows   = [5.8, 11.0, 17.5, 25.0, 28.0, 34.0, 41.0, 46.0, 49.0, 56.0, 60.0, 72.0]
    closes = [12, 18, 25, 32, 38, 45, 52, 58, 67, 75, 82, 95]

    fig, ax = plt.subplots(figsize=(14, 7))
    style_fig(fig)
    style_ax(ax, 'Performance Mensuelle des Investissements', 'Chandelier OHLC — Valeurs en M€')

    x = np.arange(len(months))
    bar_width = 0.55

    for i in range(len(months)):
        color = GREEN if closes[i] >= opens[i] else RED
        # Wick
        ax.plot([x[i], x[i]], [lows[i], highs[i]], color=color, linewidth=1.5, solid_capstyle='round')
        # High/Low ticks
        ax.plot([x[i] - bar_width/3, x[i] + bar_width/3], [highs[i], highs[i]],
                color=color, linewidth=1.5)
        ax.plot([x[i] - bar_width/3, x[i] + bar_width/3], [lows[i], lows[i]],
                color=color, linewidth=1.5)
        # Body
        bottom = min(opens[i], closes[i])
        height = abs(closes[i] - opens[i])
        ax.bar(x[i], height, bar_width * 0.7, bottom=bottom, color=color,
               edgecolor=color, linewidth=0.5, alpha=0.85)

    ax.set_xticks(x)
    ax.set_xticklabels(months, fontsize=10)
    ax.set_ylabel('Montant (M€)', fontsize=12, color=TEXT_SECONDARY)

    save_chart(fig, 'candlestick_performance.png')


# ════════════════════════════════════════════════════════
#  6. RADAR CHART — Analyse multidimensionnelle
# ════════════════════════════════════════════════════════
def chart_radar():
    categories = ['Rentabilité', 'Volume\nInvestissement', 'Diversification',
                  'Performance\nCoûts', 'Croissance', 'Risque']
    N = len(categories)

    # Compute scores for 3 representative projects
    # Normalize each metric to 0-100 scale
    max_roi_val = max(rois)
    max_budget_val = max(budgets)
    max_rev_val = max(revenues)

    def compute_scores(proj_name):
        p = projects[proj_name]
        # Rentabilité: ROI normalized
        rentabilite = (p['roi'] / max_roi_val) * 100
        # Volume investissement
        volume = (p['budget'] / max_budget_val) * 100
        # Diversification: how many sectors the project spans (proxy: use sector variety)
        diversification = 50  # all same
        # Performance coûts: budget - cost ratio (lower cost = better)
        perf_couts = ((p['budget'] - p['cost']) / p['budget']) * 100
        # Croissance: revenue growth potential
        croissance = (p['revenue'] / max_rev_val) * 100
        # Risque inversé: lower budget = lower risk (inverted)
        risque = (1 - p['budget'] / sum(budgets)) * 100 * (sum(budgets) / max_budget_val)
        risque = min(risque, 100)
        return [rentabilite, volume, diversification, perf_couts, croissance, risque]

    proj1_scores = compute_scores('Nimba Iron Mine')
    proj2_scores = compute_scores('Accra Fintech')
    proj3_scores = compute_scores('Lagos Real Estate')

    angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
    angles += angles[:1]  # close the polygon

    proj1_scores += proj1_scores[:1]
    proj2_scores += proj2_scores[:1]
    proj3_scores += proj3_scores[:1]

    fig, ax = plt.subplots(figsize=(9, 9), subplot_kw=dict(polar=True))
    style_fig(fig)

    ax.set_facecolor(BG_AX)
    ax.spines['polar'].set_color(GRID_COLOR)

    # Grid
    ax.yaxis.grid(True, color=GRID_COLOR, linestyle='--', linewidth=0.8)
    ax.xaxis.grid(True, color=GRID_COLOR, linestyle='-', linewidth=0.5)

    ax.plot(angles, proj1_scores, 'o-', linewidth=2.5, color=PRIMARY_BLUE, label='Nimba Iron Mine', markersize=6)
    ax.fill(angles, proj1_scores, alpha=0.12, color=PRIMARY_BLUE)

    ax.plot(angles, proj2_scores, 's-', linewidth=2.5, color=GREEN, label='Accra Fintech', markersize=6)
    ax.fill(angles, proj2_scores, alpha=0.12, color=GREEN)

    ax.plot(angles, proj3_scores, '^-', linewidth=2.5, color=GOLD, label='Lagos Real Estate', markersize=6)
    ax.fill(angles, proj3_scores, alpha=0.12, color=GOLD)

    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories, fontsize=10, color=TEXT_PRIMARY)
    ax.set_ylim(0, 100)
    ax.set_yticks([25, 50, 75, 100])
    ax.set_yticklabels(['25', '50', '75', '100'], fontsize=8, color=TEXT_SECONDARY)

    ax.legend(loc='upper right', bbox_to_anchor=(1.35, 1.1), fontsize=10,
              facecolor='white', edgecolor=GRID_COLOR, labelcolor=TEXT_PRIMARY, framealpha=0.95)

    ax.set_title('Analyse Multidimensionnelle des Projets',
                  fontsize=15, fontweight='bold', color=TEXT_PRIMARY, pad=24, loc='left')

    save_chart(fig, 'radar_multidimensional.png')


# ════════════════════════════════════════════════════════
#  7. STACKED BAR — Structure des coûts
# ════════════════════════════════════════════════════════
def chart_stacked_bar_cost():
    # Split costs into: Operations (60%), Personnel (25%), Logistique (15%)
    ops = [round(c * 0.60, 1) for c in costs]
    personnel = [round(c * 0.25, 1) for c in costs]
    logistics = [round(c * 0.15, 1) for c in costs]

    fig, ax = plt.subplots(figsize=(14, 7))
    style_fig(fig)
    style_ax(ax, 'Structure des Coûts par Projet', 'Décomposition : Opérations, Personnel, Logistique (M€)')

    x = np.arange(len(names))
    bar_width = 0.55

    b1 = ax.bar(x, ops, bar_width, label='Opérations', color=PRIMARY_BLUE, edgecolor='none', alpha=0.9)
    b2 = ax.bar(x, personnel, bar_width, bottom=ops, label='Personnel', color=GREEN, edgecolor='none', alpha=0.9)
    b3 = ax.bar(x, logistics, bar_width, bottom=[o + p for o, p in zip(ops, personnel)],
                label='Logistique', color=GOLD, edgecolor='none', alpha=0.9)

    # Total cost labels on top
    for i, (name, total) in enumerate(zip(names, costs)):
        ax.text(i, total + 0.5, f'{total} M€', ha='center', va='bottom',
                fontsize=9, fontweight='bold', color=TEXT_PRIMARY)

    ax.set_xticks(x)
    ax.set_xticklabels(names, fontsize=9, rotation=30, ha='right')
    ax.set_ylabel('Coût (M€)', fontsize=12, color=TEXT_SECONDARY)
    ax.set_ylim(0, max(costs) + 6)

    ax.legend(fontsize=11, facecolor='white', edgecolor=GRID_COLOR,
              labelcolor=TEXT_PRIMARY, loc='upper right', framealpha=0.95)

    save_chart(fig, 'stacked_bar_cost_structure.png')


# ════════════════════════════════════════════════════════
#  8. AREA CHART — ROI cumulé
# ════════════════════════════════════════════════════════
def chart_area_cumulative_roi():
    months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

    # Simulate cumulative ROI growth
    np.random.seed(42)
    base_roi = 5
    cum_roi = []
    for i in range(12):
        base_roi += np.random.uniform(4, 12)
        cum_roi.append(round(base_roi, 1))

    # Cumulative revenue
    cum_rev = [12, 30, 55, 87, 125, 170, 222, 280, 347, 422, 504, 599]

    fig, ax1 = plt.subplots(figsize=(14, 7))
    style_fig(fig)
    style_ax(ax1, 'ROI Cumulé & Revenus Progressifs', 'Évolution sur 12 mois')

    x = np.arange(len(months))

    # Area under ROI line
    ax1.fill_between(x, cum_roi, alpha=0.15, color=PRIMARY_BLUE)
    ax1.plot(x, cum_roi, color=PRIMARY_BLUE, linewidth=2.8, marker='o', markersize=7,
             label='ROI Cumulé (%)', zorder=5)

    ax1.set_xticks(x)
    ax1.set_xticklabels(months, fontsize=10)
    ax1.set_ylabel('ROI Cumulé (%)', fontsize=12, color=PRIMARY_BLUE)
    ax1.tick_params(axis='y', colors=PRIMARY_BLUE)

    # Second axis for revenue
    ax2 = ax1.twinx()
    ax2.spines['top'].set_visible(False)
    ax2.fill_between(x, cum_rev, alpha=0.08, color=GREEN)
    ax2.plot(x, cum_rev, color=GREEN, linewidth=2.8, marker='s', markersize=7,
             label='Revenus Cumulés (M€)', zorder=4, linestyle='--')
    ax2.set_ylabel('Revenus Cumulés (M€)', fontsize=12, color=GREEN)
    ax2.tick_params(axis='y', colors=GREEN)
    ax2.spines['left'].set_color(GRID_COLOR)
    ax2.spines['right'].set_color(GREEN)
    ax2.spines['bottom'].set_color(BORDER_COLOR)

    # Combined legend
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, fontsize=11, facecolor='white',
               edgecolor=GRID_COLOR, labelcolor=TEXT_PRIMARY, loc='upper left', framealpha=0.95)

    save_chart(fig, 'area_cumulative_roi.png')


# ════════════════════════════════════════════════════════
#  9. FUNNEL CHART — Pipeline d'investissement
# ════════════════════════════════════════════════════════
def chart_funnel():
    stages = [
        ('Opportunités Identifiées', 156),
        ('Analyses Réalisées', 98),
        ('Due Diligence', 62),
        ('Approbation Comité', 38),
        ('Investissements Réalisés', 23),
        ('Projets Rentables', 8),
    ]

    fig, ax = plt.subplots(figsize=(12, 8))
    style_fig(fig)
    style_ax(ax, "Pipeline d'Investissement", "Entonnoir de conversion des opportunités")
    ax.grid(False)
    ax.set_xlim(-0.6, 0.6)

    n = len(stages)
    max_val = stages[0][1]

    for i, (label, value) in enumerate(stages):
        # Width proportional to value
        width = (value / max_val) * 0.9
        # Center y positions from top to bottom
        y = n - 1 - i

        color = COLORS[i % len(COLORS)]
        ax.barh(y, width, height=0.65, left=-width / 2, color=color,
                edgecolor='white', linewidth=2, alpha=0.9)

        # Label inside bar
        ax.text(0, y, f'{label}\n{value}', ha='center', va='center',
                fontsize=11, fontweight='bold', color='white' if i < 4 else TEXT_PRIMARY)

        # Conversion rate
        if i > 0:
            prev_val = stages[i - 1][1]
            rate = (value / prev_val) * 100
            ax.annotate(f'{rate:.0f}%', xy=(width / 2 + 0.02, y + 0.35),
                        fontsize=9, color=TEXT_SECONDARY, fontstyle='italic')

    ax.set_yticks([])
    ax.set_xticks([])
    ax.invert_yaxis()

    save_chart(fig, 'funnel_investment_pipeline.png')


# ════════════════════════════════════════════════════════
#  10. WATERFALL CHART — Budget vers Revenus
# ════════════════════════════════════════════════════════
def chart_waterfall():
    # Waterfall: Budget -> Adjustments -> Revenue
    categories = ['Budget\nTotal', 'Nimba\nMine', 'Solar\nDakar', 'Lagos\nRE',
                  'Abidjan\nTech', 'Kinshasa\nAgri', 'Accra\nFT', 'Nairobi\nLog.',
                  'Douala\nPort', 'Revenus\nTotaux']

    # Budget breakdown by project then cumulative revenue
    budget_vals = budgets  # [50, 20, 35, 15, 25, 10, 30, 45]
    total_budget = sum(budget_vals)
    total_revenue = sum(revenues)  # 344.1

    # Build waterfall data
    # Start with total budget, then show net contribution per project, end with total revenue
    running = total_budget
    bar_vals = [total_budget]  # Starting bar

    # Net gains per project (revenue - budget)
    for i in range(len(names)):
        net = revenues[i] - budgets[i]
        bar_vals.append(net)

    bar_vals.append(total_revenue)  # Final bar

    fig, ax = plt.subplots(figsize=(16, 8))
    style_fig(fig)
    style_ax(ax, 'Flux Budget → Revenus', 'Analyse en cascade : du budget investi aux revenus générés (M€)')

    x = np.arange(len(categories))
    bar_width = 0.6

    # Compute positions
    bottoms = []
    heights = []
    colors_list = []

    # First bar (total budget)
    bottoms.append(0)
    heights.append(bar_vals[0])
    colors_list.append(PRIMARY_BLUE)

    running_total = bar_vals[0]

    # Middle bars (net gains)
    for i in range(1, len(bar_vals) - 1):
        val = bar_vals[i]
        if val >= 0:
            bottoms.append(running_total)
            heights.append(val)
            colors_list.append(GREEN)
        else:
            bottoms.append(running_total + val)
            heights.append(abs(val))
            colors_list.append(RED)
        running_total += val

    # Last bar (total revenue)
    bottoms.append(0)
    heights.append(bar_vals[-1])
    colors_list.append(PRIMARY_BLUE)

    # Draw bars
    for i in range(len(categories)):
        ax.bar(x[i], heights[i], bar_width, bottom=bottoms[i],
               color=colors_list[i], edgecolor='white', linewidth=1, alpha=0.9)

        # Value label
        val = bar_vals[i]
        if i == 0 or i == len(categories) - 1:
            label_y = bottoms[i] + heights[i] / 2
            ax.text(x[i], label_y, f'{val:.1f}', ha='center', va='center',
                    fontsize=10, fontweight='bold', color='white')
        else:
            label_y = bottoms[i] + heights[i] + (2 if val >= 0 else -4)
            ax.text(x[i], label_y, f'+{val:.1f}' if val >= 0 else f'{val:.1f}',
                    ha='center', va='bottom' if val >= 0 else 'top',
                    fontsize=9, fontweight='bold', color=GREEN if val >= 0 else RED)

    # Connector lines between middle bars
    running_y = bar_vals[0]
    for i in range(1, len(categories) - 1):
        ax.plot([x[i] - bar_width/2, x[i] + bar_width/2], [running_y, running_y],
                color=GRID_COLOR, linewidth=1, linestyle='--')
        running_y += bar_vals[i]

    ax.set_xticks(x)
    ax.set_xticklabels(categories, fontsize=9)
    ax.set_ylabel('Montant (M€)', fontsize=12, color=TEXT_SECONDARY)
    ax.set_ylim(0, max(bar_vals[0], bar_vals[-1]) + 40)

    # Dashed line connecting budget to revenue
    ax.annotate('', xy=(len(categories) - 1, bar_vals[-1]),
                xytext=(0, bar_vals[0]),
                arrowprops=dict(arrowstyle='->', color=TEXT_SECONDARY, lw=1.2, linestyle='--'))

    save_chart(fig, 'waterfall_budget_revenue.png')


# ════════════════════════════════════════════════════════
#  MAIN — Generate all 10 charts
# ════════════════════════════════════════════════════════
if __name__ == '__main__':
    print("=" * 60)
    print("  InvestFlow Africa — Chart Generation (Nimba Light Theme)")
    print("=" * 60)
    print()

    print("[1/10] Bar — ROI par projet")
    chart_bar_roi()

    print("[2/10] Line — Tendances mensuelles")
    chart_line_tendances()

    print("[3/10] Pie — Revenus par secteur")
    chart_pie_revenus()

    print("[4/10] Donut — Allocation budget")
    chart_donut_budget()

    print("[5/10] Candlestick — Performance mensuelle")
    chart_candlestick()

    print("[6/10] Radar — Analyse multidimensionnelle")
    chart_radar()

    print("[7/10] Stacked Bar — Structure des coûts")
    chart_stacked_bar_cost()

    print("[8/10] Area — ROI cumulé")
    chart_area_cumulative_roi()

    print("[9/10] Funnel — Pipeline d'investissement")
    chart_funnel()

    print("[10/10] Waterfall — Budget vers Revenus")
    chart_waterfall()

    print()
    print("=" * 60)
    print("  All 10 charts generated successfully!")
    print(f"  Output: {OUTPUT_DIR}/")
    print("=" * 60)
