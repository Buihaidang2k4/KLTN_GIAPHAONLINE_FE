export interface CreatePermissionReq {
    name: string;
    scopeType: string;
    description?: string;
}

export interface UpdatePermissionReq {
    scopeType: string;
    description?: string;
}

export interface PermissionRes {
    name: string;
    scopeType: string;
    description?: string;
}