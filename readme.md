# YouTube Gamepad

[![GitHub Stars](https://img.shields.io/github/stars/puddlejumper9/YouTube-Gamepad.svg)](https://github.com/puddlejumper9/YouTube-Gamepad/stargazers) [![GitHub Issues](https://img.shields.io/github/issues/puddlejumper9/YouTube-Gamepad.svg)](https://github.com/puddlejumper9/YouTube-Gamepad/issues) ![Current Version](https://img.shields.io/badge/version-0.1.1-green.svg)

A userscript to allow control of YouTube.com with a PlayStation, Xbox, or other supported gamepad. Developed with a PS4 controller but should work with any gamepad the browser has a standard mapping for.

* * *

## Installation

You'll need a userscirpt manager. Tested and developed using [Tampermonkey](https://tampermonkey.net) but others should work as well.

Once you have a userscript manager, simply click [Automatically updating stub script](https://github.com/puddlejumper9/YouTube-Gamepad/raw/master/YouTube%20Gamepad.stub.user.js) and it should prompt you to install.

If you don't want the script to always run the latest version then use [YouTube Gamepad.user.js](https://github.com/puddlejumper9/YouTube-Gamepad/raw/master/YouTube%20Gamepad.user.js)<br/>
\*Note Tampermonkey can watch the URL for changes and prompt to update

## Usage

Control is context-aware and generally follows major elements of the YouTube page (e.g. the video itself, or comment area). As such the button bindings are only active when that specific area is the target of the script. When targeted the video shows no indication, but all other areas should have the focused element outlined in blue.

##### Video focus

-   Play/pause - A (Cross)
-   Toggle fullscreen - Y (Triangle)
-   Volume up/down - d-pad up/down
-   Seek forward/backward - d-pad right/left
-   Activate video menu - X (Square)
-   Select suggested videos - B (Circle)

Coming soon:

-   Frame forward/back (when paused) - RB/LB (R1/L1)
-   Fast forward/rewind - RT/LT (R2/L2)

##### Suggested Videos focus

-   Watch selected video - A (Cross)
-   Move up/down - d-pad up/down
-   Back to video - B (Circle)

Coming soon:

-   Selected video context menu - X (Square)

##### Video Menu focus

-   Move left/right - d-pad left/right
-   Select option - A (Cross)
-   Close video menu - B (Circle)

##### Context menu

Coming soon:

-   Move up/down - d-pad up/down
-   Select option - A (Cross)
-   Close context menu - B (Circle)
