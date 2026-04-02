import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

# === COLOR PALETTE (Professional, low saturation) ===
C = {
    'bg': '#FFFFFF',
    'text': '#1E293B',
    'sub': '#64748B',
    'grid': '#E2E8F0',
    'blue': '#3B82F6',
    'emerald': '#059669',
    'amber': '#D97706',
    'red': '#DC2626',
    'purple': '#7C3AED',
    'teal': '#0D9488',
    'rose': '#E11D48',
    'indigo': '#4338CA',
    'slate': '#64748B',
}

CHARTS_DIR = '/home/z/my-project/download/charts_commercial/'
import os
os.makedirs(CHARTS_DIR, exist_ok=True)

def style(fig, ax, title):
    fig.patch.set_facecolor(C['bg'])
    ax.set_facecolor(C['bg'])
    for spine in ax.spines.values():
        spine.set_color(C['grid'])
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.tick_params(colors=C['text'], labelsize=10)
    ax.yaxis.label.set_color(C['text'])
    ax.xaxis.label.set_color(C['text'])
    ax.set_title(title, fontsize=15, fontweight='bold', color=C['text'], pad=18, loc='left')
    ax.grid(axis='y', color=C['grid'], alpha=0.7, linestyle='--', linewidth=0.8)

# === DATA ===
projects = {
    'Nimba Iron Mine':     {'sector': 'Mining',      'budget': 50, 'cost': 38, 'revenue': 89.5, 'roi': 79, 'country': 'Guinee',    'risk': 'Medium', 'status': 'Active'},
    'Solar Plant Dakar':   {'sector': 'Energy',      'budget': 20, 'cost': 16, 'revenue': 29.1, 'roi': 44, 'country': 'Senegal',   'risk': 'Low',    'status': 'Active'},
    'Lagos Real Estate':   {'sector': 'Real Estate', 'budget': 35, 'cost': 30, 'revenue': 52.5, 'roi': 50, 'country': 'Nigeria',   'risk': 'Medium', 'status': 'Active'},
    'Abidjan Tech Hub':    {'sector': 'Technology',  'budget': 15, 'cost': 12, 'revenue': 22.5, 'roi': 50, 'country': 'Cote d\'Ivoire', 'risk': 'Low', 'status': 'Completed'},
    'Kinshasa Agri-Biz':  {'sector': 'Agriculture', 'budget': 25, 'cost': 20, 'revenue': 32.5, 'roi': 30, 'country': 'RDC',       'risk': 'High',   'status': 'Active'},
    'Accra Fintech':       {'sector': 'Technology',  'budget': 10, 'cost': 8,  'revenue': 16.0, 'roi': 60, 'country': 'Ghana',     'risk': 'Low',    'status': 'Active'},
    'Nairobi Logistics':   {'sector': 'Logistics',   'budget': 30, 'cost': 24, 'revenue': 39.0, 'roi': 30, 'country': 'Kenya',     'risk': 'Medium', 'status': 'Pending'},
    'Douala Port Ext.':    {'sector': 'Logistics',   'budget': 45, 'cost': 36, 'revenue': 63.0, 'roi': 40, 'country': 'Cameroun',  'risk': 'Medium', 'status': 'Active'},
}
names = list(projects.keys())
budgets = np.array([projects[n]['budget'] for n in names])
costs = np.array([projects[n]['cost'] for n in names])
revenues = np.array([projects[n]['revenue'] for n in names])
rois = np.array([projects[n]['roi'] for n in names])
sectors_list = [projects[n]['sector'] for n in names]

# ============================================================
# CHART 1: BAR CHART - Efficacite Commerciale par Projet (Revenue/Budget)
# ============================================================
fig, ax = plt.subplots(figsize=(12, 6.5))
style(fig, ax, 'Efficacite Commerciale par Projet (Revenu / Budget)')
efficiency = revenues / budgets * 100
colors_bar = [C['emerald'] if e > 200 else (C['amber'] if e > 150 else C['rose']) for e in efficiency]
sorted_idx = np.argsort(efficiency)[::-1]
ax.barh(range(len(names)), efficiency[sorted_idx], color=[colors_bar[i] for i in sorted_idx], height=0.55, edgecolor='none')
ax.set_yticks(range(len(names)))
ax.set_yticklabels([names[i] for i in sorted_idx], fontsize=10)
for i, idx in enumerate(sorted_idx):
    ax.text(efficiency[idx] + 3, i, f'{efficiency[idx]:.0f}%', va='center', fontsize=10, color=C['text'], fontweight='bold')
ax.set_xlabel('Taux de Rentabilite (%)', fontsize=11, color=C['text'])
ax.axvline(x=100, color=C['red'], linestyle='--', linewidth=1, alpha=0.6, label='Seuil rentabilite (100%)')
ax.legend(fontsize=9, loc='lower right', framealpha=0.9)
ax.set_xlim(0, max(efficiency) * 1.15)
plt.tight_layout()
plt.savefig(f'{CHARTS_DIR}/bar_efficacite_commerciale.png', dpi=200, bbox_inches='tight', facecolor=C['bg'])
plt.close()
print('1/5 Bar chart done')

# ============================================================
# CHART 2: LINE CHART - Evolution Mensuelle des Metriques Commerciales
# ============================================================
fig, ax = plt.subplots(figsize=(12, 6.5))
style(fig, ax, 'Evolution Mensuelle des Metriques Commerciales')
months = ['Jan','Fev','Mar','Avr','Mai','Jun','Jul','Aou','Sep','Oct','Nov','Dec']
np.random.seed(42)
roi_mois = [22, 28, 35, 40, 43, 46, 48, 47, 49, 50, 48, 52]
marge_mois = [15, 22, 28, 33, 37, 40, 44, 43, 46, 48, 47, 52]
pipeline_mois = [3, 5, 8, 10, 14, 18, 22, 25, 28, 32, 35, 42]
x = np.arange(len(months))
ax.plot(x, roi_mois, color=C['emerald'], linewidth=2.5, marker='o', markersize=7, label='ROI Moyen (%)', zorder=5)
ax.plot(x, marge_mois, color=C['blue'], linewidth=2.5, marker='s', markersize=7, label='Marge Beneficiaire (%)', zorder=4)
ax.fill_between(x, roi_mois, marge_mois, alpha=0.08, color=C['emerald'])
ax2 = ax.twinx()
ax2.bar(x, pipeline_mois, width=0.4, alpha=0.2, color=C['purple'], label='Pipeline (projets)')
ax2.set_ylabel('Pipeline (projets)', fontsize=11, color=C['purple'])
ax2.tick_params(colors=C['purple'], labelsize=10)
ax2.spines['top'].set_visible(False)
ax2.spines['left'].set_color(C['grid'])
ax2.spines['right'].set_color(C['grid'])
ax2.spines['bottom'].set_color(C['grid'])
ax.set_xticks(x)
ax.set_xticklabels(months, fontsize=10)
ax.set_ylabel('Pourcentage (%)', fontsize=11, color=C['text'])
lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax.legend(lines1 + lines2, labels1 + labels2, fontsize=9, loc='upper left', framealpha=0.9)
plt.tight_layout()
plt.savefig(f'{CHARTS_DIR}/line_evolution_mensuelle.png', dpi=200, bbox_inches='tight', facecolor=C['bg'])
plt.close()
print('2/5 Line chart done')

# ============================================================
# CHART 3: PIE CHART - Repartition du Chiffre d'Affaires par Secteur
# ============================================================
fig, ax = plt.subplots(figsize=(9, 9))
style(fig, ax, 'Repartition du Chiffre d\'Affaires par Secteur')
fig.patch.set_facecolor(C['bg'])
ax.set_facecolor(C['bg'])
sector_rev = {}
for n in names:
    s = projects[n]['sector']
    sector_rev[s] = sector_rev.get(s, 0) + projects[n]['revenue']
labels = list(sector_rev.keys())
sizes = list(sector_rev.values())
colors_pie = [C['emerald'], C['blue'], C['amber'], C['purple'], C['teal'], C['rose']]
explode = [0.05] * len(labels)
wedges, texts, autotexts = ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=140,
    colors=colors_pie[:len(labels)], explode=explode, pctdistance=0.78,
    wedgeprops=dict(width=0.55, edgecolor='white', linewidth=2))
for t in texts: t.set_color(C['text']); t.set_fontsize(11)
for t in autotexts: t.set_color('white'); t.set_fontweight('bold'); t.set_fontsize(10)
centre = sum(sizes)
ax.text(0, 0.05, f'{centre:.0f}M\u20ac', ha='center', va='center', fontsize=20, fontweight='bold', color=C['text'])
ax.text(0, -0.1, 'CA Total', ha='center', va='center', fontsize=11, color=C['sub'])
plt.tight_layout()
plt.savefig(f'{CHARTS_DIR}/pie_ca_secteur.png', dpi=200, bbox_inches='tight', facecolor=C['bg'])
plt.close()
print('3/5 Pie chart done')

# ============================================================
# CHART 4: DONUT CHART - Budget Allocation & Return Efficiency
# ============================================================
fig, ax = plt.subplots(figsize=(9, 9))
style(fig, ax, 'Allocation Budget vs Rendement par Secteur')
fig.patch.set_facecolor(C['bg'])
ax.set_facecolor(C['bg'])
sector_budget = {}
for n in names:
    s = projects[n]['sector']
    sector_budget[s] = sector_budget.get(s, 0) + projects[n]['budget']
sec_labels = list(sector_budget.keys())
sec_buds = list(sector_budget.values())
sec_rois = {s: sector_rev.get(s,0)/sector_budget.get(s,1)*100 for s in sec_labels}
sec_roi_vals = [sec_rois[s] for s in sec_labels]
colors_donut = [C['emerald'] if r > 200 else (C['amber'] if r > 150 else C['rose']) for r in sec_roi_vals]
wedges, texts = ax.pie(sec_buds, labels=sec_labels, startangle=90,
    colors=colors_donut, wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2))
for t in texts: t.set_color(C['text']); t.set_fontsize(10)
# Add ROI % in the donut ring
for i, (w, roi) in enumerate(zip(wedges, sec_roi_vals)):
    angle = (w.theta2 - w.theta1) / 2 + w.theta1
    x_pos = 0.72 * np.cos(np.radians(angle))
    y_pos = 0.72 * np.sin(np.radians(angle))
    ax.text(x_pos, y_pos, f'{roi:.0f}%', ha='center', va='center', fontsize=9, fontweight='bold', color='white')
ax.text(0, 0.05, f'{sum(sec_buds)}M\u20ac', ha='center', va='center', fontsize=18, fontweight='bold', color=C['text'])
ax.text(0, -0.08, 'Budget Total', ha='center', va='center', fontsize=10, color=C['sub'])
plt.tight_layout()
plt.savefig(f'{CHARTS_DIR}/donut_budget_rendement.png', dpi=200, bbox_inches='tight', facecolor=C['bg'])
plt.close()
print('4/5 Donut chart done')

# ============================================================
# CHART 5: CANDLESTICK CHART - Performance Commerciale Mensuelle
# ============================================================
fig, ax = plt.subplots(figsize=(12, 6.5))
style(fig, ax, 'Performance Commerciale Mensuelle (Chandeliers)')
opens =  [8.2, 14.5, 21.0, 29.5, 33.8, 40.2, 48.5, 53.2, 57.8, 65.0, 70.5, 82.0]
highs =  [10.5, 19.0, 26.5, 34.0, 38.5, 46.0, 55.0, 59.5, 64.0, 72.0, 78.0, 95.0]
lows =   [5.8, 11.0, 17.5, 25.0, 28.0, 34.0, 41.0, 46.0, 49.0, 56.0, 60.0, 72.0]
closes = [12, 18, 25, 32, 37, 44, 52, 55, 59, 68, 74, 90]
x = np.arange(12)
width = 0.5
for i in range(12):
    color = C['emerald'] if closes[i] >= opens[i] else C['red']
    ax.plot([x[i], x[i]], [lows[i], highs[i]], color=color, linewidth=1.5)
    ax.plot([x[i]-width/3, x[i]+width/3], [highs[i], highs[i]], color=color, linewidth=1.5)
    ax.plot([x[i]-width/3, x[i]+width/3], [lows[i], lows[i]], color=color, linewidth=1.5)
    ax.bar(x[i], closes[i]-opens[i], width, bottom=opens[i], color=color, edgecolor='none', alpha=0.85)
ax.set_xticks(x)
ax.set_xticklabels(months, fontsize=10)
ax.set_ylabel('Montant (M\u20ac)', fontsize=11, color=C['text'])
# Add a cumulative line
cumul = np.cumsum(closes)
ax2 = ax.twinx()
ax2.plot(x, cumul, color=C['purple'], linewidth=2, linestyle='--', marker='D', markersize=5, label='CA Cumule (M\u20ac)', zorder=10)
ax2.set_ylabel('CA Cumule (M\u20ac)', fontsize=11, color=C['purple'])
ax2.tick_params(colors=C['purple'], labelsize=10)
ax2.spines['top'].set_visible(False)
ax2.spines['left'].set_color(C['grid'])
ax2.spines['right'].set_color(C['purple'])
ax2.spines['bottom'].set_color(C['grid'])
ax2.legend(fontsize=9, loc='upper left', framealpha=0.9)
plt.tight_layout()
plt.savefig(f'{CHARTS_DIR}/candlestick_performance_commerciale.png', dpi=200, bbox_inches='tight', facecolor=C['bg'])
plt.close()
print('5/5 Candlestick chart done')

print('\nAll 5 commercial charts generated successfully!')
print(f'Directory: {CHARTS_DIR}')
