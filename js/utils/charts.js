const Charts = (() => {
  function lineChart(values, labels, color = "#006038", color2 = "#006a61", values2 = null) {
    const max = Math.max(...values, ...(values2 || [0]));
    const min = Math.min(...values, ...(values2 || [Infinity]));
    const range = max - min || 1;
    const toPts = (arr) => arr.map((v, i) => `${(i / (arr.length - 1)) * 90 + 5},${90 - ((v - min) / range) * 75}`).join(" L ");
    const path1 = `M ${toPts(values)}`;
    const path2 = values2 ? `M ${toPts(values2)}` : null;
    const dots = (arr, c) => arr.map((v, i) => `<circle cx="${(i / (arr.length - 1)) * 90 + 5}" cy="${90 - ((v - min) / range) * 75}" fill="${c}" r="1.6"/>`).join("");
    return `
      <div class="flex-1 bg-grid-pattern rounded-lg border border-surface-variant relative p-4">
        <div class="absolute left-2 top-2 bottom-6 flex flex-col justify-between text-[10px] text-outline font-medium">
          <span>${Math.round(max)}</span><span>${Math.round(min + range / 2)}</span><span>${Math.round(min)}</span>
        </div>
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="${path1}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="${path1} L 95,100 L 5,100 Z" fill="${color}0D"/>
          ${path2 ? `<path d="${path2}" fill="none" stroke="${color2}" stroke-width="2" stroke-dasharray="4 2" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
          ${dots(values, color)}${values2 ? dots(values2, color2) : ""}
        </svg>
        <div class="absolute bottom-1 left-8 right-4 flex justify-between text-[10px] text-outline font-medium">
          ${labels.map((l) => `<span>${Helpers.esc(l)}</span>`).join("")}
        </div>
      </div>`;
  }

  function barChart(values, labels, color = "#006038") {
    const max = Math.max(...values) || 1;
    return `
      <div class="flex-1 bg-grid-pattern rounded-lg border border-surface-variant relative flex items-end justify-between px-lg pb-2 pt-6 gap-2">
        ${values.map((v, i) => `
          <div class="w-full max-w-[48px] bg-primary/20 rounded-t relative group flex items-end" style="height:60%">
            <div class="w-full bg-primary/40 rounded-t relative group" style="height:${(v / max) * 100}%">
              <div class="w-full ${i === values.length - 1 ? "bg-primary" : `bg-primary/${30 + i * 12}`}" style="height:${(v / max) * 100}%"></div>
            </div>
          </div>`).join("")}
        <div class="absolute bottom-1 left-8 right-4 flex justify-between text-[10px] text-outline font-medium">
          ${labels.map((l) => `<span>${Helpers.esc(l)}</span>`).join("")}
        </div>
      </div>`;
  }

  return { lineChart, barChart };
})();
