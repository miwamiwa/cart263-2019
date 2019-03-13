# Project 2: True Different or Fake! by Samuel Pare-Chouinard

TRUE DIFFERENT OR FAKE

Jame's Briddle's essay is unsettling indeed, and I found it difficult not to
take the subject completely literally when creating something that responds
to it. My initial plan was to create a system of "youtube" channels that produce "videos"
comprised of a series of words, and create a game around a Parrot character that
innocently repeats horrible things, which would have called for your talents in
censorship or something like that. Not really knowing how to give purpose to such a creation,
I decided to forget about shock value and explore the concept of procedurally
making pastiches of data instead.

Two inspirations brought me to my final concept: a game played in
a recent FFAR 250 tutorial in which we invented fake word definitions of a word and voted on
whose definition was most convincing - and a comic strip (from the series Atelier
Mastodonte) in which the joke was about comparing the names of famous people's
names with names silly things that sounded similar ("klein: painter or underwear?").

The resulting idea is a game in which the user is given a word and some definitions,
and has to guess whether the definitions define that word, or another word, or are just
a fake mishmash of definitions. I also kept the parrot from my initial idea.
He's an homage to my aunt's parrot, Fred.

The "other" words are either related words or completely random. It's hoped that
related words might have slight nuances that confuse the user and lead him to second-
guess himself.. In practice this isn't a difficult game at all since the composite
definitions are often not so coherent. Sometimes you get caught off guard
somewhere and that's always interesting however. The random choices in the composited
definitions can lead to funny combinations sometimes.

I used RiTa.js to find random words, then I used onelook dictionary's API to
query word definitions and synonym lists. Onelook API is easy to use, but has
some drawbacks: many similar words have exactly the same definition for example.

My main challenge was setting up the chain of queries necessary to start the game.
The program must find random words, define them, find related words, define them,
then create composite definitions. Queries can be unsuccessful (as I understand it
some words don't return results), creating the need for certain parts of the query
chain to loop until they have successfully found everything I need to move on to the next part.

The parrot was a nice reason to add voice commands. You can play this game by clicking,
or via conversation with the parrot. I created an animated head to go with it,
and matched its movement to the sounds that play (to some extent. see code!)

Visual elements came last in this project! I made an animation to fill the
sometimes lengthy loading time, and ended up using more of it throughout the game.
I played used and omitted the background() element to create
certain types of visual effects in game.
