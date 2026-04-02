import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import os

OUTPUT_DIR = '/home/z/my-project/download/'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ──────────────────────────────────────────────────────────
# Chart 1: Architecture Docker Multi-Stage
# ──────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 6))
stages = ['Stage 1\n(deps)', 'Stage 2\n(builder)', 'Stage 3\n(runner)']
sizes = [152, 318, 82]
colors = ['#2B6CB0', '#f5a524', '#13612e']
bars = ax.bar(stages, sizes, color=colors, width=0.55, edgecolor='white', linewidth=2)

for bar, size in zip(bars, sizes):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 8,
            f'{size} MB', ha='center', va='bottom', fontsize=16, fontweight='bold', color='#1a202c')

ax.set_ylabel('Taille de l\'image (MB)', fontsize=13, fontweight='bold', color='#2d3748')
ax.set_title('Architecture Docker Multi-Stage — Optimisation de la taille', fontsize=15, fontweight='bold', color='#1a202c', pad=15)
ax.set_ylim(0, 400)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#cbd5e0')
ax.spines['bottom'].set_color('#cbd5e0')
ax.tick_params(colors='#4a5568', labelsize=12)
ax.set_facecolor('#fafafa')
fig.patch.set_facecolor('white')

# Add reduction annotation
ax.annotate('Réduction\nde 74%', xy=(2, 82), xytext=(1.2, 260),
            fontsize=13, fontweight='bold', color='#13612e',
            arrowprops=dict(arrowstyle='->', color='#13612e', lw=2),
            ha='center')

plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'chart_docker_architecture.png'), dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print('Chart 1 saved: chart_docker_architecture.png')

# ──────────────────────────────────────────────────────────
# Chart 2: Temps de Déploiement Comparatif
# ──────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(11, 6))
methods = ['Docker\n(Local)', 'Render\n(1er déploiement)', 'Render\n(Redéploiement)', 'Vercel\n(référence)']
times = [120, 180, 60, 45]
colors_bar = ['#2B6CB0', '#f5a524', '#13612e', '#a0aec0']

bars = ax.barh(methods, times, color=colors_bar, height=0.55, edgecolor='white', linewidth=2)
for bar, t in zip(bars, times):
    ax.text(bar.get_width() + 4, bar.get_y() + bar.get_height()/2,
            f'{t}s', ha='left', va='center', fontsize=15, fontweight='bold', color='#2d3748')

ax.set_xlabel('Temps de déploiement (secondes)', fontsize=13, fontweight='bold', color='#2d3748')
ax.set_title('Temps de Déploiement Comparatif', fontsize=15, fontweight='bold', color='#1a202c', pad=15)
ax.set_xlim(0, 220)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#cbd5e0')
ax.spines['bottom'].set_color('#cbd5e0')
ax.tick_params(colors='#4a5568', labelsize=12)
ax.set_facecolor('#fafafa')
fig.patch.set_facecolor('white')

plt.tight_layout()
plt.savefig(os.path.join(OUTPUT_DIR, 'chart_deploy_time.png'), dpi=200, bbox_inches='tight', facecolor='white')
plt.close()
print('Chart 2 saved: chart_deploy_time.png')

print('All charts generated successfully!')
