# Warning
DO NOT SHARE THE DATA YOU GET OR PUT IT PUBLICLY ONLINE (like in a public repo). This is for analysis only and it will be anonymized.

# tl;dr

Pick a row at the bottom of https://docs.google.com/spreadsheets/d/1HkdWJVs0fMROBgHt8xol1gVV252ln8D5dhSEuDQzeT4/edit?usp=sharing and add your name.

**Without sound:**
Add ` no` to the end of the command on your row

# You need
to have these on your computer

## nodejs

Use homebrew if you've got it (you'll know if you do). Installing globally is easiest.

If you don't know how to install it already, download it manually: https://nodejs.org/en/download/. It may get put in a hidden folder. We're trying to figure that out.

## git

### New instructions!
1. Make an account on Github
2. Download the Github desktop application: https://desktop.github.com/
3. Open the application and log-in
- After you log-in it’ll show your username and some other information associated with your account – you can keep this information just as is it is
4. On the far right of the screen select “clone repository”
5. Move over to the “URL” tab and enter the URL for our project: https://github.com/knod/pa-data
- You can also assign a file location for the folder your are cloning
6. Click “Fetch origin” at the top of the page to make sure you have cloned the most up-to-date version of the code

### Fallback
Same kind of deal here.

Download here (https://git-scm.com/download/win) into the same folder as nodejs? We're working on figuring this out.

## Audio

### Windows

If you're on windows and you want the alert sound to work and you don't have an mp3 player, try these instructions (see 'Windows – install audio player'): https://thisdavej.com/node-js-playing-sounds-to-provide-notifications/. No one I know has tried this yet.

### Sound is Annoying

To stop it (I hope):

Add ` no` to the end of your command (which I'll describe later). So something like `node mdj-names3.js 38001 39000 3500 no`.

Or `ctrl + c`

I haven't figured out how to make the sounds shorter. Otherwise, I think they just have to finish. Let me know if you have a problem.

## halp us!

If you know sites with tutorials to do this better, let us know!


# Do
- make sure your computer isn't going to go to sleep
- plug your computer into power

## nodejs
- If you downloaded nodejs manually, find where it got installed on your computer. May be in a hidden folder. We're working on figuring that out.

## Get code
1. go to https://github.com/knod/pa-data
1. If you know how:
  - clone the repo
1. If not:
  - click 'clone or download'
  - click 'download zip'?
  - extract folder
  - If you downloaded and extracted: put it where node is
  - DO NOT DELETE THIS FOLDER

## Directories
1. **if it's not there already, add a folder called `data-mdj`**
1. Somewhere completely different on your computer, make another folder. Call it whatever you want. `pa-data-data` is one idea and is how I'll talk about it from now on. Later you'll see you're going to move the data there periodically. Thumb drive is good if you don't want it on your machine.
1. Make a folder inside `pa-data-data` called `data-mdj`

## Command prompt/terminal
1. open command prompt
1. navigate into extracted folder
1. type: `npm install`
1. press enter
1. wait
1. Open a browser and go to [the spreadsheet](https://docs.google.com/spreadsheets/d/1HkdWJVs0fMROBgHt8xol1gVV252ln8D5dhSEuDQzeT4/edit?usp=sharing). At the bottom table, pick a row and put your name next to one of the commands listed under 'Current Range of Indexes'. That will be the command you're going for. The first number is what index you're starting at. The second number is your goal index. They're inclusive. ~type what michelle says to type (will be something like: `node mdj-names.js 6 10 15000`)~

## Run it
1. Go to your command prompt and put in the command that was in your row.
1. press enter
1. this will take a long time
1. there will be a lot of errors that don't matter
1. I get between 40 and 100 'Name index: #' messages before something goes wrong and the program stops. See [Errors to Worry About](#errors-to-worry-about). If not, you're a lucky duck!
1. There might be a clucking alert sound when the process is done running. Somewhere near the bottom (maybe before some errors) the word `success` should appear
1. Wait for the command prompt to reappear or (if it takes over 2 min or something) open a new terminal window in that same directory. (Yeah, not sure what's going on there...)

## Finish

1. Do the [Keeping Data](#keeping-data) instructions.
1. Possibly (if you cloned the repo) do `git pull origin master`. I'm not always sure when I'm introducing bugs, so do this at your own risk.
1. If you `pull`ed, do `npm install`.
1. Pick a new row in the google doc. Do this again!

## Errors to Worry About
There will be a bunch of errors. As long as the number after the text 'new pg at end' keeps changing, it's good.

Bad errors may cause the 'police' alert sound. They have this as their first line: `page not found`or `Error: Error: failed to find element matching selector "#ctl00_ctl00_ctl00_cphMain_cphDynamicContent_cphDynamicContent_participantCriteriaControl_lastNameControl"`.

If that happens:
1. Wait for the command prompt to appear again (hoping this lets any last files download). If it takes too long (over 2 min or something), move to the next step.
1. Press `ctrl` and `C` at the same time to quit the process.
1. Do the [Keeping Data](#keeping-data) instructions.
1. Possibly (if you cloned the repo) do `git pull origin master`. I'm not always sure when I'm introducing bugs, so do this at your own risk.
1. If you `pull`ed, do `npm install`.
1. You're going to type in a new command now.
1. Look in the 'mdj-name-index.json' file.
1. Use that number as the first number in the command. That is, if your original command was `node mdj-names3.js 42001 43000 3500` and 'mdj-name-index.json' has `42043`, then type in `node mdj-names3.js 42043 43000 3500`.
1. press enter.
1. let it run again.

If you get the same error, your IP address might be blocked. To test this go to a new browser window and go to https://ujsportal.pacourts.us/DocketSheets/MDJ.aspx. If you get an error message, your IP has been blocked. That's to keep their servers from getting overloaded, but I'm pretty sure we're not doing that.

If you have a VPN, you can switch your IP address, which is a shame, but you've already done so much!

If you want to keep trying, I think you just have to either just come back in 2hrs or so to be safe or:
1. wait a 10 or 20 min.
2. **Click in the address bar, delete the address, and paste in that address again.** (you get false negatives otherwise)
3. Go to that page.
4. See if it loads.
5. Try again until it loads.


# Keeping Data

For now, when the program is taking a break, just put the PDFs into the `data-mdj` you made in `pa-data-data`.

~You don't really want to keep the data hanging around the project folder. What if you accidentally overwrite it with a `git pull origin master` or something weird. So...~

~**When your program is stopped**~

1. ~**move** the pdfs from the project's `data-mdj` folder into the `data-mdj` you made in `pa-data-data`.~
1. ~**copy** the 'mdj-named-dockets-used.txt' into just the `pa-data-data` folder. Replace an older version if you need to.~

# If something is weird and you're not sure
don't hesitate to message michelle. She wants your sweet sweet messages.

