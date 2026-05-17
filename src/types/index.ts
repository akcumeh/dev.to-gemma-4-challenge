import {
    SuitType,
    SkirtLength,
    GownLength,
    SleeveLength,
} from '../config/suitAnatomy';

export interface SuitAnalysis {
    color: string;
    pattern: string;
    texture: string;
    type: SuitType;
    sleeveLength: SleeveLength;
    
    // skirt suits
    skirtLength?: SkirtLength;
    hasCamisole?: boolean;
    
    // gown suits
    gownLength?: GownLength;
    hasBelt?: boolean;
    hasNoJacket?: boolean;
    
    notes: string;    
}

export interface WAMsg {
    from: string;
    type: string;
    image?: {
        id: string;
        caption?: string;
        mime_type: string;
    };
    text?: { body: string };
}