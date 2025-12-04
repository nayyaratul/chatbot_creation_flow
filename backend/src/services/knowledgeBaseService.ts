import { KnowledgeBaseFile } from '../types/agent';
import { readJsonFile } from '../utils/fileStorage';

const KB_FILE = 'knowledgeBases.json';

export interface KBFilter {
  search?: string;
  fileType?: string;
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function getAllKnowledgeBases(filters?: KBFilter): KnowledgeBaseFile[] {
  let files = readJsonFile<KnowledgeBaseFile>(KB_FILE);

  if (!filters) {
    return files;
  }

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    files = files.filter(file => 
      file.filename.toLowerCase().includes(searchLower) ||
      file.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply file type filter
  if (filters.fileType) {
    files = files.filter(file => file.fileType === filters.fileType);
  }

  // Apply uploaded by filter
  if (filters.uploadedBy) {
    files = files.filter(file => file.uploadedBy === filters.uploadedBy);
  }

  // Apply date range filter
  if (filters.dateFrom) {
    files = files.filter(file => file.uploadedOn >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    files = files.filter(file => file.uploadedOn <= filters.dateTo!);
  }

  return files;
}

export function getKnowledgeBaseById(id: string): KnowledgeBaseFile | null {
  const files = readJsonFile<KnowledgeBaseFile>(KB_FILE);
  return files.find(file => file.id === id) || null;
}

export function getKnowledgeBasesByIds(ids: string[]): KnowledgeBaseFile[] {
  const files = readJsonFile<KnowledgeBaseFile>(KB_FILE);
  return files.filter(file => ids.includes(file.id));
}

