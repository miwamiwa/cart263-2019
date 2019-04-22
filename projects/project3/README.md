CART 263 Project 3:
C'est ta toune! By Samuel Paré-Chouinard


==== INSTRUCTIONS ====

- On start, press spacebar to take a snapshot of your face (webcam can eventually
  effect performance if you don't), and click on the sketch to start sound.

- Use 2D pads and sliders on the left to manipulate the current selected motion.
Change motions by pressing keys 1, 2, 3 and 4.

- Use 2D pads and sliders on the right to manipulate the sounds of the instruments, or
the tempo.

- Select a beat in the timeline by clicking on it, then assign a note to it by choosing
a note on the keyboard. Each instrument gets its own row in the timeline.

- Delete notes on the timeline by right-clicking on them.

- Save data by pressing Q.



==== README ====

Earlier this semester I coded a running stick figure in 2D, because I was interested
in trying to figure out how to code body motions. For a while I've been wanting to make
a dancing game, so it seemed like that experiment could be a first step towards achieving
that. Feeling pretty satisfied with the running man I made, I set out to make a 3D version with more
complex motions. I reused the parts that changed limb motion while jumping,
and upgraded them to create a system of interchangeable dance moves (assignment 8).

This gets used as a building block in my final project. This project is meant as
an homage to a nifty game boy game which I enjoyed playing as a kind called Game Boy
Camera ( https://en.wikipedia.org/wiki/Game_Boy_Camera ). What amazed me the most about
the GBC was its numerous creative applications. It allowed the user to take pictures,
paint them, create animations and interactive slide shows. My favorite part was a
"dj" mini game which allowed the creation and manipulation of a short loop of
three-part chiptune music. Like many other features of the GBC, there was no goal
other than to channel a bit of creative energy.

It is this "dj" mini-game which I am referencing here by creating a music loop
which the user can free manipulate. I thought the dancing would be a nice visual
complement to the theme, and that it would even extend it if I allowed
the user to design his own dance patterns as well. So here is "C'est ta toune!"
which in québec means "that's your song!". In this app (or game?) the only goal is to
procrastinate endlessly by honing your own dance moves, and/or your own techno
loop.

Notable features:

- user can save his work and access it when he opens the page later.

- user can take a picture of his face and apply it to the dancing dude's face.

- music making using p5.sound objects. quite happy with these weird drums.

- live manipulation of sounds and motion using 2D pads, 1D sliders, a timeline
grid and a mini keyboard on screen.

- body motion composed of p5.js sine functions, rotations and 3D boxes

- mixing WEBGL and 2D UI elements. P5 function ortho() removes perspective scaling
to make it easier to click on things. Also, jQuery is used to align html text with
p5 elements since text() can't be used with WEBGL.

- background animations with random cubes and the animated ellipses from my loading
page in project 2. This time the ellipses follow the output of an fft() function
(fast Fourier transform) which analyzes the sketch's sound output. The big red
circle in the back is da bass.
