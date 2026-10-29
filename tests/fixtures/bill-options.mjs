// Open the shared Sort disclosure for retained pagination checks.
export async function billOptions(page){const menu=page.locator('.bill-toolbar .sort-menu');if(await menu.count()&&await menu.getAttribute('open')===null)await menu.locator(':scope>summary').click();if(await menu.count())await menu.locator('.bill-sort-panel:popover-open').waitFor()}
