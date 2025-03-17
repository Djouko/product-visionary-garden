
export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  size: string;
  price: number;
  stock: number;
  status: 'Active' | 'On Hold' | 'Out of Stock';
  discount?: number;
  image: string;
  yearProduced?: string;
  origin?: string;
  description?: string;
}

export const productsData: Product[] = [
  {
    id: "SCR32405",
    name: "American Sneakers Shoes Blue",
    category: "Sneakers",
    brand: "Zamoran",
    size: "38-45",
    price: 2868,
    stock: 780,
    status: "Active",
    image: "/devsecurity-uploads/9eb89923-e97b-4ca6-8235-7fb5c688e26f.png",
    yearProduced: "2023",
    origin: "USA",
    description: "Premium blue sneakers with comfortable fit and durable design"
  },
  {
    id: "B324FDS2",
    name: "Blackian Sneakers Shoes Black",
    category: "Sneakers",
    brand: "Zamoran",
    size: "39-45",
    price: 2642,
    stock: 706,
    status: "Active",
    discount: 10,
    image: "/devsecurity-uploads/9eb89923-e97b-4ca6-8235-7fb5c688e26f.png",
    yearProduced: "2023",
    origin: "Italy",
    description: "Sleek black sneakers with modern design and premium materials"
  },
  {
    id: "C4D532S8",
    name: "Armway Sneakers Shoes Orange",
    category: "Sneakers",
    brand: "Armway",
    size: "37-45",
    price: 2628,
    stock: 687,
    status: "Active",
    image: "/devsecurity-uploads/9eb89923-e97b-4ca6-8235-7fb5c688e26f.png",
    yearProduced: "2023",
    origin: "France",
    description: "Vibrant orange sneakers with enhanced comfort and style"
  },
  {
    id: "AE24E52G",
    name: "Gunnerian Sneakers Yellow Blue",
    category: "Sneakers",
    brand: "Zamoran",
    size: "38-45 EUR",
    price: 2436,
    stock: 532,
    status: "Active",
    discount: 25,
    image: "/devsecurity-uploads/7e6a1db2-2b5a-438f-9e8f-8ccb0b7243aa.png",
    yearProduced: "2023",
    origin: "Australia",
    description: "Yellow and blue athletic sneakers with superior cushioning"
  },
  {
    id: "KL78P23R",
    name: "Running Pro Max White",
    category: "Running",
    brand: "SportMax",
    size: "38-46",
    price: 3250,
    stock: 325,
    status: "On Hold",
    image: "/devsecurity-uploads/9eb89923-e97b-4ca6-8235-7fb5c688e26f.png",
    yearProduced: "2023",
    origin: "Germany",
    description: "Professional running shoes with advanced technology for maximum performance"
  },
  {
    id: "MN45Q87T",
    name: "Urban Walker Casual Brown",
    category: "Casual",
    brand: "UrbanStyle",
    size: "40-47",
    price: 1950,
    stock: 158,
    status: "Active",
    image: "/devsecurity-uploads/9eb89923-e97b-4ca6-8235-7fb5c688e26f.png",
    yearProduced: "2022",
    origin: "Spain",
    description: "Comfortable brown casual shoes for everyday urban wear"
  },
  {
    id: "PQ38R72X",
    name: "Hiking Explorer Green",
    category: "Hiking",
    brand: "NatureTrek",
    size: "39-45",
    price: 3850,
    stock: 94,
    status: "Active",
    image: "/devsecurity-uploads/9eb89923-e97b-4ca6-8235-7fb5c688e26f.png",
    yearProduced: "2023",
    origin: "Switzerland",
    description: "Durable green hiking boots designed for challenging terrains"
  },
  {
    id: "ST63W91Y",
    name: "Classic Formal Black",
    category: "Formal",
    brand: "Elegance",
    size: "40-46",
    price: 4250,
    stock: 120,
    status: "Out of Stock",
    image: "/devsecurity-uploads/9eb89923-e97b-4ca6-8235-7fb5c688e26f.png",
    yearProduced: "2022",
    origin: "Italy",
    description: "Premium black formal shoes for business and special occasions"
  }
];

export const categories = Array.from(new Set(productsData.map(product => product.category)));
export const brands = Array.from(new Set(productsData.map(product => product.brand)));
export const statuses = ['All', 'Active', 'On Hold', 'Out of Stock'];

export const statistics = {
  purchased: 32860,
  available: 23328,
  income: 1286,
  spending: 1032,
  incomeChange: +12,
  spendingChange: +10
};
