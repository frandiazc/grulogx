"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Truck,
  Package,
  Zap,
  Wrench,
  Search,
  X,
  CheckCircle,
  XCircle,
  BarChart,
  Moon,
  Sun,
  Plus,
  Edit,
  Trash,
  Tag,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { AddSubitemDialog } from "../components/AddSubitemDialog";
import { CategoryManager } from "../components/CategoryManager";

// Simple button component
const Button = ({ children, variant, size, className, onClick }) => (
  <button
    className={`px-4 py-2 rounded ${
      variant === "outline"
        ? "border border-gray-300 dark:border-gray-600"
        : "bg-blue-500 text-white"
    } ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

// Simple input component
const Input = ({ type, placeholder, className, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
    value={value}
    onChange={onChange}
  />
);

// Simple dialog component
const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => <div>{children}</div>;
const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const DialogTitle = ({ children }) => (
  <h2 className="text-2xl font-bold dark:text-white">{children}</h2>
);
const DialogDescription = ({ children }) => (
  <p className="text-gray-600 dark:text-gray-300">{children}</p>
);
const DialogFooter = ({ children }) => <div className="mt-4">{children}</div>;

// Simple table components
const Table = ({ children }) => (
  <table className="w-full border-collapse">{children}</table>
);
const TableHeader = ({ children }) => <thead>{children}</thead>;
const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableRow = ({ children }) => <tr>{children}</tr>;
const TableHead = ({ children }) => (
  <th className="border p-2 text-left dark:border-gray-600 dark:text-white">
    {children}
  </th>
);
const TableCell = ({ children, className }) => (
  <td
    className={`border p-2 dark:border-gray-600 dark:text-gray-300 ${className}`}
  >
    {children}
  </td>
);

// Componente para mostrar el estado
const StatusIndicator = ({ status }) => {
  const isOperative = status === "operativo";
  const isUnknown = !["operativo", "inoperativo"].includes(status);

  return (
    <div
      className={`flex items-center ${
        isUnknown
          ? "text-gray-500"
          : isOperative
          ? "text-green-500"
          : "text-red-500"
      }`}
    >
      {isUnknown ? (
        <div className="w-4 h-4 mr-1 rounded-full bg-gray-500" />
      ) : isOperative ? (
        <CheckCircle className="w-4 h-4 mr-1" />
      ) : (
        <XCircle className="w-4 h-4 mr-1" />
      )}
      <span className="capitalize">{status || "desconocido"}</span>
    </div>
  );
};

// Componente mejorado para las estadísticas
const Statistics = ({ categories }) => {
  const stats = useMemo(() => {
    const allItems = categories.flatMap((category) =>
      category.items.flatMap((item) => item.subitems)
    );
    const totalItems = allItems.length;
    const operativeItems = allItems.filter(
      (item) => item.estado === "operativo"
    ).length;
    const inoperativeItems = totalItems - operativeItems;

    const itemsByCategory = categories.map((category) => {
      const categoryItems = category.items.flatMap((item) => item.subitems);
      return {
        name: category.name,
        total: categoryItems.length,
        operativos: categoryItems.filter((item) => item.estado === "operativo")
          .length,
        inoperativos: categoryItems.filter(
          (item) => item.estado === "inoperativo"
        ).length,
      };
    });

    return {
      totalItems,
      operativeItems,
      inoperativeItems,
      availability: ((operativeItems / totalItems) * 100).toFixed(2),
      itemsByCategory,
    };
  }, [categories]);

  const pieData = [
    { name: "Operativos", value: stats.operativeItems },
    { name: "Inoperativos", value: stats.inoperativeItems },
  ];

  const COLORS = ["#4CAF50", "#F44336"];
  const CATEGORY_COLORS = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">
        Estadísticas del Inventario
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-medium mb-4 dark:text-white">
            Estado General del Inventario
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4 dark:text-white">
            Métricas Clave
          </h3>
          <ul className="space-y-2 text-lg dark:text-gray-300">
            <li>
              Total de artículos:{" "}
              <span className="font-semibold">{stats.totalItems}</span>
            </li>
            <li>
              Artículos operativos:{" "}
              <span className="font-semibold text-green-600">
                {stats.operativeItems}
              </span>
            </li>
            <li>
              Artículos inoperativos:{" "}
              <span className="font-semibold text-red-600">
                {stats.inoperativeItems}
              </span>
            </li>
            <li>
              Disponibilidad:{" "}
              <span className="font-semibold">{stats.availability}%</span>
            </li>
          </ul>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4 dark:text-white">
        Estadísticas por Categoría
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          data={stats.itemsByCategory}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
          <Legend />
          <Bar
            dataKey="operativos"
            stackId="a"
            fill="#4CAF50"
            name="Operativos"
          />
          <Bar
            dataKey="inoperativos"
            stackId="a"
            fill="#F44336"
            name="Inoperativos"
          />
        </RechartsBarChart>
      </ResponsiveContainer>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 dark:text-white">
          Desglose por Categoría
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.itemsByCategory.map((category, index) => (
            <div
              key={category.name}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            >
              <h4
                className="text-lg font-semibold mb-2"
                style={{
                  color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                }}
              >
                {category.name}
              </h4>
              <ul className="space-y-1 dark:text-gray-300">
                <li>
                  Total: <span className="font-medium">{category.total}</span>
                </li>
                <li>
                  Operativos:{" "}
                  <span className="font-medium text-green-600">
                    {category.operativos}
                  </span>
                </li>
                <li>
                  Inoperativos:{" "}
                  <span className="font-medium text-red-600">
                    {category.inoperativos}
                  </span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const categorizeItems = (items) => {
  const categorized = {};
  items.forEach((item) => {
    if (!categorized[item.category_name]) {
      categorized[item.category_name] = {
        name: item.category_name,
        icon: getCategoryIcon(item.category_name),
        items: [],
      };
    }
    categorized[item.category_name].items.push({
      ...item,
      subitems: Array.isArray(item.subitems) ? item.subitems : [],
    });
  });
  return Object.values(categorized);
};

const getCategoryIcon = (category) => {
  switch (category) {
    case "Vehículos":
      return Truck;
    case "Contenedores":
      return Package;
    case "Grupos Electrógenos":
      return Zap;
    default:
      return Wrench;
  }
};

export default function MaterialCatalog() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    image: "",
    subitems: [],
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddSubitemDialogOpen, setIsAddSubitemDialogOpen] = useState(false);
  const [newSubitem, setNewSubitem] = useState({
    name: "",
    estado: "operativo",
    specifications: {},
  });
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const categoriesData = await response.json();
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
        if (!activeCategory) {
          setActiveCategory(categoriesData[0] || null);
        }
      } else {
        console.error(
          "Fetched categories data is not an array:",
          categoriesData
        );
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/items");
      const itemsData = await response.json();
      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryItems = (categoryName) => {
    return items.filter((item) => item.category_name === categoryName);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === "") {
      setActiveCategory(categories[0] || null);
      setShowStats(false);
    } else {
      const allItems = categories.flatMap((category) => category.items || []);
      const foundItems = allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(term.toLowerCase()) ||
          (item.subitems || []).some(
            (subitem) =>
              subitem.name.toLowerCase().includes(term.toLowerCase()) ||
              Object.values(subitem.specifications || {}).some(
                (value) =>
                  typeof value === "string" &&
                  value.toLowerCase().includes(term.toLowerCase())
              )
          )
      );
      setActiveCategory({ name: "Resultados de búsqueda", items: foundItems });
      setShowStats(false);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchTerm("");
    setShowStats(false);
  };

  const handleStatsClick = () => {
    setShowStats(true);
    setActiveCategory(null);
    setSearchTerm("");
  };

  const handleAddItem = async () => {
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        setIsAddDialogOpen(false);
        setNewItem({ name: "", category: "", image: "", subitems: [] });
        fetchItems();
      } else {
        console.error("Error adding item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleUpdateItem = async (id, updatedItem) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
      if (response.ok) {
        setIsEditDialogOpen(false);
        setEditingItem(null);
        fetchItems();
      } else {
        console.error("Error updating item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setIsDialogOpen(false);
        fetchItems();
      } else {
        console.error("Error deleting item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (response.ok) {
        fetchCategories();
      } else {
        console.error("Error adding category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: categoryId }),
      });
      if (response.ok) {
        fetchCategories();
      } else {
        console.error("Error deleting category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleAddSubitem = async (newSubitem) => {
    try {
      const response = await fetch(`/api/items/${selectedItem.id}/subitems`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubitem),
      });
      if (response.ok) {
        fetchItems();
        setIsAddSubitemDialogOpen(false);
      } else {
        console.error("Error adding subitem");
      }
    } catch (error) {
      console.error("Error adding subitem:", error);
    }
  };

  const handleUpdateSubitem = async (itemId, subitemId, updatedSubitem) => {
    try {
      const response = await fetch(
        `/api/items/${itemId}/subitems/${subitemId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSubitem),
        }
      );
      if (response.ok) {
        fetchItems();
        setIsEditDialogOpen(false);
      } else {
        console.error("Error updating subitem");
      }
    } catch (error) {
      console.error("Error updating subitem:", error);
    }
  };

  const handleDeleteSubitem = async (itemId, subitemId) => {
    try {
      const response = await fetch(
        `/api/items/${itemId}/subitems/${subitemId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchItems();
      } else {
        console.error("Error deleting subitem");
      }
    } catch (error) {
      console.error("Error deleting subitem:", error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openDialog = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <nav className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Catálogo
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category.name);
              return (
                <button
                  key={category.name}
                  className={`w-full text-left px-4 py-2 flex items-center space-x-3 ${
                    activeCategory?.name === category.name
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
            <button
              className={`w-full text-left px-4 py-2 flex items-center space-x-3 ${
                showStats
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={handleStatsClick}
            >
              <BarChart className="h-5 w-5" />
              <span>Estadísticas</span>
            </button>
            <button
              className="w-full text-left px-4 py-2 flex items-center space-x-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsCategoryManagerOpen(true)}
            >
              <Tag className="h-5 w-5" />
              <span>Gestionar Categorías</span>
            </button>
          </div>
          <div className="p-4">
            <button
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md flex items-center justify-center"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 mr-2" />
              ) : (
                <Moon className="h-5 w-5 mr-2" />
              )}
              {darkMode ? "Modo Claro" : "Modo Oscuro"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Catálogo de Material
        </h1>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar en todo el catálogo..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {showStats ? (
          <Statistics
            categories={categories.map((cat) => ({
              ...cat,
              items: getCategoryItems(cat.name),
            }))}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {activeCategory?.name || "Sin categoría seleccionada"}
              </h2>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Añadir Artículo
              </Button>
            </div>

            {/* Grid of items */}
            {isLoading ? (
              <p className="text-gray-600 dark:text-gray-400 text-center mt-8">
                Cargando...
              </p>
            ) : activeCategory ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCategoryItems(activeCategory.name).map((item) => {
                  const IconComponent = getCategoryIcon(activeCategory.name);
                  return (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <IconComponent className="h-12 w-12 text-blue-500 mr-4" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              {(item.subitems || []).length} subarticulos
                              disponibles
                            </p>
                          </div>
                        </div>
                        <img
                          src={
                            item.image ||
                            "/placeholder.svg?height=100&width=100" ||
                            "/placeholder.svg"
                          }
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button
                          className="flex-1 mr-2"
                          variant="outline"
                          onClick={() => openDialog(item)}
                        >
                          Ver detalles
                        </Button>
                        <Button
                          className="w-10 h-10 p-0"
                          variant="outline"
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          className="w-10 h-10 p-0 ml-2"
                          variant="outline"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button
                          className="w-10 h-10 p-0 ml-2"
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsAddSubitemDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center mt-8">
                Selecciona una categoría para ver los artículos.
              </p>
            )}
          </>
        )}
      </main>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Detalles y subarticulos disponibles
            </DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Especificaciones</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(selectedItem?.subitems || []).map((subitem) => (
                <TableRow key={subitem.id}>
                  <TableCell className="font-medium">{subitem.name}</TableCell>
                  <TableCell>
                    {Object.entries(subitem.specifications || {}).map(
                      ([key, value]) => (
                        <div key={key}>
                          <span className="font-semibold">
                            {key.replace("_", " ")}:{" "}
                          </span>
                          {value}
                        </div>
                      )
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusIndicator status={subitem.estado || "desconocido"} />
                  </TableCell>
                  <TableCell>
                    <Button
                      className="mr-2"
                      variant="outline"
                      onClick={() => {
                        setEditingItem({
                          ...selectedItem,
                          editingSubitem: subitem,
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleDeleteSubitem(selectedItem.id, subitem.id)
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Artículo</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddItem();
            }}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nombre
                </label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Categoría
                </label>
                <select
                  id="category"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  URL de la imagen
                </label>
                <Input
                  id="image"
                  value={newItem.image}
                  onChange={(e) =>
                    setNewItem({ ...newItem, image: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Añadir Artículo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Item/Subitem Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem?.editingSubitem
                ? "Editar Subartículo"
                : "Editar Artículo"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingItem?.editingSubitem) {
                handleUpdateSubitem(
                  editingItem.id,
                  editingItem.editingSubitem.id,
                  editingItem.editingSubitem
                );
              } else {
                handleUpdateItem(editingItem.id, editingItem);
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Nombre
                </label>
                <Input
                  id="edit-name"
                  value={
                    editingItem?.editingSubitem
                      ? editingItem.editingSubitem.name
                      : editingItem?.name
                  }
                  onChange={(e) => {
                    if (editingItem?.editingSubitem) {
                      setEditingItem({
                        ...editingItem,
                        editingSubitem: {
                          ...editingItem.editingSubitem,
                          name: e.target.value,
                        },
                      });
                    } else {
                      setEditingItem({ ...editingItem, name: e.target.value });
                    }
                  }}
                  required
                />
              </div>
              {!editingItem?.editingSubitem && (
                <>
                  <div>
                    <label
                      htmlFor="edit-category"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Categoría
                    </label>
                    <select
                      id="edit-category"
                      value={editingItem?.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="edit-image"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      URL de la imagen
                    </label>
                    <Input
                      id="edit-image"
                      value={editingItem?.image}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          image: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}
              {editingItem?.editingSubitem && (
                <>
                  <div>
                    <label
                      htmlFor="edit-estado"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Estado
                    </label>
                    <select
                      id="edit-estado"
                      value={editingItem.editingSubitem.estado}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          editingSubitem: {
                            ...editingItem.editingSubitem,
                            estado: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="operativo">Operativo</option>
                      <option value="inoperativo">Inoperativo</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="edit-specifications"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Especificaciones
                    </label>
                    <textarea
                      id="edit-specifications"
                      value={JSON.stringify(
                        editingItem.editingSubitem.specifications,
                        null,
                        2
                      )}
                      onChange={(e) => {
                        try {
                          const newSpecs = JSON.parse(e.target.value);
                          setEditingItem({
                            ...editingItem,
                            editingSubitem: {
                              ...editingItem.editingSubitem,
                              specifications: newSpecs,
                            },
                          });
                        } catch (error) {
                          console.error("Invalid JSON:", error);
                        }
                      }}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      rows={5}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Manager Dialog */}
      <Dialog
        open={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gestionar Categorías</DialogTitle>
          </DialogHeader>
          <CategoryManager
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </DialogContent>
      </Dialog>

      {/* Add Subitem Dialog */}
      <AddSubitemDialog
        isOpen={isAddSubitemDialogOpen}
        onClose={() => setIsAddSubitemDialogOpen(false)}
        onAddSubitem={handleAddSubitem}
        newSubitem={newSubitem}
        setNewSubitem={setNewSubitem}
        selectedItem={selectedItem}
      />
    </div>
  );
}
