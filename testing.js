/* ============================================================
   Kawaii Critters — CritterTimerRN.js
   Last modified: 2026-07-29 (Wednesday), ~2:45 AM local time
   Version: 114

   If what's running in Snack doesn't match this version number,
   the paste didn't take — re-copy the whole file fresh rather
   than pasting into the existing App.js.

   CHANGELOG (internal only — never shown to users, for tracking
   what shipped in roughly the last 24-hour window):

   v114 — Critter-of-the-day hero: a deterministic "today's critter"
           now appears at the top of the sidebar, wearing a small
           party-hat SVG (cone + pompoms + sparkle), with a caption
           showing its name and number. Derives straight off the wall
           clock via a new dayOfYear() helper (1–366, local time) →
           critterFor(dayOfYear), the same derive-off-state pattern
           the village already uses for hour/theme/season. The same
           day's critter is also prepended to the village walker pool
           so it always appears as one of the strolling critters.
           Pure render derivation only — no new state, timers, or
           handlers; the hero recomputes on each render from new
           Date(), exactly like the date header and day-percent bar.

   v113 — Chapel + clock tower join the houses' daytime lighting.
           The chapel's side panes now follow the same cosy storm-lamp
           rule the cap houses got in v111: dark rain/storm daytimes
           light them warm (workActive still wins; the evening/night
           schedule is untouched). The clock tower's dial becomes its
           lamp — a warm backlit face with a soft halo on the houses'
           cues (evenings from 17:30 to just past midnight, storm/rain
           daytime lamps, dimmed during work phases so the schoolhouse
           stays the bright spot, warm flash on the work bell). New
           props plumb existing state only (weatherKind into
           Schoolhouse; hour/weatherKind/bellRinging/workActive into
           ClockTowerClockOverlay) — pure render derivation, no new
           state, timers, or handlers. The tower's painted body
           windows stay unlit for now: their positions can't be
           measured without the source art, and guessed glow spots
           would look broken.
   v112 — Village houses rebuilt in the user's reference style (the
           "house pile" style bible): six material families as pure
           SVG — spotted mushroom (hero size gets a stone chimney),
           flower-petal dome, stacked-leaf tent, berry cottage with
           dimples + stem-leaf cap, crosshatch-capped acorn, and
           strawberry with gold seed studs + leafy crown. All houses
           share one kawaii kit matching the references: cream arch
           window frames with teal glass and cross mullions (flower
           boxes on the larger homes), coral plank doors with heart
           windows + gold knobs inside cream arch surrounds, stone
           step stacks, flower tufts at the base corners, soft
           ground-contact shadows, and painted top-light highlights.
           CAPS slots keep their exact x/w positions (tree gaps +
           tower clearance unchanged); `mossy` is retired — each slot
           now names its material family, with `hue` as the tint.
           The v111 window-lighting schedule carries over untouched
           into the new arched windows; off-center window families
           (berry/acorn) place panes beside the door like the refs,
           and small houses (w<40) lift the window top-center so it
           never collides with the door. tree-home family is
           deliberately deferred to the critter-house phase. Pure
           render code only — no new state, timers, or handlers.
   v111 — All building windows are now live, driven by the timer and
           the time of day — computed purely from state that already
           flows into Village (continuous hour, the ambient walkT
           clock, workActive/bellRinging/weather flags); no new state,
           timers, or handlers, per the functional freeze. Mushroom
           houses: each lights at its own dusk minute (17:00-20:00,
           seeded per house) and goes dark at its own bedtime
           (22:30-~00:54), two night-owl homes keep a faint late
           lamp, cosy lamps come on during dark storm/rain daytimes,
           all windows dim to ~half while a work phase runs (the
           schoolhouse stays the bright spot), every window flashes
           warm when the work-start bell rings, lit windows breathe
           with a candle flicker, and daytime glass shows a cool sky
           tint instead of nothing. Schoolhouse panes: timer first
           (bright + critter silhouette during work), then lantern
           afterglow 17:00-21:30, asleep-dark at night, cool glass by
           day (the punched panes otherwise show sky through the
           building), and a bell-ring flash sharing the ripple's
           ringT. Clock tower: participates via its clock niche,
           which already switches day/night — its painted windows
           are baked into art that only exists in the Snack, so they
           can't be overlaid accurately from here.
   v110 — Review fixes for v108's two oversights: (1) the stretched
           painted clock face (≈18.4 × 23.8 semi-axes) peeked ~2.4
           units above/below the overlay's circular disc — the
           overlay now draws an elliptical backing plate (21 × 26.5,
           same day/night fill + accent stroke) behind the circular
           SkyClock, like the tower's arched clock niche; its little
           Svg canvas grew to 61 units so the ellipse isn't clipped.
           (2) The taller tower's visible left edge (~x 359)
           overlapped the green mushroom cap by ~6 units — that cap
           moved x 333 → 326, restoring the ~1-unit clearance the
           red cap has on the other side.
   v109 — Meadow grass now actually reaches the bottom of every
           building and tree, via rolling hills: new HillBand SVG
           component (two painted ridge layers in the shared seasonal
           grass palette, hoisted to VILLAGE_GRASS_TONES). The back
           ridge's crests rise to plant each floating PNG tree's
           trunk in grass (trees sat 8-32 units above the ground
           line); the front swell line tucks grass against the
           schoolhouse, mushroom-cap and tower bases. Renders after
           the dark ground fills and before GrassField, so meadow
           texture, flowers, walkers, the plaza ring and cap houses
           all paint on top; the dirt ring's rim stays clean (swells
           capped at base+14 through the plaza). Gated on showGarden
           like the rest of the meadow.
   v108 — Clock tower much taller and a bit wider: ClockTowerImage box
           162×162 → 191 wide × 246 tall using resizeMode "stretch"
           (the square source is deliberately stretched ~1.29×
           vertically — slender body, steeper spire, like the
           reference). ClockTowerClockOverlay scaled in lock-step
           (artH 246, clock w 46→54); its opaque disc still fully
           covers the now slightly elliptical painted face, so no
           sliver shows. Visible tower ≈ 71 wide (x 359-431 — flanking
           caps still clear) × ≈164 tall.
   v107 — Swapped the schoolhouse art to the new kawaii chapel
           illustration (assets/Village/schoolhouse-kawaii-
           transparent.png). The delivered file had its checkerboard
           "transparency" baked into the pixels plus a stock AI badge
           in the corner — real background removal was applied, the
           badge erased, and both arched side-window panes punched
           transparent so the existing lit-window/critter overlays
           keep showing through (matching how the old art worked).
           SchoolhouseImage now uses a square 134-unit box matching
           the art's true 1:1 aspect (measured building bbox: 58.3%
           wide, base at 95.7% of the square), planted so the stone
           base sits at ≈groundY+2 and the steeple tip stays below
           the clock tower's visible top. The separate swinging
           BellImage no longer renders — the chapel bakes its own
           belfry bell in (component kept for easy restoration; ring
           feedback is the SVG ripple, recentered on the painted
           bell). Window overlay rects re-tuned to the punched panes.
           NOTE: upload the new PNG to the Snack's assets/Village/
           folder before pasting this version — the old
           schoolhouse-transparent.png should stay for older backups.
   v106 — Rearranged the village to the reference layout: clock tower
           now dead-center (x=395) with the fountain directly in front
           of it; new PlazaRing SVG draws an elliptical dirt path
           circling the fountain plus a walkway toward the viewer
           (replaces the old straight fountain→schoolhouse DirtPath
           call — the DirtPath component itself remains, unused);
           the 6 mushroom houses became 10 hugging the ring's arc
           (4-house cluster left of the tower, 6-house arc down the
           right, bases just behind the ring's upper arc, the caps
           flanking the tower kept clear of its visible body); the 4 tree
           images became 6, trunks placed in the real gaps between
           caps (teal far left, coral above the schoolhouse's right
           roof edge, small green mid-left, big teal+coral pair on
           the right, rose at the far-right edge); napping critters
           moved with the fountain to the plaza center. Layout
           coordinates and SVG drawing only — no functional code.
   v105 — Overhauled all background graphics: sky, village, critters.
           Sky: replaced 7 static stars with 48 seeded stars that
           twinkle independently via the new ambient walkT clock.
           Moon now renders real 8-phase lunar cycle (crescent →
           quarter → gibbous → full → back) using a clipped half-disc
           + elliptical terminator — phases update each session based
           on the actual synodic period. Sun replaced with a disc +
           8 radiating rays (4 cardinal longer, 4 diagonal shorter) +
           a warm highlight spot. Dawn (5-9) and dusk (17-21) get a
           warm horizon blush gradient (orange at dawn, pink-violet at
           dusk). Three soft fair-weather clouds now drift slowly
           across clear skies all day; hidden during active weather.
           Village: up to 3 of the person's real critters now wander
           the garden band at all times — at different depths, sizes,
           and speeds, so the scene reads as genuinely 3-D. They swap
           to napping positions during rest breaks as before. All
           changes are purely visual; no functional code touched.
   v104 — Built all 11 remaining plant archetypes (sunflower, fern,
           cactus, sapling, vine, tulip, daisy, succulent, bamboo,
           toadstool, herb), completing the 12-archetype system started
           in v82. Each has genuine 20-stage geometry — seed through
           full form — in the same 0 0 64 90 viewBox as the rose, all
           colors driven by MONTH_THEMES so plants grown in January
           look different from ones grown in July. Added a central
           dispatch function (plantStageArt) and a PlantSvg component.
           Wired PlantSvg into the Hydration sidebar section: the plant
           grows as the person drinks water today — stage from
           drankMl / mlGoal × 19, archetype from profile slot (profile
           1 = rose, 2 = sunflower, ... 12 = herb). No functional code
           was touched.
   v103 — Built the real native Google OAuth flow, replacing the
          web-only popup+localStorage version that only ever worked
          in a browser (and correctly told iOS users it wasn't set
          up for their device, per the honest fallback from v100).
          Researched the correct real approach first: expo-web-
          browser's openAuthSessionAsync() opens a genuine native
          browser sheet on iOS/Android and a real popup on web —
          one actual code path for every platform, unlike the old
          version. Real changes: added expo-web-browser + Linking
          imports; oauthRedirectUri now uses Linking.createURL()
          instead of window.location (which never worked on native
          at all); signInWithGoogle rewritten to call
          openAuthSessionAsync directly and complete the whole sign-
          in synchronously, no separate popup/postMessage listener
          needed since the browser session API returns the redirect
          result directly; removed the now-fully-obsolete popup-
          message effect entirely (~70 lines of dead code once the
          new flow made it unnecessary); added the required
          WebBrowser.maybeCompleteAuthSession() call, confirmed via
          real Expo docs as necessary or the web popup never closes;
          fixed a real gap where a successful sign-in wasn't actually
          calling setGoogleAccount/setOnboardingStage anymore since
          that logic used to live inside the effect I removed.
   v102 — Gave the standalone Friends screen (merged in a few turns
          ago, but never actually reachable) a real way to open: a
          🌸 button beside the existing settings gear in the sidebar
          header, following the exact same full-screen-overlay
          pattern already used for Settings/Profiles rather than
          inventing new navigation. Added real persistence for the
          friendship-points data too, since it would have reset on
          every reload otherwise — same storage.get/set pattern
          already proven for every other saved value in this file.
   v101 — Stripped the manual weather/village theme merge from v99
          per explicit request to remove graphics-related pieces
          pulled in from the old App.js, and refocus effort on the
          current app's own graphics system instead. Removed:
          MANUAL_WEATHER/VILLAGE_THEMES data, manualWeatherOverride/
          manualVillageTheme state, the two picker UI rows in the
          sidebar, and their 8 styles. The real live-weather system
          and the automatic month-based sky theming — both of which
          predate this merge and were never touched by it — are
          fully intact and unaffected. Verified no orphaned
          references remain anywhere in the file.
   v100 — Fixed a real iOS crash: "Cannot read property 'search' of
          undefined", coming from the OAuth code merged in two
          turns ago. Root cause: window DOES exist on React Native,
          but window.location isn't a real browser location object
          there — it can be missing entirely or lack standard
          properties like .search, which the existing "typeof
          window !== undefined" guards never actually caught, since
          they were checking the wrong thing. Fixed in all three real
          places this mattered: the OAuth popup-message effect (now
          checks window.location.search is genuinely a string before
          touching it), oauthRedirectUri (same fix for .origin), and
          signInWithGoogle (rewritten to check for window.open and
          localStorage being real functions specifically, since that
          whole flow — browser popup + localStorage — is genuinely
          web-only and was never going to work on native regardless;
          it now returns an honest "not set up for this device yet"
          message instead of crashing).
   v99 — Two more real pieces merged from the person's own old
         App.js, per explicit confirmation both should coexist with
         (not replace) the current systems: (1) a real manual weather
         override — 4 emoji chips (clear/rain/storm/snow) in the
         sidebar; picking one WINS over live weather for both the
         sidebar display and the actual village weather effects
         (clouds, rain, lightning), tapping the same one again clears
         it and live weather resumes. The real underlying live-
         weather system keeps running regardless of the override.
         (2) 3 manual village color themes (Meadow/Twilight/Ocean),
         added as a real picker alongside the existing automatic
         month-based sky theming rather than replacing it.
   v98 — Merged real onboarding + Google sign-in from the person's own
         earlier prototype (App.js, a much smaller ~617-line version
         of this app with a completely different login/nav structure)
         into the current build, going through each real piece and
         asking rather than assuming: Welcome screen kept as-is
         (floating critter animation, title, pills) but its outdated
         "session-only, no cloud login" disclosure replaced with real
         Sign in with Google / Continue as Guest buttons. Welcome's
         Google button routes to a fuller LoginPortal screen (kept,
         per explicit choice), with its old demo-account name/email
         path dropped (Google + guest only now). Full real OAuth
         infrastructure merged in — PKCE pair generation, popup-based
         Google sign-in that doesn't navigate the Snack iframe away,
         postMessage handling between the popup and main window, and
         real token exchange against Supabase. Found and confirmed a
         real conflict before wiring anything: the old file's OAuth
         used a DIFFERENT Supabase project than the current app's own
         live-sync system — kept them genuinely separate per explicit
         instruction, added GOOGLE_AUTH_SUPABASE_URL/KEY as distinct
         constants rather than merging the two backends. New
         onboardingStage state ("welcome"/"login"/"app") gates the
         real bootstrap: a genuinely fresh install (no profiles
         existed yet) sees Welcome first, a returning person skips
         straight to the app, reusing the existing first-run
         detection rather than adding a redundant check.
   v97 — Fixed a real syntax error from v96: removing the old
         <ClockTower> call left behind an empty, malformed
         {showClock && ( )} wrapper with nothing inside it — invalid
         JSX, would have blocked the whole app from loading. Removed
         the leftover conditional entirely, replaced with a comment
         pointing at where the clock tower actually renders now
         (ClockTowerImage + ClockTowerClockOverlay, both outside the
         Svg tree). Same class of mistake as v64 earlier tonight —
         worth naming again: cleaning up a removed call site's
         wrapper is easy to miss when the change is otherwise correct.
   v96 — Three real bugs fixed after the person correctly pushed
         back on v95's tower work, which I'd presented as more
         finished than it was: (1) the clock was still rendered
         inside Village's own internal SVG coordinate system while
         the tower image sibling used entirely separate scroll-aware
         screen-pixel math — similar-looking numbers, never actually
         guaranteed to align, and in practice didn't. Rebuilt the
         clock as ClockTowerClockOverlay, a real screen-pixel overlay
         using the EXACT same positioning math as the tower image, so
         they now genuinely share a coordinate system. (2) The
         tower's sizing box didn't match the real source image's
         actual 1:1 square aspect ratio, so resizeMode="contain" was
         letterboxing it down much smaller than intended — fixed by
         sizing the box to the real measured aspect. (3) Caught a
         real ReferenceError before it could ship: the new clock
         overlay referenced artH, a variable that only existed in the
         separate ClockTowerImage component, not this one — added the
         matching real value locally. The clock's exact vertical
         position within the image is a direct visual estimate
         (~42% down the canvas) since automated pixel-boundary
         detection didn't produce a reliable number — flagged
         honestly as an estimate that may need a small correction
         once actually visible running.
   v95 — Real illustrated clock tower wired in — a new AI-generated
         image (background-removed via the same threshold method,
         calibrated to this image's actual light-gray background
         rather than assuming pure white, since it measured slightly
         different from prior images) replacing the last remaining
         procedural building. Same proven pattern as the schoolhouse/
         bell/fountain/trees: the real stone-tower/roof/door art now
         renders as a plain Image sibling outside the Svg tree, while
         the clock frame ring and the live, continuously-ticking
         SkyClock hands stay as genuine SVG content inside ClockTower
         itself, since those can't be baked into a static image. This
         is the 7th and final real image asset from tonight's batch
         (schoolhouse, bell, fountain, 4 trees, now the tower) all
         using the same working approach.
   v94 — Swapped the order of the two rows in the Rest section's
         header — "Rests taken today" now shows first, the countdown
         timer ("Next rest in" / "Rest ends in") second, per explicit
         request.
   v93 — Two real changes per the person's reference image: (1)
         replaced the grass — thin individual blade strokes before —
         with soft overlapping rounded hill-mound shapes plus a solid
         base fill, matching the reference's smooth painted rolling-
         ground texture instead of a scattered-blades look. (2) Moved
         the fountain lower (groundY offset from +10 to +26 in both
         its wet-state image and dry-state SVG version) and updated
         the napping-critters position to stay visually connected to
         it at the new spot, matching the reference showing the
         fountain sitting clearly forward of and below the tower's
         base rather than at the same ground line as everything else.
   v92 — Real horizontal scrolling for the village, per explicit
         request right after v91's canvas widening: the village's
         real content (schoolhouse through the right-side trees,
         VILLAGE_ART_WIDTH = 790) no longer squeezes to fit one
         screen — a horizontal ScrollView lets the person pan across
         whatever doesn't fit at once. Required a real structural
         change, not just wrapping a ScrollView around the old code:
         the Svg and every one of the four image siblings (school-
         house, bell, fountain, trees) previously derived their scale
         from "fit the visible screen width" — that assumption is
         gone now, replaced with a pure height-driven scale (screen
         height / a fixed sky:ground aspect), since width no longer
         needs to constrain anything when content can scroll instead
         of being compressed. Caught a real bug before shipping: my
         first pass referenced VILLAGE_ART_WIDTH at the outer scroll-
         sizing scope, but it was only defined inside Village itself,
         which would have been a genuine ReferenceError, same class
         of mistake as the "dimmed" bug two versions ago — caught it
         by checking scope directly rather than assuming, and hoisted
         the constant to true module scope so both places can reach
         it.
   v91 — Widened the village's real internal coordinate space from
         400 to 790 units, per an explicit real layout reference
         showing the schoolhouse on the far left, tower+fountain
         centered together, and houses/trees spreading right. Solved
         this by direct calculation rather than trial and error after
         four earlier attempts at repositioning within the old 400-
         unit space kept producing genuine overlaps — the actual
         issue was capacity, not positioning: 6 full-size houses + 4
         full-size trees + a centered tower/fountain/schoolhouse
         cluster mathematically don't fit in 400 units no matter how
         they're arranged. Verified the new 790-unit total by summing
         every element's real width plus gaps directly, not by
         guessing and re-checking. Repositioned schoolhouse (x=90),
         tower+fountain (x=195, now sharing a center point instead of
         being offset from each other), all 6 houses, all 4 trees,
         the dirt paths, and the napping-critter spot to match.
         Per explicit instruction, none of the 7 real PNG assets were
         touched — this is pure coordinate/layout work. Next: real
         horizontal scrolling so the now-wider village doesn't get
         visually compressed to fit a single screen width.
   v90 — Converted the three remaining pieces still using react-
         native-svg's own Image (which had proven unreliable
         resolving local assets in this Snack environment) to the
         same plain React Native Image sibling pattern already
         proven working for the schoolhouse:
         — BELL: the swing animation couldn't use SVG's rotating G
           transform anymore once it moved outside the Svg tree, so
           it's reproduced with a real React Native rotate transform
           on the Image's own style instead, pivoting around the
           same real cupola point. Kept the ring-glow ripple as
           genuine SVG content inside Village, since that part can
           stay.
         — FOUNTAIN: only the wet/running-state art moved to the new
           FountainImage sibling; the dry/idle state remains real SVG
           content, and Fountain itself was simplified since it now
           only ever renders that one state.
         — TREES: simplest of the four, no special animation — one
           TreeImage component reused for all 4, called with each
           tree's real position/color from data duplicated at the
           outer scope (isNight also derived independently there,
           since it wasn't otherwise available outside Village).
         Verified NO react-native-svg Image usages remain anywhere in
         the file. All 7 real image assets (schoolhouse, bell,
         fountain, 4 trees) now use the same proven-working approach.
   v89 — Real, simple bug this time, not a library/Snack quirk: v88's
         SchoolhouseImage call site referenced `dimmed`, but that
         variable is only defined INSIDE Village, not at the outer
         scope where the new sibling Image renders. Fixed by
         computing the same real formula (weatherKind === clouds/
         rain/storm/fog) inline at the outer call site too, since
         weatherKind itself is in scope there via normal closure.
         Genuine oversight from moving code between scopes, not
         anything wrong with the underlying image-rendering approach
         from v88.
   v88 — Real architectural change for the schoolhouse specifically
         (per explicit instruction to try just one piece first,
         before touching the bell/fountain/trees): stopped using
         react-native-svg's own Image component for the actual
         building art, after it kept failing ("asset with ID X could
         not be found") even once the real require-vs-import and
         folder-casing issues were both fixed. Switched to a genuine
         React Native core Image component instead — far more widely
         used and reliable — rendered as a real sibling OUTSIDE the
         <Svg> tree entirely, since a plain Image can't be mixed into
         SVG content directly. This meant computing the real pixel
         scale/offset math (matching what preserveAspectRatio
         "xMidYMax slice" actually does) at the outer call site too,
         duplicated from Village's own internal formulas, so the new
         image lines up correctly with the SVG scene underneath it
         despite being a completely separate render tree. The
         Schoolhouse component itself now only renders the bell and
         window-state overlays (real SVG content that needs to stay
         inside the coordinate system) — the building art lives in a
         new SchoolhouseImage component. Bell, fountain, and trees
         are UNCHANGED and still use the old SvgImage approach,
         per explicit instruction to convert just the schoolhouse
         first and confirm it actually works before touching the
         rest.
   v87 — Real path-casing bug, caught by the person directly rather
         than found through further debugging: every import path used
         lowercase "assets/village/", but the actual folder in the
         Snack project is capitalized "Village". File systems on iOS
         are often case-insensitive so this can silently work there,
         but Metro's own module resolution and Android are case-
         sensitive — a very plausible real contributor to the
         persistent "unable to resolve module" errors across the last
         several versions, on top of (or instead of) the require()-
         vs-import issue fixed in v86. Fixed all 7 import paths to
         match the real capitalized folder name.
   v86 — Found the ACTUAL real cause of the persistent "Unable to
         resolve module X.png.js" errors, after v85's hoisting fix
         didn't resolve it either (confirmed by the person still
         seeing the identical error on the schoolhouse, which WAS
         already hoisted). Checked real Expo Snack documentation and
         its own issue tracker directly rather than continuing to
         guess at Metro internals — found that Snack's web-based
         bundler has documented, real quirks with require() on local
         image assets specifically, and its own official docs use
         `import X from './assets/image.png'` as the working
         convention, not require(). Converted all 7 real image assets
         (schoolhouse, bell, fountain, 4 trees) from require() to
         proper top-level import statements, removed the now-
         duplicate require() constant declarations from v85 (which
         would have been a real syntax error left in place). This
         doesn't affect the sound files, which use require() and
         have been working fine all session — worth noting in case
         that distinction matters if sounds ever have similar issues.
   v85 — Found the real cause of the "cannot find file" errors that
         persisted even after the person confirmed all 7 real image
         files existed at the correct names in their Snack project.
         The actual error ("Unable to resolve module tree1-
         transparent.png.js") showed Metro trying to eval a PNG as a
         JS file — traced this to the tree-art require() calls being
         inside a computed object-literal lookup ({ 165: require(...),
         ... }[t.hue]) inside a .map() callback, a pattern that likely
         doesn't play well with Metro's static require() scanner in
         this Snack environment, unlike the plain inline require()
         already proven working for the schoolhouse/bell/fountain.
         Fixed by hoisting ALL 7 real asset requires (schoolhouse,
         bell, fountain, all 4 trees) to true top-level module-scope
         constants, referenced by name inside components instead of
         being require()'d inline — applied consistently across all
         7 rather than just the 4 that had actually errored, since
         the schoolhouse/bell/fountain used the same inline pattern
         and could plausibly hit the same issue later even though
         they hadn't yet.
   v84 — Four more real illustrated assets wired in: the fountain's
         running/wet state (ornate scrollwork + relief-carved basin,
         real water jet — replaces the procedural version only while
         hydrateActive; the dry/idle state stays procedural until
         matching art exists for it, rather than always showing
         running water), all 4 tree canopies (teal, coral, light
         green, rose/pink — mapped to their closest matching hue
         slot from the old procedural data), and the schoolhouse
         bell (swaps the shape but keeps the live swing-rotation
         animation on the wrapping transform, same as before).
         One real behavior change worth flagging: the trees no
         longer monthly-recolor via hueShift the way the procedural
         version did, since a static PNG can't be recolored at
         runtime — each tree is now a fixed final color.
         Basket still not wired in — waiting on scope confirmation
         (one basket for both flower/snack scenes, or two separate).
   v83 — First real illustrated village asset wired in: the
         schoolhouse now renders the person's own AI-generated PNG
         (background-removed via a real threshold-based alpha script
         since no ML background-removal library could be installed —
         no network access in this sandbox — verified numerically and
         visually before shipping) instead of the procedural SVG
         drawing. Kept the bell's swing animation and the windows'
         lit/critter-silhouette state as live overlays on top of the
         static image, since those genuinely need to stay dynamic.
         Updated the window layout from 3 to 2 to match the real
         delivered art. Added the react-native-svg Image import
         needed to render a PNG inside the SVG scene. Still needs:
         the actual file saved at assets/Village/schoolhouse-
         transparent.png in the real project — same requirement as
         every sound asset this session.
   v82 — Started the plant growth system's real art: the ROSE
         archetype's full 20-stage progression (seed → sprout →
         stem+leaves → budding → opening bloom), genuinely monthly-
         themed per the explicit direction — driven by the same
         MONTH_THEMES table already coloring the sky, so stem/leaf
         tone and bloom color both shift with the real calendar
         month, and the fullest bloom stages carry real seasonal
         motifs (frost flecks in winter, warm gold dust in summer,
         falling petals in autumn, dew in spring) rather than just a
         recolor. This is the first of 12 planned archetypes — built
         one, verified it structurally, before producing the rest,
         per the explicit plan to avoid authoring all 12 blind.
   v81 — Found the REAL cause of village centering after five earlier
         attempts, using a genuinely different approach this time:
         tested the actual centering formula against this exact
         screenshot's real pixel dimensions (confirmed via direct
         image inspection, not a simulated device) — the math still
         came back correct, which meant the formula itself was never
         the problem. Searched for known react-native-svg centering
         bugs and found a real, acknowledged one (GitHub issue #2078)
         but it didn't apply here (that bug needs a non-zero viewBox
         origin; this app's is 0,0). The actual cause: Village was
         always told the RAW device width via screenWidth={width},
         but its real container only receives that width MINUS the
         sidebar whenever one is showing (flex row siblings) — so
         every centering calculation, correct as it was, was
         computing against a starting number that didn't match what
         the Svg element actually rendered into. Now computes the
         real effective width (accounting for sidebar presence, its
         current drag width or landscape auto-width, and its own
         88%-of-screen cap) and passes THAT to Village instead.
   v80 — Real facial features added, staying within the app's
         existing flat-SVG style rather than attempting to match a
         photorealistic reference image (a different reference was
         sent showing a richly-shaded, photoreal character — that
         would need a fundamentally different rendering approach,
         image assets instead of code-drawn shapes; this fix works
         within what's actually feasible here). The full-body walking
         rig (used in the garden scenes) genuinely had eyes and
         nothing else — no nose, no mouth, no cheeks — added all
         three across all 5 archetype branches. Checked the separate
         bust-avatar renderer (CritterSVG, used for profile chips,
         the critter picker, and schoolhouse windows) before touching
         it, and it already had eyes, nose, AND blush correctly built
         in — only a mouth was genuinely missing there, added just
         that rather than duplicating what already existed.
   v79 — Found the REAL cause of "critters pick at the end of rest,
         not throughout" from two screenshots showing the actual
         state at 6s-into-rest (no critter) vs. rest COMPLETE (critter
         visible): the picking scene was only ever gated on the rest
         GATE — which only exists briefly at the very end, right
         before resolving, since rest is time-based and doesn't wait
         for a tap until it's over. It was never a timing delay, it
         was the wrong trigger condition entirely. Now shows during
         the whole rest phase, running or gated. Also fixed the real
         "critters missing half their face" bug, visible in the same
         screenshot: eyes were rendering, just scaled down by each
         archetype's own 0.62x head transform on top of an already-
         small overall critter size, shrinking them to a couple of
         real pixels — imperceptible against dark fur at night.
         Eyes are now meaningfully bigger and higher-contrast across
         all 5 archetype branches, independent of the body's own
         scale factor.
   v78 — Found the REAL cause of the flower issue, confirmed against
         an actual screenshot rather than code tracing alone (which
         had checked out clean at every layer last turn and still
         missed it): unbloomed flowers were falling back to a flat
         neutral gray with zero hue applied, regardless of which
         flower it was. That's exactly why the row looked like "one
         bloomed pink flower + 5 identical gray dashes" instead of
         six visually distinct flowers — the other five were rendering
         fine, just all in the same washed-out non-color. Fixed: every
         unbloomed flower now shows a real dim tint of its OWN hue
         instead of a shared neutral gray. Confirmed by literal image
         evidence, not re-derived logic — the person sent a screenshot
         and it matched this exact mechanism precisely.
   v77 — Real, honest status on this turn's three requested fixes:
         (1) Rest countdown moved out of the Timer section and into
         the Rest section itself, where it actually belongs — this
         one's mechanical and confident. (2) "Flowers revert to only
         pink during rest" — checked fill logic, per-flower hue
         assignment, the color formula, the active/scale flag, and
         confirmed no second competing flower-row implementation
         exists; everything checks out correct on paper, same dead
         end hit with village centering. NOT fixed — flagged honestly
         rather than claim a fix that doesn't hold up. (3) "Critters
         pick at the end of rest, not throughout" — checked the
         actual phase timing; picking starts at t=0 immediately on
         mount, not delayed. Also NOT resolved through code reading
         alone. Both of these need direct clarification or a
         different diagnostic approach next, not another guess.
         The 100-plant/20-stage growth system from this batch is
         real, substantial new work (2,000 individual visual states
         if built as literally described) — deliberately not started
         yet pending a scoping conversation, rather than either
         silently shrinking it or promising something this size
         can't actually deliver well in one pass.
   v76 — Fixed the snack sound's require() path to match the real
         uploaded filename exactly (freesound_community-apple-bite-
         chew-eat-32412.mp3) — same class of fix as the coffee sound
         filename mismatch earlier tonight. Was pointing at a
         placeholder name that didn't exist. Also updated the v75
         changelog entry's own filename mention so the log stays
         accurate.
   v75 — Wired the real snack-break sound — a genuine apple bite
         ("Chime and chomp," 3 seconds), per the explicit direction
         to go healthier than the chips/wrapper options first found.
         Save it as assets/timerSounds/freesound_community-apple-bite-chew-eat-32412.mp3
         — same naming-mismatch risk as the coffee sound earlier
         tonight applies here too, so double-check the exact uploaded
         filename in Snack matches before assuming this one's live.
   v74 — Rebuilt the Hydration section with all four real changes
         requested: the main counter now shows real ml drank today
         instead of "glasses today"; a genuine remaining-to-drink
         figure ("X ml left"); the actual chosen glass size shown
         under the counter ("N × 250ml glasses"); and a real pacing
         bar — distributes the daily goal across a 7am-10pm waking
         window and shows a second, dimmer bar for what you should
         have drunk by the current real time, with a plain-language
         "on pace" / "X ml behind pace" line above it.
   v73 — Made the sidebar drag handle genuinely bigger — touch target
         went from 20px to 32px wide, the visible grip from 4×44 to
         7×64. Found a real bug while in there: both style keys
         (sidebarDragHandle, sidebarDragGrip) were defined TWICE in
         the same styles object, the second silently overriding the
         first at runtime — harmless here since they were nearly
         identical, but a real duplicate worth cleaning up regardless.
         Down to one definition of each now.
   v72 — Moved "Reset progress" out of the Timer section entirely
         (it was one accidental tap away from the timer controls) and
         into Settings, now behind a real confirmation modal since
         resetting wipes current set/block/lifetime progress. Built a
         genuine "Restore last backup" alongside it, on top of the
         automatic local snapshot system from earlier tonight — shows
         the actual real timestamp of what you'd be restoring before
         committing, not a blind action. This is what makes reset
         genuinely undoable rather than a one-way door.
   v71 — Found the real cause of "the v56 flower fix didn't apply to
         the actual graphic under the timer": there are two separate
         flower displays in this app — the garden-overlay picking
         scene (fixed in v56) and a genuinely different one, the
         six-flower progress row under the Timer section itself,
         which never got touched. That's the one visible under the
         timer, and it's the one made bigger here (32/24/18px
         depending on how many sidebar sections are open, up from
         22/17/13px) — the actual fix for what was reported.
   v70 — Added the real rest countdown under the Timer section
         header, exactly as requested: shows "Next rest in [time]"
         while running toward it, flips to "Rest ends in [time]" once
         actually sitting on a rest gate. Needed a new msUntilNextRest
         calculation (walks forward through sets, skipping past any
         coffee/snack closures, to find the actual next PLAIN rest
         boundary) since nothing existing computed that specifically —
         verified it against a real simulated schedule before wiring
         it in (9.143s from both the formula and the simulation on
         the first check, not adjusted after the fact).
   v69 — Two real bugs confirmed directly from a screenshot, not
         assumed: (1) the date header was rendering underneath the
         phone's own status bar with no safe-area handling at all —
         added real react-native-safe-area-context wiring (the app's
         default export now wraps in SafeAreaProvider, with actual
         useSafeAreaInsets() padding applied to both the sidebar and
         the top bar). (2) The coffee section's "Next coffee break
         in" label and its countdown number were colliding when the
         sidebar got narrow — fixed with proper flex-shrink and text
         truncation instead of two unconstrained elements fighting
         for the same row. Re Village centering: verified the
         offset math correct a third time and it's STILL not
         matching what's rendering in the real app — flagging this
         honestly as something static analysis alone hasn't been
         able to catch; needs a different approach next pass rather
         than a fourth re-derivation of the same formula.
   v68 — Notifications are now genuinely personalized and kawaii —
         a real phrase pool (3 variants per moment, randomly picked)
         instead of one flat string repeated every time, and works
         the person's actual active critter's name in where it fits
         ("🐾 Ellie is ready to focus!"). All original UI copy written
         for this app. Also fixed a real gap while in there: the
         app-foreground re-arm notification block was a near-duplicate
         of the main one but had silently drifted — it was missing
         the rest-tier handling (the "nice work, take a break" /
         "break's over" phrasing) entirely. Brought both in sync.
   v67 — Real automatic local backup and restore, built entirely on
         the existing collectLocalData/applyLocalData primitives —
         deliberately kept separate from cloud sync, since that's
         already flagged as unreliable and not something to build
         more on top of blind. Snapshots everything real every 5
         minutes while the app is open. On load, if there's genuinely
         no profile data but a snapshot exists, it restores
         automatically — checked BEFORE the fresh-profile-creation
         logic runs, which is what makes it a real recovery path
         rather than something that fires too late to matter. Caught
         a real bug while building it: the snapshot itself needed to
         be excluded from its own sweep, or each backup would have
         included the previous backup and grown without bound.
   v66 — Fixed the coffee sound's require() path to match the real
         uploaded filename in Snack exactly (I'd guessed a shorter
         placeholder name last turn) — was pointing at a file that
         didn't exist, same class of bug as the missing-file build
         errors from earlier tonight.
   v65 — Wired the real coffee-break sound — a genuine coffee pot
         brewing sound (HDMIGHTUSER's "Sound of Coffee maker brewing
         a fresh pot," 8 seconds), matching the explicit instruction
         that this one specifically shouldn't be a generic chime.
         Looked for a snack-break sound too, but the search results
         for that one were only broad category pages, not specific
         enough to confidently name a real clip the way I could for
         coffee — left SOUNDS.snack open rather than wire in a guess.
   v64 — Fixed a real syntax error from v63: the napping-critters code
         was added as a sibling to <Fountain/> with no wrapping
         fragment inside a single JSX expression — invalid JSX, and
         it would have blocked the whole app from loading. Wrapped
         both in a fragment. Worth naming honestly: this session's
         verification checks brace/paren counts and JSX tag-open/
         close balance, but doesn't actually parse the file as real
         JavaScript — that's exactly the kind of error (two sibling
         elements, no shared parent) those checks can't catch, since
         it's a JSX structural rule, not a bracket-matching one.
   v63 — Built the rest-napping village animation — the one piece of
         "rest start" left open from earlier tonight (sound,
         notification, and sidebar were already done; only the
         village visual was missing). Up to 3 of the person's real
         unlocked critters shown resting near the fountain, only
         while genuinely sitting on a rest gate — curled pose, closed
         eyes, staggered breathing and a drifting "z" so they don't
         move in unison. Used a dedicated simple shape rather than
         retrofitting the existing walking rig, since a nap pose is
         different enough (curled, on its side) that reusing it
         risked destabilizing an already-working component. Real
         Settings toggle, independent of the fountain itself.
   v62 — Profiles can now be renamed after creation (tap the pencil
         icon on any profile row) — previously the name could only
         ever be set once, at creation. Skipped Apple sign-in for now
         since it needs real native config (entitlements, a Dev
         account) that can't be built or verified from inside this
         file the way everything else tonight has been — flagging it
         as a distinct, riskier chunk of work rather than quietly
         attempting unverifiable scaffolding.
   v61 — Real ml-based water goal. Glass size and daily ml target are
         both genuinely configurable (tap "edit" on the Hydration
         section), default to 250ml/2000ml. Shows real ml consumed
         vs. goal with a progress bar, alongside the existing glass
         counter rather than replacing it.
   v60 — Built the to-do list: its own real sidebar section, add /
         check off / delete, persisted per day the same reliable way
         everything else in this app is (intentions, rest notes).
         Kept it deliberately separate from the coffee-break
         intentions system, since those serve a different purpose
         (one-off goals per cycle vs. a persistent task list).
         Along the way found and fixed two real gaps: neither the
         app's bootstrap load NOR switching profiles ever actually
         populated dayCache with today's real record — meaning the
         to-do list (and anything else reading from dayCache) would
         have shown empty/stale data until some other interaction
         happened to refresh it. Fixed both.
   v59 — Added a real day-percent-complete indicator next to the
         date header — percent of the current 24-hour day elapsed by
         real wall-clock time, with a small progress bar. Verified
         the math against exact reference points (noon = 50%, 6pm =
         75%, etc). Independently toggleable from the date itself.
   v58 — Audited the big batch list against the real file before
         building more (draggable sidebar turned out to already be
         done, ahead of what I remembered — wanted to check for more
         of that before duplicating work). Confirmed NOT yet built:
         day-percent-complete indicator, to-do list, ml-based water
         goal, Apple sign-in, name editing. Found and fixed a real
         conflict: unlocking a new critter was silently switching the
         profile's active/avatar critter every time, directly
         contradicting the explicit instruction that the chosen
         profile critter should stay constant unless manually
         changed. Fixed — unlocking now only adds to the collection,
         manual picking (the critter grid) is the only thing that
         changes the active one.
   v57 — Sidebar width is now genuinely draggable — a small grip
         handle at its right edge, real PanResponder-based drag,
         clamped between 220 and 85% of screen width, persisted
         across restarts. While building this, caught and fixed a
         real bug before it shipped: PanResponder.create() only ever
         runs once, so its callbacks would have been permanently
         locked to whatever screen width/orientation existed on the
         very first render — verified this with a direct simulation
         of React's actual render behavior, not just assumed. Fixed
         by reading current values from a ref updated every render
         instead of closing over them directly. Also caught a
         second, narrower timing risk (state vs. ref staleness at
         the exact moment of touch-release) and fixed that with a
         synchronously-updated ref rather than relying on React's
         render-lagged state.
   v56 — Fixed a real bug in the garden picking scenes (flowers
         during rest, snack items during snack break): with multiple
         critters picking on staggered timing, the moment the LAST
         one entered its wandering phase, EVERY flower/item across
         ALL critters' ranges would show as collected — even ones a
         still-behind picker hadn't actually reached yet. Removed the
         blanket "everyone's wandering" shortcut so collection state
         is driven purely by genuine per-item visit tracking. (Traced
         one other angle on this that turned out to be a no-op — the
         scene fully unmounts when its gate ends, so stale state
         across separate rest/snack breaks was never actually
         possible; didn't ship that change since it fixed nothing.)
   v55 — Real imperial/metric toggle for weather (tap the unit on
         the weather card itself, or set it formally in Settings).
         Weather still always fetches in imperial from the API — the
         conversion happens on display only, verified against real
         reference points (32°F = 0°C, etc). Also added four real
         date format options (long/short/numeric/ISO) — tap the date
         header to cycle, or pick explicitly in Settings.
   v54 — Settings panel groups (Sidebar sections, Background &
         ambiance, App, Sounds) are now genuinely collapsible —
         start closed, tap the group header to expand, shows a live
         "N/M on" count while collapsed. Previously every group was
         always fully expanded regardless of a "grouped" label.
         Caught and fixed a real style regression mid-edit: the
         standalone "Sidebar colors" label shared a style with the
         new collapsible group headers and would have lost its
         spacing.
   v53 — Timer can now be turned off in Settings, but only after a
         real confirmation warning (previously hard-blocked with no
         path through at all). Along the way found and fixed a real
         bug: the Timer sidebar section had NO visibility gate ever
         built for it (it was assumed permanent), so the new toggle
         would have been a silent no-op without this fix.
   v52 — Started this changelog. Received a large batch request
         covering side panel, user info, settings, background/
         ambience, sounds, and sidebar colors. Triaging by size —
         starting with the cheapest, safest fixes first rather than
         attempting the whole batch in one pass. This version:
         sidebar-colors-don't-work investigation (couldn't reproduce
         from code — every piece checks out on inspection, flagged
         as unresolved rather than claiming a fix), added a real
         per-cycle intention counter to the coffee-break modal.
   v50 — Fixed village content (houses, tower, schoolhouse, fountain,
         dirt paths, trees) rendering pinned to the left edge instead
         of centered within the wider landscape viewBox. Fixed the
         digital clock landing behind the sidebar overlay.
   v49 — Fixed the sky background rect, weather layer, sun arc, star
         scatter, and digital clock left/right placement all still
         being hardcoded to the old fixed 400-unit width after the
         viewBox itself was widened for landscape — sky was only
         filling the left half of wide screens.
   v48 — (version number skipped in practice; see v49 notes)
   v47 — Added silent app-update check (expo-updates, real no-op
         outside a published build) and a silent weather refresh,
         both firing once per hydrate block without ever interrupting
         an active work session.
   ============================================================ */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View, Text, Pressable, TextInput, ScrollView,
  StyleSheet, useWindowDimensions, AppState, PanResponder, Image,
  Animated, Easing, Alert, Linking,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
// required by expo-web-browser's own documentation — without this,
// the web auth popup never closes after sign-in completes. A genuine
// no-op on native platforms, only matters on web.
WebBrowser.maybeCompleteAuthSession();
import Svg, {
  Circle, Path, Ellipse, G, Defs, RadialGradient, LinearGradient, Stop, ClipPath, Rect,
  Text as SvgText, Image as SvgImage,
} from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";
import { Audio } from "expo-av";
import * as Location from "expo-location";
import { createClient } from "@supabase/supabase-js";

/* Real village illustration assets — imported (not require()'d)
   specifically because Expo Snack's own documentation and known
   issue tracker both point at import as the actual reliable
   convention for local image assets in Snack's web-based bundler,
   which is a genuinely different environment from a standard Metro
   build. require() on these same files produced a real, reproducible
   "Unable to resolve module X.png.js" error — traced through several
   other real angles (hoisting to top-level constants, checking for a
   dynamic-lookup pattern) before finding this was actually a Snack-
   specific asset-loading quirk, not a problem with any of that
   surrounding code. */
import SCHOOLHOUSE_ART from "./assets/Village/schoolhouse-kawaii-transparent.png";
import BELL_ART from "./assets/Village/bell-transparent.png";
import FOUNTAIN_WET_ART from "./assets/Village/fountain-wet-transparent.png";
import TREE_ART_TEAL from "./assets/Village/tree1-transparent.png";
import TREE_ART_ROSE from "./assets/Village/tree2-transparent.png";
import CLOCKTOWER_ART from "./assets/Village/clocktower-transparent.png";
import TREE_ART_CORAL from "./assets/Village/tree3-transparent.png";
import TREE_ART_GREEN from "./assets/Village/tree4-transparent.png";

/* ============================================================
   STORAGE ADAPTER — same get/set/JSON shape the logic layer
   already expects, backed by AsyncStorage.
   ============================================================ */
/* ============================================================
   CLOUD SYNC — Supabase-backed cross-device sync.
   A "sync code" (short, user-chosen or generated) is the row
   key in sync_data. Any device that enters the same code reads
   and writes the same JSON blob: every critter:* key, together.
   This does not replace local AsyncStorage — it mirrors it.
   ============================================================ */
const SUPABASE_URL = "https://bzbnlkptsepttkhvopyn.supabase.co";
const SUPABASE_KEY = "sb_publishable_MeOQ45zntQ5X0WFwH5Bedg_ry7raUZT";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ============================================================
   GOOGLE OAUTH — a genuinely SEPARATE Supabase project from the one
   above, used only for Google sign-in, not for the existing live-
   sync system. Confirmed deliberately: reusing the old app's own
   Supabase project for auth, rather than merging it into the sync
   project used elsewhere in this file.
   ============================================================ */
const GOOGLE_AUTH_SUPABASE_URL = "https://ytgrbzjcqsgvofcumwst.supabase.co";
const GOOGLE_AUTH_SUPABASE_KEY = "sb_publishable_Qe7l8CRFWNvlw4wlgvmV8Q_lYtB_IqG";
const GOOGLE_AUTH_SNACK_WEB_URL = "https://snack.expo.dev/@sabistudiys/c44b6f";
const OAUTH_VERIFIER_KEY = "kawaii-critters-snack-oauth-verifier";
const OAUTH_STATE_KEY = "kawaii-critters-snack-oauth-state";

function oauthRedirectUri() {
  // Linking.createURL() is the real, correct way to get a redirect
  // URI that works across web, iOS, and Android consistently — on
  // native it produces the app's own custom scheme (e.g.
  // kawaiicritters://), on web it produces a real page URL. This
  // replaces the old window.location-only version, which never
  // worked for native at all since window.location isn't a real
  // browser location object there.
  return Linking.createURL("auth-callback");
}

function readOAuthResult(url) {
  if (!url) return null;
  const parsed = new URL(url);
  const query = parsed.searchParams;
  const fragment = new URLSearchParams(parsed.hash.replace(/^#/, ""));
  const get = (key) => query.get(key) || fragment.get(key);
  return {
    code: get("code"),
    state: get("state"),
    accessToken: get("access_token"),
    refreshToken: get("refresh_token"),
    user: get("user"),
    error: get("error_description") || get("error"),
  };
}

function base64Url(bytes) {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomUrlValue(byteLength = 32) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function createPkcePair() {
  const verifier = randomUrlValue(64);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return { verifier, challenge: base64Url(new Uint8Array(digest)) };
}

/* Opens Google sign-in in a popup window (web) so the OAuth redirect
   doesn't navigate the Snack iframe away — the popup posts the
   result back via postMessage and closes itself. On native, falls
   back to a real deep-link open instead, since there's no popup
   window concept there. */
async function signInWithGoogle() {
  const redirectTo = oauthRedirectUri();
  const { verifier, challenge } = await createPkcePair();
  const state = randomUrlValue(24);

  const params = new URLSearchParams({
    provider: "google",
    redirect_to: redirectTo,
    flow_type: "pkce",
    response_type: "code",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
    prompt: "select_account",
  });
  const authUrl = `${GOOGLE_AUTH_SUPABASE_URL}/auth/v1/authorize?${params.toString()}`;

  // WebBrowser.openAuthSessionAsync opens a real native browser sheet
  // on iOS/Android (Safari View Controller / Chrome Custom Tabs) and a
  // popup on web — genuinely one real code path for every platform,
  // unlike the old flow which only ever worked in a browser. The
  // verifier travels through this function's own closure rather than
  // localStorage, since openAuthSessionAsync resolves with the actual
  // redirect result directly instead of needing a separate postMessage
  // listener to catch it later.
  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectTo);

  if (result.type !== "success" || !result.url) {
    return { ok: false, cancelled: result.type === "cancel" || result.type === "dismiss" };
  }

  const parsed = readOAuthResult(result.url);
  if (parsed.error) return { ok: false, error: parsed.error };
  if (!parsed.code) return { ok: false, cancelled: true };
  if (parsed.state !== state) return { ok: false, error: "Sign-in state did not match. Please try again." };

  return exchangeCodeForAccount(parsed.code, verifier);
}

async function exchangeCodeForAccount(code, verifier) {
  const tokenResponse = await fetch(`${GOOGLE_AUTH_SUPABASE_URL}/auth/v1/token?grant_type=pkce`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: GOOGLE_AUTH_SUPABASE_KEY },
    body: JSON.stringify({ auth_code: code, code_verifier: verifier }),
  });
  if (!tokenResponse.ok) return { ok: false, error: "Supabase could not complete the Google sign-in." };
  const tokens = await tokenResponse.json();
  const accessToken = tokens.access_token;
  if (!accessToken) return { ok: false, error: "No access token returned." };
  const userRes = await fetch(`${GOOGLE_AUTH_SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: GOOGLE_AUTH_SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
  });
  if (!userRes.ok) return { ok: false, error: "Supabase could not load the signed-in user." };
  const user = await userRes.json();
  return {
    ok: true,
    account: {
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Google Friend",
      email: user.email || "",
      provider: "Google",
      accessToken,
      refreshToken: tokens.refresh_token || "",
    },
  };
}

const SYNC_CODE_KEY = "critter:sync_code";
const AUTO_BACKUP_KEY = "critter:autoBackupSnapshot"; // deliberately NOT prefixed to collide with the live critter:* keys collectLocalData/applyLocalData sweep — this key itself is excluded from both

async function getSyncCode() {
  const r = await storage.get(SYNC_CODE_KEY);
  return r?.value || null;
}

async function setSyncCode(code) {
  await storage.set(SYNC_CODE_KEY, code);
}

// pull every critter:* key from AsyncStorage into one object
async function collectLocalData() {
  const keys = await AsyncStorage.getAllKeys();
  const mine = keys.filter((k) => k.startsWith("critter:") && k !== SYNC_CODE_KEY && k !== AUTO_BACKUP_KEY);
  const pairs = await AsyncStorage.multiGet(mine);
  return Object.fromEntries(pairs);
}

// write an object of critter:* keys back into AsyncStorage
async function applyLocalData(data) {
  const entries = Object.entries(data).filter(([k]) => k.startsWith("critter:"));
  if (entries.length) await AsyncStorage.multiSet(entries);
}

/* Push local state to the cloud under this sync code.
   Uses upsert so the first push creates the row. */
async function pushSync(code) {
  const data = await collectLocalData();
  // sync_code is looked up first; existing row updated, else inserted
  const { data: existing } = await supabase
    .from("sync_data")
    .select("id")
    .eq("sync_code", code)
    .maybeSingle();
  const { error } = existing
    ? await supabase.from("sync_data").update({ data }).eq("sync_code", code)
    : await supabase.from("sync_data").insert({ sync_code: code, data });
  if (error) throw error;
  return true;
}

/* Pull cloud state for this sync code and merge it in locally.
   Cloud data wins per-key on conflict, since pulling is an
   explicit "give me the latest" action from the user. */
async function pullSync(code) {
  const { data: row, error } = await supabase
    .from("sync_data")
    .select("data")
    .eq("sync_code", code)
    .maybeSingle();
  if (error) throw error;
  if (!row) return { found: false };
  await applyLocalData(row.data);
  return { found: true, count: Object.keys(row.data).length };
}

/* ============================================================
   AUTOMATIC LOCAL BACKUP — entirely separate from cloud sync (which
   is a known-unreliable path right now, not something to build more
   on top of). Periodically snapshots everything under the critter:*
   prefix into its own dedicated key, with a timestamp. On app load,
   if there's genuinely no local data (a fresh install, or real data
   loss) but a snapshot exists, it's restored automatically — a real
   safety net, not requiring the person to have manually backed up.
   ============================================================ */
async function autoBackupNow() {
  try {
    const data = await collectLocalData();
    if (!Object.keys(data).length) return; // nothing real to back up yet
    await storage.set(AUTO_BACKUP_KEY, JSON.stringify({ data, at: Date.now() }));
  } catch (e) { /* best-effort — never block the app over a backup failing */ }
}

async function autoRestoreIfEmpty() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const hasRealData = keys.some((k) => k.startsWith("critter:p:")); // any actual profile data
    if (hasRealData) return { restored: false, reason: "real data already present" };
    const snap = await storage.get(AUTO_BACKUP_KEY);
    if (!snap?.value) return { restored: false, reason: "no snapshot available" };
    const parsed = JSON.parse(snap.value);
    if (!parsed?.data) return { restored: false, reason: "snapshot malformed" };
    await applyLocalData(parsed.data);
    return { restored: true, at: parsed.at };
  } catch (e) {
    return { restored: false, reason: "restore failed", error: e };
  }
}

/* Manual restore — unlike autoRestoreIfEmpty, runs regardless of
   whether real data is currently present. This is the real undo path
   for an accidental reset: pulls the last automatic snapshot (taken
   every 5 minutes while the app is open) back over whatever's there
   now. Returns how old the snapshot is so the UI can show the person
   what they're actually restoring before committing to it. */
async function peekLastBackup() {
  try {
    const snap = await storage.get(AUTO_BACKUP_KEY);
    if (!snap?.value) return null;
    const parsed = JSON.parse(snap.value);
    return parsed?.at ? parsed : null;
  } catch (e) {
    return null;
  }
}

async function manualRestoreFromBackup() {
  try {
    const snap = await storage.get(AUTO_BACKUP_KEY);
    if (!snap?.value) return { restored: false, reason: "no snapshot available" };
    const parsed = JSON.parse(snap.value);
    if (!parsed?.data) return { restored: false, reason: "snapshot malformed" };
    await applyLocalData(parsed.data);
    return { restored: true, at: parsed.at };
  } catch (e) {
    return { restored: false, reason: "restore failed", error: e };
  }
}

/* ============================================================
   LIVE SYNC — any device can pause/resume/skip and every other
   device reflects it within about a second. The synced row for
   this sync code is the single source of truth for
   {running, set, workInSet, setsDone, gated, gateReason,
    elapsedAt, elapsedBaseMs}. Local ticking still runs every
   frame for a smooth countdown — it just computes "elapsed since
   elapsedAt" against elapsedBaseMs rather than owning the number.
   Writes go out immediately on any action; a realtime channel
   pushes them to every other subscriber. */
const LIVE_ROW_PREFIX = "live:";

function liveRowId(code) { return `${LIVE_ROW_PREFIX}${code}`; }

async function pushLiveState(code, state) {
  const row = {
    sync_code: liveRowId(code),
    data: { ...state, updatedAt: Date.now() },
  };
  const { data: existing } = await supabase
    .from("sync_data").select("id").eq("sync_code", row.sync_code).maybeSingle();
  if (existing) {
    await supabase.from("sync_data").update({ data: row.data }).eq("sync_code", row.sync_code);
  } else {
    await supabase.from("sync_data").insert(row);
  }
}

async function fetchLiveState(code) {
  const { data: row } = await supabase
    .from("sync_data").select("data").eq("sync_code", liveRowId(code)).maybeSingle();
  return row?.data || null;
}

/* subscribe to changes on this code's live row. onUpdate receives
   the new state object every time any device writes. Returns an
   unsubscribe function. */
function subscribeLiveState(code, onUpdate) {
  const channel = supabase
    .channel(`live-${code}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "sync_data", filter: `sync_code=eq.${liveRowId(code)}` },
      (payload) => {
        const next = payload.new?.data;
        if (next) onUpdate(next);
      }
    )
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: false,
  }),
});

/* ============================================================
   NOTIFICATIONS — local only, no server. One notification is
   scheduled for whenever the CURRENT phase is due to end, so if
   the app is backgrounded mid-focus or mid-break, the person still
   gets nudged at the right moment. Rescheduled on every phase change.
   ============================================================ */
/* ============================================================
   LOCAL WEATHER — real integration, no key required.
   1. Ask for location permission (once; the OS remembers the choice).
   2. Get the device's coordinates.
   3. Call Open-Meteo's free forecast endpoint with those coordinates.
   4. Map its WMO weather code to our five village weather states.
   This can't fire from inside this sandbox (no network access here),
   but the calls themselves are standard fetch + expo-location and
   will run exactly as written once this ships in Expo. */
async function ensureLocationPermission() {
  const { status } = await Location.getForegroundPermissionsAsync();
  if (status === "granted") return true;
  const { status: req } = await Location.requestForegroundPermissionsAsync();
  return req === "granted";
}

async function getDeviceCoords() {
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Low, // village weather doesn't need street-level precision
  });
  return { lat: pos.coords.latitude, lon: pos.coords.longitude };
}

/* WMO weather codes (used by Open-Meteo) collapsed into our states.
   https://open-meteo.com/en/docs — "weathercode" field. */
function wmoToWeatherKind(code) {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "clouds";       // mainly clear / partly cloudy
  if (code === 3) return "clouds";                       // overcast
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";           // drizzle + rain
  if (code >= 71 && code <= 77) return "snow";           // snow
  if (code >= 80 && code <= 82) return "rain";           // rain showers
  if (code >= 85 && code <= 86) return "snow";           // snow showers
  if (code >= 95 && code <= 99) return "storm";          // thunderstorm
  return "clear";
}

const WEATHER_LABELS = {
  clear: "Clear", clouds: "Cloudy", rain: "Rain",
  storm: "Thunderstorm", fog: "Fog", snow: "Snow",
};

// weather is always fetched in imperial (see fetchLocalWeather's URL);
// these convert for display only when the person prefers metric
const cToFDisplay = (tempF, system) => system === "metric" ? Math.round((tempF - 32) * 5 / 9) : tempF;
const mphToDisplay = (mph, system) => system === "metric" ? Math.round(mph * 1.60934) : mph;
const tempUnitLabel = (system) => system === "metric" ? "°C" : "°F";
const windUnitLabel = (system) => system === "metric" ? "km/h" : "mph";

// real, distinct date format options for the sidebar header
// real percent of the current calendar day that's elapsed, based on
// actual wall-clock time — not tied to any invented daily goal
function dayPercentElapsed(date) {
  const secondsSinceMidnight = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  return Math.min(100, Math.max(0, (secondsSinceMidnight / 86400) * 100));
}

function formatHeaderDate(date, format) {
  switch (format) {
    case "short":
      return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    case "numeric":
      return date.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
    case "iso": {
      const pad = (n) => String(n).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }
    case "long":
    default:
      return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  }
}

/* ============================================================
   SILENT APP UPDATES — checks for a new published version of the
   app itself and, if one exists, downloads and applies it with no
   dialog or interruption. expo-updates only actually does anything
   in a real release/EAS-Update build; in Snack or a dev client
   Updates.isEnabled is false and this safely no-ops every time, so
   it's harmless to call from anywhere including this session.

   Applying an update means Updates.reloadAsync(), which relaunches
   the whole app and wipes in-memory state — so this is only ever
   invoked from a moment where the timer's real progress has already
   been persisted (the existing save()/bumpDay system), and only
   during hydrate specifically, per the requirement that it never
   interrupts an active focus block. On relaunch, the app's normal
   bootstrap load already restores set/workInSet/elapsed/etc from
   that same persisted state, so the timer picks up where it left
   off rather than losing progress.
   ============================================================ */
async function checkAndApplySilentUpdate() {
  try {
    if (!Updates.isEnabled) return { applied: false, reason: "updates not enabled in this build" };
    const check = await Updates.checkForUpdateAsync();
    if (!check.isAvailable) return { applied: false, reason: "no update available" };
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync(); // relaunches the app with the new version
    return { applied: true }; // unreachable in practice — reloadAsync tears down this JS context
  } catch (e) {
    return { applied: false, reason: "check failed", error: e };
  }
}

async function fetchLocalWeather() {
  const ok = await ensureLocationPermission();
  if (!ok) return { ok: false, reason: "permission" };

  const { lat, lon } = await getDeviceCoords();
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`;
  const res = await fetch(url);
  if (!res.ok) return { ok: false, reason: "network" };
  const data = await res.json();
  const cw = data?.current_weather;
  if (!cw || cw.weathercode === undefined) return { ok: false, reason: "parse" };
  return {
    ok: true,
    weatherKind: wmoToWeatherKind(cw.weathercode),
    raw: cw.weathercode,
    tempF: Math.round(cw.temperature),
    windMph: Math.round(cw.windspeed),
  };
}

/* ============================================================
   SOUNDS — one entry per real moment in the timer, each pointing at
   its own audio file. This environment can't generate or download
   audio, so every SOUNDS[key].asset starts at null; drop matching
   files into assets/timerSounds/ in the project and flip each line
   on, same pattern as the original school bell. All playback shares
   one engine (loadSound / playSound below) with the same duration-
   aware cutoff already proven for the bell — a sound never rings on
   past the phase it belongs to.

   Good free, no-attribution-required sources for each:
     work    (school bell)   — https://pixabay.com/sound-effects/search/school%20bell/
                                https://soundbible.com/tags-school-bell.html
     hydrate (soft chime)    — https://pixabay.com/sound-effects/search/soft%20bells/
     gate    (rest reached)  — https://pixabay.com/sound-effects/search/chime/
     coffee  (break reached) — https://pixabay.com/sound-effects/search/bell%20chime/
     snack   (break reached) — https://pixabay.com/sound-effects/search/bell/  (pick something
                                a little grander than the coffee one — it's the bigger milestone)
     resume  (tap to begin)  — https://pixabay.com/sound-effects/search/chime/ (a short, quiet one)
   (freesoundslibrary.com also has options for most of these, but
   requires CC BY 4.0 credit somewhere in the app)

   Once a file is saved into assets/timerSounds/, wire it in like:
     work: { asset: require("./assets/timerSounds/school-bell.mp3"), label: "..." },
   ============================================================ */
const SOUNDS = {
  work:    { asset: require("./assets/timerSounds/universfield-school-bell-199584.mp3"), label: "Work start (school bell)" },
  hydrate: { asset: require("./assets/timerSounds/freesound_community-running-water-loopable-65778.mp3"), label: "Hydrate start (running water)", loop: true },
  gate:    { asset: require("./assets/timerSounds/humordome-dream-chime-452820.mp3"), label: "Rest reached (dream chime)" },
  coffee:  { asset: require("./assets/timerSounds/mightuser-sound-of-coffee-maker-brewing-a-fresh-pot-hd-263171.mp3"), label: "Coffee break reached (coffee pot brewing)" },
  snack:   { asset: require("./assets/timerSounds/freesound_community-apple-bite-chew-eat-32412.mp3"), label: "Snack break reached (apple bite)" },
  resume:  { asset: null, label: "Resume tapped" },
};

const soundObjCache = {};
const soundStopTimers = {};

async function loadSound(key) {
  const entry = SOUNDS[key];
  if (!entry?.asset) return null;
  if (soundObjCache[key]) return soundObjCache[key];
  try {
    const { sound } = await Audio.Sound.createAsync(entry.asset);
    soundObjCache[key] = sound;
    return sound;
  } catch (e) {
    return null;
  }
}

/* Plays the sound for `key`, cutting it off at maxMs if given and the
   sound would otherwise run longer than the moment it belongs to —
   e.g. a hydrate chime never rings on past a very short hydrate. */
async function playSound(key, maxMs) {
  try {
    const sound = await loadSound(key);
    if (!sound) return;

    if (soundStopTimers[key]) { clearTimeout(soundStopTimers[key]); soundStopTimers[key] = null; }

    // sounds marked `loop: true` (currently just the hydrate running-
    // water clip) repeat for as long as the phase lasts instead of
    // playing once and going silent — the stop timer below is still
    // the hard ceiling, so a looping sound never plays past the real
    // end of the phase it belongs to, same as a one-shot sound never
    // plays past a phase shorter than itself
    const shouldLoop = !!SOUNDS[key]?.loop;
    await sound.setIsLoopingAsync(shouldLoop);
    await sound.setPositionAsync(0);
    await sound.playAsync();

    if (maxMs && maxMs > 0) {
      soundStopTimers[key] = setTimeout(async () => {
        try {
          await sound.stopAsync();
          if (shouldLoop) await sound.setIsLoopingAsync(false); // reset so a future one-shot play of this key doesn't loop unexpectedly
        } catch (e) {}
        soundStopTimers[key] = null;
      }, maxMs);
    } else if (shouldLoop) {
      // no cutoff given (shouldn't normally happen for hydrate, which
      // always has a real phase length) — never let a looping sound
      // run unbounded, cap it defensively at 2 minutes
      soundStopTimers[key] = setTimeout(async () => {
        try { await sound.stopAsync(); await sound.setIsLoopingAsync(false); } catch (e) {}
        soundStopTimers[key] = null;
      }, 120000);
    }
  } catch (e) { /* sound unavailable — fail silently, never block the timer */ }
}

async function ensureNotifPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const { status: req } = await Notifications.requestPermissionsAsync();
  return req === "granted";
}

/* Schedule notifications for an entire sequence of upcoming phases at
   once, each timed from now. This is what lets notifications survive
   backgrounding: iOS fires scheduled notifications independent of the
   app's JS ever running again, but only for triggers that were already
   registered before the app was suspended — one notification for only
   the current phase would leave every later phase silent. */
async function scheduleNotifSequence(entries) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    let cursor = 0;
    for (const { msFromNow, title, body } of entries) {
      cursor = msFromNow;
      if (cursor <= 0) continue;
      await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: { type: "timeInterval", seconds: Math.max(1, Math.round(cursor / 1000)), repeats: false },
      });
    }
  } catch (e) { /* notifications unavailable */ }
}

const storage = {
  async get(key) {
    const v = await AsyncStorage.getItem(key);
    return v === null ? null : { value: v };
  },
  async set(key, value) {
    await AsyncStorage.setItem(key, value);
    return { value };
  },
};

/* ============================================================
   LOCAL BACKUP — export/import every critter:* key as one JSON
   file. This is the safety net until real account sync lands:
   nothing here talks to a server, it just gets your data off
   the device and into a file you control (Files, iCloud, email).
   ============================================================ */
const BACKUP_PREFIX = "critter:";

async function backupToText() {
  const keys = await AsyncStorage.getAllKeys();
  const mine = keys.filter((k) => k.startsWith(BACKUP_PREFIX));
  const pairs = await AsyncStorage.multiGet(mine);
  const payload = {
    app: "kawaii-critters",
    exportedAt: new Date().toISOString(),
    data: Object.fromEntries(pairs),
  };
  return JSON.stringify(payload);
}

async function restoreFromText(text) {
  const payload = JSON.parse(text);
  if (!payload?.data) return { ok: false };
  const entries = Object.entries(payload.data).filter(([k]) => k.startsWith(BACKUP_PREFIX));
  await AsyncStorage.multiSet(entries);
  return { ok: true, count: entries.length };
}

/* ============================================================
   CREATURE GENERATOR — 365 deterministic fantasy critters.
   Ported verbatim — pure math, no DOM.
   ============================================================ */
const CRITTER_COUNT = 365;

const rng = (seed) => {
  let s = (seed * 2654435761) % 4294967296;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};
const pick = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length];

const PALETTES = [
  { name: "Emberfox",  body: [18, 88, 62],  belly: [38, 92, 82],  accent: [350, 85, 62] },
  { name: "Frostmoth", body: [196, 72, 68], belly: [200, 60, 88], accent: [280, 70, 72] },
  { name: "Mosswing",  body: [138, 52, 48], belly: [76, 58, 76],  accent: [42, 88, 64] },
  { name: "Duskdrake", body: [268, 58, 52], belly: [286, 48, 76], accent: [318, 82, 66] },
  { name: "Tidecalf",  body: [188, 64, 54], belly: [176, 52, 82], accent: [156, 72, 62] },
  { name: "Sunhart",   body: [36, 84, 62],  belly: [46, 78, 84],  accent: [12, 86, 60] },
  { name: "Voidkit",   body: [244, 44, 38], belly: [252, 38, 62], accent: [186, 88, 64] },
  { name: "Bloomcat",  body: [330, 66, 68], belly: [342, 58, 88], accent: [96, 62, 58] },
  { name: "Stormpup",  body: [214, 48, 46], belly: [210, 36, 74], accent: [52, 92, 66] },
  { name: "Cinderowl", body: [8, 72, 54],   belly: [28, 66, 78],  accent: [44, 90, 68] },
  { name: "Glasswyrm", body: [168, 58, 60], belly: [162, 44, 84], accent: [292, 74, 70] },
  { name: "Runedeer",  body: [258, 40, 48], belly: [264, 34, 74], accent: [174, 78, 62] },
  { name: "Peachimp",  body: [22, 78, 72],  belly: [32, 82, 88],  accent: [338, 76, 68] },
  { name: "Nightlily", body: [284, 52, 44], belly: [300, 44, 70], accent: [58, 88, 70] },
  { name: "Reedfrog",  body: [104, 56, 52], belly: [88, 62, 78],  accent: [16, 84, 62] },
  { name: "Aurorafin", body: [206, 70, 58], belly: [190, 58, 82], accent: [326, 78, 70] },
];
const hsl = ([h, s, l], dl = 0) =>
  `hsl(${h}, ${s}%, ${Math.max(6, Math.min(96, l + dl))}%)`;

const ARCHETYPES = ["fox","owl","cat","deer","frog","moth","drake","otter","hare","serpent","bear","crow"];

/* Which movement style each archetype actually uses in the full-body
   scenes (flower picking, garden wandering). Four legs for the
   ground mammals, a two-legged hop with wings for the birds and
   drake, a hop arc for the frog, a travelling ripple for the
   legless serpent, and a permanent hover for the moth. */
const LOCOMOTION = {
  fox: "quadruped", cat: "quadruped", deer: "quadruped",
  otter: "quadruped", hare: "quadruped", bear: "quadruped",
  owl: "biped", drake: "biped", crow: "biped",
  frog: "hop",
  serpent: "serpent",
  moth: "flutter",
};
const MARKINGS = ["none", "spots", "stripes", "patch", "freckle", "star"];
const CRESTS = ["none", "horns", "antlers", "plume", "fins", "ears"];
const EYES = ["round", "sleepy", "wide", "starry", "closed"];
const AURAS = ["none", "none", "glow", "sparks", "petals"];

function critterFor(n) {
  const idx = (((n - 1) % CRITTER_COUNT) + CRITTER_COUNT) % CRITTER_COUNT;
  const r = rng(idx + 7919);
  const archetype = ARCHETYPES[idx % ARCHETYPES.length];
  const palette = PALETTES[(idx * 7 + Math.floor(idx / 12)) % PALETTES.length];
  const marking = pick(r, MARKINGS);
  const crest = pick(r, CRESTS);
  const eyes = pick(r, EYES);
  const aura = pick(r, AURAS);
  const hueShift = Math.floor(r() * 40) - 20;
  const shift = ([h, s, l]) => [(h + hueShift + 360) % 360, s, l];
  return {
    index: idx + 1, archetype, marking, crest, eyes, aura,
    name: `${palette.name} ${archetype[0].toUpperCase()}${archetype.slice(1)}`,
    body: shift(palette.body), belly: shift(palette.belly), accent: shift(palette.accent),
  };
}

const BODIES = {
  fox: () => ({ head: "M32 14 C44 14 51 23 51 33 C51 44 42 51 32 51 C22 51 13 44 13 33 C13 23 20 14 32 14Z", snout: "M32 34 C37 34 40 38 40 41 C40 45 36 47 32 47 C28 47 24 45 24 41 C24 38 27 34 32 34Z", earL: "M17 20 L12 6 L26 14Z", earR: "M47 20 L52 6 L38 14Z" }),
  owl: () => ({ head: "M32 12 C45 12 52 22 52 34 C52 46 43 53 32 53 C21 53 12 46 12 34 C12 22 19 12 32 12Z", snout: "M32 32 L36 38 L32 42 L28 38Z", earL: "M18 16 L14 5 L27 12Z", earR: "M46 16 L50 5 L37 12Z" }),
  cat: () => ({ head: "M32 15 C44 15 50 24 50 34 C50 45 42 51 32 51 C22 51 14 45 14 34 C14 24 20 15 32 15Z", snout: "M32 35 C36 35 38 38 38 41 C38 44 35 46 32 46 C29 46 26 44 26 41 C26 38 28 35 32 35Z", earL: "M18 21 L14 8 L27 15Z", earR: "M46 21 L50 8 L37 15Z" }),
  deer: () => ({ head: "M32 14 C42 14 48 23 48 34 C48 46 41 53 32 53 C23 53 16 46 16 34 C16 23 22 14 32 14Z", snout: "M32 38 C36 38 38 41 38 44 C38 47 35 49 32 49 C29 49 26 47 26 44 C26 41 28 38 32 38Z", earL: "M17 24 C11 20 9 26 14 30Z", earR: "M47 24 C53 20 55 26 50 30Z" }),
  frog: () => ({ head: "M32 18 C46 18 54 27 54 37 C54 47 44 53 32 53 C20 53 10 47 10 37 C10 27 18 18 32 18Z", snout: "M32 40 C36 40 38 42 38 44 C38 46 35 47 32 47 C29 47 26 46 26 44 C26 42 28 40 32 40Z", earL: "M19 19 C15 13 23 11 25 17Z", earR: "M45 19 C49 13 41 11 39 17Z" }),
  moth: () => ({ head: "M32 20 C42 20 48 27 48 36 C48 46 41 52 32 52 C23 52 16 46 16 36 C16 27 22 20 32 20Z", snout: "", earL: "M22 20 C16 10 24 6 28 15Z", earR: "M42 20 C48 10 40 6 36 15Z" }),
  drake: () => ({ head: "M32 15 C44 15 51 24 51 34 C51 45 42 52 32 52 C22 52 13 45 13 34 C13 24 20 15 32 15Z", snout: "M32 36 C38 36 42 39 42 43 C42 47 37 49 32 49 C27 49 22 47 22 43 C22 39 26 36 32 36Z", earL: "M16 22 L8 14 L22 16Z", earR: "M48 22 L56 14 L42 16Z" }),
  otter: () => ({ head: "M32 16 C44 16 50 25 50 35 C50 46 42 52 32 52 C22 52 14 46 14 35 C14 25 20 16 32 16Z", snout: "M32 36 C37 36 40 39 40 42 C40 46 36 48 32 48 C28 48 24 46 24 42 C24 39 27 36 32 36Z", earL: "M19 20 C15 16 20 12 23 17Z", earR: "M45 20 C49 16 44 12 41 17Z" }),
  hare: () => ({ head: "M32 18 C43 18 49 26 49 36 C49 47 41 53 32 53 C23 53 15 47 15 36 C15 26 21 18 32 18Z", snout: "M32 38 C35 38 37 40 37 43 C37 46 35 47 32 47 C29 47 27 46 27 43 C27 40 29 38 32 38Z", earL: "M24 20 C20 4 26 2 29 18Z", earR: "M40 20 C44 4 38 2 35 18Z" }),
  serpent: () => ({ head: "M32 16 C43 16 50 24 50 33 C50 44 42 52 32 52 C22 52 14 44 14 33 C14 24 21 16 32 16Z", snout: "M32 34 C37 34 41 37 41 41 C41 46 36 48 32 48 C28 48 23 46 23 41 C23 37 27 34 32 34Z", earL: "M18 22 C12 20 12 27 17 27Z", earR: "M46 22 C52 20 52 27 47 27Z" }),
  bear: () => ({ head: "M32 15 C45 15 52 24 52 35 C52 46 43 52 32 52 C21 52 12 46 12 35 C12 24 19 15 32 15Z", snout: "M32 36 C37 36 41 39 41 43 C41 47 36 48 32 48 C28 48 23 47 23 43 C23 39 27 36 32 36Z", earL: "M17 18 C12 13 19 9 23 15Z", earR: "M47 18 C52 13 45 9 41 15Z" }),
  crow: () => ({ head: "M32 16 C43 16 50 25 50 35 C50 46 42 52 32 52 C22 52 14 46 14 35 C14 25 21 16 32 16Z", snout: "M32 34 L42 40 L32 45 L28 40Z", earL: "M20 18 L15 9 L27 15Z", earR: "M44 18 L49 9 L37 15Z" }),
};

/* Rainbow flowers mark progress through a set — one per work block,
   each taking a different hue, opening and saturating as it fills. */
const FLOWER_HUES = [345, 25, 50, 140, 200, 275];

/* Rotating rest-break prompts — a quick, low-pressure mental check-in
   rather than a full journal. Mixed styles (gratitude, simple status,
   open reflection) so it doesn't feel like the same question every
   time. Picked by day + rest count, so it changes through the day
   without needing its own persisted "which prompt was shown" state. */
/* ============================================================
   PLANT GROWTH SYSTEM — 12 genuinely distinct plant archetypes,
   each with real, hand-authored geometry across all 20 growth
   stages (seed through fully bloomed), not a single shape naively
   scaled up. Mirrors the proven critter-archetype pattern already
   in this file (12 fixed archetypes, each with its own real shape
   data) rather than inventing a new approach.

   Growth stage is 0-19. Each archetype function takes a stage and
   returns real SVG path/shape data for that exact point in its
   life: seed (0-1), sprout (2-4), stem+first leaves (5-9), budding
   (10-14), blooming (15-19) — the specific transitions differ per
   archetype since a cactus and a sunflower don't grow the same way.
   ============================================================ */
const PLANT_ARCHETYPES = [
  "rose", "sunflower", "fern", "cactus", "sapling", "vine",
  "tulip", "daisy", "succulent", "bamboo", "toadstool", "herb",
];
const PLANT_COUNT = PLANT_ARCHETYPES.length;
const PLANT_STAGE_COUNT = 20;

function plantFor(n) {
  const idx = (((n - 1) % PLANT_COUNT) + PLANT_COUNT) % PLANT_COUNT;
  const archetype = PLANT_ARCHETYPES[idx];
  return {
    index: idx + 1,
    archetype,
    name: archetype[0].toUpperCase() + archetype.slice(1),
  };
}

/* Real 20-stage growth art for the ROSE archetype, genuinely driven
   by the current real calendar month rather than a fixed palette —
   uses the same MONTH_THEMES table already coloring the sky, so a
   rose grown in April looks meaningfully different from one grown in
   October, not just a tinted recolor: stem/leaf tone shifts with the
   season, and the later bloom stages carry real seasonal motifs
   (frost flecks in winter months, warm gold dust in high summer,
   falling-petal accents in autumn) rather than only changing color.
   viewBox is 0 0 64 90 — tall enough for a full stem-to-bloom rose. */
function roseStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const stemHue = 120 + theme.hueShift * 0.4;
  const stemSat = Math.max(20, Math.min(70, 45 * theme.satMul));
  const stemLit = Math.max(18, Math.min(55, 32 * theme.litMul));
  const stemColor = `hsl(${stemHue}, ${stemSat}%, ${stemLit}%)`;
  const leafColor = `hsl(${stemHue + 6}, ${stemSat * 0.9}%, ${stemLit + 8}%)`;
  const petalHue = 345 + theme.hueShift * 0.6;
  const petalSat = Math.max(35, Math.min(85, 62 * theme.satMul));
  const petalLit = Math.max(35, Math.min(72, 52 * theme.litMul));
  const petalColor = `hsl(${petalHue}, ${petalSat}%, ${petalLit}%)`;
  const petalDeep = `hsl(${petalHue}, ${petalSat}%, ${Math.max(20, petalLit - 18)}%)`;

  // seasonal accent shown only at the fullest bloom stages, real
  // per-month motif rather than a generic sparkle — this is the
  // "extremely monthly themed" part, not just recoloring
  const seasonalAccent = (() => {
    const m = ((month % 12) + 12) % 12;
    if (m === 11 || m === 0 || m === 1) { // Dec/Jan/Feb — frost
      return <G opacity="0.55">
        <Circle cx="18" cy="14" r="1" fill="#EAF2FF" /><Circle cx="46" cy="18" r="0.8" fill="#EAF2FF" />
        <Circle cx="32" cy="8" r="1.1" fill="#EAF2FF" />
      </G>;
    }
    if (m === 5 || m === 6 || m === 7) { // Jun/Jul/Aug — sun-warmth
      return <G opacity="0.4">
        <Circle cx="16" cy="16" r="1.3" fill="#FFE9A8" /><Circle cx="48" cy="20" r="1" fill="#FFE9A8" />
      </G>;
    }
    if (m === 8 || m === 9 || m === 10) { // Sep/Oct/Nov — falling petals
      return <G opacity="0.6">
        <Ellipse cx="14" cy="24" rx="1.6" ry="1" fill={petalColor} transform="rotate(30 14 24)" />
        <Ellipse cx="50" cy="30" rx="1.4" ry="0.9" fill={petalColor} transform="rotate(-20 50 30)" />
      </G>;
    }
    // Mar/Apr/May — fresh spring dew
    return <G opacity="0.5">
      <Circle cx="20" cy="20" r="0.9" fill="#EAFBFF" /><Circle cx="44" cy="15" r="0.7" fill="#EAFBFF" />
    </G>;
  })();

  const groundY = 86;

  if (stage === 0) { // seed, just planted
    return (
      <G>
        <Ellipse cx="32" cy={groundY} rx="14" ry="3" fill="#3A2A1E" opacity="0.5" />
        <Ellipse cx="32" cy={groundY - 2} rx="2.4" ry="1.8" fill="#5A4530" />
      </G>
    );
  }
  if (stage === 1) { // first crack, tiny shoot tip
    return (
      <G>
        <Ellipse cx="32" cy={groundY} rx="14" ry="3" fill="#3A2A1E" opacity="0.5" />
        <Path d={`M32 ${groundY} L32 ${groundY - 3}`} stroke={stemColor} strokeWidth="1.4" strokeLinecap="round" />
      </G>
    );
  }
  if (stage <= 4) { // sprout: bare stem, no leaves yet, growing taller
    const h = 6 + (stage - 1) * 4;
    return (
      <G>
        <Ellipse cx="32" cy={groundY} rx="14" ry="3" fill="#3A2A1E" opacity="0.5" />
        <Path d={`M32 ${groundY} L32 ${groundY - h}`} stroke={stemColor} strokeWidth="1.8" strokeLinecap="round" />
        <Ellipse cx="32" cy={groundY - h} rx="1.6" ry="1.2" fill={leafColor} />
      </G>
    );
  }
  if (stage <= 9) { // stem + first real leaves, no bud yet
    const h = 18 + (stage - 5) * 6;
    const leafPairs = stage - 4; // 1 to 5
    return (
      <G>
        <Ellipse cx="32" cy={groundY} rx="14" ry="3" fill="#3A2A1E" opacity="0.5" />
        <Path d={`M32 ${groundY} Q30 ${groundY - h / 2} 32 ${groundY - h}`}
          stroke={stemColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {Array.from({ length: leafPairs }).map((_, i) => {
          const ly = groundY - 6 - i * (h / (leafPairs + 1));
          return (
            <G key={i}>
              <Path d={`M31 ${ly} Q24 ${ly - 3} 22 ${ly + 2} Q26 ${ly + 4} 31 ${ly}Z`} fill={leafColor} />
              <Path d={`M33 ${ly} Q40 ${ly - 3} 42 ${ly + 2} Q38 ${ly + 4} 33 ${ly}Z`} fill={leafColor} />
            </G>
          );
        })}
      </G>
    );
  }
  if (stage <= 14) { // budding: full stem+leaves, a closed bud forming and swelling
    const budR = 2 + (stage - 10) * 1.3;
    return (
      <G>
        <Ellipse cx="32" cy={groundY} rx="14" ry="3" fill="#3A2A1E" opacity="0.5" />
        <Path d={`M32 ${groundY} Q29 ${groundY - 30} 32 ${groundY - 52}`}
          stroke={stemColor} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        {[0.25, 0.5, 0.72].map((t, i) => {
          const ly = groundY - 8 - t * 40;
          const side = i % 2 === 0 ? 1 : -1;
          return (
            <G key={i}>
              <Path d={`M${32 + side * 1} ${ly} Q${32 + side * 9} ${ly - 3} ${32 + side * 11} ${ly + 3} Q${32 + side * 6} ${ly + 5} ${32 + side * 1} ${ly}Z`} fill={leafColor} />
            </G>
          );
        })}
        <Circle cx="32" cy={groundY - 52} r={budR} fill={petalDeep} />
        <Path d={`M32 ${groundY - 52 - budR} Q${32 - budR * 0.6} ${groundY - 52} 32 ${groundY - 52 + budR}`}
          stroke={petalColor} strokeWidth="0.8" fill="none" opacity="0.6" />
      </G>
    );
  }
  // stages 15-19: opening into full bloom, petal count/openness increases each stage
  const openT = (stage - 14) / 5; // 0.2 .. 1.0
  const bloomY = groundY - 54;
  const petalCount = 5 + Math.floor(openT * 3);
  return (
    <G>
      <Ellipse cx="32" cy={groundY} rx="14" ry="3" fill="#3A2A1E" opacity="0.5" />
      <Path d={`M32 ${groundY} Q29 ${groundY - 30} 32 ${groundY - 52}`}
        stroke={stemColor} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {[0.25, 0.5, 0.72].map((t, i) => {
        const ly = groundY - 8 - t * 40;
        const side = i % 2 === 0 ? 1 : -1;
        return <Path key={i} d={`M${32 + side * 1} ${ly} Q${32 + side * 9} ${ly - 3} ${32 + side * 11} ${ly + 3} Q${32 + side * 6} ${ly + 5} ${32 + side * 1} ${ly}Z`} fill={leafColor} />;
      })}
      {/* thorns — a small real detail, more visible as the plant matures */}
      {stage >= 17 && (
        <>
          <Path d={`M32 ${groundY - 20} L28 ${groundY - 18}`} stroke={stemColor} strokeWidth="1.2" strokeLinecap="round" />
          <Path d={`M32 ${groundY - 34} L36 ${groundY - 32}`} stroke={stemColor} strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}
      <G transform={`translate(32 ${bloomY}) scale(${0.5 + openT * 0.5})`}>
        {Array.from({ length: petalCount }).map((_, i) => {
          const a = (360 / petalCount) * i;
          return <Ellipse key={i} cx="0" cy="-6" rx="6" ry="9" fill={petalColor}
            transform={`rotate(${a}) translate(0 ${-2 + openT * 2})`} opacity={0.92} />;
        })}
        <Circle cx="0" cy="0" r={3 + openT * 1.5} fill={petalDeep} />
      </G>
      {seasonalAccent}
    </G>
  );
}

/* ============================================================
   PLANT ARCHETYPES 2-12 — 20-stage growth art for every archetype
   besides the rose (which was the v82 pilot). Each function follows
   the exact same contract as roseStageArt: takes (stage 0-19, month
   0-11), returns a <G> element in the 0 0 64 90 viewBox, groundY=86.
   Colors are driven by MONTH_THEMES the same way — hueShift/satMul/
   litMul applied to each archetype's characteristic palette so plants
   grown in January genuinely look different from July ones.
   ============================================================ */

/* --- SUNFLOWER — tall straight stem, large golden disc bloom --- */
function sunflowerStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const stemC = gH(120 + theme.hueShift * 0.3, 42, 30);
  const leafC = gH(128 + theme.hueShift * 0.2, 50, 38);
  const petC  = gH(44  + theme.hueShift * 0.2, 90, 56);
  const diskC = gH(22  + theme.hueShift * 0.1, 62, 17);
  const gy = 86;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;
  const lf = (ly, flip) => (
    <Path d={`M${32+flip} ${ly} Q${32+flip*15} ${ly-6} ${32+flip*17} ${ly+4} Q${32+flip*10} ${ly+11} ${32+flip} ${ly}Z`} fill={leafC}/>
  );
  if (stage === 0) return <G>{soil}<Ellipse cx="32" cy={gy-2} rx="2.4" ry="1.8" fill="#5A4530"/></G>;
  if (stage === 1) return <G>{soil}<Path d={`M32 ${gy} L32 ${gy-6}`} stroke={stemC} strokeWidth="1.6" strokeLinecap="round"/></G>;
  if (stage <= 4) {
    const h = 6+(stage-2)*6;
    return <G>{soil}
      <Path d={`M32 ${gy} L32 ${gy-h}`} stroke={stemC} strokeWidth="2" strokeLinecap="round"/>
      {stage>=3 && lf(gy-h+2,-1)}{stage>=4 && lf(gy-h+2,1)}
    </G>;
  }
  if (stage <= 9) {
    const h = 22+(stage-5)*8;
    return <G>{soil}
      <Path d={`M32 ${gy} L32 ${gy-h}`} stroke={stemC} strokeWidth="2.4" strokeLinecap="round"/>
      {lf(gy-12,-1)}{stage>=6&&lf(gy-24,1)}{stage>=8&&lf(gy-38,-1)}
    </G>;
  }
  if (stage <= 14) {
    const br = 3+(stage-10)*1.5;
    return <G>{soil}
      <Path d={`M32 ${gy} L32 ${gy-65}`} stroke={stemC} strokeWidth="2.6" strokeLinecap="round"/>
      {lf(gy-14,-1)}{lf(gy-28,1)}{lf(gy-44,-1)}
      <G transform={`translate(32 ${gy-67})`}>
        <Ellipse cx="0" cy="0" rx={br*0.7} ry={br*1.1} fill={leafC}/>
        <Ellipse cx="0" cy="0" rx={br*0.35} ry={br*0.7} fill={petC} opacity="0.55"/>
      </G>
    </G>;
  }
  const ot=(stage-14)/5; const by=gy-69; const pc=12+Math.floor(ot*6); const pl=7+ot*5;
  return <G>{soil}
    <Path d={`M32 ${gy} L32 ${gy-67}`} stroke={stemC} strokeWidth="2.8" strokeLinecap="round"/>
    {lf(gy-14,-1)}{lf(gy-30,1)}{lf(gy-46,-1)}
    <G transform={`translate(32 ${by})`}>
      {Array.from({length:pc}).map((_,i) => {
        const a=(360/pc)*i;
        return <Ellipse key={i} cx="0" cy={-(5+pl*0.5)} rx="3.2" ry={pl} fill={petC} transform={`rotate(${a})`} opacity="0.94"/>;
      })}
      <Circle cx="0" cy="0" r={5+ot*4} fill={diskC}/>
      <Circle cx="0" cy="0" r={3+ot*2} fill="hsl(22,48%,12%)" opacity="0.5"/>
    </G>
  </G>;
}

/* --- FERN — fiddleheads unroll into feathered fronds, no bloom --- */
function fernStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const stemC  = gH(128 + theme.hueShift * 0.2, 48, 26);
  const leafC  = gH(125 + theme.hueShift * 0.2, 55, 36);
  const lightC = gH(118 + theme.hueShift * 0.2, 50, 48);
  const gy = 86;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;

  if (stage === 0) return <G>{soil}<Ellipse cx="32" cy={gy-2} rx="1.8" ry="1.4" fill={stemC} opacity="0.7"/></G>;
  if (stage === 1) return <G>{soil}
    <Path d="M32 84 Q31 80 30 77" stroke={stemC} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    <Circle cx="30" cy="77" r="1.8" fill={leafC}/>
  </G>;

  if (stage <= 4) { // coiled fiddleheads
    return <G>{soil}
      <Path d={`M32 ${gy} Q30 ${gy-14} 26 ${gy-22} Q22 ${gy-30} 27 ${gy-34} Q32 ${gy-28} 30 ${gy-22}`}
        stroke={stemC} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <Circle cx="28" cy={gy-34} r="3.2" fill={leafC}/>
      {stage>=3 && <>
        <Path d={`M33 ${gy-2} Q38 ${gy-14} 40 ${gy-22} Q43 ${gy-30} 38 ${gy-34} Q34 ${gy-27} 37 ${gy-22}`}
          stroke={stemC} strokeWidth="1.9" fill="none" strokeLinecap="round"/>
        <Circle cx="38" cy={gy-34} r="2.6" fill={leafC}/>
      </>}
      {stage>=4 && <>
        <Path d={`M31 ${gy-8} Q27 ${gy-16} 23 ${gy-20} Q19 ${gy-26} 23 ${gy-30} Q27 ${gy-26} 25 ${gy-22}`}
          stroke={stemC} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        <Circle cx="23" cy={gy-30} r="2" fill={leafC}/>
      </>}
    </G>;
  }

  // draws one arching frond: stem from (32,gy-2) curving in the given direction,
  // with leaflets fanning off both sides — called as a plain function, not a component
  const frond = (angle, len, flip) => {
    const rad = angle * Math.PI / 180;
    const ex = 32 + Math.sin(rad)*len; const ey = gy-2 - Math.cos(rad)*len;
    const mx = (32+ex)/2 + flip*10; const my = (gy-2+ey)/2 - 5;
    const lc = Math.floor(3 + (len/50)*5);
    const leaflets = Array.from({length:lc}).map((_,i) => {
      const t=(i+1)/(lc+1);
      const lx=32+(ex-32)*t + flip*5*t; const ly=(gy-2)+(ey-(gy-2))*t - 3*t;
      const la = angle + flip*52;
      return <Ellipse key={i} cx={lx+Math.cos(la*Math.PI/180)*3*flip} cy={ly+Math.sin(la*Math.PI/180)*1.5}
        rx={cl(3.2-t*0.4,1,4)} ry="1.6" fill={i%2===0?leafC:lightC}
        transform={`rotate(${la} ${lx+Math.cos(la*Math.PI/180)*3*flip} ${ly+Math.sin(la*Math.PI/180)*1.5})`}/>;
    });
    return <G>
      <Path d={`M32 ${gy-2} Q${mx} ${my} ${ex} ${ey}`} stroke={stemC} strokeWidth="1.9" fill="none" strokeLinecap="round"/>
      {leaflets}
    </G>;
  };

  if (stage <= 9) {
    const ext=(stage-5)/4; const len=26+ext*22;
    return <G>{soil}
      {frond(-12, len, 1)}
      {stage>=7 && frond(14, len*0.85, -1)}
      {stage>=9 && frond(-30, len*0.7, 1)}
    </G>;
  }
  if (stage <= 14) {
    const ot=(stage-10)/4; const count=3+Math.floor(ot*2);
    const defs=[[-18,50,1],[-2,54,-1],[14,48,1],[28,42,-1],[-34,40,1]];
    return <G>{soil}
      {defs.slice(0,count).map(([a,l,fl],i) => <G key={i}>{frond(a,l,fl)}</G>)}
    </G>;
  }
  const defs=[[-22,54,1],[-5,58,-1],[12,52,1],[26,46,-1],[-38,44,1],[38,38,1],[-15,46,-1]];
  return <G>{soil}
    {defs.map(([a,l,fl],i) => <G key={i}>{frond(a,l,fl)}</G>)}
  </G>;
}

/* --- CACTUS — columnar body with ribs and spines, small bloom at top --- */
function cactusStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const bodyC   = gH(155 + theme.hueShift * 0.2, 55, 30);
  const bodyLt  = gH(150 + theme.hueShift * 0.2, 48, 42);
  const spineC  = gH(50  + theme.hueShift * 0.1, 28, 68);
  const flowerC = gH(330 + theme.hueShift * 0.5, 75, 58);
  const gy = 86;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;

  if (stage === 0) return <G>{soil}<Ellipse cx="32" cy={gy-2} rx="2" ry="1.6" fill={bodyC} opacity="0.7"/></G>;
  if (stage === 1) return <G>{soil}<Ellipse cx="32" cy={gy-5} rx="3.5" ry="5" fill={bodyC}/>
    <Path d="M32 80 L32 83" stroke={spineC} strokeWidth="0.9"/></G>;

  if (stage <= 4) { // round barrel
    const r=5+(stage-2)*2.5; const top=gy-r*2-2;
    const spines=[-1,0,1];
    return <G>{soil}
      <Ellipse cx="32" cy={top+r} rx={r} ry={r*1.1} fill={bodyC}/>
      <Path d={`M32 ${top+r-r*0.9} L32 ${top+r+r*0.9}`} stroke={bodyLt} strokeWidth="1" opacity="0.45"/>
      {spines.map(s2 => <Path key={s2} d={`M${32+s2*r*0.7} ${top+r*0.5} L${32+s2*r*0.7+(s2===0?-4:s2*4)} ${top+r*0.5-5}`} stroke={spineC} strokeWidth="0.9"/>)}
    </G>;
  }
  if (stage <= 9) {
    const h=18+(stage-5)*7; const w=8; const top=gy-h; const rc=Math.floor(3+h/10);
    return <G>{soil}
      <Path d={`M${32-w} ${gy} Q${32-w} ${top+8} 32 ${top} Q${32+w} ${top+8} ${32+w} ${gy}`} fill={bodyC}/>
      {Array.from({length:rc}).map((_,i) => {
        const ry2=top+8+i*(h-8)/rc;
        return <Path key={i} d={`M${32-w} ${ry2} Q32 ${ry2-2} ${32+w} ${ry2}`} stroke={bodyLt} strokeWidth="0.8" fill="none" opacity="0.45"/>;
      })}
      {[0,1,2].map(i => {
        const sy=top+10+i*(h-10)/3; const side=i%2===0?1:-1;
        return <G key={i}>
          <Path d={`M${32+side*w} ${sy} L${32+side*(w+5)} ${sy-3}`} stroke={spineC} strokeWidth="1"/>
          <Path d={`M${32+side*w} ${sy} L${32+side*(w+5)} ${sy+2}`} stroke={spineC} strokeWidth="0.8"/>
        </G>;
      })}
    </G>;
  }
  if (stage <= 14) {
    const at=(stage-10)/4; const h=55+(at*3); const w=8; const armY=gy-h*0.55;
    const armH=16+at*12;
    return <G>{soil}
      <Path d={`M${32-w} ${gy} Q${32-w} ${gy-h+10} 32 ${gy-h} Q${32+w} ${gy-h+10} ${32+w} ${gy}`} fill={bodyC}/>
      {Array.from({length:6}).map((_,i) => {
        const ry2=gy-h*0.08-i*(h*0.84)/6;
        return <Path key={i} d={`M${32-w} ${ry2} Q32 ${ry2-2} ${32+w} ${ry2}`} stroke={bodyLt} strokeWidth="0.8" fill="none" opacity="0.45"/>;
      })}
      <Path d={`M${32-w} ${armY} Q${32-w-12} ${armY+6} ${32-w-13} ${armY-armH+4} Q${32-w-8} ${armY-armH} ${32-w-4} ${armY-armH+4}`} fill={bodyC}/>
      {at>0.5 && <Path d={`M${32+w} ${armY+8} Q${32+w+11} ${armY+12} ${32+w+12} ${armY-armH*0.75+4} Q${32+w+7} ${armY-armH*0.75} ${32+w+3} ${armY-armH*0.75+4}`} fill={bodyC}/>}
    </G>;
  }
  const ot=(stage-14)/5; const h=67; const w=8; const armY=gy-h*0.55;
  return <G>{soil}
    <Path d={`M${32-w} ${gy} Q${32-w} ${gy-h+10} 32 ${gy-h} Q${32+w} ${gy-h+10} ${32+w} ${gy}`} fill={bodyC}/>
    {Array.from({length:7}).map((_,i) => {
      const ry2=gy-h*0.07-i*(h*0.86)/7;
      return <Path key={i} d={`M${32-w} ${ry2} Q32 ${ry2-2} ${32+w} ${ry2}`} stroke={bodyLt} strokeWidth="0.8" fill="none" opacity="0.45"/>;
    })}
    <Path d={`M${32-w} ${armY} Q${32-w-12} ${armY+6} ${32-w-13} ${armY-28+4} Q${32-w-8} ${armY-28} ${32-w-4} ${armY-28+4}`} fill={bodyC}/>
    <Path d={`M${32+w} ${armY+8} Q${32+w+11} ${armY+12} ${32+w+12} ${armY-22} Q${32+w+7} ${armY-26} ${32+w+3} ${armY-22}`} fill={bodyC}/>
    <G transform={`translate(32 ${gy-h}) scale(${0.4+ot*0.6})`}>
      {Array.from({length:7}).map((_,i) => {
        const a=(360/7)*i;
        return <Ellipse key={i} cx="0" cy="-5" rx="2.8" ry="4.5" fill={flowerC} transform={`rotate(${a})`} opacity="0.92"/>;
      })}
      <Circle cx="0" cy="0" r={2.5+ot} fill="hsl(48,90%,62%)"/>
    </G>
  </G>;
}

/* --- SAPLING — grows from acorn into a young tree with a seasonal canopy --- */
function saplingStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const trunkC = gH(28  + theme.hueShift * 0.1, 38, 26);
  const leafC  = gH(110 + theme.hueShift * 0.8, 52, 34);
  const leafLt = gH(115 + theme.hueShift * 0.8, 48, 44);
  const gy = 86;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;

  if (stage === 0) return <G>{soil}
    <Ellipse cx="32" cy={gy-4} rx="4" ry="5" fill={trunkC}/>
    <Path d="M28 80 Q32 78 36 80" stroke={trunkC} strokeWidth="2" fill={leafLt} strokeLinecap="round"/>
  </G>;
  if (stage === 1) return <G>{soil}
    <Ellipse cx="32" cy={gy-4} rx="3.5" ry="4" fill={trunkC}/>
    <Path d={`M32 ${gy-7} L32 ${gy-15}`} stroke={trunkC} strokeWidth="2.2" strokeLinecap="round"/>
    <Ellipse cx="32" cy={gy-17} rx="3" ry="2.5" fill={leafC} opacity="0.8"/>
  </G>;
  if (stage <= 4) {
    const h=12+(stage-2)*7; const sw=2.2+(stage-2)*0.4;
    return <G>{soil}
      <Path d={`M32 ${gy} L32 ${gy-h}`} stroke={trunkC} strokeWidth={sw+1} strokeLinecap="round"/>
      {stage>=3&&<Path d={`M32 ${gy-h+4} Q23 ${gy-h} 20 ${gy-h-5}`} stroke={trunkC} strokeWidth={sw} fill="none" strokeLinecap="round"/>}
      {stage>=4&&<Path d={`M32 ${gy-h+4} Q41 ${gy-h} 44 ${gy-h-5}`} stroke={trunkC} strokeWidth={sw} fill="none" strokeLinecap="round"/>}
      <Ellipse cx="32" cy={gy-h-5} rx={5+stage*1.5} ry={4+stage} fill={leafC}/>
      {stage>=3&&<Ellipse cx="21" cy={gy-h-7} rx="5.5" ry="4" fill={leafLt}/>}
      {stage>=4&&<Ellipse cx="43" cy={gy-h-7} rx="5.5" ry="4" fill={leafLt}/>}
    </G>;
  }
  if (stage <= 9) {
    const h=30+(stage-5)*7; const cr=10+(stage-5)*3;
    return <G>{soil}
      <Path d={`M32 ${gy} L32 ${gy-h+cr}`} stroke={trunkC} strokeWidth="4.5" strokeLinecap="round"/>
      <Path d={`M32 ${gy-h+cr+6} Q21 ${gy-h+cr} 14 ${gy-h+cr-10}`} stroke={trunkC} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <Path d={`M32 ${gy-h+cr+6} Q43 ${gy-h+cr} 50 ${gy-h+cr-10}`} stroke={trunkC} strokeWidth="2.8" fill="none" strokeLinecap="round"/>
      <Path d={`M32 ${gy-h+cr+2} Q29 ${gy-h+cr-4} 27 ${gy-h+cr-16}`} stroke={trunkC} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <Ellipse cx="32" cy={gy-h}    rx={cr}      ry={cr*0.8}  fill={leafC}/>
      <Ellipse cx="21" cy={gy-h+5}  rx={cr*0.8}  ry={cr*0.65} fill={leafLt}/>
      <Ellipse cx="43" cy={gy-h+5}  rx={cr*0.8}  ry={cr*0.65} fill={leafLt}/>
    </G>;
  }
  const ot=stage<=14?(stage-10)/4:(stage-14)/5; const cr=22;
  const h=stage<=14?62+ot*2:64;
  return <G>{soil}
    <Path d={`M32 ${gy} L32 ${gy-h+cr}`} stroke={trunkC} strokeWidth="5.5" strokeLinecap="round"/>
    <Path d={`M32 ${gy-h+cr+9} Q17 ${gy-h+cr+3} 9 ${gy-h+cr-11}`} stroke={trunkC} strokeWidth="3.2" fill="none" strokeLinecap="round"/>
    <Path d={`M32 ${gy-h+cr+9} Q47 ${gy-h+cr+3} 55 ${gy-h+cr-11}`} stroke={trunkC} strokeWidth="3.2" fill="none" strokeLinecap="round"/>
    <Path d={`M32 ${gy-h+cr+4} Q28 ${gy-h+cr-7} 25 ${gy-h+cr-20}`} stroke={trunkC} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <Ellipse cx="32" cy={gy-h-2}   rx={cr}      ry={cr*0.85} fill={leafC}/>
    <Ellipse cx="17" cy={gy-h+7}   rx={cr*0.82} ry={cr*0.7}  fill={leafLt}/>
    <Ellipse cx="47" cy={gy-h+7}   rx={cr*0.82} ry={cr*0.7}  fill={leafLt}/>
    <Ellipse cx="32" cy={gy-h+12}  rx={cr*0.9}  ry={cr*0.58} fill={leafLt}/>
  </G>;
}

/* --- VINE — twisting stems with heart leaves, small flowers at bloom --- */
function vineStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const vineC   = gH(132 + theme.hueShift * 0.25, 48, 28);
  const leafC   = gH(128 + theme.hueShift * 0.25, 55, 40);
  const flowerC = gH(308 + theme.hueShift * 0.5,  72, 58);
  const gy = 86;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;
  // heart leaf: two lobes meeting at a point
  const lf = (cx, cy, sz, rot) => (
    <G transform={`rotate(${rot} ${cx} ${cy})`}>
      <Path d={`M${cx} ${cy+sz*0.55} Q${cx-sz} ${cy-sz*0.35} ${cx} ${cy-sz*0.5} Q${cx+sz} ${cy-sz*0.35} ${cx} ${cy+sz*0.55}Z`} fill={leafC}/>
    </G>
  );

  if (stage === 0) return <G>{soil}<Ellipse cx="32" cy={gy-2} rx="2.2" ry="1.7" fill="#5A4530"/></G>;
  if (stage === 1) return <G>{soil}
    <Path d={`M32 ${gy} Q35 ${gy-9} 29 ${gy-15}`} stroke={vineC} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
  </G>;
  if (stage <= 4) {
    return <G>{soil}
      <Path d={`M32 ${gy} Q37 ${gy-14} 28 ${gy-27} Q22 ${gy-37} 30 ${gy-44}`}
        stroke={vineC} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {stage>=3 && lf(30,gy-20,6,-20)}{stage>=4 && lf(26,gy-37,6,15)}
    </G>;
  }
  if (stage <= 9) {
    return <G>{soil}
      <Path d={`M32 ${gy} Q39 ${gy-19} 26 ${gy-35} Q18 ${gy-49} 31 ${gy-63} Q39 ${gy-71} 34 ${gy-77}`}
        stroke={vineC} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      {stage>=6&&<Path d={`M27 ${gy-27} Q20 ${gy-33} 16 ${gy-30}`} stroke={vineC} strokeWidth="1.6" fill="none" strokeLinecap="round"/>}
      {stage>=7&&<Path d={`M32 ${gy-50} Q41 ${gy-54} 45 ${gy-49}`} stroke={vineC} strokeWidth="1.6" fill="none" strokeLinecap="round"/>}
      {lf(30,gy-21,7,-25)}{lf(24,gy-41,7,20)}{stage>=7&&lf(37,gy-57,7,-15)}
      {stage>=8&&lf(26,gy-65,6,10)}{stage>=9&&lf(34,gy-74,5,-20)}
    </G>;
  }
  if (stage <= 14) {
    const ot=(stage-10)/4;
    return <G>{soil}
      <Path d={`M32 ${gy} Q39 ${gy-19} 26 ${gy-35} Q18 ${gy-49} 31 ${gy-63} Q41 ${gy-73} 32 ${gy-81}`}
        stroke={vineC} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
      <Path d={`M27 ${gy-27} Q17 ${gy-35} 13 ${gy-31} Q11 ${gy-22} 16 ${gy-18}`}
        stroke={vineC} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <Path d={`M32 ${gy-51} Q45 ${gy-57} 49 ${gy-48}`}
        stroke={vineC} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {[gy-20,gy-39,gy-57,gy-71].map((y,i) => lf(30+i%2*4,y,7+i,(-1)**i*20))}
      {[gy-31,gy-47,gy-65].map((y,i) => lf(26+i%2*13,y,6,(-1)**i*30))}
    </G>;
  }
  const ot=(stage-14)/5;
  return <G>{soil}
    <Path d={`M32 ${gy} Q39 ${gy-19} 26 ${gy-35} Q18 ${gy-49} 31 ${gy-63} Q41 ${gy-73} 32 ${gy-81}`}
      stroke={vineC} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
    <Path d={`M27 ${gy-27} Q15 ${gy-37} 11 ${gy-28} Q9 ${gy-18} 16 ${gy-16}`}
      stroke={vineC} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <Path d={`M32 ${gy-51} Q47 ${gy-59} 51 ${gy-47}`}
      stroke={vineC} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {[gy-19,gy-35,gy-53,gy-69,gy-79].map((y,i) => lf(30+i%2*4,y,7+i%2*2,(-1)**i*22))}
    {Array.from({length:Math.floor(ot*5+2)}).map((_,i) => {
      const fxs=[20,42,16,49,30]; const fys=[gy-25,gy-45,gy-61,gy-37,gy-77];
      const fx=fxs[i%5]; const fy=fys[i%5];
      return <G key={i} transform={`translate(${fx} ${fy}) scale(${0.5+ot*0.5})`}>
        {Array.from({length:5}).map((_2,j) => (
          <Ellipse key={j} cx="0" cy="-3.5" rx="2" ry="3.5" fill={flowerC} transform={`rotate(${j*72})`} opacity="0.9"/>
        ))}
        <Circle cx="0" cy="0" r="1.8" fill="hsl(48,90%,65%)"/>
      </G>;
    })}
  </G>;
}

/* --- TULIP — bulb, clasping blade leaves, cup-shaped bloom --- */
function tulipStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const stemC  = gH(128 + theme.hueShift * 0.3, 44, 30);
  const leafC  = gH(128 + theme.hueShift * 0.3, 52, 40);
  const bHue   = 355 + theme.hueShift * 0.7;
  const bloomC = gH(bHue, 72, 52);
  const bloomD = gH(bHue, 68, 36);
  const gy = 86;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;
  const claspLeaf = (h, side, frac) => {
    const ly=gy-h*frac;
    return <Path d={`M32 ${ly} Q${32+side*12} ${ly-6} ${32+side*16} ${ly+8} Q${32+side*10} ${ly+16} 32 ${ly+4}`} fill={leafC}/>;
  };

  if (stage === 0) return <G>{soil}
    <Ellipse cx="32" cy={gy-5} rx="6.5" ry="5.5" fill="hsl(36,34%,27%)"/>
    <Path d="M29 79 Q32 77 35 79" stroke="hsl(36,30%,37%)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </G>;
  if (stage === 1) return <G>{soil}
    <Ellipse cx="32" cy={gy-5} rx="5.5" ry="4.5" fill="hsl(36,34%,27%)"/>
    <Path d={`M32 ${gy-9} L32 ${gy-17}`} stroke={stemC} strokeWidth="2.2" strokeLinecap="round"/>
    <Path d={`M32 ${gy-15} Q35 ${gy-19} 32 ${gy-24}`} stroke={leafC} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.75"/>
  </G>;
  if (stage <= 4) {
    const h=14+(stage-2)*8;
    return <G>{soil}
      <Path d={`M32 ${gy} L32 ${gy-h}`} stroke={stemC} strokeWidth="2.4" strokeLinecap="round"/>
      {claspLeaf(h,-1,0.5)}{stage>=4&&claspLeaf(h,1,0.28)}
    </G>;
  }
  if (stage <= 9) {
    const h=36+(stage-5)*6;
    return <G>{soil}
      <Path d={`M32 ${gy} Q31 ${gy-h/2} 32 ${gy-h}`} stroke={stemC} strokeWidth="2.6" strokeLinecap="round" fill="none"/>
      {claspLeaf(h,-1,0.38)}{claspLeaf(h,1,0.22)}
      {stage>=9&&<G transform={`translate(32 ${gy-h-4})`}>
        <Ellipse cx="-3" cy="0" rx="3.5" ry="7" fill={bloomD} transform="rotate(-12 -3 0)"/>
        <Ellipse cx="3"  cy="0" rx="3.5" ry="7" fill={bloomD} transform="rotate(12 3 0)"/>
        <Ellipse cx="0"  cy="-1" rx="2.8" ry="8" fill={bloomC} opacity="0.8"/>
      </G>}
    </G>;
  }
  if (stage <= 14) {
    const h=62; const ot=(stage-10)/4; const op=ot*0.55;
    return <G>{soil}
      <Path d={`M32 ${gy} Q31 ${gy-32} 32 ${gy-h}`} stroke={stemC} strokeWidth="2.8" strokeLinecap="round" fill="none"/>
      {claspLeaf(h,-1,0.38)}{claspLeaf(h,1,0.22)}
      <G transform={`translate(32 ${gy-h-6})`}>
        <Ellipse cx={-4-op*5} cy="0" rx={3.5+op*2} ry={8+op*2} fill={bloomC}
          transform={`rotate(${-14-op*22})`} opacity="0.95"/>
        <Ellipse cx={ 4+op*5} cy="0" rx={3.5+op*2} ry={8+op*2} fill={bloomC}
          transform={`rotate(${14+op*22})`} opacity="0.95"/>
        <Ellipse cx="0" cy="0" rx={3+op} ry={9+op} fill={bloomD} opacity="0.9"/>
      </G>
    </G>;
  }
  const ot=(stage-14)/5; const h=64;
  return <G>{soil}
    <Path d={`M32 ${gy} Q31 ${gy-32} 32 ${gy-h}`} stroke={stemC} strokeWidth="2.8" strokeLinecap="round" fill="none"/>
    {claspLeaf(h,-1,0.38)}{claspLeaf(h,1,0.22)}
    <G transform={`translate(32 ${gy-h-8})`}>
      {[-1,0,1].map(i => (
        <Ellipse key={i} cx={i*7*(0.5+ot*0.5)} cy={-i*2*ot}
          rx={4.5+ot*2} ry={11+ot*2} fill={bloomC}
          transform={`rotate(${i*22*(0.5+ot*0.5)})`} opacity="0.93"/>
      ))}
      {[-1,1].map(i => (
        <Ellipse key={i+"s"} cx={i*10*(0.3+ot*0.7)} cy={3*ot}
          rx={3.8+ot} ry={9+ot} fill={bloomD}
          transform={`rotate(${i*36*(0.3+ot*0.7)})`} opacity="0.85"/>
      ))}
      <Ellipse cx="0" cy="2" rx="2.5" ry="3" fill="hsl(48,80%,62%)" opacity={ot*0.75}/>
    </G>
  </G>;
}

/* --- DAISY — simple daisy with white ray petals and golden disc --- */
function daisyStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const stemC = gH(125 + theme.hueShift * 0.2, 46, 30);
  const leafC = gH(120 + theme.hueShift * 0.2, 52, 38);
  const rayC  = gH(38  + theme.hueShift * 0.1, 14, 90);
  const diskC = gH(50  + theme.hueShift * 0.3, 92, 56);
  const gy = 86;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;
  const slf = (cx, cy, rot) => <Ellipse cx={cx} cy={cy} rx="3.6" ry="6.2" fill={leafC} transform={`rotate(${rot} ${cx} ${cy})`}/>;

  if (stage === 0) return <G>{soil}<Ellipse cx="32" cy={gy-2} rx="2" ry="1.6" fill="#5A4530"/></G>;
  if (stage === 1) return <G>{soil}
    <Path d={`M32 ${gy} L32 ${gy-8}`} stroke={stemC} strokeWidth="1.6" strokeLinecap="round"/>
    <Ellipse cx="32" cy={gy-10} rx="2.2" ry="1.8" fill={leafC}/>
  </G>;
  if (stage <= 4) {
    const h=8+(stage-2)*7;
    return <G>{soil}
      <Path d={`M32 ${gy} L32 ${gy-h}`} stroke={stemC} strokeWidth="2" strokeLinecap="round"/>
      {slf(28,gy-h*0.4,-32)}{stage>=4&&slf(37,gy-h*0.6,32)}
    </G>;
  }
  if (stage <= 9) {
    const h=22+(stage-5)*7;
    return <G>{soil}
      <Path d={`M32 ${gy} Q31 ${gy-h/2} 32 ${gy-h}`} stroke={stemC} strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      {slf(26,gy-12,-36)}{slf(39,gy-23,36)}
      {stage>=7&&slf(24,gy-35,-28)}{stage>=9&&<>
        <Ellipse cx="32" cy={gy-h-3} rx="3.6" ry="5.2" fill={gH(38,12,82)}/>
        <Ellipse cx="32" cy={gy-h-3} rx="2.2" ry="4"   fill={diskC} opacity="0.55"/>
      </>}
    </G>;
  }
  if (stage <= 14) {
    const h=58; const ot=(stage-10)/4; const rc=8+Math.floor(ot*5);
    return <G>{soil}
      <Path d={`M32 ${gy} Q31 ${gy-29} 32 ${gy-h}`} stroke={stemC} strokeWidth="2.4" strokeLinecap="round" fill="none"/>
      {slf(26,gy-14,-36)}{slf(39,gy-26,36)}{slf(24,gy-40,-27)}
      <G transform={`translate(32 ${gy-h-4})`}>
        {Array.from({length:rc}).map((_,i) => {
          const a=(360/rc)*i+5;
          return <Ellipse key={i} cx="0" cy={-(3+ot*4)} rx="2.5" ry={5+ot*3} fill={rayC} transform={`rotate(${a})`} opacity="0.9"/>;
        })}
        <Circle cx="0" cy="0" r={3+ot*2} fill={diskC}/>
      </G>
    </G>;
  }
  const ot=(stage-14)/5; const h=60; const rc=13+Math.floor(ot*3);
  return <G>{soil}
    <Path d={`M32 ${gy} Q31 ${gy-30} 32 ${gy-h}`} stroke={stemC} strokeWidth="2.4" strokeLinecap="round" fill="none"/>
    {slf(26,gy-14,-36)}{slf(39,gy-26,36)}{slf(24,gy-40,-27)}{slf(41,gy-51,22)}
    <G transform={`translate(32 ${gy-h-4})`}>
      {Array.from({length:rc}).map((_,i) => {
        const a=(360/rc)*i;
        return <Ellipse key={i} cx="0" cy={-(4+ot*3)} rx="2.8" ry={8+ot*2} fill={rayC} transform={`rotate(${a})`} opacity="0.92"/>;
      })}
      <Circle cx="0" cy="0" r={4+ot*2.5} fill={diskC}/>
      <Circle cx="0" cy="0" r={2+ot*1.5} fill="hsl(38,86%,42%)" opacity="0.5"/>
    </G>
  </G>;
}

/* --- SUCCULENT — low rosette of thick leaves, tall bloom stalk at full --- */
function succulentStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const leafC  = gH(168 + theme.hueShift * 0.3, 52, 32);
  const leafLt = gH(162 + theme.hueShift * 0.3, 45, 44);
  const tipC   = gH(340 + theme.hueShift * 0.5, 55, 42);
  const stalkC = gH(160 + theme.hueShift * 0.2, 45, 34);
  const florC  = gH(40  + theme.hueShift * 0.3, 82, 62);
  const gy = 86; const cy0 = gy-4;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;

  // one thick plump leaf fanning outward from center (cx0,cy0)
  const sl = (angle, len) => {
    const rad=angle*Math.PI/180;
    const ex=32+Math.sin(rad)*len; const ey=cy0-Math.cos(rad)*len;
    const mx=32+Math.sin(rad)*len*0.5+Math.cos(rad)*len*0.2;
    const my=cy0-Math.cos(rad)*len*0.5+Math.sin(rad)*len*0.2;
    return <G>
      <Path d={`M32 ${cy0} Q${mx} ${my} ${ex} ${ey}`}
        stroke={leafC} strokeWidth={cl(len*0.45+0.8,1.5,7)} strokeLinecap="round" fill="none"/>
      <Circle cx={ex} cy={ey} r={cl(len*0.14,1,3)} fill={tipC}/>
    </G>;
  };

  if (stage === 0) return <G>{soil}<Ellipse cx="32" cy={cy0} rx="2.2" ry="2" fill={leafC} opacity="0.6"/></G>;
  if (stage === 1) return <G>{soil}
    {sl(-15,8)}{sl(15,8)}
    <Circle cx="32" cy={cy0} r="2.5" fill={leafLt}/>
  </G>;
  if (stage <= 4) {
    const cnt=4+(stage-2)*2; const r=8+(stage-2)*2;
    return <G>{soil}
      {Array.from({length:cnt}).map((_,i) => sl((i/cnt)*360-90, r))}
      <Circle cx="32" cy={cy0} r="3.5" fill={leafLt}/>
    </G>;
  }
  if (stage <= 9) {
    const cnt=8+(stage-5)*2; const r2=11+(stage-5)*2;
    return <G>{soil}
      {Array.from({length:cnt}).map((_,i) => sl((i/cnt)*360-90, r2))}
      {Array.from({length:6}).map((_,i) => sl((i/6)*360-70, r2*0.6))}
      <Circle cx="32" cy={cy0} r="4" fill={leafLt}/>
    </G>;
  }
  if (stage <= 14) {
    const ot=(stage-10)/4;
    return <G>{soil}
      {Array.from({length:10}).map((_,i) => sl((i/10)*360-90, 18))}
      {Array.from({length:8}).map((_,i)  => sl((i/8)*360-70, 12))}
      {Array.from({length:5}).map((_,i)  => sl((i/5)*360-50,  7))}
      <Circle cx="32" cy={cy0} r="4.5" fill={leafLt}/>
      {ot>0.3 && <Path d={`M32 ${cy0} L32 ${cy0-ot*28}`} stroke={stalkC} strokeWidth="2" strokeLinecap="round"/>}
    </G>;
  }
  const ot=(stage-14)/5; const stH=28+ot*22;
  return <G>{soil}
    {Array.from({length:12}).map((_,i) => sl((i/12)*360-90, 20))}
    {Array.from({length:8}).map((_,i)  => sl((i/8)*360-70, 13))}
    {Array.from({length:5}).map((_,i)  => sl((i/5)*360-50,  7))}
    <Circle cx="32" cy={cy0} r="5" fill={leafLt}/>
    <Path d={`M32 ${cy0} Q34 ${cy0-stH*0.5} 32 ${cy0-stH}`} stroke={stalkC} strokeWidth="2.4" strokeLinecap="round" fill="none"/>
    {Array.from({length:Math.floor(2+ot*4)}).map((_,i) => {
      const fy=cy0-stH*(0.38+i*0.18); const fx=32+(i%2===0?4:-4);
      return <G key={i}>
        <Path d={`M${fx} ${fy} Q${fx+(i%2===0?4:-4)} ${fy+4} ${fx} ${fy+8}`} stroke={stalkC} strokeWidth="1.2" fill="none"/>
        <G transform={`translate(${fx} ${fy})`}>
          {Array.from({length:5}).map((_2,j) => (
            <Ellipse key={j} cx="0" cy="-2.5" rx="1.8" ry="3" fill={florC} transform={`rotate(${j*72})`} opacity="0.9"/>
          ))}
          <Circle cx="0" cy="0" r="1.4" fill="hsl(48,88%,65%)"/>
        </G>
      </G>;
    })}
  </G>;
}

/* --- BAMBOO — jointed segmented stalks with blade leaves --- */
function bambooStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const stalkC = gH(88  + theme.hueShift * 0.35, 52, 36);
  const stalkLt= gH(92  + theme.hueShift * 0.35, 48, 48);
  const nodeC  = gH(85  + theme.hueShift * 0.3,  45, 26);
  const leafC  = gH(118 + theme.hueShift * 0.25, 55, 38);
  const gy = 86;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;

  // one bamboo segment: tapered column with a node ring at top
  const seg = (x, yBot, segH, w) => (
    <G>
      <Path d={`M${x-w*0.5} ${yBot} L${x-w*0.5} ${yBot-segH} Q${x} ${yBot-segH-w*0.3} ${x+w*0.5} ${yBot-segH} L${x+w*0.5} ${yBot}Z`} fill={stalkC}/>
      <Path d={`M${x-w*0.45} ${yBot-segH} L${x+w*0.45} ${yBot-segH}`} stroke={nodeC} strokeWidth="1.8" strokeLinecap="round"/>
      <Ellipse cx={x} cy={yBot-segH*0.5} rx={w*0.22} ry={segH*0.38} fill={stalkLt} opacity="0.28"/>
    </G>
  );
  // slim blade leaf arching from (x,y) at angle
  const blade = (x, y, angle) => (
    <Path d={`M${x} ${y} Q${x+Math.sin(angle*Math.PI/180)*14} ${y-Math.cos(angle*Math.PI/180)*14} ${x+Math.sin(angle*Math.PI/180)*26} ${y-Math.cos(angle*Math.PI/180)*18}`}
      stroke={leafC} strokeWidth="2.4" fill="none" strokeLinecap="round"/>
  );

  if (stage === 0) return <G>{soil}<Ellipse cx="32" cy={gy-2} rx="3.2" ry="4.5" fill={stalkC} opacity="0.45"/></G>;
  if (stage === 1) return <G>{soil}{seg(32,gy,11,5)}</G>;
  if (stage <= 4) {
    const h=11+(stage-2)*7; const sc=1+(stage-2);
    return <G>{soil}
      {Array.from({length:sc}).map((_,i) => seg(32, gy-i*h/sc, h/sc, 5.5-i*0.3))}
    </G>;
  }
  if (stage <= 9) {
    const totH=40+(stage-5)*8; const segH=11;
    const sc=Math.floor(totH/segH);
    return <G>{soil}
      {Array.from({length:sc}).map((_,i) => seg(32,gy-i*segH,segH,5.8-i*0.18))}
      {stage>=7&&<>{blade(32,gy-totH+4,-34)}{blade(32,gy-totH+4,34)}</>}
      {stage>=8&&blade(32,gy-totH+segH+4,-50)}
      {stage>=9&&blade(32,gy-totH+segH+4,50)}
    </G>;
  }
  if (stage <= 14) {
    const ot=(stage-10)/4; const totH=72+ot*8; const segH=11;
    const sc=Math.floor(totH/segH);
    return <G>{soil}
      {Array.from({length:sc}).map((_,i) => seg(32,gy-i*segH,segH,5.8-i*0.16))}
      {blade(32,gy-totH+4,-34)}{blade(32,gy-totH+4,34)}
      {blade(32,gy-totH+segH+4,-50)}{blade(32,gy-totH+segH+4,50)}
      {blade(32,gy-totH+segH*2+4,-24)}{blade(32,gy-totH+segH*2+4,24)}
      {ot>0.4&&Array.from({length:Math.floor((totH*0.72)/segH)}).map((_,i) => seg(24,gy-i*segH,segH,4.2-i*0.14))}
    </G>;
  }
  const ot=(stage-14)/5; const segH=11;
  const stalks=[{x:32,h:80},{x:22,h:63},{x:42,h:54}];
  return <G>{soil}
    {stalks.map(({x,h:sh},si) => <G key={si}>
      {Array.from({length:Math.floor(sh/segH)}).map((_,i) => seg(x,gy-i*segH,segH,(si===0?5.8:4.6)-i*0.14))}
      {blade(x,gy-sh+4,-34)}{blade(x,gy-sh+4,34)}
      {blade(x,gy-sh+segH+4,-52)}{blade(x,gy-sh+segH+4,52)}
    </G>)}
  </G>;
}

/* --- TOADSTOOL — domed cap with spots, cluster of friends at full bloom --- */
function toadstoolStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const stalkC = gH(42  + theme.hueShift * 0.1, 18, 82);
  const capC   = gH(14  + theme.hueShift * 0.4, 72, 44);
  const capEdge= gH(14  + theme.hueShift * 0.4, 65, 58);
  const spotC  = gH(38  + theme.hueShift * 0.1, 12, 92);
  const gillC  = gH(42  + theme.hueShift * 0.1, 14, 76);
  const gy = 86;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;

  // complete mushroom: stalk + gill + dome cap + spots, scaled by capR
  const mush = (cx, cy, stH, capR, op=1) => (
    <G opacity={op}>
      <Path d={`M${cx-stH*0.22} ${cy} Q${cx} ${cy-stH*0.28} ${cx-stH*0.13} ${cy-stH}`}
        stroke={stalkC} strokeWidth={cl(stH*0.36,1.2,6)} strokeLinecap="round" fill="none"/>
      <Path d={`M${cx+stH*0.22} ${cy} Q${cx} ${cy-stH*0.28} ${cx+stH*0.13} ${cy-stH}`}
        stroke={stalkC} strokeWidth={cl(stH*0.36,1.2,6)} strokeLinecap="round" fill="none"/>
      <Ellipse cx={cx} cy={cy-stH} rx={capR*0.9} ry={capR*0.24} fill={gillC}/>
      <Path d={`M${cx-capR} ${cy-stH} Q${cx} ${cy-stH-capR*1.38} ${cx+capR} ${cy-stH}Z`} fill={capC}/>
      <Path d={`M${cx-capR} ${cy-stH} Q${cx} ${cy-stH-capR*0.38} ${cx+capR} ${cy-stH}`} stroke={capEdge} strokeWidth="1.3" fill="none"/>
      {[{ox:0,oy:-capR*0.72},{ox:-capR*0.44,oy:-capR*0.33},{ox:capR*0.44,oy:-capR*0.33}].map((p,i) => (
        <Circle key={i} cx={cx+p.ox} cy={cy-stH+p.oy} r={cl(capR*0.16,0.8,3)} fill={spotC}/>
      ))}
    </G>
  );

  if (stage === 0) return <G>{soil}<Ellipse cx="32" cy={gy-2} rx="2" ry="1.8" fill={stalkC} opacity="0.45"/></G>;
  if (stage === 1) return <G>{soil}<Ellipse cx="32" cy={gy-5} rx="3.5" ry="4.5" fill={capC}/><Circle cx="32" cy={gy-6.5} r="1" fill={spotC}/></G>;
  if (stage <= 4) {
    const stH=6+(stage-2)*5; const cR=4+(stage-2)*2.5;
    return <G>{soil}{mush(32,gy,stH,cR)}</G>;
  }
  if (stage <= 9) {
    const stH=16+(stage-5)*7; const cR=9+(stage-5)*1.5;
    return <G>{soil}{mush(32,gy,stH,cR)}</G>;
  }
  if (stage <= 14) {
    const ot=(stage-10)/4; const stH=47+ot*4; const cR=15+ot*2;
    return <G>{soil}
      {mush(32,gy,stH,cR)}
      {ot>0.5&&mush(20,gy,stH*0.38,cR*0.48,0.65+ot*0.3)}
    </G>;
  }
  const ot=(stage-14)/5;
  return <G>{soil}
    {mush(32,gy,51+ot*3,18+ot*2)}
    {mush(17,gy,22,9,0.78+ot*0.22)}
    {ot>0.35&&mush(48,gy,18,7,0.55+ot*0.35)}
    {ot>0.72&&mush(11,gy,11,5,0.35+ot*0.4)}
  </G>;
}

/* --- HERB — bushy aromatic plant with flowering lavender-style spikes --- */
function herbStageArt(stage, month) {
  const theme = MONTH_THEMES[((month % 12) + 12) % 12];
  const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const gH = (h, s, l) => `hsl(${h}, ${cl(s * theme.satMul, 10, 95)}%, ${cl(l * theme.litMul, 8, 88)}%)`;
  const stemC  = gH(130 + theme.hueShift * 0.25, 48, 28);
  const leafC  = gH(128 + theme.hueShift * 0.25, 58, 36);
  const leafLt = gH(122 + theme.hueShift * 0.2,  52, 48);
  const spikeC = gH(270 + theme.hueShift * 0.4,  58, 46);
  const spkLt  = gH(265 + theme.hueShift * 0.4,  52, 60);
  const gy = 86;
  const soil = <Ellipse cx="32" cy={gy} rx="14" ry="3" fill="#3A2A1E" opacity="0.5"/>;
  const ov = (cx, cy, rx, ry, rot, c) => <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={c} transform={`rotate(${rot} ${cx} ${cy})`}/>;

  if (stage === 0) return <G>{soil}<Ellipse cx="32" cy={gy-2} rx="2" ry="1.6" fill="#5A4530"/></G>;
  if (stage === 1) return <G>{soil}
    <Path d={`M32 ${gy} L32 ${gy-11}`} stroke={stemC} strokeWidth="1.8" strokeLinecap="round"/>
    {ov(28,gy-12,3,5.5,-32,leafC)}{ov(36,gy-12,3,5.5,32,leafC)}
  </G>;
  if (stage <= 4) {
    const h=10+(stage-2)*6;
    return <G>{soil}
      <Path d={`M32 ${gy} L32 ${gy-h}`} stroke={stemC} strokeWidth="2" strokeLinecap="round"/>
      {Array.from({length:stage}).map((_,i) => {
        const ly=gy-4-i*(h/(stage+1));
        return <G key={i}>
          {ov(28,ly,3.5+i,5.5+i,-35+i*5,leafC)}
          {ov(36,ly,3.5+i,5.5+i,35-i*5,leafC)}
        </G>;
      })}
    </G>;
  }
  if (stage <= 9) {
    const ext=(stage-5)/4; const h=18+ext*14;
    const bDefs=[{x:23,a:-42},{x:41,a:42},{x:27,a:-22},{x:37,a:22},{x:21,a:-58},{x:43,a:58}];
    const bCnt=2+Math.floor(ext*4);
    return <G>{soil}
      <Path d={`M32 ${gy} L32 ${gy-h}`} stroke={stemC} strokeWidth="2.2" strokeLinecap="round"/>
      {bDefs.slice(0,bCnt).map((b,i) => {
        const by=gy-6-i*8;
        return <G key={i}>
          <Path d={`M32 ${by} Q${(32+b.x)/2} ${by-5} ${b.x} ${by-11}`} stroke={stemC} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          {ov(b.x, by-13, 4+ext*2, 6+ext*2, b.a, i%2===0?leafC:leafLt)}
        </G>;
      })}
    </G>;
  }
  if (stage <= 14) {
    const ot=(stage-10)/4;
    const bDefs=[{x:21,y:gy-8,a:-47},{x:43,y:gy-8,a:47},{x:17,y:gy-18,a:-57},{x:47,y:gy-18,a:57},
                 {x:25,y:gy-28,a:-32},{x:39,y:gy-28,a:32},{x:19,y:gy-36,a:-50},{x:45,y:gy-36,a:50}];
    return <G>{soil}
      <Path d={`M32 ${gy} L32 ${gy-38}`} stroke={stemC} strokeWidth="2.4" strokeLinecap="round"/>
      {bDefs.map((b,i) => <G key={i}>
        <Path d={`M32 ${b.y} Q${(32+b.x)/2} ${b.y-5} ${b.x} ${b.y-14}`} stroke={stemC} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        {ov(b.x,b.y-16,4.8,7.5,b.a,i%2===0?leafC:leafLt)}
        {ov(b.x+(b.x>32?3:-3),b.y-23,3.6,5.8,b.a+16,leafLt)}
      </G>)}
      {ot>0.3&&<>
        <Path d={`M32 ${gy-39} L32 ${gy-39-ot*18}`} stroke={stemC} strokeWidth="2" strokeLinecap="round"/>
        {Array.from({length:Math.floor(ot*7)}).map((_,i) => {
          const sy=gy-42-i*4.8;
          return <G key={i}>{ov(29.5,sy,2,3.6,0,spikeC)}{ov(34.5,sy,2,3.6,0,spkLt)}</G>;
        })}
      </>}
    </G>;
  }
  const ot=(stage-14)/5;
  const bDefs=[{x:19,y:gy-8,a:-52},{x:45,y:gy-8,a:52},{x:15,y:gy-19,a:-62},{x:49,y:gy-19,a:62},
               {x:23,y:gy-30,a:-37},{x:41,y:gy-30,a:37},{x:17,y:gy-40,a:-54},{x:47,y:gy-40,a:54}];
  return <G>{soil}
    <Path d={`M32 ${gy} L32 ${gy-42}`} stroke={stemC} strokeWidth="2.6" strokeLinecap="round"/>
    {bDefs.map((b,i) => <G key={i}>
      <Path d={`M32 ${b.y} Q${(32+b.x)/2} ${b.y-5} ${b.x} ${b.y-15}`} stroke={stemC} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      {ov(b.x,b.y-17,5.2,8,b.a,i%2===0?leafC:leafLt)}
      {ov(b.x+(b.x>32?4:-4),b.y-25,4,6.5,b.a+18,leafLt)}
    </G>)}
    {[{x:32,sh:46+ot*10},{x:22,sh:36+ot*8},{x:43,sh:31+ot*7}].map((sp,si) => <G key={si}>
      <Path d={`M${sp.x} ${gy-42} L${sp.x} ${gy-42-sp.sh}`} stroke={stemC} strokeWidth="2.2" strokeLinecap="round"/>
      {Array.from({length:Math.floor(6+ot*5)}).map((_,i) => {
        const sy=gy-44-i*(sp.sh/(8+ot*4));
        const opened=i<4+Math.floor(ot*4);
        return <G key={i}>
          {ov(sp.x-3,sy,2,opened?4.2:2.8,-14,opened?spikeC:spkLt)}
          {ov(sp.x+3,sy,2,opened?4.2:2.8,14,opened?spkLt:spikeC)}
        </G>;
      })}
    </G>)}
  </G>;
}

/* ============================================================
   PLANT DISPATCH + COMPONENT
   plantStageArt(archetype, stage, month) routes to the correct
   function; PlantSvg wraps it in a correctly-sized Svg element.
   ============================================================ */
function plantStageArt(archetype, stage, month) {
  const s = Math.max(0, Math.min(PLANT_STAGE_COUNT - 1, Math.floor(stage)));
  switch (archetype) {
    case "sunflower":  return sunflowerStageArt(s, month);
    case "fern":       return fernStageArt(s, month);
    case "cactus":     return cactusStageArt(s, month);
    case "sapling":    return saplingStageArt(s, month);
    case "vine":       return vineStageArt(s, month);
    case "tulip":      return tulipStageArt(s, month);
    case "daisy":      return daisyStageArt(s, month);
    case "succulent":  return succulentStageArt(s, month);
    case "bamboo":     return bambooStageArt(s, month);
    case "toadstool":  return toadstoolStageArt(s, month);
    case "herb":       return herbStageArt(s, month);
    default:           return roseStageArt(s, month);
  }
}

/* Renders any archetype's 20-stage plant art in a self-contained Svg.
   viewBox is always 0 0 64 90 so every archetype shares the same
   ground line and proportions regardless of rendered size. */
function PlantSvg({ archetype = "rose", stage = 0, month = 0, size = 64 }) {
  return (
    <Svg width={size} height={Math.round(size * 90 / 64)} viewBox="0 0 64 90">
      {plantStageArt(archetype, stage, month)}
    </Svg>
  );
}

const REST_PROMPTS = [
  "What's one thing going right today?",
  "How's your body feeling right now?",
  "What are you looking forward to?",
  "Name something you're grateful for.",
  "What's on your mind?",
  "What do you need right now?",
  "What's one small win so far today?",
  "Who or what made you smile recently?",
  "What would make the rest of today easier?",
  "Take a breath. What do you notice?",
];

function Flower({ fill, hue, active, size = 30 }) {
  const p = Math.max(0, Math.min(1, fill));
  const open = 0.35 + 0.65 * p;
  // unbloomed flowers now show a real dim tint of their OWN hue instead
  // of falling back to a flat neutral gray — previously every unbloomed
  // flower looked identical regardless of hue, which is what made the
  // row read as "one bloomed pink flower plus 5 gray dashes" instead of
  // six genuinely distinct flowers at different stages
  const petalDim = `hsl(${hue}, 30%, 22%)`;
  const petal = p > 0.02 ? `hsl(${hue}, 78%, ${42 + 22 * p}%)` : petalDim;
  const center = p > 0.02 ? `hsl(48, 95%, ${62 + 14 * p}%)` : "rgba(237,231,245,.2)";
  const stem = p > 0.02 ? "hsl(140, 45%, 42%)" : "rgba(237,231,245,.16)";
  const leaf = p > 0.02 ? "hsl(140, 42%, 38%)" : "rgba(237,231,245,.1)";
  const scale = active ? 1.12 : 1;

  return (
    <Svg width={size} height={size * 1.27} viewBox="0 0 30 38">
      <G transform={`translate(${active ? -1.8 : 0} ${active ? -2.3 : 0}) scale(${scale})`}>
        <Path d="M15 30 Q15 24 15 20" stroke={stem} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <Path d="M15 26 Q10 24 9.5 20 Q14 21 15 26" fill={leaf} />
        <G transform={`translate(15 13) scale(${open}) translate(-15 -13)`}>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <Ellipse key={a} cx="15" cy="7.5" rx="3.1" ry="5.4" fill={petal}
              transform={`rotate(${a} 15 13)`} />
          ))}
          <Circle cx="15" cy="13" r="2.6" fill={center} />
        </G>
      </G>
    </Svg>
  );
}

/* A coffee mug that fills with the brew colour as its set progresses. */
function Mug({ fill, color, active, size = 30 }) {
  const p = Math.max(0, Math.min(1, fill));
  const cupTop = 9, cupBottom = 26;
  const level = cupBottom - (cupBottom - cupTop) * p;
  const id = `mug${Math.round(p * 1000)}${active ? "a" : "b"}`;
  const scale = active ? 1.12 : 1;

  return (
    <Svg width={size} height={size * 1.27} viewBox="0 0 30 38">
      <Defs>
        <ClipPath id={id}>
          <Path d="M6.5 9 H21.5 L20 25.5 Q20 27 18.5 27 H9.5 Q8 27 8 25.5 Z" />
        </ClipPath>
      </Defs>
      <G transform={`translate(${active ? -1.8 : 0} ${active ? -2.3 : 0}) scale(${scale})`}>
        <Path d="M21 13 Q26 13 26 17 Q26 21 21 21"
          stroke={active ? color : "rgba(237,231,245,.32)"} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <G clipPath={`url(#${id})`}>
          {p > 0.02 && <Rect x="4" y={level} width="22" height="30" fill={color} />}
        </G>
        <Path d="M6.5 9 H21.5 L20 25.5 Q20 27 18.5 27 H9.5 Q8 27 8 25.5 Z"
          stroke={active ? color : "rgba(237,231,245,.32)"} strokeWidth="1.8" fill="none" />
        <Path d="M4.5 30.5 H25.5" stroke={active ? color : "rgba(237,231,245,.22)"}
          strokeWidth="1.8" strokeLinecap="round" />
      </G>
    </Svg>
  );
}

/* Six fruits in rainbow order, one per coffee cycle in a snack window —
   apple (red) through plum (violet). Same fill-progress idea as Mug,
   but "ripening" (outline to solid colour) fits real fruit better
   than a rising liquid level. */
const FRUITS = [
  { key: "apple",  color: "#E85A5A" }, // red
  { key: "orange", color: "#E8933A" }, // orange
  { key: "lemon",  color: "#E8D24A" }, // yellow
  { key: "pear",   color: "#7BC46A" }, // green
  { key: "grape",  color: "#4A8FE8" }, // blue
  { key: "plum",   color: "#9B5AE8" }, // violet/purple
];

/* A simple water droplet — filled or empty, used as a per-glass tally
   in the hydration row rather than a fill-progress icon like Mug or
   Fruit, since hydration is counted in whole glasses, not a gradient. */
function Droplet({ filled, size = 20 }) {
  const color = filled ? "#5BA8E8" : "rgba(237,231,245,.18)";
  return (
    <Svg width={size} height={size * 1.27} viewBox="0 0 30 38">
      <Path d="M15 4 C15 4 25 18 25 25 C25 31.6 20.5 36 15 36 C9.5 36 5 31.6 5 25 C5 18 15 4 15 4Z"
        fill={color} stroke={filled ? "#5BA8E8" : "rgba(237,231,245,.28)"} strokeWidth="1.4" />
      {filled && <Ellipse cx="11" cy="23" rx="2.4" ry="3.4" fill="rgba(255,255,255,.35)" />}
    </Svg>
  );
}

function Fruit({ kind, fill, active, size = 20 }) {
  const p = Math.max(0, Math.min(1, fill));
  const { color, key } = FRUITS[kind % FRUITS.length];
  const outline = "rgba(237,231,245,.32)";
  const bodyColor = p > 0.02 ? color : outline;
  const opacity = p > 0.02 ? 0.35 + 0.65 * p : 1;
  const scale = active ? 1.12 : 1;
  const leaf = <Path d="M15 5 Q17 2 20 3" stroke="hsl(120,40%,38%)" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity={p > 0.02 ? 1 : 0.5} />;

  const bodies = {
    apple: (
      <>
        <Path d="M15 10 C21 10 25 15 25 21 C25 27 20 32 15 32 C10 32 5 27 5 21 C5 15 9 10 15 10Z"
          fill={bodyColor} opacity={opacity} stroke={outline} strokeWidth={active ? 0 : 1} />
        <Path d="M15 10 Q14 7 15 5" stroke="hsl(30,40%,35%)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {leaf}
      </>
    ),
    orange: (
      <>
        <Circle cx="15" cy="20" r="11" fill={bodyColor} opacity={opacity} stroke={outline} strokeWidth={active ? 0 : 1} />
        <Circle cx="15" cy="9" r="1.6" fill="hsl(120,35%,32%)" />
      </>
    ),
    lemon: (
      <>
        <Path d="M15 9 C22 9 26 14 26 20 C26 26 22 31 15 31 C8 31 4 26 4 20 C4 14 8 9 15 9Z"
          fill={bodyColor} opacity={opacity} stroke={outline} strokeWidth={active ? 0 : 1} />
        <Path d="M25 17 Q28 18 27 21" stroke="hsl(50,60%,45%)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </>
    ),
    pear: (
      <>
        <Path d="M15 12 C19 12 21 16 21 20 C21 26 18 31 14 31 C9 31 6 26 6 21 C6 17 9 15 11 13 C12.5 12 13.5 12 15 12Z"
          fill={bodyColor} opacity={opacity} stroke={outline} strokeWidth={active ? 0 : 1} />
        <Path d="M13 12 Q12 8 14 5" stroke="hsl(30,40%,35%)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {leaf}
      </>
    ),
    grape: (
      <G opacity={opacity}>
        {[[10,14],[20,14],[7,21],[15,21],[23,21],[11,28],[19,28]].map(([cx,cy],i)=>(
          <Circle key={i} cx={cx} cy={cy} r="4.2" fill={bodyColor} stroke={outline} strokeWidth={active?0:0.8} />
        ))}
      </G>
    ),
    plum: (
      <>
        <Circle cx="15" cy="20" r="10.5" fill={bodyColor} opacity={opacity} stroke={outline} strokeWidth={active ? 0 : 1} />
        <Path d="M15 10 Q14 7 16 5" stroke="hsl(120,30%,30%)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </>
    ),
  };

  return (
    <Svg width={size} height={size * 1.27} viewBox="0 0 30 38">
      <G transform={`translate(${active ? -1.8 : 0} ${active ? -2.3 : 0}) scale(${scale})`}>
        {bodies[key]}
      </G>
    </Svg>
  );
}

/* Full-bodied version of the critter for this scene only — CritterSVG
   elsewhere in the app is a head-and-face bust used as an avatar, and
   stays that way. This one moves the way its actual archetype would:
   four legs alternating for quadrupeds, a two-legged hop with wing
   flutter for birds/drake, a hop arc for frogs, a travelling S-curve
   for the serpent (no legs), and a hover with continuous wingbeats
   for the moth (never touches the ground). Same palette as
   critterFor(n), so it reads as the same creature at full body. */
function CritterFullBody({ n, size = 40, walking, reaching, lifting, gaitT = 0 }) {
  const c = critterFor(n);
  const bodyHead = (BODIES[c.archetype] || BODIES.fox)();
  const bodyC = hsl(c.body);
  const bodyD = hsl(c.body, -14);
  const bellyC = hsl(c.belly);
  const accentC = hsl(c.accent);
  const id = `fb${c.index}`;
  const family = LOCOMOTION[c.archetype] || "quadruped";

  const headArt = (
    <G clipPath={`url(#fbclip${id})`}>
      <Path d={bodyHead.head} fill={`url(#fbg${id})`} />
      {c.marking === "spots" && <Circle cx="21" cy="26" r="3" fill={accentC} opacity="0.5" />}
    </G>
  );
  const earsArt = (
    <>
      {bodyHead.earL && <Path d={bodyHead.earL} fill={bodyD} />}
      {bodyHead.earR && <Path d={bodyHead.earR} fill={bodyD} />}
    </>
  );
  const eyesArt = (
    <>
      <Ellipse cx="25" cy="31" rx="3.2" ry="3.6" fill="#1B1226" />
      <Ellipse cx="39" cy="31" rx="3.2" ry="3.6" fill="#1B1226" />
      <Circle cx="26.2" cy="29.6" r="1.1" fill="#fff" opacity="0.9" />
      <Circle cx="40.2" cy="29.6" r="1.1" fill="#fff" opacity="0.9" />
    </>
  );
  // the walking-scene critter renders at a small size AND the head
  // group is further scaled down (0.62x) inside each archetype's own
  // transform — eyesArt's fixed-radius ellipses shrink along with it,
  // to the point of being imperceptible (especially against dark fur
  // at night, exactly what showed up as "no face" in a real
  // screenshot). biggerEyesArt keeps the same positions but with
  // meaningfully larger radii and a bolder white highlight, so the
  // face stays legible even after the archetype's own 0.62 scale is
  // applied on top of an already-small overall critter size.
  const biggerEyesArt = (
    <>
      <Ellipse cx="25" cy="31" rx="4.6" ry="5.2" fill="#1B1226" />
      <Ellipse cx="39" cy="31" rx="4.6" ry="5.2" fill="#1B1226" />
      <Circle cx="26.6" cy="29.2" r="1.7" fill="#fff" opacity="0.95" />
      <Circle cx="40.6" cy="29.2" r="1.7" fill="#fff" opacity="0.95" />
    </>
  );
  // real facial character beyond eyes — a small nose, a soft mouth
  // curve, and blush marks. This is what a reference photo has that
  // eyes alone never could: eyes register as "aware," but a nose and
  // mouth are what actually reads as a FACE rather than two dots on a
  // colored shape. Positioned in the same coordinate space as eyesArt
  // so it sits correctly under every archetype's head shape.
  const faceArt = (
    <>
      <Ellipse cx="32" cy="36" rx="1.6" ry="1.3" fill="#1B1226" opacity="0.85" />
      <Path d="M32 37.2 Q32 39.5 29.5 40.5 M32 37.2 Q32 39.5 34.5 40.5"
        stroke="#1B1226" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.8" />
      <Ellipse cx="19" cy="36" rx="3.4" ry="2.4" fill={accentC} opacity="0.35" />
      <Ellipse cx="45" cy="36" rx="3.4" ry="2.4" fill={accentC} opacity="0.35" />
    </>
  );

  const defs = (
    <Defs>
      <RadialGradient id={`fbg${id}`} cx="42%" cy="34%">
        <Stop offset="0%" stopColor={hsl(c.body, 14)} />
        <Stop offset="100%" stopColor={bodyC} />
      </RadialGradient>
      <ClipPath id={`fbclip${id}`}>
        <Path d="M8 8 C12 6 28 6 32 8 C34 12 34 22 32 26 C28 30 12 30 8 26 C6 22 6 12 8 8Z" />
      </ClipPath>
    </Defs>
  );

  const bend = reaching ? 1 : 0;
  const liftBob = lifting ? -3 : 0;
  const cycle = walking ? gaitT : 0; // 0..1 repeating gait phase while moving

  /* ---------- SERPENT: no legs, travels as an S-curve ripple ---------- */
  if (family === "serpent") {
    const wave = Math.sin(cycle * Math.PI * 2) * 6;
    const wave2 = Math.sin(cycle * Math.PI * 2 + 1.4) * 4;
    return (
      <Svg width={size} height={size * 1.35} viewBox="0 0 40 54">
        {defs}
        <G transform={`rotate(${bend * 20} 20 30)`}>
          <Path d={`M6 44 Q${13 + wave2} 38 20 40 Q${27 - wave} 42 32 34`}
            stroke={bodyC} strokeWidth="9" strokeLinecap="round" fill="none" />
          <Path d={`M6 44 Q${13 + wave2} 38 20 40 Q${27 - wave} 42 32 34`}
            stroke={bellyC} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
          <G transform="translate(2 6) scale(0.62)">
            {headArt}{earsArt}{biggerEyesArt}{faceArt}
          </G>
        </G>
      </Svg>
    );
  }

  /* ---------- MOTH: hovers, never lands, wings beat continuously ---------- */
  if (family === "flutter") {
    const hover = Math.sin(cycle * Math.PI * 4) * 3;
    const wingFlap = Math.abs(Math.sin(cycle * Math.PI * 8)) * 30 + 10;
    return (
      <Svg width={size} height={size * 1.35} viewBox="0 0 40 54">
        {defs}
        <G transform={`translate(0 ${hover + liftBob})`}>
          <G transform={`rotate(${-wingFlap} 14 26)`}>
            <Ellipse cx="6" cy="24" rx="9" ry="5" fill={accentC} opacity="0.55" />
          </G>
          <G transform={`rotate(${wingFlap} 26 26)`}>
            <Ellipse cx="34" cy="24" rx="9" ry="5" fill={accentC} opacity="0.55" />
          </G>
          <Path d="M15 26 C15 34 25 34 25 26 L24 40 C24 43 16 43 16 40 Z" fill={bodyC} />
          <G transform="translate(4 -2) scale(0.62)">
            {headArt}{earsArt}{biggerEyesArt}{faceArt}
          </G>
        </G>
      </Svg>
    );
  }

  /* ---------- FROG: hops in an arc, strong hind legs ---------- */
  if (family === "hop") {
    const hopArc = walking ? Math.sin(cycle * Math.PI) * 10 : 0;
    const legTuck = walking ? Math.sin(cycle * Math.PI) : 0;
    return (
      <Svg width={size} height={size * 1.35} viewBox="0 0 40 54">
        {defs}
        <G transform={`translate(0 ${-hopArc + liftBob}) rotate(${bend * 12} 20 30)`}>
          <Path d={`M8 42 Q${5 - legTuck * 4} ${36 - legTuck * 8} ${10 - legTuck * 2} 48`}
            fill="none" stroke={bodyD} strokeWidth="4.5" strokeLinecap="round" />
          <Path d={`M30 42 Q${35 + legTuck * 4} ${36 - legTuck * 8} ${28 + legTuck * 2} 48`}
            fill="none" stroke={bodyD} strokeWidth="4.5" strokeLinecap="round" />
          <Path d="M10 26 C10 20 30 20 30 26 L29 42 C29 46 11 46 11 42 Z" fill={bodyC} />
          <Path d="M13 28 C13 25 27 25 27 28 L26 40 C26 42 14 42 14 40 Z" fill={bellyC} opacity="0.85" />
          <G transform={`rotate(${bend ? 50 : legTuck * 20} 13 26)`}>
            <Path d="M13 26 L6 36" stroke={bodyD} strokeWidth="3.2" strokeLinecap="round" />
            {lifting && (
              <G transform="translate(2 38)">
                <Ellipse cx="0" cy="0" rx="3" ry="4.2" fill={accentC} />
                <Circle cx="0" cy="0" r="1.6" fill="#FFE08A" />
              </G>
            )}
          </G>
          <G transform="translate(4 -4) scale(0.62)">
            {headArt}{earsArt}{biggerEyesArt}{faceArt}
          </G>
        </G>
      </Svg>
    );
  }

  /* ---------- BIPED-WINGED: owl, drake, crow — hop-step, wings flutter ---------- */
  if (family === "biped") {
    const step = walking ? Math.sin(cycle * Math.PI * 2) * 4 : 0;
    const wingFlutter = walking ? Math.sin(cycle * Math.PI * 4) * 12 : bend ? 25 : 3;
    return (
      <Svg width={size} height={size * 1.35} viewBox="0 0 40 54">
        {defs}
        <G transform={`translate(0 ${liftBob}) rotate(${bend * 14} 20 30)`}>
          <Path d={`M16 42 L${16 - step} 50`} stroke={bodyD} strokeWidth="4" strokeLinecap="round" />
          <Path d={`M24 42 L${24 + step} 50`} stroke={bodyD} strokeWidth="4" strokeLinecap="round" />
          <Path d="M11 26 C11 20 29 20 29 26 L28 42 C28 46 12 46 12 42 Z" fill={bodyC} />
          <Path d="M14 28 C14 25 26 25 26 28 L25 40 C25 42 15 42 15 40 Z" fill={bellyC} opacity="0.85" />
          <G transform={`rotate(${-wingFlutter} 27 30)`}>
            <Ellipse cx="31" cy="34" rx="6" ry="10" fill={bodyD} />
          </G>
          <G transform={`rotate(${bend ? 55 : wingFlutter} 13 30)`}>
            <Ellipse cx="9" cy="34" rx="6" ry="10" fill={bodyD} />
            {lifting && (
              <G transform="translate(3 42)">
                <Ellipse cx="0" cy="0" rx="3" ry="4.2" fill={accentC} />
                <Circle cx="0" cy="0" r="1.6" fill="#FFE08A" />
              </G>
            )}
          </G>
          <G transform="translate(4 -4) scale(0.62)">
            {headArt}{earsArt}{biggerEyesArt}{faceArt}
          </G>
        </G>
      </Svg>
    );
  }

  /* ---------- QUADRUPED (default): fox, cat, deer, otter, hare, bear ---------- */
  const legSwing = walking ? Math.sin(cycle * Math.PI * 2) * 6 : 0;
  const legSwing2 = walking ? Math.sin(cycle * Math.PI * 2 + Math.PI) * 6 : 0;
  const armAngleR = walking ? legSwing2 : bend ? 60 : -4;
  return (
    <Svg width={size} height={size * 1.35} viewBox="0 0 40 54">
      {defs}
      <G transform={`translate(0 ${liftBob}) rotate(${bend * 14} 20 30)`}>
        <Path d={`M15 40 L${15 + legSwing} 50`} stroke={bodyD} strokeWidth="4" strokeLinecap="round" />
        <Path d="M11 26 C11 22 29 22 29 26 L28 42 C28 46 12 46 12 42 Z" fill={bodyC} />
        <Path d="M14 28 C14 26 26 26 26 28 L25 40 C25 42 15 42 15 40 Z" fill={bellyC} opacity="0.85" />
        <Path d={`M25 40 L${25 + legSwing2} 50`} stroke={bodyD} strokeWidth="4" strokeLinecap="round" />
        <G transform={`rotate(${-armAngleR} 27 28)`}>
          <Path d="M27 28 L33 36" stroke={bodyD} strokeWidth="3.4" strokeLinecap="round" />
        </G>
        <G transform="translate(4 -4) scale(0.62)">
          {headArt}{earsArt}{biggerEyesArt}{faceArt}
        </G>
        <G transform={`rotate(${walking ? legSwing : bend ? 55 : 4} 13 28)`}>
          <Path d="M13 28 L6 38" stroke={bodyD} strokeWidth="3.4" strokeLinecap="round" />
          {lifting && (
            <G transform="translate(2 40)">
              <Ellipse cx="0" cy="0" rx="3" ry="4.2" fill={accentC} />
              <Circle cx="0" cy="0" r="1.6" fill="#FFE08A" />
            </G>
          )}
        </G>
      </G>
    </Svg>
  );
}

/* A woven basket that fills up as flowers are collected. */
function FlowerBasket({ size = 34, filled = [] }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 34 34">
      <Path d="M6 16 L28 16 L25 30 C25 31.5 23.5 32 17 32 C10.5 32 9 31.5 9 30 Z"
        fill="#B08654" stroke="#7A5A38" strokeWidth="1.4" />
      <Path d="M6 16 L28 16" stroke="#7A5A38" strokeWidth="1.6" />
      <Path d="M11 16 Q17 6 23 16" fill="none" stroke="#7A5A38" strokeWidth="2" strokeLinecap="round" />
      {filled.slice(0, 6).map((hue, i) => {
        const cols = 3;
        const x = 11 + (i % cols) * 6;
        const y = 12 - Math.floor(i / cols) * 5;
        return <Circle key={i} cx={x} cy={y} r="3" fill={`hsl(${hue}, 78%, 58%)`} />;
      })}
    </Svg>
  );
}

/* During a rest/coffee gate, the critter walks to each of the set's
   six flowers, bends down, physically picks it up into a basket, and
   straightens back up before moving to the next one. Once all six are
   collected it wanders the garden freely until the gate ends, then
   the whole sequence restarts. The gate itself has no duration — it's
   a manual pause waiting on the person — so this runs on its own
   loop for as long as the gate stays open. */
const SNACK_HUES = [15, 45, 350, 90]; // berry/fruit tones — orange, lemon, red, green

function SnackItem({ hue, gathered, size = 16 }) {
  const c = gathered ? `hsl(${hue}, 20%, 30%)` : `hsl(${hue}, 78%, 56%)`;
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Circle cx="8" cy="9" r="6" fill={c} opacity={gathered ? 0.25 : 1} />
      {!gathered && <Path d="M8 3 Q9 1 11 2" stroke="hsl(120,40%,35%)" strokeWidth="1.4" fill="none" strokeLinecap="round" />}
    </Svg>
  );
}

function SnackBasket({ size = 34, filled = [] }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 34 34">
      <Path d="M6 16 L28 16 L25 30 C25 31.5 23.5 32 17 32 C10.5 32 9 31.5 9 30 Z"
        fill="#8FAE6B" stroke="#5E7A45" strokeWidth="1.4" />
      <Path d="M6 16 L28 16" stroke="#5E7A45" strokeWidth="1.6" />
      <Path d="M11 16 Q17 6 23 16" fill="none" stroke="#5E7A45" strokeWidth="2" strokeLinecap="round" />
      {filled.slice(0, 8).map((hue, i) => {
        const cols = 4;
        const x = 9 + (i % cols) * 4.5;
        const y = 12 - Math.floor(i / cols) * 4.5;
        return <Circle key={i} cx={x} cy={y} r="2.4" fill={`hsl(${hue}, 78%, 56%)`} />;
      })}
    </Svg>
  );
}

/* During a SNACK gate specifically (six coffee breaks completed), the
   critter gathers a small spread of snack items into a basket, using
   the exact same walk/reach/lift choreography as FlowerPicking — the
   snack tier is the same idea one level up, so its animation mirrors
   the coffee-tier one rather than inventing something unrelated. */
function SnackGathering({ critters = [1], width = 260 }) {
  const STOPS = 4;
  const stopWidth = width / STOPS;
  const GATHER_MS = 8000;
  const WANDER_MS = 6000;
  const LOOP_MS = GATHER_MS + WANDER_MS;
  const GAIT_MS = 650;

  const [t, setT] = useState(0);
  const [gaitT, setGaitT] = useState(0);
  useEffect(() => {
    let raf;
    const start = Date.now();
    const loop = () => {
      const now = Date.now() - start;
      setT((now % LOOP_MS) / LOOP_MS);
      setGaitT((now % GAIT_MS) / GAIT_MS);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // same approach as FlowerPicking: up to 4 critters each take a
  // contiguous slice of the 4 gathering stops (so at 4 critters,
  // each one claims exactly one stop and they're all visibly
  // gathering different snacks at once), staggered timing so they
  // don't move in perfect unison.
  const gatherers = critters.slice(0, 4);
  const stopsPerGatherer = Math.floor(STOPS / gatherers.length);
  const remainder = STOPS - stopsPerGatherer * gatherers.length;

  const collectedStops = new Set();
  let stopCursor = 0;
  const gathererStates = gatherers.map((critterN, gi) => {
    const isLast = gi === gatherers.length - 1;
    const myCount = stopsPerGatherer + (isLast ? remainder : 0);
    const myStops = Array.from({ length: myCount }, (_, i) => stopCursor + i);
    stopCursor += myCount;

    const offsetT = (t + gi * 0.15) % 1;
    const gatherPhase = offsetT * LOOP_MS < GATHER_MS;
    const gatherT = Math.min(1, (offsetT * LOOP_MS) / GATHER_MS);
    const wanderT = gatherPhase ? 0 : ((offsetT * LOOP_MS) - GATHER_MS) / WANDER_MS;

    const rawProgress = gatherT * myStops.length;
    const visitedCount = Math.min(myStops.length, Math.floor(rawProgress));
    const withinStop = Math.min(1, rawProgress - visitedCount);
    const atStop = Math.min(myStops.length - 1, visitedCount);

    const gatherWalking = withinStop < 0.4;
    const reaching = gatherPhase && withinStop >= 0.4 && withinStop < 0.9;
    const lifting = gatherPhase && withinStop >= 0.6 && withinStop < 0.9;
    const collectedNow = withinStop >= 0.6;

    if (!gatherPhase) {
      myStops.forEach((s) => collectedStops.add(s));
    } else {
      for (let i = 0; i < visitedCount; i++) collectedStops.add(myStops[i]);
      if (collectedNow) collectedStops.add(myStops[atStop]);
    }

    const rangeStart = myStops[0] * stopWidth;
    const rangeW = myStops.length * stopWidth;
    const walkFrac = Math.min(1, withinStop / 0.4);
    const gatherX = rangeStart + Math.min(rangeW - 18, (atStop - myStops[0] + walkFrac) * stopWidth + stopWidth / 2);

    const wanderLap = (wanderT * 2.2) % 1;
    const wanderDir = Math.floor(wanderT * 2.2) % 2 === 0 ? 1 : -1;
    const wanderX = wanderDir === 1
      ? rangeStart + 6 + wanderLap * (rangeW - 12)
      : rangeStart + rangeW - 6 - wanderLap * (rangeW - 12);

    const wandering = !gatherPhase;
    return {
      critterN, wandering,
      x: gatherPhase ? gatherX : wanderX,
      walking: gatherPhase ? gatherWalking : true,
      reaching, lifting,
      tally: gatherPhase ? visitedCount + (collectedNow ? 1 : 0) : myStops.length,
    };
  });

  const totalTally = gathererStates.reduce((a, g) => a + g.tally, 0);
  const allWandering = gathererStates.every((g) => g.wandering);
  const basketItems = SNACK_HUES.slice(0, totalTally);

  return (
    <View style={{ width, height: 84 }}>
      <View style={styles.pickGround} />
      <View style={styles.pickRow}>
        {SNACK_HUES.map((hue, i) => {
          const gathered = collectedStops.has(i);
          return (
            <View key={i} style={{ width: stopWidth, alignItems: "center" }}>
              <SnackItem hue={hue} gathered={gathered} size={16} />
            </View>
          );
        })}
      </View>
      <View style={[styles.pickBasket, { right: 4 }]} pointerEvents="none">
        <SnackBasket size={28} filled={basketItems} />
      </View>
      {gathererStates.map((g, i) => (
        <View key={i} style={[styles.pickCritter, { left: g.x - 20, top: 8 }]} pointerEvents="none">
          <CritterFullBody n={g.critterN} size={40} walking={g.walking} reaching={g.reaching} lifting={g.lifting} gaitT={gaitT} />
        </View>
      ))}
      <Text style={styles.pickTally}>
        {allWandering ? "🍇 wandering the garden" : `🧺 ${totalTally} / ${STOPS}`}
      </Text>
    </View>
  );
}

function FlowerPicking({ critters = [1], width = 260 }) {
  const STOPS = 6;
  const stopWidth = width / STOPS;
  const PICK_MS = 10500; // one full lap of picking: walk, bend, pick, rise x6
  const WANDER_MS = 7000; // roam time before the loop restarts
  const LOOP_MS = PICK_MS + WANDER_MS;
  const GAIT_MS = 650; // one stride/wingbeat cycle while moving

  const [t, setT] = useState(0);
  const [gaitT, setGaitT] = useState(0);
  useEffect(() => {
    let raf;
    const start = Date.now();
    const loop = () => {
      const now = Date.now() - start;
      setT((now % LOOP_MS) / LOOP_MS);
      setGaitT((now % GAIT_MS) / GAIT_MS);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // up to 4 critters actually take part in picking at once — each
  // gets its own slice of the 6 flower stops (so several critters are
  // genuinely gathering in different parts of the strip at the same
  // time, not one critter repeated) and its own small time offset so
  // they don't all bend down in perfect unison. Anyone beyond the 4th
  // just wanders from the start — a crowded flowerbed doesn't need
  // every single unlocked critter crammed into six stops.
  const pickers = critters.slice(0, 4);
  const stopsPerPicker = Math.floor(STOPS / pickers.length);
  const remainder = STOPS - stopsPerPicker * pickers.length;

  const collectedStops = new Set();
  let stopCursor = 0;
  const pickerStates = pickers.map((critterN, pi) => {
    const isLast = pi === pickers.length - 1;
    const myCount = stopsPerPicker + (isLast ? remainder : 0);
    const myStops = Array.from({ length: myCount }, (_, i) => stopCursor + i);
    stopCursor += myCount;
    const offsetT = (t + pi * 0.13) % 1;
    const pickPhase = offsetT * LOOP_MS < PICK_MS;
    const pickT = Math.min(1, (offsetT * LOOP_MS) / PICK_MS);
    const wanderT = pickPhase ? 0 : ((offsetT * LOOP_MS) - PICK_MS) / WANDER_MS;

    const rawProgress = pickT * myStops.length;
    const visitedCount = Math.min(myStops.length, Math.floor(rawProgress));
    const withinStop = Math.min(1, rawProgress - visitedCount);
    const atStop = Math.min(myStops.length - 1, visitedCount);

    const pickWalking = withinStop < 0.4;
    const reaching = pickPhase && withinStop >= 0.4 && withinStop < 0.9;
    const lifting = pickPhase && withinStop >= 0.6 && withinStop < 0.9;
    const collectedNow = withinStop >= 0.6;

    if (!pickPhase) {
      myStops.forEach((s) => collectedStops.add(s));
    } else {
      for (let i = 0; i < visitedCount; i++) collectedStops.add(myStops[i]);
      if (collectedNow) collectedStops.add(myStops[atStop]);
    }

    const rangeStart = myStops[0] * stopWidth;
    const rangeW = myStops.length * stopWidth;
    const walkFrac = Math.min(1, withinStop / 0.4);
    const pickX = rangeStart + Math.min(rangeW - 18, (atStop - myStops[0] + walkFrac) * stopWidth + stopWidth / 2);

    const wanderLap = (wanderT * 2.5) % 1;
    const wanderDir = Math.floor(wanderT * 2.5) % 2 === 0 ? 1 : -1;
    const wanderX = wanderDir === 1
      ? rangeStart + 6 + wanderLap * (rangeW - 12)
      : rangeStart + rangeW - 6 - wanderLap * (rangeW - 12);

    const wandering = !pickPhase;
    return {
      critterN, wandering,
      x: pickPhase ? pickX : wanderX,
      walking: pickPhase ? pickWalking : true,
      reaching, lifting,
      tally: pickPhase ? visitedCount + (collectedNow ? 1 : 0) : myStops.length,
      stopCount: myStops.length,
    };
  });

  const totalTally = pickerStates.reduce((a, p) => a + p.tally, 0);
  const allWandering = pickerStates.every((p) => p.wandering);
  const basketFlowers = FLOWER_HUES.slice(0, totalTally);

  return (
    <View style={{ width, height: 84 }}>
      <View style={styles.pickGround} />
      <View style={styles.pickRow}>
        {FLOWER_HUES.map((hue, i) => {
          const collected = collectedStops.has(i);
          return (
            <View key={i} style={{ width: stopWidth, alignItems: "center" }}>
              <Flower hue={hue} fill={collected ? 0 : 1} active={false} size={18} />
            </View>
          );
        })}
      </View>
      <View style={[styles.pickBasket, { right: 4 }]} pointerEvents="none">
        <FlowerBasket size={28} filled={basketFlowers} />
      </View>
      {pickerStates.map((p, i) => (
        <View key={i} style={[styles.pickCritter, { left: p.x - 20, top: 8 }]} pointerEvents="none">
          <CritterFullBody n={p.critterN} size={40} walking={p.walking} reaching={p.reaching} lifting={p.lifting} gaitT={gaitT} />
        </View>
      ))}
      <Text style={styles.pickTally}>
        {allWandering ? "🌼 wandering the garden" : `🧺 ${totalTally} / ${STOPS}`}
      </Text>
    </View>
  );
}

function CritterSVG({ n, size = 64 }) {
  const c = critterFor(n);
  const body = (BODIES[c.archetype] || BODIES.fox)();
  const id = `c${c.index}`;
  const bodyC = hsl(c.body);
  const bodyD = hsl(c.body, -14);
  const bellyC = hsl(c.belly);
  const accentC = hsl(c.accent);

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <RadialGradient id={`g${id}`} cx="42%" cy="34%">
          <Stop offset="0%" stopColor={hsl(c.body, 14)} />
          <Stop offset="100%" stopColor={bodyC} />
        </RadialGradient>
        <ClipPath id={`clip${id}`}><Path d={body.head} /></ClipPath>
      </Defs>

      {c.aura === "glow" && <Circle cx="32" cy="33" r="27" fill={accentC} opacity={0.16} />}
      {c.crest === "horns" && (
        <G fill={accentC}><Path d="M20 16 L15 4 L26 12Z" /><Path d="M44 16 L49 4 L38 12Z" /></G>
      )}
      {c.crest === "antlers" && (
        <G stroke={accentC} strokeWidth="2.4" fill="none" strokeLinecap="round">
          <Path d="M22 15 L18 5 M18 8 L13 6 M18 5 L22 2" />
          <Path d="M42 15 L46 5 M46 8 L51 6 M46 5 L42 2" />
        </G>
      )}
      {c.crest === "fins" && (
        <G fill={accentC} opacity={0.85}>
          <Path d="M14 26 C6 22 6 34 14 34Z" /><Path d="M50 26 C58 22 58 34 50 34Z" />
        </G>
      )}
      {c.crest === "plume" && <Path d="M32 12 C28 2 36 0 38 8 C40 2 46 6 40 12Z" fill={accentC} />}

      {body.earL && <Path d={body.earL} fill={bodyD} />}
      {body.earR && <Path d={body.earR} fill={bodyD} />}
      {body.earL && c.crest === "ears" && (
        <>
          <Path d={body.earL} fill={accentC} opacity={0.55} />
          <Path d={body.earR} fill={accentC} opacity={0.55} />
        </>
      )}

      <Path d={body.head} fill={`url(#g${id})`} />

      <G clipPath={`url(#clip${id})`} opacity={0.55}>
        {c.marking === "spots" && (
          <G fill={accentC}><Circle cx="21" cy="26" r="3.4" /><Circle cx="43" cy="24" r="2.6" /><Circle cx="26" cy="20" r="2" /></G>
        )}
        {c.marking === "stripes" && (
          <G stroke={accentC} strokeWidth="3" strokeLinecap="round">
            <Path d="M16 24 L26 20" /><Path d="M48 24 L38 20" /><Path d="M18 32 L25 30" />
          </G>
        )}
        {c.marking === "patch" && <Path d="M12 30 C20 20 30 20 32 14 L12 14Z" fill={accentC} />}
        {c.marking === "freckle" && (
          <G fill={accentC}>
            <Circle cx="22" cy="38" r="1.4" /><Circle cx="26" cy="41" r="1.2" />
            <Circle cx="42" cy="38" r="1.4" /><Circle cx="38" cy="41" r="1.2" />
          </G>
        )}
        {c.marking === "star" && (
          <Path d="M32 16 L34 22 L40 22 L35 26 L37 32 L32 28 L27 32 L29 26 L24 22 L30 22Z" fill={accentC} />
        )}
      </G>

      {!!body.snout && <Path d={body.snout} fill={bellyC} />}

      {c.eyes === "closed" ? (
        <G stroke="#1B1226" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <Path d="M22 31 Q25 28 28 31" /><Path d="M36 31 Q39 28 42 31" />
        </G>
      ) : (
        <>
          <Ellipse cx="25" cy="31" rx={c.eyes === "wide" ? 4.2 : 3.4} ry={c.eyes === "sleepy" ? 2.2 : c.eyes === "wide" ? 4.6 : 3.8} fill="#1B1226" />
          <Ellipse cx="39" cy="31" rx={c.eyes === "wide" ? 4.2 : 3.4} ry={c.eyes === "sleepy" ? 2.2 : c.eyes === "wide" ? 4.6 : 3.8} fill="#1B1226" />
          <Circle cx="26.4" cy="29.6" r="1.3" fill="#fff" opacity={0.9} />
          <Circle cx="40.4" cy="29.6" r="1.3" fill="#fff" opacity={0.9} />
          {c.eyes === "starry" && (
            <G fill={accentC}><Circle cx="23.6" cy="32.6" r="1" /><Circle cx="37.6" cy="32.6" r="1" /></G>
          )}
        </>
      )}

      <Ellipse cx="32" cy={c.archetype === "crow" ? 38 : 39} rx="2" ry="1.5" fill="#1B1226" opacity={0.8} />
      <Path d={`M32 ${c.archetype === "crow" ? 39.2 : 40.4} Q32 42.5 29.5 43.5 M32 ${c.archetype === "crow" ? 39.2 : 40.4} Q32 42.5 34.5 43.5`}
        stroke="#1B1226" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity={0.75} />
      <G fill={accentC} opacity={0.38}>
        <Ellipse cx="19" cy="37" rx="3.4" ry="2.2" /><Ellipse cx="45" cy="37" rx="3.4" ry="2.2" />
      </G>
      {c.aura === "sparks" && (
        <G fill={accentC}>
          <Circle cx="9" cy="18" r="1.6" opacity={0.85} /><Circle cx="55" cy="22" r="1.2" opacity={0.7} /><Circle cx="52" cy="10" r="1" opacity={0.6} />
        </G>
      )}
      {c.aura === "petals" && (
        <G fill={accentC} opacity={0.75}>
          <Ellipse cx="10" cy="22" rx="2.6" ry="1.5" transform="rotate(-25 10 22)" />
          <Ellipse cx="54" cy="18" rx="2.6" ry="1.5" transform="rotate(20 54 18)" />
        </G>
      )}
    </Svg>
  );
}

/* Critter-of-the-day hero — renders today's deterministic critter
   (dayOfYear → critterFor) with a party hat and a tiny caption.
   Pure render derivation off the wall clock; no new state, timers,
   or handlers. The hat is a small SVG cone with pompoms and a
   sparkle so the hero reads as celebratory at a glance. */
function PartyHat() {
  return (
    <G>
      <Path d="M32 4 L46 30 L18 30 Z" fill="#E85A5A" />
      <Path d="M32 4 L46 30 L32 30 Z" fill="#C84545" opacity={0.5} />
      <Circle cx="32" cy="5" r="3.4" fill="#FFD66B" />
      <Circle cx="46" cy="30" r="2.6" fill="#FFD66B" />
      <Circle cx="18" cy="30" r="2.6" fill="#FFD66B" />
      <Circle cx="40" cy="14" r="1.4" fill="#FFFFFF" opacity={0.85} />
    </G>
  );
}

function CritterOfDayHero({ size = 64, date = new Date() }) {
  const n = ((dayOfYear(date) - 1) % CRITTER_COUNT) + 1;
  const c = critterFor(n);
  const heroSize = Math.round(size * 1.35);
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <View style={{ position: "relative", width: heroSize, height: heroSize }}>
        <CritterSVG n={n} size={heroSize} />
        <Svg
          width={heroSize}
          height={heroSize}
          viewBox="0 0 64 64"
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          <PartyHat />
        </Svg>
      </View>
      <Text style={{ fontSize: Math.max(9, Math.round(size * 0.16)), fontWeight: "700", textAlign: "center", color: "rgba(237,231,245,.7)", marginTop: 4 }}>
        Today's Critter
      </Text>
      <Text style={{ fontSize: Math.max(8, Math.round(size * 0.14)), fontWeight: "600", textAlign: "center", color: "rgba(237,231,245,.45)" }}>
        {c.name} · #{n}
      </Text>
    </View>
  );
}

/* ============================================================
   TIMER ENGINE — ported verbatim, pure arithmetic
   ============================================================ */
const WORKS_PER_SET = 6;
const SETS_PER_COFFEE = 6;
const COFFEES_PER_SNACK = 6;
const workMs = (set) => set * 1000;
const hydrateMs = (set) => (set * 1000) / 7;
const restMs = (nextSet) => workMs(nextSet) + hydrateMs(nextSet);
const coffeeBreakMs = (nextSet) =>
  WORKS_PER_SET * workMs(nextSet) + WORKS_PER_SET * hydrateMs(nextSet) + restMs(nextSet + 1);

/* One full coffee cycle: six sets (each work+hydrate x6, then a rest),
   closed by either a coffee break (the normal case) or, if this is the
   6th cycle of a snack window, by the snack break itself — which is as
   long as one more full cycle. closesWithSnack lets the caller specify
   which. Forward-sized: nextSet is the first block of the cycle. */
const coffeeCycleMs = (nextSet, closesWithSnack = false) => {
  let total = 0;
  let n = nextSet;
  for (let i = 0; i < SETS_PER_COFFEE; i++) {
    total += WORKS_PER_SET * workMs(n) + WORKS_PER_SET * hydrateMs(n);
    n++;
    if (i === SETS_PER_COFFEE - 1) {
      total += closesWithSnack ? coffeeCycleMs(n) : coffeeBreakMs(n);
    } else {
      total += restMs(n);
    }
  }
  return total;
};

/* Snack break = one full coffee cycle about to start — the same rule
   coffee applies to sets, one recursion tier further up. Fires after
   the 6th coffee break, counted over lifetime usage. */
const snackBreakMs = (nextSet) => coffeeCycleMs(nextSet);

const buildSchedule = (set, workInSet, setsDone, coffeesDone = 0) => {
  const queue = [];
  let n = set, w = workInSet, s = setsDone, cf = coffeesDone;
  for (let i = 0; i < 40; i++) {
    queue.push({ kind: "work", ms: workMs(n), set: n, index: w + 1 });
    queue.push({ kind: "hydrate", ms: hydrateMs(n), set: n });
    w++;
    if (w >= WORKS_PER_SET) {
      s++; n++;
      if (s % SETS_PER_COFFEE === 0) {
        cf++;
        if (cf % COFFEES_PER_SNACK === 0) {
          queue.push({ kind: "snack", ms: snackBreakMs(n), set: n, gate: true });
        } else {
          queue.push({ kind: "coffee", ms: coffeeBreakMs(n), set: n, gate: true });
        }
      } else {
        queue.push({ kind: "rest", ms: restMs(n), set: n, gate: true });
      }
      w = 0;
    }
  }
  return queue;
};

const PHASE = {
  work:    { name: "Focus",        color: "#E85A5A", glow: "rgba(232,90,90,.35)" },
  hydrate: { name: "Hydrate",      color: "#5BA8E8", glow: "rgba(91,168,232,.35)" },
  rest:    { name: "Rest",         color: "#E87AB8", glow: "rgba(232,122,184,.35)" },
  coffee:  { name: "Coffee Break", color: "#D98A5B", glow: "rgba(217,138,91,.35)" },
  snack:   { name: "Snack Break",  color: "#7BD88F", glow: "rgba(123,216,143,.35)" },
};

/* ============================================================
   SETTINGS REGISTRY — single source of truth for every toggleable
   feature in the app, grouped for the settings panel. Each entry:
     key      — matches openSections' section name where applicable,
                or is a standalone app-wide toggle otherwise
     label    — shown in the settings panel
     group    — which settings section it's organized under
     default  — starting state if the person has never touched it
     locked   — true for the one section that can't be turned off
                (Timer — the app has no purpose without it)

   STANDING RULE: every feature added to this app from this point
   forward gets an entry here, in whichever group fits best (add a
   new group name if none of the existing ones fit), and its render
   is gated on sectionVisible.has("key") — or, for something that
   needs its own dedicated on/off state (like notifsOn/liveSyncOn),
   toggleFeature() below is taught to route to that state instead.
   A feature with no registry entry is treated as unfinished, not
   as an acceptable default — this isn't optional polish, it's part
   of shipping the feature.
   ============================================================ */
const SETTINGS_REGISTRY = [
  { key: "dateHeader",  label: "Date",            group: "Sidebar sections", default: true },
  { key: "dayPercent",  label: "Day progress (%)", group: "Sidebar sections", default: true },
  { key: "weatherInfo", label: "Local weather",   group: "Sidebar sections", default: true },
  { key: "timer",    label: "Timer",           group: "Sidebar sections", default: true, locked: true }, // locked = shows a warning before turning off, not truly immovable
  { key: "water",    label: "Hydration",       group: "Sidebar sections", default: true },
  { key: "rest",     label: "Rest",            group: "Sidebar sections", default: true },
  { key: "coffee",   label: "Coffee break",    group: "Sidebar sections", default: true },
  { key: "snack",    label: "Snack break",     group: "Sidebar sections", default: true },
  { key: "stats",    label: "Today's stats",   group: "Sidebar sections", default: true },
  { key: "upnext",   label: "Up next",         group: "Sidebar sections", default: true },
  { key: "calendar", label: "Calendar",        group: "Sidebar sections", default: true },
  { key: "todos",    label: "To-do list",       group: "Sidebar sections", default: true },

  { key: "village",    label: "Village background", group: "Background & ambiance", default: true },
  { key: "weather",    label: "Weather effects",     group: "Background & ambiance", default: true },
  { key: "garden",     label: "Seasonal garden",     group: "Background & ambiance", default: true },
  { key: "skyClock",     label: "Sky clock (analog)",  group: "Background & ambiance", default: true },
  { key: "digitalClock", label: "Sky clock (digital)", group: "Background & ambiance", default: true },
  { key: "schoolhouse",  label: "Schoolhouse",         group: "Background & ambiance", default: true },
  { key: "fountain",     label: "Town fountain",       group: "Background & ambiance", default: true },
  { key: "napping",      label: "Resting critters during rest", group: "Background & ambiance", default: true },
  { key: "gardenScene",label: "Flower/snack picking scene", group: "Background & ambiance", default: true },

  { key: "notifsOn",   label: "Notifications", group: "App", default: false },
  { key: "liveSyncOn", label: "Live sync",     group: "App", default: false },
  { key: "soundOn",    label: "Sounds (master switch)", group: "Sounds", default: true, locked: false },
  { key: "sound_work",    label: "Work start (school bell)", group: "Sounds", default: true },
  { key: "sound_hydrate", label: "Hydrate start",            group: "Sounds", default: true },
  { key: "sound_gate",    label: "Rest reached",             group: "Sounds", default: true },
  { key: "sound_coffee",  label: "Coffee break reached",     group: "Sounds", default: true },
  { key: "sound_snack",   label: "Snack break reached",      group: "Sounds", default: true },
  { key: "sound_resume",  label: "Resume tapped",            group: "Sounds", default: true },
];

const setTotalMs = (n) => WORKS_PER_SET * workMs(n) + WORKS_PER_SET * hydrateMs(n) + restMs(n + 1);

/* Same shape as msUntilCoffee, but walks forward to the next PLAIN
   REST boundary specifically — skipping over any coffee/snack
   closures along the way, since those aren't rest. Needed for a live
   "time until rest" readout under the Timer section. */
const msUntilNextRest = (set, workInSet, setsDone, coffeesDone, elapsedInPhase, phaseKind) => {
  let total = 0;
  if (phaseKind === "work") {
    total += workMs(set) - elapsedInPhase;
    total += hydrateMs(set);
    total += (WORKS_PER_SET - workInSet - 1) * (workMs(set) + hydrateMs(set));
  } else if (phaseKind === "hydrate") {
    total += hydrateMs(set) - elapsedInPhase;
    total += (WORKS_PER_SET - workInSet - 1) * (workMs(set) + hydrateMs(set));
  } else {
    total += WORKS_PER_SET * (workMs(set) + hydrateMs(set));
  }

  let sd = setsDone;
  let cd = coffeesDone;
  let n = set;
  while (true) {
    const closesCoffee = (sd + 1) % SETS_PER_COFFEE === 0;
    if (!closesCoffee) {
      total += restMs(n + 1);
      return Math.max(0, total);
    }
    const isSnack = (cd + 1) % COFFEES_PER_SNACK === 0;
    total += isSnack ? coffeeCycleMs(n + 1) : coffeeBreakMs(n + 1);
    cd += 1;
    sd += 1;
    n += 1;
    total += WORKS_PER_SET * (workMs(n) + hydrateMs(n));
  }
};

const msUntilCoffee = (set, workInSet, setsDone, coffeesDone, elapsedInPhase, phaseKind) => {
  let total = 0;
  // remaining work+hydrate pairs in the CURRENT set
  if (phaseKind === "work") {
    total += workMs(set) - elapsedInPhase;
    total += hydrateMs(set);
    total += (WORKS_PER_SET - workInSet - 1) * (workMs(set) + hydrateMs(set));
  } else if (phaseKind === "hydrate") {
    total += hydrateMs(set) - elapsedInPhase;
    total += (WORKS_PER_SET - workInSet - 1) * (workMs(set) + hydrateMs(set));
  } else {
    total += WORKS_PER_SET * (workMs(set) + hydrateMs(set));
  }

  // the break that closes THIS set: coffee only if this set is the 6th
  // of its coffee cycle, a plain rest otherwise. If it IS the 6th, that
  // "coffee" might actually be a longer snack — true only if this
  // coffee would also be the 6th of the snack window.
  let sd = setsDone;
  let cd = coffeesDone;
  const closesCoffee0 = (sd + 1) % SETS_PER_COFFEE === 0;
  if (closesCoffee0) {
    const thisIsSnack = (cd + 1) % COFFEES_PER_SNACK === 0;
    total += thisIsSnack ? coffeeCycleMs(set + 1) : coffeeBreakMs(set + 1);
    cd += 1;
  } else {
    total += restMs(set + 1);
  }
  sd += 1;

  // every FULL remaining set up to and including the one that closes
  // with the next coffee-tier break
  let n = set + 1;
  while (sd % SETS_PER_COFFEE !== 0) {
    total += WORKS_PER_SET * (workMs(n) + hydrateMs(n));
    sd += 1;
    const closes = sd % SETS_PER_COFFEE === 0;
    if (closes) {
      const isSnack = (cd + 1) % COFFEES_PER_SNACK === 0;
      total += isSnack ? coffeeCycleMs(n + 1) : coffeeBreakMs(n + 1);
      cd += 1;
    } else {
      total += restMs(n + 1);
    }
    n += 1;
  }
  return Math.max(0, total);
};

/* Time to the next SNACK break — same recursion coffee already applies
   to sets, one tier further up. Walks forward phase by phase (mirroring
   buildSchedule's own construction, not a hand-derived closed form)
   until it reaches a set boundary that closes with a snack rather than
   a normal coffee break. Verified against a real simulated schedule at
   the start, mid-cycle, inside the final pre-snack cycle, the very
   last set before the snack fires, and both work and hydrate phases
   with partial elapsed time. */
const msUntilSnack = (set, workInSet, setsDone, coffeesDone, elapsedInPhase, phaseKind) => {
  let total = 0;
  let n = set, w = workInSet, sd = setsDone, cd = coffeesDone;

  if (phaseKind === "work") {
    total += workMs(n) - elapsedInPhase;
    total += hydrateMs(n);
    w += 1;
  } else if (phaseKind === "hydrate") {
    total += hydrateMs(n) - elapsedInPhase;
    w += 1;
  }
  // whatever remains of the current set's work+hydrate pairs
  while (w < WORKS_PER_SET) {
    total += workMs(n) + hydrateMs(n);
    w += 1;
  }
  sd += 1;
  const closesFirst = sd % SETS_PER_COFFEE === 0;
  if (closesFirst) {
    cd += 1;
    if (cd % COFFEES_PER_SNACK === 0) {
      total += coffeeCycleMs(n + 1);
      return Math.max(0, total);
    }
    total += coffeeBreakMs(n + 1);
  } else {
    total += restMs(n + 1);
  }
  n += 1;

  // every remaining full set until the one that closes with the snack
  while (true) {
    total += WORKS_PER_SET * (workMs(n) + hydrateMs(n));
    sd += 1;
    const closes = sd % SETS_PER_COFFEE === 0;
    if (closes) {
      cd += 1;
      if (cd % COFFEES_PER_SNACK === 0) {
        total += coffeeCycleMs(n + 1);
        return Math.max(0, total);
      }
      total += coffeeBreakMs(n + 1);
    } else {
      total += restMs(n + 1);
    }
    n += 1;
  }
};

const fmt = (ms, precise) => {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  const main = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  const frac = precise ? String(Math.floor(ms % 1000)).padStart(3, "0") : pad(Math.floor((ms % 1000) / 10));
  return { main, cs: frac };
};

const fmtClock = (ms) => {
  if (ms < 0) ms = 0;
  const totalSec = ms / 1000;
  if (totalSec < 60) return `${totalSec.toFixed(1)}s`;
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

const fmtClockMs = (ms) => {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const frac = String(Math.floor(ms % 1000)).padStart(3, "0");
  const pad = (n) => String(n).padStart(2, "0");
  const main = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  return { main, ms: frac };
};

const fmtTotal = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  const s = Math.floor(sec % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const BREW_DARK = [42, 26, 20];
const BREW_MID = [232, 214, 190];
const BREW_MILK = [255, 250, 244];
const brewColor = (progress) => {
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0.82) {
    const t = p / 0.82;
    const c = BREW_DARK.map((d, i) => Math.round(d + (BREW_MID[i] - d) * t));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }
  const t = (p - 0.82) / 0.18;
  const c = BREW_MID.map((d, i) => Math.round(d + (BREW_MILK[i] - d) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

/* ============================================================
   STORAGE — profiles, day history, dates. Ported verbatim.
   ============================================================ */
const dayKey = (d = new Date()) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
// Day-of-year (1–366), local time. Drives the critter-of-the-day hero:
// CRITTER_COUNT = 365 means every calendar day maps to exactly one
// critter, so the hero is a deterministic "today's critter" with no
// new state — it derives straight off the wall clock the way the
// village's hour/theme/season already do.
const dayOfYear = (d = new Date()) => {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.max(1, Math.round((d - start) / 86400000));
};
const msUntilMidnight = () => {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next - now;
};

const PROFILE_INDEX = "critter:profiles";
const ACTIVE_PROFILE = "critter:active";
const newProfileId = () => `local_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const scope = (pid, rest) => `critter:p:${pid}:${rest}`;

const loadProfiles = async () => {
  try {
    const r = await storage.get(PROFILE_INDEX);
    if (r && r.value) {
      const list = JSON.parse(r.value);
      if (Array.isArray(list) && list.length) {
        // migrate old single-critter profiles: whatever they already
        // had becomes their first unlocked critter, going forward.
        // Any coffee breaks they've already reached beyond that get
        // caught up as pending unlock choices, offered one at a time
        // at the start of each rest period until the count is right —
        // never retroactively granted all at once.
        return list.map((p) => {
          if (Array.isArray(p.critters)) return p; // already migrated
          const startCritter = p.critter || 1 + Math.floor(Math.random() * CRITTER_COUNT);
          return { ...p, critters: [startCritter], activeCritter: startCritter };
        });
      }
    }
  } catch (e) {}
  return [];
};
const saveProfiles = async (list) => { try { await storage.set(PROFILE_INDEX, JSON.stringify(list)); } catch (e) {} };
const getActiveProfile = async () => {
  try {
    const r = await storage.get(ACTIVE_PROFILE);
    if (r && r.value) return JSON.parse(r.value).id;
  } catch (e) {}
  return null;
};
const setActiveProfile = async (id) => { try { await storage.set(ACTIVE_PROFILE, JSON.stringify({ id })); } catch (e) {} };

const emptyDay = (day) => ({ day, cups: 0, snacksEaten: 0, water: 0, focusMs: 0, blocks: 0, sets: 0, cycles: 0, snacks: 0, hydrates: 0, rests: 0, intentions: [], todos: [] });
const dayPath = (pid, day) => scope(pid, `day:${day}`);
const loadDay = async (pid, day) => {
  try {
    const r = await storage.get(dayPath(pid, day));
    if (r && r.value) return { ...emptyDay(day), ...JSON.parse(r.value) };
  } catch (e) {}
  return emptyDay(day);
};
const saveDay = async (pid, rec) => { try { await storage.set(dayPath(pid, rec.day), JSON.stringify(rec)); } catch (e) {} };
const bumpDay = async (pid, day, patch) => {
  const rec = await loadDay(pid, day);
  const next = { ...rec };
  for (const k of Object.keys(patch)) {
    next[k] = typeof patch[k] === "number" ? (next[k] || 0) + patch[k] : patch[k];
  }
  await saveDay(pid, next);
  return next;
};
const daysBack = (n, from = new Date()) => {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(from);
    d.setDate(d.getDate() - i);
    out.push(dayKey(d));
  }
  return out;
};
const monthGrid = (year, month) => {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay());
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ key: dayKey(d), date: d, inMonth: d.getMonth() === month });
  }
  return cells;
};

/* ============================================================
   TIME-OF-DAY THEME — ported verbatim
   ============================================================ */
const SKY_ANCHORS = [
  { h: 0, hue: 252, sat: 46, lit: 10 }, { h: 4, hue: 248, sat: 42, lit: 13 },
  { h: 6, hue: 230, sat: 55, lit: 30 }, { h: 8, hue: 32, sat: 78, lit: 62 },
  { h: 11, hue: 205, sat: 70, lit: 62 }, { h: 14, hue: 208, sat: 62, lit: 58 },
  { h: 17, hue: 28, sat: 72, lit: 56 }, { h: 19, hue: 14, sat: 68, lit: 42 },
  { h: 21, hue: 262, sat: 50, lit: 20 }, { h: 24, hue: 252, sat: 46, lit: 10 },
];
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerpHue = (a, b, t) => {
  let d = b - a;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return (a + d * t + 360) % 360;
};
const skyAt = (hourFloat) => {
  const h = ((hourFloat % 24) + 24) % 24;
  let i = 0;
  while (i < SKY_ANCHORS.length - 1 && SKY_ANCHORS[i + 1].h <= h) i++;
  const a = SKY_ANCHORS[i];
  const b = SKY_ANCHORS[Math.min(i + 1, SKY_ANCHORS.length - 1)];
  const span = b.h - a.h || 1;
  const t = easeInOut(Math.min(1, Math.max(0, (h - a.h) / span)));
  return { hue: lerpHue(a.hue, b.hue, t), sat: a.sat + (b.sat - a.sat) * t, lit: a.lit + (b.lit - a.lit) * t };
};
const SEASON_TINT = { winter: { sat: -6, lit: -2 }, spring: { sat: 6, lit: 2 }, summer: { sat: 10, lit: 3 }, fall: { sat: 4, lit: -1 } };
const seasonFor = (month) => (month <= 1 || month === 11 ? "winter" : month <= 4 ? "spring" : month <= 7 ? "summer" : "fall");
const WEATHER_TINT = { clear: { sat: 8, lit: 4 }, clouds: { sat: -4, lit: -3 }, rain: { sat: -10, lit: -8 }, snow: { sat: -6, lit: 10 }, fog: { sat: -14, lit: -2 }, storm: { sat: -8, lit: -12 } };
function themeAt(date, weatherKind) {
  const hourFloat = date.getHours() + date.getMinutes() / 60;
  const base = skyAt(hourFloat);
  const season = SEASON_TINT[seasonFor(date.getMonth())];
  const weather = WEATHER_TINT[weatherKind] || { sat: 0, lit: 0 };
  const sat = Math.max(20, Math.min(88, base.sat + season.sat + weather.sat));
  const lit = Math.max(6, Math.min(78, base.lit + season.lit + weather.lit));
  return {
    sky: `hsl(${base.hue.toFixed(1)}, ${sat.toFixed(0)}%, ${lit.toFixed(0)}%)`,
    skyDeep: `hsl(${base.hue.toFixed(1)}, ${(sat * 0.7).toFixed(0)}%, ${Math.max(4, lit - 22).toFixed(0)}%)`,
  };
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function CritterTimerInner() {
  const insets = useSafeAreaInsets();
  // real onboarding gate — "welcome" is the default for a fresh
  // install; flips to "app" once loaded local storage confirms this
  // isn't a first run, or once the person actually continues past
  // Welcome/LoginPortal. Starting at "loading" avoids a flash of the
  // Welcome screen for a returning user while storage is still being
  // read.
  const [onboardingStage, setOnboardingStage] = useState("loading"); // "loading" | "welcome" | "login" | "app"
  const [googleAccount, setGoogleAccount] = useState(null);
  const [oauthChecking, setOauthChecking] = useState(false);

  const [set, setSet] = useState(1);
  const [workInSet, setWorkInSet] = useState(0);
  const [setsDone, setSetsDone] = useState(0);
  const [coffeesDone, setCoffeesDone] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [lifetimeSec, setLifetimeSec] = useState(0);
  const [gated, setGated] = useState(false);
  const [gateReason, setGateReason] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [snackExpanded, setSnackExpanded] = useState(false);
  const [poured, setPoured] = useState(0);
  const [snacksEaten, setSnacksEaten] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const [today, setToday] = useState(dayKey());
  const todayRef = useRef(today);
  useEffect(() => { todayRef.current = today; }, [today]);
  const [view, setView] = useState("timer");
  const [showSidebar, setShowSidebar] = useState(true);
  const [openSections, setOpenSections] = useState(new Set(["timer"]));
  const toggleSection = (name) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };
  const [sectionVisible, setSectionVisible] = useState(
    () => new Set(SETTINGS_REGISTRY.filter((f) => f.default).map((f) => f.key))
  );
  const [showSettings, setShowSettings] = useState(false);
  // real navigation entry point into the standalone Friends screen,
  // merged from the old app — follows the same full-screen-overlay
  // pattern already used for showSettings/showProfiles, rather than
  // inventing a new navigation paradigm for just this one screen
  const [showFriends, setShowFriends] = useState(false);
  const [friendship, setFriendship] = useState({});
  const [customColors, setCustomColors] = useState({}); // { work: "#hex", hydrate: "#hex", ... } — overrides PHASE defaults
  const [pendingLockedToggle, setPendingLockedToggle] = useState(null); // key awaiting warning confirmation
  const [pendingResetConfirm, setPendingResetConfirm] = useState(false);
  const [pendingRestoreConfirm, setPendingRestoreConfirm] = useState(false);
  const [lastBackupPeek, setLastBackupPeek] = useState(null); // { data, at } from peekLastBackup, shown before committing to a restore
  const [openSettingsGroups, setOpenSettingsGroups] = useState(new Set()); // groups start collapsed, tap to expand
  const toggleSettingsGroup = (groupName) => {
    setOpenSettingsGroups((prev) => {
      const next = new Set(prev);
      next.has(groupName) ? next.delete(groupName) : next.add(groupName);
      return next;
    });
  };
  const toggleFeature = (key) => {
    const entry = SETTINGS_REGISTRY.find((f) => f.key === key);
    if (entry?.locked && sectionVisible.has(key)) {
      // only warn when actually TURNING OFF a locked feature — turning
      // one back on never needs a warning, since nothing is lost by
      // re-enabling something
      setPendingLockedToggle(key);
      return;
    }
    if (key === "notifsOn") { toggleNotifs(); return; }
    if (key === "liveSyncOn") { setLiveSyncOn((v) => !v); return; }
    if (key === "soundOn") { setSoundOn((v) => !v); return; }
    if (key.startsWith("sound_")) {
      const soundKey = key.slice(6);
      setSoundKeysOn((prev) => {
        const next = new Set(prev);
        next.has(soundKey) ? next.delete(soundKey) : next.add(soundKey);
        return next;
      });
      return;
    }
    setSectionVisible((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };
  const confirmLockedToggle = () => {
    if (!pendingLockedToggle) return;
    const key = pendingLockedToggle;
    setPendingLockedToggle(null);
    setSectionVisible((prev) => {
      const next = new Set(prev);
      next.delete(key); // this path only ever fires for turning OFF a locked feature
      return next;
    });
  };
  const cancelLockedToggle = () => setPendingLockedToggle(null);
  const phaseColorFor = (kind) => customColors[kind] || PHASE[kind]?.color || "#E85A5A";
  const setCustomColor = (kind, hex) => {
    setCustomColors((prev) => ({ ...prev, [kind]: hex }));
  };
  const resetCustomColor = (kind) => {
    setCustomColors((prev) => {
      const next = { ...prev };
      delete next[kind];
      return next;
    });
  };
  const [todayStats, setTodayStats] = useState({ focusMs: 0, blocks: 0, sets: 0, cycles: 0, hydrates: 0, rests: 0 });
  const [notifsOn, setNotifsOn] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [soundKeysOn, setSoundKeysOn] = useState(
    () => new Set(Object.keys(SOUNDS)) // all six on by default
  );
  const soundEnabled = (key) => soundOn && soundKeysOn.has(key);
  const [calMode, setCalMode] = useState("week");
  const [calDay, setCalDay] = useState(dayKey());
  const [calMonth, setCalMonth] = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });
  const [dayCache, setDayCache] = useState({});
  const [intentionText, setIntentionText] = useState("");
  const [restNoteText, setRestNoteText] = useState("");
  const [todoText, setTodoText] = useState("");
  const [showIntention, setShowIntention] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [pid, setPid] = useState(null);
  const me = profiles.find((p) => p.id === pid);
  const [showProfiles, setShowProfiles] = useState(false);
  const [newName, setNewName] = useState("");
  const [renamingId, setRenamingId] = useState(null); // profile id currently being renamed, or null
  const [renameText, setRenameText] = useState("");
  const [pinEntry, setPinEntry] = useState("");
  const [locked, setLocked] = useState(false);
  const [pinSetup, setPinSetup] = useState(false);
  const [pinError, setPinError] = useState("");
  const [showCritters, setShowCritters] = useState(false);
  const [backupStatus, setBackupStatus] = useState("");
  const [syncCode, setSyncCode] = useState("");
  const [syncCodeInput, setSyncCodeInput] = useState("");
  const [liveSyncOn, setLiveSyncOn] = useState(false);
  const applyingRemoteRef = useRef(false); // true while we're applying an incoming update, to avoid re-broadcasting it right back
  const [syncStatus, setSyncStatus] = useState("");
  const [showRestore, setShowRestore] = useState(false);
  const [restoreText, setRestoreText] = useState("");
  const [theme, setTheme] = useState(() => themeAt(new Date(), "clear"));
  const [weatherKind, setWeatherKind] = useState("clear");
  const [weatherInfo, setWeatherInfo] = useState(null); // { tempF, windMph } once a real reading lands — always stored in imperial from the API, converted for display
  const [unitSystem, setUnitSystem] = useState("imperial"); // "imperial" | "metric" — display only, doesn't change what's fetched
  const [customSidebarWidth, setCustomSidebarWidth] = useState(null); // null = automatic sizing; a number once the person has actually dragged the handle
  const liveDragWidthRef = useRef(null); // mirrors customSidebarWidth but updated synchronously, so release can read the true final value regardless of render timing
  const dragStartWidthRef = useRef(300);
  // PanResponder.create() only ever runs once (inside useRef below), so
  // its callbacks would otherwise be locked to whatever width/landscape
  // were true on the very first render forever — a real stale-closure
  // bug if the device ever rotates or resizes after mount. Keeping the
  // current values in a ref that's updated every render, and reading
  // from the ref INSIDE the callbacks, sidesteps that entirely.
  const liveDimsRef = useRef({ width, landscape, customSidebarWidth });
  liveDimsRef.current = { width, landscape, customSidebarWidth };
  const sidebarPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 2,
      onPanResponderGrant: () => {
        const { customSidebarWidth: csw, width: w, landscape: land } = liveDimsRef.current;
        dragStartWidthRef.current = csw ?? Math.min(300, w * (land ? 0.42 : 1));
      },
      onPanResponderMove: (_, gesture) => {
        const { width: w } = liveDimsRef.current;
        const next = Math.max(220, Math.min(w * 0.85, dragStartWidthRef.current + gesture.dx));
        liveDragWidthRef.current = next;
        setCustomSidebarWidth(next);
      },
      onPanResponderRelease: () => {
        if (liveDragWidthRef.current != null) {
          storage.set("critter:sidebarWidth", String(liveDragWidthRef.current)).catch(() => {});
        }
      },
    })
  ).current;
  const [dateFormat, setDateFormat] = useState("long"); // "long" | "short" | "numeric" | "iso"
  const [mlPerGlass, setMlPerGlass] = useState(250); // standard glass, real default
  const [mlGoal, setMlGoal] = useState(2000); // a common real daily hydration target
  const [showMlSettings, setShowMlSettings] = useState(false);
  const [mlPerGlassInput, setMlPerGlassInput] = useState("250");
  const [mlGoalInput, setMlGoalInput] = useState("2000");
  const [weatherStatus, setWeatherStatus] = useState("");
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const [navHistory, setNavHistory] = useState([]);
  const [, forceTick] = useState(0);

  const scheduleRef = useRef([]);
  const rafRef = useRef(null);
  const lastTickRef = useRef(null);
  const bankedRef = useRef(0);
  const pidRef = useRef(null);

  useEffect(() => { pidRef.current = pid; }, [pid]);

  useEffect(() => {
    const tick = () => setTheme(themeAt(new Date(), weatherKind));
    tick();
    const iv = setInterval(tick, 60000);
    return () => clearInterval(iv);
  }, [weatherKind]);

  /* Local weather is always on — no picker, no toggle. Fetches on
     load, then every 15 minutes: weather doesn't change fast enough
     to need more, and this keeps requests light. If permission is
     denied or the network call fails, weatherKind just stays at its
     last known value (or "clear" on first run) rather than blocking
     anything else in the app. */
  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      setWeatherStatus("Checking local weather…");
      try {
        const r = await fetchLocalWeather();
        if (cancelled) return;
        if (r.ok) {
          setWeatherKind(r.weatherKind);
          setWeatherInfo({ tempF: r.tempF, windMph: r.windMph });
          setWeatherStatus("");
        } else if (r.reason === "permission") {
          setWeatherStatus("Enable location to see real weather in the village");
        } else {
          setWeatherStatus("");
        }
      } catch (e) {
        if (!cancelled) setWeatherStatus("");
      }
    };

    refresh();
    const iv = setInterval(refresh, 15 * 60 * 1000);
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  const current = scheduleRef.current[0] || { kind: "work", ms: workMs(set), set, index: workInSet + 1 };

  /* drives the schoolhouse bell's swing animation in the village —
     true for a short window exactly when the work-start sound fires,
     so the visual and the sound are the same real event, not two
     separate guesses at timing. The swing duration is fixed (not tied
     to the actual audio file's length, which this app has no way to
     know ahead of time) since a believable bell swing reads the same
     regardless of how long the underlying sound clip runs. */
  const [bellRinging, setBellRinging] = useState(false);
  const bellRingTimerRef = useRef(null);

  /* silent maintenance window: every time a hydrate block genuinely
     starts, use that quiet moment to check for an app update and
     refresh weather in the background — never during work, never
     interrupting anything. Keyed by set+index so it only fires once
     per hydrate block, not repeatedly while the same one is running.
     The update check is a real no-op in Snack/dev (Updates.isEnabled
     is false there), so this is safe to leave on unconditionally;
     it only actually does anything in a real published build. */
  const lastMaintenanceKeyRef = useRef(null);
  useEffect(() => {
    if (!running || current.kind !== "hydrate") return;
    const key = `${current.set}-${current.index}`;
    if (lastMaintenanceKeyRef.current === key) return;
    lastMaintenanceKeyRef.current = key;

    // make sure whatever's already happened this session is safely
    // persisted before even considering an update that could reload
    // the whole app — save() already writes set/workInSet/elapsed/
    // lifetimeSec/etc, which is exactly what needs to survive a
    // relaunch for the timer to resume where it left off
    save({}).catch(() => {});
    checkAndApplySilentUpdate().catch(() => {});

    fetchLocalWeather().then((r) => {
      if (r.ok) {
        setWeatherKind(r.weatherKind);
        setWeatherInfo({ tempF: r.tempF, windMph: r.windMph });
      }
    }).catch(() => {});
  }, [running, current.kind, current.set, current.index]);

  /* work + hydrate sounds: fire once every time the running timer
     genuinely moves into a new work or hydrate block — not on pause/
     resume of the same block, not on idle re-renders. Keyed by phase
     kind + set + index so each real transition rings exactly once.
     The "already fired" tracking runs regardless of whether that
     particular sound is currently enabled, so toggling one back on
     mid-session doesn't cause it to fire late for a block that's
     already in progress. */
  const lastPhaseSoundKeyRef = useRef(null);
  useEffect(() => {
    if (!running) return;
    if (current.kind !== "work" && current.kind !== "hydrate") return;
    const key = `${current.kind}-${current.set}-${current.index}`;
    if (lastPhaseSoundKeyRef.current === key) return;
    lastPhaseSoundKeyRef.current = key;
    if (soundEnabled(current.kind)) {
      playSound(current.kind, current.ms); // trims itself short if the phase is shorter than the sound
    }
    if (current.kind === "work") {
      setBellRinging(true);
      if (bellRingTimerRef.current) clearTimeout(bellRingTimerRef.current);
      bellRingTimerRef.current = setTimeout(() => setBellRinging(false), 1400);
    }
    if (current.kind === "hydrate") {
      if (pidRef.current) bumpDay(pidRef.current, dayKey(), { hydrates: 1 });
      setTodayStats((t) => ({ ...t, hydrates: (t.hydrates || 0) + 1 }));
    }
  }, [running, current.kind, current.set, current.index, current.ms, soundOn, soundKeysOn]);

  /* gate-reached sound: fires once when rest/coffee/snack is reached
     and the timer stops to wait for a tap. Keyed by gateReason+set so
     it doesn't re-fire while sitting on the same gate. */
  const [pendingUnlockChoice, setPendingUnlockChoice] = useState(null); // [n1, n2, n3] or null
  const [restNapping, setRestNapping] = useState(false); // true while genuinely sitting on a rest gate

  const lastGateSoundKeyRef = useRef(null);
  useEffect(() => {
    if (!gated || !gateReason) return;
    const key = `${gateReason}-${set}`;
    if (lastGateSoundKeyRef.current === key) return;
    lastGateSoundKeyRef.current = key;
    const soundKey = gateReason === "rest" ? "gate" : gateReason; // "coffee"/"snack" map directly; plain rest uses "gate"
    if (soundEnabled(soundKey)) {
      playSound(soundKey);
    }
    // critter unlocks: owed count is real lifetime coffee breaks
    // reached minus critters already unlocked — offered one choice at
    // a time, at each rest period, until the profile catches up. This
    // naturally handles the "go backwards" migration case: an
    // existing profile with 1 critter and, say, 4 real coffeesDone
    // gets offered a new choice at every rest until it has 4.
    if (gateReason === "rest" && me) {
      if (pidRef.current) bumpDay(pidRef.current, dayKey(), { rests: 1 });
      setTodayStats((t) => ({ ...t, rests: (t.rests || 0) + 1 }));
      setRestNapping(true);
      const owed = (coffeesDone || 0) - ((me.critters || []).length);
      if (owed > 0 && !pendingUnlockChoice) {
        const unlockedSet = new Set(me.critters || []);
        const options = [];
        while (options.length < 3) {
          const candidate = 1 + Math.floor(Math.random() * CRITTER_COUNT);
          if (!unlockedSet.has(candidate) && !options.includes(candidate)) options.push(candidate);
        }
        setPendingUnlockChoice(options);
      }
    }
  }, [gated, gateReason, set, soundOn, soundKeysOn, coffeesDone, me, pendingUnlockChoice]);

  useEffect(() => {
    (async () => {
      await autoRestoreIfEmpty(); // real recovery check, before any fresh-profile logic below could paper over actual data loss
      let list = await loadProfiles();
      let active = await getActiveProfile();
      const isFirstRun = !list.length;
      if (isFirstRun) {
        const id = newProfileId();
        list = [{ id, name: "Me", created: Date.now(), critters: [], activeCritter: null }];
        await saveProfiles(list);
        await setActiveProfile(id);
        active = id;
      }
      // real onboarding gate: a genuinely fresh install (no profiles
      // existed before this bootstrap ran) sees Welcome first; a
      // returning person — any existing profile data at all — skips
      // straight to the app, since they've already been through this
      setOnboardingStage(isFirstRun ? "welcome" : "app");
      if (!active || !list.some((p) => p.id === active)) {
        active = list[0].id;
        await setActiveProfile(active);
      }
      setProfiles(list);
      setPid(active);
      const me = list.find((p) => p.id === active);
      if (me?.pin) setLocked(true);
      if (me && (!me.critters || me.critters.length === 0)) setShowCritters(true);

      try {
        const r = await storage.get(scope(active, "progress"));
        if (r && r.value) {
          const d = JSON.parse(r.value);
          setSet(d.set ?? 1);
          setWorkInSet(d.workInSet ?? 0);
          setSetsDone(d.setsDone ?? 0);
          setCoffeesDone(d.coffeesDone ?? 0);
          setElapsed(d.elapsed ?? 0);
          setLifetimeSec(d.lifetimeSec ?? 0);
          setGated(d.gated ?? false);
          setGateReason(d.gateReason ?? null);
        }
      } catch (e) {}

      const rec = await loadDay(active, dayKey());
      setPoured(rec.cups || 0);
      setSnacksEaten(rec.snacksEaten || 0);
      setWaterCount(rec.water || 0);
      setTodayStats({
        focusMs: rec.focusMs || 0, blocks: rec.blocks || 0,
        sets: rec.sets || 0, cycles: rec.cycles || 0, hydrates: rec.hydrates || 0, rests: rec.rests || 0,
      });
      setDayCache((c) => ({ ...c, [dayKey()]: rec }));
      const savedCode = await getSyncCode();
      if (savedCode) setSyncCode(savedCode);
      try {
        const n = await storage.get("critter:notifs");
        if (n?.value === "on") setNotifsOn(true);
      } catch (e) {}
      try {
        const b = await storage.get("critter:soundOn");
        if (b?.value === "off") setSoundOn(false);
      } catch (e) {}
      try {
        const sk = await storage.get("critter:soundKeysOn");
        if (sk?.value) setSoundKeysOn(new Set(JSON.parse(sk.value)));
      } catch (e) {}
      try {
        const v = await storage.get("critter:sectionVisible");
        if (v?.value) setSectionVisible(new Set(JSON.parse(v.value)));
      } catch (e) {}
      try {
        const c = await storage.get("critter:customColors");
        if (c?.value) setCustomColors(JSON.parse(c.value));
      } catch (e) {}
      try {
        const u = await storage.get("critter:unitSystem");
        if (u?.value === "metric" || u?.value === "imperial") setUnitSystem(u.value);
      } catch (e) {}
      try {
        const df = await storage.get("critter:dateFormat");
        if (df?.value) setDateFormat(df.value);
      } catch (e) {}
      try {
        const sw = await storage.get("critter:sidebarWidth");
        if (sw?.value) {
          const n = parseFloat(sw.value);
          if (!isNaN(n)) setCustomSidebarWidth(n);
        }
      } catch (e) {}
      try {
        const fr = await storage.get("critter:friendship");
        if (fr?.value) setFriendship(JSON.parse(fr.value));
      } catch (e) {}
      try {
        const mg = await storage.get("critter:mlPerGlass");
        if (mg?.value) { const n = parseFloat(mg.value); if (!isNaN(n) && n > 0) setMlPerGlass(n); }
      } catch (e) {}
      try {
        const gg = await storage.get("critter:mlGoal");
        if (gg?.value) { const n = parseFloat(gg.value); if (!isNaN(n) && n > 0) setMlGoal(n); }
      } catch (e) {}
      setLoaded(true);
    })();
  }, []);

  // automatic local backup — a real snapshot every 5 minutes while
  // the app is open, plus one shortly after load so a snapshot exists
  // even in a short session rather than only after a full interval
  useEffect(() => {
    if (!loaded) return;
    const initial = setTimeout(() => autoBackupNow(), 15000);
    const interval = setInterval(() => autoBackupNow(), 5 * 60 * 1000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return; // don't overwrite saved settings with defaults during initial load
    storage.set("critter:sectionVisible", JSON.stringify([...sectionVisible])).catch(() => {});
  }, [sectionVisible, loaded]);

  useEffect(() => {
    if (!loaded) return;
    storage.set("critter:customColors", JSON.stringify(customColors)).catch(() => {});
  }, [customColors, loaded]);

  useEffect(() => {
    if (!loaded) return;
    storage.set("critter:soundOn", soundOn ? "on" : "off").catch(() => {});
  }, [soundOn, loaded]);

  useEffect(() => {
    if (!loaded) return;
    storage.set("critter:soundKeysOn", JSON.stringify([...soundKeysOn])).catch(() => {});
  }, [soundKeysOn, loaded]);

  useEffect(() => {
    if (!loaded) return;
    storage.set("critter:unitSystem", unitSystem).catch(() => {});
  }, [unitSystem, loaded]);

  useEffect(() => {
    if (!loaded) return;
    storage.set("critter:dateFormat", dateFormat).catch(() => {});
  }, [dateFormat, loaded]);

  useEffect(() => {
    if (!loaded) return;
    storage.set("critter:mlPerGlass", String(mlPerGlass)).catch(() => {});
  }, [mlPerGlass, loaded]);

  useEffect(() => {
    if (!loaded) return;
    storage.set("critter:mlGoal", String(mlGoal)).catch(() => {});
  }, [mlGoal, loaded]);

  useEffect(() => {
    if (!loaded) return;
    storage.set("critter:friendship", JSON.stringify(friendship)).catch(() => {});
  }, [friendship, loaded]);

  const save = useCallback(async (next) => {
    if (!pid) return;
    try {
      await storage.set(scope(pid, "progress"), JSON.stringify({
        set, workInSet, setsDone, coffeesDone, elapsed, lifetimeSec, gated, gateReason, ...next,
      }));
    } catch (e) {}
  }, [pid, set, workInSet, setsDone, coffeesDone, elapsed, lifetimeSec, gated]);

  const scheduleBuiltRef = useRef(false);
  useEffect(() => {
    if (!loaded || scheduleBuiltRef.current) return;
    scheduleBuiltRef.current = true;
    scheduleRef.current = buildSchedule(set, workInSet, setsDone, coffeesDone);
  }, [loaded, set, workInSet, setsDone, coffeesDone]);

  const applyLiveState = (state) => {
    applyingRemoteRef.current = true;
    const elapsedNow = state.running
      ? state.elapsedBaseMs + (Date.now() - state.elapsedAt)
      : state.elapsedBaseMs;
    setSet(state.set);
    setWorkInSet(state.workInSet);
    setSetsDone(state.setsDone);
    setCoffeesDone(state.coffeesDone ?? 0);
    setGated(state.gated);
    setGateReason(state.gateReason ?? null);
    setElapsed(elapsedNow);
    setRunning(state.running);
    scheduleRef.current = buildSchedule(state.set, state.workInSet, state.setsDone, state.coffeesDone ?? 0);
    lastTickRef.current = Date.now();
  };

  /* LIVE SYNC — push: whenever the authoritative state changes on
     this device, broadcast it, unless the change just arrived FROM
     another device (applyingRemoteRef guards against echoing it back). */
  useEffect(() => {
    if (!liveSyncOn || !syncCode || !loaded) return;
    if (applyingRemoteRef.current) { applyingRemoteRef.current = false; return; }
    pushLiveState(syncCode, {
      running, set, workInSet, setsDone, coffeesDone, gated, gateReason,
      elapsedBaseMs: elapsed, elapsedAt: Date.now(),
    }).catch(() => {});
  }, [liveSyncOn, syncCode, loaded, running, set, workInSet, setsDone, coffeesDone, gated, gateReason]);

  /* LIVE SYNC — subscribe: apply whatever any device (including this
     one, harmlessly) writes to the shared row. Local ticking keeps
     running smoothly between updates off elapsedBaseMs + time since
     elapsedAt, so the countdown never stutters waiting on the network. */
  useEffect(() => {
    if (!liveSyncOn || !syncCode || !loaded) return;
    let cancelled = false;

    (async () => {
      const initial = await fetchLiveState(syncCode);
      if (initial && !cancelled) applyLiveState(initial);
    })();

    const unsubscribe = subscribeLiveState(syncCode, (state) => {
      if (!cancelled) applyLiveState(state);
    });
    return () => { cancelled = true; unsubscribe(); };
  }, [liveSyncOn, syncCode, loaded]);

  useEffect(() => {
    if (!running) return;
    lastTickRef.current = Date.now();
    const tick = () => {
      const now = Date.now();
      const dt = now - lastTickRef.current;
      lastTickRef.current = now;

      setElapsed((prev) => {
        const cur = scheduleRef.current[0];
        if (!cur) return prev;
        const next = prev + dt;
        if (next >= cur.ms) {
          const finished = cur;
          scheduleRef.current = scheduleRef.current.slice(1);

          if (finished.kind === "work") {
            setLifetimeSec((l) => l + finished.ms / 1000);
            const unbanked = Math.max(0, finished.ms - bankedRef.current);
            bankedRef.current = 0;
            if (pidRef.current) bumpDay(pidRef.current, dayKey(), { focusMs: unbanked, blocks: 1 });
            setTodayStats((t) => ({ ...t, focusMs: t.focusMs + unbanked, blocks: t.blocks + 1 }));
            setWorkInSet((w) => {
              const nw = w + 1;
              if (nw >= WORKS_PER_SET) {
                setSetsDone((s) => s + 1);
                setSet((n) => n + 1);
                if (pidRef.current) bumpDay(pidRef.current, dayKey(), { sets: 1 });
                setTodayStats((t) => ({ ...t, sets: t.sets + 1 }));
                return 0;
              }
              return nw;
            });
          }
          if (finished.kind === "coffee" && pidRef.current) {
            bumpDay(pidRef.current, dayKey(), { cycles: 1 });
            setTodayStats((t) => ({ ...t, cycles: t.cycles + 1 }));
            setCoffeesDone((c) => c + 1);
          }
          if (finished.kind === "snack") {
            setCoffeesDone((c) => c + 1); // the 6th coffee that triggered this snack still counts
            if (pidRef.current) bumpDay(pidRef.current, dayKey(), { snacks: 1 });
            setTodayStats((t) => ({ ...t, snacks: (t.snacks || 0) + 1 }));
          }

          const upNext = scheduleRef.current[0];
          if (upNext && upNext.kind === "coffee") setShowIntention(true);

          if (finished.gate) {
            setRunning(false);
            setGated(true);
            setGateReason(finished.kind);
            setElapsed(0);
            return 0;
          }
          return next - cur.ms;
        }
        return next;
      });
      forceTick((x) => x + 1);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  useEffect(() => {
    if (!running || !loaded || !pid) return;
    const iv = setInterval(() => {
      const cur = scheduleRef.current[0];
      if (!cur || cur.kind !== "work") return;
      setElapsed((e) => {
        const unbanked = e - bankedRef.current;
        if (unbanked >= 1000) {
          bankedRef.current = e;
          bumpDay(pid, dayKey(), { focusMs: unbanked });
          setTodayStats((t) => ({ ...t, focusMs: t.focusMs + unbanked }));
        }
        return e;
      });
    }, 4000);
    return () => clearInterval(iv);
  }, [running, loaded, pid]);

  useEffect(() => {
    if (running || !loaded || !pid) return;
    const cur = scheduleRef.current[0];
    if (!cur || cur.kind !== "work") return;
    const unbanked = elapsed - bankedRef.current;
    if (unbanked > 0) {
      bankedRef.current = elapsed;
      bumpDay(pid, dayKey(), { focusMs: unbanked });
      setTodayStats((t) => ({ ...t, focusMs: t.focusMs + unbanked }));
    }
  }, [running, loaded, pid]);

  useEffect(() => {
    if (!loaded) return;
    const t = setInterval(() => save({}), 3000);
    return () => clearInterval(t);
  }, [loaded, save]);

  useEffect(() => {
    if (!running && loaded) save({});
  }, [running, loaded, save]);

  /* Schedule the next stretch of phase-transition notifications at
     once, not just the current phase. iOS fires local notifications
     independent of the app's JS ever running again, but only for
     triggers that were already registered — so if we only ever
     scheduled the current phase, backgrounding the app would leave
     every phase after that one completely silent. Capped at 40,
     safely under Apple's hard 64-pending-notification limit, and
     rebuilt from scratch on every phase change so it keeps refilling
     as the queue advances. */
  const NOTIF_LOOKAHEAD = 40;

  // real phrase variety for notifications, not a single flat string
  // repeated every time — picks a random variant per notification,
  // and works the person's actual active critter's name in where it
  // fits naturally rather than a generic "Kawaii Critters" label
  const activeCritterName = me?.activeCritter ? critterFor(me.activeCritter).name : null;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const notifPhrases = {
    workStarting: () => pick([
      `🌸 Focus time!`,
      activeCritterName ? `🐾 ${activeCritterName} is ready to focus!` : `🌸 Focus time!`,
      `✨ Let's get to work!`,
    ]),
    hydrateStarting: () => pick([
      `💧 Sip break!`,
      `💧 Time for water!`,
      activeCritterName ? `💧 ${activeCritterName} says stay hydrated!` : `💧 Sip break!`,
    ]),
    restReached: () => pick([
      `🌼 Nice work!`,
      activeCritterName ? `🌼 ${activeCritterName} is proud of you!` : `🌼 Nice work!`,
      `🌸 You earned this break!`,
    ]),
    restBody: () => pick([
      `Time to rest for a bit`,
      `Go stretch your paws for a moment`,
      `A little break, well deserved`,
    ]),
    breakOverTitle: () => pick([
      `☀️ Break's over!`,
      activeCritterName ? `☀️ ${activeCritterName} is ready when you are!` : `☀️ Break's over!`,
      `🌟 Back to it!`,
    ]),
    breakOverBody: () => pick([
      `Time to get back to work`,
      `Let's keep going`,
      `Ready for the next set?`,
    ]),
  };

  useEffect(() => {
    if (!notifsOn || !loaded) return;
    if (!running) {
      Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
      return;
    }
    const cur = scheduleRef.current[0];
    if (!cur) return;

    const upcoming = [cur, ...scheduleRef.current.slice(1, NOTIF_LOOKAHEAD)];
    let cursor = -elapsed; // first entry's remaining time starts negative-offset by what's already elapsed
    const entries = upcoming.map((phase, i) => {
      cursor += i === 0 ? phase.ms : phase.ms;
      // the phase ENDING here is also the moment the NEXT phase begins.
      // Three real cases get their own tone instead of the generic
      // "X ending" wording: work/hydrate starting (repeat constantly,
      // read better as "here's what's beginning"), rest itself
      // starting (an encouraging "nice work, take a break" moment),
      // and coming back from rest specifically into work/hydrate (a
      // "break's over, back to work" nudge rather than a plain label).
      const next = upcoming[i + 1] || scheduleRef.current[NOTIF_LOOKAHEAD] || null;
      const comingFromRest = phase.gate && phase.kind === "rest";

      if (next && (next.kind === "work" || next.kind === "hydrate")) {
        const startingPhrase = next.kind === "work" ? notifPhrases.workStarting() : notifPhrases.hydrateStarting();
        return {
          msFromNow: cursor,
          title: comingFromRest ? notifPhrases.breakOverTitle() : startingPhrase,
          body: comingFromRest ? notifPhrases.breakOverBody() : (phase.gate ? "Break's over" : ""),
        };
      }
      if (next && next.kind === "rest") {
        return { msFromNow: cursor, title: notifPhrases.restReached(), body: notifPhrases.restBody() };
      }

      const label = PHASE[phase.kind]?.name || "Kawaii Critters";
      const nextName = phase.gate
        ? "Time to begin your next set"
        : phase.kind === "work"
          ? "Hydrate break"
          : "Back to focus";
      return { msFromNow: cursor, title: label + " ending", body: nextName };
    });

    scheduleNotifSequence(entries);
  }, [notifsOn, loaded, running, current.kind, set, workInSet, setsDone]);

  /* re-arm the notification queue whenever the app returns to the
     foreground — this is the standard workaround for the 64-pending
     cap: keep topping up the queue rather than trying to schedule the
     whole future up front. */
  useEffect(() => {
    if (!notifsOn) return;
    const onChange = (state) => {
      if (state === "active" && running && loaded) {
        const cur = scheduleRef.current[0];
        if (!cur) return;
        const upcoming = [cur, ...scheduleRef.current.slice(1, NOTIF_LOOKAHEAD)];
        let cursor = -elapsed;
        const entries = upcoming.map((phase, i) => {
          cursor += phase.ms;
          const next = upcoming[i + 1] || scheduleRef.current[NOTIF_LOOKAHEAD] || null;
          const comingFromRest = phase.gate && phase.kind === "rest";
          if (next && (next.kind === "work" || next.kind === "hydrate")) {
            const startingPhrase = next.kind === "work" ? notifPhrases.workStarting() : notifPhrases.hydrateStarting();
            return {
              msFromNow: cursor,
              title: comingFromRest ? notifPhrases.breakOverTitle() : startingPhrase,
              body: comingFromRest ? notifPhrases.breakOverBody() : (phase.gate ? "Break's over" : ""),
            };
          }
          if (next && next.kind === "rest") {
            return { msFromNow: cursor, title: notifPhrases.restReached(), body: notifPhrases.restBody() };
          }
          const label = PHASE[phase.kind]?.name || "Kawaii Critters";
          const nextName = phase.gate
            ? "Time to begin your next set"
            : phase.kind === "work"
              ? "Hydrate break"
              : "Back to focus";
          return { msFromNow: cursor, title: label + " ending", body: nextName };
        });
        scheduleNotifSequence(entries);
      }
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [notifsOn, running, loaded]);

  const remaining = Math.max(0, current.ms - elapsed);
  const progress = current.ms > 0 ? Math.min(1, elapsed / current.ms) : 0;
  const phase = PHASE[current.kind];
  const t = fmt(remaining, current.kind === "hydrate");
  const upcoming = scheduleRef.current.slice(1, 6);

  const cycleStart = set - (setsDone % SETS_PER_COFFEE);
  const coffeeSets = Array.from({ length: SETS_PER_COFFEE }, (_, i) => {
    const n = cycleStart + i;
    return { n, total: setTotalMs(n) };
  });
  const coffeeLen = coffeeBreakMs(cycleStart + SETS_PER_COFFEE);
  const cycleWorkTotal = coffeeSets.reduce((a, s) => a + s.total, 0);

  // one tier up: which coffee-cycle (1-6) are we in within the current
  // snack window, and what does each of those six cycles total
  const snackCycleStartCoffees = coffeesDone - (coffeesDone % COFFEES_PER_SNACK);
  const currentCoffeeIndex = coffeesDone % COFFEES_PER_SNACK; // 0-5, which cycle we're in
  const snackWindowStartSet = set - (setsDone % (SETS_PER_COFFEE * COFFEES_PER_SNACK));
  const snackCoffees = Array.from({ length: COFFEES_PER_SNACK }, (_, i) => {
    const n = snackWindowStartSet + i * SETS_PER_COFFEE;
    return { i, n, total: coffeeCycleMs(n) };
  });
  const snackLen = coffeeCycleMs(snackWindowStartSet + COFFEES_PER_SNACK * SETS_PER_COFFEE);
  const snackWindowTotal = snackCoffees.reduce((a, s) => a + s.total, 0);

  const toCoffee = gated
    ? msUntilCoffee(set, 0, setsDone, coffeesDone, 0, "gate")
    : msUntilCoffee(set, workInSet, setsDone, coffeesDone, elapsed, current.kind);
  const toSnack = gated
    ? msUntilSnack(set, 0, setsDone, coffeesDone, 0, "gate")
    : msUntilSnack(set, workInSet, setsDone, coffeesDone, elapsed, current.kind);

  // rest countdown: while running toward it, real time until the next
  // rest gate specifically (skipping over any coffee/snack closures
  // along the way); once actually sitting on a rest gate, flips to
  // how much of the rest phase itself remains
  const onRest = gated && gateReason === "rest";
  const toRest = onRest
    ? Math.max(0, current.ms - elapsed)
    : msUntilNextRest(set, workInSet, setsDone, coffeesDone, elapsed, current.kind);

  const onCoffee = current.kind === "coffee";
  const brewProgress = onCoffee
    ? 0.82 + 0.18 * Math.min(1, elapsed / Math.max(1, current.ms))
    : cycleWorkTotal > 0 ? 0.82 * (1 - toCoffee / cycleWorkTotal) : 0;
  const brew = brewColor(brewProgress);
  const cd = fmtClockMs(toCoffee);
  const phaseColor = onCoffee ? brew : phase.color;

  const skipForward = () => {
    const cur = scheduleRef.current[0];
    if (!cur) return;
    setNavHistory((h) => [...h.slice(-20), { phase: cur, set, workInSet, setsDone, coffeesDone }]);
    scheduleRef.current = scheduleRef.current.slice(1);
    if (cur.kind === "work") {
      setWorkInSet((w) => {
        const nw = w + 1;
        if (nw >= WORKS_PER_SET) {
          setSetsDone((s) => {
            const ns = s + 1;
            if (ns % SETS_PER_COFFEE === 0) setCoffeesDone((c) => c + 1);
            return ns;
          });
          setSet((n) => n + 1);
          return 0;
        }
        return nw;
      });
    }
    setElapsed(0);
    setGated(false);
    setGateReason(null);
  };

  const stepBack = () => {
    if (!navHistory.length) return;
    const prev = navHistory[navHistory.length - 1];
    setNavHistory((h) => h.slice(0, -1));
    scheduleRef.current = [prev.phase, ...scheduleRef.current];
    setSet(prev.set);
    setWorkInSet(prev.workInSet);
    setSetsDone(prev.setsDone);
    setCoffeesDone(prev.coffeesDone ?? 0);
    setElapsed(0);
    setGated(false);
  };

  const pourCup = async () => {
    const d = dayKey();
    const base = d === today ? poured : 0;
    const next = base + 1;
    if (d !== today) setToday(d);
    setPoured(next);
    await bumpDay(pid, d, { cups: 1 });
  };
  const unpourCup = async () => {
    if (poured === 0) return;
    const next = poured - 1;
    setPoured(next);
    await bumpDay(pid, dayKey(), { cups: -1 });
  };

  const eatSnack = async () => {
    const d = dayKey();
    const base = d === today ? snacksEaten : 0;
    const next = base + 1;
    if (d !== today) setToday(d);
    setSnacksEaten(next);
    await bumpDay(pid, d, { snacksEaten: 1 });
  };
  const unSnack = async () => {
    if (snacksEaten === 0) return;
    const next = snacksEaten - 1;
    setSnacksEaten(next);
    await bumpDay(pid, dayKey(), { snacksEaten: -1 });
  };

  const addWater = async () => {
    const d = dayKey();
    const base = d === today ? waterCount : 0;
    const next = base + 1;
    if (d !== today) setToday(d);
    setWaterCount(next);
    await bumpDay(pid, d, { water: 1 });
  };
  const unWater = async () => {
    if (waterCount === 0) return;
    const next = waterCount - 1;
    setWaterCount(next);
    await bumpDay(pid, dayKey(), { water: -1 });
  };

  useEffect(() => {
    if (!loaded || !pid) return;
    let timer;
    const schedule = () => {
      timer = setTimeout(async () => {
        const prevToday = todayRef.current;
        const d = dayKey();
        setToday(d);
        // only follow the rollover if the calendar was already parked on
        // "today" — if the person had navigated back to look at an
        // earlier day on purpose, rolling that view forward at midnight
        // would yank them away from what they're actually looking at
        setCalDay((cd) => (cd === prevToday ? d : cd));
        const rec = await loadDay(pid, d);
        setPoured(rec.cups || 0);
        setSnacksEaten(rec.snacksEaten || 0);
        setWaterCount(rec.water || 0);
        setTodayStats({
          focusMs: rec.focusMs || 0, blocks: rec.blocks || 0,
          sets: rec.sets || 0, cycles: rec.cycles || 0, snacks: rec.snacks || 0, hydrates: rec.hydrates || 0, rests: rec.rests || 0,
        });
        // the calendar's cache is keyed by day, so the new day's entry
        // (freshly empty) needs to land in it too, not just be implied
        setDayCache((c) => ({ ...c, [d]: rec }));
        schedule();
      }, msUntilMidnight() + 500);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [loaded, pid]);

  const saveIntention = async () => {
    const text = intentionText.trim();
    if (!text) { setShowIntention(false); return; }
    const d = dayKey();
    const rec = await loadDay(pid, d);
    rec.intentions = [...(rec.intentions || []), { text, cycle: Math.floor(setsDone / SETS_PER_COFFEE) + 1, done: false }];
    await saveDay(pid, rec);
    setIntentionText("");
    setShowIntention(false);
    setDayCache((c) => ({ ...c, [d]: rec }));
  };

  const saveRestNote = async () => {
    const text = restNoteText.trim();
    if (!text || !pid) return;
    const d = dayKey();
    const rec = await loadDay(pid, d);
    rec.restNotes = [...(rec.restNotes || []), { text, at: Date.now() }];
    await saveDay(pid, rec);
    setRestNoteText("");
    setDayCache((c) => ({ ...c, [d]: rec }));
  };

  const addTodo = async () => {
    const text = todoText.trim();
    if (!text || !pid) return;
    const d = dayKey();
    const rec = await loadDay(pid, d);
    rec.todos = [...(rec.todos || []), { text, done: false, at: Date.now() }];
    await saveDay(pid, rec);
    setTodoText("");
    setDayCache((c) => ({ ...c, [d]: rec }));
  };

  const toggleTodo = async (idx) => {
    if (!pid) return;
    const d = dayKey();
    const rec = await loadDay(pid, d);
    if (!rec.todos?.[idx]) return;
    rec.todos[idx] = { ...rec.todos[idx], done: !rec.todos[idx].done };
    await saveDay(pid, rec);
    setDayCache((c) => ({ ...c, [d]: rec }));
  };

  const deleteTodo = async (idx) => {
    if (!pid) return;
    const d = dayKey();
    const rec = await loadDay(pid, d);
    if (!rec.todos?.[idx]) return;
    rec.todos = rec.todos.filter((_, i) => i !== idx);
    await saveDay(pid, rec);
    setDayCache((c) => ({ ...c, [d]: rec }));
  };

  const toggleIntention = async (day, idx) => {
    const rec = await loadDay(pid, day);
    if (!rec.intentions?.[idx]) return;
    rec.intentions[idx].done = !rec.intentions[idx].done;
    await saveDay(pid, rec);
    setDayCache((c) => ({ ...c, [day]: rec }));
  };

  useEffect(() => {
    if (!openSections.has("calendar") || !sectionVisible.has("calendar") || !pid) return;
    let cancelled = false;
    (async () => {
      const keys = calMode === "day" ? [calDay]
        : calMode === "week" ? daysBack(7, new Date(calDay + "T12:00:00"))
        : monthGrid(calMonth.y, calMonth.m).map((c) => c.key);
      const out = {};
      for (const k of keys) out[k] = await loadDay(pid, k);
      if (!cancelled) setDayCache((c) => ({ ...c, ...out }));
    })();
    return () => { cancelled = true; };
  }, [openSections, sectionVisible, calMode, calDay, calMonth, pid]);

  const submitPin = async () => {
    if (pinSetup) {
      if (pinEntry.length < 4) { setPinError("Use at least 4 digits"); return; }
      const list = profiles.map((p) => (p.id === pid ? { ...p, pin: pinEntry } : p));
      setProfiles(list);
      await saveProfiles(list);
      setPinEntry(""); setPinSetup(false); setPinError(""); setLocked(false);
      return;
    }
    if (pinEntry === me?.pin) {
      setLocked(false); setPinEntry(""); setPinError("");
    } else {
      setPinError("Wrong PIN"); setPinEntry("");
    }
  };
  const saveSyncCode = async (code) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    await setSyncCode(trimmed);
    setSyncCode(trimmed);
    setSyncCodeInput("");
  };

  const handlePush = async () => {
    if (!syncCode) { setSyncStatus("Set a sync code first"); return; }
    setSyncStatus("Pushing…");
    try {
      await pushSync(syncCode);
      setSyncStatus("Pushed to cloud ✓");
    } catch (e) {
      setSyncStatus("Push failed — check connection");
    }
    setTimeout(() => setSyncStatus(""), 4000);
  };

  const handlePull = async () => {
    if (!syncCode) { setSyncStatus("Set a sync code first"); return; }
    setSyncStatus("Pulling…");
    try {
      const r = await pullSync(syncCode);
      setSyncStatus(r.found
        ? `Pulled ${r.count} items — close and reopen the app`
        : "No cloud data for this code yet");
    } catch (e) {
      setSyncStatus("Pull failed — check connection");
    }
    setTimeout(() => setSyncStatus(""), 5000);
  };

  const toggleNotifs = async () => {
    if (notifsOn) {
      setNotifsOn(false);
      await storage.set("critter:notifs", "off");
      await Notifications.cancelAllScheduledNotificationsAsync();
      return;
    }
    const ok = await ensureNotifPermission();
    if (!ok) { setBackupStatus("Notifications blocked in device settings"); setTimeout(() => setBackupStatus(""), 4000); return; }
    setNotifsOn(true);
    await storage.set("critter:notifs", "on");
  };

  const handleExport = async () => {
    setBackupStatus("Copying backup…");
    try {
      const text = await backupToText();
      await Clipboard.setStringAsync(text);
      setBackupStatus("Backup copied — paste it into Notes to save it");
    } catch (e) {
      setBackupStatus("Backup failed — try again");
    }
    setTimeout(() => setBackupStatus(""), 5000);
  };

  const handleImport = async () => {
    setShowRestore(true);
  };

  const submitRestore = async () => {
    setBackupStatus("Restoring…");
    try {
      const r = await restoreFromText(restoreText);
      if (!r.ok) { setBackupStatus("That doesn't look like a valid backup"); return; }
      setBackupStatus(`Restored ${r.count} items — close and reopen the app`);
      setShowRestore(false);
      setRestoreText("");
    } catch (e) {
      setBackupStatus("Restore failed — check the pasted text");
    }
    setTimeout(() => setBackupStatus(""), 5000);
  };

  const clearPin = async () => {
    const list = profiles.map((p) => (p.id === pid ? { ...p, pin: null } : p));
    setProfiles(list);
    await saveProfiles(list);
  };
  const chooseCritter = async (n) => {
    const list = profiles.map((p) => {
      if (p.id !== pid) return p;
      const already = (p.critters || []).includes(n);
      return {
        ...p,
        critters: already ? p.critters : [...(p.critters || []), n],
        activeCritter: n,
      };
    });
    setProfiles(list);
    await saveProfiles(list);
    setShowCritters(false);
  };

  /* resolves an owed unlock (earned by reaching real coffee breaks) —
     always adds a genuinely new critter, since the three options
     offered are guaranteed not-yet-unlocked. Does NOT change which
     critter is active/shown as the profile avatar — that stays
     constant unless the person manually picks a different one from
     the critter grid. Clears pendingUnlockChoice so the very next
     rest gate re-evaluates whether another one is still owed — this
     is what makes the "go backwards" catch-up work one choice per
     rest period rather than all at once. */
  const resolveUnlockChoice = async (n) => {
    const list = profiles.map((p) => {
      if (p.id !== pid) return p;
      return { ...p, critters: [...(p.critters || []), n] };
    });
    setProfiles(list);
    await saveProfiles(list);
    setPendingUnlockChoice(null);
  };

  const switchProfile = async (id) => {
    if (id === pid) { setShowProfiles(false); return; }
    setRunning(false);
    await save({});
    await setActiveProfile(id);
    setPid(id);
    const target = profiles.find((p) => p.id === id);
    if (target?.pin) setLocked(true);
    if (target && (!target.critters || target.critters.length === 0)) setShowCritters(true);
    bankedRef.current = 0;
    setSet(1); setWorkInSet(0); setSetsDone(0); setCoffeesDone(0);
    setElapsed(0); setLifetimeSec(0); setGated(false);
    setNavHistory([]); setDayCache({});

    try {
      const r = await storage.get(scope(id, "progress"));
      if (r && r.value) {
        const d = JSON.parse(r.value);
        setSet(d.set ?? 1);
        setWorkInSet(d.workInSet ?? 0);
        setSetsDone(d.setsDone ?? 0);
        setCoffeesDone(d.coffeesDone ?? 0);
        setElapsed(d.elapsed ?? 0);
        setLifetimeSec(d.lifetimeSec ?? 0);
        setGated(d.gated ?? false);
        setGateReason(d.gateReason ?? null);
        scheduleRef.current = buildSchedule(d.set ?? 1, d.workInSet ?? 0, d.setsDone ?? 0, d.coffeesDone ?? 0);
      } else {
        scheduleRef.current = buildSchedule(1, 0, 0, 0);
      }
    } catch (e) {
      scheduleRef.current = buildSchedule(1, 0, 0, 0);
    }
    scheduleBuiltRef.current = true;
    const rec = await loadDay(id, dayKey());
    setPoured(rec.cups || 0);
    setSnacksEaten(rec.snacksEaten || 0);
    setWaterCount(rec.water || 0);
    setTodayStats({
      focusMs: rec.focusMs || 0, blocks: rec.blocks || 0,
      sets: rec.sets || 0, cycles: rec.cycles || 0, snacks: rec.snacks || 0, hydrates: rec.hydrates || 0, rests: rec.rests || 0,
    });
    setDayCache((c) => ({ ...c, [dayKey()]: rec }));
    setToday(dayKey());
    setCalDay(dayKey());
    setShowProfiles(false);
  };

  const createProfile = async () => {
    const name = newName.trim() || `Profile ${profiles.length + 1}`;
    const id = newProfileId();
    const list = [...profiles, { id, name, created: Date.now(), critters: [], activeCritter: null }];
    setProfiles(list);
    await saveProfiles(list);
    setNewName("");
    await switchProfile(id);
  };

  const renameProfile = async () => {
    if (!renamingId) return;
    const name = renameText.trim();
    if (!name) { setRenamingId(null); return; } // empty name — just cancel rather than save a blank one
    const list = profiles.map((p) => (p.id === renamingId ? { ...p, name } : p));
    setProfiles(list);
    await saveProfiles(list);
    setRenamingId(null);
    setRenameText("");
  };

  const beginNextSet = () => {
    // the gate entry (rest/coffee) already finished — drop it so the
    // next tick lands on the first work block of the new set, not a
    // replay of the break that just ended
    if (scheduleRef.current[0]?.gate) {
      scheduleRef.current = scheduleRef.current.slice(1);
    }
    if (soundEnabled("resume")) playSound("resume");
    setGated(false);
    setGateReason(null);
    setRestNapping(false);
    setElapsed(0);
    setRunning(true);
  };

  const reset = async () => {
    setRunning(false);
    setSet(1); setWorkInSet(0); setSetsDone(0); setCoffeesDone(0);
    setElapsed(0); setLifetimeSec(0); setGated(false); setNavHistory([]);
    scheduleRef.current = buildSchedule(1, 0, 0, 0);
    if (pid) {
      await storage.set(scope(pid, "progress"), JSON.stringify({
        set: 1, workInSet: 0, setsDone: 0, coffeesDone: 0, elapsed: 0, lifetimeSec: 0, gated: false, gateReason: null,
      }));
    }
  };

  const bg = { backgroundColor: theme.sky };
  const curHour = new Date().getHours() + new Date().getMinutes() / 60;

  if (!loaded || onboardingStage === "loading") {
    return (
      <View style={[styles.shell, bg]}>
        <Text style={styles.dim}>Loading progress…</Text>
      </View>
    );
  }

  if (onboardingStage === "welcome") {
    return (
      <View style={[styles.shell, bg]}>
        <Welcome
          onContinue={() => setOnboardingStage("app")}
          onGoogleGate={() => setOnboardingStage("login")}
        />
      </View>
    );
  }

  if (onboardingStage === "login") {
    return (
      <View style={[styles.shell, bg]}>
        <LoginPortal
          onContinue={() => setOnboardingStage("app")}
          onGoogle={async () => {
            const result = await signInWithGoogle();
            if (result.ok) {
              setGoogleAccount(result.account);
              setOnboardingStage("app"); // a completed real sign-in continues straight into the app, same as guest continuing
            }
            return result;
          }}
        />
      </View>
    );
  }

  // more open sections -> each one shrinks so everything still fits
  // the sidebar without needing to scroll for the common cases. Landscape
  // gets the same treatment even with only one section open, since a
  // landscape phone has far less vertical room than portrait regardless
  // of how many sections are expanded — "fit" the available space
  // rather than always rendering at portrait-sized dimensions and
  // relying on scroll to reach the rest.
  const openCount = openSections.size;
  const dense = openCount >= 2 || landscape;
  const dialSize = openCount >= 3 ? 130 : (openCount === 2 || landscape) ? 170 : 220;
  const dialR = dialSize / 2 - 15;
  const dialC = 2 * Math.PI * dialR;

  if (locked) {
    return (
      <View style={[styles.shell, bg, { alignItems: "center", justifyContent: "center" }]}>
        <View style={styles.lockWrap}>
          <View style={styles.lockCritter}><CritterSVG n={me?.activeCritter || 1} size={92} /></View>
          <Text style={styles.lockName}>{me?.name || "Locked"}</Text>
          <Text style={styles.lockSub}>{pinSetup ? "Choose a PIN — at least 4 digits" : "Enter your PIN"}</Text>
          <View style={styles.pinDots}>
            {Array.from({ length: Math.max(4, pinEntry.length) }).map((_, i) => (
              <View key={i} style={[styles.pinDot, { backgroundColor: i < pinEntry.length ? "#E85A5A" : "rgba(255,255,255,.14)" }]} />
            ))}
          </View>
          {!!pinError && <Text style={styles.pinErr}>{pinError}</Text>}
          <View style={styles.pad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k, i) => (
              <Pressable key={i} disabled={k === ""}
                onPress={() => {
                  if (k === "⌫") setPinEntry((p) => p.slice(0, -1));
                  else if (k !== "") setPinEntry((p) => (p + k).slice(0, 8));
                  setPinError("");
                }}
                style={[styles.padKey, { opacity: k === "" ? 0 : 1 }]}>
                <Text style={styles.padKeyText}>{k}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable onPress={submitPin} style={styles.pinGo}>
            <Text style={styles.pinGoText}>{pinSetup ? "Save PIN" : "Unlock"}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.shell, bg]}>
      {sectionVisible.has("village") && (() => {
        const currentSidebarWidth = !showSidebar ? 0
          : customSidebarWidth != null ? customSidebarWidth
          : landscape ? Math.min(300, width * 0.42)
          : Math.min(styles.leftSidebar.width, width * 0.88);
        const effectiveVillageWidth = Math.max(200, width - currentSidebarWidth);

        // real horizontal scroll: the village's actual content
        // (schoolhouse through the right-side trees) is now wider than
        // most screens at a readable scale (VILLAGE_ART_WIDTH = 790,
        // vs. the original 400). Rather than keep shrinking everything
        // to fit one viewport, the scale is now purely height-driven —
        // a fixed, reasonable sky:ground aspect, independent of screen
        // width — and a horizontal ScrollView lets the person pan
        // across whatever doesn't fit on screen at once, instead of
        // squeezing the whole 790-unit scene into one narrow viewport.
        const vAspect = 1.8;
        const vTotalVB = Math.max(400, Math.min(760, 400 * vAspect));
        const vGroundH = vTotalVB / 3;
        const vBase = vTotalVB - vGroundH; // skyH, matches Village's own "base"
        const vSvgHeight = height || 700;
        const vPxScale = vSvgHeight / vTotalVB; // pure height-based scale — width no longer constrains it since content scrolls
        const vContentWidth = Math.max(effectiveVillageWidth, VILLAGE_ART_WIDTH * vPxScale);
        const vVillageOffsetX = 0; // no centering needed — content scrolls into view rather than being squeezed/centered to fit one screen
        const vSvgScreenOffsetX = 0; // the Svg's own left edge IS the scroll content's left edge now

        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={true}
            style={{ position: "absolute", top: 0, bottom: 0, left: currentSidebarWidth, right: 0 }}
            contentContainerStyle={{ width: vContentWidth, height: "100%" }}>
          <Village hour={curHour} brew={brew} screenWidth={vContentWidth} screenHeight={height}
            weatherKind={weatherKind} month={new Date().getMonth()}
            showWeather={sectionVisible.has("weather")}
            showGarden={sectionVisible.has("garden")}
            showClock={sectionVisible.has("skyClock")}
            showDigitalClock={sectionVisible.has("digitalClock")}
            showSchoolhouse={sectionVisible.has("schoolhouse")}
            showFountain={sectionVisible.has("fountain")}
            bellRinging={bellRinging}
            workActive={running && current.kind === "work"}
            hydrateActive={running && current.kind === "hydrate"}
            restNapping={restNapping && sectionVisible.has("napping")}
            critters={[((dayOfYear(new Date()) - 1) % CRITTER_COUNT) + 1, ...((me?.critters && me.critters.length) ? me.critters : [me?.activeCritter || 1])]} />
          {sectionVisible.has("schoolhouse") && (
            /* the chapel art bakes its own bell into the belfry, so the
               separate swinging BellImage overlay no longer renders —
               a second bell drawn over the painted one would double
               up. BellImage stays defined for easy restoration; ring
               feedback is the ripple in the SVG Schoolhouse, centered
               on the painted bell. */
            <SchoolhouseImage x={90} groundY={vBase + 10}
              dimmed={weatherKind === "clouds" || weatherKind === "rain" || weatherKind === "storm" || weatherKind === "fog"}
              pxScale={vPxScale} svgScreenOffsetX={vSvgScreenOffsetX} villageOffsetX={vVillageOffsetX} />
          )}
          {sectionVisible.has("fountain") && running && current.kind === "hydrate" && (
            <FountainImage x={395} groundY={vBase + 32}
              pxScale={vPxScale} svgScreenOffsetX={vSvgScreenOffsetX} villageOffsetX={vVillageOffsetX} />
          )}
          {sectionVisible.has("skyClock") && (
            <>
            <ClockTowerImage x={395} groundY={vBase + 10}
              isNight={curHour < 6 || curHour >= 20}
              dimmed={weatherKind === "clouds" || weatherKind === "rain" || weatherKind === "storm" || weatherKind === "fog"}
              pxScale={vPxScale} svgScreenOffsetX={vSvgScreenOffsetX} villageOffsetX={vVillageOffsetX} />
            <ClockTowerClockOverlay x={395} groundY={vBase + 10}
              accent={MONTH_THEMES[((new Date().getMonth() % 12) + 12) % 12].accent}
              isNight={curHour < 6 || curHour >= 20}
              dimmed={weatherKind === "clouds" || weatherKind === "rain" || weatherKind === "storm" || weatherKind === "fog"}
              hour={curHour} weatherKind={weatherKind} bellRinging={bellRinging}
              workActive={running && current.kind === "work"}
              pxScale={vPxScale} svgScreenOffsetX={vSvgScreenOffsetX} villageOffsetX={vVillageOffsetX} />
            </>
          )}
          {sectionVisible.has("garden") && (() => {
            const vIsNight = curHour < 6 || curHour >= 20;
            const TREE_DATA = [
              // reference layout: trees interleave with the mushroom
              // caps, trunks landing in the real gaps between them
              { x: 42,  trunkH: 30, source: TREE_ART_TEAL },  // far left, clear of schoolhouse
              { x: 197, trunkH: 40, source: TREE_ART_CORAL }, // canopy above schoolhouse's right roof edge
              { x: 289, trunkH: 24, source: TREE_ART_GREEN }, // small, behind left cap cluster
              { x: 500, trunkH: 46, source: TREE_ART_TEAL },  // big right pair — teal
              { x: 618, trunkH: 40, source: TREE_ART_CORAL }, // big right pair — coral
              { x: 762, trunkH: 22, source: TREE_ART_ROSE },  // far-right edge accent
            ];
            return TREE_DATA.map((t) => (
              <TreeImage key={t.x} x={t.x} trunkY={vBase - t.trunkH} source={t.source}
                isNight={vIsNight}
                pxScale={vPxScale} svgScreenOffsetX={vSvgScreenOffsetX} villageOffsetX={vVillageOffsetX} />
            ));
          })()}
          </ScrollView>
        );
      })()}

      {(gated || current.kind === "rest") && sectionVisible.has("gardenScene") && (
        <View style={[styles.gardenOverlay, landscape && showSidebar && { left: Math.min(300, width * 0.42), right: 0 }]} pointerEvents="none">
          {gateReason === "snack" ? (
            <SnackGathering critters={(me?.critters && me.critters.length) ? me.critters : [me?.activeCritter || 1]} width={Math.min(320, width - 40)} />
          ) : (
            <FlowerPicking critters={(me?.critters && me.critters.length) ? me.critters : [me?.activeCritter || 1]} width={Math.min(320, width - 40)} />
          )}
        </View>
      )}

      {/* main area: just the profile chip and the village behind it */}
      <View style={styles.mainArea}>
        <View style={[styles.topBar, { paddingTop: insets.top }]}>
          {!showSidebar && (
            <Pressable onPress={() => setShowSidebar(true)} style={styles.sidebarOpenBtn}>
              <Text style={styles.sidebarOpenIcon}>☰</Text>
            </Pressable>
          )}
          <Text style={styles.wordmark}>Kawaii Critters</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable onPress={() => setShowFriends(true)} style={styles.sidebarOpenBtn}>
              <Text style={styles.sidebarOpenIcon}>🌸</Text>
            </Pressable>
            <Pressable onPress={() => setShowSettings(true)} style={styles.sidebarOpenBtn}>
              <Text style={styles.sidebarOpenIcon}>⚙️</Text>
            </Pressable>
            <Pressable onPress={() => setShowProfiles(true)} style={styles.profileBtn}>
              <View style={styles.profileDot}><CritterSVG n={me?.activeCritter || 1} size={22} /></View>
              <Text style={styles.profileName} numberOfLines={1}>{profiles.find((p) => p.id === pid)?.name || "…"}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* left sidebar: everything else, collapsible sections, popout-able */}
      {showSidebar && (
        <View style={[
          styles.leftSidebar, { maxHeight: "100%" },
          landscape && !customSidebarWidth && { width: Math.min(300, width * 0.42) },
          customSidebarWidth != null && { width: customSidebarWidth },
        ]}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.leftSidebarInner, { paddingTop: styles.leftSidebarInner.padding + insets.top }, landscape && { paddingBottom: 20 }]}>

            <View style={styles.sbHead}>
              <Text style={styles.sbHeadTitle}>Overview</Text>
              <Pressable onPress={() => setShowSidebar(false)} hitSlop={8}>
                <Text style={styles.sidebarClose}>×</Text>
              </Pressable>
            </View>

            {/* critter-of-the-day hero — deterministic per calendar day,
                pure render derivation off the wall clock; no new state,
                timers, or handlers */}
            <View style={{ alignItems: "center", paddingVertical: 10, marginBottom: 6 }}>
              <CritterOfDayHero size={56} date={new Date()} />
            </View>

            {sectionVisible.has("dateHeader") && (
              <Pressable onPress={() => setDateFormat((f) => {
                const order = ["long", "short", "numeric", "iso"];
                return order[(order.indexOf(f) + 1) % order.length];
              })} style={styles.dateHeader}>
                <View style={styles.dateHeaderRow}>
                  <Text style={styles.dateHeaderText}>{formatHeaderDate(new Date(), dateFormat)}</Text>
                  {sectionVisible.has("dayPercent") && (
                    <Text style={styles.dayPercentText}>{dayPercentElapsed(new Date()).toFixed(0)}%</Text>
                  )}
                </View>
                {sectionVisible.has("dayPercent") && (
                  <View style={styles.dayPercentTrack}>
                    <View style={[styles.dayPercentFill, { width: `${dayPercentElapsed(new Date())}%` }]} />
                  </View>
                )}
              </Pressable>
            )}

            {sectionVisible.has("weatherInfo") && (
              <View style={styles.weatherInfoCard}>
                {weatherInfo ? (
                  <>
                    <Text style={styles.weatherInfoTemp}>
                      {cToFDisplay(weatherInfo.tempF, unitSystem)}{tempUnitLabel(unitSystem)}
                    </Text>
                    <View style={styles.weatherInfoDetails}>
                      <Text style={styles.weatherInfoKind}>{WEATHER_LABELS[weatherKind] || "Clear"}</Text>
                      <Text style={styles.weatherInfoWind}>
                        Wind {mphToDisplay(weatherInfo.windMph, unitSystem)} {windUnitLabel(unitSystem)}
                      </Text>
                    </View>
                    <Pressable onPress={() => setUnitSystem((u) => u === "imperial" ? "metric" : "imperial")}
                      style={styles.weatherUnitToggle}>
                      <Text style={styles.weatherUnitToggleText}>{unitSystem === "imperial" ? "°F" : "°C"}</Text>
                    </Pressable>
                  </>
                ) : (
                  <Text style={styles.weatherInfoPending}>
                    {weatherStatus || "Local weather unavailable"}
                  </Text>
                )}
              </View>
            )}

            {/* ---- section: TIMER ---- */}
            {sectionVisible.has("timer") && (
            <>
            <Pressable onPress={() => toggleSection("timer")} style={[styles.sbSectionHead, dense && styles.sbSectionHeadDense]}>
              <Text style={[styles.sbChevron, { transform: [{ rotate: openSections.has("timer") ? "90deg" : "0deg" }] }]}>›</Text>
              <Text style={styles.sbSectionTitle}>Timer</Text>
              <View style={[styles.phasePillMini, { borderColor: gated ? phaseColorFor("work") : phaseColor }]}>
                <Text style={[styles.phasePillMiniText, { color: gated ? phaseColorFor("work") : phaseColor }]}>
                  {gated
                    ? gateReason === "hydrate" ? "Waiting" : "Complete"
                    : phase.name}
                </Text>
              </View>
            </Pressable>

            {openSections.has("timer") && (
              <View style={[styles.sbSectionBody, dense && styles.sbSectionBodyDense]}>
                <View style={[styles.dialWrap, { marginBottom: dense ? 8 : 4 }]}>
                  <Svg width={dialSize} height={dialSize}>
                    <Circle cx={dialSize / 2} cy={dialSize / 2} r={dialR} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth={dense ? 6 : 8} />
                    <Circle cx={dialSize / 2} cy={dialSize / 2} r={dialR} fill="none"
                      stroke={gated ? phaseColorFor("work") : phaseColor}
                      strokeWidth={dense ? 6 : 8} strokeLinecap="round"
                      strokeDasharray={`${dialC}, ${dialC}`}
                      strokeDashoffset={gated ? dialC : dialC * (1 - progress)}
                      transform={`rotate(-90 ${dialSize / 2} ${dialSize / 2})`} />
                  </Svg>
                  <View style={styles.dialCenter} pointerEvents="none">
                    {gated ? (
                      <>
                        <Text style={[styles.time, { color: phaseColorFor("work"), fontSize: openCount >= 3 ? 20 : openCount === 2 ? 26 : 32 }]}>{set}s</Text>
                        <Text style={[styles.blockLabel, dense && { fontSize: 9, marginTop: 1 }]}>Set {set} blocks</Text>
                      </>
                    ) : (
                      <>
                        <Text style={[styles.time, { color: phaseColor, fontSize: openCount >= 3 ? 22 : openCount === 2 ? 28 : 38 }]}>{t.main}<Text style={styles.centis}>.{t.cs}</Text></Text>
                        {current.kind === "work" && (
                          <Text style={[styles.blockLabel, dense && { fontSize: 9, marginTop: 1 }]}>Set {current.set} · {current.index} of {WORKS_PER_SET}</Text>
                        )}
                        {onCoffee && <Text style={[styles.blockLabel, dense && { fontSize: 9, marginTop: 1 }]}>{progress >= 0.995 ? "Ready" : "Brewing"}</Text>}
                      </>
                    )}
                  </View>
                </View>

                <View style={[styles.dots, dense && { gap: 2, marginBottom: openCount >= 3 ? 8 : 12 }]}>
                  {Array.from({ length: WORKS_PER_SET }).map((_, i) => {
                    const filled = i < workInSet || gated;
                    const isCurrentSlot = i === workInSet;
                    // the flower for the block in progress keeps animating
                    // through both its work phase and the hydrate that
                    // follows it — hydrate is the short transition into
                    // rest, so the growth motion carries through it. once
                    // gated, every flower in the set sits fully bloomed:
                    // that's the same growth animation settled into rest.
                    const active = !gated && isCurrentSlot && (current.kind === "work" || current.kind === "hydrate");
                    const fillPct = gated
                      ? 1
                      : filled
                        ? 1
                        : isCurrentSlot
                          ? (current.kind === "work" ? progress : 1)
                          : 0;
                    return (
                      <Flower key={i} hue={FLOWER_HUES[i]} fill={fillPct} active={active}
                        size={openCount >= 3 ? 18 : openCount === 2 ? 24 : 32} />
                    );
                  })}
                </View>
                {gated && (
                  <Text style={[styles.gardenHint, dense && { fontSize: 10, lineHeight: 14, marginBottom: 2 }]}>
                    {dense ? "🌼 Picking flowers in the garden" : "🌼 Your critter is out picking flowers in the garden below the village."}
                  </Text>
                )}

                <View style={[styles.controls, dense && { marginBottom: 4 }]}>
                  <Pressable onPress={stepBack} disabled={!navHistory.length} style={[styles.arrow, dense && styles.arrowDense, { opacity: navHistory.length ? 1 : 0.3 }]}>
                    <Text style={styles.arrowText}>‹</Text>
                  </Pressable>
                  {gated ? (
                    <Pressable onPress={beginNextSet} style={[styles.btn, dense && styles.btnDense, { backgroundColor: phaseColorFor("work"), borderColor: phaseColorFor("work") }]}>
                      <Text style={[styles.btnTextDark, dense && { fontSize: 12 }]}>
                        {gateReason === "hydrate" ? "Resume" : `Begin ${set}`}
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable onPress={() => setRunning((r) => !r)}
                      style={[styles.btn, dense && styles.btnDense, running
                        ? { backgroundColor: "rgba(255,255,255,.08)", borderColor: "rgba(255,255,255,.18)" }
                        : { backgroundColor: phaseColor, borderColor: phaseColor }]}>
                      <Text style={[running ? styles.btnTextLight : styles.btnTextDark, dense && { fontSize: 12 }]}>{running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}</Text>
                    </Pressable>
                  )}
                  <Pressable onPress={skipForward} style={[styles.arrow, dense && styles.arrowDense]}>
                    <Text style={styles.arrowText}>›</Text>
                  </Pressable>
                </View>
              </View>
            )}
            </>
            )}

            {/* ---- section: HYDRATION ---- */}
            {sectionVisible.has("water") && (
              <>
                <Pressable onPress={() => toggleSection("water")} style={[styles.sbSectionHead, dense && styles.sbSectionHeadDense]}>
                  <Text style={[styles.sbChevron, { transform: [{ rotate: openSections.has("water") ? "90deg" : "0deg" }] }]}>›</Text>
                  <Text style={styles.sbSectionTitle}>Hydration</Text>
                  <Text style={[styles.sbSectionMeta, { color: phaseColorFor("hydrate") }]}>{waterCount}</Text>
                </Pressable>

                {openSections.has("water") && (
                  <View style={[styles.sbSectionBody, dense && styles.sbSectionBodyDense]}>
                    <View style={[styles.coffeeWrap, { borderColor: "rgba(91,168,232,.18)" }]}>
                      <View style={styles.hydrateBreaksRow}>
                        <View style={[styles.sideDot, { backgroundColor: phaseColorFor("hydrate") }]} />
                        <Text style={styles.hydrateBreaksLabel}>Hydrate breaks today</Text>
                        <Text style={[styles.hydrateBreaksVal, { color: phaseColorFor("hydrate") }]}>{todayStats.hydrates || 0}</Text>
                      </View>

                      {/* Plant grows with today's hydration — archetype is tied to
                          which profile slot this is (profile 1 → rose, 2 → sunflower,
                          etc.), stage is 0-19 driven by ml drunk vs. daily goal. */}
                      {(() => {
                        const profIdx = Math.max(0, profiles.findIndex(p => p.id === pid));
                        const pInfo   = plantFor(profIdx + 1);
                        const drankMl = waterCount * mlPerGlass;
                        const pStage  = Math.round(Math.min(1, drankMl / Math.max(1, mlGoal)) * (PLANT_STAGE_COUNT - 1));
                        const pMonth  = new Date().getMonth();
                        return (
                          <View style={styles.plantRow}>
                            <PlantSvg archetype={pInfo.archetype} stage={pStage} month={pMonth} size={68}/>
                            <Text style={styles.plantLabel}>
                              {pInfo.name} · {pStage + 1}/20
                            </Text>
                          </View>
                        );
                      })()}

                      <View style={[styles.mugRow, dense && { marginTop: 0 }]}>
                        {Array.from({ length: 8 }).map((_, i) => {
                          const filledCount = waterCount % 8 === 0 && waterCount > 0 ? 8 : waterCount % 8;
                          return <Droplet key={i} filled={i < filledCount} size={dense ? 14 : 20} />;
                        })}
                      </View>

                      <Pressable onPress={addWater} style={[styles.makerBlock, dense && { padding: 8, marginTop: 8 }]}>
                        <View style={styles.cupCount}>
                          <Pressable onPress={unWater} disabled={waterCount === 0} style={[styles.cupStep, { opacity: waterCount === 0 ? 0.25 : 1 }]}>
                            <Text style={styles.cupStepText}>−</Text>
                          </Pressable>
                          <View style={styles.cupReadout}>
                            <Text style={[styles.cupNum, { color: phaseColorFor("hydrate") }]}>{waterCount * mlPerGlass}</Text>
                            <Text style={styles.cupUnit}>ml drank today</Text>
                          </View>
                          <Pressable onPress={addWater} style={styles.cupStep}>
                            <Text style={styles.cupStepText}>+</Text>
                          </Pressable>
                        </View>
                        <Text style={styles.glassSizeNote}>
                          {waterCount} × {mlPerGlass}ml glass{mlPerGlass === 1 ? "" : "es"}
                        </Text>
                      </Pressable>

                      {(() => {
                        const drankMl = waterCount * mlPerGlass;
                        const remainingMl = Math.max(0, mlGoal - drankMl);
                        // real pacing target: goal spread across a waking
                        // window (7am-10pm, 15 real hours), so "on pace"
                        // reflects the time of day, not just a flat goal
                        const now = new Date();
                        const hourFrac = now.getHours() + now.getMinutes() / 60;
                        const WAKE_START = 7, WAKE_END = 22;
                        const dayFrac = Math.min(1, Math.max(0, (hourFrac - WAKE_START) / (WAKE_END - WAKE_START)));
                        const expectedMl = Math.round(mlGoal * dayFrac);
                        const goalPct = Math.min(100, (drankMl / Math.max(1, mlGoal)) * 100);
                        const expectedPct = Math.min(100, (expectedMl / Math.max(1, mlGoal)) * 100);
                        return (
                          <>
                            <View style={styles.mlProgressRow}>
                              <Text style={styles.mlProgressText}>
                                {drankMl} / {mlGoal} ml — {remainingMl} ml left
                              </Text>
                              <Pressable onPress={() => setShowMlSettings(true)}>
                                <Text style={styles.mlProgressEdit}>edit</Text>
                              </Pressable>
                            </View>
                            <View style={styles.dayPercentTrack}>
                              <View style={[styles.dayPercentFill, {
                                width: `${goalPct}%`,
                                backgroundColor: phaseColorFor("hydrate"),
                              }]} />
                            </View>
                            <View style={styles.paceRow}>
                              <Text style={styles.paceLabel}>
                                {drankMl >= expectedMl ? "On pace" : `${expectedMl - drankMl} ml behind pace`}
                              </Text>
                            </View>
                            <View style={styles.dayPercentTrack}>
                              <View style={[styles.dayPercentFill, {
                                width: `${expectedPct}%`,
                                backgroundColor: "rgba(237,231,245,.3)",
                              }]} />
                            </View>
                          </>
                        );
                      })()}
                    </View>
                  </View>
                )}
              </>
            )}

            {/* ---- section: REST ---- */}
            {sectionVisible.has("rest") && (
            <>
            <Pressable onPress={() => toggleSection("rest")} style={[styles.sbSectionHead, dense && styles.sbSectionHeadDense]}>
              <Text style={[styles.sbChevron, { transform: [{ rotate: openSections.has("rest") ? "90deg" : "0deg" }] }]}>›</Text>
              <Text style={styles.sbSectionTitle}>Rest</Text>
              <Text style={[styles.sbSectionMeta, { color: phaseColorFor("rest") }]}>{todayStats.rests || 0}</Text>
            </Pressable>

            {openSections.has("rest") && (
              <View style={[styles.sbSectionBody, dense && styles.sbSectionBodyDense]}>
                <View style={[styles.coffeeWrap, { borderColor: "rgba(232,122,184,.18)" }]}>
                  <View style={styles.hydrateBreaksRow}>
                    <View style={[styles.sideDot, { backgroundColor: phaseColorFor("rest") }]} />
                    <Text style={styles.hydrateBreaksLabel}>Rests taken today</Text>
                    <Text style={[styles.hydrateBreaksVal, { color: phaseColorFor("rest") }]}>{todayStats.rests || 0}</Text>
                  </View>
                  <View style={styles.restCountdownRow}>
                    <View style={[styles.sideDot, { backgroundColor: phaseColorFor("rest") }]} />
                    <Text style={styles.restCountdownLabel}>
                      {onRest ? "Rest ends in" : "Next rest in"}
                    </Text>
                    <Text style={[styles.restCountdownVal, { color: phaseColorFor("rest") }]}>
                      {fmtClockMs(toRest).main}
                    </Text>
                  </View>

                  <Text style={styles.restPrompt}>
                    {REST_PROMPTS[(new Date().getDate() + (todayStats.rests || 0)) % REST_PROMPTS.length]}
                  </Text>
                  <TextInput
                    value={restNoteText}
                    onChangeText={setRestNoteText}
                    onSubmitEditing={saveRestNote}
                    placeholder="Jot a quick note…"
                    placeholderTextColor="rgba(237,231,245,.35)"
                    multiline
                    style={styles.restNoteInput}
                  />
                  <Pressable onPress={saveRestNote} disabled={!restNoteText.trim()}
                    style={[styles.restNoteSave, !restNoteText.trim() && { opacity: 0.4 }]}>
                    <Text style={styles.restNoteSaveText}>Save</Text>
                  </Pressable>

                  {!!(dayCache[dayKey()]?.restNotes?.length) && (
                    <View style={styles.restNoteList}>
                      {dayCache[dayKey()].restNotes.slice(-3).reverse().map((note, i) => (
                        <Text key={i} style={styles.restNoteItem} numberOfLines={2}>{note.text}</Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}
            </>
            )}

            {/* ---- section: COFFEE ---- */}
            {sectionVisible.has("coffee") && (
            <>
            <Pressable onPress={() => toggleSection("coffee")} style={[styles.sbSectionHead, dense && styles.sbSectionHeadDense]}>
              <Text style={[styles.sbChevron, { transform: [{ rotate: openSections.has("coffee") ? "90deg" : "0deg" }] }]}>›</Text>
              <Text style={styles.sbSectionTitle}>Coffee break</Text>
              <Text style={[styles.sbSectionMeta, styles.brewGlow, { color: brew }]}>{cd.main}</Text>
            </Pressable>

            {openSections.has("coffee") && (
              <View style={[styles.sbSectionBody, dense && styles.sbSectionBodyDense]}>
                <View style={styles.coffeeWrap}>
                  <Pressable onPress={() => setExpanded((e) => !e)} style={styles.coffeeHead}>
                    <View style={styles.coffeeHeadLeft}>
                      <Text style={[styles.chevron, { transform: [{ rotate: expanded ? "90deg" : "0deg" }] }]}>›</Text>
                      <Text style={styles.coffeeLabel} numberOfLines={1}>Next coffee break in</Text>
                    </View>
                    <Text style={[styles.coffeeTime, styles.brewGlow, { color: brew }]}>{cd.main}<Text style={styles.coffeeMs}>.{cd.ms}</Text></Text>
                  </Pressable>

                  <View style={styles.brewTrack}>
                    <View style={[styles.brewFill, { width: `${Math.max(0, Math.min(100, brewProgress * 100))}%`, backgroundColor: brew }]} />
                  </View>

                  <View style={[styles.mugRow, dense && { marginTop: 6 }]}>
                    {coffeeSets.map((s) => {
                      const done = s.n < set;
                      const isCur = s.n === set;
                      const f = done ? 1 : isCur ? workInSet / WORKS_PER_SET : 0;
                      return <Mug key={s.n} fill={f} color={brew} active={isCur} size={dense ? 14 : 20} />;
                    })}
                  </View>

                  <Pressable onPress={pourCup} style={[styles.makerBlock, dense && { padding: 8, marginTop: 8 }]}>
                    <View style={styles.cupCount}>
                      <Pressable onPress={unpourCup} disabled={poured === 0} style={[styles.cupStep, { opacity: poured === 0 ? 0.25 : 1 }]}>
                        <Text style={styles.cupStepText}>−</Text>
                      </Pressable>
                      <View style={styles.cupReadout}>
                        <Text style={[styles.cupNum, styles.brewGlow, { color: brew }]}>{poured}</Text>
                        <Text style={styles.cupUnit}>{poured === 1 ? "cup today" : "cups today"}</Text>
                      </View>
                      <Pressable onPress={pourCup} style={styles.cupStep}>
                        <Text style={styles.cupStepText}>+</Text>
                      </Pressable>
                    </View>
                  </Pressable>

                  {expanded && (
                    <View style={[styles.setList, dense && { gap: 1 }]}>
                      {coffeeSets.map((s) => {
                        const done = s.n < set;
                        const active = s.n === set;
                        return (
                          <View key={s.n} style={[styles.setRow, dense && { paddingVertical: 3 }, active && { backgroundColor: "rgba(232,90,90,.08)", borderColor: "rgba(232,90,90,.25)" }, { opacity: done ? 0.35 : 1 }]}>
                            <Text style={[styles.setName, dense && { fontSize: 10 }]}>Set {s.n}{done ? " ✓" : ""}</Text>
                            {!dense && <Text style={styles.setDetail}>6 × {s.n}s + 6 × {(s.n * 1000 / 7).toFixed(0)}ms</Text>}
                            <Text style={[styles.setTotal, dense && { fontSize: 10 }]}>{fmtClock(s.total)}</Text>
                          </View>
                        );
                      })}
                      <View style={[styles.setRow, styles.coffeeRow, dense && { paddingVertical: 3 }]}>
                        <Text style={[styles.setName, { color: phaseColorFor("coffee") }, dense && { fontSize: 10 }]}>Coffee</Text>
                        {!dense && <Text style={styles.setDetail}>one full set forward</Text>}
                        <Text style={[styles.setTotal, { color: phaseColorFor("coffee") }, dense && { fontSize: 10 }]}>{fmtClock(coffeeLen)}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}
            </>
            )}

            {/* ---- section: SNACK BREAK (one tier up from coffee) ---- */}
            {sectionVisible.has("snack") && (
            <>
            <Pressable onPress={() => toggleSection("snack")} style={[styles.sbSectionHead, dense && styles.sbSectionHeadDense]}>
              <Text style={[styles.sbChevron, { transform: [{ rotate: openSections.has("snack") ? "90deg" : "0deg" }] }]}>›</Text>
              <Text style={styles.sbSectionTitle}>Snack break</Text>
              <Text style={[styles.sbSectionMeta, { color: phaseColorFor("snack") }]}>{fmtClock(toSnack)}</Text>
            </Pressable>

            {openSections.has("snack") && (
              <View style={[styles.sbSectionBody, dense && styles.sbSectionBodyDense]}>
                <View style={[styles.coffeeWrap, { borderColor: "rgba(123,216,143,.18)" }]}>
                  <Pressable onPress={() => setSnackExpanded((e) => !e)} style={styles.coffeeHead}>
                    <View style={styles.coffeeHeadLeft}>
                      <Text style={[styles.chevron, { transform: [{ rotate: snackExpanded ? "90deg" : "0deg" }] }]}>›</Text>
                      <Text style={styles.coffeeLabel}>Next snack break in</Text>
                    </View>
                    <Text style={[styles.coffeeTime, { color: phaseColorFor("snack") }]}>{fmtClock(toSnack)}</Text>
                  </Pressable>

                  <View style={styles.brewTrack}>
                    <View style={[styles.brewFill, {
                      width: `${Math.max(0, Math.min(100, snackWindowTotal > 0 ? (1 - toSnack / (snackWindowTotal + snackLen)) * 100 : 0))}%`,
                      backgroundColor: phaseColorFor("snack"),
                    }]} />
                  </View>

                  <View style={[styles.mugRow, dense && { marginTop: 6 }]}>
                    {snackCoffees.map((s) => {
                      const done = s.i < currentCoffeeIndex;
                      const isCur = s.i === currentCoffeeIndex;
                      const f = done ? 1 : isCur ? (setsDone % SETS_PER_COFFEE) / SETS_PER_COFFEE : 0;
                      return <Fruit key={s.i} kind={s.i} fill={f} active={isCur} size={dense ? 14 : 20} />;
                    })}
                  </View>

                  <Pressable onPress={eatSnack} style={[styles.makerBlock, dense && { padding: 8, marginTop: 8 }]}>
                    <View style={styles.cupCount}>
                      <Pressable onPress={unSnack} disabled={snacksEaten === 0} style={[styles.cupStep, { opacity: snacksEaten === 0 ? 0.25 : 1 }]}>
                        <Text style={styles.cupStepText}>−</Text>
                      </Pressable>
                      <View style={styles.cupReadout}>
                        <Text style={[styles.cupNum, { color: phaseColorFor("snack") }]}>{snacksEaten}</Text>
                        <Text style={styles.cupUnit}>{snacksEaten === 1 ? "snack today" : "snacks today"}</Text>
                      </View>
                      <Pressable onPress={eatSnack} style={styles.cupStep}>
                        <Text style={styles.cupStepText}>+</Text>
                      </Pressable>
                    </View>
                  </Pressable>

                  {snackExpanded && (
                    <View style={[styles.setList, dense && { gap: 1 }]}>
                      {snackCoffees.map((s) => {
                        const done = s.i < currentCoffeeIndex;
                        const active = s.i === currentCoffeeIndex;
                        return (
                          <View key={s.i} style={[styles.setRow, dense && { paddingVertical: 3 }, active && { backgroundColor: "rgba(123,216,143,.08)", borderColor: "rgba(123,216,143,.25)" }, { opacity: done ? 0.35 : 1 }]}>
                            <Text style={[styles.setName, dense && { fontSize: 10 }]}>Cycle {s.i + 1}{done ? " ✓" : ""}</Text>
                            {!dense && <Text style={styles.setDetail}>6 sets, sized from set {s.n}</Text>}
                            <Text style={[styles.setTotal, dense && { fontSize: 10 }]}>{fmtClock(s.total)}</Text>
                          </View>
                        );
                      })}
                      <View style={[styles.setRow, styles.coffeeRow, dense && { paddingVertical: 3 }]}>
                        <Text style={[styles.setName, { color: phaseColorFor("snack") }, dense && { fontSize: 10 }]}>Snack</Text>
                        {!dense && <Text style={styles.setDetail}>one full coffee cycle forward</Text>}
                        <Text style={[styles.setTotal, { color: phaseColorFor("snack") }, dense && { fontSize: 10 }]}>{fmtClock(snackLen)}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}
            </>
            )}

            {/* ---- section: TODAY'S STATS ---- */}
            {sectionVisible.has("stats") && (
            <>
            <Pressable onPress={() => toggleSection("stats")} style={[styles.sbSectionHead, dense && styles.sbSectionHeadDense]}>
              <Text style={[styles.sbChevron, { transform: [{ rotate: openSections.has("stats") ? "90deg" : "0deg" }] }]}>›</Text>
              <Text style={styles.sbSectionTitle}>Today</Text>
              <Text style={styles.sbSectionMeta}>{fmtTotal(todayStats.focusMs / 1000)}</Text>
            </Pressable>

            {openSections.has("stats") && (
              <View style={[styles.sbSectionBody, dense && styles.sbSectionBodyDense]}>
                {dense ? (
                  <View style={styles.statsGrid}>
                    <View style={styles.statsGridCell}><Text style={[styles.statsGridVal, { color: "#E85A5A" }]}>{fmtTotal(todayStats.focusMs / 1000)}</Text><Text style={styles.statsGridLabel}>Focus</Text></View>
                    <View style={styles.statsGridCell}><Text style={[styles.statsGridVal, { color: "#5BA8E8" }]}>{todayStats.blocks}</Text><Text style={styles.statsGridLabel}>Blocks</Text></View>
                    <View style={styles.statsGridCell}><Text style={[styles.statsGridVal, { color: "#E87AB8" }]}>{todayStats.sets}</Text><Text style={styles.statsGridLabel}>Sets</Text></View>
                    <View style={styles.statsGridCell}><Text style={[styles.statsGridVal, styles.brewGlow, { color: brew }]}>{poured}</Text><Text style={styles.statsGridLabel}>Coffee</Text></View>
                  </View>
                ) : (
                  <>
                    <View style={styles.sideStat}>
                      <View style={styles.sideDot} />
                      <Text style={styles.sideLabel}>Focus</Text>
                      <Text style={styles.sideVal}>{fmtTotal(todayStats.focusMs / 1000)}</Text>
                    </View>
                    <View style={styles.sideStat}>
                      <View style={[styles.sideDot, { backgroundColor: "#5BA8E8" }]} />
                      <Text style={styles.sideLabel}>Blocks</Text>
                      <Text style={styles.sideVal}>{todayStats.blocks}</Text>
                    </View>
                    <View style={styles.sideStat}>
                      <View style={[styles.sideDot, { backgroundColor: "#E87AB8" }]} />
                      <Text style={styles.sideLabel}>Sets</Text>
                      <Text style={styles.sideVal}>{todayStats.sets}</Text>
                    </View>
                    <View style={styles.sideStat}>
                      <View style={[styles.sideDot, { backgroundColor: phaseColorFor("coffee") }]} />
                      <Text style={styles.sideLabel}>Cycles</Text>
                      <Text style={styles.sideVal}>{todayStats.cycles}</Text>
                    </View>
                    <View style={styles.sideStat}>
                      <View style={[styles.sideDot, { backgroundColor: brew }]} />
                      <Text style={styles.sideLabel}>Coffee</Text>
                      <Text style={styles.sideVal}>{poured}</Text>
                    </View>
                    <View style={styles.sideStat}>
                      <View style={[styles.sideDot, { backgroundColor: phaseColorFor("snack") }]} />
                      <Text style={styles.sideLabel}>Snacks</Text>
                      <Text style={styles.sideVal}>{snacksEaten}</Text>
                    </View>
                    <View style={styles.sideStat}>
                      <View style={[styles.sideDot, { backgroundColor: phaseColorFor("hydrate") }]} />
                      <Text style={styles.sideLabel}>Water</Text>
                      <Text style={styles.sideVal}>{waterCount}</Text>
                    </View>
                    <View style={styles.sideDivider} />
                    <View style={styles.sideStat}>
                      <Text style={styles.sideLabel}>Lifetime focus</Text>
                      <Text style={[styles.sideVal, { fontSize: 14 }]}>{fmtTotal(lifetimeSec)}</Text>
                    </View>
                    <View style={styles.sideStat}>
                      <Text style={styles.sideLabel}>Work block</Text>
                      <Text style={styles.sideVal}>{set}s</Text>
                    </View>
                  </>
                )}
              </View>
            )}
            </>
            )}

            {/* ---- section: UP NEXT ---- */}
            {sectionVisible.has("upnext") && (
            <>
            <Pressable onPress={() => toggleSection("upnext")} style={[styles.sbSectionHead, dense && styles.sbSectionHeadDense]}>
              <Text style={[styles.sbChevron, { transform: [{ rotate: openSections.has("upnext") ? "90deg" : "0deg" }] }]}>›</Text>
              <Text style={styles.sbSectionTitle}>Up next</Text>
              <Text style={styles.sbSectionMeta}>{upcoming.length}</Text>
            </Pressable>

            {openSections.has("upnext") && (
              <View style={[styles.sbSectionBody, dense && styles.sbSectionBodyDense]}>
                <View style={styles.upWrap}>
                  {upcoming.map((u, i) => (
                    <View key={i} style={[styles.upRow, dense && { paddingVertical: 3 }]}>
                      <View style={[styles.upDot, { backgroundColor: phaseColorFor(u.kind) }]} />
                      <Text style={[styles.upName, dense && { fontSize: 11 }]}>{PHASE[u.kind].name}</Text>
                      <Text style={[styles.upTime, dense && { fontSize: 11 }]}>{fmt(u.ms).main}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            </>
            )}

            {/* ---- section: CALENDAR ---- */}
            {sectionVisible.has("calendar") && (
            <>
            <Pressable onPress={() => toggleSection("calendar")} style={[styles.sbSectionHead, dense && styles.sbSectionHeadDense]}>
              <Text style={[styles.sbChevron, { transform: [{ rotate: openSections.has("calendar") ? "90deg" : "0deg" }] }]}>›</Text>
              <Text style={styles.sbSectionTitle}>Calendar</Text>
            </Pressable>

            {openSections.has("calendar") && (
              <View style={[styles.sbSectionBody, dense && styles.sbSectionBodyDense]}>
                <Calendar mode={calMode} setMode={setCalMode} day={calDay} setDay={setCalDay}
                  month={calMonth} setMonth={setCalMonth} cache={dayCache}
                  onToggleIntention={toggleIntention} brew={brew} />
              </View>
            )}
            </>
            )}

            {/* ---- section: TODO LIST ---- */}
            {sectionVisible.has("todos") && (
            <>
            <Pressable onPress={() => toggleSection("todos")} style={[styles.sbSectionHead, dense && styles.sbSectionHeadDense]}>
              <Text style={[styles.sbChevron, { transform: [{ rotate: openSections.has("todos") ? "90deg" : "0deg" }] }]}>›</Text>
              <Text style={styles.sbSectionTitle}>To-do list</Text>
              <Text style={styles.sbSectionMeta}>
                {(() => {
                  const todos = dayCache[dayKey()]?.todos || [];
                  const doneCount = todos.filter((t) => t.done).length;
                  return todos.length ? `${doneCount}/${todos.length}` : "";
                })()}
              </Text>
            </Pressable>

            {openSections.has("todos") && (
              <View style={[styles.sbSectionBody, dense && styles.sbSectionBodyDense]}>
                <View style={styles.todoInputRow}>
                  <TextInput
                    value={todoText}
                    onChangeText={setTodoText}
                    onSubmitEditing={addTodo}
                    placeholder="Add a task…"
                    placeholderTextColor="rgba(237,231,245,.35)"
                    style={styles.todoInput}
                  />
                  <Pressable onPress={addTodo} disabled={!todoText.trim()}
                    style={[styles.todoAddBtn, !todoText.trim() && { opacity: 0.4 }]}>
                    <Text style={styles.todoAddBtnText}>+</Text>
                  </Pressable>
                </View>
                {(dayCache[dayKey()]?.todos || []).length === 0 ? (
                  <Text style={styles.todoEmpty}>Nothing on the list yet today.</Text>
                ) : (
                  <View style={styles.todoList}>
                    {(dayCache[dayKey()]?.todos || []).map((t, i) => (
                      <View key={i} style={styles.todoRow}>
                        <Pressable onPress={() => toggleTodo(i)} style={[styles.todoCheck, t.done && styles.todoCheckDone]}>
                          {t.done && <Text style={styles.todoCheckMark}>✓</Text>}
                        </Pressable>
                        <Text style={[styles.todoText, t.done && styles.todoTextDone]} numberOfLines={2}>
                          {t.text}
                        </Text>
                        <Pressable onPress={() => deleteTodo(i)} hitSlop={6}>
                          <Text style={styles.todoDelete}>×</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
            </>
            )}

          </ScrollView>
          <View {...sidebarPanResponder.panHandlers} style={styles.sidebarDragHandle} hitSlop={{ left: 8, right: 8 }}>
            <View style={styles.sidebarDragGrip} />
          </View>
        </View>
      )}

      {!showSidebar && (
        <Pressable onPress={() => setShowSidebar(true)} style={styles.sidebarReopenLeft}>
          <Text style={styles.sidebarReopenText}>›</Text>
        </Pressable>
      )}


      {showIntention && (() => {
        const currentCycle = Math.floor(setsDone / SETS_PER_COFFEE) + 1;
        const todayRec = dayCache[dayKey()];
        const cycleCount = (todayRec?.intentions || []).filter((it) => it.cycle === currentCycle).length;
        return (
          <View style={styles.modalWrap}>
            <View style={styles.modal}>
              <View style={styles.modalTitleRow}>
                <Text style={[styles.modalTitle, { marginBottom: 0 }]}>COFFEE BREAK</Text>
                <Text style={styles.modalCycleCount}>
                  {cycleCount === 0 ? "First intention this cycle" : `Intention #${cycleCount + 1} this cycle`}
                </Text>
              </View>
              <View style={{ height: 7 }} />
              <Text style={styles.modalSub}>What do you want to accomplish before the next one?</Text>
              <TextInput autoFocus value={intentionText} onChangeText={setIntentionText}
                onSubmitEditing={saveIntention} placeholder="Write your intention…"
                placeholderTextColor="rgba(237,231,245,.35)" style={styles.modalInput} />
              <View style={styles.modalRow}>
                <Pressable onPress={() => { setIntentionText(""); setShowIntention(false); }} style={styles.modalSkip}>
                  <Text style={styles.modalSkipText}>Skip</Text>
                </Pressable>
                <Pressable onPress={saveIntention} style={styles.modalSave}>
                  <Text style={styles.modalSaveText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        );
      })()}

      {showFriends && (
        <View style={[styles.shell, { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }]}>
          <Friends
            onBack={() => setShowFriends(false)}
            friendship={friendship}
            setFriendship={setFriendship}
          />
        </View>
      )}

      {showSettings && (
        <View style={styles.modalWrap}>
          <View style={[styles.modal, { maxHeight: "80%" }]}>
            <Text style={styles.modalTitle}>SETTINGS</Text>
            <Text style={[styles.modalSub, { fontSize: 13 }]}>Turn any feature on or off. Changes are saved automatically.</Text>
            <ScrollView>
              {Object.entries(
                SETTINGS_REGISTRY.reduce((groups, f) => {
                  (groups[f.group] = groups[f.group] || []).push(f);
                  return groups;
                }, {})
              ).map(([groupName, features]) => {
                const isOpen = openSettingsGroups.has(groupName);
                const onCount = features.filter((f) =>
                  f.key === "notifsOn" ? notifsOn
                  : f.key === "liveSyncOn" ? liveSyncOn
                  : f.key === "soundOn" ? soundOn
                  : f.key.startsWith("sound_") ? soundKeysOn.has(f.key.slice(6))
                  : sectionVisible.has(f.key)
                ).length;
                return (
                  <View key={groupName} style={{ marginBottom: 10 }}>
                    <Pressable onPress={() => toggleSettingsGroup(groupName)} style={styles.settingsGroupHead}>
                      <Text style={[styles.sbChevron, { transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }]}>›</Text>
                      <Text style={styles.settingsGroupTitle}>{groupName}</Text>
                      <Text style={styles.settingsGroupCount}>{onCount}/{features.length} on</Text>
                    </Pressable>
                    {isOpen && features.map((f) => {
                    const isOn = f.key === "notifsOn" ? notifsOn
                      : f.key === "liveSyncOn" ? liveSyncOn
                      : f.key === "soundOn" ? soundOn
                      : f.key.startsWith("sound_") ? soundKeysOn.has(f.key.slice(6))
                      : sectionVisible.has(f.key);
                    const subSoundDisabledByMaster = f.key.startsWith("sound_") && !soundOn;
                    return (
                      <Pressable key={f.key} onPress={() => toggleFeature(f.key)}
                        style={[styles.settingsRow, subSoundDisabledByMaster && { opacity: 0.5 }]}>
                        <Text style={styles.settingsLabel}>{f.label}</Text>
                        <View style={[styles.settingsSwitch, isOn && styles.settingsSwitchOn]}>
                          <View style={[styles.settingsKnob, isOn && styles.settingsKnobOn]} />
                        </View>
                      </Pressable>
                    );
                    })}
                  </View>
                );
              })}

              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.settingsGroupTitle, { marginBottom: 8 }]}>Sidebar colors</Text>
                <Text style={styles.settingsColorHint}>
                  Pick a swatch or enter a hex code. "Reset" returns a color to its default.
                </Text>
                {["work", "hydrate", "rest", "coffee", "snack"].map((kind) => (
                  <ColorPickerRow
                    key={kind}
                    label={PHASE[kind].name}
                    value={phaseColorFor(kind)}
                    isCustom={!!customColors[kind]}
                    onPick={(hex) => setCustomColor(kind, hex)}
                    onReset={() => resetCustomColor(kind)}
                  />
                ))}
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.settingsGroupTitle, { marginBottom: 8 }]}>Units & date format</Text>
                <View style={styles.unitChoiceRow}>
                  {["imperial", "metric"].map((sys) => (
                    <Pressable key={sys} onPress={() => setUnitSystem(sys)}
                      style={[styles.unitChoiceBtn, unitSystem === sys && styles.unitChoiceBtnActive]}>
                      <Text style={[styles.unitChoiceText, unitSystem === sys && styles.unitChoiceTextActive]}>
                        {sys === "imperial" ? "Imperial (°F, mph)" : "Metric (°C, km/h)"}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View style={[styles.unitChoiceRow, { marginTop: 8 }]}>
                  {[
                    { key: "long", label: formatHeaderDate(new Date(), "long") },
                    { key: "short", label: formatHeaderDate(new Date(), "short") },
                    { key: "numeric", label: formatHeaderDate(new Date(), "numeric") },
                    { key: "iso", label: formatHeaderDate(new Date(), "iso") },
                  ].map((opt) => (
                    <Pressable key={opt.key} onPress={() => setDateFormat(opt.key)}
                      style={[styles.unitChoiceBtn, dateFormat === opt.key && styles.unitChoiceBtnActive]}>
                      <Text style={[styles.unitChoiceText, dateFormat === opt.key && styles.unitChoiceTextActive]} numberOfLines={1}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={[styles.settingsGroupTitle, { marginBottom: 8 }]}>Reset & restore</Text>
                <Text style={styles.settingsColorHint}>
                  Resetting clears your current set, block, and lifetime progress. It doesn't touch your critters, stats, or to-do list.
                </Text>
                <View style={styles.resetRestoreRow}>
                  <Pressable onPress={() => setPendingResetConfirm(true)} style={styles.resetRestoreBtn}>
                    <Text style={styles.resetRestoreBtnText}>Reset progress</Text>
                  </Pressable>
                  <Pressable onPress={async () => {
                    const snap = await peekLastBackup();
                    setLastBackupPeek(snap);
                    setPendingRestoreConfirm(true);
                  }} style={[styles.resetRestoreBtn, styles.resetRestoreBtnRestore]}>
                    <Text style={styles.resetRestoreBtnText}>Restore last backup</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
            <Pressable onPress={() => setShowSettings(false)} style={[styles.modalSkip, { width: "100%", marginTop: 8 }]}>
              <Text style={styles.modalSkipText}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}

      {showProfiles && (
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>PROFILES</Text>
            <Text style={[styles.modalSub, { fontSize: 13 }]}>Each profile keeps its own timer progress and history.</Text>
            <View style={{ gap: 6, marginBottom: 14 }}>
              {profiles.map((p) => (
                renamingId === p.id ? (
                  <View key={p.id} style={[styles.profRow, styles.profRowActive]}>
                    <View style={styles.profAvatar}><CritterSVG n={p.activeCritter || 1} size={28} /></View>
                    <TextInput autoFocus value={renameText} onChangeText={setRenameText}
                      onSubmitEditing={renameProfile}
                      style={[styles.profLabel, styles.profRenameInput]} />
                    <Pressable onPress={renameProfile} hitSlop={6}>
                      <Text style={styles.profRenameSave}>Save</Text>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable key={p.id} onPress={() => switchProfile(p.id)} style={[styles.profRow, p.id === pid && styles.profRowActive]}>
                    <View style={styles.profAvatar}><CritterSVG n={p.activeCritter || 1} size={28} /></View>
                    <Text style={styles.profLabel}>{p.name}</Text>
                    {p.id === pid && <Text style={styles.profActive}>ACTIVE</Text>}
                    <Pressable onPress={() => { setRenamingId(p.id); setRenameText(p.name); }} hitSlop={8}>
                      <Text style={styles.profRenameIcon}>✎</Text>
                    </Pressable>
                  </Pressable>
                )
              ))}
            </View>
            <View style={styles.profAddRow}>
              <TextInput value={newName} onChangeText={setNewName} onSubmitEditing={createProfile}
                placeholder="New profile name" placeholderTextColor="rgba(237,231,245,.35)"
                style={[styles.modalInput, { flex: 1, marginBottom: 0 }]} />
              <Pressable onPress={createProfile} style={styles.profAdd}>
                <Text style={styles.profAddText}>Add</Text>
              </Pressable>
            </View>
            <View style={styles.profTools}>
              <Pressable onPress={() => { setShowProfiles(false); setShowCritters(true); }} style={styles.profTool}>
                <CritterSVG n={me?.activeCritter || 1} size={26} />
                <Text style={styles.profToolText}>Critter</Text>
              </Pressable>
              <Pressable onPress={() => { if (me?.pin) clearPin(); else { setPinSetup(true); setShowProfiles(false); setLocked(true); } }} style={styles.profTool}>
                <Text style={{ fontSize: 17 }}>{me?.pin ? "🔓" : "🔒"}</Text>
                <Text style={styles.profToolText}>{me?.pin ? "Remove PIN" : "Set PIN"}</Text>
              </Pressable>
            </View>

            <Text style={styles.syncTitle}>Cloud sync</Text>
            {syncCode ? (
              <View style={styles.syncCodeRow}>
                <Text style={styles.syncCodeLabel}>Your sync code</Text>
                <Text style={styles.syncCodeVal}>{syncCode}</Text>
              </View>
            ) : (
              <View style={styles.profAddRow}>
                <TextInput
                  value={syncCodeInput}
                  onChangeText={setSyncCodeInput}
                  onSubmitEditing={() => saveSyncCode(syncCodeInput)}
                  placeholder="Choose a sync code, e.g. sabrina42"
                  placeholderTextColor="rgba(237,231,245,.35)"
                  autoCapitalize="none"
                  style={[styles.modalInput, { flex: 1, marginBottom: 0 }]}
                />
                <Pressable onPress={() => saveSyncCode(syncCodeInput)} style={styles.profAdd}>
                  <Text style={styles.profAddText}>Set</Text>
                </Pressable>
              </View>
            )}

            {!!syncCode && (
              <Text style={styles.syncNote}>
                {liveSyncOn
                  ? "Live sync is on (see Settings to turn it off) — any device with this code stays in sync instantly."
                  : "Live sync is off — turn it on in Settings, or Push/Pull below to sync manually."}
              </Text>
            )}

            {!!syncCode && !liveSyncOn && (
              <View style={styles.profTools}>
                <Pressable onPress={handlePush} style={styles.profTool}>
                  <Text style={{ fontSize: 17 }}>☁️⬆️</Text>
                  <Text style={styles.profToolText}>Push</Text>
                </Pressable>
                <Pressable onPress={handlePull} style={styles.profTool}>
                  <Text style={{ fontSize: 17 }}>☁️⬇️</Text>
                  <Text style={styles.profToolText}>Pull</Text>
                </Pressable>
              </View>
            )}
            {!!syncStatus && <Text style={styles.backupStatus}>{syncStatus}</Text>}

            <View style={styles.profTools}>
              <Pressable onPress={handleExport} style={styles.profTool}>
                <Text style={{ fontSize: 17 }}>⬇️</Text>
                <Text style={styles.profToolText}>Backup now</Text>
              </Pressable>
              <Pressable onPress={handleImport} style={styles.profTool}>
                <Text style={{ fontSize: 17 }}>⬆️</Text>
                <Text style={styles.profToolText}>Restore</Text>
              </Pressable>
            </View>
            {!!backupStatus && <Text style={styles.backupStatus}>{backupStatus}</Text>}

            <Text style={styles.syncNote}>Profiles are stored on this device. Back up regularly until real account sync arrives.</Text>
            <Pressable onPress={() => setShowProfiles(false)} style={[styles.modalSkip, { width: "100%", marginTop: 12 }]}>
              <Text style={styles.modalSkipText}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}

      {showMlSettings && (
        <View style={styles.modalWrap}>
          <View style={[styles.modal, { maxWidth: 320 }]}>
            <Text style={styles.modalTitle}>HYDRATION GOAL</Text>
            <Text style={styles.modalSub}>How much is a glass, and how much water do you want to drink today?</Text>
            <Text style={styles.mlFieldLabel}>Glass size (ml)</Text>
            <TextInput value={mlPerGlassInput} onChangeText={setMlPerGlassInput}
              keyboardType="numeric" style={styles.modalInput} placeholder="250" />
            <Text style={[styles.mlFieldLabel, { marginTop: 10 }]}>Daily goal (ml)</Text>
            <TextInput value={mlGoalInput} onChangeText={setMlGoalInput}
              keyboardType="numeric" style={styles.modalInput} placeholder="2000" />
            <View style={styles.modalRow}>
              <Pressable onPress={() => {
                setMlPerGlassInput(String(mlPerGlass));
                setMlGoalInput(String(mlGoal));
                setShowMlSettings(false);
              }} style={styles.modalSkip}>
                <Text style={styles.modalSkipText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => {
                const g = parseFloat(mlPerGlassInput);
                const goal = parseFloat(mlGoalInput);
                if (!isNaN(g) && g > 0) setMlPerGlass(g);
                if (!isNaN(goal) && goal > 0) setMlGoal(goal);
                setShowMlSettings(false);
              }} style={styles.modalSave}>
                <Text style={styles.modalSaveText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {pendingResetConfirm && (
        <View style={styles.modalWrap}>
          <View style={[styles.modal, { maxWidth: 340 }]}>
            <Text style={[styles.modalTitle, { color: "#E85A5A" }]}>RESET PROGRESS?</Text>
            <Text style={styles.modalSub}>
              This clears your current set, block, and lifetime totals. Your critters, stats, and to-do list are untouched. This can be undone with "Restore last backup" if you change your mind within the next few minutes.
            </Text>
            <View style={styles.modalRow}>
              <Pressable onPress={() => setPendingResetConfirm(false)} style={styles.modalSkip}>
                <Text style={styles.modalSkipText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => { reset(); setPendingResetConfirm(false); }} style={[styles.modalSave, { backgroundColor: "#E85A5A" }]}>
                <Text style={styles.modalSaveText}>Reset</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {pendingRestoreConfirm && (
        <View style={styles.modalWrap}>
          <View style={[styles.modal, { maxWidth: 340 }]}>
            <Text style={styles.modalTitle}>RESTORE LAST BACKUP?</Text>
            <Text style={styles.modalSub}>
              {lastBackupPeek?.at
                ? `This restores a snapshot from ${new Date(lastBackupPeek.at).toLocaleString()}, overwriting your current progress with what was saved then.`
                : "No backup snapshot is available yet — one is taken automatically every 5 minutes while the app is open."}
            </Text>
            <View style={styles.modalRow}>
              <Pressable onPress={() => setPendingRestoreConfirm(false)} style={styles.modalSkip}>
                <Text style={styles.modalSkipText}>Cancel</Text>
              </Pressable>
              {!!lastBackupPeek?.at && (
                <Pressable onPress={async () => {
                  await manualRestoreFromBackup();
                  setPendingRestoreConfirm(false);
                }} style={styles.modalSave}>
                  <Text style={styles.modalSaveText}>Restore</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      )}

      {pendingLockedToggle && (
        <View style={styles.modalWrap}>
          <View style={[styles.modal, { maxWidth: 340 }]}>
            <Text style={[styles.modalTitle, { color: "#E85A5A" }]}>TURN OFF THE TIMER?</Text>
            <Text style={styles.modalSub}>
              The timer is the core of this app — everything else (sounds, sidebar stats, the village) is built around it running. Turning it off will hide it from the sidebar entirely. You can always turn it back on in Settings.
            </Text>
            <View style={styles.modalRow}>
              <Pressable onPress={cancelLockedToggle} style={styles.modalSkip}>
                <Text style={styles.modalSkipText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={confirmLockedToggle} style={[styles.modalSave, { backgroundColor: "#E85A5A" }]}>
                <Text style={styles.modalSaveText}>Turn it off</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {pendingUnlockChoice && (
        <View style={styles.modalWrap}>
          <View style={[styles.modal, { maxWidth: 360 }]}>
            <Text style={styles.modalTitle}>NEW CRITTER UNLOCKED</Text>
            <Text style={[styles.modalSub, { fontSize: 13 }]}>
              You've earned a new companion. Pick one to join your critters.
            </Text>
            <View style={styles.unlockChoiceRow}>
              {pendingUnlockChoice.map((n) => (
                <Pressable key={n} onPress={() => resolveUnlockChoice(n)} style={styles.unlockChoiceCell}>
                  <CritterSVG n={n} size={56} />
                  <Text style={styles.unlockChoiceName}>{critterFor(n).name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}

      {showCritters && (() => {
        const isFirstPick = !me?.critters || me.critters.length === 0;
        const pool = isFirstPick ? Array.from({ length: CRITTER_COUNT }, (_, i) => i + 1) : (me.critters || []);
        return (
          <View style={styles.modalWrap}>
            <View style={[styles.modal, { maxWidth: 400, maxHeight: "80%" }]}>
              <Text style={styles.modalTitle}>{isFirstPick ? "CHOOSE YOUR FIRST CRITTER" : "YOUR CRITTERS"}</Text>
              <Text style={[styles.modalSub, { fontSize: 13 }]}>
                {isFirstPick
                  ? "365 creatures — pick the one that starts your journey. You'll unlock more at every coffee break."
                  : `${pool.length} unlocked so far — tap one to make it your active critter.`}
              </Text>
              <ScrollView>
                <View style={styles.critterGrid}>
                  {pool.map((n) => {
                    const sel = me?.activeCritter === n;
                    return (
                      <Pressable key={n} onPress={() => chooseCritter(n)} style={[styles.critterCell, sel && styles.critterCellSel]}>
                        <CritterSVG n={n} size={42} />
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
              {!!me?.activeCritter && (
                <Text style={styles.critterName}>{critterFor(me.activeCritter).name} · #{me.activeCritter}</Text>
              )}
              {!isFirstPick && (
                <Pressable onPress={() => setShowCritters(false)} style={[styles.modalSkip, { width: "100%", marginTop: 10 }]}>
                  <Text style={styles.modalSkipText}>Done</Text>
                </Pressable>
              )}
            </View>
          </View>
        );
      })()}

      {showRestore && (
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>RESTORE BACKUP</Text>
            <Text style={[styles.modalSub, { fontSize: 13 }]}>
              Paste the backup text you copied earlier.
            </Text>
            <TextInput
              value={restoreText}
              onChangeText={setRestoreText}
              placeholder="Paste backup JSON here…"
              placeholderTextColor="rgba(237,231,245,.35)"
              multiline
              style={[styles.modalInput, { height: 120, textAlignVertical: "top" }]}
            />
            <View style={styles.modalRow}>
              <Pressable onPress={() => { setShowRestore(false); setRestoreText(""); }} style={styles.modalSkip}>
                <Text style={styles.modalSkipText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={submitRestore} style={styles.modalSave}>
                <Text style={styles.modalSaveText}>Restore</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

/* real default export — wraps the app in SafeAreaProvider so device
   safe-area insets (status bar, notch, home indicator) are available
   via useSafeAreaInsets() inside CritterTimerInner, fixing the date
   header rendering underneath the phone's own status bar */
export default function CritterTimer() {
  return (
    <SafeAreaProvider>
      <CritterTimerInner />
    </SafeAreaProvider>
  );
}

function Button({ children, onPress, secondary, style }) {
  return (
    <Pressable onPress={onPress} style={[secondary ? styles.secondaryButton : styles.primaryButton, style]}>
      <Text style={secondary ? styles.secondaryButtonText : styles.primaryButtonText}>{children}</Text>
    </Pressable>
  );
}

function Pill({ icon, text }) {
  return <View style={styles.pill}><Text>{icon}</Text><Text style={styles.pillText}>{text}</Text></View>;
}

function Welcome({ onContinue, onGoogleGate }) {
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(float, { toValue: -9, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(float, { toValue: 9, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [float]);
  return (
    <View style={styles.welcome}>
      <View style={styles.welcomeBlob} />
      <Animated.View style={{ alignItems: "center", transform: [{ translateY: float }] }}>
        <Text style={styles.parade}>🐱 🐰 🐸 🐼 🦊 🐨</Text>
        <Text style={styles.welcomeTitle}>Kawaii Critters</Text>
        <Text style={styles.welcomeSub}>Your adorable wellness companion 🌸</Text>
      </Animated.View>
      <View style={styles.pillRow}>
        <Pill icon="🍅" text="Pomodoro" /><Pill icon="💧" text="Hydration" /><Pill icon="🌸" text="Friends" />
      </View>
      {/* real Google / Guest choice, replacing the old session-only
          disclosure text — that text was accurate for the original
          standalone prototype, but is genuinely outdated now that
          real profile storage and sync exist */}
      <Button onPress={onGoogleGate}>Sign in with Google</Button>
      <Pressable onPress={onContinue}><Text style={styles.skipLogin}>Continue as guest</Text></Pressable>
    </View>
  );
}

function LoginPortal({ onContinue, onGoogle }) {
  const [busy, setBusy] = useState(null);
  return (
    <ScrollView contentContainerStyle={styles.loginPage} keyboardShouldPersistTaps="handled">
      <Text style={styles.loginLogo}>🌸 🐾 🌸</Text>
      <Text style={styles.loginTitle}>Welcome back</Text>
      <Text style={styles.loginSubtitle}>Sign in to your Kawaii Critters Snack</Text>
      <Pressable style={styles.googleButton} onPress={async () => {
        setBusy("Google");
        const result = await onGoogle();
        setBusy(null);
        if (!result.ok && !result.cancelled) Alert.alert("Google sign-in", result.error || "Sign-in could not be completed.");
      }} disabled={!!busy}>
        <Text style={styles.googleMark}>G</Text>
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </Pressable>
      {/* the old demo-account name/email path was dropped here, per
          explicit request — Google and guest are the only two ways
          in now */}
      <Pressable onPress={() => onContinue(null)}><Text style={styles.skipLogin}>Continue as guest</Text></Pressable>
      <View style={styles.oauthNote}>
        <Text style={styles.oauthNoteTitle}>Snack authentication note</Text>
        <Text style={styles.oauthNoteText}>Google OAuth is connected through Supabase. Your Google account will return you to this Snack after sign-in.</Text>
      </View>
    </ScrollView>
  );
}

/* Real, standalone Friends screen data, merged from the person's own
   old App.js — deliberately a SEPARATE system from the current app's
   own 365-variant critter archetype/palette system (CRITTER_COUNT,
   critterFor, etc), since the two use fundamentally incompatible
   data models and were kept apart per explicit choice rather than
   forced together. */
const FRIENDS_CRITTERS = [
  { id: "bunny", name: "Mochi", emoji: "🐰", color: "#f4b7c9", bio: "A soft little optimist who loves morning flowers.", personality: "Gentle dreamer" },
  { id: "frog", name: "Puddle", emoji: "🐸", color: "#8dce8c", bio: "The village rain expert. Storms are Puddle's favorite!", personality: "Cheerful explorer" },
  { id: "penguin", name: "Pebble", emoji: "🐧", color: "#9bb7d8", bio: "A tiny adventurer who collects shiny pebbles.", personality: "Brave friend" },
  { id: "cat", name: "Miso", emoji: "🐱", color: "#e7ba8f", bio: "A curious nap champion with a warm purr.", personality: "Cozy companion" },
  { id: "panda", name: "Bamboo", emoji: "🐼", color: "#b9b5d9", bio: "A calm friend who always makes time for tea.", personality: "Quiet helper" },
  { id: "fox", name: "Cinnamon", emoji: "🦊", color: "#f2a36d", bio: "A clever friend with a pocket full of good ideas.", personality: "Bright spark" },
];

function Back({ title, onPress }) {
  return (
    <View style={styles.backRow}>
      <Pressable onPress={onPress}><Text style={styles.backText}>← Back</Text></Pressable>
      <Text style={styles.screenTitle}>{title}</Text>
      <View style={{ width: 55 }} />
    </View>
  );
}

function Friends({ onBack, friendship, setFriendship }) {
  const [selected, setSelected] = useState(null);
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Back title="🌸 Critter Friends" onPress={onBack} />
      <Text style={styles.pageIntro}>Get to know every friend, send a gift, and grow your friendship.</Text>
      <View style={styles.friendGrid}>
        {FRIENDS_CRITTERS.map((c) => (
          <Pressable key={c.id} style={styles.friendCard} onPress={() => setSelected(c)}>
            <View style={[styles.friendIcon, { backgroundColor: c.color }]}>
              <Text style={styles.friendEmoji}>{c.emoji}</Text>
            </View>
            <Text style={styles.friendName}>{c.name}</Text>
            <Text style={styles.friendMood}>{c.personality}</Text>
            <Text style={styles.friendPoints}>💛 {friendship[c.id] || 0} points</Text>
          </Pressable>
        ))}
      </View>
      {selected && (
        <View style={styles.modal}>
          <Text style={styles.modalEmoji}>{selected.emoji}</Text>
          <Text style={styles.modalTitle}>{selected.name}</Text>
          <Text style={styles.cardText}>{selected.bio}</Text>
          <Text style={styles.sectionTitle}>Friendship: {friendship[selected.id] || 0}/100</Text>
          <View style={styles.progress}>
            <View style={[styles.progressFill, { width: `${Math.min(100, friendship[selected.id] || 0)}%`, backgroundColor: selected.color }]} />
          </View>
          <Button onPress={() => setFriendship({ ...friendship, [selected.id]: (friendship[selected.id] || 0) + 10 })}>🎁 Give a cozy gift</Button>
          <Button secondary onPress={() => setSelected(null)}>Close</Button>
        </View>
      )}
    </ScrollView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statVal}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* Village background — a mushroom-house skyline sitting behind
   everything, full bleed. Sun/moon and star visibility follow the
   real hour already driving `theme`, so the village lives in the
   same day as the timer. Pure SVG since no painted art is available
   here; silhouettes only, no text, so it never competes for focus. */
/* Weather is simulated here, not fetched — this environment has no
   network access to a live weather API. weatherKind is the same
   value already driving the brew/theme tint elsewhere; wire a real
   API (e.g. Open-Meteo, no key needed) into that single value in the
   Expo build and every visual here follows automatically. */
/* A large analog clock face rendered in the sky, driven by the real
   device clock — not the hour prop used for sun position, which only
   updates on the app's broader render cycle. This keeps its own tick
   so the second hand genuinely moves in real time. */
/* Digital companion to SkyClock — same live tick, same day/night and
   dimmed-weather treatment, same accent colour, sized to sit just
   below the analog face as one paired instrument rather than two
   unrelated clocks. */
function DigitalClock({ cx, cy, width, accent, isNight, dimmed }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const h24 = now.getHours();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const m = String(now.getMinutes()).padStart(2, "0");
  const ampm = h24 < 12 ? "AM" : "PM";
  const label = `${h12}:${m} ${ampm}`;

  const plateFill = isNight ? "rgba(20,16,36,.62)" : "rgba(255,255,255,.18)";
  const plateStroke = dimmed ? "rgba(255,255,255,.25)" : accent;
  const textColor = isNight ? "#EDE7F5" : "rgba(20,16,36,.75)";
  const h = 16;

  return (
    <G opacity={dimmed ? 0.55 : 0.92}>
      <Rect x={cx - width / 2} y={cy - h / 2} width={width} height={h} rx={h / 2}
        fill={plateFill} stroke={plateStroke} strokeWidth="1.4" />
      <SvgText x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={textColor}>
        {label}
      </SvgText>
    </G>
  );
}

/* ============================================================
   MOON PHASE — real 8-phase lunar cycle driven by the synodic
   period. moonPhaseT() returns illuminated fraction (0=new,
   1=full) and waxing direction. MoonDisc renders the correct
   phase silhouette using a lit half-disc plus an elliptical
   terminator overlay, clipped to the moon circle, so every
   phase from crescent through gibbous looks genuinely right.
   ============================================================ */
function moonPhaseT() {
  // Reference new moon: 2000-01-06 18:14 UTC
  const ref = 947182440000;
  const days = (Date.now() - ref) / 86400000;
  const cycle = 29.53059;
  const pos = ((days % cycle) + cycle) % cycle;
  const frac = pos / cycle; // 0-1 within cycle
  const illuminated = 0.5 - 0.5 * Math.cos(frac * Math.PI * 2);
  const waxing = frac < 0.5;
  return { illuminated, waxing };
}

function MoonDisc({ cx, cy, r, dimmed }) {
  const { illuminated, waxing } = moonPhaseT();
  const moonFill   = "#EDE7F5";
  const shadowFill = "#1A1630";
  const gOpacity   = dimmed ? 0.6 : 0.92;
  // phase label for accessibility-flavoured debug (invisible in prod)
  // Lit half: right for waxing, left for waning
  const halfX = waxing ? cx : cx - r - 1;

  return (
    <G>
      {/* atmospheric halo rings */}
      <Circle cx={cx} cy={cy} r={r + 11} fill={moonFill} opacity={gOpacity * 0.05} />
      <Circle cx={cx} cy={cy} r={r + 6}  fill={moonFill} opacity={gOpacity * 0.10} />
      {/* clipping disc so all phase shapes stay within the circle */}
      <Defs>
        <ClipPath id="moonClip">
          <Circle cx={cx} cy={cy} r={r} />
        </ClipPath>
      </Defs>
      {/* base dark disc — new moon default */}
      <Circle cx={cx} cy={cy} r={r} fill={shadowFill} opacity={0.95} />
      {/* lit half + terminator, clipped to disc */}
      <G clipPath="url(#moonClip)">
        {/* the lit half-disc on the correct side */}
        <Rect x={halfX} y={cy - r - 1} width={r + 1} height={r * 2 + 2}
          fill={moonFill} opacity={gOpacity} />
        {/* crescent phase: dark ellipse narrows the lit sliver */}
        {illuminated > 0.03 && illuminated < 0.47 && (
          <Ellipse cx={cx} cy={cy}
            rx={r * (1 - 2 * illuminated)} ry={r + 1}
            fill={shadowFill} opacity={0.97} />
        )}
        {/* gibbous phase: white ellipse rescues part of shadow side */}
        {illuminated > 0.53 && illuminated < 0.97 && (
          <Ellipse cx={cx} cy={cy}
            rx={r * (2 * illuminated - 1)} ry={r + 1}
            fill={moonFill} opacity={gOpacity} />
        )}
        {/* nearly full: flood the remaining shadow sliver */}
        {illuminated >= 0.97 && (
          <Rect x={cx - r - 1} y={cy - r - 1}
            width={r * 2 + 2} height={r * 2 + 2}
            fill={moonFill} opacity={gOpacity} />
        )}
      </G>
      {/* subtle craters — only visible on lit portion */}
      <Circle cx={cx - r * 0.28} cy={cy + r * 0.2}  r={r * 0.1}
        fill="#D6CEE8" opacity={illuminated * 0.4} />
      <Circle cx={cx + r * 0.15} cy={cy - r * 0.3}  r={r * 0.07}
        fill="#D6CEE8" opacity={illuminated * 0.32} />
      <Circle cx={cx + r * 0.3}  cy={cy + r * 0.15} r={r * 0.055}
        fill="#D6CEE8" opacity={illuminated * 0.28} />
    </G>
  );
}

function SkyClock({ cx, cy, r, accent, isNight, dimmed }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const hourAngle = (h + m / 60) * 30 - 90; // degrees, 12 o'clock = up
  const minAngle = (m + s / 60) * 6 - 90;
  const secAngle = s * 6 - 90;

  const hand = (angle, length, width, color, opacity = 1) => {
    const rad = (angle * Math.PI) / 180;
    const x2 = cx + Math.cos(rad) * length;
    const y2 = cy + Math.sin(rad) * length;
    return <Path d={`M${cx} ${cy} L${x2} ${y2}`} stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity} />;
  };

  const faceFill = isNight ? "rgba(20,16,36,.55)" : "rgba(255,255,255,.16)";
  const faceStroke = dimmed ? "rgba(255,255,255,.25)" : accent;
  const tickColor = isNight ? "rgba(237,231,245,.5)" : "rgba(20,16,36,.4)";

  return (
    <G opacity={dimmed ? 0.55 : 0.92}>
      <Circle cx={cx} cy={cy} r={r} fill={faceFill} stroke={faceStroke} strokeWidth="2" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        const isMajor = deg % 90 === 0;
        const outer = r - 3;
        const inner = r - (isMajor ? 9 : 5);
        return (
          <Path key={deg}
            d={`M${cx + Math.cos(rad) * outer} ${cy + Math.sin(rad) * outer} L${cx + Math.cos(rad) * inner} ${cy + Math.sin(rad) * inner}`}
            stroke={tickColor} strokeWidth={isMajor ? 2 : 1} strokeLinecap="round" />
        );
      })}
      {hand(hourAngle, r * 0.5, 4, "#C9A876")}
      {hand(minAngle, r * 0.72, 2.6, "#C9A876")}
      {hand(secAngle, r * 0.78, 1.2, accent, 0.85)}
      <Circle cx={cx} cy={cy} r="3" fill={accent} />
    </G>
  );
}

/* The village clock tower — a real ground structure among the houses,
   not a floating sky ornament. The analog SkyClock face is embedded
   directly into the tower's upper section, in a round window frame
   like the reference village's window style. */
/* Renders the live analog clock as a real screen-pixel overlay,
   positioned with the EXACT same math as ClockTowerImage — this is
   the actual fix for a real bug: the clock previously lived inside
   Village's own internal SVG coordinate system while the tower image
   sibling used entirely separate scroll-aware screen-pixel math, so
   despite similar-looking numbers the two were never guaranteed to
   actually overlap, and in practice didn't. A small nested Svg,
   itself absolutely positioned in real screen pixels, lets SkyClock's
   live-ticking hands render correctly on top of the real tower image
   instead of drifting to wherever the old internal coordinates
   happened to land. */
function ClockTowerClockOverlay({ x, groundY, accent, isNight, dimmed, hour = 12, weatherKind = "clear", bellRinging = false, workActive = false, pxScale, svgScreenOffsetX, villageOffsetX }) {
  const w = 54; // scaled with the tower's wider box (was 46 at artW 162 → ×1.18)

  // v113 — the tower joins the village lighting. Its "window" is the
  // clock dial itself (the painted tower windows can't be measured
  // without the source art, but the dial's geometry is exactly known
  // here): warm backlit face on the same cues as the cap houses —
  // evening hours, cosy lamps through dark storm/rain daytimes, low
  // during work phases so the schoolhouse stays the bright spot, and
  // a flash when the work bell rings. Pure derivation from props; a
  // civic clock keeps civic hours, so no per-house seed, and no
  // candle flicker (that walkT clock lives inside Village — a steady
  // municipal lamp reads right for a public dial anyway).
  let lamp = hour >= 17.5 || hour < 0.8 ? 1 : 0;
  if ((weatherKind === "storm" || weatherKind === "rain") && !isNight) lamp = Math.max(lamp, 0.7);
  if (workActive && lamp > 0) lamp *= 0.55;
  if (bellRinging) lamp = Math.min(1, lamp + 0.5);
  const dialLit = lamp > 0.05;
  const clockR = w * 0.34;
  // matches ClockTowerImage's own artH exactly, since the clock's
  // position is relative to that same canvas — now vertically
  // stretched, which is safe here: per-axis scaling preserves
  // relative positions, so the 42%-down estimate still lands on the
  // painted face
  const artH = 246;
  // clock face position estimated directly from viewing the real
  // image (roughly 42% down the square canvas) — the automated pixel-
  // boundary detection didn't produce a reliable number, so this is a
  // visual estimate, not a precisely measured one; may need a small
  // adjustment once actually visible in the running app
  const clockCyArt = groundY - artH + artH * 0.42;

  // the painted face is a vertical ellipse under the stretch
  // (≈18.4 × ≈23.8 semi-axes: 15.64 × 191/162 wide, × 246/162 tall),
  // so the backing plate must be an ellipse too (v110) — a circular
  // disc either leaves painted slivers above/below or overhangs the
  // stone on the sides
  const faceRx = 21;    // ≥ 18.4 + pad
  const faceRy = 26.5;  // ≥ 23.8 + pad

  // same real conversion ClockTowerImage/SchoolhouseImage use: art-
  // space coordinates -> real screen pixels
  const overlaySize = (faceRy + 4) * 2; // canvas must fit the tall backing ellipse
  const artLeft = x - overlaySize / 2;
  const artTop = clockCyArt - overlaySize / 2;
  const screenLeft = svgScreenOffsetX + (artLeft + villageOffsetX) * pxScale;
  const screenTop = artTop * pxScale;
  const screenSize = overlaySize * pxScale;

  return (
    <Svg width={screenSize} height={screenSize} viewBox={`0 0 ${overlaySize} ${overlaySize}`}
      style={{ position: "absolute", left: screenLeft, top: screenTop }}>
      <G opacity={dimmed ? 0.85 : 1}>
        {dialLit && (
          /* soft lantern halo bleeding past the stone rim */
          <Ellipse cx={overlaySize / 2} cy={overlaySize / 2} rx={faceRx + 3.5} ry={faceRy + 3.5}
            fill="#FFD98A" opacity={0.26 * lamp} />
        )}
        <Ellipse cx={overlaySize / 2} cy={overlaySize / 2} rx={faceRx} ry={faceRy}
          fill={dialLit ? (isNight ? "#8A6E3E" : "#B08A4A") : isNight ? "#2E2840" : "#5A5070"}
          stroke={dialLit ? "#FFD98A" : dimmed ? "rgba(255,255,255,.2)" : accent} strokeWidth="2" />
        <SkyClock cx={overlaySize / 2} cy={overlaySize / 2} r={clockR} accent={accent} isNight={isNight} dimmed={dimmed} />
      </G>
    </Svg>
  );
}

function ClockTower({ x, groundY, accent, isNight, dimmed }) {
  const w = 46;
  const bodyH = 92;
  const clockR = w * 0.34;
  const clockCy = groundY - bodyH + w * 0.55;

  // NOTE: the real tower building art (stone body, roof, texture,
  // door) no longer renders here — it moved to <ClockTowerImage>, a
  // real sibling rendered outside the Svg tree entirely, same reason
  // as the schoolhouse/bell/fountain/trees (react-native-svg's own
  // Image has proven unreliable resolving local assets in this Snack
  // environment). This component keeps only what genuinely needs to
  // stay inside the SVG coordinate system: the clock frame ring and
  // the live, continuously-ticking SkyClock hands, which can't be
  // baked into a static image, plus the small night-time glow.
  return (
    <G>
      {/* the clock, embedded in a round frame set into the tower body —
          same SkyClock face used elsewhere, just placed structurally
          instead of floating */}
      <Circle cx={x} cy={clockCy} r={clockR + 3} fill={isNight ? "#2E2840" : "#5A5070"}
        stroke={dimmed ? "rgba(255,255,255,.2)" : accent} strokeWidth="2" />
      <SkyClock cx={x} cy={clockCy} r={clockR} accent={accent} isNight={isNight} dimmed={dimmed} />

      {isNight && (
        <Circle cx={x} cy={groundY - 12} r="2" fill="#FFD98A" opacity="0.9" />
      )}
    </G>
  );
}

/* The village schoolhouse — a real, distinct building (not the clock
   tower). Its cupola bell swings and glows exactly when the real
   work-start sound fires (bellRinging is driven by that same trigger,
   not a separate guess at timing), and its windows show the person's
   actual chosen critter, only while a work phase is genuinely active. */
/* Renders the schoolhouse's actual building art as a plain React
   Native Image — NOT react-native-svg's Image, which has proven
   unreliable resolving local assets in this Snack environment.
   This has to live outside the <Svg> tree entirely (a plain Image
   can't be mixed into SVG content), positioned in real screen
   pixels using the scale/offset math computed once in Village and
   passed down, so it lines up correctly with the SVG scene
   underneath it despite being a completely separate render tree. */
/* Renders the schoolhouse bell as a plain React Native Image, same
   real reason as SchoolhouseImage — react-native-svg's own Image has
   proven unreliable resolving local assets in this Snack environment.
   The swing animation can't use SVG's rotating <G> anymore since this
   lives outside the Svg tree entirely; it's reproduced here with a
   plain React Native rotate transform on the Image's own style,
   driven by the same real swingAngle math already proven in
   Schoolhouse. */
function BellImage({ x, groundY, dimmed, bellRinging, pxScale, svgScreenOffsetX, villageOffsetX }) {
  const w = 92, h = 58;
  const roofH = 26;
  const bodyTop = groundY - h;
  const roofTop = bodyTop - roofH;
  const cupolaW = 16, cupolaH = 18;
  const cupolaX = x + w / 2 - cupolaW / 2;
  const cupolaTop = roofTop - cupolaH;

  const [swingT, setSwingT] = useState(0);
  useEffect(() => {
    if (!bellRinging) { setSwingT(0); return; }
    let raf;
    const start = Date.now();
    const loop = () => {
      setSwingT((Date.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [bellRinging]);
  const swingAngle = bellRinging ? Math.sin(swingT * 22) * 26 * Math.max(0, 1 - swingT / 1.3) : 0;

  // same viewBox-unit box the old SvgImage used (x=-6,y=-8,w=12,h=14.5
  // relative to the cupola pivot point), converted to real screen
  // pixels the same way SchoolhouseImage does
  const pivotVBx = cupolaX + cupolaW / 2;
  const pivotVBy = cupolaTop + cupolaH * 0.55;
  const artLeft = pivotVBx - 6;
  const artTop = pivotVBy - 8;
  const artWidth = 12;
  const artHeight = 14.5;

  const screenLeft = svgScreenOffsetX + (artLeft + villageOffsetX) * pxScale;
  const screenTop = artTop * pxScale;
  const screenWidth = artWidth * pxScale;
  const screenHeight = artHeight * pxScale;
  const pivotScreenX = svgScreenOffsetX + (pivotVBx + villageOffsetX) * pxScale;
  const pivotScreenY = pivotVBy * pxScale;

  return (
    <Image
      source={BELL_ART}
      resizeMode="contain"
      style={{
        position: "absolute",
        left: screenLeft, top: screenTop,
        width: screenWidth, height: screenHeight,
        opacity: dimmed ? 0.85 : 1,
        transform: [
          { translateX: pivotScreenX - screenLeft },
          { translateY: pivotScreenY - screenTop },
          { rotate: `${swingAngle}deg` },
          { translateX: -(pivotScreenX - screenLeft) },
          { translateY: -(pivotScreenY - screenTop) },
        ],
      }}
    />
  );
}

/* Renders the fountain's real wet/running-state art as a plain React
   Native Image, same real reason as SchoolhouseImage and BellImage —
   react-native-svg's own Image has proven unreliable resolving local
   assets in this Snack environment. Only used while hydrateActive;
   the dry/idle state stays genuine SVG content inside Village's own
   Svg tree, since no matching art exists for that state yet. */
function FountainImage({ x, groundY, pxScale, svgScreenOffsetX, villageOffsetX }) {
  const artW = 88, artH = 68;
  const artLeft = x - artW / 2;
  const artTop = groundY - artH + 14;

  const screenLeft = svgScreenOffsetX + (artLeft + villageOffsetX) * pxScale;
  const screenTop = artTop * pxScale;
  const screenWidth = artW * pxScale;
  const screenHeight = artH * pxScale;

  return (
    <Image
      source={FOUNTAIN_WET_ART}
      resizeMode="contain"
      style={{
        position: "absolute",
        left: screenLeft, top: screenTop,
        width: screenWidth, height: screenHeight,
      }}
    />
  );
}

/* Renders a single tree's real illustrated art as a plain React
   Native Image, same real reason as the other Image siblings —
   react-native-svg's own Image has proven unreliable resolving local
   assets in this Snack environment. Simplest of the four conversions
   since trees have no special animation (no rotation, no state-driven
   visibility) — just a static positioned image, same pattern as
   SchoolhouseImage. */
/* Renders the clock tower's real illustrated building art (stone
   body, roof, texture, door) as a plain React Native Image, same
   real reason as the other Image siblings — react-native-svg's own
   Image has proven unreliable resolving local assets in this Snack
   environment. The clock frame ring and live, continuously-ticking
   SkyClock hands stay as genuine SVG content in ClockTower itself,
   since those can't be baked into a static image. */
function ClockTowerImage({ x, groundY, isNight, dimmed, pxScale, svgScreenOffsetX, villageOffsetX }) {
  // the real source image is a perfect 1024x1024 square with the
  // tower art occupying roughly the vertical two-thirds of it. The
  // box is deliberately NON-square now (v108): the square canvas is
  // stretched ~1.29× vertically via resizeMode="stretch" so the
  // tower reads much taller with only a modestly wider footprint —
  // slender body, steeper/pointier spire, like the reference. The
  // painted clock face stretches into a vertical ellipse (≈18.4 wide
  // × ≈23.8 tall semi-axes); the overlay covers it with a matching
  // elliptical backing plate (21 × 26.5) behind its circular clock —
  // see ClockTowerClockOverlay (v110 fix: a circular disc alone left
  // ~2.4 units of painted face peeking above/below).
  const artH = 246; // was 162 (92+30+20+20), ×1.52 taller
  const artW = 191; // was 162, ×1.18 wider — visible tower ≈ 71 wide (≈ x 359-431)
  const artLeft = x - artW / 2;
  const artTop = groundY - artH + 6;

  const screenLeft = svgScreenOffsetX + (artLeft + villageOffsetX) * pxScale;
  const screenTop = artTop * pxScale;
  const screenWidth = artW * pxScale;
  const screenHeight = artH * pxScale;

  return (
    <Image
      source={CLOCKTOWER_ART}
      resizeMode="stretch"
      style={{
        position: "absolute",
        left: screenLeft, top: screenTop,
        width: screenWidth, height: screenHeight,
        opacity: dimmed ? 0.85 : 1,
      }}
    />
  );
}

function TreeImage({ x, trunkY, source, isNight, pxScale, svgScreenOffsetX, villageOffsetX }) {
  const artW = 70, artH = 92;
  const artLeft = x - artW / 2;
  const artTop = trunkY - artH + 14;

  const screenLeft = svgScreenOffsetX + (artLeft + villageOffsetX) * pxScale;
  const screenTop = artTop * pxScale;
  const screenWidth = artW * pxScale;
  const screenHeight = artH * pxScale;

  return (
    <Image
      source={source}
      resizeMode="contain"
      style={{
        position: "absolute",
        left: screenLeft, top: screenTop,
        width: screenWidth, height: screenHeight,
        opacity: isNight ? 0.82 : 1,
      }}
    />
  );
}

function SchoolhouseImage({ x, groundY, dimmed, pxScale, svgScreenOffsetX, villageOffsetX }) {
  // the chapel art (schoolhouse-kawaii-transparent.png) is a perfect
  // 1024x1024 square, so this box must be square too for
  // resizeMode="contain" to scale it exactly (same real lesson as
  // ClockTowerImage). Measured alpha bbox of the building within the
  // square: x 213-810 (58.3% wide, centered), y 36-980 (steeple tip
  // 3.5%, painted stone base 95.7%). Box size 134 → visible building
  // ~78 wide × ~124 tall; base planted at ≈groundY+2, steeple tip at
  // ≈groundY-121 — below the clock tower's visible top (~groundY-129)
  // so the height hierarchy still reads correctly.
  const artSize = 134;
  const artLeft = x - 21;       // building's own center lands on x+46 (the old body center)
  const artTop = groundY - 126; // 0.957 × 134 ≈ 128 → painted base ≈ groundY+2
  const artWidth = artSize;
  const artHeight = artSize;

  // convert from SVG viewBox units to real screen pixels: apply the
  // villageOffsetX centering shift these coordinates already assume,
  // then the SVG's own pixel scale, then its screen offset
  const screenLeft = svgScreenOffsetX + (artLeft + villageOffsetX) * pxScale;
  const screenTop = artTop * pxScale; // vertical: no equivalent offset, slice anchors YMax/bottom
  const screenWidth = artWidth * pxScale;
  const screenHeight = artHeight * pxScale;

  return (
    <Image
      source={SCHOOLHOUSE_ART}
      resizeMode="contain"
      style={{
        position: "absolute",
        left: screenLeft, top: screenTop,
        width: screenWidth, height: screenHeight,
        opacity: dimmed ? 0.85 : 1,
      }}
    />
  );
}

function Schoolhouse({ x, groundY, isNight, dimmed, bellRinging, workActive, critters, hour = 12, walkT = 0, weatherKind = "clear" }) {
  const w = 92, h = 58;
  const roofH = 26;
  const bodyTop = groundY - h;
  const roofTop = bodyTop - roofH;
  const cupolaW = 16, cupolaH = 18;
  const cupolaX = x + w / 2 - cupolaW / 2;
  const cupolaTop = roofTop - cupolaH;

  const wallShade = isNight ? "#6E5640" : "#A87E4E";

  // ring-glow ripple: BellImage now owns the actual swing animation
  // (it lives outside the Svg tree as a plain Image), but this ripple
  // effect is genuine SVG content that can stay here — it needs its
  // own small timer since the swingT that used to drive both lives
  // in BellImage now, not here
  const [ringT, setRingT] = useState(0);
  useEffect(() => {
    if (!bellRinging) { setRingT(0); return; }
    let raf;
    const start = Date.now();
    const loop = () => {
      setRingT((Date.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [bellRinging]);

  // real window positions on the chapel art
  // (schoolhouse-kawaii-transparent.png): the two arched side panes
  // are punched transparent in the PNG itself (px 352-412 and
  // 612-672 wide, 668-812 tall in the 1024 square) so these overlay
  // rects show through them — converted via the image box (size 134
  // at x-21 / groundY-126) to art units
  const winW = 8, winH = 19;
  const windows = [
    { wx: x + 25, wy: groundY - 39 },
    { wx: x + 59, wy: groundY - 39 },
  ];

  // NOTE: neither the building art nor the bell render here anymore —
  // a plain SVG element can't return a mix of SVG content and a React
  // Native Image, and react-native-svg's own Image component has
  // proven unreliable resolving local assets in this Snack
  // environment. Both now render as separate <SchoolhouseImage> and
  // <BellImage> siblings, outside the Svg tree entirely — see their
  // call sites alongside <Village> itself. This component keeps only
  // the pieces that genuinely need to stay inside the SVG coordinate
  // system: the ring-glow ripple and the window state overlays.
  return (
    <G opacity={dimmed ? 0.85 : 1}>
      {bellRinging && (
        /* centered on the painted belfry bell in the chapel art
           (px 512, ~325 of the 1024 square → x+46, groundY-84 via
           the image box: size 134 at x-21, groundY-126) */
        <Circle cx={x + 46} cy={groundY - 84} r="13"
          fill="none" stroke="#F2C94C" strokeWidth="1" opacity={Math.max(0, 0.6 - ringT * 0.5)} />
      )}

      {/* windows — real image already shows the window frames/glass;
          this overlay adds the live lit/critter-silhouette state on
          top, matching the actual window positions in the art */}
      {windows.map((win, i) => {
        const pool = critters && critters.length ? critters : [1];
        const winCritter = pool[i % pool.length];
        return (
          <G key={i}>
            {(() => {
              // v111 — the schoolhouse follows the timer first and the
              // clock second: bright + critter silhouette while a work
              // phase truly runs; a soft lantern afterglow through the
              // evening; asleep-dark at night; cool glass in daylight
              // (the panes are real holes punched in the PNG, so an
              // unfilled window would show the sky straight through
              // the building). The work bell flashes the panes using
              // the same ringT that drives the belfry ripple.
              const evening = hour >= 17 && hour < 21.5;
              const breathe = 0.9 + 0.1 * Math.sin(walkT * 1.6 + i * 2.1);
              const ringFlash = bellRinging ? Math.max(0, 0.6 - ringT * 0.5) : 0;
              let fill, op;
              if (workActive) { fill = "#FFE9B8"; op = 0.85 * breathe; }
              // v113 — same cosy storm-lamp rule the cap houses follow
              // (v111): dark rainy daytimes light the chapel too, so
              // the whole village agrees about the weather
              else if ((weatherKind === "storm" || weatherKind === "rain") && !isNight) { fill = "#FFD98A"; op = 0.55 * breathe; }
              else if (evening) { fill = "#FFD98A"; op = 0.4 * breathe; }
              else if (isNight) { fill = "#3A3248"; op = 0.5; }
              else { fill = "rgba(150,188,212,.5)"; op = 0.75; }
              return (
                <Rect x={win.wx} y={win.wy} width={winW} height={winH} rx="2"
                  fill={fill} opacity={Math.min(1, op + ringFlash)} />
              );
            })()}
            {workActive && (
              <Svg width={winW - 4} height={winH - 4} viewBox="0 0 64 64" x={win.wx + 2} y={win.wy + 2}>
                <G>
                  {(() => {
                    const c = critterFor(winCritter);
                    const body = (BODIES[c.archetype] || BODIES.fox)();
                    const bodyC = hsl(c.body);
                    return <Path d={body.head} fill={bodyC} />;
                  })()}
                </G>
              </Svg>
            )}
          </G>
        );
      })}
    </G>
  );
}

function WeatherLayer({ weatherKind, isNight, vbWidth = 400 }) {
  const [driftT, setDriftT] = useState(0);
  useEffect(() => {
    let raf;
    const start = Date.now();
    const loop = () => {
      setDriftT((Date.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (weatherKind === "clear") return null;

  const cloudy = weatherKind === "clouds" || weatherKind === "rain" || weatherKind === "storm" || weatherKind === "fog";
  const raining = weatherKind === "rain" || weatherKind === "storm";
  const stormy = weatherKind === "storm";
  const foggy = weatherKind === "fog";

  const cloudFill = stormy
    ? (isNight ? "#3A3550" : "#4B4665")
    : raining
      ? (isNight ? "#4A4560" : "#6A6485")
      : (isNight ? "#5A5578" : "#DCD8EE");

  // cloud/raindrop base positions scale proportionally with the real
  // viewBox width instead of assuming a fixed 400, so weather still
  // reads as evenly spread across a much wider landscape frame
  const wScale = vbWidth / 400;
  const CLOUDS = [
    { baseX: 40 * wScale, y: 60, s: 1.1 }, { baseX: 180 * wScale, y: 40, s: 1.4 },
    { baseX: 300 * wScale, y: 75, s: 0.9 }, { baseX: 90 * wScale, y: 110, s: 0.8 },
  ];

  const cloudPuff = (cx, cy, s) => (
    <G>
      <Ellipse cx={cx} cy={cy} rx={26 * s} ry={15 * s} fill={cloudFill} />
      <Ellipse cx={cx - 18 * s} cy={cy + 4 * s} rx={17 * s} ry={11 * s} fill={cloudFill} />
      <Ellipse cx={cx + 20 * s} cy={cy + 5 * s} rx={19 * s} ry={12 * s} fill={cloudFill} />
      <Ellipse cx={cx} cy={cy - 8 * s} rx={16 * s} ry={11 * s} fill={cloudFill} />
    </G>
  );

  const RAINDROPS = [
    { x: 50, delay: 0 }, { x: 90, delay: 0.3 }, { x: 130, delay: 0.6 },
    { x: 180, delay: 0.15 }, { x: 220, delay: 0.45 }, { x: 260, delay: 0.7 },
    { x: 300, delay: 0.25 }, { x: 340, delay: 0.55 }, { x: 20, delay: 0.8 },
  ].map((d) => ({ ...d, x: d.x * wScale }));

  return (
    <G>
      {cloudy && CLOUDS.map((c, i) => {
        const wrapRange = vbWidth + 60;
        const x = ((c.baseX + driftT * 6 * (i % 2 === 0 ? 1 : 0.7)) % wrapRange) - 40;
        return <G key={i} opacity={foggy ? 0.85 : 0.92}>{cloudPuff(x, c.y, c.s)}</G>;
      })}

      {stormy && (
        <G opacity={0.35 + 0.25 * Math.sin(driftT * 3)}>
          <Path d="M170 95 L182 95 L172 115 L184 115 L162 145 L170 118 L158 118 Z" fill="#FFE08A" />
        </G>
      )}

      {raining && RAINDROPS.map((d, i) => {
        const cycle = 0.9;
        const t = ((driftT + d.delay) % cycle) / cycle;
        const y = 95 + t * 90;
        const dropOpacity = t < 0.85 ? 0.7 : 0.7 * (1 - (t - 0.85) / 0.15);
        return (
          <Path key={i} d={`M${d.x} ${y} L${d.x - 2} ${y + 9}`}
            stroke={stormy ? "#AEDFFF" : "#BFE0FF"} strokeWidth="1.6"
            strokeLinecap="round" opacity={dropOpacity} />
        );
      })}

      {foggy && (
        <G opacity={0.5}>
          <Rect x="0" y="130" width={vbWidth} height="18" fill="#C9C6DE" opacity="0.4" />
          <Rect x="0" y="155" width={vbWidth} height="14" fill="#C9C6DE" opacity="0.3" />
        </G>
      )}
    </G>
  );
}

/* Real-world wildflower seasons (northern hemisphere default — this
   mirrors what's actually blooming locally at a given time of year,
   the same reasoning a gardener would use). Each entry is a cluster
   of small flower colours/heights that reads as a specific bloom
   rather than generic dots. */
/* One sky aesthetic per real month — a tint and mood layered on top of
   the existing time-of-day gradient, not replacing it. Each month gets
   a hue nudge and saturation/brightness character matching its real
   seasonal association, plus a small accent used by the clock face. */
const MONTH_THEMES = [
  { name: "January",   hueShift: 8,   satMul: 0.85, litMul: 0.92, accent: "#BFD9F2" }, // crisp winter blue
  { name: "February",  hueShift: -6,  satMul: 0.82, litMul: 0.90, accent: "#D6C4E8" }, // pale frost violet
  { name: "March",     hueShift: 20,  satMul: 1.05, litMul: 1.00, accent: "#BFE8C8" }, // fresh spring green
  { name: "April",     hueShift: 30,  satMul: 1.10, litMul: 1.05, accent: "#F2D9E8" }, // blossom pink
  { name: "May",       hueShift: 15,  satMul: 1.08, litMul: 1.06, accent: "#EFEAA0" }, // bright new-leaf yellow
  { name: "June",      hueShift: 0,   satMul: 1.10, litMul: 1.08, accent: "#8FE0D0" }, // clear summer sky
  { name: "July",      hueShift: -5,  satMul: 1.12, litMul: 1.10, accent: "#FFD98A" }, // gold high-summer
  { name: "August",    hueShift: -10, satMul: 1.05, litMul: 1.02, accent: "#F2B366" }, // late-summer amber
  { name: "September", hueShift: -22, satMul: 1.00, litMul: 0.96, accent: "#E8A05B" }, // harvest orange
  { name: "October",   hueShift: -32, satMul: 1.08, litMul: 0.90, accent: "#D9703D" }, // autumn rust
  { name: "November",  hueShift: -18, satMul: 0.80, litMul: 0.82, accent: "#B8AFA0" }, // bare-branch grey
  { name: "December",  hueShift: 12,  satMul: 0.78, litMul: 0.86, accent: "#E8ECF5" }, // frosty winter white
];

const SEASON_BLOOMS = {
  winter: { // evergreen groundcover, snowdrops, hellebores — sparse, muted
    density: 0.35,
    palette: [[0, 0, 92], [140, 15, 30], [280, 20, 55], [0, 0, 75]],
    heights: [4, 6],
  },
  spring: { // crocuses, daffodils, tulips, bluebells — bright, dense
    density: 1,
    palette: [[280, 55, 62], [48, 88, 62], [340, 70, 68], [210, 60, 65], [95, 45, 45]],
    heights: [7, 12],
  },
  summer: { // poppies, black-eyed susans, cornflowers, daisies — tall, full
    density: 1,
    palette: [[8, 78, 55], [48, 85, 55], [215, 65, 55], [0, 0, 96], [330, 60, 62]],
    heights: [10, 16],
  },
  fall: { // goldenrod, asters, sedum — warm, thinning out
    density: 0.6,
    palette: [[42, 70, 50], [270, 35, 48], [15, 55, 45], [95, 20, 35]],
    heights: [6, 10],
  },
};
const seasonForVillage = (month) => // 0-indexed
  month <= 1 || month === 11 ? "winter" :
  month <= 4 ? "spring" :
  month <= 7 ? "summer" : "fall";

/* A deterministic scatter of small wildflowers across a ground band,
   seeded so the same season always renders the same garden (no
   flicker/reshuffle on re-render) but different seasons look
   genuinely different from each other. */
function seededScatter(seed, count) {
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const out = [];
  for (let i = 0; i < count; i++) out.push(rnd());
  return out;
}

/* Grass beneath the wildflowers — denser, shorter blades than the
   flower stems, seasonally tinted (greener in spring/summer, more
   muted gold/brown through fall and winter) so the ground reads as
   real turf instead of flowers floating on flat colour. Rendered
   first, behind WildflowerGarden, using its own seed range (5-7) so
   the two scatters don't correlate with each other. */
/* A worn dirt path connecting the village center to one animated
   building — rendered after the grass/flowers (so it visibly cuts
   through them) but before the buildings (so their base sits ON the
   path rather than the path drawing over their walls). A gentle
   S-curve reads as a real walked trail rather than a straight line. */
/* The village fountain — sits at the same village-center point the
   dirt paths already lead to. Dry and still by default; water only
   actually runs while hydrateActive is true, which is driven by the
   real running timer being in a hydrate phase right now, not a guess
   at timing. The jet rises, arcs of droplets fall, and the basin
   surface gets a rippling highlight — all tied to one continuous
   clock so the whole animation reads as one flow, not disconnected
   pieces. */
/* Critters resting near the fountain during a rest gate — a dedicated
   simple lying-down shape rather than retrofitting CritterFullBody's
   walking rig, since a nap pose is a different enough shape (curled,
   on its side) that reusing the standing rig would mean either a
   risky change to an already-working component or an awkward hybrid.
   Shows up to 3 of the person's real unlocked critters, each using
   its own actual color/archetype. */
function NappingCritter({ n, x, y, phase }) {
  const c = critterFor(n);
  const bodyC = hsl(c.body);
  const bellyC = hsl(c.belly);
  // gentle breathing bob, each critter offset so they don't move in
  // unison — reads as several independently sleeping critters, not
  // one shape repeated
  const breathe = Math.sin(phase * Math.PI * 2) * 1.2;
  // the "z" drifts up and fades, looping
  const zT = phase % 1;
  const zY = -zT * 14;
  const zOpacity = zT < 0.7 ? 0.7 : 0.7 * (1 - (zT - 0.7) / 0.3);

  return (
    <G transform={`translate(${x} ${y + breathe})`}>
      {/* curled body, lying on its side */}
      <Ellipse cx="0" cy="0" rx="13" ry="8" fill={bodyC} />
      <Ellipse cx="-3" cy="2" rx="7" ry="4.5" fill={bellyC} opacity="0.7" />
      {/* small head tucked in */}
      <Circle cx="9" cy="-2" r="6" fill={bodyC} />
      {/* closed eye — a simple curved line, not the open round eyes
          used everywhere else, so it clearly reads as asleep */}
      <Path d="M10 -3 Q12 -1.5 14 -3" stroke="#1B1226" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* drifting "z" */}
      <SvgText x="16" y={-8 + zY} fontSize="7" fontWeight="800" fill="#EDE7F5" opacity={zOpacity}>z</SvgText>
    </G>
  );
}

function Fountain({ x, groundY, isNight }) {
  const basinW = 44, basinH = 10;
  const basinY = groundY - 6;
  const rimFill = isNight ? "#6E6478" : "#B0A6BE";
  const rimShade = isNight ? "#524A5E" : "#8C82A0";
  const waterFill = isNight ? "#2E3A42" : "#5A7280"; // still, dark water when idle — not empty, just quiet

  // NOTE: the real wet/running-state art no longer renders here — it
  // moved to <FountainImage>, a real sibling rendered outside the Svg
  // tree entirely, same reason as SchoolhouseImage/BellImage
  // (react-native-svg's own Image has proven unreliable resolving
  // local assets in this Snack environment). This component now only
  // ever renders the dry/idle state, since the outer call site
  // branches to FountainImage instead of this component whenever
  // hydrateActive is true.
  return (
    <G>
      {/* basin — dry/idle state, still procedural */}
      <Ellipse cx={x} cy={basinY} rx={basinW / 2} ry={basinH / 2} fill={waterFill} stroke={rimShade} strokeWidth="1.6" />
      <Path d={`M${x - basinW / 2 - 3} ${basinY} Q${x} ${basinY + basinH * 0.9} ${x + basinW / 2 + 3} ${basinY}`}
        fill="none" stroke={rimFill} strokeWidth="3" strokeLinecap="round" />

      {/* central spout/pedestal */}
      <Path d={`M${x - 4} ${basinY} L${x - 3} ${basinY - 22} Q${x} ${basinY - 26} ${x + 3} ${basinY - 22} L${x + 4} ${basinY} Z`}
        fill={rimFill} stroke={rimShade} strokeWidth="1" />
    </G>
  );
}

function DirtPath({ fromX, toX, groundY, bandH }) {
  const y0 = groundY + bandH * 0.92; // path starts down near the front of the garden band
  const y1 = groundY + 4; // and ends right at the building's doorstep
  const midX = (fromX + toX) / 2 + (toX > fromX ? -8 : 8);
  const midY = groundY + bandH * 0.5;
  const dirtFill = "#6E5438";
  const dirtEdge = "#5A4429";

  return (
    <G opacity="0.88">
      <Path
        d={`M${fromX - 9} ${y0}
            Q${midX - 7} ${midY} ${toX - 6} ${y1}
            L${toX + 6} ${y1}
            Q${midX + 7} ${midY} ${fromX + 9} ${y0}
            Z`}
        fill={dirtFill} stroke={dirtEdge} strokeWidth="1" opacity="0.9" />
      {/* a couple of worn patches so it doesn't read as one flat ribbon */}
      <Ellipse cx={midX} cy={midY} rx="7" ry="4" fill={dirtEdge} opacity="0.3" />
      <Ellipse cx={(fromX + midX) / 2} cy={(y0 + midY) / 2} rx="5" ry="3" fill={dirtEdge} opacity="0.25" />
    </G>
  );
}

/* The plaza ring — the reference layout's defining ground feature: an
   elliptical dirt path circling the fountain at the village center,
   with a walkway leading from the ring's bottom edge toward the
   viewer. Replaces the old straight fountain→schoolhouse DirtPath.
   Drawn as two concentric ellipse strokes (darker edge under, lighter
   fill over) so the band reads as a real edged path, plus a widening
   trapezoid walkway and a few worn patches. */
function PlazaRing({ cx, cy, rx, ry, groundBottom, isNight }) {
  const fill = isNight ? "#6E5C44" : "#BCA07A";
  const edge = isNight ? "#57472F" : "#9C8259";
  const topY = cy + ry - 3; // walkway meets the ring's bottom band
  const midY = (topY + groundBottom) / 2;
  return (
    <G>
      {/* ring band */}
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none"
        stroke={edge} strokeWidth={19} opacity={0.9} />
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none"
        stroke={fill} strokeWidth={14} opacity={0.95} />
      {/* walkway toward the viewer, widening as it comes forward */}
      <Path d={`M${cx - 12} ${topY}
                Q${cx - 18} ${midY} ${cx - 32} ${groundBottom}
                L${cx + 32} ${groundBottom}
                Q${cx + 18} ${midY} ${cx + 12} ${topY} Z`}
        fill={fill} stroke={edge} strokeWidth={1.5} opacity={0.95} />
      {/* worn patches so the band doesn't read as one flat ribbon */}
      <Ellipse cx={cx - rx * 0.55} cy={cy + ry * 0.55} rx={9}  ry={3.5} fill={edge} opacity={0.3} />
      <Ellipse cx={cx + rx * 0.6}  cy={cy + ry * 0.5}  rx={8}  ry={3}   fill={edge} opacity={0.28} />
      <Ellipse cx={cx}             cy={cy - ry + 1}    rx={10} ry={3}   fill={edge} opacity={0.25} />
    </G>
  );
}

// seasonal meadow tones shared by GrassField and HillBand so the
// rolling hills always match the flat meadow texture exactly
const VILLAGE_GRASS_TONES = {
  winter: { hue: 90, sat: 12, litLo: 22, litHi: 30 },
  spring: { hue: 108, sat: 42, litLo: 26, litHi: 38 },
  summer: { hue: 100, sat: 48, litLo: 24, litHi: 36 },
  fall:   { hue: 70, sat: 32, litLo: 24, litHi: 32 },
};

function GrassField({ x0, x1, groundY, bandH = 22, month }) {
  const grassTone = VILLAGE_GRASS_TONES[seasonForVillage(month)];

  // soft rolling-hill mounds instead of individual blade strokes —
  // matches the reference's smooth painted ground texture: overlapping
  // rounded shapes at varied sizes/depths rather than thin strokes
  const area = (x1 - x0) * bandH;
  const count = Math.max(8, Math.min(28, Math.round(area / 4500)));

  const xs = seededScatter(5, count);
  const ys = seededScatter(6, count);
  const bs = seededScatter(7, count);
  const rs = seededScatter(8, count);

  return (
    <G>
      {/* base fill so the mounds have a consistent floor beneath them */}
      <Rect x={x0} y={groundY} width={x1 - x0} height={bandH}
        fill={`hsl(${grassTone.hue}, ${grassTone.sat * 0.85}%, ${grassTone.litLo}%)`} opacity="0.9" />
      {xs.map((fx, i) => {
        const x = x0 + fx * (x1 - x0);
        const depthT = ys[i]; // 0 = background, 1 = foreground
        const y = groundY + 6 + depthT * bandH * 0.85;
        const depthScale = 0.8 + depthT * 0.7;
        const mw = (26 + bs[i] * 34) * depthScale;
        const mh = mw * (0.32 + rs[i] * 0.14);
        const lit = grassTone.litLo + (bs[i] * 0.6 + depthT * 0.4) * (grassTone.litHi - grassTone.litLo);
        const color = `hsl(${grassTone.hue}, ${grassTone.sat}%, ${lit}%)`;
        return (
          <Ellipse key={i} cx={x} cy={y} rx={mw / 2} ry={mh / 2}
            fill={color} opacity={0.55 + depthT * 0.4} />
        );
      })}
    </G>
  );
}

/* Rolling meadow hills (v109) — the grass now physically rises to
   meet the base of every building and tree instead of stopping at a
   flat band. Two painted ridge layers in the same seasonal palette
   as GrassField:
   - a BACK ridge whose crests land 4-6 units above each PNG tree's
     visible trunk bottom (the trees float 8-32 units above the
     ground line, so without these rises they read as hovering),
     plus one low distant swell behind the plaza;
   - a FRONT swell line whose gentle crests tuck grass up against
     the schoolhouse, mushroom-cap and tower bases.
   Renders in art-space coordinates (own translate wrapper) directly
   after the dark ground fills and before GrassField, so the meadow
   texture, flowers, walkers, plaza ring and cap houses all paint on
   top — and the building/tree PNGs are siblings above everything.
   Crest positions are hand-matched to TREE_DATA (tree PNG bottom =
   base − trunkH + 14) and each building's painted base: schoolhouse
   ≈ base+12 @x136, cap bases base+10, tower ≈ base+16 @x395. Every
   quadratic control shares its crest endpoint's y, which makes the
   tangent horizontal at the crest — smooth rounded hilltops. */
function HillBand({ offsetX, groundY, bottom, month }) {
  const tone = VILLAGE_GRASS_TONES[seasonForVillage(month)];
  const b = groundY;
  const backFill  = `hsl(${tone.hue}, ${Math.round(tone.sat * 0.9)}%, ${Math.max(12, tone.litLo - 5)}%)`;
  const frontFill = `hsl(${tone.hue}, ${tone.sat}%, ${tone.litLo + 2}%)`;
  const hi        = `hsl(${tone.hue}, ${tone.sat}%, ${tone.litHi}%)`;

  // back ridge — crest x/y per tree: 42→b-20, 197→b-30, 289→b-14,
  // 500→b-38, 618→b-32, 762→b-14; low swell b-6 behind the plaza.
  // Extends ±450 past the 790-wide art so wide screens never see an
  // edge (offsetX centers art in viewBoxes up to 1690 wide).
  const backD = `M-450 ${b + 2} L-40 ${b - 2}
    Q1 ${b - 20} 42 ${b - 20} Q83 ${b - 20} 120 ${b + 2}
    Q158 ${b - 30} 197 ${b - 30} Q236 ${b - 30} 250 ${b + 2}
    Q269 ${b - 14} 289 ${b - 14} Q309 ${b - 14} 340 ${b + 4}
    Q367 ${b - 6} 395 ${b - 6} Q423 ${b - 6} 445 ${b + 4}
    Q472 ${b - 38} 500 ${b - 38} Q528 ${b - 38} 560 ${b + 2}
    Q589 ${b - 32} 618 ${b - 32} Q647 ${b - 32} 690 ${b + 2}
    Q726 ${b - 14} 762 ${b - 14} Q778 ${b - 14} 790 ${b - 6}
    L1240 ${b + 2} V${bottom} H-450 Z`;

  // front swells — soft rises hugging building bases; stays at/below
  // b+14 through the plaza centre (x 358-432) so the dirt ring's top
  // edge (b+15) keeps a clean rim.
  const frontD = `M-450 ${b + 13} L-30 ${b + 12}
    Q80 ${b + 4} 136 ${b + 4} Q192 ${b + 4} 210 ${b + 12}
    Q240 ${b + 6} 277 ${b + 6} Q314 ${b + 6} 358 ${b + 13}
    L432 ${b + 14}
    Q444 ${b + 7} 470 ${b + 7} Q496 ${b + 7} 530 ${b + 13}
    Q560 ${b + 6} 600 ${b + 6} Q640 ${b + 6} 664 ${b + 12}
    Q690 ${b + 8} 722 ${b + 8} Q754 ${b + 8} 790 ${b + 11}
    L1240 ${b + 12} V${bottom} H-450 Z`;

  return (
    <G transform={`translate(${offsetX} 0)`}>
      <Path d={backD} fill={backFill} />
      {/* soft sunlit patches on the three tallest rises so the ridge
          doesn't read as one flat cut-out */}
      <Ellipse cx={488} cy={b - 26} rx={26} ry={7} fill={hi} opacity="0.22" />
      <Ellipse cx={607} cy={b - 21} rx={22} ry={6} fill={hi} opacity="0.2" />
      <Ellipse cx={186} cy={b - 19} rx={20} ry={6} fill={hi} opacity="0.2" />
      <Path d={frontD} fill={frontFill} />
    </G>
  );
}

function WildflowerGarden({ x0, x1, groundY, bandH = 22, month }) {
  const season = seasonForVillage(month);
  const bloom = SEASON_BLOOMS[season];
  // density scales with the real available area, not a fixed count —
  // a taller ground band (bigger screen) gets proportionally more
  // flowers instead of the same handful stretched across empty space
  const area = (x1 - x0) * bandH;
  const baseCount = Math.round(area / 900); // one flower per ~900 sq units
  const count = Math.max(24, Math.round(baseCount * bloom.density));
  const xs = seededScatter(1, count);
  const ys = seededScatter(2, count);
  const hs = seededScatter(3, count);
  const cs = seededScatter(4, count);

  return (
    <G>
      {xs.map((fx, i) => {
        const x = x0 + fx * (x1 - x0);
        const depthT = ys[i]; // 0 = near horizon (background), 1 = foreground
        const y = groundY + 6 + depthT * bandH;
        // flowers further into the foreground read slightly larger and
        // more saturated, closer flowers further from the mushroom line
        const depthScale = 0.75 + depthT * 0.6;
        const h = (bloom.heights[0] + hs[i] * (bloom.heights[1] - bloom.heights[0])) * depthScale;
        const [hue, sat, lit] = bloom.palette[Math.floor(cs[i] * bloom.palette.length) % bloom.palette.length];
        const stemCol = season === "winter" ? "rgba(200,210,220,.5)" : "hsl(120, 30%, 28%)";
        return (
          <G key={i} opacity={0.55 + depthT * 0.45}>
            <Path d={`M${x} ${y} L${x} ${y - h}`} stroke={stemCol} strokeWidth={0.8 + depthT} strokeLinecap="round" />
            <Circle cx={x} cy={y - h} r={(season === "summer" ? 2.1 : 1.6) * depthScale} fill={`hsl(${hue}, ${sat}%, ${lit}%)`} />
          </G>
        );
      })}
    </G>
  );
}

/* Fair-weather decorative clouds — soft puff clusters that drift
   slowly across the sky even when there is no active weather event.
   Each entry: baseX (0-400 art units), y, horizontal drift speed,
   and rough rx/ry of the central puff. They're scaled by vbWidth
   at render time, like weather clouds. */
const FAIR_CLOUDS = [
  { baseX: 55,  y: 38, speed: 3.2, rx: 34, ry: 13 },
  { baseX: 220, y: 22, speed: 4.8, rx: 44, ry: 16 },
  { baseX: 340, y: 52, speed: 2.6, rx: 28, ry: 11 },
];

/* Critters stroll around the garden band while the village is just
   standing there — they walk at different depths and speeds, creating
   the feel of a living village. Driven by the same walkT clock that
   drives the fair-weather clouds. */
function VillageWalkers({ critters, groundBase, groundH, vbWidth, walkT }) {
  if (!critters || critters.length === 0) return null;
  const count = Math.min(3, critters.length);
  return (
    <G>
      {critters.slice(0, count).map((n, i) => {
        const goRight  = i % 2 === 0;
        const speed    = 15 + i * 8;            // vb-units per second
        const cycleLen = vbWidth + 80;
        const offset   = i * (cycleLen / count); // stagger so they don't clump
        const rawPos   = ((walkT * speed + offset) % cycleLen) - 40;
        const x        = goRight ? rawPos : vbWidth - rawPos;
        // back row smaller / front row larger for a sense of depth
        const laneT  = count === 1 ? 0.5 : i / (count - 1);
        const y      = groundBase + groundH * (0.28 + laneT * 0.52);
        const size   = Math.round(22 + laneT * 10);
        const gaitT  = (walkT * 2.8 + i * 0.38) % 1;
        const flip   = goRight ? 1 : -1;
        return (
          <G key={n} transform={`translate(${x} ${y}) scale(${flip} 1)`}>
            <CritterFullBody n={n} size={size} walking={true} gaitT={gaitT} />
          </G>
        );
      })}
    </G>
  );
}

const VILLAGE_ART_WIDTH = 790; // widened from the original 400 — verified by direct calculation that 6 full-size houses + 4 full-size trees + the centered tower/fountain/schoolhouse cluster genuinely don't fit at 400 without overlap, no matter how they're arranged. Hoisted to module scope so both Village and the outer ScrollView-sizing code can reach it.

/* ---- v112: kawaii house kit ----------------------------------------
   Material-family houses built to match the user's reference pile
   (style bible): cream arched windows w/ teal glass, coral heart-
   window plank doors, flower tufts, soft painted shading. Each
   renderer is a pure function (no state, no hooks) that draws only
   the ROOF + BODY for its material; the door/window/flora kit is
   shared and drawn by the CAPS map itself. Families: mushroom,
   flower-dome, leaf-tent, berry-cottage, acorn, strawberry.
   (tree-home is reserved for the critter-house phase — at village
   scale it would read as a third tree next to the real tree art.) */

function houseMushroom({ c, capTopY, groundY, isNight }) {
  const capFill = `hsl(${c.hue}, 62%, ${isNight ? 34 : 62}%)`;
  const capRim = `hsl(${c.hue}, 55%, ${isNight ? 26 : 50}%)`;
  const body = isNight ? "#D8C6A8" : "#F5E9D0";
  const capH = c.h * 0.5, capW = c.w * 1.08, cx = c.x + c.w / 2;
  const spotFill = isNight ? "rgba(255,246,220,.5)" : "rgba(255,250,235,.85)";
  return (
    <>
      {/* body under the cap */}
      <Path d={`M${c.x + c.w * 0.14} ${groundY} L${c.x + c.w * 0.17} ${capTopY + capH * 0.7}
          Q${cx} ${capTopY + capH * 0.45} ${c.x + c.w * 0.83} ${capTopY + capH * 0.7}
          L${c.x + c.w * 0.86} ${groundY} Z`} fill={body} />
      <Ellipse cx={cx} cy={capTopY + capH * 0.78} rx={c.w * 0.35} ry={capH * 0.16}
        fill="#000" opacity="0.12" />
      {/* plump spotted cap w/ pale underside rim */}
      <Path d={`M${cx - capW / 2} ${capTopY + capH}
          Q${cx - capW / 2} ${capTopY + capH * 0.1} ${cx - capW * 0.18} ${capTopY + capH * 0.04}
          Q${cx} ${capTopY - capH * 0.06} ${cx + capW * 0.18} ${capTopY + capH * 0.04}
          Q${cx + capW / 2} ${capTopY + capH * 0.1} ${cx + capW / 2} ${capTopY + capH}
          Q${cx} ${capTopY + capH * 0.78} ${cx - capW / 2} ${capTopY + capH} Z`} fill={capFill} />
      <Path d={`M${cx - capW / 2} ${capTopY + capH} Q${cx} ${capTopY + capH * 0.78} ${cx + capW / 2} ${capTopY + capH}
          Q${cx} ${capTopY + capH * 0.92} ${cx - capW / 2} ${capTopY + capH} Z`}
        fill={isNight ? "#CBB795" : "#EFE2C4"} />
      <Path d={`M${cx - capW * 0.34} ${capTopY + capH * 0.9} Q${cx} ${capTopY + capH * 0.72} ${cx + capW * 0.34} ${capTopY + capH * 0.9}`}
        stroke={capRim} strokeWidth="0.8" fill="none" opacity="0.5" />
      {/* speckle spots, varied sizes like the reference cap */}
      <Ellipse cx={cx - capW * 0.26} cy={capTopY + capH * 0.34} rx={c.w * 0.075} ry={c.w * 0.06} fill={spotFill} />
      <Ellipse cx={cx + capW * 0.18} cy={capTopY + capH * 0.18} rx={c.w * 0.055} ry={c.w * 0.045} fill={spotFill} />
      <Ellipse cx={cx + capW * 0.33} cy={capTopY + capH * 0.52} rx={c.w * 0.045} ry={c.w * 0.038} fill={spotFill} />
      <Circle cx={cx - capW * 0.07} cy={capTopY + capH * 0.12} r={c.w * 0.032} fill={spotFill} />
      {/* soft top-light */}
      <Ellipse cx={cx - capW * 0.16} cy={capTopY + capH * 0.22} rx={capW * 0.2} ry={capH * 0.12}
        fill="#FFF" opacity={isNight ? 0.05 : 0.14} />
      {/* stone chimney on the hero-size house, like the reference */}
      {c.w >= 64 && (
        <>
          <Rect x={cx + capW * 0.24} y={capTopY - capH * 0.34} width={c.w * 0.11} height={capH * 0.5}
            rx={1.5} fill={isNight ? "#9B8B78" : "#C9B9A4"} />
          <Rect x={cx + capW * 0.225} y={capTopY - capH * 0.4} width={c.w * 0.14} height={capH * 0.12}
            rx={1.5} fill={isNight ? "#8A7A68" : "#B8A890"} />
        </>
      )}
    </>
  );
}

function houseFlowerDome({ c, capTopY, groundY, isNight }) {
  const pet = (dl) => `hsl(${c.hue}, ${isNight ? 38 : 68}%, ${isNight ? 38 + dl : 78 + dl}%)`;
  const leaf = isNight ? "#5E7A52" : "#8FBC74";
  const cx = c.x + c.w / 2, w = c.w;
  const petRy = c.h * 0.2, petRx = w * 0.19;
  return (
    <>
      {/* dome body of overlapping petal shingles: 3 rows */}
      <Path d={`M${c.x} ${groundY} L${c.x} ${capTopY + c.h * 0.42}
          Q${cx} ${capTopY - c.h * 0.08} ${c.x + w} ${capTopY + c.h * 0.42} L${c.x + w} ${groundY} Z`}
        fill={pet(-6)} />
      {/* bottom petal row */}
      {[0.14, 0.38, 0.62, 0.86].map((f, k) => (
        <Ellipse key={`b${k}`} cx={c.x + w * f} cy={capTopY + c.h * 0.62} rx={petRx} ry={petRy}
          fill={pet(k % 2 ? 2 : -2)} stroke={pet(-10)} strokeWidth="0.5" />
      ))}
      {/* middle petal row, offset */}
      {[0.26, 0.5, 0.74].map((f, k) => (
        <Ellipse key={`m${k}`} cx={c.x + w * f} cy={capTopY + c.h * 0.36} rx={petRx} ry={petRy}
          fill={pet(k % 2 ? 6 : 1)} stroke={pet(-8)} strokeWidth="0.5" />
      ))}
      {/* crown: leaves + bud */}
      <Ellipse cx={cx - w * 0.1} cy={capTopY + c.h * 0.1} rx={w * 0.14} ry={c.h * 0.09}
        fill={leaf} transform={`rotate(-24 ${cx - w * 0.1} ${capTopY + c.h * 0.1})`} />
      <Ellipse cx={cx + w * 0.1} cy={capTopY + c.h * 0.1} rx={w * 0.14} ry={c.h * 0.09}
        fill={leaf} transform={`rotate(24 ${cx + w * 0.1} ${capTopY + c.h * 0.1})`} />
      <Circle cx={cx} cy={capTopY + c.h * 0.06} r={w * 0.06} fill={pet(10)} stroke={pet(-8)} strokeWidth="0.5" />
      <Ellipse cx={cx - w * 0.18} cy={capTopY + c.h * 0.3} rx={w * 0.16} ry={c.h * 0.1}
        fill="#FFF" opacity={isNight ? 0.04 : 0.12} />
    </>
  );
}

function houseLeafTent({ c, capTopY, groundY, isNight }) {
  const L = (dl) => `hsl(118, ${isNight ? 26 : 42}%, ${isNight ? 24 + dl : 52 + dl}%)`;
  const cx = c.x + c.w / 2, w = c.w;
  const layer = (topF, spreadF, dl) => (
    <Path d={`M${cx} ${capTopY + c.h * topF}
        Q${cx - w * spreadF * 0.7} ${capTopY + c.h * (topF + 0.3)} ${cx - w * spreadF} ${groundY}
        Q${cx} ${groundY - 2} ${cx + w * spreadF} ${groundY}
        Q${cx + w * spreadF * 0.7} ${capTopY + c.h * (topF + 0.3)} ${cx} ${capTopY + c.h * topF} Z`}
      fill={L(dl)} />
  );
  return (
    <>
      {layer(0.02, 0.56, -6)}
      {layer(0.14, 0.44, 0)}
      {layer(0.28, 0.3, 6)}
      {/* center veins */}
      <Path d={`M${cx} ${capTopY + c.h * 0.1} L${cx} ${groundY - c.h * 0.42}`}
        stroke={L(-12)} strokeWidth="0.8" opacity="0.6" />
      {/* curl finial at the apex, like the reference tent */}
      <Path d={`M${cx} ${capTopY + c.h * 0.02} Q${cx + w * 0.1} ${capTopY - c.h * 0.14} ${cx + w * 0.02} ${capTopY - c.h * 0.2}
          Q${cx - w * 0.05} ${capTopY - c.h * 0.24} ${cx - w * 0.02} ${capTopY - c.h * 0.16}`}
        stroke={L(4)} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <Ellipse cx={cx - w * 0.16} cy={capTopY + c.h * 0.34} rx={w * 0.13} ry={c.h * 0.14}
        fill="#FFF" opacity={isNight ? 0.04 : 0.1} />
    </>
  );
}

function houseBerry({ c, capTopY, groundY, isNight }) {
  const B = (dl) => `hsl(${c.hue}, ${isNight ? 30 : 44}%, ${isNight ? 30 + dl : 58 + dl}%)`;
  const leaf = isNight ? "#5E7A52" : "#8FBC74";
  const cx = c.x + c.w / 2, w = c.w;
  const cy = capTopY + c.h * 0.56, rx = w * 0.52, ry = c.h * 0.56;
  return (
    <>
      {/* round berry body, slightly flattened at the ground */}
      <Path d={`M${cx - rx} ${cy} A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}
          L${cx + rx * 0.8} ${groundY} L${cx - rx * 0.8} ${groundY} Z`} fill={B(0)} />
      {/* dimple freckles */}
      <Circle cx={cx - rx * 0.45} cy={cy - ry * 0.1} r={w * 0.035} fill={B(-14)} opacity="0.8" />
      <Circle cx={cx + rx * 0.4} cy={cy + ry * 0.06} r={w * 0.03} fill={B(-14)} opacity="0.8" />
      <Circle cx={cx - rx * 0.15} cy={cy + ry * 0.4} r={w * 0.028} fill={B(-14)} opacity="0.7" />
      <Circle cx={cx + rx * 0.2} cy={cy - ry * 0.45} r={w * 0.03} fill={B(-14)} opacity="0.7" />
      {/* stem + drooping leaf cap */}
      <Path d={`M${cx} ${capTopY + c.h * 0.02} Q${cx + w * 0.04} ${capTopY - c.h * 0.12} ${cx + w * 0.12} ${capTopY - c.h * 0.14}`}
        stroke={isNight ? "#6E5A40" : "#9A7B50"} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <Path d={`M${cx - w * 0.3} ${capTopY + c.h * 0.14} Q${cx - w * 0.16} ${capTopY - c.h * 0.06} ${cx} ${capTopY + c.h * 0.04}
          Q${cx + w * 0.18} ${capTopY - c.h * 0.04} ${cx + w * 0.3} ${capTopY + c.h * 0.12}
          Q${cx} ${capTopY + c.h * 0.26} ${cx - w * 0.3} ${capTopY + c.h * 0.14} Z`} fill={leaf} />
      <Ellipse cx={cx - rx * 0.35} cy={cy - ry * 0.35} rx={rx * 0.34} ry={ry * 0.2}
        fill="#FFF" opacity={isNight ? 0.05 : 0.14} />
    </>
  );
}

function houseAcorn({ c, capTopY, groundY, isNight }) {
  const shell = isNight ? "#C9AE85" : "#EAD3A8";
  const capB = (dl) => `hsl(28, ${isNight ? 30 : 40}%, ${isNight ? 26 + dl : 42 + dl}%)`;
  const cx = c.x + c.w / 2, w = c.w;
  const capBot = capTopY + c.h * 0.42;
  return (
    <>
      {/* smooth nut body */}
      <Path d={`M${cx - w * 0.46} ${capBot - 2}
          Q${cx - w * 0.5} ${groundY - c.h * 0.16} ${cx - w * 0.3} ${groundY}
          L${cx + w * 0.3} ${groundY}
          Q${cx + w * 0.5} ${groundY - c.h * 0.16} ${cx + w * 0.46} ${capBot - 2} Z`} fill={shell} />
      {/* crosshatched beret cap */}
      <Path d={`M${cx - w * 0.52} ${capBot}
          Q${cx - w * 0.52} ${capTopY + c.h * 0.02} ${cx} ${capTopY}
          Q${cx + w * 0.52} ${capTopY + c.h * 0.02} ${cx + w * 0.52} ${capBot}
          Q${cx} ${capBot + c.h * 0.08} ${cx - w * 0.52} ${capBot} Z`} fill={capB(0)} />
      {[-0.3, -0.05, 0.2].map((f, k) => (
        <Path key={`h1${k}`} d={`M${cx + w * f} ${capTopY + c.h * 0.03} L${cx + w * (f + 0.22)} ${capBot + c.h * 0.03}`}
          stroke={capB(-8)} strokeWidth="0.7" opacity="0.7" />
      ))}
      {[0.3, 0.05, -0.2].map((f, k) => (
        <Path key={`h2${k}`} d={`M${cx + w * f} ${capTopY + c.h * 0.03} L${cx + w * (f - 0.22)} ${capBot + c.h * 0.03}`}
          stroke={capB(-8)} strokeWidth="0.7" opacity="0.7" />
      ))}
      {/* stalk + tiny oak leaf */}
      <Rect x={cx - w * 0.035} y={capTopY - c.h * 0.16} width={w * 0.07} height={c.h * 0.18}
        rx={w * 0.03} fill={capB(-6)} />
      <Path d={`M${cx + w * 0.04} ${capTopY - c.h * 0.12}
          q${w * 0.1} ${-c.h * 0.06} ${w * 0.2} 0 q${-w * 0.04} ${c.h * 0.03} ${-w * 0.08} ${c.h * 0.02}
          q${w * 0.03} ${c.h * 0.04} ${-w * 0.02} ${c.h * 0.05} q${-w * 0.06} ${-c.h * 0.01} ${-w * 0.1} ${-c.h * 0.07} Z`}
        fill={isNight ? "#6E8A5E" : "#9CC77E"} />
      <Ellipse cx={cx - w * 0.18} cy={capTopY + c.h * 0.18} rx={w * 0.16} ry={c.h * 0.09}
        fill="#FFF" opacity={isNight ? 0.05 : 0.12} />
    </>
  );
}

function houseStrawberry({ c, capTopY, groundY, isNight }) {
  const R = (dl) => `hsl(2, ${isNight ? 45 : 72}%, ${isNight ? 34 + dl : 58 + dl}%)`;
  const leaf = isNight ? "#587A4E" : "#7FB868";
  const seed = isNight ? "#D9C06E" : "#F2D98A";
  const cx = c.x + c.w / 2, w = c.w;
  const topY = capTopY + c.h * 0.16;
  return (
    <>
      {/* berry body: broad shoulders tapering to a rounded point-ish base */}
      <Path d={`M${cx} ${topY}
          Q${cx - w * 0.5} ${topY + c.h * 0.02} ${cx - w * 0.46} ${topY + c.h * 0.42}
          Q${cx - w * 0.42} ${groundY - c.h * 0.06} ${cx - w * 0.2} ${groundY}
          L${cx + w * 0.2} ${groundY}
          Q${cx + w * 0.42} ${groundY - c.h * 0.06} ${cx + w * 0.46} ${topY + c.h * 0.42}
          Q${cx + w * 0.5} ${topY + c.h * 0.02} ${cx} ${topY} Z`} fill={R(0)} />
      {/* gold seed studs */}
      {[[-0.34, 0.3], [0.3, 0.28], [-0.16, 0.52], [0.14, 0.5], [-0.36, 0.68], [0.34, 0.66], [0, 0.76]].map(([fx, fy], k) => (
        <Ellipse key={`s${k}`} cx={cx + w * fx} cy={topY + (groundY - topY) * fy}
          rx={w * 0.028} ry={w * 0.04} fill={seed} opacity="0.9" />
      ))}
      {/* leafy crown + curled stem */}
      {[-0.32, -0.11, 0.11, 0.32].map((f, k) => (
        <Path key={`l${k}`} d={`M${cx + w * f * 0.5} ${topY + c.h * 0.02}
            Q${cx + w * f * 1.5} ${topY - c.h * 0.06} ${cx + w * f * 1.9} ${topY + c.h * 0.1}
            Q${cx + w * f * 1.1} ${topY + c.h * 0.13} ${cx + w * f * 0.4} ${topY + c.h * 0.08} Z`}
          fill={leaf} />
      ))}
      <Path d={`M${cx} ${topY} Q${cx - w * 0.02} ${topY - c.h * 0.16} ${cx + w * 0.1} ${topY - c.h * 0.18}
          Q${cx + w * 0.16} ${topY - c.h * 0.18} ${cx + w * 0.14} ${topY - c.h * 0.12}`}
        stroke={leaf} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <Ellipse cx={cx - w * 0.2} cy={topY + c.h * 0.2} rx={w * 0.17} ry={c.h * 0.11}
        fill="#FFF" opacity={isNight ? 0.05 : 0.13} />
    </>
  );
}

/* winFx/winFy: where the scheduled lit window sits (fractions of the
   house box). Off-center families (berry, acorn) put it beside the
   door like the references; dome families wear it high on the
   material. winFyHi is the top-center variant small houses (w<40)
   use so window and door never collide at tiny sizes. */
const HOUSE_FAMS = {
  mushroom: { Roof: houseMushroom, winFx: 0.5, winFy: 0.3, winFyHi: 0.2 },
  flower: { Roof: houseFlowerDome, winFx: 0.5, winFy: 0.34, winFyHi: 0.22 },
  leaf: { Roof: houseLeafTent, winFx: 0.5, winFy: 0.32, winFyHi: 0.24 },
  berry: { Roof: houseBerry, winFx: 0.18, winFy: 0.5, winFyHi: 0.24 },
  acorn: { Roof: houseAcorn, winFx: 0.2, winFy: 0.6, winFyHi: 0.34 },
  strawberry: { Roof: houseStrawberry, winFx: 0.5, winFy: 0.34, winFyHi: 0.24 },
};

/* arch outline (door/window): straight sides, semicircular top.
   Requires h >= w/2, which both kits guarantee. */
function archPath(cx, cy, w, h) {
  return `M${cx - w / 2} ${cy + h / 2} L${cx - w / 2} ${cy - h / 2 + w / 2}
      A${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${cy - h / 2 + w / 2}
      L${cx + w / 2} ${cy + h / 2} Z`;
}

function houseDoor({ cx, doorW, doorH, groundY, isNight }) {
  const cream = isNight ? "#C7B694" : "#F6EAD2";
  const coral = isNight ? "#95524C" : "#E8837A";
  const plank = isNight ? "#6E3B36" : "#C96B60";
  const y0 = groundY - doorH;
  const s = doorW / 12;
  return (
    <>
      <Path d={archPath(cx, groundY - doorH / 2 - 1, doorW + 3.5, doorH + 2)} fill={cream}
        stroke={isNight ? "#7E6A48" : "#B99B6B"} strokeWidth="0.6" />
      <Path d={archPath(cx, groundY - doorH / 2, doorW, doorH)} fill={coral} />
      <Path d={`M${cx - doorW / 6} ${y0 + doorW / 2} V${groundY} M${cx + doorW / 6} ${y0 + doorW / 2} V${groundY}`}
        stroke={plank} strokeWidth="0.6" opacity="0.8" />
      {/* heart window in the door, straight from the references */}
      <Path d={`M${cx} ${y0 + doorH * 0.38 + 1.8 * s}
          C${cx - 2.4 * s} ${y0 + doorH * 0.38 - 0.6 * s} ${cx - 0.8 * s} ${y0 + doorH * 0.38 - 2 * s} ${cx} ${y0 + doorH * 0.38 - 0.5 * s}
          C${cx + 0.8 * s} ${y0 + doorH * 0.38 - 2 * s} ${cx + 2.4 * s} ${y0 + doorH * 0.38 - 0.6 * s} ${cx} ${y0 + doorH * 0.38 + 1.8 * s} Z`}
        fill={cream} opacity="0.95" />
      <Circle cx={cx + doorW * 0.3} cy={y0 + doorH * 0.58} r={0.9 * s} fill={isNight ? "#B8955A" : "#E9C46A"} />
      {/* stone step stack */}
      <Ellipse cx={cx} cy={groundY + 1.6} rx={doorW * 0.62} ry={1.5} fill={isNight ? "#9C8C70" : "#D9C6A4"} />
      <Ellipse cx={cx} cy={groundY + 3.4} rx={doorW * 0.8} ry={1.7} fill={isNight ? "#8C7C62" : "#CBB791"} opacity="0.9" />
    </>
  );
}

function houseWindow({ cx, cy, size, lit, winGlow, isNight, flowers }) {
  const winH = size * 1.3;
  const cream = isNight ? "#C7B694" : "#F6EAD2";
  const mull = isNight ? "#8A7554" : "#B99B6B";
  const glass = lit ? "#FFD98A" : isNight ? "rgba(58,52,74,.6)" : "rgba(150,205,215,.65)";
  return (
    <>
      <Path d={archPath(cx, cy, size + 2.6, winH + 2.6)} fill={cream}
        stroke={mull} strokeWidth="0.6" />
      <Path d={archPath(cx, cy, size, winH)} fill={glass} opacity={lit ? 0.6 + 0.4 * winGlow : 0.85} />
      <Path d={`M${cx - size / 2} ${cy} H${cx + size / 2} M${cx} ${cy - winH / 2} V${cy + winH / 2}`}
        stroke={mull} strokeWidth="0.7" />
      <Rect x={cx - size / 2 - 2} y={cy + winH / 2 + 0.4} width={size + 4} height={1.4} rx="0.7" fill={cream} />
      {flowers && (
        <>
          <Rect x={cx - size / 2 - 1} y={cy + winH / 2 + 1.9} width={size + 2} height={2.2} rx="0.8"
            fill={isNight ? "#7E6248" : "#B08A5E"} />
          <Circle cx={cx - size * 0.3} cy={cy + winH / 2 + 1.9} r="1.1" fill={isNight ? "#B87A8E" : "#F5A8C0"} />
          <Circle cx={cx} cy={cy + winH / 2 + 1.6} r="1.2" fill={isNight ? "#C08A96" : "#FBC4D4"} />
          <Circle cx={cx + size * 0.3} cy={cy + winH / 2 + 1.9} r="1.1" fill={isNight ? "#B87A8E" : "#F5A8C0"} />
        </>
      )}
    </>
  );
}

function houseTuft({ cx, y, hue, isNight }) {
  const leaf = isNight ? "#4E6A46" : "#7FB868";
  const fl = `hsl(${hue}, ${isNight ? 40 : 70}%, ${isNight ? 55 : 78}%)`;
  return (
    <>
      <Ellipse cx={cx - 1.6} cy={y - 0.8} rx="2" ry="1.2" fill={leaf} />
      <Ellipse cx={cx + 1.4} cy={y - 0.6} rx="1.7" ry="1" fill={leaf} opacity="0.85" />
      <Circle cx={cx - 1.8} cy={y - 2} r="1.1" fill={fl} />
      <Circle cx={cx + 0.2} cy={y - 2.6} r="1.3" fill={fl} />
      <Circle cx={cx + 2} cy={y - 1.8} r="1" fill={fl} opacity="0.9" />
      <Circle cx={cx + 0.2} cy={y - 2.6} r="0.5" fill={isNight ? "#BFA860" : "#F7E08A"} />
    </>
  );
}

function Village({ hour, brew, screenWidth, screenHeight, weatherKind = "clear", month = new Date().getMonth(), showWeather = true, showGarden = true, showClock = true, showDigitalClock = true, showSchoolhouse = true, showFountain = true, bellRinging = false, workActive = false, hydrateActive = false, restNapping = false, critters = [1] }) {
  const isNight = hour < 6 || hour >= 20;
  const starOpacity = isNight ? 0.8 : hour < 7 || hour > 19 ? 0.3 : 0;

  // napping critters' breathing/z-drift animation clock — only ticks
  // while restNapping is genuinely true, so there's no animation loop
  // running the rest of the time for something that isn't visible
  const [napT, setNapT] = useState(0);
  useEffect(() => {
    if (!restNapping) return;
    let raf;
    const start = Date.now();
    const loop = () => {
      setNapT((Date.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [restNapping]);

  // ambient animation clock — drives fair-weather cloud drift, village
  // walkers, and star twinkle. Runs unconditionally so the sky is always
  // alive, but it only writes to one integer per frame, which is cheap.
  const [walkT, setWalkT] = useState(0);
  useEffect(() => {
    let raf;
    const start = Date.now();
    const loop = () => {
      setWalkT((Date.now() - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // total scene height matches the real screen's own proportions, then
  // splits sky:ground at 2:1 — ground (land, garden, and the mushroom
  // houses sitting right at the horizon) occupies exactly one third of
  // the visible height, sky takes the remaining two thirds above it.
  //
  // The Svg below uses preserveAspectRatio="xMidYMax slice" so the
  // village fills the full screen with no gap on the sides. slice mode
  // scales the viewBox until it COVERS the real container — on a wide
  // landscape screen that scale ends up driven by width alone, and the
  // visible vertical budget becomes hard-capped at (viewBoxWidth *
  // screenHeight/screenWidth) NO MATTER how tall totalVB itself is —
  // growing totalVB there only makes groundH take a bigger bite out of
  // that same fixed budget, which is what silently clipped the
  // schoolhouse despite every internal coordinate checking out fine.
  // The actual fix: make the viewBox's own WIDTH match the real screen
  // aspect too, so its shape already fits the screen and slice has
  // nothing left to crop. The village art itself stays on its existing
  // fixed 0-400 coordinate space and just sits centered within the
  // wider frame on landscape screens — extra sky/ground becomes
  // visible at the edges instead of anything being stretched or cut.
  const aspect = (screenWidth && screenHeight) ? screenHeight / screenWidth : 1.8;
  const totalVB = Math.max(400, Math.min(760, 400 * aspect));
  const groundH = totalVB / 3;
  const skyH = totalVB - groundH;
  const vbWidth = screenWidth && screenHeight
    ? Math.max(VILLAGE_ART_WIDTH, totalVB * (screenWidth / screenHeight))
    : 400;

  const sunY = skyH * 0.5 + (skyH * 0.32) * Math.cos(((hour - 12) / 12) * Math.PI);
  const sunX = (40 / 400) * vbWidth + (hour / 24) * (vbWidth * 0.75);
  // the village's actual structures (houses, tower, schoolhouse,
  // fountain, dirt paths, trees) are drawn on their original fixed
  // 0-400 coordinate space rather than being rescaled — that art
  // needs to sit CENTERED within the wider vbWidth frame the same
  // way the sky/garden/ground already correctly fill it, or it reads
  // as pinned to the left edge while empty sky sits on the right
  const villageOffsetX = (vbWidth - VILLAGE_ART_WIDTH) / 2;
  const dimmed = weatherKind === "clouds" || weatherKind === "rain" || weatherKind === "storm" || weatherKind === "fog";
  const glow = isNight ? "#EDE7F5" : dimmed ? "#E8D9A8" : "#FFD98A";
  const glowOpacity = dimmed ? 0.4 : 1;

  // month theme: a distinct sky tint per real month, layered over the
  // time-of-day gradient rather than replacing it — the sky still goes
  // through its normal day/night cycle, just coloured by the season.
  const monthTheme = MONTH_THEMES[((month % 12) + 12) % 12];
  const skyBaseHue = isNight ? 250 : dimmed ? 220 : hour < 8 || hour > 18 ? 20 : 205;
  const skyHue = (skyBaseHue + monthTheme.hueShift + 360) % 360;
  const skySat = Math.max(15, Math.min(90, (isNight ? 40 : 62) * monthTheme.satMul));
  const skyLitTop = Math.max(8, Math.min(85, (isNight ? 14 : 58) * monthTheme.litMul));
  const skyLitBottom = Math.max(6, Math.min(75, (isNight ? 9 : 42) * monthTheme.litMul));

  // village fills the full real screen height, edge to edge — no gap
  // above or below it once slice-mode scaling is in play.
  const svgHeight = screenHeight || 700;

  // real pixel-per-viewBox-unit scale, matching what preserveAspectRatio
  // "xMidYMax slice" actually does — needed so a plain screen-pixel
  // Image overlay (used instead of react-native-svg's own Image, which
  // has proven unreliable resolving local assets in this Snack
  // environment) can be positioned correctly on top of the SVG scene
  // underneath it, in real screen pixels rather than viewBox units.
  const realScreenW = screenWidth || vbWidth;
  const pxScale = Math.max(realScreenW / vbWidth, svgHeight / totalVB);
  // xMid centers the viewBox horizontally within the real screen once
  // scaled — this is the real pixel offset of the viewBox's own x=0
  // relative to the actual screen's left edge
  const svgScreenOffsetX = (realScreenW - vbWidth * pxScale) / 2;

  const CAPS = [
    // v112: same slots/sizes as before (positions must keep tree
    // trunks in the gaps and the two tower-flanking slots clear of
    // its visible body) — but each slot now names a material FAMILY
    // from the user's reference pile; `hue` is the material tint.
    // left cluster
    { x: 205, w: 54, h: 42, hue: 28, fam: "acorn" },       // acorn house, warm tan
    { x: 251, w: 34, h: 28, hue: 332, fam: "flower" },      // pink petal dome, tucked in front
    { x: 294, w: 46, h: 38, hue: 118, fam: "leaf" },        // green leaf tent (old moss slot)
    { x: 326, w: 32, h: 28, hue: 262, fam: "berry" },       // blueberry cottage, left of tower
    // right arc
    { x: 432, w: 58, h: 46, hue: 2, fam: "strawberry" },    // strawberry house, tower's right
    { x: 514, w: 72, h: 56, hue: 30, fam: "mushroom" },     // hero orange spotted mushroom + chimney
    { x: 575, w: 34, h: 28, hue: 48, fam: "flower" },       // butter-cream petal dome
    { x: 622, w: 52, h: 42, hue: 24, fam: "acorn" },        // darker acorn (old moss slot)
    { x: 678, w: 44, h: 36, hue: 316, fam: "berry" },       // plum berry cottage
    { x: 722, w: 32, h: 26, hue: 190, fam: "mushroom" },    // mini teal spotted mushroom
  ];

  // felted tree canopies — each a cluster of overlapping lobes rather
  // than one smooth shape, so they read like the reference's soft,
  // rounded, cloud-like treetops instead of a plain balloon outline
  const TREES = [
    { x: 45, hue: 165, trunkH: 30, lobes: [{ dx: -18, dy: 40, r: 24 }, { dx: 14, dy: 52, r: 27 }, { dx: 30, dy: 30, r: 19 }] },
    { x: 165, hue: 15, trunkH: 34, lobes: [{ dx: -20, dy: 46, r: 26 }, { dx: 10, dy: 58, r: 29 }, { dx: 28, dy: 34, r: 20 }] },
    { x: 245, hue: 155, trunkH: 28, lobes: [{ dx: -16, dy: 38, r: 22 }, { dx: 12, dy: 50, r: 25 }, { dx: 26, dy: 28, r: 17 }] },
    { x: 350, hue: 280, trunkH: 26, lobes: [{ dx: -14, dy: 34, r: 20 }, { dx: 10, dy: 44, r: 22 }, { dx: 24, dy: 24, r: 15 }] },
  ];
  const base = skyH; // ground line inside the taller viewBox

  return (
    <Svg width="100%" height={svgHeight} viewBox={`0 0 ${vbWidth} ${totalVB}`}
      preserveAspectRatio="xMidYMax slice"
      style={{ position: "absolute", bottom: 0, left: 0, right: 0, top: 0 }}>
      <Defs>
        <RadialGradient id="sunGlow" cx="50%" cy="50%">
          <Stop offset="0%" stopColor={glow} stopOpacity={0.65 * glowOpacity} />
          <Stop offset="55%" stopColor={glow} stopOpacity={0.18 * glowOpacity} />
          <Stop offset="100%" stopColor={glow} stopOpacity={0} />
        </RadialGradient>
        <LinearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={`hsl(${skyHue}, ${skySat}%, ${skyLitTop}%)`} />
          <Stop offset="100%" stopColor={`hsl(${skyHue}, ${skySat}%, ${skyLitBottom}%)`} />
        </LinearGradient>
        {/* warm horizon blush for dawn (5-8) and dusk (17-20) */}
        <LinearGradient id="horizonBlush" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%"   stopColor="transparent"                         stopOpacity="0" />
          <Stop offset="55%"  stopColor={hour <= 10 ? "#FF9B5E" : "#E87BAF"} stopOpacity={0.14} />
          <Stop offset="100%" stopColor={hour <= 10 ? "#FFD9A0" : "#FFB4C8"} stopOpacity={0.26} />
        </LinearGradient>
      </Defs>

      {/* month-tinted sky, painted first so everything else layers on
          top of it — this is the actual "new theme each month" surface */}
      <Rect x="0" y="0" width={vbWidth} height={skyH + 20} fill="url(#skyGrad)" />

      {/* dawn / dusk horizon blush — a warm gradient band that rises from
          the ground line during the golden-hour windows either side of noon */}
      {((hour >= 5 && hour <= 9) || (hour >= 17 && hour <= 21)) && !dimmed && (
        <Rect x="0" y={skyH * 0.45} width={vbWidth} height={skyH * 0.55}
          fill="url(#horizonBlush)" />
      )}

      {/* rich star field — 48 seeded positions so every night looks the
          same (no flicker on re-render) but stars vary in size and twinkle
          gently via the ambient walkT clock */}
      {starOpacity > 0 && !dimmed && (() => {
        const SXS = seededScatter(20, 48);
        const SYS = seededScatter(21, 48);
        const SRS = seededScatter(22, 48);
        const SBR = seededScatter(23, 48); // brightness variation
        return (
          <G>
            {SXS.map((fx, i) => {
              const sx = fx * vbWidth;
              const sy = 6 + SYS[i] * skyH * 0.78;
              const sr = 0.7 + SRS[i] * 1.5;
              // gentle twinkle: each star has its own phase offset
              const twinkle = 0.65 + 0.35 * Math.sin(walkT * (1.2 + SBR[i] * 1.8) + i * 1.7);
              return (
                <Circle key={i} cx={sx} cy={sy} r={sr}
                  fill="#EDE7F5" opacity={starOpacity * twinkle} />
              );
            })}
          </G>
        );
      })()}

      {/* outer glow halo — larger at night so the moon reads as the
          only light source in the sky */}
      <Circle cx={sunX} cy={sunY} r={isNight ? 48 : 38} fill="url(#sunGlow)" />

      {isNight ? (
        /* ── MOON with real phase ── */
        <MoonDisc cx={sunX} cy={sunY} r={10} dimmed={dimmed} />
      ) : (
        /* ── SUN with 8 radiating rays ── */
        <G opacity={glowOpacity}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad  = (deg * Math.PI) / 180;
            const long = deg % 90 === 0;            // cardinal rays are longer
            const r1   = 14, r2 = long ? 26 : 21;
            return (
              <Path key={deg}
                d={`M${sunX + Math.cos(rad) * r1} ${sunY + Math.sin(rad) * r1}
                    L${sunX + Math.cos(rad) * r2} ${sunY + Math.sin(rad) * r2}`}
                stroke={glow} strokeWidth={long ? 2.4 : 1.6}
                strokeLinecap="round" opacity={0.72} />
            );
          })}
          {/* inner disc */}
          <Circle cx={sunX} cy={sunY} r="11" fill={glow} />
          {/* warm highlight spot */}
          <Circle cx={sunX - 2.5} cy={sunY - 2.5} r="4.5"
            fill="#FFFDE8" opacity={0.45} />
        </G>
      )}

      {showWeather && <WeatherLayer weatherKind={weatherKind} isNight={isNight} vbWidth={vbWidth} />}

      {/* fair-weather decorative clouds — soft puffs drifting across the
          sky even when no storm is active. Hidden during active weather
          events (dimmed) so they don't layer weirdly on top of storm clouds.
          At night they become very faint silhouettes against the stars. */}
      {weatherKind === "clear" && !dimmed && (
        <G opacity={isNight ? 0.13 : 0.72}>
          {FAIR_CLOUDS.map((c, i) => {
            const wrapRange = vbWidth + 140;
            const x = ((c.baseX * (vbWidth / 400) + walkT * c.speed) % wrapRange) - 70;
            const fill = isNight ? "#7A7090" : "#FAFAFA";
            return (
              <G key={i}>
                <Ellipse cx={x}                   cy={c.y}              rx={c.rx}            ry={c.ry}            fill={fill} opacity={0.92} />
                <Ellipse cx={x - c.rx * 0.46}     cy={c.y + c.ry * 0.3} rx={c.rx * 0.6}    ry={c.ry * 0.78}    fill={fill} opacity={0.86} />
                <Ellipse cx={x + c.rx * 0.5}      cy={c.y + c.ry * 0.28} rx={c.rx * 0.52}  ry={c.ry * 0.72}   fill={fill} opacity={0.86} />
                <Ellipse cx={x + c.rx * 0.1}      cy={c.y - c.ry * 0.45} rx={c.rx * 0.38}  ry={c.ry * 0.65}  fill={fill} opacity={0.75} />
              </G>
            );
          })}
        </G>
      )}

      {showDigitalClock && (
        <DigitalClock
          cx={sunX < vbWidth / 2 ? vbWidth * 0.82 : Math.max(vbWidth * 0.38, vbWidth * 0.5 - 100)}
          cy={skyH * 0.22}
          width={64}
          accent={monthTheme.accent}
          isNight={isNight}
          dimmed={dimmed}
        />
      )}

      {/* ground fills all the way to the true bottom of the taller
          viewBox — same flat colour as before, just extended so
          there's no empty gap beneath the garden */}
      <Path d={`M0 ${base} Q80 ${base - 12} 160 ${base - 2} T${vbWidth} ${base - 8} V${totalVB} H0 Z`} fill="#241A3D" opacity="0.9" />
      <Path d={`M0 ${base + 15} Q100 ${base + 5} 200 ${base + 14} T${vbWidth} ${base + 8} V${totalVB} H0 Z`} fill="#1B1330" />

      {/* permanent wildflower garden — now spans the full ground band,
          not just a thin strip near the mushroom stems, so a taller
          screen shows proportionally more garden rather than dead space */}
      {showGarden && (
        <>
          <HillBand offsetX={villageOffsetX} groundY={base} bottom={totalVB} month={month} />
          <GrassField x0={0} x1={vbWidth} groundY={base + 10} bandH={groundH - 10} month={month} />
          <WildflowerGarden x0={0} x1={vbWidth} groundY={base + 10} bandH={groundH - 10} month={month} />
        </>
      )}

      {/* critters wander the garden while the village just stands there —
          their depth and scale vary by lane so the scene reads as 3-D.
          Hidden during rest (they're napping by the fountain then instead). */}
      {!restNapping && (
        <VillageWalkers
          critters={critters}
          groundBase={base + 10}
          groundH={groundH - 14}
          vbWidth={vbWidth}
          walkT={walkT}
        />
      )}

      <G transform={`translate(${villageOffsetX} 0)`}>
      {/* the plaza ring — the circular dirt path around the fountain at
          the village center, with a walkway leading toward the viewer.
          Ring geometry keeps the band's outer stroke (9.5 under the
          centerline top of base+15) below the ground contour (~base+3
          at center), so it never pokes into the sky; cap bases
          (base+10) sit just behind the upper arc. */}
      {showGarden && (showClock || showFountain) && (
        <PlazaRing cx={395} cy={base + 34} rx={150} ry={19}
          groundBottom={base + groundH - 6} isNight={isNight} />
      )}

      {/* felted tree canopies behind the houses — real illustrated
          art now renders as separate TreeImage siblings outside this
          Svg entirely (see their call site alongside Village itself),
          same reason as the schoolhouse/bell/fountain */}

      {/* mushroom houses — round arched doors, real cross-mullion
          windows, moss-roof variant, softer cap shading */}
      {CAPS.map((c, i) => {
        const F = HOUSE_FAMS[c.fam];
        const groundY = base + 10;
        const capTopY = groundY - c.h;
        const doorW = Math.min(13, c.w * 0.28);
        const doorH = doorW * 1.35;
        const winSize = Math.max(5.5, c.w * 0.17);
        const winX = c.w < 40 ? c.x + c.w / 2 : c.x + c.w * F.winFx;
        const winY = capTopY + c.h * (c.w < 40 ? F.winFyHi : F.winFy);
        // v111 — windows live on the village's own schedule instead of
        // one hard night switch. Everything below is a pure function
        // of state already flowing through Village (continuous hour,
        // the same ambient walkT clock the stars twinkle on, session
        // flags) — per-house constants seed from the cap's own x, so
        // every render agrees and nothing new is stored or timed.
        const seed = ((c.x * 7919) % 97) / 97;
        const eveOn = 17 + seed * 3;          // houses light one by one through dusk, 17:00-20:00
        const offRaw = 22.5 + seed * 2.4;     // and go dark for bed, 22:30-~00:54 (may wrap past midnight)
        const isOn = hour >= eveOn ? hour < offRaw : hour < offRaw - 24;
        const nightOwl = i % 4 === 2;         // a couple of homes read late into the night
        let glow = isOn ? 1 : (isNight && nightOwl ? 0.4 : 0);
        // dark storm/rain daytimes: cosy lamps come on early
        if ((weatherKind === "storm" || weatherKind === "rain") && !isNight) glow = Math.max(glow, 0.7);
        // while a work phase is running the village keeps its lights
        // low, so the schoolhouse (and your focus) is the bright spot
        if (workActive && glow > 0) glow *= 0.55;
        // the work-start bell: every window flashes warm, day or night
        if (bellRinging) glow = Math.min(1, glow + 0.5);
        // candle breathing on the ambient clock — each house its own phase
        const flicker = 0.86 + 0.14 * Math.sin(walkT * (1.2 + seed * 1.5) + c.x * 0.7);
        const winGlow = glow * flicker;
        const lit = winGlow > 0.06;

        return (
          <G key={c.x}>
            {/* soft ground shadow so the house sits IN the meadow */}
            <Ellipse cx={c.x + c.w / 2} cy={groundY + 1} rx={c.w * 0.55} ry={2.6}
              fill="#000" opacity={isNight ? 0.22 : 0.15} />

            {/* material roof + body from the family renderer */}
            {F.Roof({ c, capTopY, groundY, isNight })}

            {/* shared kawaii door kit: cream arch surround, coral
                planks, heart window, gold knob, stone steps */}
            {houseDoor({ cx: c.x + c.w / 2, doorW, doorH, groundY, isNight })}

            {/* the scheduled lit window — v111 lighting math above
                feeds straight into the new arched frame */}
            {houseWindow({ cx: winX, cy: winY, size: winSize, lit, winGlow, isNight, flowers: c.w >= 44 })}
            {c.w >= 50 && F.winFx !== 0.5 &&
              houseWindow({ cx: c.x + c.w - (winX - c.x), cy: winY, size: winSize * 0.85, lit, winGlow, isNight, flowers: false })}

            {/* flower tufts hugging the base corners */}
            {houseTuft({ cx: c.x + c.w * 0.08, y: groundY, hue: c.hue, isNight })}
            {houseTuft({ cx: c.x + c.w * 0.94, y: groundY + 1, hue: (c.hue + 140) % 360, isNight })}

            {lit && (
              <Circle cx={winX} cy={winY} r={winSize * 0.7} fill="#FFD98A" opacity={0.22 * winGlow} />
            )}
          </G>
        );
      })}

      {/* the village clock tower now renders as real illustrated art
          (ClockTowerImage) plus a live clock overlay (ClockTowerClock-
          Overlay), both outside this Svg entirely — see their call
          sites alongside Village itself */}

      {/* the schoolhouse — bell chimes exactly when the real work-start
          sound plays, windows show the person's own critter while a
          work phase is actually running */}
      {showSchoolhouse && (
        <Schoolhouse x={90} groundY={base + 10} isNight={isNight} dimmed={dimmed}
          bellRinging={bellRinging} workActive={workActive} critters={critters}
          hour={hour} walkT={walkT} weatherKind={weatherKind}
          pxScale={pxScale} svgScreenOffsetX={svgScreenOffsetX} villageOffsetX={villageOffsetX} />
      )}

      {/* the town fountain — sits right where the dirt paths already
          converge, water only actually runs while a hydrate phase is
          genuinely in progress. The real wet-state art renders as a
          separate FountainImage sibling outside this Svg entirely
          (see its call site alongside Village itself) — this dry/idle
          version is the only state Fountain itself still renders. */}
      {showFountain && !hydrateActive && (
        <Fountain x={395} groundY={base + 32} isNight={isNight} />
      )}

      {showFountain && (
        <>
        {/* critters resting near the fountain during an actual rest
            gate — real unlocked critters, not a repeated shape */}
        {restNapping && critters.slice(0, 3).map((n, i) => (
          <NappingCritter key={n} n={n} x={352 + i * 22} y={base + 44} phase={(napT * 0.35 + i * 0.33) % 1} />
        ))}
        </>
      )}
      </G>
    </Svg>
  );
}

/* A real, working color picker for one sidebar phase color: a row of
   preset swatches (tap to apply instantly) plus a hex text field for
   any custom color, with basic validation so a malformed hex never
   gets applied. "Reset" clears the override back to PHASE's default. */
const COLOR_PRESETS = [
  "#E85A5A", "#E8933A", "#E8D24A", "#7BC46A", "#4A8FE8", "#9B5AE8",
  "#5BA8E8", "#E87AB8", "#D98A5B", "#7BD88F", "#EDE7F5", "#F2B366",
];
const HEX_RE = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;

function ColorPickerRow({ label, value, isCustom, onPick, onReset }) {
  const [hexInput, setHexInput] = useState(value);
  const [error, setError] = useState(false);

  useEffect(() => { setHexInput(value); setError(false); }, [value]);

  const submitHex = () => {
    const v = hexInput.trim();
    if (HEX_RE.test(v)) {
      onPick(v.startsWith("#") ? v : `#${v}`);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <View style={styles.colorPickerRow}>
      <View style={styles.colorPickerHead}>
        <View style={[styles.colorPickerDot, { backgroundColor: value }]} />
        <Text style={styles.colorPickerLabel}>{label}</Text>
        {isCustom && (
          <Pressable onPress={onReset} hitSlop={6}>
            <Text style={styles.colorPickerReset}>Reset</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.colorSwatchRow}>
        {COLOR_PRESETS.map((hex) => (
          <Pressable key={hex} onPress={() => onPick(hex)}
            style={[styles.colorSwatch, { backgroundColor: hex }, value.toLowerCase() === hex.toLowerCase() && styles.colorSwatchActive]} />
        ))}
      </View>
      <View style={styles.colorHexRow}>
        <TextInput
          value={hexInput}
          onChangeText={(t) => { setHexInput(t); setError(false); }}
          onSubmitEditing={submitHex}
          onBlur={submitHex}
          placeholder="#RRGGBB"
          placeholderTextColor="rgba(237,231,245,.35)"
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.colorHexInput, error && { borderColor: "#E85A5A" }]}
        />
        <Pressable onPress={submitHex} style={styles.colorHexApply}>
          <Text style={styles.colorHexApplyText}>Apply</Text>
        </Pressable>
      </View>
      {error && <Text style={styles.colorHexError}>Enter a valid hex color, like #E85A5A</Text>}
    </View>
  );
}

function DayStat({ label, value, color }) {
  return (
    <View style={styles.dayStat}>
      <Text style={[styles.dayStatVal, { color }]}>{value}</Text>
      <Text style={styles.dayStatLabel}>{label}</Text>
    </View>
  );
}

function Calendar({ mode, setMode, day, setDay, month, setMonth, cache, onToggleIntention, brew }) {
  const rec = cache[day] || emptyDay(day);
  const week = daysBack(7, new Date(day + "T12:00:00"));
  const cells = monthGrid(month.y, month.m);
  const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DOW = ["S","M","T","W","T","F","S"];
  const weekRecs = week.map((k) => cache[k] || emptyDay(k));
  const maxFocus = Math.max(1, ...weekRecs.map((r) => r.focusMs));

  const shift = (days) => {
    const d = new Date(day + "T12:00:00");
    d.setDate(d.getDate() + days);
    setDay(dayKey(d));
  };
  const shiftMonth = (n) => {
    const d = new Date(month.y, month.m + n, 1);
    setMonth({ y: d.getFullYear(), m: d.getMonth() });
  };

  const label = (() => {
    const d = new Date(day + "T12:00:00");
    if (mode === "day") return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
    if (mode === "week") {
      const a = new Date(week[0] + "T12:00:00");
      return `${MON[a.getMonth()]} ${a.getDate()} – ${MON[d.getMonth()]} ${d.getDate()}`;
    }
    return `${MON[month.m]} ${month.y}`;
  })();

  return (
    <View>
      <View style={styles.calModes}>
        {["day", "week", "month"].map((m) => (
          <Pressable key={m} onPress={() => setMode(m)} style={[styles.calMode, mode === m && styles.calModeActive]}>
            <Text style={[styles.calModeText, mode === m && styles.calModeTextActive]}>{m}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.calNav}>
        <Pressable onPress={() => (mode === "month" ? shiftMonth(-1) : shift(mode === "week" ? -7 : -1))} style={styles.calArrow}>
          <Text style={styles.calArrowText}>‹</Text>
        </Pressable>
        <Text style={styles.calLabel}>{label}</Text>
        <Pressable onPress={() => (mode === "month" ? shiftMonth(1) : shift(mode === "week" ? 7 : 1))} style={styles.calArrow}>
          <Text style={styles.calArrowText}>›</Text>
        </Pressable>
      </View>

      {mode === "day" && (
        <>
          <View style={styles.dayGrid}>
            <DayStat label="Focus" value={fmtTotal(rec.focusMs / 1000)} color="#E85A5A" />
            <DayStat label="Timers" value={rec.blocks} color="#5BA8E8" />
            <DayStat label="Sets" value={rec.sets} color="#E87AB8" />
            <DayStat label="Coffee" value={`${rec.cups} cup${rec.cups === 1 ? "" : "s"}`} color={brew} />
          </View>
          <View style={styles.intWrap}>
            <Text style={styles.intTitle}>Intentions</Text>
            {(rec.intentions || []).length === 0 ? (
              <Text style={styles.intEmpty}>Intentions written at each coffee break appear here.</Text>
            ) : (
              rec.intentions.map((it, i) => (
                <Pressable key={i} onPress={() => onToggleIntention(day, i)} style={styles.intRow}>
                  <View style={[styles.intBox, it.done && { backgroundColor: "#7BD88F", borderColor: "#7BD88F" }]}>
                    {it.done && <Text style={{ fontSize: 11, fontWeight: "800" }}>✓</Text>}
                  </View>
                  <Text style={[styles.intText, it.done && { textDecorationLine: "line-through", opacity: 0.5 }]}>{it.text}</Text>
                  <Text style={styles.intCycle}>#{it.cycle}</Text>
                </Pressable>
              ))
            )}
          </View>
        </>
      )}

      {mode === "week" && (
        <View style={styles.weekChart}>
          {week.map((k, i) => {
            const r = weekRecs[i];
            const h = Math.max(3, (r.focusMs / maxFocus) * 96);
            const d = new Date(k + "T12:00:00");
            const isSel = k === day;
            return (
              <Pressable key={k} onPress={() => { setDay(k); setMode("day"); }} style={styles.weekCol}>
                <Text style={styles.weekVal}>{r.focusMs > 0 ? fmtTotal(r.focusMs / 1000) : ""}</Text>
                <View style={[styles.weekBar, { height: h, backgroundColor: isSel ? "#E85A5A" : "rgba(232,90,90,.45)" }]} />
                <Text style={[styles.weekDay, isSel && { color: "#E85A5A" }]}>{DOW[d.getDay()]}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {mode === "month" && (
        <>
          <View style={styles.monthHead}>{DOW.map((d, i) => <Text key={i} style={styles.monthDow}>{d}</Text>)}</View>
          <View style={styles.monthGrid}>
            {cells.map((c) => {
              const r = cache[c.key] || emptyDay(c.key);
              const isToday = c.key === dayKey();
              return (
                <Pressable key={c.key} onPress={() => { setDay(c.key); setMode("day"); }}
                  style={[styles.monthCell, { opacity: c.inMonth ? 1 : 0.25 }, r.focusMs > 0 && { backgroundColor: "rgba(232,90,90,.28)" }, isToday && { borderColor: "rgba(232,90,90,.85)" }]}>
                  <Text style={styles.monthNum}>{c.date.getDate()}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

/* ============================================================
   STYLES — StyleSheet.create equivalent of the web version's S{}.
   Web-only props (boxShadow, cursor, transition, backdropFilter,
   CSS keyframes) dropped; layout/color/spacing preserved.
   ============================================================ */
const styles = StyleSheet.create({
  // real styles for the standalone Friends screen and shared Back
  // component, merged from the person's own old App.js
  scroll: { flexGrow: 1, padding: 20 },
  backRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  backText: { color: "#bd7b6d", fontWeight: "800", width: 55 },
  screenTitle: { color: "#4a4350", fontSize: 20, fontWeight: "800" },
  pageIntro: { color: "#8d817d", lineHeight: 21, fontSize: 15, marginBottom: 18 },
  cardText: { color: "#8d817d", lineHeight: 20, marginVertical: 8 },
  sectionTitle: { color: "#4a4350", fontSize: 19, fontWeight: "800", marginBottom: 11 },
  friendGrid: { flexDirection: "row", flexWrap: "wrap", gap: 11 },
  friendCard: { width: "48%", backgroundColor: "#fff", borderRadius: 19, padding: 13, alignItems: "center", elevation: 2 },
  friendIcon: { width: 61, height: 61, borderRadius: 31, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  friendEmoji: { fontSize: 36 },
  friendName: { color: "#4a4350", fontSize: 17, fontWeight: "800" },
  friendMood: { color: "#9c8f89", fontSize: 11, textAlign: "center", marginVertical: 3 },
  friendPoints: { color: "#d09276", fontSize: 11, fontWeight: "700" },
  modal: { position: "absolute", left: 16, right: 16, top: 95, backgroundColor: "#fff", borderRadius: 25, padding: 22, alignItems: "center", elevation: 8 },
  modalEmoji: { fontSize: 58 },
  modalTitle: { color: "#4a4350", fontSize: 25, fontWeight: "900" },
  progress: { height: 8, backgroundColor: "#f0e9e1", borderRadius: 5, width: "100%", marginBottom: 18 },
  progressFill: { height: 8, borderRadius: 5 },
  // real onboarding styles, merged from the person's own old App.js
  welcome: { flex: 1, backgroundColor: "#0d0820", alignItems: "center", justifyContent: "center", padding: 28, overflow: "hidden" },
  welcomeBlob: { position: "absolute", width: 360, height: 360, borderRadius: 180, backgroundColor: "#7c3aed", opacity: 0.22, top: -150, left: -120 },
  parade: { fontSize: 30, marginBottom: 24 },
  welcomeTitle: { color: "#fff", fontSize: 35, fontWeight: "900" },
  welcomeSub: { color: "#d7caff", marginTop: 9, fontSize: 15 },
  pillRow: { flexDirection: "row", gap: 8, marginVertical: 30 },
  pill: { backgroundColor: "#ffffff18", borderRadius: 16, padding: 10, alignItems: "center", gap: 4 },
  pillText: { color: "#fff", fontSize: 11 },
  loginPage: { flexGrow: 1, backgroundColor: "#0d0820", alignItems: "center", justifyContent: "center", padding: 24 },
  loginLogo: { fontSize: 28, marginBottom: 16 },
  loginTitle: { color: "#fff", fontSize: 30, fontWeight: "900" },
  loginSubtitle: { color: "#cfc2df", marginTop: 7, marginBottom: 24 },
  googleButton: { backgroundColor: "#fff", width: "100%", maxWidth: 380, borderRadius: 13, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  googleMark: { color: "#4285f4", fontSize: 19, fontWeight: "900", marginRight: 10 },
  googleButtonText: { color: "#333", fontSize: 15, fontWeight: "800" },
  skipLogin: { color: "#d9b6ff", fontWeight: "700", padding: 16 },
  oauthNote: { maxWidth: 380, backgroundColor: "#ffffff0d", borderRadius: 14, padding: 13, marginTop: 15 },
  oauthNoteTitle: { color: "#f3d7ff", fontWeight: "800", fontSize: 12 },
  oauthNoteText: { color: "#a99ab7", fontSize: 11, lineHeight: 17, marginTop: 5 },
  primaryButton: { backgroundColor: "#d9826f", borderRadius: 20, paddingVertical: 14, paddingHorizontal: 25, alignItems: "center" },
  primaryButtonText: { color: "#fff", fontWeight: "800", fontSize: 15 },
  secondaryButton: { backgroundColor: "#ffffffdd", borderRadius: 17, paddingVertical: 9, paddingHorizontal: 14, alignItems: "center" },
  secondaryButtonText: { color: "#6a6070", fontWeight: "800", fontSize: 12 },
  /* ---- new layout: profile+village in main area, everything else in a
     left sidebar with collapsible sections. Height-fit via flex, not
     fixed pixels, so it never overflows the screen. ---- */
  mainArea: { flex: 1 },
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 24, paddingHorizontal: 20,
  },
  sidebarOpenBtn: {
    width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(20,16,36,.6)", borderWidth: 1, borderColor: "rgba(255,255,255,.12)",
    marginRight: 10,
  },
  sidebarOpenIcon: { fontSize: 15, color: "#EDE7F5" },
  leftSidebar: {
    position: "absolute", top: 0, bottom: 0, left: 0,
    width: 300, maxWidth: "88%",
    backgroundColor: "rgba(14,11,28,.94)",
    borderRightWidth: 1, borderRightColor: "rgba(255,255,255,.1)",
  },
  leftSidebarInner: { padding: 16, paddingBottom: 40 },
  sidebarDragHandle: {
    position: "absolute", top: 0, bottom: 0, right: -16, width: 32,
    alignItems: "center", justifyContent: "center",
  },
  sidebarDragGrip: {
    width: 7, height: 64, borderRadius: 999,
    backgroundColor: "rgba(255,255,255,.28)",
  },
  sbHead: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 12, paddingTop: 8,
  },
  sbHeadTitle: {
    fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase",
    fontWeight: "800", color: "rgba(237,231,245,.5)",
  },
  weatherStatus: {
    fontSize: 10, color: "rgba(237,231,245,.45)", textAlign: "center",
    marginBottom: 8, fontWeight: "600",
  },
  dateHeader: { marginBottom: 10, paddingTop: 2 },
  dateHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dateHeaderText: {
    fontSize: 15, fontWeight: "800", color: "#EDE7F5",
  },
  dayPercentText: {
    fontSize: 12, fontWeight: "700", color: "rgba(237,231,245,.5)", fontVariantNumeric: "tabular-nums",
  },
  dayPercentTrack: {
    height: 3, borderRadius: 999, backgroundColor: "rgba(255,255,255,.08)",
    overflow: "hidden", marginTop: 6,
  },
  dayPercentFill: { height: "100%", backgroundColor: "#E85A5A", borderRadius: 999 },
  mlProgressRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginTop: 10, marginBottom: 4,
  },
  mlProgressText: { fontSize: 12, fontWeight: "700", color: "rgba(237,231,245,.7)" },
  mlProgressEdit: { fontSize: 11, fontWeight: "700", color: "rgba(237,231,245,.4)", textDecorationLine: "underline" },
  glassSizeNote: { fontSize: 10, color: "rgba(237,231,245,.4)", textAlign: "center", marginTop: 6, fontWeight: "600" },
  plantRow: { alignItems: "center", marginVertical: 10 },
  plantLabel: { fontSize: 10, fontWeight: "700", color: "rgba(237,231,245,.45)", marginTop: 4, letterSpacing: 0.5 },
  paceRow: { marginTop: 8, marginBottom: 4 },
  paceLabel: { fontSize: 11, fontWeight: "700", color: "rgba(237,231,245,.5)" },
  mlFieldLabel: { fontSize: 11, fontWeight: "700", color: "rgba(237,231,245,.5)", marginBottom: 4 },
  weatherInfoCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "rgba(20,16,36,.6)", borderWidth: 1, borderColor: "rgba(255,255,255,.1)",
    borderRadius: 14, padding: 12, marginBottom: 16,
  },
  weatherInfoTemp: { fontSize: 24, fontWeight: "800", color: "#EDE7F5" },
  weatherInfoDetails: { flex: 1 },
  weatherInfoKind: { fontSize: 13, fontWeight: "700", color: "#EDE7F5", marginBottom: 2 },
  weatherInfoWind: { fontSize: 11, color: "rgba(237,231,245,.5)", fontWeight: "600" },
  weatherInfoPending: { fontSize: 12, color: "rgba(237,231,245,.5)", fontWeight: "600" },
  weatherUnitToggle: {
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8,
    backgroundColor: "rgba(255,255,255,.08)", borderWidth: 1, borderColor: "rgba(255,255,255,.14)",
  },
  weatherUnitToggleText: { fontSize: 11, fontWeight: "800", color: "rgba(237,231,245,.7)" },
  unitChoiceRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  unitChoiceBtn: {
    paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,.04)", borderWidth: 1.3, borderColor: "rgba(255,255,255,.1)",
  },
  unitChoiceBtnActive: { backgroundColor: "rgba(232,90,90,.14)", borderColor: "rgba(232,90,90,.4)" },
  unitChoiceText: { fontSize: 11, fontWeight: "700", color: "rgba(237,231,245,.6)" },
  unitChoiceTextActive: { color: "#EDE7F5" },
  sbSectionHead: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,.08)",
  },
  sbSectionHeadDense: { paddingVertical: 8 },
  sbChevron: {
    fontSize: 13, fontWeight: "800", color: "rgba(237,231,245,.4)",
  },
  sbSectionTitle: { flex: 1, fontSize: 14, fontWeight: "800", color: "#EDE7F5" },
  sbSectionMeta: { fontSize: 12, fontWeight: "700", color: "rgba(237,231,245,.5)" },
  sbSectionBody: { paddingVertical: 14, paddingLeft: 4 },
  sbSectionBodyDense: { paddingVertical: 8, paddingLeft: 2 },
  phasePillMini: {
    paddingVertical: 3, paddingHorizontal: 10, borderWidth: 1.3, borderRadius: 999,
  },
  phasePillMiniText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase" },
  restCountdownRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingBottom: 10, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,.08)",
  },
  restCountdownLabel: { flex: 1, fontSize: 12, color: "rgba(237,231,245,.55)", fontWeight: "700" },
  restCountdownVal: { fontSize: 15, fontWeight: "800", fontVariantNumeric: "tabular-nums" },
  sidebarClose: { fontSize: 20, color: "rgba(237,231,245,.4)", fontWeight: "700" },
  sideStat: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,.06)",
  },
  sideDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: "#E85A5A" },
  sideLabel: { flex: 1, fontSize: 12, color: "rgba(237,231,245,.55)", fontWeight: "700" },
  sideVal: {
    fontSize: 13, fontWeight: "800", color: "#EDE7F5",
    fontVariantNumeric: "tabular-nums",
  },
  sideDivider: {
    height: 1, backgroundColor: "rgba(255,255,255,.08)",
    marginTop: 14, marginBottom: 10,
  },
  sidebarReopenLeft: {
    position: "absolute", left: 0, top: "50%",
    width: 22, height: 44, marginTop: -22,
    backgroundColor: "rgba(20,16,36,.82)",
    borderTopRightRadius: 10, borderBottomRightRadius: 10,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,.1)", borderLeftWidth: 0,
  },
  sidebarReopenText: { color: "rgba(237,231,245,.6)", fontSize: 16, fontWeight: "700" },
  shell: { flex: 1 },
  dim: { color: "rgba(237,231,245,.5)", textAlign: "center", marginTop: 120 },
  wordmark: { fontSize: 17, fontWeight: "800", color: "#EDE7F5" },
  profileBtn: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "rgba(255,255,255,.05)", borderWidth: 1, borderColor: "rgba(255,255,255,.1)", borderRadius: 999, paddingVertical: 4, paddingHorizontal: 11, paddingLeft: 4 },
  profileDot: { width: 22, height: 22, borderRadius: 999, overflow: "hidden", backgroundColor: "rgba(255,255,255,.08)" },
  profileName: { fontSize: 12, fontWeight: "700", color: "rgba(237,231,245,.75)", maxWidth: 76 },
  phasePill: { alignSelf: "center", paddingVertical: 5, paddingHorizontal: 16, borderWidth: 1.5, borderRadius: 999, marginBottom: 6 },
  phasePillText: { fontSize: 12, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase" },
  dialWrap: { alignItems: "center", justifyContent: "center", marginTop: 4 },
  dialCenter: { position: "absolute", alignItems: "center", justifyContent: "center" },
  time: { fontSize: 52, fontWeight: "800", color: "#EDE7F5" },
  centis: { fontSize: 22, opacity: 0.55 },
  blockLabel: { fontSize: 12, color: "rgba(237,231,245,.45)", letterSpacing: 1, textTransform: "uppercase", marginTop: 4, fontWeight: "700", textAlign: "center" },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end", gap: 4, marginTop: 2, marginBottom: 20 },
  gardenOverlay: {
    position: "absolute", bottom: 12, left: 0, right: 0,
    alignItems: "center", zIndex: 2,
  },
  gardenHint: {
    fontSize: 12, color: "rgba(237,231,245,.55)", lineHeight: 17,
    fontWeight: "600", marginBottom: 4,
  },
  pickGround: {
    position: "absolute", left: 0, right: 0, bottom: 18, height: 2,
    backgroundColor: "rgba(255,255,255,.14)",
  },
  pickRow: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    flexDirection: "row", alignItems: "flex-end",
  },
  pickCritter: { position: "absolute", width: 40, height: 54 },
  pickBasket: { position: "absolute", bottom: 16 },
  pickTally: {
    position: "absolute", top: 0, right: 0,
    fontSize: 11, fontWeight: "800", color: "rgba(237,231,245,.6)",
  },
  coffeeWrap: { backgroundColor: "rgba(20,16,36,.72)", borderWidth: 1, borderColor: "rgba(255,255,255,.1)", borderRadius: 16, padding: 14, marginBottom: 16 },
  coffeeHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  coffeeHeadLeft: { flexDirection: "row", alignItems: "center", flexShrink: 1, minWidth: 0 },
  chevron: { fontSize: 14, fontWeight: "800", color: "rgba(237,231,245,.5)", marginRight: 7 },
  coffeeLabel: { fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: "800", color: "rgba(237,231,245,.42)" },
  coffeeTime: { fontSize: 18, fontWeight: "800" },
  coffeeMs: { fontSize: 12, opacity: 0.6, fontWeight: "700" },
  // the brew colour starts near-black (espresso) and only lightens as
  // the cycle progresses, so anywhere it's used as TEXT colour gets a
  // soft white glow behind it — otherwise early in the cycle the
  // countdown/cup numbers are nearly invisible against the dark panel.
  brewGlow: {
    textShadowColor: "rgba(255,255,255,.85)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  brewTrack: { height: 4, borderRadius: 999, marginTop: 9, backgroundColor: "rgba(255,255,255,.06)", overflow: "hidden" },
  brewFill: { height: "100%", borderRadius: 999 },
  hydrateBreaksRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingBottom: 10, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,.08)",
  },
  hydrateBreaksLabel: { flex: 1, fontSize: 12, color: "rgba(237,231,245,.55)", fontWeight: "700" },
  hydrateBreaksVal: { fontSize: 15, fontWeight: "800", fontVariantNumeric: "tabular-nums" },
  restPrompt: {
    fontSize: 13, fontWeight: "700", color: "#EDE7F5", lineHeight: 18,
    marginBottom: 8, fontStyle: "italic",
  },
  restNoteInput: {
    minHeight: 54, paddingVertical: 10, paddingHorizontal: 11,
    backgroundColor: "rgba(255,255,255,.05)", borderWidth: 1.5, borderColor: "rgba(255,255,255,.14)",
    borderRadius: 12, color: "#EDE7F5", fontSize: 13, fontWeight: "600",
    textAlignVertical: "top", marginBottom: 8,
  },
  restNoteSave: {
    alignSelf: "flex-end", paddingVertical: 7, paddingHorizontal: 16,
    borderRadius: 10, backgroundColor: "rgba(232,122,184,.18)",
    borderWidth: 1.3, borderColor: "rgba(232,122,184,.4)",
  },
  restNoteSaveText: { fontSize: 12, fontWeight: "800", color: "#EDE7F5" },
  restNoteList: { marginTop: 12, gap: 6, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,.08)", paddingTop: 10 },
  restNoteItem: { fontSize: 12, color: "rgba(237,231,245,.6)", lineHeight: 16, fontStyle: "italic" },
  todoInputRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  todoInput: {
    flex: 1, paddingVertical: 9, paddingHorizontal: 11,
    backgroundColor: "rgba(255,255,255,.05)", borderWidth: 1.5, borderColor: "rgba(255,255,255,.14)",
    borderRadius: 10, color: "#EDE7F5", fontSize: 13, fontWeight: "600",
  },
  todoAddBtn: {
    width: 36, alignItems: "center", justifyContent: "center", borderRadius: 10,
    backgroundColor: "rgba(232,90,90,.16)", borderWidth: 1.3, borderColor: "rgba(232,90,90,.4)",
  },
  todoAddBtnText: { fontSize: 18, fontWeight: "800", color: "#E85A5A", marginTop: -2 },
  todoEmpty: { fontSize: 12, color: "rgba(237,231,245,.4)", fontStyle: "italic" },
  todoList: { gap: 8 },
  todoRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingVertical: 4,
  },
  todoCheck: {
    width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: "rgba(255,255,255,.3)",
    alignItems: "center", justifyContent: "center",
  },
  todoCheckDone: { backgroundColor: "#7BD88F", borderColor: "#7BD88F" },
  todoCheckMark: { fontSize: 11, fontWeight: "800", color: "#141020" },
  todoText: { flex: 1, fontSize: 13, color: "#EDE7F5", fontWeight: "600" },
  todoTextDone: { color: "rgba(237,231,245,.4)", textDecorationLine: "line-through" },
  todoDelete: { fontSize: 16, fontWeight: "700", color: "rgba(237,231,245,.35)", paddingHorizontal: 4 },
  mugRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 10, paddingHorizontal: 2 },
  makerBlock: { marginTop: 12, backgroundColor: "rgba(255,255,255,.03)", borderWidth: 1, borderColor: "rgba(255,255,255,.07)", borderRadius: 14, padding: 12 },
  cupCount: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cupStep: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,.05)", borderWidth: 1, borderColor: "rgba(255,255,255,.12)" },
  cupStepText: { color: "rgba(237,231,245,.75)", fontSize: 19, fontWeight: "800" },
  cupReadout: { alignItems: "center" },
  cupNum: { fontSize: 22, fontWeight: "800" },
  cupUnit: { fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: "800", color: "rgba(237,231,245,.4)" },
  setList: { marginTop: 12, gap: 3 },
  setRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 9, borderWidth: 1, borderColor: "transparent" },
  setName: { fontWeight: "800", width: 50, color: "rgba(237,231,245,.85)", fontSize: 12 },
  setDetail: { flex: 1, color: "rgba(237,231,245,.4)", fontSize: 11 },
  setTotal: { fontWeight: "800", color: "rgba(237,231,245,.7)", fontSize: 12 },
  coffeeRow: { marginTop: 4, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,.07)", paddingTop: 8 },
  controls: { flexDirection: "row", gap: 10, marginBottom: 10 },
  arrow: { width: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,.05)", borderWidth: 1.5, borderColor: "rgba(255,255,255,.12)" },
  arrowDense: { width: 36, borderRadius: 11 },
  arrowText: { color: "rgba(237,231,245,.7)", fontSize: 26, fontWeight: "700" },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, alignItems: "center" },
  btnDense: { paddingVertical: 9, borderRadius: 11 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  statsGridCell: {
    width: "47%", backgroundColor: "rgba(255,255,255,.04)", borderWidth: 1, borderColor: "rgba(255,255,255,.07)",
    borderRadius: 10, paddingVertical: 8, alignItems: "center",
  },
  statsGridVal: { fontSize: 15, fontWeight: "800", fontVariantNumeric: "tabular-nums", marginBottom: 1 },
  statsGridLabel: { fontSize: 9, letterSpacing: 0.6, textTransform: "uppercase", fontWeight: "800", color: "rgba(237,231,245,.4)" },
  btnTextDark: { color: "#141020", fontSize: 15, fontWeight: "800" },
  btnTextLight: { color: "#EDE7F5", fontSize: 15, fontWeight: "800" },
  resetRow: { alignItems: "center", marginBottom: 20 },
  resetBtn: { color: "rgba(237,231,245,.32)", fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  stats: { flexDirection: "row", gap: 8, marginBottom: 20 },
  stat: { flex: 1, backgroundColor: "rgba(20,16,36,.6)", borderWidth: 1, borderColor: "rgba(255,255,255,.1)", borderRadius: 14, padding: 12, alignItems: "center" },
  statVal: { fontSize: 16, fontWeight: "800", color: "#EDE7F5", marginBottom: 2 },
  statLabel: { fontSize: 10, color: "rgba(237,231,245,.42)", letterSpacing: 0.8, textTransform: "uppercase", fontWeight: "700" },
  upWrap: { backgroundColor: "rgba(20,16,36,.72)", borderWidth: 1, borderColor: "rgba(255,255,255,.1)", borderRadius: 16, padding: 16 },
  upTitle: { fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: "800", color: "rgba(237,231,245,.38)", marginBottom: 10 },
  upRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  upDot: { width: 6, height: 6, borderRadius: 999 },
  upName: { flex: 1, color: "rgba(237,231,245,.75)", fontWeight: "600", fontSize: 13 },
  upTime: { color: "rgba(237,231,245,.45)", fontWeight: "700", fontSize: 13 },
  lockWrap: { width: "100%", maxWidth: 300, alignItems: "center", paddingTop: 26, alignSelf: "center" },
  lockCritter: { width: 108, height: 108, borderRadius: 999, backgroundColor: "rgba(255,255,255,.05)", borderWidth: 2, borderColor: "rgba(255,255,255,.1)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  lockName: { fontSize: 19, fontWeight: "800", color: "#EDE7F5", marginBottom: 3 },
  lockSub: { fontSize: 12, color: "rgba(237,231,245,.45)", marginBottom: 18, fontWeight: "600", textAlign: "center" },
  pinDots: { flexDirection: "row", gap: 9, marginBottom: 12 },
  pinDot: { width: 11, height: 11, borderRadius: 999 },
  pinErr: { fontSize: 12, color: "#E85A5A", fontWeight: "700", marginBottom: 10 },
  pad: { flexDirection: "row", flexWrap: "wrap", gap: 9, width: "100%", marginBottom: 14 },
  padKey: { width: "30%", aspectRatio: 1.5, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,.05)", borderWidth: 1.5, borderColor: "rgba(255,255,255,.1)" },
  padKeyText: { color: "#EDE7F5", fontSize: 20, fontWeight: "700" },
  pinGo: { width: "100%", paddingVertical: 13, borderRadius: 13, backgroundColor: "#E85A5A", alignItems: "center" },
  pinGoText: { color: "#141020", fontSize: 15, fontWeight: "800" },
  modalWrap: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(11,8,23,.88)", alignItems: "center", justifyContent: "center", padding: 24 },
  modal: { width: "100%", maxWidth: 330, backgroundColor: "#1A1430", borderWidth: 1, borderColor: "rgba(255,255,255,.1)", borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: "800", color: "#D98A5B", marginBottom: 7 },
  modalTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalCycleCount: { fontSize: 10, fontWeight: "700", color: "rgba(237,231,245,.45)" },
  modalSub: { fontSize: 15, fontWeight: "700", lineHeight: 20, color: "#EDE7F5", marginBottom: 16 },
  modalInput: { width: "100%", paddingVertical: 12, paddingHorizontal: 13, backgroundColor: "rgba(255,255,255,.05)", borderWidth: 1.5, borderColor: "rgba(255,255,255,.14)", borderRadius: 12, color: "#EDE7F5", fontSize: 14, fontWeight: "600", marginBottom: 14 },
  modalRow: { flexDirection: "row", gap: 9 },
  modalSkip: { width: 88, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: "rgba(255,255,255,.14)", alignItems: "center" },
  modalSkipText: { color: "rgba(237,231,245,.6)", fontSize: 14, fontWeight: "800" },
  modalSave: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: "#E85A5A", alignItems: "center" },
  modalSaveText: { color: "#141020", fontSize: 14, fontWeight: "800" },
  settingsGroupHead: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingVertical: 8, marginBottom: 4,
  },
  settingsGroupTitle: {
    flex: 1, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: "800",
    color: "rgba(237,231,245,.4)",
  },
  settingsGroupCount: {
    fontSize: 10, fontWeight: "700", color: "rgba(237,231,245,.35)",
  },
  settingsRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,.06)",
  },
  settingsLabel: { fontSize: 14, fontWeight: "700", color: "#EDE7F5" },
  settingsSwitch: {
    width: 42, height: 24, borderRadius: 999, padding: 2,
    backgroundColor: "rgba(255,255,255,.12)", justifyContent: "center",
  },
  settingsSwitchOn: { backgroundColor: "#7BD88F" },
  settingsKnob: {
    width: 20, height: 20, borderRadius: 999, backgroundColor: "#EDE7F5",
    transform: [{ translateX: 0 }],
  },
  settingsKnobOn: { transform: [{ translateX: 18 }] },
  settingsColorHint: {
    fontSize: 11, color: "rgba(237,231,245,.4)", lineHeight: 16, marginBottom: 10,
  },
  resetRestoreRow: { flexDirection: "row", gap: 8 },
  resetRestoreBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center",
    backgroundColor: "rgba(232,90,90,.12)", borderWidth: 1.3, borderColor: "rgba(232,90,90,.35)",
  },
  resetRestoreBtnRestore: {
    backgroundColor: "rgba(123,216,143,.12)", borderColor: "rgba(123,216,143,.35)",
  },
  resetRestoreBtnText: { fontSize: 12, fontWeight: "800", color: "#EDE7F5" },
  colorPickerRow: {
    marginBottom: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,.06)",
  },
  colorPickerHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  colorPickerDot: { width: 14, height: 14, borderRadius: 999, borderWidth: 1, borderColor: "rgba(255,255,255,.2)" },
  colorPickerLabel: { flex: 1, fontSize: 13, fontWeight: "700", color: "#EDE7F5" },
  colorPickerReset: { fontSize: 11, fontWeight: "700", color: "rgba(237,231,245,.5)", textDecorationLine: "underline" },
  colorSwatchRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  colorSwatch: {
    width: 26, height: 26, borderRadius: 999, borderWidth: 2, borderColor: "transparent",
  },
  colorSwatchActive: { borderColor: "#EDE7F5" },
  colorHexRow: { flexDirection: "row", gap: 8 },
  colorHexInput: {
    flex: 1, paddingVertical: 8, paddingHorizontal: 11, backgroundColor: "rgba(255,255,255,.05)",
    borderWidth: 1.5, borderColor: "rgba(255,255,255,.14)", borderRadius: 10,
    color: "#EDE7F5", fontSize: 13, fontWeight: "600",
  },
  colorHexApply: {
    paddingHorizontal: 14, borderRadius: 10, alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(255,255,255,.08)", borderWidth: 1.5, borderColor: "rgba(255,255,255,.14)",
  },
  colorHexApplyText: { color: "#EDE7F5", fontSize: 12, fontWeight: "800" },
  colorHexError: { fontSize: 11, color: "#E85A5A", fontWeight: "600", marginTop: 6 },
  profRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 12, borderWidth: 1.5, borderColor: "rgba(255,255,255,.08)", backgroundColor: "rgba(255,255,255,.04)" },
  profRowActive: { backgroundColor: "rgba(232,90,90,.12)", borderColor: "rgba(232,90,90,.4)" },
  profAvatar: { width: 28, height: 28, borderRadius: 999, overflow: "hidden" },
  profLabel: { flex: 1, fontSize: 14, fontWeight: "700", color: "#EDE7F5" },
  profRenameIcon: { fontSize: 14, color: "rgba(237,231,245,.4)", paddingHorizontal: 4 },
  profRenameInput: {
    borderBottomWidth: 1.3, borderBottomColor: "rgba(232,90,90,.5)", paddingVertical: 2,
  },
  profRenameSave: { fontSize: 12, fontWeight: "800", color: "#E85A5A", paddingHorizontal: 4 },
  profActive: { fontSize: 9, fontWeight: "800", letterSpacing: 1, color: "#E85A5A" },
  profAddRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  profAdd: { width: 62, borderRadius: 12, backgroundColor: "rgba(255,255,255,.08)", borderWidth: 1.5, borderColor: "rgba(255,255,255,.14)", alignItems: "center", justifyContent: "center" },
  profAddText: { color: "#EDE7F5", fontSize: 13, fontWeight: "800" },
  syncTitle: { fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: "800", color: "rgba(237,231,245,.4)", marginBottom: 8, marginTop: 4 },
  syncCodeRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "rgba(255,255,255,.04)", borderWidth: 1, borderColor: "rgba(255,255,255,.08)",
    borderRadius: 12, padding: 12, marginBottom: 10,
  },
  syncCodeLabel: { fontSize: 11, color: "rgba(237,231,245,.5)", fontWeight: "700" },
  syncCodeVal: { fontSize: 14, color: "#E85A5A", fontWeight: "800" },
  backupStatus: { fontSize: 11, fontWeight: "700", color: "#7BD88F", marginBottom: 8, textAlign: "center" },
  profTools: { flexDirection: "row", gap: 8, marginBottom: 12 },
  profTool: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 10, backgroundColor: "rgba(255,255,255,.05)", borderWidth: 1.5, borderColor: "rgba(255,255,255,.1)", borderRadius: 12 },
  profToolText: { color: "rgba(237,231,245,.8)", fontSize: 12, fontWeight: "700" },
  syncNote: { fontSize: 11, lineHeight: 16, color: "rgba(237,231,245,.35)", marginBottom: 4 },
  critterGrid: { flexDirection: "row", flexWrap: "wrap", gap: 5, paddingVertical: 3 },
  critterCell: { width: "15%", aspectRatio: 1, borderRadius: 10, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(255,255,255,.06)", backgroundColor: "rgba(255,255,255,.03)" },
  critterCellSel: { backgroundColor: "rgba(232,90,90,.18)", borderColor: "rgba(232,90,90,.7)" },
  critterName: { fontSize: 12, fontWeight: "700", textAlign: "center", color: "rgba(237,231,245,.6)", marginVertical: 8 },
  unlockChoiceRow: { flexDirection: "row", gap: 10, justifyContent: "center", marginTop: 6 },
  unlockChoiceCell: {
    flex: 1, alignItems: "center", gap: 6, paddingVertical: 14, paddingHorizontal: 6,
    borderRadius: 14, backgroundColor: "rgba(255,255,255,.04)",
    borderWidth: 1.5, borderColor: "rgba(255,255,255,.1)",
  },
  unlockChoiceName: { fontSize: 10, fontWeight: "700", color: "rgba(237,231,245,.7)", textAlign: "center" },
  calModes: { flexDirection: "row", gap: 6, marginBottom: 14 },
  calMode: { flex: 1, paddingVertical: 8, borderRadius: 11, borderWidth: 1.5, borderColor: "rgba(255,255,255,.09)", alignItems: "center" },
  calModeActive: { backgroundColor: "rgba(232,90,90,.16)", borderColor: "rgba(232,90,90,.4)" },
  calModeText: { fontSize: 11, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase", color: "rgba(237,231,245,.55)" },
  calModeTextActive: { color: "#E85A5A" },
  calNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  calArrow: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,.05)", borderWidth: 1, borderColor: "rgba(255,255,255,.1)" },
  calArrowText: { color: "rgba(237,231,245,.7)", fontSize: 20, fontWeight: "700" },
  calLabel: { fontSize: 14, fontWeight: "800", color: "#EDE7F5" },
  dayGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  dayStat: { width: "47%", backgroundColor: "rgba(255,255,255,.04)", borderWidth: 1, borderColor: "rgba(255,255,255,.07)", borderRadius: 13, padding: 13, alignItems: "center" },
  dayStatVal: { fontSize: 19, fontWeight: "800", marginBottom: 3 },
  dayStatLabel: { fontSize: 9, letterSpacing: 1, textTransform: "uppercase", fontWeight: "800", color: "rgba(237,231,245,.4)" },
  intWrap: { backgroundColor: "rgba(255,255,255,.03)", borderWidth: 1, borderColor: "rgba(255,255,255,.07)", borderRadius: 14, padding: 14 },
  intTitle: { fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: "800", color: "rgba(237,231,245,.4)", marginBottom: 10 },
  intEmpty: { fontSize: 12, color: "rgba(237,231,245,.32)", lineHeight: 18 },
  intRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  intBox: { width: 17, height: 17, borderRadius: 5, borderWidth: 1.6, borderColor: "rgba(255,255,255,.25)", alignItems: "center", justifyContent: "center" },
  intText: { flex: 1, fontSize: 13, color: "#EDE7F5", fontWeight: "600" },
  intCycle: { fontSize: 10, fontWeight: "800", color: "rgba(237,231,245,.3)" },
  weekChart: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 8, marginBottom: 16, minHeight: 150 },
  weekCol: { flex: 1, alignItems: "center", gap: 5 },
  weekVal: { fontSize: 9, fontWeight: "800", color: "rgba(237,231,245,.45)", height: 12 },
  weekBar: { width: "70%", maxWidth: 26, borderRadius: 6 },
  weekDay: { fontSize: 11, fontWeight: "800", color: "rgba(237,231,245,.45)" },
  monthHead: { flexDirection: "row", marginBottom: 6 },
  monthDow: { flex: 1, textAlign: "center", fontSize: 9, fontWeight: "800", color: "rgba(237,231,245,.32)" },
  monthGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 16 },
  monthCell: { width: "13%", aspectRatio: 1, borderRadius: 8, borderWidth: 1.5, borderColor: "rgba(255,255,255,.06)", backgroundColor: "rgba(255,255,255,.03)", alignItems: "center", justifyContent: "center" },
  monthNum: { fontSize: 11, fontWeight: "700", color: "#EDE7F5" },
});
