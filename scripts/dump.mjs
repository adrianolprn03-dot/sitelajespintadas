import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    try {
        await page.goto('https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/', { waitUntil: 'networkidle0', timeout: 60000 });
        
        // expand possible menus or just dump html
        const html = await page.content();
        fs.writeFileSync('topsolutions_home.html', html);
        console.log('HTML saved.');
        
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
