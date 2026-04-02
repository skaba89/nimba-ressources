import subprocess, time, asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox'])
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('http://127.0.0.1:3000', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(3000)
        await page.screenshot(path='/home/z/my-project/download/preview_01_hero.png')
        print("1/9 Hero")

        for idx, sel in enumerate(['#dashboard','#simulateur','#projets','#pipeline','#analytics','#temoignages','#tarifs','#contact'], 2):
            await page.evaluate(f"document.querySelector('{sel}')?.scrollIntoView({{behavior:'instant'}})")
            await page.wait_for_timeout(2000)
            names = {2:'dashboard',3:'simulateur',4:'projets',5:'pipeline',6:'analytics',7:'temoignages',8:'tarifs',9:'contact'}
            await page.screenshot(path=f'/home/z/my-project/download/preview_{idx:02d}_{names[idx]}.png')
            print(f"{idx}/9 {names[idx]}")
        await browser.close()
        print("All screenshots captured!")

asyncio.run(main())
