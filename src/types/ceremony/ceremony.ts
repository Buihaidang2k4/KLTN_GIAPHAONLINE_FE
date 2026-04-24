export interface CeremonyRes {
    ceremonyId: number;
    familyId: number;
    ceremonyType: string;
    ceremonyName: string;
    description: string;
    timelines: CeremonyTimelineRes[]
    createdAt: string;
    updatedAt: string | null;
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
    timelinePreparations: CeremonyTimelinePreparationRes[]
    createdAt: string | null ;
    updatedAt: string | null;
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