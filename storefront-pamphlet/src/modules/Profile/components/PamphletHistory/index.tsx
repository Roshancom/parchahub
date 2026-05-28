/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useState } from "react";
import EditPamphletModal from "./EditPamphletModal";
import DeletePamphletModal from "./DeletePamphletModal";
import { useAuth } from "@/hooks/useAuth";
import API from "@/services/api";

type PamphletRecord = {
  id: number | string;
  title: string;
  thumbnail_image?: string;
  content?: string;
  location: { latitude: number; longitude: number; city: string };
  url_key: string;
  short_description?: string;
  category: string;
  category_name?: string;
  phone: string;
  email?: string;
  created_at?: string;
};

// Bug Fix #4: prepend the API origin so thumbnail URLs resolve correctly
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const getThumbnailUrl = (thumbnail_image?: string): string | null => {
  if (!thumbnail_image) return null;
  if (thumbnail_image.startsWith("http")) return thumbnail_image;
  const origin = API_BASE.replace(/\/api$/, "");
  return `${origin}/uploads/${thumbnail_image}`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PAGE_SIZE = 6;

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(6)].map((_, i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
      </td>
    ))}
  </tr>
);

const PamphletHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allPamphlets, setAllPamphlets] = useState<PamphletRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPamphlet, setSelectedPamphlet] = useState<PamphletRecord | null>(null);

  const getUsersPamphlets = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      setError(null);
      const response = await API.get(`/user/pamphlets/${user.id}`);
      const data: PamphletRecord[] = response.data.data ?? [];
      setAllPamphlets(data);
      setPage(1);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || "Failed to fetch pamphlets.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    getUsersPamphlets();
  }, [getUsersPamphlets]);

  const totalPages = Math.ceil(allPamphlets.length / PAGE_SIZE);
  const paginated = allPamphlets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleEdit = (pamphlet: PamphletRecord) => {
    setSelectedPamphlet(pamphlet);
    setIsEditModalOpen(true);
  };

  const handleDelete = (pamphlet: PamphletRecord) => {
    setSelectedPamphlet(pamphlet);
    setIsDeleteModalOpen(true);
  };

  const closeEditModal = () => { setIsEditModalOpen(false); setSelectedPamphlet(null); };
  const closeDeleteModal = () => { setIsDeleteModalOpen(false); setSelectedPamphlet(null); };

  return (
    <div className="rounded-3xl md:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Pamphlet History</h2>
        <button
          onClick={getUsersPamphlets}
          disabled={isLoading}
          className="text-sm text-brand-blue hover:underline disabled:opacity-50"
        >
          {isLoading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Thumbnail", "Title", "Location", "Category", "Created", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading
              ? [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
              : paginated.length === 0
              ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm font-medium">No pamphlets yet</p>
                      <p className="text-xs">Create your first pamphlet from the tab above.</p>
                    </div>
                  </td>
                </tr>
              )
              : paginated.map((pamphlet) => {
                  const thumbUrl = getThumbnailUrl(pamphlet.thumbnail_image);
                  return (
                    <tr key={String(pamphlet.id)} className="hover:bg-gray-50 transition-colors">
                      {/* Thumbnail */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt={pamphlet.title}
                            className="h-14 w-14 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                            No img
                          </div>
                        )}
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4 max-w-[180px]">
                        <p className="text-sm font-semibold text-gray-800 truncate">{pamphlet.title}</p>
                        {pamphlet.url_key && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">/{pamphlet.url_key}</p>
                        )}
                      </td>

                      {/* Location — Bug Fix #1 result: city is now populated from the JOIN */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {pamphlet.location?.city || "—"}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                          {pamphlet.category_name || pamphlet.category || "—"}
                        </span>
                      </td>

                      {/* Created date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(pamphlet.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleEdit(pamphlet)}
                          className="text-brand-blue hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pamphlet)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, allPamphlets.length)} of {allPamphlets.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedPamphlet && (
        <EditPamphletModal
          isOpen={isEditModalOpen}
          setIsOpen={(open) => { if (!open) closeEditModal(); }}
          pamphlet={selectedPamphlet}
          onPamphletUpdated={() => { getUsersPamphlets(); closeEditModal(); }}
        />
      )}
      {selectedPamphlet && (
        <DeletePamphletModal
          isOpen={isDeleteModalOpen}
          setIsOpen={(open) => { if (!open) closeDeleteModal(); }}
          pamphlet_id={selectedPamphlet.id}
          onPamphletDeleted={() => { getUsersPamphlets(); closeDeleteModal(); }}
        />
      )}
    </div>
  );
};

export default PamphletHistory;
