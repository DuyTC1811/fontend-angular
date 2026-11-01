export type DocType = 'DOCX' | 'XLSX' | 'PPTX';

export interface DocumentItem {
  id: string;
  name: string;
  fileExt: string;
  currentVersion: number;
  updatedAt: string;
}

export interface DocumentCreated {
  id: string;
  name: string;
  fileExt: string;
}

export interface CreateDocumentRequest {
  name: string;
  type: DocType;
}

export const DOC_TYPES: { value: DocType; label: string; icon: string }[] = [
  { value: 'DOCX', label: 'Văn bản', icon: '📄' },
  { value: 'XLSX', label: 'Bảng tính', icon: '📊' },
  { value: 'PPTX', label: 'Trình chiếu', icon: '📽️' },
];

export const ACCEPT_EXT = ['.docx', '.doc', '.odt', '.xlsx', '.xls', '.ods', '.pptx', '.pdf'];
export const MAX_SIZE_MB = 50;
