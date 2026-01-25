import { JurisdictionRule } from './types';

// Mock database of rules - In a real app, this comes from the DB
const JURISDICTION_RULES: JurisdictionRule[] = [
    {
        id: 'rule-1',
        state: 'Generic',
        road_name_pattern: 'Expressway',
        jurisdiction: 'FEDERAL'
    },
    {
        id: 'rule-2',
        state: 'Generic',
        road_name_pattern: 'Trunk A',
        jurisdiction: 'FEDERAL'
    },
    {
        id: 'rule-3',
        state: 'Lagos',
        road_name_pattern: 'Third Mainland Bridge',
        jurisdiction: 'FEDERAL'
    }
];

/**
 * The "Systems Thinking" Core:
 * Automatically routes reports to the correct authority based on location data.
 */
export function determineJurisdiction(
    address: string,
    state: string,
    rules: JurisdictionRule[] = JURISDICTION_RULES
): 'FEDERAL' | 'STATE' | 'UNKNOWN' {
    if (!address || !state) return 'UNKNOWN';

    const addr = address.toLowerCase();

    // 1. Check against loaded rules
    const ruleMatch = rules.find(r => {
        // Check state match (or generic rule)
        const stateMatch = r.state === 'Generic' || r.state.toLowerCase() === state.toLowerCase();
        // Check pattern match
        const patternMatch = addr.includes(r.road_name_pattern.toLowerCase());

        return stateMatch && patternMatch;
    });

    if (ruleMatch) {
        return ruleMatch.jurisdiction;
    }

    // 2. Fallback Logic / Heuristics
    // Most inner city roads are State/LGA, most "Highways" are Federal
    if (addr.includes('highway') || addr.includes('interstate')) {
        return 'FEDERAL';
    }

    return 'STATE';
}
