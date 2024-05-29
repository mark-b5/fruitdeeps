
# Fruitdeeps

Fruitdeeps is an easy-to-use overhit damage per second calculator for the popular MMO Oldschool Runescape (OSRS). OSRS presents complex combinatoric optimization problems that are not simple to solve, but fruitdeeps allows users to interface with these problems very quickly

## Live Version
https://fruitdeeps.app/

## Clone in local

Fruitdeeps is very easy to run locally.

In a command line, run the following commands:


Clone the repo

``` 
git clone https://github.com/washer83/fruitdeeps.git
```

Install packages
```
npm i
```

Run the dev server
```
npm run dev
```

That's it! Fruitdeeps should be available locally at http://localhost:3000

## Updating the items and NPCs

Fruitdeeps pulls item info from a maintained version of osrs-box located at https://github.com/Flipping-Utilities/osrsbox-db/

Npc info is scraped from the wiki using the py package mw-parser

To update items, simply navigate to the `fruitdeeps/` folder and run the following command:
(this may not work, but shouldn't be necessary assuming I push regular changes and they are pulled)

```
node importstuff/itempopulate.js
```

There are still a few items I haven't reworked yet from the combat change. You can see the status of that here:
https://docs.google.com/spreadsheets/d/1Cl6OtusiH1AcKLDNSot26S6tdcVS3Cn55vduyYKZkOk

To update Npcs, run the following two commands

```
python importstuff/dump_monster_stats_csv.py
node importstuff/npcpopulate.js
```

You may need to install python packages to run the python script. Also, you will likely need to be in module mode. To switch to module mode, open the file `package.json` and add

```
"type": "module"
```
