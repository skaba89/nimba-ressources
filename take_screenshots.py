#!/usr/bin/env python3
"""Take screenshots of InvestFlow Africa running on localhost:3000"""

import asyncio
import os

async def take_screenshots():
    from playwright.async_api import async_playwright

    out_dir = '/home/z/my-project/download/preview'
    os.makedirs(out_dir, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        url = 'http://localhost:3000'
        
        # 1. Hero section
        print('Capturing Hero...')
        await page.goto(url, wait_until='networkidle', timeout=30000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f'{out_dir}/01_hero.png', full_page=False)
        
        # 2. Trust band + Dashboard
        print('Capturing Dashboard...')
        await page.evaluate('document.querySelector("#dashboard").scrollIntoView({behavior: "smooth"})')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f'{out_dir}/02_dashboard_kpis.png', full_page=False)

        # 3. Charts area
        print('Capturing Charts...')
        await page.evaluate('window.scrollBy(0, 500)')
        await page.wait_for_timeout(1500)
        await page.screenshot(path=f'{out_dir}/03_charts.png', full_page=False)

        # 4. ROI Simulator
        print('Capturing Simulator...')
        await page.evaluate('document.querySelector("#simulateur").scrollIntoView({behavior: "smooth"})')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f'{out_dir}/04_simulateur_roi.png', full_page=False)
        
        # Type a budget value to show input
        budget_input = page.locator('input[type="number"]')
        if await budget_input.count() > 0:
            await budget_input.fill('45')
            await page.wait_for_timeout(500)
            await page.screenshot(path=f'{out_dir}/05_simulateur_input.png', full_page=False)
        
        # 5. Projects section
        print('Capturing Projects...')
        await page.evaluate('document.querySelector("#projets").scrollIntoView({behavior: "smooth"})')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f'{out_dir}/06_projets.png', full_page=False)

        # 6. Demo / Pitch section
        print('Capturing Demo/Pitch...')
        await page.evaluate('document.querySelector("#demo").scrollIntoView({behavior: "smooth"})')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f'{out_dir}/07_demo_pitch.png', full_page=False)

        # 7. Analytics section
        print('Capturing Analytics...')
        await page.evaluate('document.querySelector("#analytics").scrollIntoView({behavior: "smooth"})')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f'{out_dir}/08_analytics.png', full_page=False)

        # 8. Testimonials
        print('Capturing Testimonials...')
        await page.evaluate('document.querySelector("#temoignages").scrollIntoView({behavior: "smooth"})')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f'{out_dir}/09_temoignages.png', full_page=False)

        # 9. Pricing
        print('Capturing Pricing...')
        await page.evaluate('document.querySelector("#tarifs").scrollIntoView({behavior: "smooth"})')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f'{out_dir}/10_tarifs.png', full_page=False)

        # 10. Contact + Footer
        print('Capturing Contact + Footer...')
        await page.evaluate('document.querySelector("#contact").scrollIntoView({behavior: "smooth"})')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=f'{out_dir}/11_contact_footer.png', full_page=False)

        await browser.close()
        print(f'\n✅ All screenshots saved to {out_dir}/')

if __name__ == '__main__':
    asyncio.run(take_screenshots())
