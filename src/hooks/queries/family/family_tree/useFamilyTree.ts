import { familyTreeService } from "@/services/family_tree.service";
import type { PersonReq } from "@/types/family/family_tree.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const familyTreeKey = {
  all: ["family-tree"] as const,

  trees: () => [...familyTreeKey.all, "tree"] as const,
  tree: (categoryId: MaybeRefOrGetter<number | null | undefined>) =>
    [...familyTreeKey.trees(), toValue(categoryId)] as const,

  persons: () => [...familyTreeKey.all, "person"] as const,
  person: (personId: MaybeRefOrGetter<number | null | undefined>) =>
    [...familyTreeKey.persons(), toValue(personId)] as const,

  partners: (personId: MaybeRefOrGetter<number | null | undefined>) =>
    [...familyTreeKey.person(personId), "partners"] as const,
  mothers: (fatherId: MaybeRefOrGetter<number | null | undefined>) =>
    [...familyTreeKey.person(fatherId), "mothers"] as const,
};

// ==================== Queries ====================

export const useFamilyTreeQuery = (categoryId: MaybeRefOrGetter<number | null | undefined>) => {
  const enabled = computed(() => !!toValue(categoryId));
  const resolvedId = computed(() => toValue(categoryId));

  return useQuery({
    queryKey: computed(() => familyTreeKey.tree(resolvedId)),
    queryFn: () => familyTreeService.getTree(resolvedId.value!),
    enabled,
  });
};

export const usePersonQuery = (personId: MaybeRefOrGetter<number | null | undefined>) => {
  const enabled = computed(() => !!toValue(personId));
  const resolvedId = computed(() => toValue(personId));

  return useQuery({
    queryKey: computed(() => familyTreeKey.person(resolvedId)),
    queryFn: () => familyTreeService.getPersonById(resolvedId.value!),
    enabled,
  });
};

export const usePartnersQuery = (personId: MaybeRefOrGetter<number | null | undefined>, options?: any) => {
  const resolvedId = computed(() => toValue(personId));
  const { enabled: externalEnabled, ...restOptions } = options || {};
  const enabled = computed(() => {
    const hasId = !!toValue(personId);
    const externalOk = externalEnabled ? toValue(externalEnabled) : true;
    return hasId && externalOk;
  });

  return useQuery({
    queryKey: computed(() => familyTreeKey.partners(resolvedId)),
    queryFn: () => familyTreeService.getPartners(resolvedId.value!),
    enabled,
    ...restOptions,
  });
};

export const useMothersQuery = (fatherId: MaybeRefOrGetter<number | null | undefined>, options?: any) => {
  const enabled = computed(() => !!toValue(fatherId));
  const resolvedId = computed(() => toValue(fatherId));

  return useQuery({
    queryKey: computed(() => familyTreeKey.mothers(resolvedId)),
    queryFn: () => familyTreeService.getMothersByFatherId(resolvedId.value!),
    enabled,
    ...options,
  });
};

// ==================== Mutations ====================

export const useCreatePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: number; data: PersonReq }) =>
      familyTreeService.createPerson(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyTreeKey.trees() });
    },
  });
};

export const useUpdatePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personId, data }: { personId: number; data: PersonReq }) =>
      familyTreeService.updatePerson(personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyTreeKey.all });
    },
  });
};

export const useAddRootMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personId, data }: { personId: number; data: PersonReq }) =>
      familyTreeService.addRoot(personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyTreeKey.trees() });
    },
  });
};

export const useAddPartnerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personId, data }: { personId: number; data: PersonReq }) =>
      familyTreeService.addPartner(personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyTreeKey.trees() });
    },
  });
};

export const useAddChildMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ personId, data }: { personId: number; data: PersonReq }) =>
      familyTreeService.addChild(personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyTreeKey.trees() });
    },
  });
};

export const useDeletePersonMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (personId: number) => familyTreeService.deletePerson(personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyTreeKey.all });
    },
  });
};

// ==================== Relationship Mutations ====================

export const useAddRelationshipMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      personId,
      partnerId,
      relationType,
    }: {
      personId: number;
      partnerId: number;
      relationType: string;
    }) => familyTreeService.addRelationship(personId, partnerId, relationType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyTreeKey.trees() });
    },
  });
};

export const useRemoveRelationshipMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (relationshipId: number) =>
      familyTreeService.removeRelationship(relationshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyTreeKey.trees() });
    },
  });
};
