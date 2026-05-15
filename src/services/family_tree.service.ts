import type { ApiResponse } from "@/types/api-response.types";
import type { FamilyTreeNodeRes, PersonReq, PersonRes } from "@/types/family/family_tree.types";
import api from "./api.base";
import { toValue, type MaybeRefOrGetter } from "vue";

const toFormData = (data: PersonReq): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  return formData;
};

export const familyTreeService = {

  // ==================== Tree ====================

  getTree: async (categoryId: MaybeRefOrGetter<number>): Promise<ApiResponse<FamilyTreeNodeRes[]>> => {
    const res = await api.get<ApiResponse<FamilyTreeNodeRes[]>>(
      `/family-tree/categories/${toValue(categoryId)}/tree`
    );
    return res.data;
  },

  getPartners: async (personId: MaybeRefOrGetter<number>): Promise<ApiResponse<PersonRes[]>> => {
    const res = await api.get<ApiResponse<PersonRes[]>>(
      `/family-tree/persons/${toValue(personId)}/partners`
    );
    return res.data;
  },

  getMothersByFatherId: async (fatherId: MaybeRefOrGetter<number>): Promise<ApiResponse<PersonRes[]>> => {
    const res = await api.get<ApiResponse<PersonRes[]>>(
      `/family-tree/persons/${toValue(fatherId)}/mothers`
    );
    return res.data;
  },

  // ==================== Person ====================

  createPerson: async (
    categoryId: MaybeRefOrGetter<number>,
    data: MaybeRefOrGetter<PersonReq>
  ): Promise<ApiResponse<PersonRes>> => {
    const res = await api.post<ApiResponse<PersonRes>>(
      `/family-tree/categories/${toValue(categoryId)}/persons`,
      toFormData(toValue(data))
    );
    return res.data;
  },

  updatePerson: async (
    personId: MaybeRefOrGetter<number>,
    data: MaybeRefOrGetter<PersonReq>
  ): Promise<ApiResponse<PersonRes>> => {
    const res = await api.put<ApiResponse<PersonRes>>(
      `/family-tree/persons/${toValue(personId)}`,
      toFormData(toValue(data))
    );
    return res.data;
  },

  getPersonById: async (personId: MaybeRefOrGetter<number>): Promise<ApiResponse<PersonRes>> => {
    const res = await api.get<ApiResponse<PersonRes>>(
      `/family-tree/persons/${toValue(personId)}`
    );
    return res.data;
  },

  addRoot: async (
    personId: MaybeRefOrGetter<number>,
    data: MaybeRefOrGetter<PersonReq>
  ): Promise<ApiResponse<FamilyTreeNodeRes>> => {
    const res = await api.post<ApiResponse<FamilyTreeNodeRes>>(
      `/family-tree/persons/${toValue(personId)}/root`,
      toFormData(toValue(data))
    );
    return res.data;
  },

  addPartner: async (
    personId: MaybeRefOrGetter<number>,
    data: MaybeRefOrGetter<PersonReq>
  ): Promise<ApiResponse<FamilyTreeNodeRes>> => {
    const res = await api.post<ApiResponse<FamilyTreeNodeRes>>(
      `/family-tree/persons/${toValue(personId)}/partner`,
      toFormData(toValue(data))
    );
    return res.data;
  },

  addChild: async (
    personId: MaybeRefOrGetter<number>,
    data: MaybeRefOrGetter<PersonReq>
  ): Promise<ApiResponse<FamilyTreeNodeRes>> => {
    const res = await api.post<ApiResponse<FamilyTreeNodeRes>>(
      `/family-tree/persons/${toValue(personId)}/child`,
      toFormData(toValue(data))
    );
    return res.data;
  },

  deletePerson: async (personId: MaybeRefOrGetter<number>): Promise<ApiResponse<void>> => {
    const res = await api.delete<ApiResponse<void>>(
      `/family-tree/persons/${toValue(personId)}`
    );
    return res.data;
  },

  // ==================== Relationship ====================

  addRelationship: async (
    personId: MaybeRefOrGetter<number>,
    partnerId: MaybeRefOrGetter<number>,
    relationType: MaybeRefOrGetter<string>
  ): Promise<ApiResponse<void>> => {
    const res = await api.post<ApiResponse<void>>(
      `/family-tree/persons/${toValue(personId)}/relationships`,
      null,
      { params: { partnerId: toValue(partnerId), relationType: toValue(relationType) } }
    );
    return res.data;
  },

  removeRelationship: async (relationshipId: MaybeRefOrGetter<number>): Promise<ApiResponse<void>> => {
    const res = await api.delete<ApiResponse<void>>(
      `/family-tree/relationships/${toValue(relationshipId)}`
    );
    return res.data;
  },
};
