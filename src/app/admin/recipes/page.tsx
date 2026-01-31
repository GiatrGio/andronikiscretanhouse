"use client";

import AdminHeader from "@/components/admin/AdminHeader";
import TableCard from "@/components/admin/cards/TableCard";
import { useAdmin } from "@/components/admin/AdminContext";

export default function RecipesDashboard() {
  const { isSidebarOpen, toggleSidebar } = useAdmin();

  const breadcrumbItems = [
    { label: "Admin", href: "/admin" },
    { label: "Recipes Dashboard" },
  ];

  // Mock recipe data with random view counts
  const recipeData = [
    {
      name: "Traditional Moussaka",
      views: "2,847",
      difficulty: "Medium",
      category: "Main Courses",
      lastUpdated: "2025-12-15",
    },
    {
      name: "Wood Oven Bread",
      views: "3,521",
      difficulty: "Easy",
      category: "Breads",
      lastUpdated: "2025-11-28",
    },
    {
      name: "Homemade Cheese",
      views: "1,923",
      difficulty: "Medium",
      category: "Appetizers",
      lastUpdated: "2025-12-01",
    },
    {
      name: "Orange Jam",
      views: "1,456",
      difficulty: "Easy",
      category: "Preserves",
      lastUpdated: "2025-10-22",
    },
    {
      name: "Quince Jelly",
      views: "987",
      difficulty: "Medium",
      category: "Preserves",
      lastUpdated: "2025-11-15",
    },
    {
      name: "Fig Marmalade",
      views: "1,234",
      difficulty: "Easy",
      category: "Preserves",
      lastUpdated: "2025-12-08",
    },
    {
      name: "Vanilla Marmalade",
      views: "876",
      difficulty: "Easy",
      category: "Preserves",
      lastUpdated: "2025-11-30",
    },
    {
      name: "Dakos Salad",
      views: "4,102",
      difficulty: "Easy",
      category: "Appetizers",
      lastUpdated: "2025-12-20",
    },
    {
      name: "Cretan Dolmades",
      views: "2,145",
      difficulty: "Medium",
      category: "Main Courses",
      lastUpdated: "2025-11-18",
    },
    {
      name: "Sfakian Pie",
      views: "1,678",
      difficulty: "Medium",
      category: "Breads",
      lastUpdated: "2025-12-05",
    },
    {
      name: "Honey Cookies",
      views: "2,934",
      difficulty: "Easy",
      category: "Desserts",
      lastUpdated: "2025-12-12",
    },
    {
      name: "Lamb Kleftiko",
      views: "3,789",
      difficulty: "Hard",
      category: "Main Courses",
      lastUpdated: "2025-11-25",
    },
  ];

  const columns = [
    { key: "name", label: "Recipe Name", className: "font-medium" },
    { key: "views", label: "Views" },
    { key: "difficulty", label: "Difficulty" },
    { key: "category", label: "Category" },
    { key: "lastUpdated", label: "Last Updated", className: "text-[var(--color-charcoal-light)]" },
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
            Recipes Dashboard
          </h1>
          <p className="text-[var(--color-charcoal-light)] mt-2">
            Manage and monitor your recipe collection
          </p>
        </div>

        <TableCard title="All Recipes" columns={columns} data={recipeData} />
      </div>
    </>
  );
}
