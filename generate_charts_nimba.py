"""
Generate InvestFlow Africa charts with Nimba Ressources Company color palette.
Light corporate theme — white background, dark text, Nimba brand colors.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
import pandas as pd

plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Helvetica', 'Arial', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

# ── Nimba Ressources Company Color Palette ──
ACCENT       = '#2B6CB0'   # Primary Blue
DARK_BLUE    = '#215387'
GREEN        = '#13612e'
GOLD         = '#f5a524'
RED          = '#b82105'
ORANGE       = '#f7630c'
TEXT_COLOR    = '#2D3748'
TEXT_DARK     = '#1A202C'
BG_COLOR      = '#F7FAFC'  # Light background
CARD_BG       = '#ffffff'   # White card background
GRID_COLOR    = '#E2E8F0'

# Chart accent colors (8-color palette)
COLORS = ['#2B6CB0', '#13612e', '#f5a524', '#f7630c', '#b82105', '#215387', '#718096', '#EDF2F7']

# Output directory
OUTPUT_DIR = '/home/z/my-project/public/charts/'

# === DATA (identical to original) ===
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


def style_chart(fig, ax, title):
    """Apply Nimba light-theme styling to a chart."""
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(CARD_BG)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GRID_COLOR)
    ax.spines['bottom'].set_color(GRID_COLOR)
    ax.tick_params(colors=TEXT_COLOR, labelsize=10)
    ax.yaxis.label.set_color(TEXT_COLOR)
    ax.xaxis.label.set_color(TEXT_COLOR)
    ax.set_title(title, fontsize=16, fontweight='bold', color=TEXT_DARK, pad=20)
    ax.grid(axis='y', color=GRID_COLOR, alpha=0.7, linestyle='--')


# ============================================================
# 1. BAR CHART — ROI par Projet
# ============================================================
fig, ax = plt.subplots(figsize=(14, 7))
style_chart(fig, ax, 'ROI par Projet — InvestFlow Africa')
bars = ax.barh(names, rois, color=COLORS[:len(names)], height=0.6, edgecolor='none')
for bar, roi in zip(bars, rois):
    ax.text(bar.get_width() + 1, bar.get_y() + bar.get_height() / 2,
            f'{roi}%', va='center', ha='left', color=TEXT_DARK,
            fontweight='bold', fontsize=11)
ax.set_xlabel('ROI (%)', fontsize=12)
ax.set_xlim(0, max(rois) + 15)
ax.invert_yaxis()
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}bar_roi_par_projet.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("✅ Bar chart done")

# ============================================================
# 2. LINE CHART — Tendances Mensuelles
# ============================================================
months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
np.random.seed(42)
rev_trend = [12, 18, 25, 32, 38, 45, 52, 58, 67, 75, 82, 95]
budget_trend = [8, 15, 22, 30, 35, 42, 50, 55, 60, 68, 73, 85]
cost_trend = [6, 12, 18, 24, 28, 34, 40, 44, 48, 54, 58, 68]

fig, ax = plt.subplots(figsize=(14, 7))
style_chart(fig, ax, 'Tendances Mensuelles — Budget, Coûts & Revenus (2024)')

ax.plot(months, rev_trend, color=ACCENT, linewidth=3, marker='o', markersize=8, label='Revenus (M€)', zorder=5)
ax.plot(months, budget_trend, color=GOLD, linewidth=3, marker='s', markersize=8, label='Budget (M€)', zorder=4)
ax.plot(months, cost_trend, color=ORANGE, linewidth=3, marker='^', markersize=8, label='Coûts (M€)', zorder=3)
ax.fill_between(months, rev_trend, cost_trend, alpha=0.12, color=ACCENT)

ax.legend(fontsize=12, facecolor=CARD_BG, edgecolor=GRID_COLOR,
          labelcolor=TEXT_COLOR, loc='upper left', framealpha=0.95)
ax.set_ylabel('Montant (M€)', fontsize=12)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}line_tendances.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("✅ Line chart done")

# ============================================================
# 3. PIE CHART — Revenus par Secteur
# ============================================================
sector_rev = {}
for n in names:
    s = projects[n]['sector']
    sector_rev[s] = sector_rev.get(s, 0) + projects[n]['revenue']

fig, ax = plt.subplots(figsize=(10, 10))
style_chart(fig, ax, 'Répartition des Revenus par Secteur')
fig.patch.set_facecolor(BG_COLOR)
ax.set_facecolor('none')

wedges, texts, autotexts = ax.pie(
    sector_rev.values(), labels=sector_rev.keys(), autopct='%1.1f%%',
    colors=COLORS[:len(sector_rev)], startangle=140,
    pctdistance=0.8,
    wedgeprops=dict(width=0.5, edgecolor=CARD_BG, linewidth=2)
)
for t in texts:
    t.set_color(TEXT_DARK)
    t.set_fontsize(12)
for t in autotexts:
    t.set_color(CARD_BG)
    t.set_fontweight('bold')
    t.set_fontsize(11)
ax.set_title('Répartition des Revenus par Secteur',
             fontsize=16, fontweight='bold', color=TEXT_DARK, pad=20)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}pie_revenus_secteur.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("✅ Pie chart done")

# ============================================================
# 4. DONUT CHART — Allocation du Budget
# ============================================================
fig, ax = plt.subplots(figsize=(10, 10))
style_chart(fig, ax, 'Allocation du Budget Total')
fig.patch.set_facecolor(BG_COLOR)
ax.set_facecolor('none')

wedges, texts, autotexts = ax.pie(
    budgets, labels=names, autopct='%1.1f%%',
    colors=COLORS[:len(names)], startangle=90,
    pctdistance=0.82,
    wedgeprops=dict(width=0.45, edgecolor=CARD_BG, linewidth=2)
)
for t in texts:
    t.set_color(TEXT_DARK)
    t.set_fontsize(9)
for t in autotexts:
    t.set_color(CARD_BG)
    t.set_fontweight('bold')
    t.set_fontsize(9)

# Center text
total_budget = sum(budgets)
ax.text(0, 0, f'{total_budget}M€\nTotal Budget',
        ha='center', va='center', fontsize=16, fontweight='bold', color=ACCENT)
ax.set_title('Allocation du Budget par Projet',
             fontsize=16, fontweight='bold', color=TEXT_DARK, pad=20)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}donut_budget_allocation.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("✅ Donut chart done")

# ============================================================
# 5. CANDLESTICK CHART — Performance Mensuelle
# ============================================================
fig, ax = plt.subplots(figsize=(14, 7))
style_chart(fig, ax, 'Performance Mensuelle des Investissements (M€)')

np.random.seed(7)
opens  = [8.2, 14.5, 21.0, 29.5, 33.8, 40.2, 48.5, 53.2, 57.8, 65.0, 70.5, 82.0]
highs  = [10.5, 19.0, 26.5, 34.0, 38.5, 46.0, 55.0, 59.5, 64.0, 72.0, 78.0, 95.0]
lows   = [5.8, 11.0, 17.5, 25.0, 28.0, 34.0, 41.0, 46.0, 49.0, 56.0, 60.0, 72.0]
closes = rev_trend

x = np.arange(len(months))
width = 0.5
for i in range(len(months)):
    color = GREEN if closes[i] >= opens[i] else RED
    ax.plot([x[i], x[i]], [lows[i], highs[i]], color=color, linewidth=1.5)
    ax.plot([x[i] - width / 3, x[i] + width / 3], [highs[i], highs[i]], color=color, linewidth=1.5)
    ax.plot([x[i] - width / 3, x[i] + width / 3], [lows[i], lows[i]], color=color, linewidth=1.5)
    ax.bar(x[i], closes[i] - opens[i], width, bottom=opens[i],
           color=color, edgecolor='none', alpha=0.85)

ax.set_xticks(x)
ax.set_xticklabels(months, fontsize=10)
ax.set_ylabel('Montant (M€)', fontsize=12)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}candlestick_performance.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("✅ Candlestick chart done")

print("\n🎉 All 5 Nimba-branded charts generated successfully!")
