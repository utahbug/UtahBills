"""Shared extraction of proposed statutory text; no legal-effect interpretation."""
def text(e,mode):
    if (mode=='before' and e.get('ea')=='amend') or (mode=='after' and e.get('ea')=='erase'): return ''
    if e.tag in ['secline','catline']: return ''
    s=e.text or ''
    for c in e: s+=text(c,mode)+(c.tail or '')
    if e.tag in ['ln','tab','display']: s+=' '
    if e.tag in ['subsection','sectionText']: s+='\n'
    return s
