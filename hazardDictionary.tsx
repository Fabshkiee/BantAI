//This is the hazard dictionary that contains all the hazards and their corresponding information. It is used to display the hazards in the app and to provide information about each hazard when the user clicks on it.

const hazardData = {
  ElectronicHazard: {
    title: "electronic hazard",
    risk_status: "high",
    description:
      "Involves common household electronics operating with damaged enclosures or placed on unsecured tables. These devices contain high voltage power supplies and sensitive circuitry that require a stable environment to operate safely.",
    reason: [
      {
        Earthquake:
          "Unsecured electronics can fall and break during shaking, exposing live wires that can cause electrical fires or electrocution.",
      },
      {
        Typhoon:
          "Rain getting into electronics can cause short circuits or electrocution, especially when power comes back on.",
      },
      {
        Fire: "Electronics that overheat or are overloaded can catch fire and spread flames quickly while releasing toxic smoke.",
      },
    ],
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
    risk_status: "medium",
    description:
      "Fragile items like glass vases, heavy bottles, or ceramic decor placed on high shelves or open plateras. These free standing objects rely entirely on gravity to stay in place and lack protective barriers.",
    reason: [
      {
        Earthquake:
          "Fragile items on high shelves can fall and shatter into sharp debris that can injure anyone nearby during or after the shaking.",
      },
      {
        Typhoon:
          "Strong winds can knock over unsecured glass and ceramic items, sending sharp broken pieces across the floor.",
      },
      {
        Fire: "Extreme heat can cause glass to crack or explode, scattering sharp shards along evacuation paths in the dark.",
      },
    ],
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
    reason: [
      {
        Earthquake:
          "Loose wires in an uncovered panel can spark and ignite nearby materials when shaking rattles the connections loose.",
      },
      {
        Typhoon:
          "Rain entering through the roof can hit exposed copper bars and cause short circuits or electrocution.",
      },
      {
        Fire: "Without a metal cover, electrical sparks can jump directly onto wooden ceilings or nearby clutter and start a fire.",
      },
    ],
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
    risk_status: "medium",
    description:
      "Ceiling lights with broken bulbs or messy octopus wires. These open wires are very dangerous because they are completely unprotected from water and shaking.",
    reason: [
      {
        Earthquake:
          "Heavy bulbs and loose fixtures can fall and shatter on people below when the ceiling shakes.",
      },
      {
        Typhoon:
          "Rain leaking through the roof can reach open wires and cause deadly shocks or short circuits.",
      },
      {
        Fire: "Overloaded or exposed wires near a wooden ceiling can easily spark and set the roof on fire.",
      },
    ],
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
    risk_status: "medium",
    description:
      "Large and top heavy furniture like traditional wooden aparadors and big dining tables. These massive items are dangerous because they are not attached to the walls and can easily tip over.",
    reason: [
      {
        Earthquake:
          "Tall and top heavy furniture can tip over and crush people or block exit doors during strong shaking.",
      },
      {
        Typhoon:
          "Flood water soaks into wood making furniture too heavy to move, turning it into a barrier during evacuation.",
      },
      {
        Fire: "Large wooden furniture burns easily and acts as extra fuel that keeps the fire going longer and spreads it faster.",
      },
    ],
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
    reason: [
      {
        Earthquake:
          "Candles and gas lamps can tip over during shaking and immediately ignite nearby curtains or wooden floors.",
      },
      {
        Typhoon:
          "Strong wind gusts can blow curtains or mosquito nets directly into an open flame and start a fire.",
      },
      {
        Fire: "An unattended open flame acts as the starting point that spreads fire rapidly through the rest of the home.",
      },
    ],
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

  overloaded_socket: {
    title: "overloaded sockets",
    risk_status: "high",
    description:
      "Plugging too many appliances like rice cookers, fans, and TVs into one outlet or extension cord. This 'octopus wiring' makes the wires get dangerously hot and can start a fire inside your walls.",
    reason: [
      {
        Earthquake:
          "Shaking can loosen heavy plugs from overloaded outlets and cause sparks that ignite walls or floors.",
      },
      {
        Typhoon:
          "Rain or humidity reaching overloaded wires can cause a short circuit or total power failure.",
      },
      {
        Fire: "Overloaded wires overheat and melt their plastic coating, easily setting fire to wooden walls or floors.",
      },
    ],
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Unplug heavy appliances like your refrigerator or washing machine right after a strong earthquake. This stops sparks from jumping if the plugs were shaken loose from the wall.",
          },
          {
            fix_2:
              "Use a piece of sturdy tape or a plastic tie to keep your main plugs firmly attached to the outlet. This prevents heavy plugs from falling out and creating dangerous sparks during a shake.",
          },
          {
            fix_3:
              "Keep your power strips on the floor instead of hanging them from the wall. This keeps the weight off the outlet so it does not tear out of the wall when the house vibrates.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Never leave extension cords on the floor if you think rain will leak into your home. Lift all power strips and wires onto a table or chair to keep them dry and safe from short circuits.",
          },
          {
            fix_2:
              "Check your plugs for any green or black marks which show they are getting wet or too hot. If you see these marks stop using that outlet immediately to prevent a fire during the storm.",
          },
          {
            fix_3:
              "Only use one appliance at a time on each outlet during a storm. This keeps the wires cool and reduces the chance of a total power failure when the electricity is unstable.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Feel your plugs and the wall around your outlets with the back of your hand. If they feel warm to the touch unplug everything because the wires inside are starting to melt.",
          },
          {
            fix_2:
              "Plug heavy appliances like rice cookers or irons directly into the wall instead of using cheap extension cords. These thin cords are not strong enough and will melt under the heavy load.",
          },
          {
            fix_3:
              "Never hide extension cords under rugs or pillows. The heat trapped under the rug can easily start a fire that you will not see until the flames have already spread.",
          },
        ],
      },
    ],
  },

  damaged_wire: {
    title: "damaged wires",
    risk_status: "high",
    description:
      "Electrical cords that are frayed, cracked, or have bare copper wires showing. These wires are very dangerous because they no longer have their protective plastic cover to stop sparks.",
    reason: [
      {
        Earthquake:
          "Shaking can snap old brittle wires and make metal furniture or walls live with dangerous electricity.",
      },
      {
        Typhoon:
          "Rain touching exposed copper wires can instantly cause short circuits or electrocute anyone nearby.",
      },
      {
        Fire: "Heat from a broken wire can quickly ignite nearby curtains, wooden walls, or dusty clutter.",
      },
    ],
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Check all your electric fan and appliance cords for cracks before a disaster hits. If you find a tiny crack wrap it tightly with several layers of thick electrical tape to keep the copper inside covered.",
          },
          {
            fix_2:
              "Unplug any device that has a wobbly or loose plug right after a strong shake. A loose connection can cause dangerous sparks called arcing which can start a fire behind your wooden walls.",
          },
          {
            fix_3:
              "Move all electrical cords away from under your bed or heavy cabinets. This stops the heavy furniture from pinching and crushing the wires when the house starts to shake.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Never touch or unplug a damaged wire if your hands are wet or if you are standing on a damp floor. Always turn off the main breaker first to safely cut the power to the whole house.",
          },
          {
            fix_2:
              "Lift any cords with old or thin insulation off the floor and hang them on plastic hooks. This keeps them dry and prevents a short circuit if rain leaks through your roof or floor.",
          },
          {
            fix_3:
              "Throw away any extension cords that feel very soft or sticky to the touch. This means the plastic is rotting and it will fail instantly if it gets wet during a storm.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Clean the dust and cobwebs away from your tangled wires behind the TV or computer. This dust acts like dry grass and can catch fire instantly from a single spark in a damaged wire.",
          },
          {
            fix_2:
              "If an appliance cord feels hot while you are using it unplug it and stop using the device. This heat is a warning that the wires inside are broken and could start a fire soon.",
          },
          {
            fix_3:
              "Always pull the plug itself and never pull on the wire when disconnecting your appliances. Pulling the wire breaks the tiny copper strands inside which leads to overheating and fire.",
          },
        ],
      },
    ],
  },

  gas_tank: {
    title: "gas tank hazards",
    risk_status: "critical",
    description:
      "Unsecured LPG tanks (Gasul) with old rubber hoses or loose regulators. These tanks contain high pressure gas that can leak and explode if the tank falls over or gets too hot.",
    reason: [
      {
        Earthquake:
          "A falling tank can snap the hose and release gas that ignites instantly from any nearby spark.",
      },
      {
        Typhoon:
          "Floodwater can float the tank and pull on the gas line, causing a leak that builds up inside a closed home.",
      },
      {
        Fire: "Heat causes the gas inside to expand until the metal tank explodes and destroys everything around it.",
      },
    ],
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Use a sturdy rope or a metal chain to tie your gas tank to a heavy table leg or a concrete wall. This stops the tank from falling over and snapping the hose during a strong shake.",
          },
          {
            fix_2:
              "Switch off the regulator valve every time you finish cooking. This ensures that even if the hose breaks during an earthquake no gas will leak out into your kitchen.",
          },
          {
            fix_3:
              "Place your gas tank on a flat and stable floor instead of a shaky wooden stand. A low position makes it much harder for the tank to tip over during a tremor.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Keep your gas tank in a well ventilated area like a dirty kitchen with open windows. This allows any small leaks to blow away safely instead of building up inside your home during a storm.",
          },
          {
            fix_2:
              "If you expect deep flooding move your gas tank to a higher floor but keep it away from where you sleep. If you cannot move it tie it tightly to a post so it does not float away.",
          },
          {
            fix_3:
              "Check the rubber hose for tiny cracks by wiping it with soapy water. If you see bubbles it means gas is leaking and you must replace the hose immediately before the storm hits.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Keep your gas tank at least one meter away from your stove and any electric fans. This safe distance prevents the tank from getting too hot while you are cooking your meals.",
          },
          {
            fix_2:
              "Replace your gas hose every two years even if it looks okay. Over time the rubber becomes hard and brittle and it can easily crack and catch fire in a hot kitchen.",
          },
          {
            fix_3:
              "Never store extra gas tanks inside your house or under the stairs. Keep them in a shaded area outside where they can stay cool and far away from any possible house fire.",
          },
        ],
      },
    ],
  },

  stove: {
    title: "stove hazards",
    risk_status: "high",
    description:
      "Stoves that are left dirty with grease or placed too close to curtains and wooden walls. These are dangerous because they can quickly start a fire that spreads to the rest of your kitchen.",
    reason: [
      {
        Earthquake:
          "Shaking can knock hot oil or pans off the stove and onto the floor, instantly starting a fire.",
      },
      {
        Typhoon:
          "Wind can blow curtains into the flame or put out the gas without shutting it off, causing a dangerous leak.",
      },
      {
        Fire: "Built up grease on the stove acts as extra fuel that makes flames grow much larger and harder to control.",
      },
    ],
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Always turn your pot handles toward the back or side of the stove. This prevents the handles from being hit or snagged during a shake which stops hot food from spilling on you.",
          },
          {
            fix_2:
              "Turn off your stove immediately at the first sign of ground shaking. Stopping the heat source is the best way to prevent a kitchen fire from starting while you seek cover.",
          },
          {
            fix_3:
              "Keep the area above your stove clear of heavy objects or glass jars. This prevents things from falling onto your stove and knocking over hot pans during an earthquake.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Keep curtains and dish towels at least one meter away from the stove. Strong wind gusts during a storm can easily blow these light materials into the fire.",
          },
          {
            fix_2:
              "Check your stove flame often if your kitchen windows are open. If the wind blows out the fire the gas will still be leaking which can cause an explosion the next time you strike a match.",
          },
          {
            fix_3:
              "Clean the grease off your stove and the wall behind it regularly. Grease catches fire very easily especially when the air is dry or when the stove is running for a long time during a storm.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Never leave your cooking unattended even for a minute. Most kitchen fires start because the cook walked away and the food or oil got too hot and caught fire.",
          },
          {
            fix_2:
              "Keep a metal lid nearby whenever you are frying with oil. If the oil catches fire simply slide the lid over the pan to smother the flames and then turn off the heat.",
          },
          {
            fix_3:
              "Never throw water on a grease fire because it will cause the fire to explode. Use a metal lid or a large amount of baking soda to safely put out the flames without making them spread.",
          },
        ],
      },
    ],
  },

  smoke_detector: {
    title: "smoke hazards",
    risk_status: "high",
    description:
      "Thick black smoke and toxic gases produced during a fire. This is dangerous because breathing in smoke can make you confused, unconscious, or stop your breathing entirely.",
    reason: [
      {
        Earthquake:
          "Cracks in walls from shaking allow smoke to silently enter rooms through hidden gaps before anyone notices.",
      },
      {
        Typhoon:
          "Strong winds can push smoke back into the house through vents instead of letting it escape outside.",
      },
      {
        Fire: "Smoke fills the room from the ceiling down within minutes, making it impossible to see or breathe your way out.",
      },
    ],
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Install a battery operated smoke alarm on the ceiling of every bedroom. These alarms will wake you up even if an earthquake starts a small fire in another part of the house while you are sleeping.",
          },
          {
            fix_2:
              "Check for new cracks in your walls or ceiling after a big shake. Smoke can travel through these small openings into your room so you should cover them with thick tape or plaster as soon as possible.",
          },
          {
            fix_3:
              "Keep a flashlight and a pair of slippers right next to your bed. If smoke fills the room you will need light to find your way and shoes to protect your feet from broken glass while you crawl out.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Ensure your kitchen has a working exhaust fan or a window that opens easily. This helps pull smoke and cooking fumes out of the house even when the wind is blowing hard outside.",
          },
          {
            fix_2:
              "Close the doors to any rooms you are not using during a storm. Closed doors act as a barrier that slows down the spread of smoke and gives you more time to get out safely.",
          },
          {
            fix_3:
              "Check your smoke alarm batteries every time a big storm is coming. Power outages are common during typhoons and you need your battery powered alarms to be ready if a fire starts.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "If you see smoke stay low and crawl on your hands and knees toward the exit. The air near the floor is cooler and cleaner because the thick toxic smoke always rises to the ceiling first.",
          },
          {
            fix_2:
              "Cover your nose and mouth with a wet towel or a piece of clothing if you have to move through smoke. This acts as a simple filter that helps you breathe a little longer while you find your way out.",
          },
          {
            fix_3:
              "Test your smoke alarm once a month by pressing the test button. This simple five second check ensures that your family will be warned the moment smoke starts to build up in your home.",
          },
        ],
      },
    ],
  },

  major_crack: {
    title: "major wall cracks",
    risk_status: "high",
    description:
      "Deep cracks in your walls that are wider than a coin or look like a staircase. These are dangerous because they mean your house foundation is moving or the walls are starting to fail.",
    reason: [
      {
        Earthquake:
          "Existing deep cracks give the wall a weak point where it can fully break apart and collapse during strong shaking.",
      },
      {
        Typhoon:
          "Rain seeping into deep cracks rusts the iron bars inside the concrete, slowly destroying the wall from the inside.",
      },
      {
        Fire: "Large gaps in the wall allow deadly smoke and heat to pass through and trap people in other rooms.",
      },
    ],
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Check your walls for cracks that are wider than five millimeters or about the width of two credit cards. If you see cracks this big you should ask a local engineer to check if the house is still safe.",
          },
          {
            fix_2:
              "Watch for diagonal cracks that start from the corners of your doors or windows. These are weak points that can snap during an earthquake and cause the whole wall to fall on you.",
          },
          {
            fix_3:
              "Never lean heavy furniture or water tanks against a wall that already has big cracks. The extra weight can push the weakened wall over even during a small shake.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Seal any outside cracks with waterproof cement or sealant before the rainy season starts. This stops water from reaching the iron bars inside your wall so they do not rust and break.",
          },
          {
            fix_2:
              "Look for cracks that change size after a big storm. If the crack gets wider it means the ground under your house is moving from too much water and you may need to move to a safer place.",
          },
          {
            fix_3:
              "Clean any plants or moss growing inside the wall cracks. Roots act like wedges that slowly push the crack open wider every time it rains making the wall weaker over time.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Fill deep wall cracks with fire proof plaster or cement right away. This keeps smoke and fire from sneaking through the wall and spreading to other rooms while you are trying to escape.",
          },
          {
            fix_2:
              "Check if your doors or windows are starting to stick and will not close properly. This often happens when major cracks shift the wall and it could trap you inside during a fire emergency.",
          },
          {
            fix_3:
              "Move your bed and gas tanks away from walls that have long horizontal cracks. If a fire starts these weakened walls are the first to collapse and can crush everything nearby.",
          },
        ],
      },
    ],
  },

  minor_crack: {
    title: "minor wall cracks",
    risk_status: "low",
    description:
      "Thin hairline cracks in your paint or plaster that are smaller than a strand of hair. These are usually just on the surface and do not mean your wall is about to fall down.",
    reason: [
      {
        Earthquake:
          "Small cracks can quietly grow wider after each shake until they become a serious structural problem.",
      },
      {
        Typhoon:
          "Rain sneaking into tiny gaps causes mold and rot to build up slowly inside your walls over time.",
      },
      {
        Fire: "Even small cracks can act as pathways that let dangerous smoke leak from one room to another.",
      },
    ],
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Take a photo of any new hairline cracks after an earthquake and check them again after one month. If the crack has not grown wider it is likely just a surface scratch and not a structural danger.",
          },
          {
            fix_2:
              "Use a pencil to draw a small mark at the very end of a new crack. If the crack grows past that mark after a few weeks it means your house is still moving and you should show it to a technician.",
          },
          {
            fix_3:
              "Check around your windows and doors for tiny diagonal lines. These small cracks show where the house is flexing most during a shake and are usually safe as long as they stay very thin.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Paint over hairline cracks with a thick layer of waterproof paint like elastomeric paint. This simple fix seals the opening and stops typhoon rain from soaking into your concrete walls.",
          },
          {
            fix_2:
              "Watch for damp spots or peeling paint near any minor cracks during the rainy season. If the wall feels wet it means water is getting inside and you need to seal the crack with a bit of putty.",
          },
          {
            fix_3:
              "Apply a clear water repellent spray to the outside of your walls if you see many small cracks. This is a cheap way to stop water from entering without changing the look of your home.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Seal any small gaps around your electrical outlets or where pipes enter the wall. This stops smoke from using these tiny highways to move between rooms during a fire.",
          },
          {
            fix_2:
              "Check the mosquito nets or kulambo near walls with cracks. Make sure they are not touching the wall so that any heat or smoke coming through the crack does not set the net on fire.",
          },
          {
            fix_3:
              "Keep your walls clean and free of old peeling paint around minor cracks. Dry and flaky paint can act like tinder that catches fire easily if a spark reaches the wall.",
          },
        ],
      },
    ],
  },

  collapsed_structure: {
    title: "collapsed structures",
    risk_status: "critical",
    description:
      "A building that has partially or completely fallen down due to weak walls, a bad foundation, or rotten supports. This is the most dangerous hazard because it can trap or crush anyone inside the home.",
    reason: [
      {
        Earthquake:
          "Weak ground floors can drop or fold sideways in seconds, leaving no time to escape the collapsing structure.",
      },
      {
        Typhoon:
          "Floodwater washing away soil under the house can cause the entire foundation to tilt or sink without warning.",
      },
      {
        Fire: "Heat weakens roof and floor supports until they can no longer hold their own weight and suddenly give way.",
      },
    ],
    suggested_fixes: [
      {
        Earthquake: [
          {
            fix_1:
              "Identify the 'Triangle of Life' in your home. This is a small safe space next to large and sturdy objects like a heavy sofa or a solid wooden desk where a gap might form if the ceiling falls.",
          },
          {
            fix_2:
              "Never run outside while the ground is still shaking. Most injuries in the Philippines happen when people are hit by falling hollow blocks or glass while trying to leave the building.",
          },
          {
            fix_3:
              "Practice the 'Drop, Cover, and Hold On' drill with your family. This habit helps you protect your head and neck immediately so you can survive the first few seconds of a collapse.",
          },
        ],
      },
      {
        Typhoon: [
          {
            fix_1:
              "Check for 'soil erosion' or large holes around the base of your house after a big storm. If the ground is washed away your house foundation is no longer supported and could sink.",
          },
          {
            fix_2:
              "Listen for loud 'popping' or 'cracking' sounds coming from your walls or roof during a typhoon. These sounds mean the structure is under too much stress and you should leave immediately.",
          },
          {
            fix_3:
              "Avoid staying in a room that has a heavy concrete roof if the walls underneath it are already cracked. The heavy weight of the roof is the most dangerous part if the walls fail.",
          },
        ],
      },
      {
        Fire: [
          {
            fix_1:
              "Get out and stay out as soon as you see a fire. Never go back inside a burning building to save your belongings because the roof or floor could collapse on you at any second.",
          },
          {
            fix_2:
              "Avoid walking through rooms where the floor feels soft or bouncy after a fire. This is a sign that the wooden or steel supports underneath have been weakened by the heat.",
          },
          {
            fix_3:
              "Be very careful near 'yero' or tin roofs that have been in a fire. The heat makes the metal sheets loose and they can slide off and fall like sharp blades even after the fire is gone.",
          },
        ],
      },
    ],
  },
};
