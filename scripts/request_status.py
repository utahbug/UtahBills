"""Parse the Legislature's all-subject listing, joining only official tracking IDs."""
from html.parser import HTMLParser
import re
STATUS_URL='https://le.utah.gov/bills/billSearch.jsp?sess=2027GS&disp=all&sub=all'
def normalized(text):return ' '.join(text.split())
class StatusListing(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.active=False;self.headers=[];self.cells=None;self.cell=None;self.ident=None;self.rows={};self.tables=0
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='table' and attrs.get('id')=='resultTbl':self.active=True;self.headers=[];self.tables+=1
  if not self.active:return
  if tag=='tr':self.cells=[];self.ident=None;self.anchor=None;self.header=False
  if tag in ('td','th') and self.cells is not None:self.cell='';self.header|=tag=='th'
  if tag=='input' and 'data-trackingid' in attrs:
   assert self.ident is None or self.ident==attrs['data-trackingid'],'Conflicting row tracking IDs'
   self.ident=attrs['data-trackingid'];self.anchor=attrs.get('id')
 def handle_data(self,data):
  if self.active and self.cell is not None:self.cell+=data
 def handle_endtag(self,tag):
  if not self.active:return
  if tag in ('td','th') and self.cell is not None:self.cells.append(normalized(self.cell));self.cell=None
  if tag=='tr' and self.cells is not None:
   if self.header:
    assert self.cells==['Tracking','Bill#','ShortTitle','Sponsor','FloorSponsor','Status'],'Unexpected official status columns'
    self.headers=self.cells
   elif self.cells:
    assert self.headers and len(self.cells)==len(self.headers),'Incomplete official status row'
    assert self.ident and re.fullmatch('[A-Z0-9]+',self.ident),'Missing official tracking ID'
    row=dict(zip(self.headers,self.cells));assert row['Status'] and row['ShortTitle'],'Missing official status/title'
    value=dict(trackingID=self.ident,shortTitle=row['ShortTitle'],officialStatus=row['Status'],officialNumber=row['Bill#'],anchor=self.anchor if self.anchor=='trk'+self.ident else None)
    assert self.ident not in self.rows or self.rows[self.ident]==value,'Conflicting duplicate official statuses'
    self.rows[self.ident]=value
   self.cells=None
  if tag=='table':self.active=False

def parse_statuses(body,session='2027GS'):
 text=body.decode('utf-8-sig');heading=re.search(r'<h1\b[^>]*>(.*?)</h1>',text,re.S|re.I);assert heading and session in normalized(re.sub('<[^>]+>',' ',heading[1])),'Wrong status session'
 parser=StatusListing();parser.feed(text);parser.close()
 assert parser.tables and parser.rows,'No official status rows; reject empty/failed listing'
 return parser.rows

def validate_statuses(body,requests):
 rows=parse_statuses(body)
 for request in requests:
  row=rows.get(request['trackingID']);assert row,'Official status listing missing request '+request['trackingID']
  assert normalized(row['shortTitle'])==normalized(request['shortTitle']),'Request/status title mismatch for '+request['trackingID']
 return rows
