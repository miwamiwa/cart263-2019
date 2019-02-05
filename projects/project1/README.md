# Project 1: Sisyphus' Beard by Samuel Pare-Chouinard

In this project I tried giving Sisyphus a slightly more relatable sisyphian trial. Instead of
pushing a boulder up a hill, I imagined Sisyphus attempting to trim a beard that never stops growing.
He does so in an attempt to impress his girlfriend who seems to care more about his
looks than what's going on in his life. Sisyphus can't succeed simply because his
curse comes from the Gods - it is beyond his control. His only way out is to accept
this setback and move on with his life, thus escaping the endless cycle of his
metaphorical death and rebirth. It's not a sad story; Sisyphus ends up with a
smile on his face.

The only way to finish the game is to let yourself fail, as hairs don't
stop growing even if the user can trim them all the way to their base. It is hoped
that the user will attempt to play then let go, whether or not he understood his fate.
The aim isn't to force him to play forever, though he could do that too.
In the process the user can experience Sisyphus' despair as he attempts
to save his doomed relationship.

Hair is represented as characters appended in a column; when the user clicks on a character
it is faded out and removed. Every time hair grows, I use last-child and position() to find
the height of the lowest hair, and check if it passed a milestone (threshold). The first
three milestones cause text to appear, while the last one ends the game.

Because game mechanics seemed rather simple, I built an introduction sequence that would
include other jQuery elements and also present the story to the user. The user has
to hover over the text to make it fall. Fallen text disappears, then a new paragraph
is displayed and the sequence repeats.

Introduction text is found inside <div> elements hidden within the html. I wrote a
function called setupText() that would separate each character in a paragraph into
individual <span> elements so that they could fall individually. Each span has a class
that indicates whether it is still, falling, or fallen. Once each span is ".fallen",
all spans are removed, and the next paragraph is processed using setupText().

Each falling character fires a basic granular synthesizer which provides SFX for the
intro sequence. I thought implementing a granular synth would be an easy way to
impose some variety on playing sound files without using too many elements unrelated
to jQuery. Further, the referential nature of the granular synth creates an interesting
question-reponse relationship between the intro and the game: during the intro,
random details of the sound file are heard, while during the game, the sample
used in the granular synth is played out in full.

There is a looping sound that starts as soon as the game starts (it's a bass sound, you
may need to wear headphones to hear it). In order to avoid issues with autoplay,
I created a dummy preload screen that asks the user to click on it to start the
game. This way the actual setup function is fired on click instead of on page load,
and sounds are guaranteed to start normally.

I kept visual aesthetics simple and silly. A quick doodle does the trick to
represent Sisyphus, and greek characters are used to represent his hair. I thought
it would be fitting that the visual elements remain simple html elements
since the game runs using jQuery, which is all about manipulating html.

The beard cutting game is a concept idea I had thought of earlier in January.
I find that it adapted well to this story. Here's a prototype I was working on
with p5.js: miwamiwa.github.io/chkchk/beard/assignment1
