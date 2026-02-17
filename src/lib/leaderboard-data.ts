export interface StateStat {
    rank: number;
    state: string;
    total_reports: number;
    unverified_reports: number;
    fixed_reports: number;
    avg_fix_time_days: number;
    safety_score: number; // 0 - 100 (Higher is Better)
}

export const MOOCK_LEADERBOARD: StateStat[] = [
    {
        rank: 1,
        state: "Abuja (FCT)",
        total_reports: 650,
        unverified_reports: 40,
        fixed_reports: 500,
        avg_fix_time_days: 5,
        safety_score: 95
    },
    {
        rank: 2,
        state: "Lagos",
        total_reports: 1403,
        unverified_reports: 120,
        fixed_reports: 850,
        avg_fix_time_days: 14,
        safety_score: 78
    },
    {
        rank: 3,
        state: "Kano",
        total_reports: 410,
        unverified_reports: 180,
        fixed_reports: 100,
        avg_fix_time_days: 28,
        safety_score: 45
    },
    {
        rank: 4,
        state: "Ogun",
        total_reports: 520,
        unverified_reports: 200,
        fixed_reports: 150,
        avg_fix_time_days: 30,
        safety_score: 35
    },
    {
        rank: 5,
        state: "Rivers",
        total_reports: 890,
        unverified_reports: 340,
        fixed_reports: 120,
        avg_fix_time_days: 45,
        safety_score: 12
    }
];
