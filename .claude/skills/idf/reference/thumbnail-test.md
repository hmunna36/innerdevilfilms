# Three thumbnails, three titles, one test (every long-form video, every channel)

The owner, 22 Nov 2026: "update all my active long form schedulers, it should follow these, create 3 thumbnails
from chatgpt and always A/B test". This file is the shared procedure. Each channel's skill names its own details
(where the files go, whether the words are drawn by ChatGPT or added in code, which Studio account). Copies of this
file sit in each channel's repository beside its skill backup; this one (`~/.claude/reference/thumbnail-test.md`) is
the one the Mac runs read. If you change it, copy it to the repositories too.

Why: on 22 Nov 2026 both Epics: What If films had a click rate of about 4% while the people who did click stayed
(43% of the film watched). The film was not the problem; the thumbnail and title were. YouTube's own test shows each
viewer one of up to three pairs and keeps the pair that earns the most watch time. It costs one extra step per film.

Applies to long-form videos only. Shorts have no thumbnail test.

## 1. Write three pairs before drawing anything

A pair is one thumbnail and the title that goes with it. The three pairs are three different IDEAS, not three
versions of one picture: a different moment of the film, a different promise.

- Pair 1 is the channel's usual pattern (the title the skill already asks for). The video is uploaded with pair 1,
  and YouTube falls back on it wherever it does not run the test.
- Pair 2 and pair 3 each take another angle. Angles that have worked as candidates: the person and what is at stake
  ("What If Bhishma Had Saved Draupadi?"), the consequence ("One Sentence Could Have Stopped the Mahabharata War"),
  the surprising number, the question the viewer already has.
- Every title is true to what the film shows. No promise the film does not keep. Under 100 characters, the first
  60 carry the meaning. Channel rules for titles (no body counts, no sexual wording, and so on) hold for all three.
- Thumbnail words: 2 to 4 words, different from the title's words, a spoken line or a question rather than a
  single noun ("HE IS MY SON!", "NO WAR?", "GAME OVER!"). Very large, across the TOP. Nothing that matters in the
  bottom-right corner: the time stamp covers it. One clear subject, faces large.
- If the last film's test has a result (step 6), pair 1 follows the winner's pattern.

Write the three pairs into the film's upload notes before opening ChatGPT.

## 2. Draw the three thumbnails in ChatGPT (the owner's Chrome, Claude in Chrome)

- One chat per film. In the first message attach a reference that carries the channel's look (the skill says which:
  a still of the film, the last thumbnail, or the code cover) through the chat's hidden "Attach photos" file input
  (`file_upload`; never click the attach button, it opens a file picker you cannot see). The file must be in a
  folder this session can read: the project or the scratchpad.
- One picture per message. Say: 16:9; the scene (who is where, who is large, what each is doing); the exact words
  and that they go across the top as one line of very large thick letters, or "no lettering at all" when the
  channel adds its words in code; "the whole bottom-right corner must contain nothing important"; "nothing else
  written anywhere"; no real photographs, no logos. For pictures 2 and 3 say "same style, same characters".
- Wait until the stop button is gone and the last `main img` is wider than 1000 px. Download it inside the page:
  fetch the image's src as a blob, make an `<a download="name.png">`, click it. It lands in ~/Downloads.
- Crop the centre to 16:9, resize to 1280x720, save as JPEG (quality about 92, under 2 MB) in the film's folder.
- LOOK at each one, full size and at 336 px wide with a black time badge drawn in the bottom-right corner. Wrong
  spelling, a sixth finger, a character off-model, a real face or logo, words under the badge, unreadable at 336 px:
  ask again (three tries a picture at most).
- If ChatGPT or Chrome cannot be reached, asks for a sign-in or hits an image limit: wait 10 minutes and try once
  more, then build the missing thumbnails in code so there are still three, and say so in the report. Never type a
  password, never accept new terms or a permission.

## 3. Upload the film as the skill says, with pair 1

Thumbnail 1 and title 1 go up with the video exactly as before (Studio or the API).

## 4. Set the test in Studio (it can be set while the video is still scheduled)

Done on 22 Nov 2026 on three scheduled films: the button is there before release and the test saves. Until the
video is public, Studio shows "Ineligible" under "A/B testing titles" (hover: "Your video is not public"): that is
expected. It is meant to start by itself at release; NOT YET CONFIRMED on a real release (the first three go public
22 and 23 Nov 2026), so the next run of each channel checks that the previous film says "Running…" and, if it still
says "Ineligible" on a public video, opens the test and saves it again.

Use the right video: take the video id from the channel's own schedule (`yt.mjs upcoming`, or Studio's content
list), never from a notes file. On 22 Nov 2026 a film had two uploads (a private first version and the scheduled
second one) and its notes named the wrong one.

1. Open `https://studio.youtube.com/video/<videoId>/edit?authuser=0` in a new tab. If the page says "Oops", try
   `authuser=1`, `2`, `3` until the page shows this video's title (History Frontline is a separate Google login; it
   was `authuser=2` on 22 Nov 2026; the other channels opened with `authuser=0`). This does not switch the account
   of any other tab, so it cannot disturb another routine. Do not use the account switcher for this.
2. Click the "A/B testing" button under the title. In the dialog choose "Title and thumbnail".
3. Slot 1 already holds the video's own thumbnail and title. Put thumbnail 2 and thumbnail 3 into the dialog's
   second and third hidden file inputs with `file_upload` (find them with `find`: "Upload thumbnail 2" /
   "Upload thumbnail 3" file input). Type title 2 into "Add title 2" and title 3 into "Add title 3".
4. The foot of the dialog must say "Title and thumbnail test ready". Read the three titles back from the page.
   Click "Set test", then "Save" on the video details page.
5. Reload the edit page and check: "A/B testing titles" with the three titles under it ("Running…" on a public
   video; on a scheduled one it starts at release).
6. Close the tab.

After the test is set, do NOT set the thumbnail or the title again through the API or the details page: that ends
the test. To change a running test: "View test report" → "New test" → "Continue" (this deletes the running one);
do that only when the owner asks.

If Studio asks for a sign-in, a password, new terms or a permission, or the button is missing: leave the video with
pair 1, and put "TEST NOT SET" with the reason and the three pairs at the top of the report. The next run of the
same routine sets it (step 6).

## 5. Record it

In the film's upload notes: the three pairs (file name, the thumbnail's words, the title), the time the test was
set, and "result due about two weeks after release". Commit the three thumbnail files with the film.

## 6. At the start of every run: read the last test

When the run reads the channel's numbers, open the previous film's edit page the same way and click "View test
report". Write into the channel's numbers file: the winner (or "still running" / "no clear winner"), each pair's
share of watch time, and one line on what the winner's pattern is. This film's pair 1 follows that pattern. If the
previous film says "TEST NOT SET" in its notes and has no test, set it now with its saved thumbnails and titles.
Never delete or restart a running test.
