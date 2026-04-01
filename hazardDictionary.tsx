//This is the hazard dictionary that contains all the hazards and their corresponding information. It is used to display the hazards in the app and to provide information about each hazard when the user clicks on it.

const hazardData = {
  ElectronicHazard: {
    title: "electronic hazard",
    risk_status: "high",
    description:
      "Involves common household electronics operating with damaged enclosures or placed on unsecured tables. These devices contain high voltage power supplies and sensitive circuitry that require a stable environment to operate safely.",
    reason:
      "This is a high urgency risk because these items become dangerous during disasters. Earthquakes cause unsecured screens to shatter, while typhoons push rain into vents to cause explosive short circuits. In a fire, plastic housings release toxic smoke and spread flames rapidly to nearby furniture.",
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Move heavy appliances like flat screen TVs and PC towers off flimsy monobloc tables or high aparadors. Place them on lower surfaces so they do not tip over during strong shakes.",
          },
          {
            fix_2:
              "Use heavy duty brackets or nylon straps to anchor big electronics directly to concrete hollow block walls. Screwing them to thin plywood walls will easily fail during an earthquake.",
          },
          {
            fix_3:
              "Find your main electrical breaker and turn it off right after the shaking stops. This prevents hidden electrical fires if the wires inside your walls get damaged.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Unplug stand fans and rice cookers then elevate them at least one meter off the floor. This prevents electrocution when the power returns especially in flood prone barangays.",
          },
          {
            fix_2:
              "Move electronics away from jalousie windows to avoid leaks common under yero roofs. Never plug in wet appliances until an electrician inspects them first.",
          },
          {
            fix_3:
              "Plug expensive electronics like desktop computers into high quality surge protectors instead of cheap extension cords. This protects them from massive voltage spikes when the power comes back on.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Never push desktop computer towers tight against the wall or trap them inside closed wooden cabinets. Give them enough space to breathe so they do not overheat and catch fire.",
          },
          {
            fix_2:
              "Plug heat generating appliances like rice cookers directly into the wall outlet. Never plug them into standard extension cords because the thin wires can easily melt and start a fire.",
          },
          {
            fix_3:
              "Check your electric fan cords for damage or unusual heat and replace the unit if needed. Never just wrap a broken cord in electrical tape because hidden sparks can easily ignite your curtains.",
          },
        ],
      },
    ],
  },

  ElevatedBreakables: {
    title: "elevated breakables",
    risk_status: "high",
    description:
      "Fragile items like glass vases, heavy bottles, or ceramic decor placed on high shelves or open plateras. These free standing objects rely entirely on gravity to stay in place and lack protective barriers.",
    reason:
      "This is a high urgency risk because these items become dangerous projectiles during disasters. Earthquakes cause them to shatter into sharp debris while strong typhoon winds can sweep them off tables. In a fire extreme heat causes exposed glass to explode creating hidden hazards during dark evacuations.",
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Apply earthquake putty or heavy duty double sided mounting tape to the base of heavy glass decors and religious statues on your family altar. This bonds them firmly to the table so they do not tip over.",
          },
          {
            fix_2:
              "Move heavy glassware, everyday baso, and thick glass bottles from the top shelves of your platera down to the lowest shelves. This greatly reduces the distance they could fall and shatter.",
          },
          {
            fix_3:
              "Install simple wooden shelf lips or guard rails on open shelving. This prevents ceramic figurines and decorative plates from sliding off the edge during a severe tremor.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Relocate glass bottles, vases, and figurines far away from jalousie windows. This prevents them from being knocked over by sudden wind gusts or flying debris during a storm.",
          },
          {
            fix_2:
              "Line the shelves of your pantry and dish cabinets with anti slip rubber mats. This increases friction and stops glasses from vibrating toward the edge when the house is hit by strong winds.",
          },
          {
            fix_3:
              "Ensure the doors of your platera or kitchen cabinets have secure mechanical latches. This stops them from swinging open and dumping your glassware during strong vibrations.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Remove free standing glass vases and decorative mirrors from narrow hallways and near the main door. You need a completely shatter free evacuation path if you have to crawl out in the dark.",
          },
          {
            fix_2:
              "Replace heavy glass picture frames along your stairs and main doors with lightweight acrylic or plastic alternatives. This ensures they do not drop sharp shards on your escape route when exposed to extreme heat.",
          },
          {
            fix_3:
              "Move glass cooking oil bottles and heavy ceramic jars away from the elevated shelves directly above your gas stove. A small cooking fire can quickly heat these containers until they crack and turn a minor kitchen flare up into a massive house fire.",
          },
        ],
      },
    ],
  },

  ExposedBreakers: {
    title: "exposed circuit breakers",
    risk_status: "critical",
    description:
      "Electrical service panels where the protective safety cover is missing. This leaves internal high voltage copper bars open to accidental touch or water splashes in the dirty kitchen.",
    reason:
      "This is a critical risk because the main electrical hub of your house is unprotected. Earthquakes cause loose wires to spark while typhoon rain entering through the yero roof causes explosive short circuits. In a fire the lack of a metal cover allows electrical sparks to leap directly onto your wooden ceiling.",
    suggested_fixes: [
      {
        earthquake: [
          {
            fix_1:
              "Turn off the main breaker switch immediately after the shaking stops. This kills the power to the whole house and prevents hidden electrical fires inside your walls.",
          },
          {
            fix_2:
              "Ensure the panel box is bolted deeply into concrete hollow block walls. If it is only screwed into thin plywood it can tear loose during a strong tremor and drop live wires.",
          },
          {
            fix_3:
              "Reinforce any cracked or sun damaged plastic breaker boxes tightly with heavy duty electrical tape. This cheap fix prevents the brittle plastic from shattering completely and exposing live wires during a shake.",
          },
        ],
      },
      {
        typhoon: [
          {
            fix_1:
              "Build a temporary waterproof shield over the panel using thick plastic sheeting or garbage bags if you have leaks. Ensure the plastic never actually touches the exposed copper wires.",
          },
          {
            fix_2:
              "If you cannot afford to relocate a low breaker box monitor the flood waters and shut the main switch off early. Block the doors with sandbags to delay water from reaching the panel.",
          },
          {
            fix_3:
              "Create a cheap rain deflector for outside panels by nailing a thick rubber mat or folded yero just above the box. This acts as a physical shield against wind blown rain without needing an expensive waterproof case.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Clear all abukay or clutter like old cardboard boxes and cleaning rags away from the panel. This trash acts as instant kindling if a stray electrical spark shoots out of the exposed box.",
          },
          {
            fix_2:
              "Carefully tape a thick piece of hard plastic or acrylic board over the exposed panel opening using heavy duty electrical tape. Make sure the plastic never touches the copper wires to safely trap sparks inside.",
          },
          {
            fix_3:
              "Keep a large bucket of completely dry sand permanently placed near your breaker box or dirty kitchen. This is a very cheap and effective way to safely smother an electrical panel fire without using dangerous water.",
          },
        ],
      },
    ],
  },

  ExposedCeilingLights: {
    title: "Exposed Ceiling Lights",
    risk_status: "critical",
    description:
      "Ceiling lights with broken bulbs or messy octopus wires. These open wires are very dangerous because they are completely unprotected from water and shaking.",
    reason:
      "This is a critical risk because the danger hangs right above your family. Earthquakes make heavy glass bulbs fall and shatter. Typhoon rains can leak into the open wires and cause deadly shocks. In a fire messy wires can quickly burn your wooden ceiling.",
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Change heavy glass chandeliers to light LED bulbs attached flat to the ceiling. This stops them from swinging and falling on your head during an earthquake.",
          },
          {
            fix_2:
              "Make sure all ceiling lights are screwed tightly into the roof beams. This keeps the whole light fixture from dropping during a strong shake.",
          },
          {
            fix_3:
              "Cover bare bulbs with cheap plastic cages. This stops the glass from breaking and scattering on your floor if things start shaking.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Fix any holes in your yero roof right away so water does not reach the lights. This stops dangerous sparks and short circuits during heavy rain.",
          },
          {
            fix_2:
              "Use waterproof lights for your dirty kitchen and balcony. Standard indoor bulbs easily break when hit by strong wind and heavy rain.",
          },
          {
            fix_3:
              "Tie up or shorten long dangling wires so they do not swing around. This keeps the wires safe even when strong typhoon winds shake your house.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Stop using octopus wiring where too many lights share one thin wire. This stops the wires from getting too hot and starting a ceiling fire.",
          },
          {
            fix_2:
              "Switch old hot bulbs to LED bulbs because they stay cool. Heat from old bulbs can easily set fire to dusty cobwebs hidden in your ceiling.",
          },
          {
            fix_3:
              "Cover all open wires with thick electrical tape and hide them inside a plastic junction box. This traps any sparks and protects your wooden roof from catching fire.",
          },
        ],
      },
    ],
  },

  HeavyWoodenFurniture: {
    title: "Heavy Wooden Furniture",
    risk_status: "high",
    description:
      "Large and top heavy furniture like traditional wooden aparadors and big dining tables. These massive items are dangerous because they are not attached to the walls and can easily tip over.",
    reason:
      "This is a high urgency risk because these heavy items can crush people during a disaster. Earthquakes make them fall and block your exit doors. In a flood heavy wood stays wet and becomes too heavy to move. During a fire large wooden furniture acts as extra fuel that keeps the fire burning longer.",
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Use strong metal brackets to attach the top of your tall wooden cabinets directly to the wall. Make sure the screws go deep into the concrete so the cabinet cannot fall forward.",
          },
          {
            fix_2:
              "Move all your heaviest items like stacks of plates or thick blankets to the very bottom shelves. This keeps the weight low and makes it much harder for the furniture to tip over.",
          },
          {
            fix_3:
              "Place small rubber wedges under the front feet of your heavy wardrobes. This makes the furniture lean slightly back against the wall so it stays in place during a shake.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Move your heavy wooden tables far away from glass windows before the storm hits. Strong wind can push these heavy items into the glass and cause it to shatter inside your home.",
          },
          {
            fix_2:
              "Empty the bottom drawers of your wooden cabinets if you expect a flood. Wood absorbs water and becomes twice as heavy making it impossible for you to move the furniture.",
          },
          {
            fix_3:
              "Put rubber cups under the legs of any furniture that has wheels. This prevents your heavy cabinets from rolling across the room and hitting walls when the building vibrates.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Move your heavy closets away from windows or doors that you might need for a fast escape. You must keep all exit paths completely clear so you can get out quickly.",
          },
          {
            fix_2:
              "Keep all wooden furniture at least one meter away from your gas stove or electric fans. This safe distance prevents the wood from getting too hot and catching fire.",
          },
          {
            fix_3:
              "Paint your old wooden furniture with special fire proof varnish. This simple coating slows down how fast the wood catches fire and gives your family more time to escape.",
          },
        ],
      },
    ],
  },

  OpenFlameHazards: {
    title: "Open Flame Hazards",
    risk_status: "critical",
    description:
      "Using candles, gasera lamps, or mosquito coils near curtains and wooden walls. These open flames are very dangerous because they can easily tip over and start a big house fire.",
    reason:
      "This is a critical risk because a single small flame can burn down your entire home in minutes. Earthquakes knock over candles onto your bed or floor. Typhoon winds can blow curtains or mosquito nets into the flame. During a fire these small flames act as the starting point that makes the blaze spread much faster through your home.",
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "If you must use a candle, melt the bottom and stick it inside a heavy glass jar or a deep sardine tin. This cheap holder stops the candle from falling over when the ground shakes.",
          },
          {
            fix_2:
              "Place a heavy rock or some sand inside your gasera base to make it more stable. This simple weight stops the lamp from tipping over and spilling oil during a strong tremor.",
          },
          {
            fix_3:
              "Blow out all candles and gas lamps immediately at the first sign of ground shaking. This prevents a fire from starting while you are busy protecting your family from the earthquake.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Place mosquito coils or katol inside an old biscuit tin with holes punched in the lid. This recycled box traps hot embers so the wind cannot blow them onto your curtains.",
          },
          {
            fix_2:
              "Keep all candles or gas lamps at least one meter away from windows and mosquito nets. Strong wind gusts can easily blow these light materials into the flame.",
          },
          {
            fix_3:
              "Put your candles inside a deep glass bottle or a tall jar to protect the flame from the wind. This stops the fire from dancing around and reaching your wooden walls during a storm.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Never leave a mosquito coil or candle burning while you are sleeping. Always double check that they are completely put out before you close your eyes.",
          },
          {
            fix_2:
              "Keep matches and lighters in a high plastic container far away from children. Store them away from the heat of your stove to prevent them from catching fire in the kitchen.",
          },
          {
            fix_3:
              "Keep a large bucket of dry sand or a heavy wet sack near your candles or cooking area. This is a free and fast way to smother a small fire before it spreads to your ceiling.",
          },
        ],
      },
    ],
  },
};
