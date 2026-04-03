//This is the hazard dictionary that contains all the hazards and their corresponding information. It is used to display the hazards in the app and to provide information about each hazard when the user clicks on it.
export type HazardCategory = "electrical" | "interior" | "structural" | "fire";

export type HazardDictionaryEntry = {
  id: string; //Class File
  title: string;
  category: HazardCategory;
  default_severity: "low" | "medium" | "high" | "critical"; //severity level
  description: string;
  earthquake_reason: string;
  typhoon_reason: string;
  fire_reason: string;
  earthquake_fixes: string[];
  typhoon_fixes: string[];
  fire_fixes: string[];
};

export const hazardDictionary: HazardDictionaryEntry[] = [
  {
    id: "HAZARD_LABELS.ELECTRONIC_HAZARD",
    title: "Electronic Hazard",
    category: "electrical",
    default_severity: "high",
    description:
      "Involves common household electronics operating with damaged enclosures or placed on unsecured tables. These devices contain high voltage power supplies and sensitive circuitry that require a stable environment to operate safely.",
    earthquake_reason:
      "Unsecured electronics can fall and break during shaking, exposing live wires that can cause electrical fires or electrocution.",
    typhoon_reason:
      "Rain getting into electronics can cause short circuits or electrocution, especially when power comes back on.",
    fire_reason:
      "Electronics that overheat or are overloaded can catch fire and spread flames quickly while releasing toxic smoke.",
    earthquake_fixes: [
      "Move heavy appliances like flat screen TVs and PC towers off flimsy monobloc tables or high aparadors. Place them on lower surfaces so they do not tip over during strong shakes.",
      "Use heavy duty brackets or nylon straps to anchor big electronics directly to concrete hollow block walls. Screwing them to thin plywood walls will easily fail during an earthquake.",
      "Find your main electrical breaker and turn it off right after the shaking stops. This prevents hidden electrical fires if the wires inside your walls get damaged.",
    ],
    typhoon_fixes: [
      "Unplug stand fans and rice cookers then elevate them at least one meter off the floor. This prevents electrocution when the power returns especially in flood prone barangays.",
      "Move electronics away from jalousie windows to avoid leaks common under yero roofs. Never plug in wet appliances until an electrician inspects them first.",
      "Plug expensive electronics like desktop computers into high quality surge protectors instead of cheap extension cords. This protects them from massive voltage spikes when the power comes back on.",
    ],
    fire_fixes: [
      "Never push desktop computer towers tight against the wall or trap them inside closed wooden cabinets. Give them enough space to breathe so they do not overheat and catch fire.",
      "Plug heat generating appliances like rice cookers directly into the wall outlet. Never plug them into standard extension cords because the thin wires can easily melt and start a fire.",
      "Check your electric fan cords for damage or unusual heat and replace the unit if needed. Never just wrap a broken cord in electrical tape because hidden sparks can easily ignite your curtains.",
    ],
  },
  {
    id: "HAZARD_LABELS.ELEVATED_BREAKABLES",
    title: "Elevated Breakables",
    category: "interior",
    default_severity: "medium",
    description:
      "Fragile items like glass vases, heavy bottles, or ceramic decor placed on high shelves or open plateras. These free standing objects rely entirely on gravity to stay in place and lack protective barriers.",
    earthquake_reason:
      "Fragile items on high shelves can fall and shatter into sharp debris that can injure anyone nearby during or after the shaking.",
    typhoon_reason:
      "Strong winds can knock over unsecured glass and ceramic items, sending sharp broken pieces across the floor.",
    fire_reason:
      "Extreme heat can cause glass to crack or explode, scattering sharp shards along evacuation paths in the dark.",
    earthquake_fixes: [
      "Apply earthquake putty or heavy duty double sided mounting tape to the base of heavy glass decors and religious statues on your family altar. This bonds them firmly to the table so they do not tip over.",
      "Move heavy glassware, everyday baso, and thick glass bottles from the top shelves of your platera down to the lowest shelves. This greatly reduces the distance they could fall and shatter.",
      "Install simple wooden shelf lips or guard rails on open shelving. This prevents ceramic figurines and decorative plates from sliding off the edge during a severe tremor.",
    ],
    typhoon_fixes: [
      "Relocate glass bottles, vases, and figurines far away from jalousie windows. This prevents them from being knocked over by sudden wind gusts or flying debris during a storm.",
      "Line the shelves of your pantry and dish cabinets with anti slip rubber mats. This increases friction and stops glasses from vibrating toward the edge when the house is hit by strong winds.",
      "Ensure the doors of your platera or kitchen cabinets have secure mechanical latches. This stops them from swinging open and dumping your glassware during strong vibrations.",
    ],
    fire_fixes: [
      "Remove free standing glass vases and decorative mirrors from narrow hallways and near the main door. You need a completely shatter free evacuation path if you have to crawl out in the dark.",
      "Replace heavy glass picture frames along your stairs and main doors with lightweight acrylic or plastic alternatives. This ensures they do not drop sharp shards on your escape route when exposed to extreme heat.",
      "Move glass cooking oil bottles and heavy ceramic jars away from the elevated shelves directly above your gas stove. A small cooking fire can quickly heat these containers until they crack and turn a minor kitchen flare up into a massive house fire.",
    ],
  },
  {
    id: "HAZARD_LABELS.EXPOSED_BREAKER",
    title: "Exposed Circuit Breakers",
    category: "electrical",
    default_severity: "critical",
    description:
      "Electrical service panels where the protective safety cover is missing. This leaves internal high voltage copper bars open to accidental touch or water splashes in the dirty kitchen.",
    earthquake_reason:
      "Loose wires in an uncovered panel can spark and ignite nearby materials when shaking rattles the connections loose.",
    typhoon_reason:
      "Rain entering through the roof can hit exposed copper bars and cause short circuits or electrocution.",
    fire_reason:
      "Without a metal cover, electrical sparks can jump directly onto wooden ceilings or nearby clutter and start a fire.",
    earthquake_fixes: [
      "Turn off the main breaker switch immediately after the shaking stops. This kills the power to the whole house and prevents hidden electrical fires inside your walls.",
      "Ensure the panel box is bolted deeply into concrete hollow block walls. If it is only screwed into thin plywood it can tear loose during a strong tremor and drop live wires.",
      "Reinforce any cracked or sun damaged plastic breaker boxes tightly with heavy duty electrical tape. This cheap fix prevents the brittle plastic from shattering completely and exposing live wires during a shake.",
    ],
    typhoon_fixes: [
      "Build a temporary waterproof shield over the panel using thick plastic sheeting or garbage bags if you have leaks. Ensure the plastic never actually touches the exposed copper wires.",
      "If you cannot afford to relocate a low breaker box monitor the flood waters and shut the main switch off early. Block the doors with sandbags to delay water from reaching the panel.",
      "Create a cheap rain deflector for outside panels by nailing a thick rubber mat or folded yero just above the box. This acts as a physical shield against wind blown rain without needing an expensive waterproof case.",
    ],
    fire_fixes: [
      "Clear all abukay or clutter like old cardboard boxes and cleaning rags away from the panel. This trash acts as instant kindling if a stray electrical spark shoots out of the exposed box.",
      "Carefully tape a thick piece of hard plastic or acrylic board over the exposed panel opening using heavy duty electrical tape. Make sure the plastic never touches the copper wires to safely trap sparks inside.",
      "Keep a large bucket of completely dry sand permanently placed near your breaker box or dirty kitchen. This is a very cheap and effective way to safely smother an electrical panel fire without using dangerous water.",
    ],
  },
  {
    id: "HAZARD_LABELS.EXPOSED_CEILING_LIGHTS",
    title: "Exposed Ceiling Lights",
    category: "electrical",
    default_severity: "medium",
    description:
      "Ceiling lights with broken bulbs or messy octopus wires. These open wires are very dangerous because they are completely unprotected from water and shaking.",
    earthquake_reason:
      "Heavy bulbs and loose fixtures can fall and shatter on people below when the ceiling shakes.",
    typhoon_reason:
      "Rain leaking through the roof can reach open wires and cause deadly shocks or short circuits.",
    fire_reason:
      "Overloaded or exposed wires near a wooden ceiling can easily spark and set the roof on fire.",
    earthquake_fixes: [
      "Change heavy glass chandeliers to light LED bulbs attached flat to the ceiling. This stops them from swinging and falling on your head during an earthquake.",
      "Make sure all ceiling lights are screwed tightly into the roof beams. This keeps the whole light fixture from dropping during a strong shake.",
      "Cover bare bulbs with cheap plastic cages. This stops the glass from breaking and scattering on your floor if things start shaking.",
    ],
    typhoon_fixes: [
      "Fix any holes in your yero roof right away so water does not reach the lights. This stops dangerous sparks and short circuits during heavy rain.",
      "Use waterproof lights for your dirty kitchen and balcony. Standard indoor bulbs easily break when hit by strong wind and heavy rain.",
      "Tie up or shorten long dangling wires so they do not swing around. This keeps the wires safe even when strong typhoon winds shake your house.",
    ],
    fire_fixes: [
      "Stop using octopus wiring where too many lights share one thin wire. This stops the wires from getting too hot and starting a ceiling fire.",
      "Switch old hot bulbs to LED bulbs because they stay cool. Heat from old bulbs can easily set fire to dusty cobwebs hidden in your ceiling.",
      "Cover all open wires with thick electrical tape and hide them inside a plastic junction box. This traps any sparks and protects your wooden roof from catching fire.",
    ],
  },
  {
    id: "HAZARD_LABELS.HEAVY_WOODEN_FURNITURE",
    title: "Heavy Wooden Furniture",
    category: "interior",
    default_severity: "medium",
    description:
      "Large and top heavy furniture like traditional wooden aparadors and big dining tables. These massive items are dangerous because they are not attached to the walls and can easily tip over.",
    earthquake_reason:
      "Tall and top heavy furniture can tip over and crush people or block exit doors during strong shaking.",
    typhoon_reason:
      "Flood water soaks into wood making furniture too heavy to move, turning it into a barrier during evacuation.",
    fire_reason:
      "Large wooden furniture burns easily and acts as extra fuel that keeps the fire going longer and spreads it faster.",
    earthquake_fixes: [
      "Use strong metal brackets to attach the top of your tall wooden cabinets directly to the wall. Make sure the screws go deep into the concrete so the cabinet cannot fall forward.",
      "Move all your heaviest items like stacks of plates or thick blankets to the very bottom shelves. This keeps the weight low and makes it much harder for the furniture to tip over.",
      "Place small rubber wedges under the front feet of your heavy wardrobes. This makes the furniture lean slightly back against the wall so it stays in place during a shake.",
    ],
    typhoon_fixes: [
      "Move your heavy wooden tables far away from glass windows before the storm hits. Strong wind can push these heavy items into the glass and cause it to shatter inside your home.",
      "Empty the bottom drawers of your wooden cabinets if you expect a flood. Wood absorbs water and becomes twice as heavy making it impossible for you to move the furniture.",
      "Put rubber cups under the legs of any furniture that has wheels. This prevents your heavy cabinets from rolling across the room and hitting walls when the building vibrates.",
    ],
    fire_fixes: [
      "Move your heavy closets away from windows or doors that you might need for a fast escape. You must keep all exit paths completely clear so you can get out quickly.",
      "Keep all wooden furniture at least one meter away from your gas stove or electric fans. This safe distance prevents the wood from getting too hot and catching fire.",
      "Paint your old wooden furniture with special fire proof varnish. This simple coating slows down how fast the wood catches fire and gives your family more time to escape.",
    ],
  },
  {
    id: "HAZARD_LABELS.OPEN_FLAME_HAZARD",
    title: "Open Flame Hazards",
    category: "fire",
    default_severity: "critical",
    description:
      "Using candles, gasera lamps, or mosquito coils near curtains and wooden walls. These open flames are very dangerous because they can easily tip over and start a big house fire.",
    earthquake_reason:
      "Candles and gas lamps can tip over during shaking and immediately ignite nearby curtains or wooden floors.",
    typhoon_reason:
      "Strong wind gusts can blow curtains or mosquito nets directly into an open flame and start a fire.",
    fire_reason:
      "An unattended open flame acts as the starting point that spreads fire rapidly through the rest of the home.",
    earthquake_fixes: [
      "If you must use a candle, melt the bottom and stick it inside a heavy glass jar or a deep sardine tin. This cheap holder stops the candle from falling over when the ground shakes.",
      "Place a heavy rock or some sand inside your gasera base to make it more stable. This simple weight stops the lamp from tipping over and spilling oil during a strong tremor.",
      "Blow out all candles and gas lamps immediately at the first sign of ground shaking. This prevents a fire from starting while you are busy protecting your family from the earthquake.",
    ],
    typhoon_fixes: [
      "Place mosquito coils or katol inside an old biscuit tin with holes punched in the lid. This recycled box traps hot embers so the wind cannot blow them onto your curtains.",
      "Keep all candles or gas lamps at least one meter away from windows and mosquito nets. Strong wind gusts can easily blow these light materials into the flame.",
      "Put your candles inside a deep glass bottle or a tall jar to protect the flame from the wind. This stops the fire from dancing around and reaching your wooden walls during a storm.",
    ],
    fire_fixes: [
      "Never leave a mosquito coil or candle burning while you are sleeping. Always double check that they are completely put out before you close your eyes.",
      "Keep matches and lighters in a high plastic container far away from children. Store them away from the heat of your stove to prevent them from catching fire in the kitchen.",
      "Keep a large bucket of dry sand or a heavy wet sack near your candles or cooking area. This is a free and fast way to smother a small fire before it spreads to your ceiling.",
    ],
  },
  {
    id: "HAZARD_LABELS.OVERLOADED_SOCKET",
    title: "Overloaded Sockets",
    category: "electrical",
    default_severity: "high",
    description:
      "Plugging too many appliances like rice cookers, fans, and TVs into one outlet or extension cord. This 'octopus wiring' makes the wires get dangerously hot and can start a fire inside your walls.",
    earthquake_reason:
      "Shaking can loosen heavy plugs from overloaded outlets and cause sparks that ignite walls or floors.",
    typhoon_reason:
      "Rain or humidity reaching overloaded wires can cause a short circuit or total power failure.",
    fire_reason:
      "Overloaded wires overheat and melt their plastic coating, easily setting fire to wooden walls or floors.",
    earthquake_fixes: [
      "Unplug heavy appliances like your refrigerator or washing machine right after a strong earthquake. This stops sparks from jumping if the plugs were shaken loose from the wall.",
      "Use a piece of sturdy tape or a plastic tie to keep your main plugs firmly attached to the outlet. This prevents heavy plugs from falling out and creating dangerous sparks during a shake.",
      "Keep your power strips on the floor instead of hanging them from the wall. This keeps the weight off the outlet so it does not tear out of the wall when the house vibrates.",
    ],
    typhoon_fixes: [
      "Never leave extension cords on the floor if you think rain will leak into your home. Lift all power strips and wires onto a table or chair to keep them dry and safe from short circuits.",
      "Check your plugs for any green or black marks which show they are getting wet or too hot. If you see these marks stop using that outlet immediately to prevent a fire during the storm.",
      "Only use one appliance at a time on each outlet during a storm. This keeps the wires cool and reduces the chance of a total power failure when the electricity is unstable.",
    ],
    fire_fixes: [
      "Feel your plugs and the wall around your outlets with the back of your hand. If they feel warm to the touch unplug everything because the wires inside are starting to melt.",
      "Plug heavy appliances like rice cookers or irons directly into the wall instead of using cheap extension cords. These thin cords are not strong enough and will melt under the heavy load.",
      "Never hide extension cords under rugs or pillows. The heat trapped under the rug can easily start a fire that you will not see until the flames have already spread.",
    ],
  },
  {
    id: "HAZARD_LABELS.DAMAGED_WIRE",
    title: "Damaged Wires",
    category: "electrical",
    default_severity: "high",
    description:
      "Electrical cords that are frayed, cracked, or have bare copper wires showing. These wires are very dangerous because they no longer have their protective plastic cover to stop sparks.",
    earthquake_reason:
      "Shaking can snap old brittle wires and make metal furniture or walls live with dangerous electricity.",
    typhoon_reason:
      "Rain touching exposed copper wires can instantly cause short circuits or electrocute anyone nearby.",
    fire_reason:
      "Heat from a broken wire can quickly ignite nearby curtains, wooden walls, or dusty clutter.",
    earthquake_fixes: [
      "Check all your electric fan and appliance cords for cracks before a disaster hits. If you find a tiny crack wrap it tightly with several layers of thick electrical tape to keep the copper inside covered.",
      "Unplug any device that has a wobbly or loose plug right after a strong shake. A loose connection can cause dangerous sparks called arcing which can start a fire behind your wooden walls.",
      "Move all electrical cords away from under your bed or heavy cabinets. This stops the heavy furniture from pinching and crushing the wires when the house starts to shake.",
    ],
    typhoon_fixes: [
      "Never touch or unplug a damaged wire if your hands are wet or if you are standing on a damp floor. Always turn off the main breaker first to safely cut the power to the whole house.",
      "Lift any cords with old or thin insulation off the floor and hang them on plastic hooks. This keeps them dry and prevents a short circuit if rain leaks through your roof or floor.",
      "Throw away any extension cords that feel very soft or sticky to the touch. This means the plastic is rotting and it will fail instantly if it gets wet during a storm.",
    ],
    fire_fixes: [
      "Clean the dust and cobwebs away from your tangled wires behind the TV or computer. This dust acts like dry grass and can catch fire instantly from a single spark in a damaged wire.",
      "If an appliance cord feels hot while you are using it unplug it and stop using the device. This heat is a warning that the wires inside are broken and could start a fire soon.",
      "Always pull the plug itself and never pull on the wire when disconnecting your appliances. Pulling the wire breaks the tiny copper strands inside which leads to overheating and fire.",
    ],
  },

  {
    id: "HAZARD_LABELS.FLOOR_APPLIANCE",
    title: "Floor Appliances",
    category: "electrical",
    default_severity: "high",
    description:
      "Heavy freestanding appliances like washing machines, refrigerators, and stand fans that sit directly on the floor. These items contain large motors and wiring that are very vulnerable to flooding and vibration.",
    earthquake_reason:
      "Heavy freestanding appliances can 'walk' across the floor or tip over during strong tremors. This can easily crush people or block narrow exit doors.",
    typhoon_reason:
      "Floodwater easily reaches the motors and compressors at the bottom of these appliances. This creates massive electrocution hazards and ruins the equipment.",
    fire_reason:
      "Overworked motors in electric fans or old refrigerators can overheat and short circuit. This easily ignites nearby laundry or plastic housings while you sleep.",
    earthquake_fixes: [
      "Put thick rubber mats or cut pieces of old tires under the feet of your washing machine and ref. This stops them from sliding or 'walking' across the floor during a strong shake.",
      "Use a strong rope, bracket, or metal wire to tie tall refrigerators to a concrete wall. This stops it from falling forward and crushing someone or blocking your only exit.",
      "Always pull the plug out of the wall immediately after the shaking stops. This stops sparks and fire if the wires inside the heavy machine were rattled loose.",
    ],
    typhoon_fixes: [
      "If your barangay always floods, put your refrigerator and washing machine on top of a permanent concrete block or sturdy 'papag'. Keeping the motor above the water is the best way to prevent electric shock.",
      "If the 'baha' or floodwater already reached the bottom of your plugged-in appliance, do not step in the water. Turn off the main breaker switch for the whole house first.",
      "If your electric fan or twin-tub gets submerged in the flood, never just dry it in the sun and plug it back in. Always have a local technician check the motor first to prevent a deadly short circuit.",
    ],
    fire_fixes: [
      "Give your electric fans a rest. If the plastic motor housing feels very hot to the touch, turn it off for a while. Overworked fan motors are a leading cause of house fires in the Philippines.",
      "Sweep away the thick dust and cobwebs behind your refrigerator and under your washing machine. Dust traps heat and acts like dry grass if a small spark happens.",
      "Never hang wet school uniforms or towels directly on or very close to an electric fan to dry them faster. If the fan overheats or sparks, the dry clothes will catch fire instantly.",
    ],
  },
  {
    id: "HAZARD_LABELS.MAJOR_CRACK",
    title: "Major Wall Cracks",
    category: "structural",
    default_severity: "high",
    description:
      "Deep cracks in your walls that are wider than a coin or look like a staircase. These are dangerous because they mean your house foundation is moving or the walls are starting to fail.",
    earthquake_reason:
      "Existing deep cracks give the wall a weak point where it can fully break apart and collapse during strong shaking.",
    typhoon_reason:
      "Rain seeping into deep cracks rusts the iron bars inside the concrete, slowly destroying the wall from the inside.",
    fire_reason:
      "Large gaps in the wall allow deadly smoke and heat to pass through and trap people in other rooms.",
    earthquake_fixes: [
      "Check your walls for cracks that are wider than five millimeters or about the width of two credit cards. If you see cracks this big you should ask a local engineer to check if the house is still safe.",
      "Watch for diagonal cracks that start from the corners of your doors or windows. These are weak points that can snap during an earthquake and cause the whole wall to fall on you.",
      "Never lean heavy furniture or water tanks against a wall that already has big cracks. The extra weight can push the weakened wall over even during a small shake.",
    ],
    typhoon_fixes: [
      "Seal any outside cracks with waterproof cement or sealant before the rainy season starts. This stops water from reaching the iron bars inside your wall so they do not rust and break.",
      "Look for cracks that change size after a big storm. If the crack gets wider it means the ground under your house is moving from too much water and you may need to move to a safer place.",
      "Clean any plants or moss growing inside the wall cracks. Roots act like wedges that slowly push the crack open wider every time it rains making the wall weaker over time.",
    ],
    fire_fixes: [
      "Fill deep wall cracks with fire proof plaster or cement right away. This keeps smoke and fire from sneaking through the wall and spreading to other rooms while you are trying to escape.",
      "Check if your doors or windows are starting to stick and will not close properly. This often happens when major cracks shift the wall and it could trap you inside during a fire emergency.",
      "Move your bed and gas tanks away from walls that have long horizontal cracks. If a fire starts these weakened walls are the first to collapse and can crush everything nearby.",
    ],
  },
  {
    id: "HAZARD_LABELS.MINOR_CRACK",
    title: "Minor Wall Cracks",
    category: "structural",
    default_severity: "low",
    description:
      "Thin hairline cracks in your paint or plaster that are smaller than a strand of hair. These are usually just on the surface and do not mean your wall is about to fall down.",
    earthquake_reason:
      "Small cracks can quietly grow wider after each shake until they become a serious structural problem.",
    typhoon_reason:
      "Rain sneaking into tiny gaps causes mold and rot to build up slowly inside your walls over time.",
    fire_reason:
      "Even small cracks can act as pathways that let dangerous smoke leak from one room to another.",
    earthquake_fixes: [
      "Take a photo of any new hairline cracks after an earthquake and check them again after one month. If the crack has not grown wider it is likely just a surface scratch and not a structural danger.",
      "Use a pencil to draw a small mark at the very end of a new crack. If the crack grows past that mark after a few weeks it means your house is still moving and you should show it to a technician.",
      "Check around your windows and doors for tiny diagonal lines. These small cracks show where the house is flexing most during a shake and are usually safe as long as they stay very thin.",
    ],
    typhoon_fixes: [
      "Paint over hairline cracks with a thick layer of waterproof paint like elastomeric paint. This simple fix seals the opening and stops typhoon rain from soaking into your concrete walls.",
      "Watch for damp spots or peeling paint near any minor cracks during the rainy season. If the wall feels wet it means water is getting inside and you need to seal the crack with a bit of putty.",
      "Apply a clear water repellent spray to the outside of your walls if you see many small cracks. This is a cheap way to stop water from entering without changing the look of your home.",
    ],
    fire_fixes: [
      "Seal any small gaps around your electrical outlets or where pipes enter the wall. This stops smoke from using these tiny highways to move between rooms during a fire.",
      "Check the mosquito nets or kulambo near walls with cracks. Make sure they are not touching the wall so that any heat or smoke coming through the crack does not set the net on fire.",
      "Keep your walls clean and free of old peeling paint around minor cracks. Dry and flaky paint can act like tinder that catches fire easily if a spark reaches the wall.",
    ],
  },
  {
    id: "HAZARD_LABELS.BROKEN_GLASS",
    title: "Broken Glass Hazards",
    category: "interior",
    default_severity: "medium",
    description:
      "Standard glass in jalousie windows, large mirrors, and platera cabinets. These are dangerous because they easily shatter into sharp jagged pieces instead of crumbling safely.",
    earthquake_reason:
      "Twisting window frames during a shake can cause glass to explode inward and scatter sharp shards across the floor and sleeping areas.",
    typhoon_reason:
      "Flying debris carried by strong winds can smash through windows and send sharp glass pieces shooting into the room.",
    fire_reason:
      "Extreme heat causes glass to shatter suddenly without warning, scattering dangerous shards directly across your escape path.",
    earthquake_fixes: [
      "Move your bed away from jalousie windows and large hanging mirrors. If the glass shatters during a shake you do not want it falling directly on where you sleep.",
      "Always keep a pair of thick tsinelas or slippers right next to your bed. You will need them to walk safely across floors covered in sharp bubog or glass shards after a tremor.",
      "Apply clear safety film over the glass doors of your platera or display cabinets. If the frame bends the sticky film will hold the broken pieces together instead of exploding outward.",
    ],
    typhoon_fixes: [
      "Stop putting masking tape in an X shape on your windows because it does not stop glass from breaking. Instead use thick plywood to cover your windows before a strong storm hits.",
      "Close your thick curtains or drop your heavy blinds during a strong typhoon. The fabric acts as a shield to catch sharp pieces if flying debris hits your window from the outside.",
      "Stay in the inner rooms of your house far away from jalousie windows. Strong wind gusts can blow sharp glass straight into the room if the window frame breaks.",
    ],
    fire_fixes: [
      "Never break a window with your bare hands or feet to escape a fire. Always use a heavy object like a chair or a thick blanket to smash the glass safely without cutting yourself.",
      "Avoid crawling under large glass windows when escaping a burning room. The extreme heat of the fire causes thermal shock which makes the glass explode outward into the room.",
      "Keep the path to your main door completely free of large glass vases or plateras. You need a safe walking path that will not cover your floor in sharp debris if the house gets hot.",
    ],
  },
  {
    id: "HAZARD_LABELS.COLLAPSED_STRUCTURE",
    title: "Collapsed Structures",
    category: "structural",
    default_severity: "critical",
    description:
      "A building that has partially or completely fallen down due to weak walls, a bad foundation, or rotten supports. This is the most dangerous hazard because it can trap or crush anyone inside the home.",
    earthquake_reason:
      "Weak ground floors can drop or fold sideways in seconds, leaving no time to escape the collapsing structure.",
    typhoon_reason:
      "Floodwater washing away soil under the house can cause the entire foundation to tilt or sink without warning.",
    fire_reason:
      "Heat weakens roof and floor supports until they can no longer hold their own weight and suddenly give way.",
    earthquake_fixes: [
      "Identify the 'Triangle of Life' in your home. This is a small safe space next to large and sturdy objects like a heavy sofa or a solid wooden desk where a gap might form if the ceiling falls.",
      "Never run outside while the ground is still shaking. Most injuries in the Philippines happen when people are hit by falling hollow blocks or glass while trying to leave the building.",
      "Practice the 'Drop, Cover, and Hold On' drill with your family. This habit helps you protect your head and neck immediately so you can survive the first few seconds of a collapse.",
    ],
    typhoon_fixes: [
      "Check for 'soil erosion' or large holes around the base of your house after a big storm. If the ground is washed away your house foundation is no longer supported and could sink.",
      "Listen for loud 'popping' or 'cracking' sounds coming from your walls or roof during a typhoon. These sounds mean the structure is under too much stress and you should leave immediately.",
      "Avoid staying in a room that has a heavy concrete roof if the walls underneath it are already cracked. The heavy weight of the roof is the most dangerous part if the walls fail.",
    ],
    fire_fixes: [
      "Get out and stay out as soon as you see a fire. Never go back inside a burning building to save your belongings because the roof or floor could collapse on you at any second.",
      "Avoid walking through rooms where the floor feels soft or bouncy after a fire. This is a sign that the wooden or steel supports underneath have been weakened by the heat.",
      "Be very careful near 'yero' or tin roofs that have been in a fire. The heat makes the metal sheets loose and they can slide off and fall like sharp blades even after the fire is gone.",
    ],
  },
];
