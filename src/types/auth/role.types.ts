
export interface CreateRoleReq {
    name: string,
    scopeType: scopeType,
    description: string
}

export interface UpdateRoleReq {
    description: string,
    permissions: string[]
}

export interface RoleRes {
    name: string,
    scopeType: scopeType,
    description: string,
    permissions: PermissionRes[]
}


interface PermissionRes {
    name: string,
    scopeType: scopeType,
    description: string
}

type scopeType = 'FAMILY' | 'SYSTEM';