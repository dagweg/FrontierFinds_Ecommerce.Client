export interface CartResult {
  totalItems: number;
  totalPrice: number;
  items: CartItemResult[];
}

export interface CartItemResult {
  id: string;
  quantity: number;
  product: ProductResult;
}

export interface ProductResult {
  productId: string;
  productName: string;
  productDescription: string;
  stockQuantity: number;
  priceValueInCents: number;
  priceCurrency: string;
  images: ProductImagesResult;
  tags: TagResult[] | null;
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
