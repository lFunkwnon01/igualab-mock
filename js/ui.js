const UI = (() => {
  return {
    esc: (s) => Helpers.esc(s),
    money: (n) => Helpers.money(n),
    toast: (msg, type) => Toast.show(msg, type),
    modal: (html, opts) => Modal.open(html, opts),
    closeModal: () => Modal.close(),
    estadoBadge: (estado) => Badges.estadoBadge(estado),
    lineChart: (values, labels, color, color2, values2) => Charts.lineChart(values, labels, color, color2, values2),
    barChart: (values, labels, color) => Charts.barChart(values, labels, color),
    kpiCard: (opts) => Cards.kpiCard(opts),
    sectionHeader: (titulo, sub, acciones) => Cards.sectionHeader(titulo, sub, acciones)
  };
})();
