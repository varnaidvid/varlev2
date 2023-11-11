export type customCompetitorType = {
    id: string;
    year: number;
    class: string;
    teamId: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        username: string;
    };
};