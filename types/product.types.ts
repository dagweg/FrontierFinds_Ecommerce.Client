export interface ProductsResult {
  totalCount: number;
  totalFetchedCount: number;
  products: ProductResult[];
}

export interface ProductResult {
  productId: string;
  productName: string;
  slug: string;
  productDescription: string;
  stockQuantity: number;
  priceValueInCents: number;
  priceCurrency: string;
  averageRating: number;
  images: ProductImagesResult;
  tags: TagResult[] | null;
  categories: CategoryResult[];
  sellerId: string; // Assuming SellerId is string based on context, adjust to Guid if necessary
}

export interface ProductImagesResult {
  thumbnail: ProductImageResult;
  leftImage: ProductImageResult | null;
  rightImage: ProductImageResult | null;
  frontImage: ProductImageResult | null;
  backImage: ProductImageResult | null;
  topImage: ProductImageResult | null;
  bottomImage: ProductImageResult | null;
}

export interface ProductImageResult {
  url: string | null;
}

export interface TagResult {
  id: string;
  name: string;
}

export interface CategoryResult {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  subCategories: CategoryResult[];
  checked: boolean;
  expanded: boolean;
  isActive: boolean;
}

export interface CategoriesResult {
  categories: CategoryResult[];
}

export interface FilterProductsQuery {
  name?: string;
  minPriceValueInCents?: number;
  maxPriceValueInCents?: number;
  categoryIds?: number[];
  pageNumber: number;
  pageSize: number;
}
