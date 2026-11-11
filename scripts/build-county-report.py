#!/usr/bin/env python3
"""Build the citizen report and PDF from one independently sourced record."""
import argparse, hashlib, html, json
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'research/region/reports/county-budget-20261110/report.json'

def esc(value): return html.escape(str(value), quote=True)

def build_html(r):
    refs = {s['id']:s for s in r['sources']}
    def citations(ids):
        return '<p class="citations">'+ ' · '.join('<a href="#source-'+i+'">'+esc(i)+'</a>' if i!='CALC' else '<a href="#calculations">Our calculations</a>' for i in ids)+'</p>'
    def table(headers, rows):
        return '<div class="table-wrap"><table><thead><tr>'+''.join('<th scope="col">'+esc(x)+'</th>' for x in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+esc(x)+'</td>' for x in row)+'</tr>' for row in rows)+'</tbody></table></div>'
    def para(s): return '<p>'+esc(s)+'</p>'
    m=r['money']
    h=['<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="A complete, source-attributed explanation of Pueblo County’s 2027 budget proposal, with Qified findings, money, tradeoffs and practical next steps."><title>Pueblo County budget: Report 1 | Q-Pueblo</title><link rel="stylesheet" href="county-budget-report.css"><script defer src="county-budget-report.js"></script></head><body><a class="skip" href="#main">Skip to report</a><header><a class="brand" href="index.html">Q<span>•</span>PUEBLO</a><p>Know Pueblo. Help shape its future.</p><nav aria-label="Report navigation"><a href="#answer">Quick answer</a><a href="#findings">Full findings</a><a href="#qified">Qified insight</a><a href="#resources">Get involved</a><a href="#sources">Sources</a></nav></header><main id="main">',
       '<div class="review">Publication review copy · Independently researched from public records · All 2027 amounts remain proposed</div>',
       '<section class="hero"><p class="eyebrow">REPORT 1 · COUNTY SPENDING AND PUBLIC SERVICES</p><h1>'+esc(r['title'])+'</h1><p class="subtitle">'+esc(r['subtitle'])+'</p><p class="meta">Updated November 10, 2026 · '+esc(r['scope'])+'</p></section>',
       '<section class="answer" id="answer"><h2>The answer</h2>'+para(r['answer'])+'<div class="metrics"><div><strong>$9.81M</strong><span>Proposed spending reductions</span></div><div><strong>$1.265M</strong><span>Stated annual surplus after reductions</span></div><div><strong>1.03%</strong><span>Surplus relative to funding sources</span></div></div><p><strong>'+esc(r['verdict'])+'</strong></p><button class="help" type="button" data-term="surplus">What does surplus mean?</button> <button class="help" type="button" data-term="fund">What is a fund?</button></section>',
       '<section id="findings"><p class="eyebrow">THE FULL REPORT</p><h2>What the records show</h2>'+table(['General Fund item','Amount','What it represents'],r['factRows'])+citations(['S1'])]
    for i,f in enumerate(r['findings']):
        h+=['<article class="finding"><h3>'+esc(f['title'])+'</h3>'+''.join(para(p) for p in f['paragraphs'])]
        if i==1: h+=[table(['Fund','Projected end of 2027','How to read it'],r['fundRows'])]
        h+=[citations(f['sources'])+'</article>']
    h+=['<aside class="balanced"><h3>What could point in a different direction?</h3>'+para(r['counterevidence'])+'</aside></section>',
        '<section class="qified" id="qified"><p class="eyebrow">QIFIED INSIGHT</p><h2>What the connected picture tells us</h2><p>Qified means bringing evidence together to explain connections, consequences and useful choices.</p>']
    h+=['<article><h3>'+esc(q['title'])+'</h3>'+para(q['text'])+'</article>' for q in r['qified']]
    h +=[table(['Connected issue','What to connect','Evidence to check'],r['connections'])+'<p class="citations">Q-Pueblo analysis and recommendations; based on S1-S3. Connections do not establish a particular service cut, legal duty or wrongdoing.</p></section>',
         '<section id="calculations"><p class="eyebrow">TRY THE ASSUMPTIONS</p><h2>How much room does the plan have?</h2><p>These are isolated illustrations using the County’s stated surplus. They are not forecasts. Every other assumption is held unchanged.</p><div class="scenario" data-revenue="'+str(m['revenue'])+'" data-reductions="'+str(m['reductions'])+'" data-surplus="'+str(m['statedSurplus'])+'"><div class="scenario-input"><label for="revenue-loss">Revenue below plan (%)</label><input id="revenue-loss" type="number" min="0" max="20" step="0.1" value="1"><label for="savings-delivered">Planned reductions achieved (%)</label><input id="savings-delivered" type="number" min="0" max="100" step="1" value="100"></div><p id="scenario-result" role="status" aria-live="polite"><strong>About $38,097 surplus</strong> with a 1% revenue shortfall and all planned reductions achieved.</p><p class="small">Calculated in your browser. Nothing is sent or saved.</p></div>',
         table(['Illustration','Annual result','Meaning'],[['Proposal as stated','$1,264,763 surplus','County’s stated result'],['Revenue 1% below plan; full reductions','$38,097 surplus','Almost all of the planned cushion is consumed'],['Only 80% of reductions; revenue as planned','$697,531 shortfall','Illustrates under-delivery of the reduction plan']]),
         '<details><summary>Show the arithmetic and its limits</summary><p>Illustrative result = stated surplus − (proposed revenue × revenue shortfall %) − (planned reductions × undelivered share).</p><p>Surplus share = $1,264,763 ÷ $122,666,601 = 1.0311%. The proposed spending equals $131,213,309 − $9,811,472 = $121,401,837.</p><p>The book’s displayed revenue minus proposed spending is $1,264,764; its stated surplus is $1,264,763. We preserve the stated result and flag the $1 difference. The example is not a cash forecast, reserve estimate or causal prediction.</p></details></section>',
         '<section><h2>What should be measured next?</h2>'+table(['Check','Measure','When'],r['scorecard'])+'<p class="citations">Q-Pueblo recommended reporting measures; no claim that this scorecard is already implemented.</p></section>',
         '<section id="resources"><p class="eyebrow">USE THE REPORT</p><h2>Your next steps</h2><div class="next-event"><strong>Next scheduled decision</strong>'+para(r['nextEvent'])+citations(['S4','S7'])+'</div><div class="resources">']
    for res in r['resources']:
        h+=['<article><h3><a href="'+esc(res['url'])+'" rel="noopener noreferrer" target="_blank">'+esc(res['title'])+' ↗</a></h3><p><strong>For:</strong> '+esc(res['who'])+'</p>'+para(res['use'])+'</article>']
    h+=['</div><h3>Questions you can take to the County</h3><p>This is an unsent draft. Copying it does not submit a request or authorize a fee.</p><ol id="questions">'+''.join('<li>'+esc(q)+'</li>' for q in r['questions'])+'</ol><button type="button" id="copy-questions">Copy questions</button><span id="copy-status" role="status"></span></section>',
        '<section class="limits"><h2>What we still cannot confirm</h2><ul>'+''.join('<li>'+esc(u)+'</li>' for u in r['unknowns'])+'</ul><p>These limits concern the underlying evidence. The report gives a completed explanation of what the reviewed records support; it does not certify the County’s actual financial condition.</p></section>',
        '<section id="sources"><p class="eyebrow">CHECK OUR WORK</p><h2>Sources and method</h2>'+para(r['method'])]
    for s in r['sources']:
        h+=['<article class="source" id="source-'+s['id']+'"><h3>'+esc(s['id'])+' · <a href="'+esc(s['url'])+'" rel="noopener noreferrer" target="_blank">'+esc(s['title'])+'</a></h3><p class="small">'+esc(s['date'])+'</p>'+para(s['scope'])+'</article>']
    h+=[ '<h3>Updates and corrections</h3>'+para(r['updateRule'])+'<p class="small">Report version 1.0.0 · Research checked November 10, 2026, America/Denver · Source-based analysis, not an audit. Human publication review remains open.</p></section></main><footer><strong>Q-PUEBLO</strong><p>Independent and nonpartisan. AI assists; people decide.</p><button type="button" id="print-report">Print or save this report</button><p>Information and calculations are presented for public understanding. Read the dates, scope and source limits.</p></footer><dialog id="help-dialog" aria-labelledby="help-title"><h2 id="help-title"></h2><p id="help-body"></p><button id="close-help" type="button">Close</button></dialog></body></html>']
    return '\n'.join(h)

def build_pdf(r, output):
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
    from reportlab.lib import colors
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_LEFT
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.lib.pagesizes import letter
    font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    pdfmetrics.registerFont(TTFont('QSans',font)); pdfmetrics.registerFont(TTFont('QSansBold',bold))
    pdfmetrics.registerFontFamily('QSans',normal='QSans',bold='QSansBold',italic='QSans',boldItalic='QSansBold')
    styles=getSampleStyleSheet()
    for key in ['Normal','BodyText','Heading1','Heading2','Heading3']:
        styles[key].fontName='QSans';styles[key].textColor=colors.HexColor('#142634')
    styles['BodyText'].fontSize=9.4;styles['BodyText'].leading=14.5;styles['BodyText'].spaceAfter=9
    styles['Heading1'].fontName='QSansBold';styles['Heading1'].fontSize=23;styles['Heading1'].leading=29;styles['Heading1'].spaceAfter=15
    styles['Heading2'].fontName='QSansBold';styles['Heading2'].fontSize=16;styles['Heading2'].leading=21;styles['Heading2'].spaceBefore=6;styles['Heading2'].spaceAfter=12
    styles['Heading3'].fontName='QSansBold';styles['Heading3'].fontSize=11;styles['Heading3'].leading=16;styles['Heading3'].spaceBefore=7;styles['Heading3'].spaceAfter=6
    styles.add(ParagraphStyle(name='SmallQ',fontName='QSans',fontSize=8,leading=11.5,spaceAfter=6,textColor=colors.HexColor('#48606a'),wordWrap='CJK'))
    styles.add(ParagraphStyle(name='CellQ',fontName='QSans',fontSize=8.2,leading=12,spaceAfter=0))
    styles.add(ParagraphStyle(name='KickerQ',fontName='QSansBold',fontSize=9,leading=13,textColor=colors.HexColor('#006b65'),spaceAfter=10))
    story=[]
    def p(text,style='BodyText'):return Paragraph(escape(str(text)),styles[style])
    def table(headers,rows,widths):
        data=[[p(x,'CellQ') for x in headers]]+[[p(x,'CellQ') for x in row] for row in rows]
        t=Table(data,colWidths=widths,repeatRows=1,hAlign='LEFT')
        t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#dbefeb')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.HexColor('#f4f7f5'),colors.white]),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,0),(-1,0),.7,colors.HexColor('#92b4ac'))]))
        return t
    def refs(ids):return p('Sources: '+', '.join(ids)+'. CALC means Q-Pueblo calculation.','SmallQ')
    story += [p('Q-PUEBLO / REPORT 1','KickerQ'),p(r['title'],'Heading1'),p(r['subtitle'],'Heading3'),p('Updated November 10, 2026 | Publication review copy','SmallQ'),p(r['scope'],'SmallQ'),Spacer(1,9),p('The answer','Heading2'),p(r['answer']),p(r['verdict'],'Heading3'),Spacer(1,10),table(['General Fund item','Amount','How to read it'],r['factRows'],[194,105,205]),refs(['S1']),p('All 2027 figures are proposals. This report explains reviewed public records; it does not certify actual savings, cash or service levels.','SmallQ'),PageBreak()]
    story+=[p('What the records show','Heading2')]
    for f in r['findings'][:3]:
        story+=[p(f['title'],'Heading3')]+[p(x) for x in f['paragraphs']]+[refs(f['sources'])]
        if f is r['findings'][1]:story+=[table(['Fund','2027 projected ending balance','Meaning'],r['fundRows'],[135,130,239]),Spacer(1,8)]
    story+=[PageBreak(),p('Qified insight','KickerQ'),p('The connected picture','Heading2'),p('Qified means bringing evidence together to explain connections, consequences and useful choices.')]
    for q in r['qified']:story+=[p(q['title'],'Heading3'),p(q['text'])]
    story+=[p('These are Q-Pueblo analytical judgments and recommendations based on S1-S3. A possible cost shift is not a documented service cut.','SmallQ'),PageBreak(),p('Test the plan before calling it recovery','Heading2')]
    for f in r['findings'][3:]:story+=[p(f['title'],'Heading3')]+[p(x) for x in f['paragraphs']]+[refs(f['sources'])]
    story+=[table(['Illustration','Annual result'],[['Proposal as stated','$1,264,763 surplus'],['Revenue 1% below plan; full reductions','$38,097 surplus'],['Only 80% of reductions; revenue as planned','$697,531 shortfall']],[315,189]),Spacer(1,10),p('Reproduce the stress tests','Heading3'),p('Illustrative annual result = stated surplus - (proposed revenue x revenue shortfall) - (planned reductions x undelivered share). Percentages must be expressed as decimals. Every other assumption is unchanged. These are not forecasts or cash projections.'),p('Example: $1,264,763 - ($122,666,601 x 0.01) = $38,096.99. Example: $1,264,763 - ($9,811,472 x 0.20) = -$697,531.40.','SmallQ'),p('What could point in a different direction?','Heading3'),p(r['counterevidence']),PageBreak(),p('Follow the money and the service','Heading2'),table(['Connected issue','What to connect','Evidence to check'],r['connections'],[110,199,195]),Spacer(1,14),table(['Check','Measure','When'],r['scorecard'],[100,240,164]),p('Q-Pueblo recommended measures. This scorecard is not represented as an existing County reporting system.','SmallQ'),PageBreak(),p('Your next steps','Heading2'),p(r['nextEvent']),refs(['S4','S7'])]
    for res in r['resources']:
        story+=[p(res['title'],'Heading3'),p(res['use']),Paragraph('<link href="'+escape(res['url'],{'"':'&quot;'})+'">'+escape(res['url'])+'</link>',styles['SmallQ'])]
    story+=[PageBreak(),p('Questions you can take to the County','Heading2'),p('Unsent draft. No message or public-records request has been submitted.')]
    for i,q in enumerate(r['questions'],1):story+=[p(str(i)+'. '+q)]
    story+=[Spacer(1,16),p('Limits, sources and updates','Heading2'),p('What we still cannot confirm','Heading3')]
    story+=[p('- '+u) for u in r['unknowns']]
    story+=[p('How we did the work','Heading3'),p(r['method'])]
    for s in r['sources']:
        story+=[KeepTogether([p(s['id']+' | '+s['title'],'Heading3'),p(s['date']+'. '+s['scope'],'SmallQ'),Paragraph('<link href="'+escape(s['url'],{'"':'&quot;'})+'">'+escape(s['url'])+'</link>',styles['SmallQ'])])]
    story+=[p('Updates and corrections','Heading3'),p(r['updateRule']),p('Report version 1.0.0. Human publication review remains open.','SmallQ')]
    def frame(canvas,doc):
        canvas.saveState();canvas.setFillColor(colors.HexColor('#006b65'));canvas.setFont('QSansBold',8);canvas.drawString(54,758,'Q-PUEBLO  |  COUNTY BUDGET & PUBLIC SERVICES')
        canvas.setStrokeColor(colors.HexColor('#c2d8d2'));canvas.line(54,748,558,748);canvas.setFont('QSans',7);canvas.setFillColor(colors.HexColor('#48606a'));canvas.drawString(54,30,'November 10, 2026  |  Source-based analysis; 2027 figures remain proposed');canvas.drawRightString(558,30,str(doc.page));canvas.restoreState()
    doc=SimpleDocTemplate(str(output),pagesize=letter,rightMargin=54,leftMargin=54,topMargin=60,bottomMargin=54,title=r['title'],author='Q-Pueblo')
    doc.build(story,onFirstPage=frame,onLaterPages=frame)

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output-dir',type=Path,required=True);args=parser.parse_args()
    r=json.loads(DATA.read_text());args.output_dir.mkdir(parents=True,exist_ok=True)
    text=build_html(r);(ROOT/'public/county-budget-report.html').write_text(text)
    css=(ROOT/'public/county-budget-report.css').read_text();js=(ROOT/'public/county-budget-report.js').read_text()
    standalone=text.replace('<link rel="stylesheet" href="county-budget-report.css">','<style>'+css+'</style>').replace('<script defer src="county-budget-report.js"></script>','<script>'+js+'</script>').replace('href="index.html"','href="#main"')
    html_path=args.output_dir/'Q-Pueblo-Report-1-County-Budget-2026-11-10.html';html_path.write_text(standalone)
    pdf_path=args.output_dir/'Q-Pueblo-Report-1-County-Budget-2026-11-10.pdf';build_pdf(r,pdf_path)
    print(json.dumps({'html':str(html_path),'pdf':str(pdf_path),'sourceBased':True,'releaseApproved':False}))

if __name__=='__main__': main()
