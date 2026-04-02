import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np

plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False

COLORS = ['#00D4AA', '#FF6B35', '#4ECDC4', '#FFD93D', '#6C5CE7', '#A8E6CF', '#FF8B94', '#45B7D1']
BG_COLOR = '#0D1117'
CARD_BG = '#161B22'
TEXT_COLOR = '#E6EDF3'
GRID_COLOR = '#21262D'
ACCENT = '#00D4AA'

projects = {
    'Nimba Iron Mine': {'sector': 'Mining', 'budget': 50, 'cost': 38, 'revenue': 89.5, 'roi': 79, 'status': 'Active', 'risk': 'Medium'},
    'Solar Plant Dakar': {'sector': 'Energy', 'budget': 20, 'cost': 16, 'revenue': 29.1, 'roi': 44, 'status': 'Active', 'risk': 'Low'},
    'Lagos Real Estate': {'sector': 'Real Estate', 'budget': 35, 'cost': 30, 'revenue': 52.5, 'roi': 50, 'status': 'Active', 'risk': 'Medium'},
    'Abidjan Tech Hub': {'sector': 'Technology', 'budget': 15, 'cost': 12, 'revenue': 22.5, 'roi': 50, 'status': 'Completed', 'risk': 'Low'},
    'Kinshasa Agri-Business': {'sector': 'Agriculture', 'budget': 25, 'cost': 20, 'revenue': 32.5, 'roi': 30, 'status': 'Active', 'risk': 'High'},
    'Accra Fintech': {'sector': 'Technology', 'budget': 10, 'cost': 8, 'revenue': 16.0, 'roi': 60, 'status': 'Active', 'risk': 'Low'},
    'Nairobi Logistics': {'sector': 'Logistics', 'budget': 30, 'cost': 24, 'revenue': 39.0, 'roi': 30, 'status': 'Pending', 'risk': 'Medium'},
    'Douala Port Extension': {'sector': 'Logistics', 'budget': 45, 'cost': 36, 'revenue': 63.0, 'roi': 40, 'status': 'Active', 'risk': 'Medium'},
}

names = list(projects.keys())
budgets = [projects[n]['budget'] for n in names]
costs = [projects[n]['cost'] for n in names]
revenues = [projects[n]['revenue'] for n in names]
rois = [projects[n]['roi'] for n in names]
sectors = [projects[n]['sector'] for n in names]
risks = [projects[n]['risk'] for n in names]

def style_chart(fig, ax, title):
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(CARD_BG)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(GRID_COLOR)
    ax.spines['bottom'].set_color(GRID_COLOR)
    ax.tick_params(colors=TEXT_COLOR, labelsize=10)
    ax.yaxis.label.set_color(TEXT_COLOR)
    ax.xaxis.label.set_color(TEXT_COLOR)
    ax.set_title(title, fontsize=16, fontweight='bold', color=TEXT_COLOR, pad=20)
    ax.grid(axis='y', color=GRID_COLOR, alpha=0.5, linestyle='--')

# ============================================================
# 6. RADAR CHART - Multi-dimensional project comparison
# ============================================================
fig, ax = plt.subplots(figsize=(10, 10), subplot_kw=dict(polar=True))
fig.patch.set_facecolor(BG_COLOR)

categories = ['ROI', 'Budget', 'Revenue', 'Growth\nPotential', 'Risk\nScore', 'Impact\nSocial']
N = len(categories)
angles = [n / float(N) * 2 * np.pi for n in range(N)]
angles += angles[:1]

# Select top 4 projects for comparison
top_projects = ['Nimba Iron Mine', 'Accra Fintech', 'Lagos Real Estate', 'Solar Plant Dakar']
project_data = {
    'Nimba Iron Mine':     [79, 50, 89.5, 70, 60, 75],
    'Accra Fintech':       [60, 10, 16.0, 95, 85, 90],
    'Lagos Real Estate':   [50, 35, 52.5, 60, 55, 70],
    'Solar Plant Dakar':   [44, 20, 29.1, 85, 80, 95],
}
# Normalize to 0-100
for k in project_data:
    project_data[k] = [min(v / 100 * 100, 100) for v in project_data[k]]

radar_colors = ['#00D4AA', '#FF6B35', '#4ECDC4', '#FFD93D']
for idx, pname in enumerate(top_projects):
    values = project_data[pname]
    values += values[:1]
    ax.plot(angles, values, 'o-', linewidth=2.5, label=pname, color=radar_colors[idx], markersize=6)
    ax.fill(angles, values, alpha=0.08, color=radar_colors[idx])

ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, fontsize=11, color=TEXT_COLOR)
ax.set_ylim(0, 100)
ax.set_yticks([25, 50, 75, 100])
ax.set_yticklabels(['25', '50', '75', '100'], fontsize=8, color=TEXT_COLOR)
ax.spines['polar'].set_color(GRID_COLOR)
ax.grid(color=GRID_COLOR, alpha=0.5)
ax.set_facecolor(CARD_BG)
ax.legend(loc='upper right', bbox_to_anchor=(1.35, 1.1), fontsize=10, facecolor=CARD_BG, edgecolor=GRID_COLOR, labelcolor=TEXT_COLOR)
ax.set_title('Analyse Multidimensionnelle des Projets Top 4', fontsize=16, fontweight='bold', color=TEXT_COLOR, pad=30)
plt.tight_layout()
plt.savefig('/home/z/my-project/download/charts/radar_multidimensional.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("Radar chart done")

# ============================================================
# 7. STACKED BAR CHART - Cost structure breakdown
# ============================================================
fig, ax = plt.subplots(figsize=(14, 7))
style_chart(fig, ax, 'Structure des Co\u00fbts par Projet')

# Cost components (simulated)
labour =    [12, 5, 10, 4, 7, 3, 8, 10]
materials = [15, 6, 12, 5, 8, 2, 10, 16]
logistics_cost = [5, 3, 4, 1, 3, 1, 4, 6]
admin =     [6, 2, 4, 2, 2, 2, 2, 4]

x = np.arange(len(names))
width = 0.55

b1 = ax.bar(x, labour, width, label='Main-d\'oeuvre', color='#00D4AA', edgecolor='none')
b2 = ax.bar(x, materials, width, bottom=labour, label='Mat\u00e9riaux', color='#4ECDC4', edgecolor='none')
b3 = ax.bar(x, logistics_cost, width, bottom=[a+b for a,b in zip(labour, materials)], label='Logistique', color='#FFD93D', edgecolor='none')
b4 = ax.bar(x, admin, width, bottom=[a+b+c for a,b,c in zip(labour, materials, logistics_cost)], label='Administration', color='#6C5CE7', edgecolor='none')

ax.set_xticks(x)
ax.set_xticklabels(names, rotation=35, ha='right', fontsize=9)
ax.set_ylabel('Co\u00fbt (M\u20ac)', fontsize=12)
ax.legend(fontsize=11, facecolor=CARD_BG, edgecolor=GRID_COLOR, labelcolor=TEXT_COLOR, loc='upper right')
plt.tight_layout()
plt.savefig('/home/z/my-project/download/charts/stacked_bar_cost_structure.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("Stacked bar chart done")

# ============================================================
# 8. AREA CHART - Cumulative ROI over time
# ============================================================
fig, ax = plt.subplots(figsize=(14, 7))
style_chart(fig, ax, 'ROI Cumulatif par Secteur (2024)')

months = ['Jan', 'F\u00e9v', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Ao\u00fb', 'Sep', 'Oct', 'Nov', 'D\u00e9c']
np.random.seed(42)
mining_cum   = [3, 8, 15, 24, 35, 48, 58, 65, 72, 78, 85, 95]
energy_cum   = [1, 3, 6, 10, 14, 20, 25, 30, 36, 42, 48, 55]
tech_cum     = [2, 5, 9, 15, 22, 30, 38, 45, 52, 58, 64, 70]
realestate_cum = [1, 4, 8, 14, 20, 28, 35, 42, 48, 55, 60, 65]
agri_cum     = [1, 2, 5, 8, 12, 16, 20, 25, 28, 32, 35, 40]
logistics_cum = [1, 3, 6, 10, 15, 20, 26, 32, 38, 44, 50, 55]

ax.stackplot(months, mining_cum, energy_cum, tech_cum, realestate_cum, agri_cum, logistics_cum,
    labels=['Mining', 'Energie', 'Technologie', 'Immobilier', 'Agriculture', 'Logistique'],
    colors=['#00D4AA', '#FFD93D', '#FF6B35', '#6C5CE7', '#A8E6CF', '#45B7D1'], alpha=0.7)
ax.set_ylabel('ROI Cumulatif (%)', fontsize=12)
ax.legend(fontsize=10, facecolor=CARD_BG, edgecolor=GRID_COLOR, labelcolor=TEXT_COLOR, loc='upper left')
plt.tight_layout()
plt.savefig('/home/z/my-project/download/charts/area_cumulative_roi.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("Area chart done")

# ============================================================
# 9. FUNNEL CHART - Investment Pipeline
# ============================================================
fig, ax = plt.subplots(figsize=(12, 8))
style_chart(fig, ax, "Pipeline d'Investissement \u2014 Taux de Conversion")

stages = ['Opportunit\u00e9s\nIdentifi\u00e9es', 'Due Diligence\nTermin\u00e9e', 'Comit\u00e9\nValidation', 'N\u00e9gociation\nContrat', 'Investissement\nR\u00e9alis\u00e9', 'ROI\nAtteint']
values = [150, 85, 42, 28, 8, 6]
pct = ['100%', '57%', '28%', '19%', '5.3%', '4.0%']
colors_funnel = ['#6C5CE7', '#45B7D1', '#4ECDC4', '#FFD93D', '#FF6B35', '#00D4AA']

n = len(stages)
max_width = 10
y_positions = list(range(n-1, -1, -1))

for i, (stage, val, p, col) in enumerate(zip(stages, values, pct, colors_funnel)):
    width = max_width * (val / values[0])
    left = (max_width - width) / 2
    bar = ax.barh(y_positions[i], width, height=0.65, left=left, color=col, edgecolor='none', alpha=0.9)
    ax.text(0, y_positions[i], f'  {stage}  ', ha='left', va='center', fontsize=10, color=TEXT_COLOR, fontweight='bold')
    ax.text(max_width + 0.3, y_positions[i], f'{val} ({p})', ha='left', va='center', fontsize=12, color=col, fontweight='bold')

ax.set_xlim(-3, max_width + 3)
ax.set_ylim(-0.5, n - 0.5)
ax.axis('off')
ax.set_title("Pipeline d'Investissement \u2014 Taux de Conversion", fontsize=16, fontweight='bold', color=TEXT_COLOR, pad=20)
fig.patch.set_facecolor(BG_COLOR)
plt.tight_layout()
plt.savefig('/home/z/my-project/download/charts/funnel_investment_pipeline.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("Funnel chart done")

# ============================================================
# 10. WATERFALL CHART - Budget to Revenue Bridge
# ============================================================
fig, ax = plt.subplots(figsize=(14, 7))
style_chart(fig, ax, "Pont Budget \u2192 Revenus \u2014 Analyse de la Cr\u00e9ation de Valeur")

categories_w = ['Budget\nTotal', 'Nimba\nMine', 'Lagos\nRE', 'Douala\nPort', 'Solar\nPlant', 'Tech\nHub+FT', 'Agri\nBiz', 'Nairobi\nLog.', 'Revenu\nTotal']
values_w = [230, -89.5, -52.5, -63, -29.1, -38.5, -32.5, -39, 344.1]
# Calculate running total for waterfall
running = [230]
for v in values_w[1:-1]:
    running.append(running[-1] - v)
running.append(344.1)
# Bottom positions
bottoms = [0]
for i in range(1, len(values_w)-1):
    bottoms.append(running[i])
bottoms.append(0)

bar_colors = []
for i, v in enumerate(values_w):
    if i == 0:
        bar_colors.append('#45B7D1')  # Starting budget
    elif i == len(values_w) - 1:
        bar_colors.append('#00D4AA')  # Final revenue
    else:
        bar_colors.append('#FF6B35')  # Contributions

bars = ax.bar(range(len(categories_w)), [abs(v) for v in values_w], bottom=bottoms, color=bar_colors, width=0.6, edgecolor='none')

# Connector lines
for i in range(len(values_w) - 2):
    top = bottoms[i+1] + abs(values_w[i+1])
    if i == 0:
        top = 230
    ax.plot([i+0.3, i+0.7], [running[i+1], running[i+1]], color=GRID_COLOR, linewidth=1, linestyle='--')

# Value labels
for i, (bar, v) in enumerate(zip(bars, values_w)):
    label = f'+{abs(v)}M\u20ac' if v < 0 and i != len(values_w)-1 else f'{abs(v)}M\u20ac'
    if i == 0 or i == len(values_w)-1:
        label = f'{abs(v)}M\u20ac'
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_y() + bar.get_height() + 5, label,
            ha='center', va='bottom', color=TEXT_COLOR, fontweight='bold', fontsize=10)

ax.set_xticks(range(len(categories_w)))
ax.set_xticklabels(categories_w, fontsize=9)
ax.set_ylabel('Montant (M\u20ac)', fontsize=12)
ax.set_ylim(0, 420)
plt.tight_layout()
plt.savefig('/home/z/my-project/download/charts/waterfall_budget_revenue.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("Waterfall chart done")

print("\nAll 5 new charts generated successfully!")
