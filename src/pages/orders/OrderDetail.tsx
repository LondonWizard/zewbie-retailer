import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Cog, Factory, Truck, Upload, Camera } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PageSkeleton } from '../../components/ui/PageSkeleton';
import api from '../../lib/api';
import { toast } from 'sonner';

interface OrderInfo {
  id: string; orderId: string; status: string; productName: string; quantity: number; total: number;
  customerName: string; shippingAddress: string; notes: string; createdAt: string;
  transparencyPhotos: Array<{ url: string; step: string; timestamp: string }>;
}

const STATUS_FLOW = ['pending', 'accepted', 'processing', 'manufacturing', 'shipped', 'completed'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    try { const r = await api.get(`/v1/retailer/orders/${id}`); setOrder(r.data); } catch { toast.error('Failed'); }
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function updateStatus(newStatus: string) {
    try { await api.patch(`/v1/retailer/orders/${id}/status`, { status: newStatus }); toast.success(`Order ${newStatus}`); load(); } catch { toast.error('Update failed'); }
  }

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      fd.append('step', order?.status ?? 'processing');
      await api.post(`/v1/retailer/orders/${id}/transparency-photo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Photo uploaded');
      load();
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  }

  if (loading) return <PageSkeleton />;
  if (!order) return <div className="p-6"><p className="text-gray-500">Order not found</p></div>;

  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;

  const statusActions: Record<string, { label: string; icon: typeof CheckCircle }> = {
    accepted: { label: 'Accept Order', icon: CheckCircle },
    processing: { label: 'Start Processing', icon: Cog },
    manufacturing: { label: 'Mark Manufacturing', icon: Factory },
    shipped: { label: 'Mark Shipped', icon: Truck },
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <button onClick={() => navigate('/orders')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={14} /> Back to Orders</button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Status Flow */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Order Progress</h3>
        <div className="flex items-center gap-2">
          {STATUS_FLOW.map((s, i) => {
            const done = i <= currentIdx;
            return (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{i + 1}</div>
                <span className={`text-xs font-medium capitalize ${done ? 'text-indigo-700' : 'text-gray-400'}`}>{s}</span>
                {i < STATUS_FLOW.length - 1 && <div className={`flex-1 h-0.5 ${done ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
            <h3 className="font-semibold text-gray-800">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Product:</span><span className="ml-2 text-gray-900">{order.productName}</span></div>
              <div><span className="text-gray-500">Quantity:</span><span className="ml-2 text-gray-900">{order.quantity}</span></div>
              <div><span className="text-gray-500">Total:</span><span className="ml-2 font-medium text-gray-900">${order.total?.toFixed(2)}</span></div>
              <div><span className="text-gray-500">Customer:</span><span className="ml-2 text-gray-900">{order.customerName}</span></div>
            </div>
            {order.shippingAddress && <div className="text-sm"><span className="text-gray-500">Shipping to:</span><span className="ml-2 text-gray-600">{order.shippingAddress}</span></div>}
            {order.notes && <div className="text-sm"><span className="text-gray-500">Notes:</span><span className="ml-2 text-gray-600">{order.notes}</span></div>}
          </section>

          {/* Transparency Photos */}
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Transparency Photos</h3>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800">
                <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadPhoto} />
            </div>
            {(order.transparencyPhotos ?? []).length === 0 ? (
              <div className="py-8 text-center"><Camera size={32} className="mx-auto text-gray-300 mb-2" /><p className="text-sm text-gray-400">No photos uploaded yet. Upload photos to show the manufacturing process.</p></div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {order.transparencyPhotos.map((p, i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <img src={p.url} alt={p.step} className="w-full h-32 object-cover" />
                    <div className="p-2"><p className="text-xs font-medium text-gray-700 capitalize">{p.step}</p><p className="text-xs text-gray-400">{new Date(p.timestamp).toLocaleString()}</p></div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-4">
          {nextStatus && statusActions[nextStatus] && (
            <section className="bg-white rounded-lg border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3">Actions</h3>
              <button onClick={() => updateStatus(nextStatus)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                {(() => { const A = statusActions[nextStatus].icon; return <A size={16} />; })()}
                {statusActions[nextStatus].label}
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
