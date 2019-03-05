# Project 2: True Different or Fake! by Samuel Pare-Chouinard

TRUE DIFFERENT OR FAKE

Jame's Briddle's essay is unsettling indeed, and I found it difficult not to
take the subject completely literally when creating something that responds
to it. My initial plan was to create a system of "youtube" channels that produce "videos"
comprised of a series of words. Some channels produce original bad content,
some produce original good content, while others would copy either channel
and vary their content using random content extracted from other channels. The
goal would have been to censor the "channels" in an attempt to maintain a healthy
youtube ecosystem for your parrot who is repeating random words he hears.

As I was creating this the question of what exactly was going to drive the
game forward seemed increasingly difficult to answer. I realized the goal was
rather abstract and would probably require extensive experimentation before
taking a concrete shape. So I looked for a simpler basic idea that would
use a similar system of creating content, mixing it up and asking the user to
compare originals and copies.

It turns out two inspirations brought me to my final concept: a game played in
a recent FFAR 250 tutorial in which we invented fake word definitions and voted on
whose definition was most convincing - and a funny/unfunny comic strip (from the series Atelier
Mastodonte) in which the joke was about comparing the names of famous people's
names with names of cheeses that sounded similar ("movie director or cheese?").
Both I found to be fun and simple concepts.

The resulting idea is a game in which the user is given a main word, then is asked to distinguish between
the definition of a word, the definition of other words, or a mixed (composite)
definition made of other definitions currently in use. The word the definition applies
to is not shown until the user makes his guess.

The other word definitions can be either related or unrelated to the main word in question, creating a certain level of
difficulty. Some definitions are easy to recognize, while others will cause
the user to start second-guessing himself.

I used RiTa.js to find random words, then I use onelook dictionary's API to
query word definitions and synonym lists. Onelook API is easy to use, but has
some drawbacks. For one thing, the dictionary gives the same definition to multiple
similar words without nuancing them. This creates a confusing game when the synonyms
and the main word's definition are exactly the same.

My main challenge was setting up the chain of queries necessary to start the game.
The program must find random words, define them, find related words, define them,
then create composite definitions. Queries can be unsuccessful (as I understand it
some words don't return results), creating the need for certain parts of the query
chain to loop until they have successfully found all the content they require
before moving on. The query chain also had to be written in a way that allows for
it to be triggered again at the end of each round. Thus why I placed the entire
game setup inside a class object, so that it could be restarted easily.

Oh yeah, I also kept the parrot from my initial idea.
It was a nice reason to add voice commands. You can play this game by clicking or via conversation.
