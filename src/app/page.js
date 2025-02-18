"use client"

import { useState, useEffect, useMemo } from "react"
import { Truck, Box, Zap, Wrench, Search, X, CheckCircle, XCircle, BarChart, Moon, Sun } from "lucide-react"
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
} from "recharts"

// Simple button component
const Button = ({ children, variant, size, className, onClick }) => (
  <button
    className={`px-4 py-2 rounded ${
      variant === "outline" ? "border border-gray-300 dark:border-gray-600" : "bg-blue-500 text-white"
    } ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
)

// Simple input component
const Input = ({ type, placeholder, className, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    className={`border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
    value={value}
    onChange={onChange}
  />
)

// Simple dialog component
const Dialog = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
        <button onClick={onClose} className="float-right text-gray-500 dark:text-gray-400">
          <X />
        </button>
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children }) => <div>{children}</div>
const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>
const DialogTitle = ({ children }) => <h2 className="text-2xl font-bold dark:text-white">{children}</h2>
const DialogDescription = ({ children }) => <p className="text-gray-600 dark:text-gray-300">{children}</p>

// Simple table components
const Table = ({ children }) => <table className="w-full border-collapse">{children}</table>
const TableHeader = ({ children }) => <thead>{children}</thead>
const TableBody = ({ children }) => <tbody>{children}</tbody>
const TableRow = ({ children }) => <tr>{children}</tr>
const TableHead = ({ children }) => (
  <th className="border p-2 text-left dark:border-gray-600 dark:text-white">{children}</th>
)
const TableCell = ({ children, className }) => (
  <td className={`border p-2 dark:border-gray-600 dark:text-gray-300 ${className}`}>{children}</td>
)

// Componente para mostrar el estado
const StatusIndicator = ({ status }) => {
  const isOperative = status === "operativo"
  return (
    <div className={`flex items-center ${isOperative ? "text-green-500" : "text-red-500"}`}>
      {isOperative ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
      <span className="capitalize">{status}</span>
    </div>
  )
}

// Componente mejorado para las estadísticas
const Statistics = ({ categories }) => {
  const stats = useMemo(() => {
    const allItems = categories.flatMap((category) => category.items.flatMap((item) => item.subitems))
    const totalItems = allItems.length
    const operativeItems = allItems.filter((item) => item.estado === "operativo").length
    const inoperativeItems = totalItems - operativeItems

    const itemsByCategory = categories.map((category) => {
      const categoryItems = category.items.flatMap((item) => item.subitems)
      return {
        name: category.name,
        total: categoryItems.length,
        operativos: categoryItems.filter((item) => item.estado === "operativo").length,
        inoperativos: categoryItems.filter((item) => item.estado === "inoperativo").length,
      }
    })

    return {
      totalItems,
      operativeItems,
      inoperativeItems,
      availability: ((operativeItems / totalItems) * 100).toFixed(2),
      itemsByCategory,
    }
  }, [categories])

  const pieData = [
    { name: "Operativos", value: stats.operativeItems },
    { name: "Inoperativos", value: stats.inoperativeItems },
  ]

  const COLORS = ["#4CAF50", "#F44336"]
  const CATEGORY_COLORS = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12"]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 dark:text-white">Estadísticas del Inventario</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-medium mb-4 dark:text-white">Estado General del Inventario</h3>
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-4 dark:text-white">Métricas Clave</h3>
          <ul className="space-y-2 text-lg dark:text-gray-300">
            <li>
              Total de artículos: <span className="font-semibold">{stats.totalItems}</span>
            </li>
            <li>
              Artículos operativos: <span className="font-semibold text-green-600">{stats.operativeItems}</span>
            </li>
            <li>
              Artículos inoperativos: <span className="font-semibold text-red-600">{stats.inoperativeItems}</span>
            </li>
            <li>
              Disponibilidad: <span className="font-semibold">{stats.availability}%</span>
            </li>
          </ul>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4 dark:text-white">Estadísticas por Categoría</h3>
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
          <Bar dataKey="operativos" stackId="a" fill="#4CAF50" name="Operativos" />
          <Bar dataKey="inoperativos" stackId="a" fill="#F44336" name="Inoperativos" />
        </RechartsBarChart>
      </ResponsiveContainer>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 dark:text-white">Desglose por Categoría</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.itemsByCategory.map((category, index) => (
            <div key={category.name} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h4
                className="text-lg font-semibold mb-2"
                style={{ color: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
              >
                {category.name}
              </h4>
              <ul className="space-y-1 dark:text-gray-300">
                <li>
                  Total: <span className="font-medium">{category.total}</span>
                </li>
                <li>
                  Operativos: <span className="font-medium text-green-600">{category.operativos}</span>
                </li>
                <li>
                  Inoperativos: <span className="font-medium text-red-600">{category.inoperativos}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const categorizeItems = (items) => {
  // Implement your categorization logic here
  // This is a placeholder, replace with your actual logic
  const categories = [
    {
      name: "Vehículos",
      icon: Truck,
      items: items.filter((item) => item.category === "Vehículos"),
    },
    {
      name: "Contenedores",
      icon: Box,
      items: items.filter((item) => item.category === "Contenedores"),
    },
    {
      name: "Grupos Electrógenos",
      icon: Zap,
      items: items.filter((item) => item.category === "Grupos Electrógenos"),
    },
    {
      name: "Otros Equipos",
      icon: Wrench,
      items: items.filter((item) => item.category === "Otros Equipos"),
    },
  ]
  return categories
}

const categories = [
  {
    name: "Vehículos",
    icon: Truck,
    items: [
      {
        name: "Camión",
        image: "/placeholder.svg?height=100&width=100",
        subitems: [
          { name: "Camión volquete", capacidad: "20 toneladas", consumo: "30L/100km", estado: "operativo" },
          { name: "Camión plataforma", capacidad: "15 toneladas", longitud: "12 metros", estado: "inoperativo" },
        ],
      },
      {
        name: "Furgoneta",
        image: "/placeholder.svg?height=100&width=100",
        subitems: [
          { name: "Furgoneta de carga", capacidad: "1.5 toneladas", volumen: "10 m³", estado: "operativo" },
          { name: "Furgoneta frigorífica", capacidad: "1 tonelada", temperatura: "-20°C a +5°C", estado: "operativo" },
        ],
      },
      {
        name: "Excavadora",
        image: "/placeholder.svg?height=100&width=100",
        subitems: [
          {
            name: "Excavadora de orugas",
            peso: "20 toneladas",
            profundidad_excavación: "6 metros",
            estado: "inoperativo",
          },
          { name: "Miniexcavadora", peso: "5 toneladas", ancho: "1.5 metros", estado: "operativo" },
        ],
      },
    ],
  },
  {
    name: "Contenedores",
    icon: Box,
    items: [
      {
        name: "Contenedor 20ft",
        image: "/placeholder.svg?height=100&width=100",
        subitems: [
          { name: "Contenedor estándar 20ft", volumen: "33 m³", carga_máxima: "28 toneladas", estado: "operativo" },
          {
            name: "Contenedor refrigerado 20ft",
            rango_temperatura: "-30°C a +30°C",
            consumo: "5 kW/h",
            estado: "operativo",
          },
        ],
      },
      {
        name: "Contenedor 40ft",
        image: "/placeholder.svg?height=100&width=100",
        subitems: [
          { name: "Contenedor estándar 40ft", volumen: "67 m³", carga_máxima: "32 toneladas", estado: "operativo" },
          {
            name: "Contenedor Open Top 40ft",
            altura_interior: "2.65 metros",
            apertura_superior: "11.58 x 2.20 metros",
            estado: "inoperativo",
          },
        ],
      },
    ],
  },
  {
    name: "Grupos Electrógenos",
    icon: Zap,
    items: [
      {
        name: "Generador 50kVA",
        image: "/placeholder.svg?height=100&width=100",
        subitems: [
          { name: "Generador diésel 50kVA", consumo: "11 L/h", nivel_sonoro: "68 dBA", estado: "operativo" },
          { name: "Generador gas 50kVA", consumo: "13 m³/h", emisiones: "Bajas", estado: "inoperativo" },
        ],
      },
      {
        name: "Generador 100kVA",
        image: "/placeholder.svg?height=100&width=100",
        subitems: [
          { name: "Generador diésel 100kVA", consumo: "21 L/h", autonomía: "12 horas", estado: "operativo" },
          { name: "Generador insonorizado 100kVA", nivel_sonoro: "62 dBA", peso: "2800 kg", estado: "operativo" },
        ],
      },
    ],
  },
  {
    name: "Otros Equipos",
    icon: Wrench,
    items: [
      {
        name: "Compresor de aire",
        image: "/placeholder.svg?height=100&width=100",
        subitems: [
          { name: "Compresor portátil", caudal: "5 m³/min", presión: "7 bar", estado: "operativo" },
          { name: "Compresor eléctrico", potencia: "15 kW", tanque: "500 L", estado: "inoperativo" },
        ],
      },
      {
        name: "Bomba de agua",
        image: "/placeholder.svg?height=100&width=100",
        subitems: [
          { name: "Bomba sumergible", caudal: "350 L/min", altura_máxima: "15 metros", estado: "operativo" },
          { name: "Motobomba", motor: "Gasolina 5.5 HP", diámetro_succión: "3 pulgadas", estado: "operativo" },
        ],
      },
    ],
  },
]

export default function MaterialCatalog() {
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({ name: "", category: "", image: "", subitems: [] })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    async function checkConnection() {
      const response = await fetch("/api/check-connection")
      const { connected } = await response.json()
      setIsConnected(connected)
    }
    checkConnection()
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items")
      const items = await response.json()
      const categorizedItems = categorizeItems(items)
      setCategories(categorizedItems)
      setActiveCategory(categorizedItems[0])
    } catch (error) {
      console.error("Error fetching items:", error)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term === "") {
      setActiveCategory(categories[0])
      setShowStats(false)
    } else {
      const allItems = categories.flatMap((category) => category.items)
      const foundItems = allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(term.toLowerCase()) ||
          item.subitems.some(
            (subitem) =>
              subitem.name.toLowerCase().includes(term.toLowerCase()) ||
              Object.values(subitem).some(
                (value) => typeof value === "string" && value.toLowerCase().includes(term.toLowerCase()),
              ),
          ),
      )
      setActiveCategory({ name: "Resultados de búsqueda", items: foundItems })
      setShowStats(false)
    }
  }

  const openDialog = (item) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleCategoryClick = (category) => {
    setActiveCategory(category)
    setSearchTerm("")
    setShowStats(false)
  }

  const handleStatsClick = () => {
    setShowStats(true)
    setActiveCategory(null)
    setSearchTerm("")
  }

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <nav className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Catálogo</h1>
            {isConnected ? (
              <p className="text-green-500">Conectado a MongoDB</p>
            ) : (
              <p className="text-red-500">No conectado a MongoDB</p>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`w-full text-left px-4 py-2 flex items-center space-x-3 ${
                  activeCategory?.name === category.name
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                <category.icon className="h-5 w-5" />
                <span>{category.name}</span>
              </button>
            ))}
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
          </div>
          <div className="p-4">
            <button
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md flex items-center justify-center"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
              {darkMode ? "Modo Claro" : "Modo Oscuro"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto bg-gray-100 dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Catálogo de Material</h1>

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
          <Statistics categories={categories} />
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{activeCategory?.name}</h2>

            {/* Grid of items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategory?.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {activeCategory.icon && <activeCategory.icon className="h-12 w-12 text-blue-500 mr-4" />}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.subitems.length} subarticulos disponibles
                        </p>
                      </div>
                    </div>
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  <Button className="w-full" variant="outline" onClick={() => openDialog(item)}>
                    Ver detalles
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>Detalles y subarticulos disponibles</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Especificaciones</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedItem?.subitems.map((subitem) => (
                <TableRow key={subitem.name}>
                  <TableCell className="font-medium">{subitem.name}</TableCell>
                  <TableCell>
                    {Object.entries(subitem)
                      .filter(([key]) => !["name", "estado"].includes(key))
                      .map(([key, value]) => (
                        <div key={key}>
                          <span className="font-semibold">{key.replace("_", " ")}: </span>
                          {value}
                        </div>
                      ))}
                  </TableCell>
                  <TableCell>
                    <StatusIndicator status={subitem.estado} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  )
}

