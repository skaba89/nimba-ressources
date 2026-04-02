"""
Generate the remaining 5 InvestFlow Africa charts with Nimba Ressources Company color palette.
Charts: area_cumulative_roi, funnel_investment_pipeline, radar_multidimensional,
        stacked_bar_cost_structure, waterfall_budget_revenue.
Light corporate theme — white background, dark text, Nimba brand colors.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
from matplotlib.patches import FancyBboxPatch
from matplotlib.collections import PolyCollection

plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Helvetica', 'Arial', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

# ── Nimba Ressources Company Color Palette ──
ACCENT       = '#2B6CB0'
DARK_BLUE    = '#215387'
GREEN        = '#13612e'
GOLD         = '#f5a524'
RED          = '#b82105'
ORANGE       = '#f7630c'
TEXT_COLOR    = '#2D3748'
TEXT_DARK     = '#1A202C'
BG_COLOR      = '#F7FAFC'
CARD_BG       = '#ffffff'
GRID_COLOR    = '#E2E8F0'

COLORS = ['#2B6CB0', '#13612e', '#f5a524', '#f7630c', '#b82105', '#215387', '#718096', '#EDF2F7']

OUTPUT_DIR = '/home/z/my-project/public/charts/'

# ── Project Data ──
names = [
    'Nimba Iron Mine', 'Solar Plant Dakar', 'Lagos Real Estate',
    'Abidjan Tech Hub', 'Kinshasa Agri-Business', 'Accra Fintech',
    'Nairobi Logistics', 'Douala Port Extension'
]
budgets = [50, 20, 35, 15, 25, 10, 30, 45]
costs   = [38, 16, 30, 12, 20,  8, 24, 36]
revenues = [89.5, 29.1, 52.5, 22.5, 32.5, 16.0, 39.0, 63.0]

# Short names for x-axis labels
short_names = [
    'Nimba\nMine', 'Solar\nDakar', 'Lagos\nImmo', 'Abidjan\nTech',
    'Kinshasa\nAgri', 'Accra\nFintech', 'Nairobi\nLogist.', 'Douala\nPort'
]


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
# 1. AREA CHART — ROI Cumulatif
# ============================================================
print("Generating area_cumulative_roi.png...")
months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
cumulative_roi = [0, 2.1, 5.8, 10.2, 14.5, 18.9, 23.4, 28.0, 33.5, 38.2, 43.0, 47.9]

fig, ax = plt.subplots(figsize=(14, 7))
style_chart(fig, ax, 'ROI Cumulatif — InvestFlow Africa (2024)')

# Filled area with gradient effect (multiple fills at decreasing alpha)
ax.fill_between(months, cumulative_roi, alpha=0.08, color=ACCENT)
ax.fill_between(months, cumulative_roi, alpha=0.15, color=ACCENT)
ax.plot(months, cumulative_roi, color=ACCENT, linewidth=3, marker='o',
        markersize=8, label='ROI Cumulatif (%)', zorder=5)

# Data labels
for i, val in enumerate(cumulative_roi):
    ax.annotate(f'{val:.1f}%', (months[i], val),
                textcoords="offset points", xytext=(0, 12),
                ha='center', fontsize=9, color=TEXT_DARK, fontweight='bold')

# 50% target line
ax.axhline(y=50, color=GOLD, linestyle='--', linewidth=1.5, alpha=0.7, label='Objectif 50%')

ax.set_ylabel('ROI Cumulatif (%)', fontsize=12)
ax.set_ylim(-2, 58)
ax.legend(fontsize=12, facecolor=CARD_BG, edgecolor=GRID_COLOR,
          labelcolor=TEXT_COLOR, loc='upper left', framealpha=0.95)
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}area_cumulative_roi.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("✅ Area chart done")


# ============================================================
# 2. FUNNEL CHART — Pipeline d'Investissement
# ============================================================
print("Generating funnel_investment_pipeline.png...")

stages = ['Prospection', 'Qualification', 'Due Diligence', 'Négociation', 'Clôture']
values = [100, 72, 48, 28, 12]
stage_colors = [ACCENT, DARK_BLUE, GREEN, GOLD, ORANGE]

fig, ax = plt.subplots(figsize=(12, 8))
fig.patch.set_facecolor(BG_COLOR)
ax.set_facecolor(CARD_BG)
ax.set_title('Pipeline d\'Investissement — InvestFlow Africa',
             fontsize=16, fontweight='bold', color=TEXT_DARK, pad=20)

max_width = 1.0
y_positions = np.arange(len(stages))[::-1]  # bottom to top

for i, (stage, val, color) in enumerate(zip(stages, values, stage_colors)):
    width = (val / values[0]) * max_width
    left = (max_width - width) / 2
    y = y_positions[i]

    # Draw trapezoid shape for funnel
    if i < len(stages) - 1:
        next_width = (values[i + 1] / values[0]) * max_width
        next_left = (max_width - next_width) / 2
    else:
        next_width = width
        next_left = left

    trap = plt.Polygon([
        [left, y - 0.4],
        [left + width, y - 0.4],
        [next_left + next_width, y + 0.4],
        [next_left, y + 0.4],
    ], color=color, alpha=0.85, edgecolor='white', linewidth=2)

    ax.add_patch(trap)

    # Label: value centered
    ax.text(max_width / 2, y, f'{stage}\n({val})',
            ha='center', va='center', fontsize=13, fontweight='bold',
            color='white')

# Conversion rates between stages
for i in range(len(stages) - 1):
    conv_rate = values[i + 1] / values[i] * 100
    y_pos = y_positions[i] + 0.5
    ax.text(max_width + 0.08, y_pos, f'{conv_rate:.0f}%',
            ha='left', va='center', fontsize=10, color=TEXT_COLOR,
            fontstyle='italic')

ax.set_xlim(-0.05, max_width + 0.25)
ax.set_ylim(-1, len(stages))
ax.axis('off')
plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}funnel_investment_pipeline.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("✅ Funnel chart done")


# ============================================================
# 3. RADAR CHART — Analyse Multidimensionnelle
# ============================================================
print("Generating radar_multidimensional.png...")

categories = ['ROI', 'Sécurité', 'Liquidité', 'Diversification', 'Performance', 'Accessibilité']
N = len(categories)

# Target values vs Actual values
target = [9, 8, 7, 9, 8, 8]
actual = [7.5, 8.2, 6.0, 7.8, 7.0, 6.5]

angles = np.linspace(0, 2 * np.pi, N, endpoint=False).tolist()
target += target[:1]
actual += actual[:1]
angles += angles[:1]

fig, ax = plt.subplots(figsize=(10, 10), subplot_kw=dict(polar=True))
fig.patch.set_facecolor(BG_COLOR)
ax.set_facecolor(CARD_BG)

# Draw the radar
ax.plot(angles, target, color=ACCENT, linewidth=2.5, linestyle='--', label='Objectif', zorder=3)
ax.fill(angles, target, alpha=0.1, color=ACCENT)
ax.plot(angles, actual, color=GREEN, linewidth=2.5, label='Réel', zorder=4)
ax.fill(angles, actual, alpha=0.2, color=GREEN)

# Data points
ax.scatter(angles[:-1], target[:-1], color=ACCENT, s=80, zorder=5, edgecolors='white', linewidth=2)
ax.scatter(angles[:-1], actual[:-1], color=GREEN, s=80, zorder=5, edgecolors='white', linewidth=2)

# Value labels for actual
for angle, val in zip(angles[:-1], actual[:-1]):
    ax.text(angle, val + 0.7, f'{val:.1f}', ha='center', va='center',
            fontsize=10, color=GREEN, fontweight='bold')

# Styling
ax.set_xticks(angles[:-1])
ax.set_xticklabels(categories, fontsize=13, fontweight='bold', color=TEXT_DARK)
ax.set_ylim(0, 10)
ax.set_yticks([2, 4, 6, 8, 10])
ax.set_yticklabels(['2', '4', '6', '8', '10'], fontsize=9, color=TEXT_COLOR)
ax.yaxis.grid(color=GRID_COLOR, linestyle='--', alpha=0.7)
ax.xaxis.grid(color=GRID_COLOR, linestyle='--', alpha=0.7)
ax.spines['polar'].set_color(GRID_COLOR)

ax.set_title('Analyse Multidimensionnelle — InvestFlow Africa',
             fontsize=16, fontweight='bold', color=TEXT_DARK, pad=30, y=1.08)
ax.legend(loc='lower right', bbox_to_anchor=(1.25, -0.05),
          fontsize=12, facecolor=CARD_BG, edgecolor=GRID_COLOR,
          labelcolor=TEXT_COLOR, framealpha=0.95)

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}radar_multidimensional.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("✅ Radar chart done")


# ============================================================
# 4. STACKED BAR — Structure des Coûts par Projet
# ============================================================
print("Generating stacked_bar_cost_structure.png...")

np.random.seed(42)
# Cost structure percentages per project
operations   = [35, 38, 32, 40, 30, 36, 34, 33]
personnel    = [25, 22, 28, 24, 26, 25, 23, 27]
infrastructure = [22, 18, 20, 15, 25, 20, 24, 18]
marketing    = [10, 12, 12, 14, 11, 11, 12, 14]
autres       = [8, 10, 8, 7, 8, 8, 7, 8]

x = np.arange(len(names))
width = 0.6

fig, ax = plt.subplots(figsize=(14, 7))
style_chart(fig, ax, 'Structure des Coûts par Projet — InvestFlow Africa (M€)')

# Convert percentages to actual values based on cost
ops_vals   = [c * o / 100 for c, o in zip(costs, operations)]
pers_vals  = [c * p / 100 for c, p in zip(costs, personnel)]
infra_vals = [c * i / 100 for c, i in zip(costs, infrastructure)]
mkt_vals   = [c * m / 100 for c, m in zip(costs, marketing)]
aut_vals   = [c * a / 100 for c, a in zip(costs, autres)]

bottom1 = ops_vals
bottom2 = [b + p for b, p in zip(bottom1, pers_vals)]
bottom3 = [b + i for b, i in zip(bottom2, infra_vals)]
bottom4 = [b + m for b, m in zip(bottom3, mkt_vals)]

stack_colors = [ACCENT, GREEN, DARK_BLUE, GOLD, ORANGE]
stack_labels = ['Opérations', 'Personnel', 'Infrastructure', 'Marketing', 'Autres']

bars1 = ax.bar(x, ops_vals, width, label=stack_labels[0], color=stack_colors[0], edgecolor='white', linewidth=0.5)
bars2 = ax.bar(x, pers_vals, width, bottom=bottom1, label=stack_labels[1], color=stack_colors[1], edgecolor='white', linewidth=0.5)
bars3 = ax.bar(x, infra_vals, width, bottom=bottom2, label=stack_labels[2], color=stack_colors[2], edgecolor='white', linewidth=0.5)
bars4 = ax.bar(x, mkt_vals, width, bottom=bottom3, label=stack_labels[3], color=stack_colors[3], edgecolor='white', linewidth=0.5)
bars5 = ax.bar(x, aut_vals, width, bottom=bottom4, label=stack_labels[4], color=stack_colors[4], edgecolor='white', linewidth=0.5)

# Total cost labels on top
for i, total in enumerate(costs):
    ax.text(i, total + 0.5, f'{total}M€', ha='center', va='bottom',
            fontsize=10, fontweight='bold', color=TEXT_DARK)

ax.set_xticks(x)
ax.set_xticklabels(short_names, fontsize=10, color=TEXT_COLOR)
ax.set_ylabel('Coûts (M€)', fontsize=12)
ax.set_ylim(0, max(costs) + 8)
ax.legend(fontsize=11, facecolor=CARD_BG, edgecolor=GRID_COLOR,
          labelcolor=TEXT_COLOR, loc='upper right', ncol=5, framealpha=0.95)

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}stacked_bar_cost_structure.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("✅ Stacked bar chart done")


# ============================================================
# 5. WATERFALL CHART — Budget → Revenus
# ============================================================
print("Generating waterfall_budget_revenue.png...")

fig, ax = plt.subplots(figsize=(16, 7))
style_chart(fig, ax, 'Analyse en Cascade — Budget, Coûts & Revenus (M€)')

labels = [n.replace(' ', '\n') for n in names] + ['Résultat\nNet']
n_projects = len(names)

# Budgets are positive, costs are negative (reduction), revenues are positive
waterfall_vals = []
colors_wf = []
bottoms = []
running = 0

for i in range(n_projects):
    # Budget
    waterfall_vals.append(budgets[i])
    colors_wf.append(ACCENT)
    bottoms.append(running)
    running += budgets[i]

    # Cost (negative)
    waterfall_vals.append(-costs[i])
    colors_wf.append(RED)
    bottoms.append(running)
    running -= costs[i]

    # Revenue (positive)
    waterfall_vals.append(revenues[i])
    colors_wf.append(GREEN)
    bottoms.append(running)
    running += revenues[i]

# Net result
net_total = sum(revenues) - sum(costs)
waterfall_vals.append(net_total)
colors_wf.append(DARK_BLUE)
bottoms.append(0)  # Net stands alone from zero

x_wf = np.arange(len(waterfall_vals))
bar_labels = []
for i in range(n_projects):
    bar_labels.extend(['Budget', 'Coûts', 'Revenus'])
bar_labels.append('Résultat Net')

# Draw bars
for i, (val, bot, col) in enumerate(zip(waterfall_vals, bottoms, colors_wf)):
    bar = ax.bar(i, abs(val), 0.7, bottom=min(bot, bot + val) if val < 0 else bot,
                 color=col, edgecolor='white', linewidth=0.5, alpha=0.9)

# Connector lines between budget→cost→revenue for each project
for i in range(n_projects):
    base_idx = i * 3
    # After budget bar
    budget_top = bottoms[base_idx] + waterfall_vals[base_idx]
    # After cost bar
    cost_top = bottoms[base_idx + 1] + waterfall_vals[base_idx + 1]
    # After revenue bar
    rev_top = bottoms[base_idx + 2] + waterfall_vals[base_idx + 2]

    # Connect budget to cost
    ax.plot([base_idx + 0.35, base_idx + 0.65], [budget_top, budget_top],
            color=GRID_COLOR, linewidth=1, linestyle='--', alpha=0.5)

    # Connect cost to revenue
    ax.plot([base_idx + 1 + 0.35, base_idx + 1 + 0.65], [cost_top, cost_top],
            color=GRID_COLOR, linewidth=1, linestyle='--', alpha=0.5)

# Value labels
for i, (val, bot) in enumerate(zip(waterfall_vals, bottoms)):
    text_y = bot + val if val >= 0 else bot + val
    label = f'+{val:.1f}' if val > 0 else f'{val:.1f}'
    ax.text(i, text_y + (1 if val >= 0 else -2.5), label,
            ha='center', va='bottom' if val >= 0 else 'top',
            fontsize=7, fontweight='bold', color=TEXT_DARK)

# X-axis: group by project
tick_positions = [i * 3 + 1 for i in range(n_projects)] + [len(waterfall_vals) - 1]
tick_labels = [n.replace(' ', '\n') for n in names] + ['Résultat\nNet']
ax.set_xticks(tick_positions)
ax.set_xticklabels(tick_labels, fontsize=9, color=TEXT_COLOR)

# Separator line before net result
ax.axvline(x=len(waterfall_vals) - 1.5, color=GRID_COLOR, linewidth=1.5, linestyle='-', alpha=0.5)

ax.set_ylabel('Montant (M€)', fontsize=12)

# Custom legend
from matplotlib.patches import Patch
legend_elements = [
    Patch(facecolor=ACCENT, edgecolor='white', label='Budget'),
    Patch(facecolor=RED, edgecolor='white', label='Coûts'),
    Patch(facecolor=GREEN, edgecolor='white', label='Revenus'),
    Patch(facecolor=DARK_BLUE, edgecolor='white', label='Résultat Net'),
]
ax.legend(handles=legend_elements, fontsize=11, facecolor=CARD_BG, edgecolor=GRID_COLOR,
          labelcolor=TEXT_COLOR, loc='upper left', framealpha=0.95)

plt.tight_layout()
plt.savefig(f'{OUTPUT_DIR}waterfall_budget_revenue.png', dpi=200, bbox_inches='tight', facecolor=BG_COLOR)
plt.close()
print("✅ Waterfall chart done")

print("\n🎉 All 5 remaining Nimba-branded charts generated successfully!")
