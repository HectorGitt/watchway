import { Report } from "@/lib/types";

export const MOCK_REPORTS: Report[] = [
    {
        id: "r1",
        title: "Collapsed Bridge Section",
        description: "The expansion joint on the Third Mainland Bridge is failing, causing tire damage.",
        location: {
            lat: 6.5005,
            lng: 3.3900,
            address: "Third Mainland Bridge, Lagos",
            state: "Lagos",
            lga: "Lagos Mainland"
        },
        jurisdiction: "FEDERAL",
        severity_level: 9,
        status: "reported",
        images: [],
        created_at: new Date().toISOString(),
        reporter_id: "u1"
    },
    {
        id: "r2",
        title: "Deep Pothole on Isaac John",
        description: "A large pothole in front of the Radisson Blu hotel.",
        location: {
            lat: 6.5866,
            lng: 3.3567,
            address: "Isaac John Street, Ikeja",
            state: "Lagos",
            lga: "Ikeja"
        },
        jurisdiction: "STATE",
        severity_level: 6,
        status: "verified",
        images: [],
        created_at: new Date().toISOString(),
        reporter_id: "u2"
    },
    {
        id: "r3",
        title: "Flooded Drainage",
        description: "Drainage completely blocked, causing flooding during light rains.",
        location: {
            lat: 6.4312,
            lng: 3.4158,
            address: "Ozumba Mbadiwe Ave, Victoria Island",
            state: "Lagos",
            lga: "Eti-Osa"
        },
        jurisdiction: "STATE",
        severity_level: 8,
        status: "reported",
        images: [],
        created_at: new Date().toISOString(),
        reporter_id: "u3"
    },
    {
        id: "r4",
        title: "Lagos-Ibadan Expressway Washout",
        description: "Dangerous erosion near the Long Bridge section.",
        location: {
            lat: 6.6430,
            lng: 3.4760,
            address: "Lagos-Ibadan Expressway",
            state: "Ogun",
            lga: "Obafemi Owode"
        },
        jurisdiction: "FEDERAL",
        severity_level: 10,
        status: "reported",
        images: [],
        created_at: new Date().toISOString(),
        reporter_id: "u4"
    }
];
