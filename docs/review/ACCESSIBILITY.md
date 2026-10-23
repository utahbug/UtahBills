# Human device and assistive-technology acceptance worksheet

**All results pending. No physical-device, VoiceOver, NVDA or human keyboard acceptance is claimed.** This operational worksheet expands [Phase 4R's acceptance requirements](../PHASE4R_READINESS.md#ui-001--human-accessibility); it does not duplicate automated certification. Target: WCAG 2.2 AA. Owner supplies reviewers/devices and decides the supported browser matrix. [Package overview](README.md).

## Run record — copy for each environment

| Field | Record |
| --- | --- |
| Run ID / reviewer identity or role / date | Pending |
| Physical device model / OS and version | Pending |
| Browser and version / orientation / viewport | Pending |
| Assistive technology and version / input method | Pending |
| Text size, browser zoom, display scaling, contrast settings | Pending |
| Main commit / URL / source snapshot dates | Pending |
| Test IDs executed / actual outcomes / evidence location | Pending |
| Limitations, untested combinations and reason | Pending |
| Reviewer disposition / owner acknowledgement | Pending |

Use P = pass, F = fail, B = blocked, N = not tested. “N” never means pass. Record actual behavior, not just a tick. On a new commit, record whether each earlier result remains applicable; retest affected tasks. Do not submit real addresses to test the official district-finder fallback.

## Required environment passes

| ID | Physical environment and mode | Required exercises | Actual outcome / run ID |
| --- | --- | --- | --- |
| E1 | iPhone, Safari, touch; portrait and landscape | T01–T12, T14–T16, T18; normal and enlarged OS/browser text | N — pending |
| E2 | iPhone, Safari + VoiceOver | T01–T18 using swipe, explore-by-touch and rotor; record spoken output | N — pending |
| E3 | iPad, Safari, touch; portrait/landscape and split view where supported | T01–T12, T14–T16, T18; enlarged text; external keyboard if available | N — pending |
| E4 | iPad + VoiceOver | T01–T18, especially Calendar/table context and dialog focus | N — pending |
| E5 | Windows desktop, Edge or Chrome, keyboard only | T01–T18; real browser 200% zoom, and narrow reflow equivalent to 320 CSS pixels | N — pending |
| E6 | Windows desktop, NVDA + selected browser | T01–T18; browse/focus modes, heading/table/link navigation and announcements | N — pending |
| E7 | Additional supported desktop browser selected by owner (e.g. Firefox or macOS Safari) | T01–T18 with keyboard, browser zoom and text enlargement; record unavailable AT separately | N — pending |

Run all listed tasks in each applicable environment. A physical iPad is not replaceable by desktop emulation. CSS zoom is not evidence of actual browser zoom. The matrix samples essential workflows; reviewer must also record any remaining WCAG criteria/scope needing evaluation before claiming full acceptance.

## Task cards

Use Main's existing navigation; these are stable routes, not new environments. If source data changes, record an equivalent real record and its exact ID. Preserve the stated verification state in the test; do not fabricate a discrepancy.

| ID | Route / steps | Expected result | Actual outcome / evidence / finding ID |
| --- | --- | --- | --- |
| T01 | Start at [Bills](https://utahbug.github.io/UtahBills/#bills); use skip link, Tab/Shift+Tab and all primary/footer links | Skip reaches main; logical order and visible focus; active route announced; all destinations reachable without a pointer | N — pending |
| T02 | On Bills, Activity, Calendar and a long detail: top, middle, bottom; focus navigation while scrolled; change route and use Back/Forward | Compact sticky header preserves navigation; no overlap/clipping or hidden focused controls; normal header returns at top; headings/anchors remain visible | N — pending |
| T03 | Bills: select historical 2026, search HB0011, adjust filters/sort/page size, clear; switch to 2027 requests and back | Labels/current values understandable; results and empty states accurate; no unexpected focus loss or stale session content; pagination state understandable | N — pending |
| T04 | [Public requests](https://utahbug.github.io/UtahBills/#requests): search VYQQDPXGUY and DFTEVYMLXT; read counts, status and source disclosure | At Phase 4R: 273 visible / 272 verified / one unconfirmed. Unconfirmed General Oversight remains neutrally flagged; Reauthorization shows In Process. If changed, validate against new saved source instead of forcing old counts | N — pending |
| T05 | Request detail: open Source details, scroll its long content; close by button and Escape; separately open status Info | Accessible dialog name; focus enters/restores appropriately, cannot get lost behind modal; long text scrolls; status Info and source evidence are distinct; touch close works | N — pending |
| T06 | [Recent Activity](https://utahbug.github.io/UtahBills/#activity): date/category filters, All Activity, pagination, event detail and Back | Controls and count changes understandable/announced; links resolve to correct record; observation dates not spoken as official submission dates; empty state does not claim no legislative work | N — pending |
| T07 | [Calendar](https://utahbug.github.io/UtahBills/#calendar): month/category, a populated date, agenda, month reset and Legend/Info | Day/date/weekday and selected state understandable; chronological reading; no misleading empty-day inference; official agenda link identifiable; filter changes do not trap focus | N — pending |
| T08 | [Legislators](https://utahbug.github.io/UtahBills/#legislators): search/filter, open profile, sponsored bill and return; inspect finder disclosure | Historical year/current-contact distinction announced; correct associated links; official finder clearly external; no unexpected address collection or geolocation; unavailable 2027 roster explicit | N — pending |
| T09 | [About](https://utahbug.github.io/UtahBills/#about), [FAQ](https://utahbug.github.io/UtahBills/#faq), legacy sources/guide routes and section links | Sensible heading hierarchy/rotor; old links work; anchors visible below header; source/date/correction limitations readable; external/new-tab behavior identified | N — pending |
| T10 | HB0011 and SB0069 details: explanation version, reader, comparison selectors; choose identical versions then different versions | Version names identifiable; additions/deletions readable without color alone and with AT; identical text identified; section order usable; source links distinguish proposed versus enrolled text | N — pending |
| T11 | HB0117 detail and WALTER historical profile: vote table/history, conflict disclosure, original sources | Question/tally/header context understandable; conflict remains flagged with individual attribution withheld; unresolved historical identities are not silently reassigned; horizontal table scrolling remains operable | N — pending |
| T12 | Copy on Bills, requests, Activity, Calendar and Legislators | Accessible name; activation copies intended visible scope; confirmation is perceivable/announced without moving focus or controls; no hidden stale data | N — pending |
| T13 | Repeat Copy with clipboard denied/unavailable using a documented browser permission setting; restore setting afterward | Usable fallback presents selectable text and clear instructions; keyboard/AT can select/copy it and move onward without a focus trap; failure does not claim success. If environment cannot induce denial, mark B with reason; do not claim fallback acceptance | N — pending |
| T14 | Repeat representative list/detail/Calendar and About at enlarged text and 200% real browser zoom; narrow viewport/reflow | No lost content/control overlap or page-wide horizontal scroll; long source/hash/table content has usable contained handling; text remains readable and focus visible | N — pending |
| T15 | Touch small icons, Copy, Info, date cells and close buttons; examine focus/hover/contrast and color-only cues | Targets distinguishable and usable without accidental adjacent activation; labels/status not conveyed by color alone; no essential hover-only content; record measured sizes/contrast concerns for WCAG assessment | N — pending |
| T16 | Navigate headings, links, controls and tables using VoiceOver rotor/NVDA commands; traverse comparison and source history | Names/roles/states, reading order, table headers and change wording are meaningful; no repeated unhelpful icon announcements or silent essential information | N — pending |
| T17 | Change filters/page, clear search, select Calendar date, activate Copy and open/close dialogs while listening | Relevant result/selection/copy announcements occur without excessive interruption; no silent errors, focus traps or unexpected context changes | N — pending |
| T18 | Reload a detail URL; Back/Forward after scrolling; follow official evidence and return | Correct record restores; no Request unavailable for an existing saved ID; meaningful loading/error/fallback state; no keyboard or navigation dead end | N — pending |

For touch-only E1/E3, keyboard/AT portions are explicitly N unless performed with those inputs; they must be covered in E2/E4/E5/E6. For unavailable functionality/source data, record B and its dependency, not F by assumption. These are expected outcomes, not results.

## Failure and retest record — copy per finding

| Field | Record |
| --- | --- |
| Finding ID / test ID / environment run ID | Pending |
| Reviewer / date / exact commit and route | Pending |
| Expected vs actual behavior (including spoken output) | Pending |
| Reproduction steps / zoom / orientation / input | Pending |
| Screenshot or recording reference, redacted as needed | Pending |
| Confirmed defect vs acceptance gap vs data limitation vs cosmetic | Pending |
| Affected WCAG criterion/objective; severity and rationale | Pending |
| Smallest proposed correction / owner or reviewer decision | Pending |
| Correction commit / focused tests | Pending |
| Retest device/browser/AT / reviewer / date / actual outcome | Pending |
| Remaining failures / final disposition | Pending |

UI-001 stays open until representative physical/AT runs and the acceptance matrix are documented, material failures corrected and retested, and the human reviewer records the remaining scope/limitations. Automated checks and a successful deployment are supporting evidence only.
