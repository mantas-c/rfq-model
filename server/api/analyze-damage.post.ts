import Anthropic from '@anthropic-ai/sdk'

const PART_MAP: Record<string, string> = {
  front_bumper: 'front bumper',
  hood: 'hood / bonnet',
  hood_front: 'hood (front view)',
  windshield: 'front windshield',
  roof: 'roof panel',
  rear_window: 'rear windshield',
  trunk: 'trunk / boot lid',
  trunk_lid: 'trunk lid',
  rear_bumper: 'rear bumper',
  rear_b_panel: 'rear bumper panel',
  lf_fender: 'left front fender / wing',
  rf_fender: 'right front fender / wing',
  lf_wing: 'left front fender (front view)',
  rf_wing: 'right front fender (front view)',
  left_mirror: 'left side mirror',
  right_mirror: 'right side mirror',
  lf_door: 'left front door',
  rf_door: 'right front door',
  lr_door: 'left rear door',
  rr_door: 'right rear door',
  lr_quarter: 'left rear quarter panel',
  rr_quarter: 'right rear quarter panel',
  lr_wing: 'left rear quarter (rear view)',
  rr_wing: 'right rear quarter (rear view)',
  lh_light: 'left headlight',
  rh_light: 'right headlight',
  lt_light: 'left taillight',
  rt_light: 'right taillight',
  front_grille: 'front grille / center bumper',
}

const PART_IDS = Object.keys(PART_MAP)

const SYSTEM_PROMPT = `You are an expert automotive damage assessor working for an insurance claim platform.
Analyze car damage photos and identify damaged parts. Respond ONLY with valid JSON — no markdown, no explanation.`

const USER_PROMPT = `Analyze these car damage photos. Identify all visibly damaged parts.

Respond with this exact JSON structure:
{
  "damaged_parts": ["part_id1", "part_id2"],
  "severity": "minor|medium|major",
  "confidence": 0.0-1.0,
  "description": "One sentence summary of the damage in Lithuanian language",
  "damage_notes": { "part_id": "brief note" }
}

Use ONLY these exact part IDs (map what you see to the closest one):
${PART_IDS.map(id => `- ${id}: ${PART_MAP[id]}`).join('\n')}

Rules:
- Only include parts clearly visible as damaged
- "minor" = scratches/small dents, "medium" = noticeable dents/cracks, "major" = severe deformation/broken
- confidence = how certain you are (0.0–1.0)
- description must be in Lithuanian
- damage_notes: short English note per damaged part (optional)`

export default defineEventHandler(async (event) => {
  const { images } = await readBody<{ images: string[] }>(event)

  if (!images?.length) {
    throw createError({ statusCode: 400, message: 'No images provided' })
  }

  // ── Demo mode (no API key) ────────────────────────────────
  if (!process.env.ANTHROPIC_API_KEY) {
    await new Promise(r => setTimeout(r, 2200))

    // BMW severe front-end collision mock (matches demo test image)
    return {
      damaged_parts: ['front_bumper', 'hood', 'hood_front', 'lh_light', 'rh_light', 'lf_fender', 'rf_fender', 'lf_wing', 'rf_wing', 'front_grille'],
      severity: 'major',
      confidence: 0.97,
      description: 'Katastrofiškas priekinis smūgis: visiškai sunaikintas priekinis buferis, groteles ir abu žibintai; stipriai deformuotas variklio dangtis ir abu priekiniai sparnai.',
      damage_notes: {
        front_bumper: 'Completely destroyed, missing large sections',
        hood:         'Severely crumpled, folded back toward windshield',
        hood_front:   'Front edge buckled upward, structure compromised',
        lh_light:     'Assembly destroyed, mounting points torn out',
        rh_light:     'Assembly destroyed, mounting points torn out',
        lf_fender:    'Bent outward, paint stripped, structural damage',
        rf_fender:    'Bent outward, paint stripped, structural damage',
        lf_wing:      'Flared and crumpled at impact zone',
        rf_wing:      'Flared and crumpled at impact zone',
        front_grille: 'Completely missing, radiator fully exposed',
      },
    }
  }

  // ── Real Claude API call ──────────────────────────────────
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const imageContent = images.slice(0, 4).map((dataUri: string) => {
    const [header, data] = dataUri.split(',')
    const mediaType = (header?.match(/:(.*?);/)?.[1] || 'image/jpeg') as
      'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
    return {
      type: 'image' as const,
      source: { type: 'base64' as const, media_type: mediaType, data },
    }
  })

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: [
        ...imageContent,
        { type: 'text', text: USER_PROMPT },
      ],
    }],
  })

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw createError({ statusCode: 500, message: 'AI returned no JSON' })

  const result = JSON.parse(jsonMatch[0])

  // Validate part IDs — strip any hallucinated ones
  result.damaged_parts = (result.damaged_parts as string[]).filter(id => PART_IDS.includes(id))

  return result
})
