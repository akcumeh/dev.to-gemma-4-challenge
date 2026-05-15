export const STYLE_VARIANTS = {
    fashion: ['corporate', 'sunday-wear', 'muslim', 'upscale'] as const,
    // 'nigerian' is NOT in this array — it lives in headwear and STYLE_WEIGHTS only.
    // This keeps the const array clean for non-weighted consumers.

    headwear: {
        'sunday-wear': ['church hat', 'wide-brim fascinator', 'decorative headpiece'],
        'muslim': ['hijab', 'matching turban', 'matching headscarf', 'draped headscarf coordinated with the suit'],
        'upscale': ['none', 'small elegant hat'],
        'corporate': ['none'],
        'nigerian': [
            'matching color aso-oke gele',
            'Igbo-style headtie in a complementary fabric, folded and pinned neatly',
            'aso-ebi gele in a matching or tonal color, structured and formal',
        ],
    },

    hair: [
        'low-cut natural hair',
        'styled bob wig',
        'neat box braids',
        'twisted updo',
        'short locs',
    ] as const,

    skinTone: ['fair', 'medium brown', 'dark brown', 'deep ebony'] as const,

    age: ['late 20s', '30s', '40s', '50s', '60s'] as const,

    background: [
        'neutral white studio background',
        'bright church interior',
        'modern corporate office with large windows',
        'luxury home interior with fireplace',
        'elegant marble stairwell',
        'near-white minimal indoor setting',
    ] as const,

    accessories: [
        'small gold or silver stud earrings',
        'pearl necklace',
        'no visible accessories',
        'small brooch on lapel',
        'simple silver bracelet',
        'black leather wirstwatch',
    ] as const,
} as const;

/**
 * Weighted probabilities for fashion style and age.
 * All values in each group must sum to 100.
 *
 * fashion.freeform:    Nigerian fires ~10% on no-caption requests.
 * fashion.withCaption: Nigerian excluded; its 10% redistributed proportionally.
 * age:                 50s and 60s are rare; bulk stays in the 30s–40s range.
 */
export const STYLE_WEIGHTS = {
    fashion: {
        freeform: {
            'corporate': 23,
            'sunday-wear': 23,
            'upscale': 24,
            'muslim': 20,
            'nigerian': 10,
        },
        withCaption: {
            'corporate': 25,
            'professional': 10,
            'sunday-wear': 25,
            'upscale': 22,
            'muslim': 18,
        },
    },
    age: {
        'late 20s': 15,
        '30s': 30,
        '40s': 30,
        '50s': 15,
        '60s': 10,
    },
} as const;

export type FashionStyle = typeof STYLE_VARIANTS.fashion[number] | 'nigerian';

export interface PickedVariant {
    fashion: FashionStyle;
    headwear: string;
    hair: string;
    skinTone: string;
    age: string;
    background: string;
    accessories: string;
}