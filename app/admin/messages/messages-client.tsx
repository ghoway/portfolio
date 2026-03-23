"use client";

import { useState, useTransition } from "react";
import { deleteMessage, markMessageAsRead } from "@/actions/contact";
import { formatDate } from "@/lib/utils";
import { Mail, MailOpen, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/components/toast";
import { DeleteConfirm } from "@/components/delete-confirm";

type MessageNode = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export function MessagesClient({ initialMessages }: { initialMessages: MessageNode[] }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState(initialMessages);
  
  // Modals state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [readId, setReadId] = useState<string | null>(null);
  const [readPending, setReadPending] = useState(false);

  const confirmDelete = (id: string) => setDeleteId(id);
  const confirmRead = (id: string) => setReadId(id);

  const handleDelete = () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    startTransition(async () => {
      try {
        await deleteMessage(id);
        setMessages(msgs => msgs.filter(m => m.id !== id));
        toast("Message deleted successfully");
      } catch {
        toast("Failed to delete message");
      }
    });
  };

  const handleRead = () => {
    if (!readId || readPending) return;
    setReadPending(true);
    const id = readId;
    startTransition(async () => {
      try {
        await markMessageAsRead(id);
        setMessages(msgs => msgs.map(m => m.id === id ? { ...m, isRead: true } : m));
        setReadId(null);
        toast("Message marked as read");
      } catch {
        toast("Failed to mark as read");
      } finally {
        setReadPending(false);
      }
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-sm text-neutral-500">{messages.length} messages ({messages.filter(m => !m.isRead).length} unread)</p>
      </div>

      {messages.length === 0 ? (
        <p className="py-8 text-center text-neutral-500">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`rounded-xl border p-5 ${msg.isRead ? "border-neutral-200/60 bg-white dark:border-neutral-800/60 dark:bg-neutral-900" : "border-violet-200 bg-violet-50/30 dark:border-violet-800/30 dark:bg-violet-950/10"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    {msg.isRead ? <MailOpen className="h-4 w-4 text-neutral-400" /> : <Mail className="h-4 w-4 text-violet-600" />}
                    <span className="font-medium">{msg.name}</span>
                    <span className="text-sm text-neutral-500">&lt;{msg.email}&gt;</span>
                    <span className="text-xs text-neutral-400">{formatDate(msg.createdAt)}</span>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold">{msg.subject}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">{msg.message}</p>
                </div>
                <div className="ml-2 sm:ml-4 flex flex-shrink-0 items-center gap-1">
                  {!msg.isRead && (
                    <button onClick={() => confirmRead(msg.id)} disabled={isPending} className="rounded-lg p-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50" title="Mark as read">
                      <CheckCircle2 className="h-4 w-4 text-neutral-500" />
                    </button>
                  )}
                  <button onClick={() => confirmDelete(msg.id)} disabled={isPending} className="rounded-lg p-2 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50" title="Delete">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Modals */}
      <DeleteConfirm isOpen={!!deleteId} title="Delete Message" description="Are you sure you want to permanently delete this message?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      
      {/* Custom Read Confirm Modal reusing the DeleteConfirm styling but visually distinct */}
      {!!readId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-2xl dark:border-neutral-800/60 dark:bg-neutral-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/30">
              <MailOpen className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="mb-1 text-lg font-bold">Mark as Read?</h3>
            <p className="mb-6 text-sm text-neutral-500">This will remove the unread formatting from the message.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setReadId(null)}
                disabled={readPending}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRead}
                disabled={readPending}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {readPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
