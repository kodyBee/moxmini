"use client";
//I'm the most proud of this page. It has complex filtering, sorting, pagination, and URL syncing and in general it was a blast to build.
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/ui/navigation";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/lib/types/product";

export default function FigureFinderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination and sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"most recent" | "a-z" | "oldest" | "cheapest" | "most expensive">("most recent");
  const productsPerPage = 40;
  
  // Filter states
  const [material, setMaterial] = useState("");
  const [genre, setGenre] = useState("");
  const [gender, setGender] = useState("");
  const [race, setRace] = useState("");
  const [holding, setHolding] = useState("");
  const [wearing, setWearing] = useState("");

  // Available options for each filter
  const [materials, setMaterials] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [races, setRaces] = useState<string[]>([]);
  const [holdings, setHoldings] = useState<string[]>([]);
  const [wearings, setWearings] = useState<string[]>([]);

  // Image modal state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string>("");

  // Initialize filters from URL on mount
  useEffect(() => {
    const materialParam = searchParams.get("material") || "";
    const genreParam = searchParams.get("genre") || "";
    const genderParam = searchParams.get("gender") || "";
    const raceParam = searchParams.get("race") || "";
    const holdingParam = searchParams.get("holding") || "";
    const wearingParam = searchParams.get("wearing") || "";
    const sortParam = searchParams.get("sort") || "most recent";
    const pageParam = searchParams.get("page") || "1";

    setMaterial(materialParam);
    setGenre(genreParam);
    setGender(genderParam);
    setRace(raceParam);
    setHolding(holdingParam);
    setWearing(wearingParam);
    setSortBy(sortParam as typeof sortBy);
    setCurrentPage(parseInt(pageParam));
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = (filters: {
    material?: string;
    genre?: string;
    gender?: string;
    race?: string;
    holding?: string;
    wearing?: string;
    sort?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    
    const currentMaterial = filters.material !== undefined ? filters.material : material;
    const currentGenre = filters.genre !== undefined ? filters.genre : genre;
    const currentGender = filters.gender !== undefined ? filters.gender : gender;
    const currentRace = filters.race !== undefined ? filters.race : race;
    const currentHolding = filters.holding !== undefined ? filters.holding : holding;
    const currentWearing = filters.wearing !== undefined ? filters.wearing : wearing;
    const currentSort = filters.sort !== undefined ? filters.sort : sortBy;
    const currentPageNum = filters.page !== undefined ? filters.page : currentPage;

    if (currentMaterial) params.set("material", currentMaterial);
    if (currentGenre) params.set("genre", currentGenre);
    if (currentGender) params.set("gender", currentGender);
    if (currentRace) params.set("race", currentRace);
    if (currentHolding) params.set("holding", currentHolding);
    if (currentWearing) params.set("wearing", currentWearing);
    if (currentSort !== "most recent") params.set("sort", currentSort);
    if (currentPageNum !== 1) params.set("page", currentPageNum.toString());

    const newURL = params.toString() ? `/figurefinder?${params.toString()}` : "/figurefinder";
    router.push(newURL, { scroll: false });
  };

  // Fetch products from API
  useEffect(() => {
    fetch("https://www.reapermini.com/api/productlist")
      .then((res) => res.json())
      .then((data) => {
        // Filter to only include miniature figurines (exclude accessories, paint, books, etc.)
        const miniaturesOnly = data.filter((p: Product) => {
          const material = p.material?.toLowerCase() || '';
          // Include only plastic, metal miniatures
          return material === 'plastic' || material === 'metal' ;
        });
        
        setProducts(miniaturesOnly);
        setFilteredProducts(miniaturesOnly);
        
        // Extract unique values for materials
        setMaterials([...new Set(miniaturesOnly.map((p: Product) => p.material).filter(Boolean))] as string[]);
        
        // filter categories 
        const materialOptions = ["metal", "plastic"];
        const genreOptions = ["fantasy", "modern", "sci-fi", "western", "superhero"];
        const genderOptions = ["female", "male"];
        const raceOptions = ["aberration", "bathalian", "celestial", "dark elf", "demon", "devil", "dire", 
                             "dragonman", "dwarf", "elf", "gnome", "goblin", "halfling", "hellborn", "human", 
                             "lupine", "monster", "orc", "reptus", "undead", "vampire", "were", "zombie"];
        const holdingOptions = ["axe", "book", "bow", "crossbow", "dagger", "flail", "hammer", "mace", 
                               "morning star", "hands", "orb", "pistol", "polearm", "rifle", "spell effect", 
                               "spiked chain", "staff", "sword", "wand", "whip"];
        const wearingOptions = ["chain", "cloak", "cape", "cloth", "clothing", "hat", "helmet", "leather", 
                               "hide", "nothing", "plate", "power armor", "robe", "scale", "shield"];
        
        setMaterials(materialOptions);
        setGenres(genreOptions);
        setGenders(genderOptions);
        setRaces(raceOptions);
        setHoldings(holdingOptions);
        setWearings(wearingOptions);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  // Apply filters whenever filter values change
  useEffect(() => {
    let filtered = products;

    if (material) {
      filtered = filtered.filter((p) => p.material === material);
    }
    if (genre) {
      filtered = filtered.filter((p) => p.tags?.includes(genre));
    }
    if (gender) {
      filtered = filtered.filter((p) => 
        p.tags?.some(tag => tag.toLowerCase() === gender.toLowerCase())
      );
    }
    if (race) {
      filtered = filtered.filter((p) => p.tags?.includes(race));
    }
    if (holding) {
      filtered = filtered.filter((p) => p.tags?.includes(holding));
    }
    if (wearing) {
      filtered = filtered.filter((p) => p.tags?.includes(wearing));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [material, genre, gender, race, holding, wearing, products]);

  // Sort and paginate products
  useEffect(() => {
    const sorted = [...filteredProducts];

    if (sortBy === "a-z") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "cheapest") {
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price || "0");
        const priceB = parseFloat(b.price || "0");
        return priceA - priceB;
      });
    } else if (sortBy === "most expensive") {
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price || "0");
        const priceB = parseFloat(b.price || "0");
        return priceB - priceA;
      });
    } else if (sortBy === "oldest") {
      sorted.reverse();
    }
    // "most recent" is default order from API

    // Paginate
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setDisplayedProducts(sorted.slice(startIndex, endIndex));
  }, [filteredProducts, sortBy, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const resetFilters = () => {
    setMaterial("");
    setGenre("");
    setGender("");
    setRace("");
    setHolding("");
    setWearing("");
    setSortBy("most recent");
    setCurrentPage(1);
    router.push("/figurefinder", { scroll: false });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      updateURL({ page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navigation currentPage="figurefinder" />

      <main
        style={{
          minHeight: "100vh",
          margin: 0,
          background: "linear-gradient(85deg, #000000 10%, #001220 40%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
          color: "white",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
            width: "100%",
            maxWidth: "1400px",
            padding: "0 15px",
          }}
        >
          <Separator className="mb-6 sm:mb-8 bg-white/20" />
          <h1
            className="text-3xl sm:text-4xl md:text-5xl"
            style={{ marginBottom: "10px", fontWeight: "bold" }}
          >
            Figure Finder
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl"
            style={{ color: "#cccccc", marginBottom: "20px" }}
          >
            Find your perfect miniature
          </p>
          <Separator className="mt-8 bg-white/20" />
        </div>

        {/* Sorting Bar */}
        <div
          style={{
            maxWidth: "1400px",
            width: "100%",
            padding: "0 15px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "8px",
              padding: "15px 20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-400">Sort by:</span>
              {(["most recent", "a-z", "oldest", "cheapest", "most expensive"] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => {
                    setSortBy(sort);
                    setCurrentPage(1);
                    updateURL({ sort, page: 1 });
                  }}
                  className={`cursor-pointer px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                    sortBy === sort
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                      : "bg-black/40 text-gray-300 hover:bg-blue-500/20 hover:text-white hover:scale-105 hover:shadow-md active:scale-95"
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              Page {currentPage} of {totalPages} ({filteredProducts.length} items)
            </div>
          </div>
        </div>

        {/* Filter Form */}
        <div
          style={{
            maxWidth: "1400px",
            width: "100%",
            padding: "0 15px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              padding: "30px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2 className="text-2xl font-bold mb-6">Filter Options</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Material */}
              <div>
                <label className="block mb-2 text-sm font-medium">Material</label>
                <select
                  value={material}
                  onChange={(e) => {
                    setMaterial(e.target.value);
                    updateURL({ material: e.target.value, page: 1 });
                  }}
                  className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option key="material-any" value="">any</option>
                  {materials.map((m) => (
                    <option key={`material-${m}`} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre */}
              <div>
                <label className="block mb-2 text-sm font-medium">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => {
                    setGenre(e.target.value);
                    updateURL({ genre: e.target.value, page: 1 });
                  }}
                  className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option key="genre-any" value="">any</option>
                  {genres.map((g) => (
                    <option key={`genre-${g}`} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block mb-2 text-sm font-medium">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => {
                    setGender(e.target.value);
                    updateURL({ gender: e.target.value, page: 1 });
                  }}
                  className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option key="gender-any" value="">any</option>
                  {genders.map((g) => (
                    <option key={`gender-${g}`} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Race */}
              <div>
                <label className="block mb-2 text-sm font-medium">Race</label>
                <select
                  value={race}
                  onChange={(e) => {
                    setRace(e.target.value);
                    updateURL({ race: e.target.value, page: 1 });
                  }}
                  className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option key="race-any" value="">any</option>
                  {races.map((r) => (
                    <option key={`race-${r}`} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Holding */}
              <div>
                <label className="block mb-2 text-sm font-medium">Holding</label>
                <select
                  value={holding}
                  onChange={(e) => {
                    setHolding(e.target.value);
                    updateURL({ holding: e.target.value, page: 1 });
                  }}
                  className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option key="holding-any" value="">any</option>
                  {holdings.map((h) => (
                    <option key={`holding-${h}`} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* Wearing */}
              <div>
                <label className="block mb-2 text-sm font-medium">Wearing</label>
                <select
                  value={wearing}
                  onChange={(e) => {
                    setWearing(e.target.value);
                    updateURL({ wearing: e.target.value, page: 1 });
                  }}
                  className="w-full px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option key="wearing-any" value="">any</option>
                  {wearings.map((w) => (
                    <option key={`wearing-${w}`} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetFilters}
                className="cursor-pointer px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ maxWidth: "1400px", width: "100%", padding: "0 15px" }}>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {/* Skeleton Image */}
                  <div
                    className="animate-pulse"
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                  />
                  
                  {/* Skeleton Title */}
                  <div
                    className="animate-pulse"
                    style={{
                      height: "24px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "4px",
                      marginBottom: "10px",
                      width: "80%",
                    }}
                  />
                  <div
                    className="animate-pulse"
                    style={{
                      height: "24px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "4px",
                      marginBottom: "15px",
                      width: "60%",
                    }}
                  />
                  
                  {/* Skeleton Price */}
                  <div
                    className="animate-pulse"
                    style={{
                      height: "32px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "4px",
                      marginBottom: "15px",
                      width: "40%",
                    }}
                  />
                  
                  {/* Skeleton Info */}
                  <div className="space-y-2 mb-4">
                    <div
                      className="animate-pulse"
                      style={{
                        height: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "4px",
                        width: "50%",
                      }}
                    />
                    <div
                      className="animate-pulse"
                      style={{
                        height: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "4px",
                        width: "70%",
                      }}
                    />
                  </div>
                  
                  {/* Skeleton Button */}
                  <div
                    className="animate-pulse"
                    style={{
                      height: "48px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedProducts.map((product) => (
                <div
                  key={product.sku}
                  onClick={() => router.push(`/painting-options/${product.sku}`)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Product Image */}
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: "#333",
                      borderRadius: "8px",
                      marginBottom: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {product.images && product.images[0]?.URL ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.images[0].URL}
                          alt={product.name || "Product image"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          loading="lazy"
                        />
                        {/* Magnifier Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (product.images?.[0]?.URL) {
                              setSelectedImage(product.images[0].URL);
                              setSelectedProductName(product.name);
                            }
                          }}
                          className="cursor-pointer absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
                          title="View full size"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <div className="text-gray-500">No Image</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <h3 className="text-lg font-bold mb-2 line-clamp-2" title={product.name}>
                    {product.name}
                  </h3>
                  
                  {product.price && (
                    <div className="text-2xl font-bold text-blue-400 mb-2">
                      ${product.price}
                    </div>
                  )}

                  <div className="space-y-1 text-sm text-gray-400 mb-3">
                    <div className="font-medium text-green-400">In stock</div>
                    <div>SKU: {product.sku}</div>
                  </div>

                  <Link
                    href={`/painting-options/${product.sku}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "12px",
                      backgroundColor: "#4488ff",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#6699ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#4488ff";
                    }}
                  >
                    Customize & Order
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  marginTop: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`cursor-pointer px-4 py-2 rounded font-medium transition-colors ${
                    currentPage === 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

                  if (endPage - startPage < maxVisible - 1) {
                    startPage = Math.max(1, endPage - maxVisible + 1);
                  }

                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => goToPage(1)}
                        className="cursor-pointer px-3 py-2 rounded bg-black/40 hover:bg-black/60 text-white transition-colors"
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      pages.push(<span key="ellipsis1" className="text-gray-400">...</span>);
                    }
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => goToPage(i)}
                        className={`cursor-pointer px-3 py-2 rounded font-medium transition-colors ${
                          currentPage === i
                            ? "bg-blue-500 text-white"
                            : "bg-black/40 hover:bg-black/60 text-white"
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }

                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(<span key="ellipsis2" className="text-gray-400">...</span>);
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => goToPage(totalPages)}
                        className="cursor-pointer px-3 py-2 rounded bg-black/40 hover:bg-black/60 text-white transition-colors"
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`cursor-pointer px-4 py-2 rounded font-medium transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
            </>
          )}

          {!loading && displayedProducts.length === 0 && (
            <div className="text-center text-xl text-gray-400">
              No products found. Try adjusting your filters.
            </div>
          )}
        </div>

        {/* Image Modal to correct the loading issues from the api */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 touch-none cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full flex flex-col items-center">
              {/* Close button - larger for mobile */}
              <button
                onClick={() => setSelectedImage(null)}
                className="cursor-pointer absolute -top-12 sm:-top-14 right-0 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white p-3 sm:p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10 touch-manipulation"
                title="Close"
                aria-label="Close image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Product name */}
              <div className="text-white text-center mb-4 text-lg sm:text-xl font-bold px-2">
                {selectedProductName}
              </div>

              {/* Image container - allows pinch zoom on mobile */}
              <div
                className="relative w-full max-h-[70vh] bg-black/50 rounded-lg overflow-auto flex items-center justify-center touch-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt={selectedProductName || "Product image"}
                  className="max-w-full max-h-[70vh] w-auto h-auto object-contain select-none"
                  draggable="false"
                />
              </div>

              {/* Instructions */}
              <div className="text-white/60 text-center mt-4 text-sm px-2">
                <span className="hidden sm:inline">Click outside to close</span>
                <span className="sm:hidden">Tap outside to close • Pinch to zoom</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
