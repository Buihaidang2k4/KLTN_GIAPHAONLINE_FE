import type { ApiResponse } from "@/types/api-response.types";
import type { FamilyTreeNodeRes, PersonReq, PersonRes } from "@/types/family/family_tree.types";
import api from "./api.base";
import { toValue, type MaybeRefOrGetter } from "vue";

export const familyTreeService = {

  // ==================== Tree ====================

  getTree: async (categoryId: MaybeRefOrGetter<number>): Promise<ApiResponse<FamilyTreeNodeRes[]>> => {
    const res = await api.get<ApiResponse<FamilyTreeNodeRes[]>>(
      `/family-tree/categories/${toValue(categoryId)}/tree`
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
      toValue(data)
    );
    return res.data;
  },

  updatePerson: async (
    personId: MaybeRefOrGetter<number>,
    data: MaybeRefOrGetter<PersonReq>
  ): Promise<ApiResponse<PersonRes>> => {
    const res = await api.put<ApiResponse<PersonRes>>(
      `/family-tree/persons/${toValue(personId)}`,
      toValue(data)
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
      toValue(data)
    );
    return res.data;
  },

  addPartner: async (
    personId: MaybeRefOrGetter<number>,
    data: MaybeRefOrGetter<PersonReq>
  ): Promise<ApiResponse<FamilyTreeNodeRes>> => {
    const res = await api.post<ApiResponse<FamilyTreeNodeRes>>(
      `/family-tree/persons/${toValue(personId)}/partner`,
      toValue(data)
    );
    return res.data;
  },

  addChild: async (
    personId: MaybeRefOrGetter<number>,
    data: MaybeRefOrGetter<PersonReq>
  ): Promise<ApiResponse<FamilyTreeNodeRes>> => {
    const res = await api.post<ApiResponse<FamilyTreeNodeRes>>(
      `/family-tree/persons/${toValue(personId)}/child`,
      toValue(data)
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
