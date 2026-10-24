// Historical coverage remains available through Records and existing deep links.
export async function openArchive(page){
 await page.locator('#session').selectOption('2026');
 await page.getByRole('heading',{name:'2026 Legislative Archive',exact:true}).waitFor();
}
