import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('https://pmlajespintadasrn.transparencia.topsolutionsrn.com.br/', { waitUntil: 'networkidle0' });
    
    const links = await page.$$eval('a', as => as.map(a => ({ text: a.innerText.trim(), href: a.href })));
    console.log("LINKS ENCONTRADOS:");
    for (let l of links) {
        if (/(PPA|LDO|LOA|Plurianual|Orçamento|Planejamento)/i.test(l.text) || /(ppa|ldo|loa)/i.test(l.href)) {
            console.log(l.text, "=>", l.href);
        }
    }
    
    await browser.close();
})();
