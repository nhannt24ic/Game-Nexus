import React, { useRef } from 'react';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

interface ImageUploadTriggerProps {
  onImagesSelected: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const ImageUpload: React.FC<ImageUploadProps> & {
  Trigger: React.FC<ImageUploadTriggerProps>;
} = ({ images, onImagesChange, maxImages = 4 }) => {
  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  if (images.length === 0) return null;

  return (
    <div className="mt-4">
      <div className={`grid gap-2 ${
        images.length === 1 ? 'grid-cols-1' :
        images.length === 2 ? 'grid-cols-2' :
        'grid-cols-2'
      }`}>
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={URL.createObjectURL(image)}
              alt={`Upload ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg"></div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Image info overlay */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {(image.size / 1024 / 1024).toFixed(1)} MB
            </div>
          </div>
        ))}
      </div>
      {images.length > 0 && (
        <div className="mt-2 text-sm text-gray-500">
          {images.length}/{maxImages} images selected
        </div>
      )}
    </div>
  );
};

const ImageUploadTrigger: React.FC<ImageUploadTriggerProps> = ({ 
  onImagesSelected, 
  disabled, 
  className, 
  children 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onImagesSelected(files);
    }
    // Reset input
    event.target.value = '';
  };

  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  );
};

ImageUpload.Trigger = ImageUploadTrigger;

export default ImageUpload;
