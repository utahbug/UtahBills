// Existing deep-content regressions deliberately exercise the expanded presentation.
// Default collapsed state and user entry links are covered separately in phase5g.
export async function openEnhancedSections(page){
 await page.locator('.enhanced-detail').waitFor();
 for(const selector of ['#changes','#detailed-votes','.key-actions-disclosure','#supporting-records']){
  const section=page.locator(selector);if(await section.getAttribute('open')===null)await section.locator(':scope > summary').click();
 }
 await page.evaluate(()=>scrollTo(0,0));
}
