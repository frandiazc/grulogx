"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { X } from "lucide-react"

export function AddSubitemDialog({ isOpen, onClose, onAddSubitem, selectedItem }) {
  const [newSubitem, setNewSubitem] = useState({ name: "", estado: "operativo", specifications: [] })
  const [newSpecification, setNewSpecification] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddSubitem(newSubitem)
    setNewSubitem({ name: "", estado: "operativo", specifications: [] })
    onClose()
  }

  const addSpecification = () => {
    if (newSpecification.trim() !== "") {
      setNewSubitem({
        ...newSubitem,
        specifications: [...newSubitem.specifications, newSpecification.trim()],
      })
      setNewSpecification("")
    }
  }

  const removeSpecification = (index) => {
    setNewSubitem({
      ...newSubitem,
      specifications: newSubitem.specifications.filter((_, i) => i !== index),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Subartículo a {selectedItem?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subitem-name">Nombre</Label>
              <Input
                id="subitem-name"
                value={newSubitem.name}
                onChange={(e) => setNewSubitem({ ...newSubitem, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="subitem-estado">Estado</Label>
              <select
                id="subitem-estado"
                value={newSubitem.estado}
                onChange={(e) => setNewSubitem({ ...newSubitem, estado: e.target.value })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                required
              >
                <option value="operativo">Operativo</option>
                <option value="inoperativo">Inoperativo</option>
              </select>
            </div>
            <div>
              <Label htmlFor="subitem-specifications">Especificaciones</Label>
              <div className="flex space-x-2">
                <Input
                  id="subitem-specifications"
                  value={newSpecification}
                  onChange={(e) => setNewSpecification(e.target.value)}
                  placeholder="Añadir especificación"
                />
                <Button type="button" onClick={addSpecification}>
                  Añadir
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {newSubitem.specifications.map((spec, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Añadir Subartículo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

