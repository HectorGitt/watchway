export interface StateStat {
    rank: number;
    state: string;
    total_reports: number;
    unverified_reports: number;
    fixed_reports: number;
    avg_fix_time_days: number;
    danger_score: number; // 0 - 100 (Higher is worse)
}

export const MOOCK_LEADERBOARD: StateStat[] = [
    {
        rank: 1,
        state: "Rivers",
        total_reports: 890,
        unverified_reports: 340,
        fixed_reports: 120,
        avg_fix_time_days: 45,
        danger_score: 88 // "The Shame" - High unverified, low fixes
    },
    {
        rank: 2,
        state: "Ogun",
        total_reports: 520,
        unverified_reports: 200,
        fixed_reports: 150,
        avg_fix_time_days: 30,
        danger_score: 75
    },
    {
        rank: 3,
        state: "Kano",
        total_reports: 410,
        unverified_reports: 180,
        fixed_reports: 100,
        avg_fix_time_days: 28,
        danger_score: 72
    },
    {
        rank: 4,
        state: "Lagos",
        total_reports: 1403,
        unverified_reports: 120,
        fixed_reports: 850,
        avg_fix_time_days: 14,
        danger_score: 45 // High volume, but high fix rate
    },
    {
        rank: 5,
        state: "Abuja (FCT)",
        total_reports: 650,
        unverified_reports: 40,
        fixed_reports: 500,
        avg_fix_time_days: 5,
        danger_score: 12 // Performing well
    }
];
