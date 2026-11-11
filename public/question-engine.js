'use strict';
// Deterministic triage only. Neither external research nor publication occurs.
(function (root) {
  const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFKD').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const words = s => [...new Set(norm(s).split(' ').filter(w => w.length > 3 && !['pueblo','colorado','county','city','about','what','where','when','which','with','from','their','this','that','would','could','should','please'].includes(w)))];
  const safe = s => s && typeof s.title === 'string' && /^https:\/\/[^\s<>"']+$/i.test(String(s.url || ''));
  const valid = r => r && typeof r.id === 'string' && typeof r.summary === 'string' && Array.isArray(r.questions) && Array.isArray(r.sources) && r.sources.some(safe);
  const listed = (a, n = 10) => Array.isArray(a) ? a.slice(0,n) : [];
  function assemble(question, reports, issues = [], catalogSources = [], now = new Date().toISOString().slice(0,10)) {
    const q = String(question == null ? '' : question).trim().slice(0,1000);
    if (q.length < 3) throw new Error('Enter a question of at least three characters.');
    const found = listed(reports,1000).filter(valid).filter(r => r.questions.some(s => norm(s) === norm(q)));
    const direct = found.length === 1 ? found[0] : null;
    const terms = words(q);
    const qyears = [...new Set((q.match(/\b(?:19|20)\d{2}\b/g) || []))];
    const related = listed(reports,1000).filter(valid).filter(r => r !== direct).map(r => {
      const hay = words([r.title,r.topic,r.slug,...listed(r.aliases,20)].join(' '));
      const years = (r.title + ' ' + listed(r.questions,20).join(' ')).match(/\b(?:19|20)\d{2}\b/g) || [];
      const mismatch = qyears.length && years.length && !qyears.every(y => years.includes(y));
      return {report:r,score:mismatch?0:terms.filter(t=>hay.includes(t)).length};
    }).filter(x=>x.score>=2).sort((a,b)=>b.score-a.score || a.report.id.localeCompare(b.report.id)).slice(0,5).map(x=>({id:x.report.id,title:x.report.title,slug:x.report.slug,sourceChecked:x.report.sourceChecked,reviewDue:x.report.reviewDue}));
    const index = listed(issues,10000).map(i => {
      const hay = words([i.id,i.title,i.category,i.domain].join(' '));
      return {issue:i,score:terms.filter(t=>hay.includes(t)).length};
    }).filter(x => x.score >= 2 || norm(x.issue.id) === norm(q)).sort((a,b)=>b.score-a.score).slice(0,8).map(({issue:i})=>({
      id:i.id,title:i.title,lastReviewed:i.lastReviewed,sourceIds:listed(i.sourceIds,20),
      sourceDiscovery:listed(i.sourceIds,20).map(id=>catalogSources.find(s=>s.id===id)).filter(s=>safe(s)).map(s=>({id:s.id,title:s.title,url:s.url,publisher:s.publisher||'Publisher not recorded'}))
    }));
    const checked = direct && /^\d{4}-\d{2}-\d{2}$/.test(direct.sourceChecked || '') ? direct.sourceChecked : null;
    const due = direct && /^\d{4}-\d{2}-\d{2}$/.test(direct.reviewDue || '') ? direct.reviewDue : null;
    const stale = Boolean(due && now > due);
    const sources = direct ? direct.sources.filter(safe).map(s=>({id:s.id,title:s.title,url:s.url,kind:s.kind,checked:s.checked,asOf:s.asOf,scope:s.scope,role:s.role})) : [];
    const sourceIds = new Set(sources.map(s=>s.id));
    const claims = direct ? listed(direct.claims,100).filter(c=>Array.isArray(c.sourceIds) && c.sourceIds.length && c.sourceIds.every(x=>sourceIds.has(x))).map(c=>({id:c.id,claim:c.claim,classification:c.classification,boundary:c.boundary,sourceIds:c.sourceIds})) : [];
    const coverage = direct ? 'AUTHORED_QUESTION_MATCH' : found.length>1 ? 'AMBIGUOUS_MATCH_REVIEW_REQUIRED' : related.length || index.length ? 'RELATED_RECORDS_ONLY' : 'NEW_RESEARCH_LEAD';
    const state = direct ? (stale ? 'DATED_ANSWER_REVIEW_OVERDUE' : 'DATED_ANSWER_SOURCE_ATTRIBUTED') : 'RESEARCH_PENDING_NO_CONFIRMED_ANSWER';
    return {
      schema:'qp-question-triage-v1',question:q,processedAt:new Date(now+'T12:00:00Z').toISOString(),
      state,coverage,answerText:direct?direct.summary:'No source-backed answer has been established for this exact question. The related records and investigation steps are leads, not proof.',
      answerReport:direct,reportId:direct?direct.id:null,reportVersion:direct?direct.version:null,sourceChecked:checked,reviewDue:due,reviewOverdue:stale,
      citations:sources,claims,accountingStages:direct?listed(direct.money,20):[],known:direct?listed(direct.whatKnown,30):[],
      unknowns:direct?listed(direct.unknowns,30):[],counterevidence:direct?direct.counter:null,
      actions:direct?listed(direct.actions,30):[],recordsNeeded:direct?listed(direct.recordsNeeded,30):[],
      relatedReports:related,relatedIssues:index,
      investigation:[
        {step:'Scope',task:'Identify jurisdiction, location, reporting date, responsible custodian and the exact disputed claim.'},
        {step:'Original evidence',task:'Retrieve source record, version, accounting stage, document date, original URL and source owner.'},
        {step:'Challenge',task:'Seek independently originated counterevidence; distinguish corroboration from copies.'},
        {step:'Trace',task:'Check decision authority, contracts, appropriations, obligations, actual payments and measured outcomes separately.'},
        {step:'Effects',task:'Trace evidenced direct, second- and third-order consequences, including costs for families and future services.'},
        {step:'Human review',task:'Record reviewer, disposition, source check dates, corrections and superseded versions before any public update.'}
      ],
      publication:'No new investigation, external search, intake, alert, publication or model training was performed.',
      privacy:'Processed in this browser by the public Qify page; do not include personal, medical, child or confidential information.'
    };
  }
  const api = Object.freeze({assemble,valid,safe});
  if (root) root.QP_QUESTION_ENGINE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : null);
