import { toValue, type MaybeRefOrGetter } from "vue";
import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type { FeedbackHandleReq, FeedbackReq, FeedbackRes } from "@/types/feedback/feedback.types";
import api from "./api.base";

const BASE_URL = "/feedbacks";

export interface FeedbackListParams extends PageParams {
    subject?: string | null;
}

export interface FeedbackAllParams extends PageParams {
    keyword?: string | null;
}

export const feedbackService = {
    create: async (
        data: MaybeRefOrGetter<FeedbackReq>
    ): Promise<ApiResponse<FeedbackRes>> => {
        const res = await api.post<ApiResponse<FeedbackRes>>(BASE_URL, toValue(data));
        return res.data;
    },

    handle: async (
        feedbackId: MaybeRefOrGetter<number>,
        data: MaybeRefOrGetter<FeedbackHandleReq>
    ): Promise<ApiResponse<FeedbackRes>> => {
        const res = await api.patch<ApiResponse<FeedbackRes>>(
            `${BASE_URL}/${toValue(feedbackId)}/handle`,
            toValue(data)
        );
        return res.data;
    },

    delete: async (
        feedbackId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`${BASE_URL}/${toValue(feedbackId)}`);
        return res.data;
    },

    getById: async (
        feedbackId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<FeedbackRes>> => {
        const res = await api.get<ApiResponse<FeedbackRes>>(`${BASE_URL}/${toValue(feedbackId)}`);
        return res.data;
    },

    getAllByCurrentAccount: async (
        params?: MaybeRefOrGetter<FeedbackListParams>
    ): Promise<ApiResponse<PageResponse<FeedbackRes>>> => {
        const resolvedParams = toValue(params);
        const res = await api.get<ApiResponse<PageResponse<FeedbackRes>>>(BASE_URL, {
            params: {
                subject: resolvedParams?.subject || undefined,
                page: resolvedParams?.page ?? 0,
                size: resolvedParams?.size ?? 10,
                sort: resolvedParams?.sort ?? "createdAt,desc",
            }
        });
        return res.data;
    },

    getAll: async (
        params?: MaybeRefOrGetter<FeedbackAllParams>
    ): Promise<ApiResponse<PageResponse<FeedbackRes>>> => {
        const resolvedParams = toValue(params);
        const res = await api.get<ApiResponse<PageResponse<FeedbackRes>>>(`${BASE_URL}/all`, {
            params: {
                keyword: resolvedParams?.keyword || undefined,
                page: resolvedParams?.page ?? 0,
                size: resolvedParams?.size ?? 10,
                sort: resolvedParams?.sort ?? "createdAt,desc",
            }
        });
        return res.data;
    }
};
