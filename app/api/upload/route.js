import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../lib/supabaseServer';

/**
 * POST /api/upload
 * Handles file uploads to Supabase Storage
 * 
 * Expected FormData:
 * - file: File object to upload
 * - bucket: (optional) Storage bucket name, defaults to 'public_files'
 * - folder: (optional) Folder path within bucket, e.g., 'products'
 * 
 * Returns:
 * {
 *   success: boolean,
 *   url: string (public URL of uploaded file),
 *   path: string (storage path),
 *   error?: string
 * }
 */
export async function POST(req) {
  try {
    // Parse FormData
    const formData = await req.formData();
    const file = formData.get('file');
    const bucket = formData.get('bucket') || 'public_files';
    const folder = formData.get('folder') || 'products';

    // Validate file
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file object' },
        { status: 400 }
      );
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${random}.${ext}`;
    const filepath = `${folder}/${filename}`;

    // Upload to Supabase Storage
    const supabase = supabaseServer();
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filepath, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('[upload] Supabase storage error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Upload failed' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filepath);

    const publicUrl = publicUrlData?.publicUrl;

    if (!publicUrl) {
      console.error('[upload] Failed to generate public URL for:', filepath);
      return NextResponse.json(
        { success: false, error: 'Failed to generate public URL' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        path: filepath,
        filename: filename,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[upload] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload
 * Deletes a file from Supabase Storage
 * 
 * Query params:
 * - path: Storage path of file to delete
 * - bucket: (optional) Storage bucket name, defaults to 'public_files'
 */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    const bucket = searchParams.get('bucket') || 'public_files';

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'No path provided' },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('[upload:delete] Supabase storage error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Delete failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'File deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[upload:delete] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Delete failed' },
      { status: 500 }
    );
  }
}

