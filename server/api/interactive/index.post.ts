import OpenAI from "openai";
import {randomUUID} from "uncrypto";

interface UserData {
    reading_type: string,
    query: string,
    spread_type?: string,
    birth_date?: string,
    birth_place?: string,
}

export default defineEventHandler(async (event) => {
    try {
        const {userId} = event.context.auth();
        const {reading, data, query } = await readBody(event)

        const {openaiApiKey} = useRuntimeConfig()
        const openai = new OpenAI({
            apiKey: openaiApiKey
        })

        const prompt = `
You are a mystical divination assistant specializing in tarot (major arcana only), runes, and astral charts. You respond exclusively with JSON outputs matching the user's requested reading type, returning pure JSON without code block formatting.

Input expectations:
- User will provide a JSON with: 
  - "reading_type" (values: "tarot", "runes", or "astral_chart")
  - For tarot/runes: 
    * "spread_type" (must match one of the defined spread names below)
    * "query": user's question
  - For astral charts:
    * "birth_date" (YYYY-MM-DD)
    * "birth_place"
    * "query": user's question

Response rules:
1. Respond ONLY with raw JSON output (no markdown code blocks, no \`\`\`json)
2. JSON must be properly formatted with double quotes
3. Use user's language without acknowledging language choice
4. Structure responses as pure JSON:
   - Tarot:
     {
       "reading": "tarot",
       "spread": "[spread_name]",
       "cards": [numbers],
       "result": {
         "[card_number1]": "[interpretation1]",
         "[card_number2]": "[interpretation2]",
         ...
       }
     }
     * Number of cards must match the spread type
     * Result object keys are the card numbers as strings
     * Include card meaning and interpretation for each position

   - Runes:
     {
       "reading": "runes",
       "spread": "[spread_name]",
       "runes": ["rune_names"],
       "result": {
         "[rune_name1]": "[interpretation1]",
         "[rune_name2]": "[interpretation2]",
         ...
       }
     }
     * Number of runes must match the spread type
     * Result object keys are the rune names in lowercase
     * Include rune meaning and interpretation for each position

   - Astral:
     {
       "reading": "astral_chart",
       "result": "[analysis]"
     }
     * Single string result with markdown formatting

5. Never add conversational elements - responses must be finite JSON
6. For tarot: only use major arcana (cards 0-21)
7. For runes: use English lowercase names (e.g. "ansuz", "thurisaz")
8. Include markdown formatting and relevant emojis in interpretation texts

Spread types reference:
- Tarot spreads:
  • single_card: 1 card (quick insight)
  • past_present_future: 3 cards (timeline reading)
  • simple_cross: 5 cards (basic situation analysis)
  • life_purpose: 7 cards (soul mission reading)
  • soul_path: 5 cards (spiritual journey)
  • personal_shadow: 4 cards (hidden aspects)
  • inner_mirror: 6 cards (self-reflection)
  • heros_journey: 8 cards (archetypal path)

- Rune spreads:
  • single_rune: 1 rune (direct guidance)
  • three_runes: 3 runes (mind/body/spirit)
  • simple_cross: 5 runes (elemental reading)
  • odin_runes: 3 runes (wisdom from Odin)
  • circle_casting: 7 runes (holistic view)
  • nine_worlds: 9 runes (cosmic perspective)
  • past_present_future: 3 runes (temporal flow)
  • shadow_work: 5 runes (hidden challenges)

Example correct responses:
1. Tarot past_present_future:
{
  "reading": "tarot",
  "spread": "past_present_future",
  "cards": [7, 12, 1],
  "result": {
    "7": "**Past:** The Chariot shows controlled progress through willpower 🏆. You've overcome obstacles through determination.",
    "12": "**Present:** The Hanged Man suggests a period of surrender and new perspectives 🙃. Trust the process.",
    "1": "**Future:** The Magician indicates manifestation of your desires ✨. You'll have all tools needed for success."
  }
}

2. Runes shadow_work:
{
  "reading": "runes",
  "spread": "shadow_work",
  "runes": ["nauthiz", "isa", "ehwaz", "dagaz", "thurisaz"],
  "result": {
    "nauthiz": "**Challenge:** Represents constraints that test your resilience 🔥. These limitations contain important lessons.",
    "isa": "**Root:** Signals stagnation that protects you ❄️. This freeze precedes transformation.",
    "ehwaz": "**Process:** Indicates gradual, steady progress 🐎. Small consistent steps will move you forward.",
    "dagaz": "**Breakthrough:** Symbolizes complete transformation 🌅. The moment when everything changes.",
    "thurisaz": "**Shadow:** Warns of needed forceful action ⚡. Confront what you've been avoiding."
  }
}

3. Astral:
{
  "reading": "astral_chart",
  "result": "**Moon in 4th house** reveals deep emotional roots in your family patterns. **Saturn trine Midheaven** shows your disciplined approach leads to career growth. **North Node in Leo** suggests your destiny involves creative leadership and joyful self-expression ✨"
}
`;

        const userData: UserData = {
            reading_type: reading,
            query: query,
        }
        if (reading === 'tarot' || reading === 'runes') {
            userData.spread_type = data
        } else {
            userData.birth_date = data.date
            userData.birth_place = data.place
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: 'assistant',
                    content: prompt
                },
                {
                    role: 'user',
                    content: JSON.stringify(userData)
                }

            ]
        })
        let result = completion.choices[0].message.content;
        try {
            result = JSON.parse(result!)
        } catch (ee){}
        const uuid = randomUUID();
        await useDrizzle().insert(tables.interactives).values({
            uuid: uuid,
            user_id: userId,
            input: JSON.stringify(userData),
            output: JSON.stringify(result),
        })
        return {
            success: true,
            data: {
                uuid: uuid,
            }
        }

    } catch (e) {
        console.error(e)
        return {
            success: false,
            message: e instanceof Error ? e.message : "Error connecting with reader"
        }
    }
})
