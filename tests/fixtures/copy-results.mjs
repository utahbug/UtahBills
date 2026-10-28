export const copyControl=page=>page.locator('.copy-control>.copy-results,.unified-copy>summary,.directory-copy>summary');
export async function openCopyMenu(page){const menu=page.locator('.unified-copy,.directory-copy');if(await menu.count()){if(await menu.getAttribute('open')===null)await menu.locator(':scope>summary').click();await menu.locator('.floating-panel:popover-open').waitFor()}}
export async function copyResults(page){await openCopyMenu(page);await page.locator('.copy-results').click()}
export async function keyboardCopy(page){await openCopyMenu(page);await page.locator('.copy-results').focus();await page.keyboard.press('Enter')}
