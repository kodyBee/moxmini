"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navigation } from "@/components/ui/navigation";
import { Separator } from "@/components/ui/separator";

interface PremadeProduct {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  sku: string;
}

export default function ProductsManagement() {
  const router = useRouter();
  const { status } = useSession();
  const [products, setProducts] = useState<PremadeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<PremadeProduct | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    image: "",
    description: "",
    sku: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }
    if (status === "authenticated") {
      loadProducts();
    }
  }, [status, router]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/premade-products");
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Failed to load products. Please check console for errors.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUploading(true);
      
      let imageUrl = formData.image;
      
      // If a new file was selected, upload it first
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        uploadFormData.append('folder', 'premade');
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
        
        // If editing and had an old Vercel Blob image, delete it
        if (editingProduct && editingProduct.image && editingProduct.image.includes('vercel-storage')) {
          try {
            // Delete through API if we create a delete endpoint, or handle cleanup server-side
            // For now, we'll skip deletion to avoid client-side calls
            console.log('Old image should be cleaned up:', editingProduct.image);
          } catch (error) {
            console.error('Error deleting old image:', error);
            // Continue anyway - don't fail the whole operation
          }
        }
      }
      
      const url = editingProduct
        ? "/api/admin/premade-products"
        : "/api/admin/premade-products";
      
      const body = editingProduct
        ? { id: editingProduct.id, ...formData, image: imageUrl }
        : { ...formData, image: imageUrl };

      const response = await fetch(url, {
        method: editingProduct ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save product");

      alert(editingProduct ? "Product updated successfully!" : "Product created successfully!");
      resetForm();
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (product: PremadeProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      image: product.image,
      description: product.description,
      sku: product.sku,
    });
    setImagePreview(product.image);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/premade-products?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      alert("Product deleted successfully!");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      image: "",
      description: "",
      sku: "",
    });
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview("");
    setShowForm(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black text-white flex items-center justify-center">
        <div className="text-xl">Checking authentication...</div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-r from-black via-[#001220] to-black text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Manage Prepainted Miniatures</h1>
              <p className="text-gray-400">Add, edit, or remove products</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                {showForm ? "Cancel" : "Add New Product"}
              </button>
            </div>
          </div>

          <Separator className="mb-8 bg-white/20" />

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Human Fighter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">SKU *</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="PREMADE-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="20.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Original Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="30.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Product Image * {editingProduct && '(Upload new image to replace)'}
                  </label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-3 relative w-full h-48 bg-black/30 rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* File Input */}
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editingProduct && !imagePreview}
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg focus:outline-none focus:border-blue-500 min-h-[100px]"
                    placeholder="Detailed description of the miniature..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                  >
                    {isUploading ? 'Uploading...' : editingProduct ? "Update Product" : "Create Product"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isUploading}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-xl text-gray-400">No products yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Click &quot;Add New Product&quot; to create your first product
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
                >
                  {/* Product Image */}
                  <div className="w-full h-48 bg-black/30 rounded-lg mb-4 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x300?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">SKU: {product.sku}</p>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">{product.description}</p>

                  {/* Pricing */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-400">${product.price}</span>
                    <span className="text-lg text-gray-500 line-through ml-2">
                      ${product.originalPrice}
                    </span>
                    <div className="text-green-400 text-xs mt-1">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors border border-red-600/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
