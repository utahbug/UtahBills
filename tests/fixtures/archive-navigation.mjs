// Historical coverage remains available through the shared footer and existing deep links.
export async function openArchive(page){
 await page.locator('footer a[href="#archive/2026"]').click();
 await page.getByRole('heading',{name:'2026 Legislative Archive',exact:true}).waitFor();
}
