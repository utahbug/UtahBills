# November 8 Review refinements

Owner-authorized Review-only batch; Main appearance, application/data bytes, acquisition, indexing, analytics and Cloudflare remain outside scope. This record supersedes earlier UI-030 default/control/scrolling descriptions and the earlier phone Activity/Calendar white-page treatment.

## Behavior and isolation

- UI-030: new iPhone visits default to Top using iPhone/iPod user-agent identity plus coarse-pointer capability; other devices, including iPad and iPad desktop-agent modes, default to Bottom. Only the shared compact four-icon layout exposes the setting. A valid saved Top/Bottom preference wins; blocked storage supports the visit. One Toolbar arrow action indicates the destination. The same navigation node/anchors move, with no new route handlers. In Top mode the banner scrolls away and the original bar remains sticky. Main/shared phone detection and UI-025 focus repair are unchanged.
- UI-027: Recent label, thin oval borders and compact wrapped spacing; standard navigation reserves no extra Settings row. Owner additionally authorized reuse of the same document/clock/calendar/people icons in desktop pills at 18px. Compact phone icon layout remains separate.
- UI-028: measure available header space and hide the tagline before crowding; restore it when space returns. Other disclosures remain.
- UI-031: accepted compact-layout tint remains #eef3f7; standard desktop/tablet tint is #e5edf3. Continuous white Activity results and Calendar grid/agenda surfaces replace all-white phone pages. No individual event cards or dark-palette changes.
- Current 2027 listing heading is 2027 Legislature Bills; archive and metadata stay unchanged. Main top padding is reduced only by the Review stylesheet. Activity's selected range has a checkmark and restrained border/tint, using the existing select and filtering.
- Calendar Key Dates uses a native modal with Close/Escape and focus return. KSR's existing dialog/shortcut is retained; Review changes only its title to Created by Kenneth Roberts and removes the visible disclaimer. Provenance safeguards remain unchanged.

## Key Dates verification — November 8, 2026

| Date | Qualified meaning | Authoritative evidence |
| --- | --- | --- |
| January 1, 2027 | Terms begin for legislators elected in November 2026; not a claim of verified new membership | [Utah Constitution VI §3](https://le.utah.gov/xcode/ArticleVI/UC_AVI_S3_1800010118000101.pdf), [VI §4](https://le.utah.gov/xcode/ArticleVI/UC_AVI_S4_1800010118000101.pdf) |
| January 19 | General Session begins | [OLRGC Significant Session Dates](https://le.utah.gov/sessionSchedule/sessdates.jsp), referencing 36-3-201 |
| January 29, noon | Last opportunity to request bills without floor approval | Same official schedule, referencing JR4-2-101(4)(c) |
| March 5 | General Session ends | Same official schedule, referencing Constitution VI §16 |
| March 25 | Governor signing/veto deadline after adjournment | Same official schedule, referencing Constitution VII §8 |

The official schedule was independently retrieved through the browser/search source after an initial rejected response. It warns that dates may be estimates and the Constitution, Code and rules control; the presentation retains this qualification. No caucus/special-session date was invented. This is a Review presentation module, not an acquisition or legislative snapshot change.

## Verification gates

Focused tests cover device defaults/saved overrides, blocked storage, same toolbar, all four routes, both positions, banner disappearance, compact/standard transitions, narrow non-touch desktop exclusion, Chromium/WebKit, themes, keyboard and axe. Retained navigation tests cover repeated bill taps, history, search/bookmarks, Copy/CSV, final-content clearance and keyboard handling. Existing Settings/oval/artifact checks remain mandatory; expectations change only where the owner explicitly changed Review behavior.

Matched Main/Review screenshots use the same viewport, theme, route and Activity Last 30 days filter at iPhone, iPad and desktop sizes. Additional intermediate-width pill screenshots and enlarged-text checks cover wrapping and Settings clearance. Required CI and live publication must be recorded separately from local results.

Physical iPhone/iPad Safari, browser chrome/safe areas, native keyboard, VoiceOver, device text sizing and owner visual acceptance remain required. No Main or Cloudflare promotion is authorized.
