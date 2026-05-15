export type Gender = 'MALE' | 'FEMALE';
export type LifeStatus = 'ALIVE' | 'DECEASED' | 'UNKNOWN';

export interface FamilyTreeNodeRes {
  id: number;
  fid?: number;
  mid?: number;
  pids?: number[];
  childs?: number[];
  generation?: number;
  personName: string;
  phoneNumber?: string;
  gender: Gender;
  avatarPath?: string;
  avatarUrl?: string;
  birthDate?: string;
  deathDate?: string;
  biography?: string;
  lifeStatus?: LifeStatus;
  originPlace?: string;
  placeOfResidence?: string;
  isInFamily: boolean;
  tags: string;
}

export interface PersonRes {
  personId: number;
  familyCategoryId: number;
  rootPersonId?: number;
  fatherId?: number;
  motherId?: number;
  createdByAccountId: number;
  generation: number;
  birthOrder?: number;
  fullName: string;
  gender: Gender;
  phoneNumber?: string;
  birthDate?: string;
  deathDate?: string;
  originPlace?: string;
  placeOfResidence?: string;
  graveLocation?: string;
  lifeStatus: LifeStatus;
  avatarUrl?: string;
  biography?: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonReq {
  partnerId?: number;
  motherId?: number;
  generation: number;
  birthOrder?: number;
  fullName: string;
  gender: Gender;
  phoneNumber?: string;
  birthDate?: string;
  deathDate?: string;
  originPlace?: string;
  placeOfResidence?: string;
  graveLocation?: string;
  lifeStatus: LifeStatus;
  avatar?: File;
  biography?: string;
  slug?: string;
}


