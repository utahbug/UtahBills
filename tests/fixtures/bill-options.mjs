// Open the existing responsive More disclosure only when settings are inside it.
export async function billOptions(page){const menu=page.locator('.bill-toolbar .export-menu');if(await menu.count()&&await menu.locator('#sort').count()&&await menu.getAttribute('open')===null)await menu.locator('summary').click()}
