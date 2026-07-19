# ScoutScholar — Live Site Smoke Test Checklist

## Landing page (`/`)
- [ ] Page loads, Lottie mascot animates (not a static frame)
- [ ] "Let's talk →" button navigates to `/evaluation`

## Form validation (`/evaluation`)
- [ ] Submit with Institution empty → error banner: "Please fill in: Institution."
- [ ] Enter CGPA `15` → error banner lists "CGPA"
- [ ] Select test taken = GRE, score `250` (below 260 min) → error: "GRE scores range from 260 to 340."
- [ ] Select Destination "Other", leave the free-text box empty → error lists "Destination"
- [ ] Select Destination "India" (or type "india"/"bharat" in Other) → blocked with: "ScoutScholar helps you plan studying abroad — please choose an international destination."
- [ ] Set Graduation Year 2+ years after Target Intake year (e.g. grad 2030, intake Fall 2027) → inline amber warning appears under Target Intake: "Heads up — you'd still be mid-degree at this intake..."

## Happy path submit
- [ ] Fill a fully valid profile and submit
- [ ] Screen transitions to the conversation/anticipation view — form is replaced, not shown alongside
- [ ] Context card shows your entered values: Degree, Major, CGPA, Institution, Destination, Target Programs (chips), Target Intake, graduation year (if set), test score strip (or "No test scores yet")
- [ ] "Scout is thinking" bubble shows, message cycles every ~3.5s through several distinct lines (e.g. "Reading through your profile...", "Scanning universities in {destination}...")
- [ ] Pulsing circular indicator animates below the thinking bubble
- [ ] Results appear in the same screen (continuous chat) below: Scout intro bubble ("Alright! I have gone through your profile...")
- [ ] Four cards render in order: **Profile** (badge: Strong/Competitive/Needs Work), **Schools That Match Your Profile** (Safety/Target/Reach badges), **Gaps to Address**, **What to Do Next**
- [ ] Closing Scout bubble shows `next_step_outline` text at the bottom

## Edit button
- [ ] Click Edit while "Scout is thinking" is showing (loading) → returns to form immediately, no stray results/error appear afterward (in-flight request aborted cleanly)
- [ ] Click Edit after results are shown → returns to form with previous values still filled in

## Gaps card conditional
- [ ] Submit a strong profile (e.g. high CGPA, elite institution, high test score) → **Gaps to Address** card does not render at all

## input_review states
- [ ] Same institution/destination country (e.g. Indian institution + India-adjacent... use a same-country pair the backend can infer, since the form itself blocks literal "India") → amber warning banner above the intro bubble
- [ ] Abusive/malicious text in Institution field → red rejection card only ("ScoutScholar can only evaluate genuine student profiles" or similar), with "Edit Your Profile" button, no result cards
- [ ] Normal clean profile → no amber/red banner at all, straight to intro bubble + cards

## Error / retry flow
- [ ] Trigger a backend error (e.g. throttle/offline) → amber error box: "We're having trouble evaluating your profile right now. Please try again in a moment." with a "Try Again" button
- [ ] Click "Try Again" → re-submits the same profile without needing to refill the form
