import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { feedbackService, type FeedbackAllParams, type FeedbackListParams } from "@/services/feedback.service";
import type { FeedbackHandleReq, FeedbackReq } from "@/types/feedback/feedback.types";

export const feedbackKeys = {
    all: ["feedbacks"] as const,

    lists: () => [...feedbackKeys.all, "list"] as const,

    list: (
        params?: MaybeRefOrGetter<FeedbackListParams | undefined>
    ) => [
        ...feedbackKeys.lists(),
        toValue(params)?.subject || "",
        toValue(params)?.page ?? 0,
        toValue(params)?.size ?? 10,
        toValue(params)?.sort ?? "createdAt,desc"
    ] as const,

    adminList: (
        params?: MaybeRefOrGetter<FeedbackAllParams | undefined>
    ) => [
        ...feedbackKeys.lists(),
        "all",
        toValue(params)?.keyword || "",
        toValue(params)?.page ?? 0,
        toValue(params)?.size ?? 10,
        toValue(params)?.sort ?? "createdAt,desc"
    ] as const,

    details: () => [...feedbackKeys.all, "detail"] as const,

    detail: (
        feedbackId: MaybeRefOrGetter<number | null | undefined>
    ) => [
        ...feedbackKeys.details(),
        toValue(feedbackId)
    ] as const
};

function normalizeParams(params?: MaybeRefOrGetter<FeedbackListParams>) {
    const p = toValue(params);

    return {
        subject: p?.subject ?? null,
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc",
    };
}

function normalizeAllParams(params?: MaybeRefOrGetter<FeedbackAllParams>) {
    const p = toValue(params);

    return {
        keyword: p?.keyword ?? null,
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc",
    };
}

export const useFeedbacksByAccountQuery = (
    params?: MaybeRefOrGetter<FeedbackListParams>
) => {
    const normalizedParams = computed(() => normalizeParams(params));

    return useQuery({
        queryKey: computed(() => feedbackKeys.list(normalizedParams)),
        queryFn: () => feedbackService.getAllByCurrentAccount(normalizedParams.value),
        placeholderData: previousData => previousData,
        staleTime: 30_000
    });
};

export const useFeedbacksQuery = (
    params?: MaybeRefOrGetter<FeedbackAllParams>
) => {
    const normalizedParams = computed(() => normalizeAllParams(params));

    return useQuery({
        queryKey: computed(() => feedbackKeys.adminList(normalizedParams)),
        queryFn: () => feedbackService.getAll(normalizedParams.value),
        placeholderData: previousData => previousData,
        staleTime: 30_000
    });
};

export const useFeedbackQuery = (
    feedbackId: MaybeRefOrGetter<number | null | undefined>
) => {
    const enabled = computed(() => !!toValue(feedbackId));
    const resolvedFeedbackId = computed(() => toValue(feedbackId));

    return useQuery({
        queryKey: computed(() => feedbackKeys.detail(resolvedFeedbackId)),
        queryFn: () => feedbackService.getById(resolvedFeedbackId.value!),
        enabled,
        staleTime: 30_000
    });
};

export const useCreateFeedbackMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FeedbackReq) => feedbackService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
        }
    });
};

export const useHandleFeedbackMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            feedbackId,
            data
        }: {
            feedbackId: number;
            data: FeedbackHandleReq;
        }) => feedbackService.handle(feedbackId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
        }
    });
};
