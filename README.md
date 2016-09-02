# Asynchronous Bears
<strong>Language: JS+Node</strong>

I don’t think I can go any longer without properly understanding Asynchronous JavaScript.

In a nutshell, performing any action that takes longer than running a line of code (loading a file, sending a request, database lookups) cause the results to lag behind the code that is running. So you’ll see things like values printing as undefined because they haven’t gotten the information back in time.

This project loads two text files, filters one by the other, and then sends a request to wikipedia for each valid entry, and returns the first couple of sentences.

Then the tough part is returning all of those descriptions in the original order, in a common object.

Most of the code I wrote was based on this <a href="http://blog.dargacode.com/post/149805676176/mastering-asynchronous-javascript-callbacks">this video</a>, though I decided to load text from wikipedia instead of images, so I could keep it a console app. 

<img src ="http://67.media.tumblr.com/bf031a663f80bb325cd3e462293586c5/tumblr_inline_ocurobTDLp1tvc5hi_1280.png" width="650">
