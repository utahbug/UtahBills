// Open the existing responsive Sort disclosure only when settings are inside it.
export async function billOptions(page){const menu=page.locator(".bill-toolbar .sort-menu");if(await menu.count()&&await menu.locator("#sort").count()&&await menu.getAttribute("open")===null)await menu.locator("summary").click()}
