from pathlib import Path
from playwright.sync_api import sync_playwright
P=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for page_name in ['explore','learn']:
  for width,height in [(320,700),(390,844),(768,1000),(1440,900)]:
   f=P/'public'/page_name/'index.html';html=f.read_text()
   html=html.replace('<link rel="stylesheet" href="./explore.css">','') if page_name=='explore' else html.replace('<link rel="stylesheet" href="./learn.css">','').replace('<script src="./learn.js" defer></script>','')
   if page_name=='learn':
    import re
    html=re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]+>', '', html)
   pg=b.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
   pg.set_content(html)
   pg.add_style_tag(content=(P/'public'/page_name/f'{page_name}.css').read_text())
   if page_name=='learn':pg.add_script_tag(content=(P/'public/learn/learn.js').read_text())
   overflow=pg.evaluate('document.documentElement.scrollWidth - window.innerWidth')
   print(page_name,width,'OVERFLOW',overflow,'main heading',pg.locator('h1').first.is_visible())
   if overflow>3:
    print('  offenders',pg.evaluate("[...document.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>window.innerWidth+3).slice(0,5).map(e=>e.tagName+'.'+e.className)"))
   if width in (390,1440):pg.screenshot(path=str(P/'docs'/f'{page_name}-{width}.png'),full_page=False)
   pg.close()
 b.close()
