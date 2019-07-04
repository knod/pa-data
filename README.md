# WARNING
DO NOT SHARE THE DATA YOU GET AND DO NOT PUT IT PUBLICLY ONLINE (no public repo or anything like that). This is for analysis only and it will be anonymized.

# First, thank you!

# Table of Contents
- tl;dr is at the top
- [Setting Up](#setting-up)
- [Running the Code](#running-the-code)
- [FAQ](#faq)

# tl;dr

1. Clone at https://github.com/knod/pa-data
2. Pick a row at https://docs.google.com/spreadsheets/d/1HkdWJVs0fMROBgHt8xol1gVV252ln8D5dhSEuDQzeT4/edit?usp=sharing that hasn't been assigned to someone and add your name. Run the command in the **Command** column.

**Do not run this in multiple terminals. It's slow on purpose.**

# Without Sound

Add `"{\"alerts\":\"no\"}"` to the end of your command. (See lower down for [settings](#settings))

# Setting Up
You need to have these on your computer

## nodejs

Use homebrew if you've got it (you'll know if you do). Installing globally is easiest.

If you don't know how to install it already, download it manually: https://nodejs.org/en/download/. It may get put in a hidden folder. We're trying to figure out if that's bad. Let us know if you have it figured out.

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

### Windows: Git Fallback
Download here (https://git-scm.com/download/win) into the same folder as nodejs? We're working on figuring this out.

## nodejs
- If you're on **windows** and downloaded nodejs manually, find where it got installed on your computer. Put all the other folders in this folder with it. It may be in a hidden folder. We're working on figuring that out.

## Get the Code
1. go to https://github.com/knod/pa-data
1. If you know how:
  - clone the repo
1. If not:
  - click 'clone or download'
  - click 'download zip'?
  - extract folder
  - If you downloaded and extracted on **windows**: put it in the same folder where nodejs is
  - DO NOT DELETE THIS FOLDER

## Windows: Audio

If you're on windows and you want the alert sound to work and you don't have an mp3 player already, try these instructions (see 'Windows – install audio player'): https://thisdavej.com/node-js-playing-sounds-to-provide-notifications/. No one I know has tried this yet.

# Running the Code

## Before Anything Else!
- Make sure your computer isn't going to go to sleep.
- Plug your computer into power.

## Command Prompt/Terminal
1. open command prompt
1. [navigate](https://www.groovypost.com/howto/open-command-window-terminal-window-specific-folder-windows-mac-linux/) into extracted folder
1. type: `npm install`
1. press enter
1. wait

## Get Your Assignment
1. You don't have to do one whole assignment all at once. Completing an assignment can take at least 9 or 10 hours in total.
1. Open a browser and go to [the spreadsheet](https://docs.google.com/spreadsheets/d/1HkdWJVs0fMROBgHt8xol1gVV252ln8D5dhSEuDQzeT4/edit?usp=sharing).
1. Pick a row (if you don't already have an assignment) and put your name under the **Who** column.
1. Copy the text in the **Command** column.

## Run it
1. **Do not run this in multiple terminal windows.** It's slow on purpose.
1. Go to your command prompt and paste the code from the google doc
1. Press enter
1. You might get an error the first time you run the assignment. Just run it again.
1. It'll now probably keep going till it's done with the assignment and prints the message 'success'.

## Things
1. There might be sound effects if your sound is on, including a clucking sound effect for finishing.
1. There will sometimes be errors. You can usually just let it run - the code can usually deal with those, though sometimes it has to make itself wait for an hour or two.
1. **When in any doubt whatsoever**, you know who to contact!

## After Finishing an Assignment... Start a New One!
1. Check the google doc to put your name next to another assignment. (See [getting your assignment](#get-your-assignment))
1. The command may have changed. It should be updated in there, so copying and pasting should be fine.
1. Possibly (if you cloned the repo and want to risk possible new bugs) do:
  1. `git add .`
  1. `git commit`
  1. `git pull origin master`
  1. `npm install`


# Settings

In the `assignments` folder, you will find your assignment json file containing your default object. Those are your settings. If you want to change any of them, you can put a json object at the end of your command. It'd look something like this:

**windows**

`node mdj-by-names.js mdj5k "{\"wait\":600,\"alerts\":\"no\"}"`

**mac**

`node mdj-by-names.js mdj5k '{"wait":600,"alerts":"no"}'`

- `wait`: It's used to `throttle` in several places. It's multiplied by different values in those places. If you need more throttling, give this a larger value.
- `alerts`: Sounds will alert you to the state of the program, but it's meant to be just left to run. If you don't want the sounds, set this to `"no"`.

It's probably not a good idea to customize other ones. They're what's keeping everyone in line.


# FAQ
1. You'll still be able to do other stuff on your computer.
1. You can run it at night safely.
1. **You should not run this in multiple terminal windows.** It's slow on purpose. See the last item here.
1. You'll be able to use other terminal windows for other things.
1. You don't have to do one whole assignment all at once. Completing an assignment can take at least 9 or 10 hours in total.
1. There will sometimes be errors. You can usually just let it run - the code can usually deal with those, though sometimes it has to make itself wait for an hour or two.
1. There are sound effects. You can opt out. See [Settings](#settings).
1. The code should run by itself. You shouldn't have to do anything after running the command. It should do the whole assignment.
1. When it finishes all of the assignment, it'll show the message 'success' at the bottom. It might cluck.
1. If it gets interrupted and you have to put in the command again, it should remember where it was when it stopped.
1. If it gets stuck on the site in various ways, it'll deal with that too. It'll first wait a couple minutes and try again and then wait an hour or two before trying again. Those tactics usually work. If not, it will stop itself eventually with the message 'gave up'. You can definitely try starting again.
1. The code tries to limit itself to less than 1 file per 4.5 seconds. If you go over 830 files in 1 hour you have a good chance that their servers won't like your computer anymore for (we think) 2 hours.


# halp us!

If you know sites with tutorials we can link to for some of this stuff, let us know. If you have thoughts on improving the instructions, give us a shout.


# If something is weird and you're not sure
Don't hesitate to reach out. We want your sweet sweet messages!
