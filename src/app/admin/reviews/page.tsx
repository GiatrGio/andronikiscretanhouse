"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import TableCard from "@/components/admin/cards/TableCard";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useAdmin } from "@/components/admin/AdminContext";

interface Review {
  id: string;
  name: string;
  review_date: string;
  text: string;
  source: string;
  review_link: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const SOURCE_OPTIONS = ["Airbnb", "TripAdvisor", "Viator", "Eatwith",
  "Conde Nast Traveler", "Other"];

const DEFAULT_SOURCE_LINKS: Record<string, string> = {
  Airbnb: "https://www.airbnb.com/experiences/588791?location=Rethymno%2C%20Crete%2C%20Greece&currentTab=experience_tab&federatedSearchId=a13831c1-c2e6-40ce-bd51-d9353d631895&searchId=8099acdc-de96-41a2-9132-c2bcc995d40c&sectionId=2cae4bf8-1b46-4ac3-b94e-86f47a94815e&source=p2",
  TripAdvisor: "https://www.tripadvisor.com/AttractionProductReview-g189429-d16642045-Cretan_Cooking_Class_and_Dinner_Evening_in_a_Rethymno_Home-Kythnos_Cyclades_South_.html#REVIEWS",
  Viator: "https://www.viator.com/tours/Cyclades-Islands/COOKING-LESSON-AND-MEAL-BASED-ON-CRETAN-CUISINE/d957-75909P89?mcid=56757",
  "Conde Nast Traveler": "https://www.cntraveler.com/story/the-quieter-side-of-crete",
  Eatwith: "https://www.eatwith.com/events/22470?date=2026-04-20",
};

function ReviewModal({
  isOpen,
  onClose,
  onSuccess,
  editReview,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editReview?: Review | null;
}) {
  const [name, setName] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [text, setText] = useState("");
  const [source, setSource] = useState("Airbnb");
  const [reviewLink, setReviewLink] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editReview) {
      setName(editReview.name);
      setReviewDate(editReview.review_date);
      setText(editReview.text);
      setSource(editReview.source);
      setReviewLink(editReview.review_link || "");
      setIsFeatured(editReview.is_featured);
    } else {
      setName("");
      setReviewDate("");
      setText("");
      setSource("Airbnb");
      setReviewLink(DEFAULT_SOURCE_LINKS["Airbnb"] || "");
      setIsFeatured(false);
    }
  }, [editReview, isOpen]);

  const handleSourceChange = (newSource: string) => {
    setSource(newSource);
    setReviewLink(DEFAULT_SOURCE_LINKS[newSource] || "");
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name,
        review_date: reviewDate,
        text,
        source,
        review_link: reviewLink,
        is_featured: isFeatured,
      };

      const url = editReview
        ? `/api/admin/reviews/${editReview.id}`
        : "/api/admin/reviews";
      const method = editReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save review");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)]">
            {editReview ? "Edit Review" : "Add Review"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
              Reviewer Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
              placeholder="e.g. John D."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
              Review Date *
            </label>
            <input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
              Source *
            </label>
            <select
              value={source}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
              Review Link
            </label>
            <input
              type="url"
              value={reviewLink}
              onChange={(e) => setReviewLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
              placeholder="https://..."
            />
            <p className="text-xs text-[var(--color-charcoal-light)] mt-1">
              Link to the original review. Auto-filled when selecting a known source.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)] mb-1">
              Review Text *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none resize-vertical"
              placeholder="The review content..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)]"
            />
            <label
              htmlFor="is_featured"
              className="text-sm font-medium text-[var(--color-charcoal)]"
            >
              Featured review (shown in the Featured Reviews section)
            </label>
          </div>

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
              {isSaving
                ? "Saving..."
                : editReview
                ? "Update Review"
                : "Add Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReviewsDashboard() {
  const { isSidebarOpen, toggleSidebar } = useAdmin();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [deleteReviewIndex, setDeleteReviewIndex] = useState<number | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Hero text state
  const [heroText, setHeroText] = useState("");
  const [originalHeroText, setOriginalHeroText] = useState("");
  const [isSavingHeroText, setIsSavingHeroText] = useState(false);
  const [heroTextStatus, setHeroTextStatus] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Reviews Dashboard" },
  ];

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/reviews");
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHeroText = async () => {
    try {
      const response = await fetch(
        "/api/admin/site-content?key=reviews_hero_text"
      );
      const data = await response.json();
      const text = data.content?.content || "";
      setHeroText(text);
      setOriginalHeroText(text);
    } catch (error) {
      console.error("Error loading hero text:", error);
    }
  };

  useEffect(() => {
    loadReviews();
    loadHeroText();
  }, []);

  const handleSaveHeroText = async () => {
    setIsSavingHeroText(true);
    setHeroTextStatus(null);
    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "reviews_hero_text", content: heroText }),
      });
      if (!response.ok) throw new Error("Failed to save");
      setOriginalHeroText(heroText);
      setHeroTextStatus("Saved successfully!");
      setTimeout(() => setHeroTextStatus(null), 3000);
    } catch (error) {
      console.error("Error saving hero text:", error);
      setHeroTextStatus("Failed to save. Please try again.");
    } finally {
      setIsSavingHeroText(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditReview(reviews[index]);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    setDeleteReviewIndex(index);
  };

  const confirmDelete = async () => {
    if (deleteReviewIndex === null) return;

    const review = reviews[deleteReviewIndex];
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      await loadReviews();
      setDeleteReviewIndex(null);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditReview(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const reviewData = reviews.map((review) => ({
    name: review.name,
    date: formatDate(review.review_date),
    source: review.source,
    featured: review.is_featured ? "Yes" : "No",
    preview:
      review.text.length > 60
        ? review.text.substring(0, 60) + "..."
        : review.text,
  }));

  const columns = [
    { key: "name", label: "Reviewer", className: "font-medium" },
    { key: "date", label: "Date" },
    { key: "source", label: "Source" },
    { key: "featured", label: "Featured" },
    {
      key: "preview",
      label: "Preview",
      className: "text-[var(--color-charcoal-light)]",
    },
  ];

  const heroTextChanged = heroText !== originalHeroText;

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
            Reviews Dashboard
          </h1>
          <p className="text-[var(--color-charcoal-light)] mt-2">
            Manage reviews and the reviews page content
          </p>
        </div>

        {/* Hero Text Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="font-heading text-xl font-bold text-[var(--color-charcoal)] mb-4">
            Reviews Page Hero Text
          </h3>
          <p className="text-sm text-[var(--color-charcoal-light)] mb-3">
            This text appears below the &quot;Our Reviews&quot; title on the
            reviews page.
          </p>
          <textarea
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none resize-vertical text-sm"
          />
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleSaveHeroText}
              disabled={isSavingHeroText || !heroTextChanged}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSavingHeroText ? "Saving..." : "Save Text"}
            </button>
            {heroTextStatus && (
              <span
                className={`text-sm ${
                  heroTextStatus.includes("Failed")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {heroTextStatus}
              </span>
            )}
          </div>
        </div>

        {/* Reviews Table Section */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-[var(--color-charcoal)]">
              All Reviews
            </h2>
            <p className="text-sm text-[var(--color-charcoal-light)] mt-1">
              Reviews are displayed in chronological order (latest first) on the
              website
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Review
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[var(--color-charcoal-light)]">
              Loading reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-[var(--color-charcoal-light)]">
              No reviews yet. Click &quot;Add Review&quot; to add your first
              review.
            </p>
          </div>
        ) : (
          <TableCard
            title="Reviews"
            columns={columns}
            data={reviewData}
            actions={[
              {
                icon: <Pencil className="w-4 h-4 text-blue-600" />,
                onClick: handleEdit,
                title: "Edit review",
              },
              {
                icon: <Trash2 className="w-4 h-4 text-red-600" />,
                onClick: handleDelete,
                title: "Delete review",
              },
            ]}
          />
        )}
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          loadReviews();
        }}
        editReview={editReview}
      />

      <ConfirmDialog
        isOpen={deleteReviewIndex !== null}
        onClose={() => setDeleteReviewIndex(null)}
        onConfirm={confirmDelete}
        title="Delete Review"
        message={
          deleteReviewIndex !== null
            ? `Are you sure you want to delete the review by "${reviews[deleteReviewIndex]?.name}"? This action cannot be undone.`
            : ""
        }
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        isDestructive
      />
    </>
  );
}
