'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Category } from '@/types'

export default function AdminCategoriasPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Partial<Category> | null>(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '', parent_id: '', active: true })

  const load = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*, subcategories:categories!parent_id(*)')
      .is('parent_id', null)
      .order('order_index')
    setCategories(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = (parentId?: string) => {
    setEditing(null)
    setForm({ name: '', description: '', icon: '', parent_id: parentId ?? '', active: true })
    setModalOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description ?? '', icon: cat.icon ?? '', parent_id: cat.parent_id ?? '', active: cat.active })
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) { toast.error('Nombre requerido'); return }
    const payload = {
      name: form.name,
      slug: slugify(form.name),
      description: form.description || null,
      icon: form.icon || null,
      parent_id: form.parent_id || null,
      active: form.active,
    }

    if (editing?.id) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editing.id)
      if (error) { toast.error('Error al actualizar'); return }
    } else {
      const { error } = await supabase.from('categories').insert({ ...payload, order_index: 0 })
      if (error) { toast.error('Error al crear'); return }
    }

    setModalOpen(false)
    load()
    toast.success(editing ? 'Categoría actualizada' : 'Categoría creada')
  }

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('categories').update({ active }).eq('id', id)
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button onClick={() => openCreate()}>
          <Plus className="mr-2 h-4 w-4" /> Nueva categoría
        </Button>
      </div>

      {loading ? <p className="text-muted-foreground">Cargando...</p> : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.id} className="rounded-lg border bg-white overflow-hidden">
              {/* Parent */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{cat.name}</span>
                  {!cat.active && <Badge variant="outline" className="text-xs">Inactiva</Badge>}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <Badge variant="secondary" className="text-xs">{cat.subcategories.length} subcategorías</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={cat.active} onCheckedChange={(v) => toggleActive(cat.id, v)} />
                  <Button size="sm" variant="ghost" onClick={() => openEdit(cat)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openCreate(cat.id)}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Subcategories */}
              {cat.subcategories && cat.subcategories.map((sub: Category) => (
                <div key={sub.id} className="flex items-center justify-between px-4 py-3 border-t bg-muted/30">
                  <div className="flex items-center gap-2 pl-4">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">{sub.name}</span>
                    {!sub.active && <Badge variant="outline" className="text-xs">Inactiva</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={sub.active} onCheckedChange={(v) => toggleActive(sub.id, v)} />
                    <Button size="sm" variant="ghost" onClick={() => openEdit(sub)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Ícono (nombre lucide)</Label>
              <Input placeholder="wrench, zap, droplets..." value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(v) => setForm((p) => ({ ...p, active: v })) } />
              <Label>Activa</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={save}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
