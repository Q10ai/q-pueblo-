'use strict';
// Q-Pueblo client-only selection: a lexical match is not a newly verified civic fact.
(() => {
  const stop = new Set(['what','which','when','where','who','whom','whose','why','how','much','many','does','did','have','has','had','been','are','was','were','can','could','would','should','about','from','with','their','that','this','these','those','into','than','then','there','they','them','your','pueblo','city','county','colorado','local','public','please','tell','show','find','report','reports','issue','project','actual','actually','recent','latest','current']);
  const terms = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(Boolean);
  const unique = value => [...new Set(terms(value).filter(w => (w.length >= 4 || /^(?:19|20)\d{2}$/.test(w)) && !stop.has(w)))];
  const years = value => new Set(terms(value).filter(w => /^(?:19|20)\d{2}$/.test(w)));
  const sourceValid = s => s && typeof s.title === 'string' && /^https:\/\/[^\s<>"']+$/i.test(String(s.url || ''));
  const reportValid = r => r && typeof r.id === 'string' && typeof r.slug === 'string' && typeof r.title === 'string' && typeof r.summary === 'string' && typeof r.date === 'string' && Array.isArray(r.sources) && r.sources.some(sourceValid);
  function selectReport(query, reports) {
    if (!Array.isArray(reports)) return null;
    const q = unique(query), qYears = years(query);
    if (!q.length) return null;
    // A question about disbursements must not receive an authorization or
    // commitment figure as though it were paid. Financial stages are not synonyms.
    const askedPaid = /\b(spent|spending|expenditure|paid|payment|disbursed|disbursement|invoiced|collected|receipts|received)\b/i.test(query);
    const paidAnchors = ['actually paid','paid to date','total expenditure','expenditures through','actual collections'];
    if (askedPaid && !reports.some(r => reportValid(r) && paidAnchors.some(a => String(r.summary).toLowerCase().includes(a)))) {
      return null;
    }
    const ranked = reports.filter(reportValid).map(report => {
      const title = new Set(unique([report.title,report.slug,report.id,report.topic || ''].join(' ')));
      const context = new Set(unique([report.summary,report.what || ''].join(' ')));
      const subjectTerms = new Set(['budget','nonprofit','road','water','schools','school','election','airport','csac','half','cent','flood','police','tax','fire','housing']);
      if (q.some(t => subjectTerms.has(t) && !title.has(t))) return null;
      const reportYears = years(report.title + ' ' + report.slug);
      if (qYears.size && reportYears.size && ![...qYears].every(y => reportYears.has(y))) return null;
      const strong = q.filter(t => title.has(t)), weak = q.filter(t => !title.has(t) && context.has(t));
      const distinct = strong.length + weak.length;
      if (distinct / q.length < 0.6) return null;
      const named = q.some(t => t.length >= 4 && (terms(report.slug).includes(t) || terms(report.id).includes(t)) && !/^(?:19|20)\d{2}$/.test(t));
      if (!named && (strong.length < 2 || distinct < 2)) return null;
      if (named && strong.length < 1) return null;
      const score = 3 * strong.length + weak.length + (named ? 3 : 0);
      return {report,score,strong,weak};
    }).filter(Boolean).sort((a,b) => b.score - a.score || a.report.id.localeCompare(b.report.id));
    if (!ranked.length || (ranked.length > 1 && ranked[0].score === ranked[1].score)) return null;
    return {...ranked[0],status:'DATED_PUBLISHED_BRIEF_MATCH_NOT_LIVE_VERIFICATION'};
  }
  const api = Object.freeze({selectReport,reportValid});
  if (typeof window !== 'undefined') window.QP_QIFY_MATCH = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
