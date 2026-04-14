import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import axios from '../lib/axios';

interface ImageUploadProps {
  onImageUploaded: (url: string, publicId: string) => void;
  onImageRemoved?: (index: number, url: string) => void;
  onImagesReordered?: (images: string[]) => void;
  maxImages?: number;
  currentImages?: string[];
  folder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  onImageRemoved,
  onImagesReordered,
  maxImages = 5,
  currentImages = [],
  folder = 'products',
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string[]>(currentImages);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with currentImages prop changes
  useEffect(() => {
    setPreview(currentImages);
  }, [currentImages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate number of images
    if (preview.length + files.length > maxImages) {
      setError(`الحد الأقصى ${maxImages} صور`);
      return;
    }

    // Validate file sizes
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        setError('حجم الملف أكبر من 5 ميجابايت');
        return;
      }
    }

    setError('');
    setUploading(true);

    try {
      // Upload single or multiple files
      const formData = new FormData();
      
      if (files.length === 1) {
        formData.append('image', files[0]);
        formData.append('folder', folder);
        const response = await axios.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        const { url, publicId } = response.data.data;
        setPreview([...preview, url]);
        onImageUploaded(url, publicId);
      } else {
        Array.from(files).forEach((file) => {
          formData.append('images', file);
        });
        
        const response = await axios.post('/upload/multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        const images = response.data.data.images;
        const urls = images.map((img: any) => img.url);
        setPreview([...preview, ...urls]);
        
        images.forEach((img: any) => {
          onImageUploaded(img.url, img.publicId);
        });
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'فشل رفع الصورة');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const imageUrl = preview[index];
    const newPreview = [...preview];
    newPreview.splice(index, 1);
    setPreview(newPreview);
    
    // Notify parent component
    if (onImageRemoved) {
      onImageRemoved(index, imageUrl);
    }
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newPreview = [...preview];
    [newPreview[index - 1], newPreview[index]] = [newPreview[index], newPreview[index - 1]];
    setPreview(newPreview);
    
    if (onImagesReordered) {
      onImagesReordered(newPreview);
    }
  };

  const moveImageDown = (index: number) => {
    if (index === preview.length - 1) return;
    const newPreview = [...preview];
    [newPreview[index], newPreview[index + 1]] = [newPreview[index + 1], newPreview[index]];
    setPreview(newPreview);
    
    if (onImagesReordered) {
      onImagesReordered(newPreview);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={maxImages > 1}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || preview.length >= maxImages}
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || preview.length >= maxImages}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري الرفع...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>
                {preview.length >= maxImages
                  ? `تم رفع ${maxImages} صور (الحد الأقصى)`
                  : 'اضغط لرفع الصور'}
              </span>
            </>
          )}
        </button>
        
        {/* Help text */}
        <p className="text-xs text-gray-500 mt-1 text-center">
          حجم الملف الأقصى: 5 ميجابايت | الصيغ المدعومة: JPG, PNG, WEBP
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Preview Grid */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {preview.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
              />
              
              {/* Reorder buttons */}
              {preview.length > 1 && (
                <div className="absolute top-2 left-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImageUp(index)}
                      className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                  )}
                  {index < preview.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImageDown(index)}
                      className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="حذف"
              >
                <X className="w-4 h-4" />
              </button>
              
              {/* First image badge */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                  الصورة الرئيسية
                </div>
              )}
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: maxImages - preview.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400"
            >
              <ImageIcon className="w-8 h-8" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
