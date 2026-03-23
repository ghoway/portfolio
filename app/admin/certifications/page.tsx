"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, X, Eye, EyeOff, ExternalLink, Award } from "lucide-react";
import { useToast } from "@/components/toast";
import { DeleteConfirm, useDeleteConfirm } from "@/components/delete-confirm";
import { useSaveConfirm, SaveConfirm } from "@/components/save-confirm";
import { ImageUpload } from "@/components/image-upload";

interface CertData {
  id: string; title: string; issuer: string; issueDate: string; expiryDate: string | null;
  credentialId: string | null; credentialUrl: string | null; imageUrl: string | null;
  isActive: boolean; order: number;
}

function CertForm({ data, onSave, onCancel }: { data?: CertData; onSave: (f: FormData) => void; onCancel: () => void }) {
  const [imageUrl, setImageUrl] = useState(data?.imageUrl || "");
  const { isConfirming, confirmSave, cancelSave } = useSaveConfirm();
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  function handleSubmitWrapper(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPendingFormData(new FormData(e.currentTarget));
    confirmSave();
  }

  return (
    <form onSubmit={handleSubmitWrapper} className="mb-6 rounded-xl border border-neutral-200/60 bg-white p-6 dark:border-neutral-800/60 dark:bg-neutral-900">
      {data && <input type="hidden" name="id" value={data.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <ImageUpload currentImage={data?.imageUrl || null} onUpload={setImageUrl} folder="certs" label="Certificate Image" aspectRatio="video" name="imageUrl" />
        </div>
        <div><label className="mb-1 block text-sm font-medium">Title</label>
          <input name="title" defaultValue={data?.title ?? ""} required className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Issuer</label>
          <input name="issuer" defaultValue={data?.issuer ?? ""} required className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Issue Date</label>
          <input name="issueDate" defaultValue={data?.issueDate ?? ""} placeholder="2024-01" required className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Expiry Date</label>
          <input name="expiryDate" defaultValue={data?.expiryDate ?? ""} placeholder="Optional" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Credential ID</label>
          <input name="credentialId" defaultValue={data?.credentialId ?? ""} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
        <div><label className="mb-1 block text-sm font-medium">Credential URL</label>
          <input name="credentialUrl" defaultValue={data?.credentialUrl ?? ""} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800" /></div>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="isActive" value="true" defaultChecked={data?.isActive !== false} className="rounded" />Show on public site
      </label>
      <div className="mt-4 flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 px-6 py-2.5 text-sm font-medium hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:hover:bg-red-900/40">
          <X className="h-4 w-4" />Cancel
        </button>
        <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
          <Save className="h-4 w-4" />{data ? "Update" : "Create"}
        </button>
      </div>
      
      <SaveConfirm 
        isOpen={isConfirming}
        onCancel={() => { cancelSave(); setPendingFormData(null); }}
        onConfirm={() => {
          cancelSave();
          if (pendingFormData) {
            pendingFormData.set("imageUrl", imageUrl);
            if (!pendingFormData.get("isActive")) pendingFormData.set("isActive", "false");
            onSave(pendingFormData);
          }
        }}
        title={data ? "Update Certification" : "Add Certification"}
        description={data ? "Save changes to this certification?" : "Create and publish this certification?"}
        confirmText={data ? "Save Changes" : "Create"}
      />
    </form>
  );
}

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<CertData[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const { pending, confirmDelete, cancelDelete } = useDeleteConfirm();

  useEffect(() => { fetch("/api/admin/certifications").then((r) => r.json()).then(setItems); }, []);

  async function handleSave(form: FormData) {
    const id = form.get("id") as string;
    await fetch("/api/admin/certifications", { method: id ? "PUT" : "POST", body: form });
    const data = await fetch("/api/admin/certifications").then((r) => r.json());
    setItems(data); setEditing(null); setShowForm(false);
    toast(id ? "Certification updated" : "Certification created");
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/certifications", { method: "DELETE", body: JSON.stringify({ id }), headers: { "Content-Type": "application/json" } });
    setItems(items.filter((i) => i.id !== id));
    cancelDelete();
    toast("Certification deleted");
  }

  async function toggleActive(item: CertData) {
    const form = new FormData();
    form.set("id", item.id); form.set("title", item.title); form.set("issuer", item.issuer);
    form.set("issueDate", item.issueDate); form.set("isActive", (!item.isActive).toString());
    await fetch("/api/admin/certifications", { method: "PUT", body: form });
    setItems(items.map((i) => i.id === item.id ? { ...i, isActive: !i.isActive } : i));
    toast(item.isActive ? "Hidden from site" : "Visible on site");
  }

  function startEdit(id: string) {
    setShowForm(false);
    setEditing(id);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Certifications</h1><p className="text-sm text-neutral-500">Manage certifications — toggle visibility</p></div>
        <button onClick={() => { setShowForm(true); setEditing(null); }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25">
          <Plus className="h-4 w-4" />Add Certification
        </button>
      </div>

      {(showForm || editing) && (
        <CertForm
          key={editing ?? "new"}
          data={editing ? items.find((i) => i.id === editing) : undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className={`flex items-center gap-3 rounded-xl border bg-white p-4 transition-all dark:bg-neutral-900 ${item.isActive ? "border-neutral-200/60 dark:border-neutral-800/60" : "border-neutral-200/40 opacity-60 dark:border-neutral-800/40"}`}>
            <Award className={`h-5 w-5 flex-shrink-0 ${item.isActive ? "text-violet-500" : "text-neutral-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{item.title}</h3>
                {!item.isActive && <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800">Hidden</span>}
              </div>
              <p className="text-sm text-neutral-500 truncate">{item.issuer} • {item.issueDate}</p>
            </div>
            {item.credentialUrl && <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-violet-500"><ExternalLink className="h-4 w-4" /></a>}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => toggleActive(item)} className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                {item.isActive ? <Eye className="h-4 w-4 text-emerald-500" /> : <EyeOff className="h-4 w-4 text-neutral-400" />}
              </button>
              <button onClick={() => startEdit(item.id)} className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"><Pencil className="h-4 w-4 text-neutral-500" /></button>
              <button onClick={() => confirmDelete(item.id)} className="rounded-lg p-2 hover:bg-red-50 dark:hover:bg-red-950/30"><Trash2 className="h-4 w-4 text-red-500" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="py-8 text-center text-neutral-500">No certifications yet. Add your first one!</p>}
      </div>

      <DeleteConfirm
        isOpen={!!pending}
        title="Delete Certification"
        description="This certification will be permanently removed from your portfolio."
        onConfirm={() => {
          if (!pending) return;
          return handleDelete(pending);
        }}
        onCancel={cancelDelete}
      />
    </div>
  );
}
