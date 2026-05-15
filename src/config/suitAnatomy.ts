export const SUIT_ANATOMY = {
    type: ['skirt-suit', 'gown-suit'] as const,

    skirtLength: {
        'knee': 'hem falls just at the knee',
        '3/4': 'hem falls between the knee and ankle, around or just above the mid-calf',
        'full': 'hem falls at or just above the ankle',
    },

    gownLength: {
        '3/4': 'hem falls between the knee and ankle, around or just above the mid-calf',
        'full': 'hem falls at or just above the ankle',
    },

    sleeveLength: {
        '3/4': 'sleeve ends between the elbow and wrist, closer to the wrist',
        'full': 'sleeve ends at the wrist: a watch or bangle should be partially-fully visible',
    },

    // Skirts only
    hasCamisole: 'this skirt suit is a 3 piece suit: take note of the camisole',
    
    // Gowns only
    hasBelt: 'gown suit features a belt',
    hasNoJacket: 'Turkey-style gown with no jacket; the gown alone is the full outfit',

} as const;

export type SuitType = typeof SUIT_ANATOMY.type[number];
export type SkirtLength = keyof typeof SUIT_ANATOMY.skirtLength;
export type GownLength = keyof typeof SUIT_ANATOMY.gownLength;
export type SleeveLength = keyof typeof SUIT_ANATOMY.sleeveLength;
