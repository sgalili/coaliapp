// Utility functions for government image management
import { supabase } from "@/integrations/supabase/client";

export interface CandidateData {
  name: string;
  avatar: string;
  expertise: string;
  party: string;
  experience: string;
}

export interface SelectedCandidates {
  [key: string]: CandidateData;
}

export interface SavedGovernmentImage {
  id: string;
  user_id: string | null;
  candidates_hash: string;
  image_url: string;
  prompt: string | null;
  seed: number | null;
  created_at: string;
  updated_at: string;
}

// Generate a hash from selected candidates to identify unique combinations
export function generateCandidatesHash(candidates: SelectedCandidates): string {
  // Create a deterministic string from candidates
  const candidatesArray = Object.entries(candidates)
    .sort(([a], [b]) => a.localeCompare(b)) // Sort by ministry key for consistency
    .map(([ministry, candidate]) => `${ministry}:${candidate.name}:${candidate.party}`)
    .join('|');
  
  // Simple hash function (you could use crypto.subtle.digest for more robust hashing)
  let hash = 0;
  for (let i = 0; i < candidatesArray.length; i++) {
    const char = candidatesArray.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Save image to database
export async function saveGovernmentImage(
  candidates: SelectedCandidates,
  imageUrl: string,
  prompt: string,
  seed?: number
): Promise<void> {
  const candidatesHash = generateCandidatesHash(candidates);
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from('government_images')
    .upsert({
      user_id: user?.id || null,
      candidates_hash: candidatesHash,
      image_url: imageUrl,
      prompt,
      seed
    }, {
      onConflict: user?.id ? 'user_id,candidates_hash' : 'candidates_hash'
    });
  
  if (error) {
    console.error('Error saving government image:', error);
    throw error;
  }
}

// Get existing image from database
export async function getExistingGovernmentImage(
  candidates: SelectedCandidates
): Promise<SavedGovernmentImage | null> {
  const candidatesHash = generateCandidatesHash(candidates);
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('government_images')
    .select('*')
    .eq('candidates_hash', candidatesHash)
    .eq('user_id', user?.id || null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error fetching government image:', error);
    return null;
  }
  
  return data;
}

// LocalStorage functions for non-authenticated users
const LOCALSTORAGE_KEY = 'governmentImages';

export function saveImageToLocalStorage(
  candidates: SelectedCandidates,
  imageUrl: string,
  prompt: string,
  seed?: number
): void {
  const candidatesHash = generateCandidatesHash(candidates);
  const stored = localStorage.getItem(LOCALSTORAGE_KEY);
  const images = stored ? JSON.parse(stored) : {};
  
  images[candidatesHash] = {
    imageUrl,
    prompt,
    seed,
    timestamp: Date.now()
  };
  
  // Keep only last 10 images to avoid localStorage bloat
  const entries = Object.entries(images);
  if (entries.length > 10) {
    const sorted = entries.sort(([,a], [,b]) => (b as any).timestamp - (a as any).timestamp);
    const keep = Object.fromEntries(sorted.slice(0, 10));
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(keep));
  } else {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(images));
  }
}

export function getImageFromLocalStorage(candidates: SelectedCandidates): {
  imageUrl: string;
  prompt: string;
  seed?: number;
  timestamp: number;
} | null {
  const candidatesHash = generateCandidatesHash(candidates);
  const stored = localStorage.getItem(LOCALSTORAGE_KEY);
  if (!stored) return null;
  
  try {
    const images = JSON.parse(stored);
    const image = images[candidatesHash];
    
    // Check if image is not older than 7 days
    if (image && (Date.now() - image.timestamp) < 7 * 24 * 60 * 60 * 1000) {
      return image;
    }
    return null;
  } catch {
    return null;
  }
}
