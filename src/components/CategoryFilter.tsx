import { useCategories } from "../hooks/useProducts";

interface CategoryFilterProps {
  selected: string;
  onCategoryChange: (category: string) => void;
}

function CategoryFilter({ selected, onCategoryChange }: CategoryFilterProps) {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p>Failed to load categories.</p>;

  return (
    <select
      value={selected}
      onChange={(e) => onCategoryChange(e.target.value)}
    >
      <option value="all">All</option>
      {categories?.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
}

export default CategoryFilter;