"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Upload, X, ImagePlus } from "lucide-react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import TableCard from "@/components/admin/cards/TableCard";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdmin } from "@/components/admin/AdminContext";
import {
  compressImage,
  isTooLarge,
  needsCompression,
  formatFileSize,
} from "@/lib/imageCompression";

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  storage_path: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const CATEGORY_OPTIONS = [
  "The Garden",
  "Cooking",
  "Our Dishes",
  "Happy Guests",
  "The Venue",
  "Other",
];

interface FileEntry {
  file: File;
  title: string;
  category: string;
  customCategory: string;
  preview: string;
  tooLarge: boolean;
  willCompress: boolean;
}

function UploadModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const entriesRef = useRef<FileEntry[]>([]);
  entriesRef.current = entries;

  useEffect(() => {
    if (!isOpen) {
      entriesRef.current.forEach((e) => URL.revokeObjectURL(e.preview));
      setEntries([]);
      setUploadProgress("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newEntries: FileEntry[] = files.map((file) => ({
      file,
      title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      category: CATEGORY_OPTIONS[0],
      customCategory: "",
      preview: URL.createObjectURL(file),
      tooLarge: isTooLarge(file),
      willCompress: needsCompression(file),
    }));
    setEntries((prev) => [...prev, ...newEntries]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateEntry = (
    index: number,
    field: keyof FileEntry,
    value: string
  ) => {
    setEntries((prev) =>
      prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
    );
  };

  const hasErrors = entries.some((e) => e.tooLarge);
  const validEntries = entries.filter((e) => !e.tooLarge);

  const handleUpload = async () => {
    if (validEntries.length === 0) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      const metadata: { title: string; category: string }[] = [];

      for (let i = 0; i < validEntries.length; i++) {
        const entry = validEntries[i];
        setUploadProgress(
          `Preparing ${i + 1}/${validEntries.length}: ${entry.title}...`
        );

        let file = entry.file;
        if (needsCompression(file)) {
          setUploadProgress(
            `Compressing ${i + 1}/${validEntries.length}: ${entry.title}...`
          );
          file = await compressImage(file);
        }

        formData.append(`file_${i}`, file);
        const category =
          entry.category === "Other" ? entry.customCategory : entry.category;
        metadata.push({ title: entry.title, category });
      }

      formData.append("metadata", JSON.stringify(metadata));

      setUploadProgress("Uploading to server...");
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload photos");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert(
        error instanceof Error ? error.message : "Failed to upload photos."
      );
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)]">
            Upload Photos
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File picker */}
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-cream)]/30 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Click to select images or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP up to 25MB each
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFilesSelected}
            />
          </label>
        </div>

        {/* Selected files grid */}
        {entries.length > 0 && (
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-medium text-[var(--color-charcoal)]">
              Selected Photos ({entries.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {entries.map((entry, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-3 ${
                    entry.tooLarge ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={entry.preview}
                        alt={entry.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-gray-500">
                            {formatFileSize(entry.file.size)}
                          </span>
                          {entry.tooLarge && (
                            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                              Too large
                            </span>
                          )}
                          {entry.willCompress && !entry.tooLarge && (
                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                              Will compress
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeEntry(index)}
                          className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={entry.title}
                        onChange={(e) =>
                          updateEntry(index, "title", e.target.value)
                        }
                        placeholder="Photo title"
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                      />
                      <select
                        value={entry.category}
                        onChange={(e) =>
                          updateEntry(index, "category", e.target.value)
                        }
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      {entry.category === "Other" && (
                        <input
                          type="text"
                          value={entry.customCategory}
                          onChange={(e) =>
                            updateEntry(index, "customCategory", e.target.value)
                          }
                          placeholder="Custom category name"
                          className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || validEntries.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {isUploading
              ? uploadProgress || "Uploading..."
              : `Upload ${validEntries.length} Photo${validEntries.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({
  isOpen,
  onClose,
  onSuccess,
  photo,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  photo: GalleryPhoto | null;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (photo) {
      setTitle(photo.title);
      if (CATEGORY_OPTIONS.includes(photo.category)) {
        setCategory(photo.category);
        setCustomCategory("");
      } else {
        setCategory("Other");
        setCustomCategory(photo.category);
      }
    }
  }, [photo, isOpen]);

  if (!isOpen || !photo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const finalCategory =
        category === "Other" ? customCategory : category;

      const response = await fetch(`/api/admin/gallery/${photo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category: finalCategory }),
      });

      if (!response.ok) {
        throw new Error("Failed to update photo");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating photo:", error);
      alert("Failed to update photo. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)]">
            Edit Photo
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={photo.image_url}
            alt={photo.title}
            fill
            className="object-cover"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {category === "Other" && (
            <div>
              <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
                Custom Category *
              </label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                placeholder="Enter custom category"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Update Photo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GalleryDashboard() {
  const { isSidebarOpen, toggleSidebar } = useAdmin();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editPhoto, setEditPhoto] = useState<GalleryPhoto | null>(null);
  const [deletePhotoIndex, setDeletePhotoIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Photo Gallery Dashboard" },
  ];

  const loadPhotos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/gallery");
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleEdit = (index: number) => {
    setEditPhoto(photos[index]);
  };

  const handleDelete = (index: number) => {
    setDeletePhotoIndex(index);
  };

  const confirmDelete = async () => {
    if (deletePhotoIndex === null) return;

    const photo = photos[deletePhotoIndex];
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/gallery/${photo.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      await loadPhotos();
      setDeletePhotoIndex(null);
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const photoData = photos.map((photo) => ({
    thumbnail: (
      <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
        <Image
          src={photo.image_url}
          alt={photo.title}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
    ),
    title: photo.title,
    category: photo.category,
    date: formatDate(photo.created_at),
  }));

  const columns = [
    { key: "thumbnail", label: "Preview" },
    { key: "title", label: "Title", className: "font-medium" },
    { key: "category", label: "Category" },
    { key: "date", label: "Date Added" },
  ];

  return (
    <>
      <AdminHeader
        breadcrumbItems={breadcrumbItems}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-[var(--color-charcoal)]">
            Photo Gallery Dashboard
          </h1>
          <p className="text-[var(--color-charcoal-light)] mt-2">
            Manage photos displayed on the gallery page
          </p>
        </div>

        {/* Photos Table Section */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-[var(--color-charcoal)]">
              All Photos
            </h2>
            <p className="text-sm text-[var(--color-charcoal-light)] mt-1">
              Photos are displayed on the public gallery page with category
              filtering
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Upload Photos
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-charcoal-light)]">
              Loading photos...
            </p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-[var(--color-charcoal-light)]">
              No photos yet. Click &quot;Upload Photos&quot; to add your first
              photos.
            </p>
          </div>
        ) : (
          <TableCard
            title="Gallery Photos"
            columns={columns}
            data={photoData}
            actions={[
              {
                icon: <Pencil className="w-4 h-4 text-blue-600" />,
                onClick: handleEdit,
                title: "Edit photo",
              },
              {
                icon: <Trash2 className="w-4 h-4 text-red-600" />,
                onClick: handleDelete,
                title: "Delete photo",
              },
            ]}
          />
        )}
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          loadPhotos();
        }}
      />

      <EditModal
        isOpen={editPhoto !== null}
        onClose={() => setEditPhoto(null)}
        onSuccess={() => {
          loadPhotos();
        }}
        photo={editPhoto}
      />

      <ConfirmDialog
        isOpen={deletePhotoIndex !== null}
        onClose={() => setDeletePhotoIndex(null)}
        onConfirm={confirmDelete}
        title="Delete Photo"
        message={
          deletePhotoIndex !== null
            ? `Are you sure you want to delete "${photos[deletePhotoIndex]?.title}"? This will remove the photo from both the gallery and storage. This action cannot be undone.`
            : ""
        }
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        isDestructive
      />
    </>
  );
}
