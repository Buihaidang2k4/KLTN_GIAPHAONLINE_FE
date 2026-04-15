export interface CeremonyRes {
    ceremonyId: number;
    familyId: number;
    ceremonyType: string;
    ceremonyName: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface CeremonyReq {
    familyId: number;
    ceremonyType: string;
    ceremonyName: string;
    description: string;
}

export interface CeremonyUpdateReq {
    ceremonyType: string;
    ceremonyName: string;
    description: string;
}

export interface CeremonyTimelineReq {
    ceremonyId: number;
    stepName: string;
    stepDescription: string;
    stepGuideline: string;
}

export interface CeremonyTimelineUpdateReq {
    stepName: string;
    stepDescription: string;
    stepGuideline: string;
}

export interface CeremonyTimelineRes {
    timelineId: number;
    ceremonyId: number;
    stepOrder: number;
    stepName: string;
    stepDescription: string;
    stepGuideline: string;
    createdAt: string;
    updatedAt: string;
}

export interface CeremonyTimelinePreparationReq {
    timelineId: number;
    itemName: string;
    itemType: string;
    quantity: number;
    unit: string;
    note: string;
    required: boolean;
}

export interface CeremonyTimelinePreparationRes {
    preparationId: number;
    timelineId: number;
    itemName: string;
    itemType: string;
    quantity: number;
    unit: string;
    note: string;
    required: boolean;
}

export interface CeremonyTimelinePreparationUpdateReq {
    itemName: string;
    itemType: string;
    quantity: number;
    unit: string;
    note: string;
    required: boolean;
}