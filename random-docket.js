// random-docket.js

// Original code doesn't match current site
// https://github.com/CLSPhila/RecordLib/blob/master/RecordLib/number_generator.py

// let courts = ["CP", "MDJ"];
let courts = ["CP", "MC"];
let CP_types = ["CR", "MD"];//, "SA", "SU"];
let MC_types = ["CR"];//, "MD", "SA", "SU"];

let create_docket_number = function (years) {

  let court = courts[ Math.floor(Math.random() * courts.length) ];
  let county_num = random_digits(2);
  let docket_sequence = random_digits(7);
  let year = Math.floor(Math.random() * (years.max - years.min + 1)) + years.min;

  if (court === "CP") {
    let court_type = CP_types[ Math.floor(Math.random() * CP_types.length) ];
    let idParts = ["CP", county_num, court_type, docket_sequence, year];
    let id = idParts.join('-');
    return id;
  } else {  // MC?
    // This part didn't match up with what I saw online, so I had to change it
    let court_type = MC_types[ Math.floor(Math.random() * MC_types.length) ];
    let idParts = ["MC", county_num, court_type, docket_sequence, year];
    let id = idParts.join('-');
    return id;
  }
}

let random_digits = function(num_digits) {
  let num = '';

  for (let digit = 0; digit < num_digits; digit++) {
    num += Math.floor(Math.random() * 9);
  }

  return num;
}

// // Test
// console.log(create_docket_number({min: 2007, max: 2019}));

module.exports.create_docket_number = create_docket_number;

// """
// Generate srandom docket numbers
// Args:
//     num: the number of dockets numbers to create
//     court: CP or MD dockets? or "both" for both.
// """
// court = random.choice(["CP", "MDJ"]) if court == "either" else court
// county_num = f"0{ random.randrange(1,68) }"[-2:]
// docket_sequence = f"0000000{ random.randrange(1, 2000) }"[-7:]
// year = random.randrange(2007, 2019)
// if court == "CP":
//     court_type = random.choice(["CR", "MD"])
//     docket_number = f"CP-{ county_num }-{ court_type }-{ docket_sequence}-{ year }"
//     yield docket_number
// if court == "MDJ":
//     # ct_office doesn't have to end in 101, but the offices that
//     # exist are different in each county. Might be up to 2-03 or
//     # or something else. But for testing, I think
//     # just generating random number from the 101 office will be
//     # fine.
//     ct_office = f"{ county_num }101"
//     docket_number = f"MJ-{ ct_office }-CR-{ docket_sequence }-{ year }"
//     yield docket_number

// logging.warning(
//     "Odd. You didn't create any docket numbers. Did you select CP, MJ or either for the `court` parameter?"
// )
// yield ""
