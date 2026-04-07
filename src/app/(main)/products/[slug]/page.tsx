import { getProductBySlug } from "@/lib/actions";
import { ProductDetails } from "@/components/products/product-details";
import { ProductReviews } from "@/components/products/product-reviews";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product Not Found" };

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    description:
      product.description ||
      `Buy ${product.name} papad at the best price - handcrafted and chemical-free.`,
    openGraph: {
      images: [product.images?.[0] || "/placeholder.jpg", ...previousImages],
      title: `${product.name} | Papadwala`,
      description:
        product.description ||
        `Handcrafted ${product.name} with authentic Indian flavors.`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description || `Authentic ${product.name} papad.`,
    },
    alternates: {
      canonical: `https://papadwala.com/products/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Suspense
          fallback={
            <div className="animate-pulse bg-gray-100 h-150 rounded-3xl" />
          }
        >
          <ProductDetails product={product} />
          <ProductReviews
            productId={product.id}
            comments={product.comments || []}
          />
        </Suspense>
      </div>
    </main>
  );
}
