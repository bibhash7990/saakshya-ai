import { supabase, isSupabaseConfigured } from './supabase';

interface CacheEntry {
  url: string;
  expiresAt: number;
}
const urlCache = new Map<string, CacheEntry>();

export const storageService = {
  async uploadFile(bucketId: string, path: string, file: File) {
    if (!isSupabaseConfigured()) {
      // Offline/local mock storage
      await new Promise((r) => setTimeout(r, 650));
      // Generate a local object URL to display the image/file instantly in UI
      const mockUrl = URL.createObjectURL(file);
      return { path, url: mockUrl, error: null };
    }

    const { data, error } = await supabase.storage
      .from(bucketId)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) return { path: null, url: null, error: error.message };

    // Get signed URL for access
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from(bucketId)
      .createSignedUrl(path, 60 * 60 * 24); // 24 hours link

    const expiresAt = Date.now() + (60 * 60 * 24 * 1000) - 60000; // 24 hours minus 1 minute buffer
    if (signedUrlData?.signedUrl) {
      urlCache.set(path, { url: signedUrlData.signedUrl, expiresAt });
    }

    return {
      path: data.path,
      url: signedUrlData?.signedUrl || null,
      error: urlError?.message || null,
    };
  },

  async getSignedUrl(bucketId: string, path: string) {
    if (!isSupabaseConfigured()) {
      return { url: null, error: 'Demo mode' };
    }

    const cached = urlCache.get(path);
    if (cached && cached.expiresAt > Date.now()) {
      return { url: cached.url, error: null };
    }

    const { data, error } = await supabase.storage
      .from(bucketId)
      .createSignedUrl(path, 60 * 60 * 24);

    if (data?.signedUrl) {
      const expiresAt = Date.now() + (60 * 60 * 24 * 1000) - 60000;
      urlCache.set(path, { url: data.signedUrl, expiresAt });
    }

    return { url: data?.signedUrl || null, error: error?.message || null };
  },
};
export default storageService;
