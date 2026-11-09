"""Visual/interactive QA on an isolated about:blank page with all local assets inlined.
Network navigation is disabled by the execution environment; this tests DOM, layout and local JS,
NOT actual Cloudflare deployment, CSP enforcement, or cross-origin behavior.
"""
from playwright.sync_api import sync_playwright
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse,unquote
import base64,json,mimetypes
root=Path('/mnt/data/qp-redesign/public')
out=Path('/mnt/data/qp-redesign/qa');out.mkdir(exist_ok=True)

def inline_file(name):
 soup=BeautifulSoup((root/name).read_text(encoding='utf-8'),'html.parser')
 assets=[]
 for tag in soup.find_all('link',href=True):
  if tag.get('rel')==['stylesheet']:
   p=root/tag['href'].split('?')[0]
   if p.exists():
    st=soup.new_tag('style');st.string=p.read_text(encoding='utf-8');tag.replace_with(st)
 for tag in soup.find_all('img',src=True):
  p=root/tag['src'].split('?')[0]
  if p.exists():
   mime=mimetypes.guess_type(str(p))[0] or 'application/octet-stream'
   tag['src']='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
 for tag in soup.find_all('script',src=True):
  p=root/tag['src'];text=p.read_text(encoding='utf-8') if p.exists() else ''
  tag.extract()
  if p.name=='q-tools.mjs':
   core=(root/'q-tools-core.mjs').read_text().replace('export function','function')
   text=core+'\n'+text.replace("import {computeEE,computeT2Y,computeMoney} from './q-tools-core.mjs';",'')
  else:
   text=text.replace('</script>','<\\/script>')
  assets.append(text)
 # DOM populated before executable scripts so add listeners correctly.
 for code in assets:
  tag=soup.new_tag('script');tag.string=code;soup.body.append(tag)
 # Avoid originating any network request in isolated previews.
 fetch=soup.new_tag('script');fetch.string="window.fetch=async()=>({ok:true,json:async()=>({schema:'qp-official-source-watch-v1',publishedAsOf:'2026-11-09',sources:[],items:[],signals:[]})});"
 soup.head.append(fetch)
 return str(soup)

results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for name,view in [('mobile',{'width':390,'height':844}),('desktop',{'width':1440,'height':900})]:
  for fname in ['index.html','explore.html','reports.html','entities.html','updates.html','observations.html','tools.html','twin.html']:
   page=browser.new_page(viewport=view,device_scale_factor=1)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.set_content(inline_file(fname),wait_until='load');page.wait_for_timeout(150)
   width=page.evaluate('document.documentElement.scrollWidth')
   results.append({'mode':name,'file':fname,'scrollWidth':width,'overflow':width>view['width']+2,'pageErrors':errors[:]})
   if fname in ['index.html','reports.html','tools.html']:
    page.screenshot(path=str(out/f'{name}-{fname}.png'),full_page=False)
   if fname=='index.html' and name=='mobile':
    btn=page.locator('#qp-menu');btn.click();assert btn.get_attribute('aria-expanded')=='true'
    results.append({'check':'mobile menu works','pass':True})
   if fname=='tools.html':
    for typ in ['ee','t2y','money']:
     page.locator(f'#{typ}-form button[type="submit"]').click()
     value=page.locator(f'#{typ}-result').inner_text(timeout=2000)
     results.append({'check':name+' '+typ,'pass':len(value)>55,'detail':value[:115]})
   page.close()
 browser.close()
(out/'qa.json').write_text(json.dumps(results,indent=2))
for x in results:print(x)
if any(x.get('overflow') or x.get('pageErrors') or x.get('pass') is False for x in results):
 print('BROWSER_QA_GAPS');raise SystemExit(1)
print('BROWSER_QA_PASS: isolated document UI and deterministic interactions; not live deployment')
