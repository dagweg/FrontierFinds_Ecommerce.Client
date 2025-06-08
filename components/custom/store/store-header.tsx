import Title from "@/components/custom/title";

export function StoreHeader() {
  return (
    <div className="mb-8">
      <Title text="Store" className="text-4xl mb-2" />
      <p className="text-gray-600 dark:text-gray-400">
        Discover amazing products from our community of sellers
      </p>
    </div>
  );
}
