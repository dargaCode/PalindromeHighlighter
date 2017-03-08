# PalindromeHighlighter

I’ve written palindrome functions lots of times before, but making this larger app had a lot of interesting challenges.

I wanted to make a site similar to <a href="http://www.regexr.com/">RegExr</a>, where the editing and the highlighting happen in the same box in real time. Turns out I needed to make a second box behind the first box, so I could rewrite the html contents without losing the cursor position. The first box’s background is transparent, to reveal the highlights behind it. 

There are a lot of edgecases when it comes to pasting text and converting input to html. I caught every bug I could think of related to pasting html, typing code into the box, and pasting text with the wrong space formatting. 

If you manage to break it, please let me know!

<a href="http://dargacode.com/PalindromeHighlighter"><b>Live Webpage</b></a>

<img src ="http://68.media.tumblr.com/2e68c3b289b14bd6df8492dc52ea8474/tumblr_inline_omidvvxGTP1tvc5hi_1280.png" width="600">

