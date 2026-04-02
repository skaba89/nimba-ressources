import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import os

OUTPUT_DIR = '/home/z/my-project/download/'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Color palette (Nimba-inspired, low saturation) ──
BLUE = '#2B6CB0'
GREEN = '#13612e'
GOLD = '#D4942A'
SLATE = '#64748B'
LIGHT_BG = '#FAFBFC'

COLORS_6 = ['#2B6CB0', '#13612e', '#D4942A', '#94A3B8', '#7C3AED', '#DC2626']

plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.size': 11,
    'axes.titlesize': 14,
    'axes.labelsize': 12,
    'figure.facecolor': 'white',
    'axes.facecolor': LIGHT_BG,
    'axes.grid': True,
    'grid.alpha': 0.3,
    'grid.color': '#CBD5E0',
})

# ══════════════════════════════════════════════
# Chart 1: Bar Chart - ROI par Projet
# ══════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(12, 6))
projects = ['Mines Guinée', 'Agro Côte d\'Ivoire', 'Tech Lagos', 'Énergie Sénégal', 'Immobilier Abidjan', 'Logistique Dakar']
roi = [34, 22, 45, 18, 28, 15]
budget = [12, 8, 5, 15, 10, 7]

x = np.arange(len(projects))
w = 0.35
bars1 = ax.bar(x - w/2, roi, w, label='ROI (%)', color=BLUE, edgecolor='white', linewidth=1.5)
bars2 = ax.bar(x + w/2, budget, w, label='Budget (M€)', color=GOLD, edgecolor='white', linewidth=1.5)

for b in bars1:
    ax.text(b.get_x() + b.get_width()/2, b.get_height() + 0.8, f'{b.get_height()}%', ha='center', va='bottom', fontsize=9, fontweight='bold', color=BLUE)
for b in bars2:
    ax.text(b.get_x() + b.get_width()/2, b.get_height() + 0.3, f'{b.get_height()}M€', ha='center', va='bottom', fontsize=9, color=SLATE)

ax.set_xticks(x)
ax.set_xticklabels(projects, fontsize=9, rotation=15, ha='right')
ax.set_ylabel('Valeur')
ax.set_title('ROI et Budget par Projet d\'Investissement', fontweight='bold', pad=12)
ax.legend(framealpha=0.9, edgecolor='#CBD5E0')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'chart_bar_roi.png'), dpi=200, bbox_inches='tight')
plt.close()
print('Chart 1: Bar ROI saved')

# ══════════════════════════════════════════════
# Chart 2: Line Chart - Tendances Trimestrielles
# ══════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(12, 6))
quarters = ['T1 2024', 'T2 2024', 'T3 2024', 'T4 2024', 'T1 2025', 'T2 2025', 'T3 2025', 'T4 2025']
revenue = [18.2, 21.5, 24.8, 28.3, 31.2, 35.7, 39.4, 44.1]
profit = [4.1, 5.2, 6.8, 7.9, 9.1, 10.8, 12.3, 14.6]
investments = [12.5, 14.2, 16.8, 18.1, 20.3, 22.5, 25.1, 28.7]

ax.plot(quarters, revenue, '-o', color=BLUE, linewidth=2.5, markersize=7, label='Revenus (M€)', zorder=3)
ax.plot(quarters, profit, '-s', color=GREEN, linewidth=2.5, markersize=7, label='Profit net (M€)', zorder=3)
ax.plot(quarters, investments, '-^', color=GOLD, linewidth=2.5, markersize=7, label='Investissements (M€)', zorder=3)

ax.fill_between(quarters, revenue, alpha=0.08, color=BLUE)
ax.fill_between(quarters, profit, alpha=0.08, color=GREEN)

ax.set_ylabel('Montant (M€)')
ax.set_title('Évolution Trimestrielle des Performances Financières', fontweight='bold', pad=12)
ax.legend(framealpha=0.9, edgecolor='#CBD5E0', loc='upper left')
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
plt.xticks(rotation=30, ha='right')
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'chart_line_trends.png'), dpi=200, bbox_inches='tight')
plt.close()
print('Chart 2: Line Trends saved')

# ══════════════════════════════════════════════
# Chart 3: Pie Chart - Répartition par Secteur
# ══════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(9, 7))
sectors = ['Mines & Ressources', 'Agriculture', 'Technologie', 'Énergie', 'Immobilier', 'Logistique']
values = [32, 22, 18, 14, 8, 6]
explode = (0.06, 0.03, 0.03, 0, 0, 0)

wedges, texts, autotexts = ax.pie(values, explode=explode, labels=sectors, autopct='%1.1f%%',
    colors=COLORS_6, startangle=140, pctdistance=0.78,
    wedgeprops={'edgecolor': 'white', 'linewidth': 2})

for t in texts:
    t.set_fontsize(10)
for t in autotexts:
    t.set_fontsize(9)
    t.set_fontweight('bold')
    t.set_color('white')

ax.set_title('Répartition des Investissements par Secteur', fontweight='bold', fontsize=14, pad=15)
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'chart_pie_sectors.png'), dpi=200, bbox_inches='tight')
plt.close()
print('Chart 3: Pie Sectors saved')

# ══════════════════════════════════════════════
# Chart 4: Candlestick Chart - Performance Mensuelle
# ══════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(13, 6))
months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
open_p =  [100, 102, 98, 105, 108, 106, 112, 115, 110, 118, 122, 125]
close_p = [103, 99, 104, 107, 105, 110, 114, 111, 116, 121, 124, 128]
high_p =  [105, 104, 106, 110, 112, 113, 117, 118, 119, 124, 127, 131]
low_p =   [98, 96, 95, 102, 103, 104, 109, 108, 108, 116, 120, 123]

x = np.arange(len(months))
width = 0.6
colors_c = [GREEN if c >= o else '#DC2626' for o, c in zip(open_p, close_p)]

for i in range(len(months)):
    ax.plot([x[i], x[i]], [low_p[i], high_p[i]], color=colors_c[i], linewidth=1.2)
    ax.bar(x[i], close_p[i] - open_p[i], width, bottom=open_p[i], color=colors_c[i], edgecolor=colors_c[i], linewidth=1)

ax.set_xticks(x)
ax.set_xticklabels(months)
ax.set_ylabel('Valeur de l\'Indice (points)')
ax.set_title('Performance Mensuelle de l\'Indice InvestFlow Africa', fontweight='bold', pad=12)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

import matplotlib.patches as mpatches
green_patch = mpatches.Patch(color=GREEN, label='Hausse')
red_patch = mpatches.Patch(color='#DC2626', label='Baisse')
ax.legend(handles=[green_patch, red_patch], framealpha=0.9, edgecolor='#CBD5E0')
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'chart_candlestick_perf.png'), dpi=200, bbox_inches='tight')
plt.close()
print('Chart 4: Candlestick saved')

# ══════════════════════════════════════════════
# Chart 5: Donut Chart - Allocation Budget
# ══════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(9, 7))
categories = ['R&D Innovation', 'Expansion Marché', 'Opérations', 'Marketing', 'Réserves', 'Frais Généraux']
alloc = [28, 24, 20, 12, 10, 6]

wedges, texts, autotexts = ax.pie(alloc, labels=categories, autopct='%1.1f%%',
    colors=['#2B6CB0', '#13612e', '#D4942A', '#7C3AED', '#94A3B8', '#F97316'],
    startangle=90, pctdistance=0.75,
    wedgeprops={'width': 0.45, 'edgecolor': 'white', 'linewidth': 2.5})

centre_circle = plt.Circle((0, 0), 0.35, fc='white')
ax.add_artist(centre_circle)
ax.text(0, 0.05, '77M€', ha='center', va='center', fontsize=22, fontweight='bold', color='#1A202C')
ax.text(0, -0.1, 'Budget Total', ha='center', va='center', fontsize=10, color=SLATE)

for t in texts:
    t.set_fontsize(10)
for t in autotexts:
    t.set_fontsize(9)
    t.set_fontweight('bold')

ax.set_title('Allocation du Budget InvestFlow Africa 2025', fontweight='bold', fontsize=14, pad=15)
plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'chart_donut_budget.png'), dpi=200, bbox_inches='tight')
plt.close()
print('Chart 5: Donut Budget saved')

print('\nAll 5 charts generated successfully!')
