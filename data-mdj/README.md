<!-- README.md -->


# Definitions

**name:** Names are two-letter combos. They're used to make an **entry** object like `{ firstName: ab, lastName: qu }`. We can't use just one letter, it doesn't work.

**entry:** Example: `{ firstName: ab, lastName: qu }`.

**alternating vs. consecutive:** 'consecutive' means the name has two consecutive consonants. 'Alernating' are names without consecutive consonants.

```
Examples: st, th, tr
```

**nonmatching vs. matching:** 'matching' means the entry's first name and last name contain the same letters. Someone was too tired when making the names at first and only made those names. It's hard to tell which of those dockets got searched for and downloaded, so they're being excluded from the first organized effort.

```
Examples:
{ firstName: ab, lastName: ab }
{ firstName: ab, lastName: ba }
{ firstName: ba, lastName: ab }
{ firstName: ba, lastName: ba }
```

**shuffled:** A list of entries that has been shuffled. The first lists used were not shuffled.

**partial:** Lists that are made from the parts of other lists that we're sure weren't already downloaded.


# Descriptions
Descriptions of the different files and what they have in them.

## mdj_1
**Alternating, nonmatching, shuffled, partial**

Removed these name indexes from `names3.js` because we weren't sure if they'd been downloaded or not.
```
let indexesToRemove = [
  {start: 0, end: 4000},
  {start: 8000, end: 11000},
  {start: 20001, end: 21000},
  {start: 30001, end: 31000},
];
```
