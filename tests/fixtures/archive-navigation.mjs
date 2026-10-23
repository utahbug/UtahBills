// Historical coverage now enters through its approved contextual archive link.
export async function openArchive(page){
 if(await page.getByRole('heading',{name:'2026 Legislative Archive',exact:true}).count())return;
 await page.getByRole('link',{name:'2026 Legislative Archive',exact:true}).click();
 await page.getByRole('heading',{name:'2026 Legislative Archive',exact:true}).waitFor();
}
