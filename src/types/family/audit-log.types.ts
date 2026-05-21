export interface AuditLogRes {
    auditId: number
    actorEmail: string
    familyId: number
    action: string
    entityType: string
    entityId: string
    oldData: Record<string, unknown> | null
    newData: Record<string, unknown> | null
    createdAt: string
}
