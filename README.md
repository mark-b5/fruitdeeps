# fruitdeeps

A damage-per-second calculator for Old School RuneScape that accounts for
overkill, and solves for which setup is fastest at every point in a fight.

Live at https://fruitdeeps.app/

## Why "overhit"

Most DPS calculators take an average damage per tick and divide the target's
health by it. That overestimates, because the killing blow almost always deals
more damage than the target had left and the excess is thrown away. The bigger
your hits are relative to remaining health, the further the estimate drifts.

fruitdeeps works from the full damage distribution rather than its average, so
wasted damage on the final hit is counted instead of assumed away. Concretely,
`getDist(hp)` folds every outcome that would deal more than the remaining health
into the exact-kill bucket.

## How it works

### Hit distributions — a trie over sorted hit combinations

A single attack can produce several hits, and the same combination can arrive in
any order. `HitFreqStore` sorts each combination descending and stores it in a
trie: an edge is a damage value, a root-to-node path is a combination, and the
node at the end accumulates that combination's probability.

Sorting first is the point. Without it, `[3,8,12]`, `[12,3,8]` and `[8,12,3]`
occupy three separate paths and their probabilities are spread across branches
that all describe the same outcome. With it, they collapse onto one path and the
probability accumulates in one place.

### Time to kill — dynamic programming over remaining health

Every setup has a damage distribution and an attack speed. `TtkOptimization`
builds a table of expected time-to-kill, indexed by remaining health, from the
bottom up:

```
T(0) = 0
T(h) = min over setups of [ expected time for that setup to finish from h ]
```

It starts at 1 health, works out which setup is fastest there, then counts
upward — each step reusing every result already computed, since a setup's time
from `h` depends on where its hits leave the target.

The output is not a single number. It is the fastest setup at *every* remaining
health value, plus the time each one would take.

### Why that matters

**The best setup changes as the fight progresses.** The highest-DPS option stops
being correct near the end, because a big slow hit spends time on health the
target no longer has. Anything that solves for one "best setup" across a whole
kill is answering a different question — and gets the endgame wrong precisely
when it matters most.

## Status

No longer actively maintained. Other calculators have since caught up and in
most cases surpassed it. It stays up because the approach still gets referenced,
and because the source is a compact worked example of solving a stochastic race
with per-action costs.

## Running it locally

```bash
git clone https://github.com/mark-b5/fruitdeeps
cd fruitdeeps
npm install
npm run dev
```

Then open http://localhost:3000.

## Updating game data

Item stats come from a community-maintained OSRS database on GitHub. NPC stats
are scraped from the wiki. Both are refreshed with the Node and Python scripts
in `importstuff/`.
