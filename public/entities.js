'use strict';
(()=>{
const $=id=>document.getElementById(id);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const data=[
['City of Pueblo','Municipal government','Municipal ordinances, City Council, mayoral administration, city services and adopted municipal budget','https://www.pueblo.us/','City'],
['Pueblo County','County government','Board of County Commissioners, county functions, county services, elections and published county meeting agendas','https://www.pueblocounty.gov/','County'],
['Pueblo Water / Board of Water Works','Public water authority','Pueblo Water service, water quality, supply and its own public records','https://pueblowater.org/','Water'],
['Pueblo Area Council of Governments (PACOG)','Regional planning organization','Intergovernmental body; metropolitan and regional transportation planning among city, county, water, school and district members','https://www.pacog.net/whoispacog','Regional'],
['Pueblo School District 60','School district','School board, K–12 education administration, board meetings and financial transparency','https://www.pueblod60.org/','Education'],
['Pueblo County School District 70','School district','K–12 school administration and district board; jurisdiction distinct from D60','https://www.district70.org/','Education'],
['Pueblo West Metropolitan District','Metropolitan district','Pueblo West water utility, parks and district board decisions and agendas','https://www.pueblowestmetro.us/','District'],
['Pueblo Department of Public Health and Environment','Public health agency','Pueblo County health programs, environmental health and public-health information','https://county.pueblo.org/public-health/pueblo-department-public-health-and-environment','Health'],
['City of Pueblo Finance Department','Municipal finance','City annual budgets, sales-tax data, economic-development reports and financial transparency portal','https://www.pueblo.us/92/Finance','Finance'],
['City of Pueblo City Council','Legislative municipal body','Meeting agendas, adopted ordinances, minutes and council votes','https://www.pueblo.us/list.aspx','City'],
['Colorado Department of Transportation','State agency','State highway planning, capital projects and transport data affecting the region','https://www.codot.gov/','State'],
['Colorado General Assembly','State legislative body','Colorado statutes, introduced bills, fiscal notes and official legislative proceedings','https://leg.colorado.gov/','State']
];
function render(){const q=$('entity-query').value.trim().toLowerCase();const filtered=data.filter(x=>x.join(' ').toLowerCase().includes(q));$('entity-count').textContent=`Showing ${filtered.length} of ${data.length} curated institution starting points. Jurisdiction-specific powers must be checked in original instruments.`;$('entities-results').innerHTML=filtered.map(x=>'<article class="qp-entity-card"><small>'+esc(x[1])+' · '+esc(x[4])+'</small><h2>'+esc(x[0])+'</h2><p>'+esc(x[2])+'</p><a href="'+esc(x[3])+'" target="_blank" rel="noopener noreferrer">Open official source ↗</a><p><a href="qify.html?q='+encodeURIComponent(x[0])+'">Qify a question about this institution →</a></p></article>').join('')||'<p>No match. Try a jurisdiction, school, government or service category.</p>'}
$('entity-query').addEventListener('input',render);render();
})();
