"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleCheck,
  ImageOff,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PremadeProduct } from "@/lib/db";
import { formatPrice } from "@/lib/pricing";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const EMPTY_FORM = {
  name: "",
  price: "",
  originalPrice: "",
  image: "",
  description: "",
  sku: "",
};

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-input bg-background/60 px-3.5 text-sm text-foreground transition-colors hover:border-foreground/30 focus-visible:border-primary";

type Notice = { kind: "success" | "error"; text: string } | null;

export function ProductsManager({
  products,
  problem,
}: {
  products: PremadeProduct[];
  problem: string | null;
}) {
  const router = useRouter();
  const [, startRefresh] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PremadeProduct | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const field = (key: keyof typeof EMPTY_FORM) => ({
    value: form[key],
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm({ ...form, [key]: event.target.value }),
  });

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setImageFile(null);
    setImagePreview("");
    setShowForm(false);
  };

  const startEdit = (product: PremadeProduct) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      image: product.image,
      description: product.description,
      sku: product.sku,
    });
    setImagePreview(product.image);
    setImageFile(null);
    setNotice(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice({ kind: "error", text: "Please choose an image file." });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setNotice({ kind: "error", text: "Images must be smaller than 5 MB." });
      return;
    }
    setNotice(null);
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setNotice(null);

    try {
      let image = form.image;
      if (imageFile) {
        const upload = new FormData();
        upload.append("file", imageFile);
        upload.append("folder", "premade");
        const response = await fetch("/api/upload", {
          method: "POST",
          body: upload,
        });
        if (!response.ok) throw new Error("The image upload failed.");
        image = (await response.json()).url;
      }
      if (!image) throw new Error("Please add a product photo.");

      const response = await fetch("/api/admin/premade-products", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editing ? { id: editing.id, ...form, image } : { ...form, image }
        ),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "The product couldn't be saved.");
      }

      setNotice({
        kind: "success",
        text: editing ? `Updated “${form.name}”.` : `Added “${form.name}”.`,
      });
      resetForm();
      startRefresh(() => router.refresh());
    } catch (error) {
      setNotice({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "The product couldn't be saved.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: PremadeProduct) => {
    if (
      !window.confirm(
        `Delete “${product.name}”? It will disappear from the shop.`
      )
    )
      return;
    setNotice(null);
    const response = await fetch(
      `/api/admin/premade-products?id=${product.id}`,
      {
        method: "DELETE",
      }
    ).catch(() => null);
    if (!response?.ok) {
      setNotice({
        kind: "error",
        text: "The product couldn't be deleted. Please try again.",
      });
      return;
    }
    setNotice({ kind: "success", text: `Deleted “${product.name}”.` });
    startRefresh(() => router.refresh());
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Prepainted products
          </h1>
          <p className="mt-1 text-muted-foreground">
            Pieces listed here appear in the shop. Each is removed automatically
            once it sells.
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              setNotice(null);
              setShowForm(true);
            }}
            className="self-start sm:self-auto"
          >
            <Plus aria-hidden />
            Add product
          </Button>
        )}
      </div>

      {(notice || problem) && (
        <p
          role={notice?.kind === "success" ? "status" : "alert"}
          className={
            notice?.kind === "success"
              ? "mt-6 flex gap-2 rounded-xl border border-success/40 bg-success/10 p-4 text-sm text-success"
              : "mt-6 flex gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-[oklch(0.85_0.08_25)]"
          }
        >
          {notice?.kind === "success" ? (
            <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
          ) : (
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          )}
          {notice?.text ?? problem}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="surface mt-8 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold">
              {editing ? "Edit product" : "New product"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={resetForm}
              aria-label="Close form"
            >
              <X aria-hidden />
            </Button>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_1fr]">
            <div>
              <span className="text-sm font-medium">Photo</span>
              <div className="mt-1.5 grid aspect-[4/3] place-items-center overflow-hidden rounded-xl border border-dashed border-input bg-background/50">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local preview
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageOff
                    className="size-8 text-muted-foreground"
                    aria-hidden
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                aria-label="Product photo"
                onChange={handleImageChange}
                className="mt-3 block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground hover:file:bg-foreground/15"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                JPG, PNG, GIF or WebP, up to 5 MB.
              </p>
            </div>

            <div className="grid content-start gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Product name
                <input
                  required
                  placeholder="Human Fighter"
                  className={inputClass}
                  {...field("name")}
                />
              </label>
              <label className="text-sm font-medium">
                SKU
                <input
                  required
                  placeholder="PREMADE-001"
                  className={inputClass}
                  {...field("sku")}
                />
              </label>
              <label className="text-sm font-medium">
                Price ($)
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0.5"
                  placeholder="20.00"
                  className={inputClass}
                  {...field("price")}
                />
              </label>
              <label className="text-sm font-medium">
                Original price ($)
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="30.00"
                  className={inputClass}
                  {...field("originalPrice")}
                />
              </label>
              <label className="text-sm font-medium sm:col-span-2">
                Description
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed description of the miniature…"
                  className={`${inputClass} h-auto py-3`}
                  {...field("description")}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-6">
            <Button type="submit" disabled={isSaving}>
              {isSaving && (
                <LoaderCircle className="animate-spin" aria-hidden />
              )}
              {isSaving ? "Saving…" : editing ? "Save changes" : "Add product"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {products.length === 0 ? (
        !problem && (
          <div className="surface mt-8 px-6 py-14 text-center">
            <p className="font-display text-2xl font-semibold">
              No products yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first prepainted miniature to list it in the shop.
            </p>
          </div>
        )
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="surface flex flex-col overflow-hidden"
            >
              <div className="aspect-[4/3] bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="size-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-2xl font-semibold">
                  {product.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  SKU {product.sku}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </p>
                <p className="mt-3">
                  <span className="text-xl font-semibold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </p>
                <div className="mt-auto flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => startEdit(product)}
                  >
                    <Pencil aria-hidden />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash2 aria-hidden />
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
