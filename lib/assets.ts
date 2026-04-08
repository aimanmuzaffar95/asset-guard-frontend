export type AssetStatus = "available" | "assigned";

export type AssetType = {
  id: string;
  name: string;
  description: string | null;
};

export type Asset = {
  id: string;
  name: string;
  serialNumber: string;
  status: AssetStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  assetType: AssetType;
  assignedTo: string | null;
};

export type ApiResponseMeta = {
  statusCode?: number;
  path?: string;
  method?: string;
  timestamp?: string;
};

export type ApiErrorPayload = {
  messages?: string[];
  code?: string;
};

export type AssetListSuccessResponse = {
  success: true;
  data: Asset[];
  meta?: ApiResponseMeta;
};

export type AssetListErrorResponse = {
  success?: false;
  error?: ApiErrorPayload;
  meta?: ApiResponseMeta;
};

export type CreateAssetSuccessResponse = {
  success: true;
  data: {
    id: string;
    assetTypeId: string;
    name: string;
    serialNumber: string;
    notes: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    assetType: AssetType;
  };
  meta?: ApiResponseMeta;
};

export type CreateAssetErrorResponse = AssetListErrorResponse;
