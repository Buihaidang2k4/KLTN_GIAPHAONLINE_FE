export type FeedbackType = 'BUG_REPORT' | 'FEATURE_REQUEST' | 'UI_FEEDBACK' | 'OTHER' | string;

export type FeedbackStatus = 'PENDING' | 'REJECTED' | 'PROCESSING' | 'RESOLVED';

export interface FeedbackRes {
    feedbackId: number;
    email: string;
    type: FeedbackType;
    subject: string;
    content: string;
    status: FeedbackStatus;
    adminResponse?: string | null;
    createdAt: string;
    resolvedAt?: string | null;
}

export interface FeedbackReq {
    subject: string;
    content: string;
    type: FeedbackType;
}

export interface FeedbackHandleReq {
    status: FeedbackStatus;
    adminResponse?: string | null;
}

export interface FeedbackParams {
    accountId: number;
    subject?: string | null;
    page?: number;
    size?: number;
    sort?: string;
}
