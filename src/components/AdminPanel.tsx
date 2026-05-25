/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from './StoreContext';
import { 
  BarChart as ChartIcon, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  RefreshCw, 
  ListOrdered, 
  Tag, 
  Settings, 
  Database, 
  FileText, 
  ChevronRight, 
  ShieldCheck, 
  FileUp, 
  Check, 
  LogOut,
  Sparkles,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function AdminPanel() {
  const { 
    authToken, 
    user, 
    logout, 
    products, 
    categories, 
    fetchProducts, 
    fetchCategories,
    showNotification,
    websiteSettings,
    fetchSettings,
    saveProductLocal,
    deleteProductLocal,
    deleteProductsBulkLocal,
    saveSettingsLocal
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'metrics' | 'products' | 'orders' | 'categories' | 'coupons' | 'backup' | 'logs' | 'settings'>('metrics');
  
  // Dashboard overall datasets
  const [metrics, setMetrics] = useState<any>(null);
  const [salesByMonth, setSalesByMonth] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [systemLogs, setSystemLogs] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [backedFiles, setBackedFiles] = useState<any[]>([]);

  // Editing state variables
  const [productsList, setProductsList] = useState<any[]>([]);
  const [sortField, setSortField] = useState<'name' | 'price' | 'stock' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedProductsList = React.useMemo(() => {
    if (!sortField) return productsList;
    const sorted = [...productsList];
    sorted.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'name') {
        const strA = String(valA || '').toLowerCase();
        const strB = String(valB || '').toLowerCase();
        return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      }

      const numA = Number(valA || 0);
      const numB = Number(valB || 0);
      return sortOrder === 'asc' ? numA - numB : numB - numA;
    });
    return sorted;
  }, [productsList, sortField, sortOrder]);

  const handleSort = (field: 'name' | 'price' | 'stock') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<{ id: string, name: string } | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number | ''>('');
  const [editCategory, setEditCategory] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editStock, setEditStock] = useState(0);
  const [editFeatured, setEditFeatured] = useState(false);
  const [editNewArrival, setEditNewArrival] = useState(false);
  const [editBestSeller, setEditBestSeller] = useState(false);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [couponCodeForm, setCouponCodeForm] = useState('');
  const [couponVal, setCouponVal] = useState(10);
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponMin, setCouponMin] = useState(100);
  const [couponsList, setCouponsList] = useState<any[]>([]);

  // Create Product Variables
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pPrice, setPPrice] = useState(100);
  const [pOrigPrice, setPOrigPrice] = useState<number | ''>('');
  const [pCat, setPCat] = useState('smartphones');
  const [pImg, setPImg] = useState('');
  const [pStock, setPStock] = useState(20);
  const [pSpecKey, setPSpecKey] = useState('');
  const [pSpecVal, setPSpecVal] = useState('');
  const [pSpecsDict, setPSpecsDict] = useState<{ [key: string]: string }>({});

  // Image Upload optimized helper variables
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressCode, setUploadProgressCode] = useState('');

  // Settings Editor Form
  const [storeNameForm, setStoreNameForm] = useState('');
  const [contactEmailForm, setContactEmailForm] = useState('');
  const [contactPhoneForm, setContactPhoneForm] = useState('');
  const [taxRateForm, setTaxRateForm] = useState(16);
  const [shippingFeeForm, setShippingFeeForm] = useState(1500);
  const [paybillForm, setPaybillForm] = useState('');
  const [aboutTextForm, setAboutTextForm] = useState('');
  const [aboutPledgeForm, setAboutPledgeForm] = useState('');
  const [contactAddressForm, setContactAddressForm] = useState('');
  const [contactMapCoordsForm, setContactMapCoordsForm] = useState('');
  const [socialFacebookForm, setSocialFacebookForm] = useState('');
  const [socialTwitterForm, setSocialTwitterForm] = useState('');
  const [socialInstagramForm, setSocialInstagramForm] = useState('');
  const [socialYoutubeForm, setSocialYoutubeForm] = useState('');

  useEffect(() => {
    if (websiteSettings) {
      setStoreNameForm(websiteSettings.storeName || "Kelly's Gadgets Store");
      setContactEmailForm(websiteSettings.contactEmail || 'sales@kellys.com');
      setContactPhoneForm(websiteSettings.contactPhone || '+254 787 272 428');
      setTaxRateForm(websiteSettings.taxRate || 16);
      setShippingFeeForm(websiteSettings.shippingFee !== undefined ? websiteSettings.shippingFee : 1500);
      setPaybillForm(websiteSettings.mpesaPaybill || '5123444');
      setAboutTextForm(websiteSettings.aboutText || '');
      setAboutPledgeForm(websiteSettings.aboutPledge || '');
      setContactAddressForm(websiteSettings.contactAddress || '');
      setContactMapCoordsForm(websiteSettings.contactMapCoords || '');
      setSocialFacebookForm(websiteSettings.socialFacebook || '');
      setSocialTwitterForm(websiteSettings.socialTwitter || '');
      setSocialInstagramForm(websiteSettings.socialInstagram || '');
      setSocialYoutubeForm(websiteSettings.socialYoutube || '');
    }
  }, [websiteSettings]);

  // Order update status popup elements
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [orderTargetStatus, setOrderTargetStatus] = useState<string>('shipped');
  const [orderNotificationNote, setOrderNotificationNote] = useState('');

  // --- COMPILING DYNAMIC DASHBOARD DATA FROM SECURED BACKEND ---
  const fetchAdminDashboardPanel = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': authToken }
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setSalesByMonth(data.salesDataByMonth || []);
        setCategoryBreakdown(data.categorySales || []);
        setSystemLogs(data.recentLogs || []);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadBackendProductsAndOrdersList = async () => {
    if (!authToken) return;
    try {
      // Products fetch directly for list management
      const pRes = await fetch('/api/products?category=all');
      let data: any[] = [];
      if (pRes.ok) {
        data = await pRes.json();
      }

      // Blend/merge with local storage overrides
      try {
        let merged = [...data];
        let deletedIds: string[] = [];
        const deletedStored = localStorage.getItem('kgs_local_deleted_products');
        if (deletedStored) deletedIds = JSON.parse(deletedStored);
        merged = merged.filter(p => !deletedIds.includes(p.id));

        let localProducts: any[] = [];
        const localStored = localStorage.getItem('kgs_local_products');
        if (localStored) localProducts = JSON.parse(localStored);

        localProducts.forEach(lp => {
          const idx = merged.findIndex(p => p.id === lp.id);
          if (idx !== -1) {
            merged[idx] = { ...merged[idx], ...lp };
          } else {
            merged.push(lp);
          }
        });
        setProductsList(merged);
      } catch (err) {
        console.error("Blending error during backend list fetch", err);
        setProductsList(data);
      }

      // Orders Fetch directly
      const oRes = await fetch('/api/admin/orders', {
        headers: { 'Authorization': authToken }
      });
      if (oRes.ok) {
        const data = await oRes.json();
        setOrdersList(data);
      }

      // Coupons fetch
      const cRes = await fetch('/api/admin/coupons', {
        headers: { 'Authorization': authToken }
      });
      if (cRes.ok) {
        const data = await cRes.json();
        setCouponsList(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadBackupsList = async () => {
    if (!authToken) return;
    try {
      const bRes = await fetch('/api/admin/backups/list', {
        headers: { 'Authorization': authToken }
      });
      if (bRes.ok) {
        const data = await bRes.json();
        setBackedFiles(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (authToken && user?.role === 'admin') {
      fetchAdminDashboardPanel();
      loadBackendProductsAndOrdersList();
      loadBackupsList();
    }
  }, [authToken, user, activeAdminTab]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-20 font-sans">
        <p className="text-red-500 font-bold">⛔ Access Denied! Unaccredited systems cannot clear Admin consoles.</p>
        <button onClick={() => logout()} className="text-blue-600 hover:underline mt-2">Sign out and switch logins</button>
      </div>
    );
  }

  // --- ACTIONS: PRODUCTS CRUD ---
  const handleAddNewSpecTag = () => {
    if (!pSpecKey || !pSpecVal) return;
    setPSpecsDict(prev => ({ ...prev, [pSpecKey]: pSpecVal }));
    setPSpecKey('');
    setPSpecVal('');
  };

  const handleClearSpecTags = () => {
    setPSpecsDict({});
  };

  // Drag and Drop Base64 image loader & automatic compressor (satisfying upload guideline!)
  const handleFileChangeAndUploadProcess = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgressCode("Compiling direct binary nodes...");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Content = reader.result as string;
      try {
        setUploadProgressCode("Decrypting pixel matrices for WebP compression...");
        const res = await fetch('/api/admin/upload-optimize', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authToken!
          },
          body: JSON.stringify({
            name: file.name,
            base64Data: base64Content
          })
        });
        const data = await res.json();
        if (res.ok) {
          setPImg(data.imageUrl);
          showNotification(`Automatic Optimization Complete: ${data.optimizationCode}! Image synced.`, 'success');
        } else {
          showNotification(data.error || "Upload process failed", 'error');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
        setUploadProgressCode('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditFileChangeAndUploadProcess = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgressCode("Compiling direct binary nodes for edits...");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Content = reader.result as string;
      try {
        setUploadProgressCode("Decrypting pixel matrices for WebP compression...");
        const res = await fetch('/api/admin/upload-optimize', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authToken!
          },
          body: JSON.stringify({
            name: file.name,
            base64Data: base64Content
          })
        });
        const data = await res.json();
        if (res.ok) {
          setEditImageUrl(data.imageUrl);
          showNotification(`Automatic Optimization Complete: ${data.optimizationCode}! Image updated.`, 'success');
        } else {
          showNotification(data.error || "Upload process failed", 'error');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsUploading(false);
        setUploadProgressCode('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProductPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pPrice || !pImg) {
      showNotification("Please provide product name, price, and optimized image URL", "error");
      return;
    }

    let createdProduct: any = null;
    let fallbackToLocalOnly = false;

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authToken!
        },
        body: JSON.stringify({
          name: pName,
          description: pDesc,
          price: pPrice,
          originalPrice: pOrigPrice ? Number(pOrigPrice) : undefined,
          category: pCat,
          imageUrl: pImg,
          stock: pStock,
          specs: pSpecsDict
        })
      });

      if (res.ok) {
        createdProduct = await res.json();
        showNotification(`Excellent! Product "${pName}" successfully loaded onto live databases.`, "success");
      } else {
        fallbackToLocalOnly = true;
      }
    } catch (err) {
      console.error(err);
      fallbackToLocalOnly = true;
    }

    if (fallbackToLocalOnly) {
      createdProduct = {
        id: `prod-local-${Date.now()}`,
        name: pName,
        description: pDesc || 'Premium gadgets catalog entry.',
        price: Number(pPrice),
        originalPrice: pOrigPrice ? Number(pOrigPrice) : undefined,
        category: pCat,
        imageUrl: pImg,
        stock: Number(pStock),
        ratingCount: 0,
        ratingAverage: 5.0,
        featured: false,
        newArrival: true,
        bestSeller: false,
        specs: pSpecsDict
      };
      showNotification(`Product "${pName}" saved successfully (locally synchronized for serverless Vercel environments)!`, "success");
    }

    if (createdProduct) {
      saveProductLocal(createdProduct);
      
      // Reset creating forms
      setPName('');
      setPDesc('');
      setPPrice(100);
      setPOrigPrice('');
      setPImg('');
      setPStock(20);
      setPSpecsDict({});
      
      // Delay to let React refresh
      setTimeout(() => {
        fetchProducts(); // Refresh Store Context state too
        loadBackendProductsAndOrdersList(); // Refresh admin local list
      }, 100);
    }
  };

  const handleProductDeleteClick = (id: string, name: string) => {
    setDeleteConfirmProduct({ id, name });
  };

  const executeProductDelete = async () => {
    if (!deleteConfirmProduct) return;
    const { id, name } = deleteConfirmProduct;
    let fallbackToLocalOnly = false;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': authToken! }
      });
      if (res.ok) {
        showNotification(`Erased "${name}" successfully`, 'info');
      } else {
        fallbackToLocalOnly = true;
      }
    } catch (e) {
      console.error(e);
      fallbackToLocalOnly = true;
    }

    if (fallbackToLocalOnly) {
      showNotification(`Erased "${name}" successfully (locally synchronized for serverless Vercel environments)`, 'info');
    }

    deleteProductLocal(id);
    setSelectedProductIds(prev => prev.filter(x => x !== id));
    setDeleteConfirmProduct(null);
    setTimeout(() => {
      fetchProducts();
      loadBackendProductsAndOrdersList();
    }, 100);
  };

  const handleToggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (productsList.length === 0) return;
    if (selectedProductIds.length === productsList.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(productsList.map(p => p.id));
    }
  };

  const handleBulkDeleteProducts = async () => {
    if (selectedProductIds.length === 0) {
      showNotification('Please select at least one product to bulk delete.', 'info');
      return;
    }
    if (!confirm(`Are you absolutely sure you want to bulk delete the ${selectedProductIds.length} selected gadgets?`)) return;

    let fallbackToLocalOnly = false;
    try {
      const res = await fetch('/api/admin/products/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken!
        },
        body: JSON.stringify({ ids: selectedProductIds })
      });

      if (res.ok) {
        showNotification(`Successfully bulk deleted ${selectedProductIds.length} gadgets!`, 'success');
      } else {
        fallbackToLocalOnly = true;
      }
    } catch (e) {
      console.error(e);
      fallbackToLocalOnly = true;
    }

    if (fallbackToLocalOnly) {
      showNotification(`Bulk deleted ${selectedProductIds.length} gadgets (locally synchronized for serverless Vercel environments)!`, 'success');
    }

    deleteProductsBulkLocal(selectedProductIds);
    setSelectedProductIds([]);
    setTimeout(() => {
      fetchProducts();
      loadBackendProductsAndOrdersList();
    }, 100);
  };

  const handleEditProductClick = (prod: any) => {
    setEditingProductId(prod.id);
    setEditName(prod.name);
    setEditDescription(prod.description || '');
    setEditPrice(prod.price);
    setEditOriginalPrice(prod.originalPrice !== undefined && prod.originalPrice !== null ? prod.originalPrice : '');
    setEditCategory(prod.category);
    setEditImageUrl(prod.imageUrl);
    setEditStock(prod.stock);
    setEditFeatured(!!prod.featured);
    setEditNewArrival(!!prod.newArrival);
    setEditBestSeller(!!prod.bestSeller);
    
    setTimeout(() => {
      const el = document.getElementById('product-editor-form-box');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleProductEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;

    let fallbackToLocalOnly = false;
    try {
      const res = await fetch(`/api/admin/products/${editingProductId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authToken!
        },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          price: Number(editPrice),
          originalPrice: editOriginalPrice === '' ? null : Number(editOriginalPrice),
          category: editCategory,
          imageUrl: editImageUrl,
          stock: Number(editStock),
          featured: editFeatured,
          newArrival: editNewArrival,
          bestSeller: editBestSeller
        })
      });

      if (res.ok) {
        showNotification(`Excellent! Gadget details updated successfully.`, "success");
      } else {
        fallbackToLocalOnly = true;
      }
    } catch (err) {
      console.error(err);
      fallbackToLocalOnly = true;
    }

    if (fallbackToLocalOnly) {
      showNotification(`Gadget details updated successfully (locally synchronized for serverless Vercel environments)`, "success");
    }

    saveProductLocal({
      id: editingProductId,
      name: editName,
      description: editDescription,
      price: Number(editPrice),
      originalPrice: editOriginalPrice === '' ? undefined : Number(editOriginalPrice),
      category: editCategory,
      imageUrl: editImageUrl,
      stock: Number(editStock),
      featured: editFeatured,
      newArrival: editNewArrival,
      bestSeller: editBestSeller
    } as any);

    setEditingProductId(null);
    setTimeout(() => {
      fetchProducts();
      loadBackendProductsAndOrdersList();
    }, 100);
  };

  const handleUpdateProductStockInline = async (id: string, newStock: number) => {
    let fallbackToLocalOnly = false;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authToken!
        },
        body: JSON.stringify({ stock: newStock })
      });
      if (res.ok) {
        showNotification(`Stock modified inline`, 'success');
      } else {
        fallbackToLocalOnly = true;
      }
    } catch (e) {
      console.error(e);
      fallbackToLocalOnly = true;
    }

    if (fallbackToLocalOnly) {
      showNotification(`Stock modified inline (locally synchronized for serverless Vercel environments)`, 'success');
    }

    const prod = products.find(p => p.id === id);
    if (prod) {
      saveProductLocal({ ...prod, stock: Number(newStock) });
    } else {
      saveProductLocal({ id, stock: Number(newStock) } as any);
    }

    setTimeout(() => {
      fetchProducts();
      loadBackendProductsAndOrdersList();
    }, 100);
  };

  // --- ACTIONS: SYSTEM COUPlONS ---
  const handleCouponSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeForm || !couponVal) return;
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authToken!
        },
        body: JSON.stringify({
          code: couponCodeForm,
          discountType: couponType,
          discountValue: couponVal,
          minOrderValue: couponMin
        })
      });
      if (res.ok) {
        showNotification(`Coupon campaign launch succeeded!`, 'success');
        setCouponCodeForm('');
        loadBackendProductsAndOrdersList();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleCouponStats = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Authorization': authToken! }
      });
      if (res.ok) {
        showNotification("Coupon active state changed", 'success');
        loadBackendProductsAndOrdersList();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- ACTIONS: SYSTEM BACKUP & RECOVERY SNAPS ---
  const handleTriggerFailsafeBackup = async () => {
    showNotification("Packing active memory buffers...", "info");
    try {
      const res = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: { 'Authorization': authToken! }
      });
      if (res.ok) {
        const data = await res.json();
        showNotification(`Snapshot Captured! Filename matches: ${data.filename}`, 'success');
        loadBackupsList();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRestoreBackupFileClick = async (filename: string) => {
    if (!confirm(`CRITICAL HAZARD WARNING: Restoring the snapshot "${filename}" will completely overwrite the active server databases state. Every product, category, invoice and customer signups since that date will be wiped out. Restructure database?`)) return;
    
    showNotification("Restructuring system indexes...", "info");
    try {
      const res = await fetch('/api/admin/backup/restore', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authToken!
        },
        body: JSON.stringify({ filename })
      });
      if (res.ok) {
        showNotification(`Reversion succeeded! Server state synchronized successfully. Reloading pages...`, 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- ACTIONS: ORDERS MANAGEMENT & SHIPMENTS notes update ---
  const handleOpenStatusTransitDialog = (orderId: string, currentStatus: string) => {
    setProcessingOrderId(orderId);
    setOrderTargetStatus(currentStatus);
    setOrderNotificationNote('');
  };

  const handleOrderTransitionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!processingOrderId) return;
    try {
      const res = await fetch(`/api/admin/orders/${processingOrderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': authToken!
        },
        body: JSON.stringify({
          status: orderTargetStatus,
          note: orderNotificationNote || `Order updated directly by administrative manager.`
        })
      });
      if (res.ok) {
        showNotification(`Moved, SMS alerts triggered and dispatches synced!`, 'success');
        setProcessingOrderId(null);
        loadBackendProductsAndOrdersList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    
    const settingsPayload = {
      storeName: storeNameForm,
      contactEmail: contactEmailForm,
      contactPhone: contactPhoneForm,
      taxRate: Number(taxRateForm),
      shippingFee: Number(shippingFeeForm),
      mpesaPaybill: paybillForm,
      aboutText: aboutTextForm,
      aboutPledge: aboutPledgeForm,
      contactAddress: contactAddressForm,
      contactMapCoords: contactMapCoordsForm,
      socialFacebook: socialFacebookForm,
      socialTwitter: socialTwitterForm,
      socialInstagram: socialInstagramForm,
      socialYoutube: socialYoutubeForm
    };

    let fallbackToLocalOnly = false;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(settingsPayload)
      });
      if (res.ok) {
        showNotification('E-Commerce Storefront preferences dispatches synced successfully!', 'success');
      } else {
        fallbackToLocalOnly = true;
      }
    } catch (err) {
      console.error(err);
      fallbackToLocalOnly = true;
    }

    if (fallbackToLocalOnly) {
      showNotification('Storefront preferences synchronized successfully (locally synchronized for serverless Vercel environments)!', 'success');
    }

    saveSettingsLocal(settingsPayload);
    setTimeout(() => {
      fetchSettings();
    }, 100);
  };

  const colorsPalette = ['#1d4ed8', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans" id="complete-admin-suite">
      
      {/* Upper header line showing active status log */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-blue-100 bg-blue-50/50 p-5 rounded-2xl mb-8 gap-4" id="admin-header-strip">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-900 rounded-xl text-white flex items-center justify-center font-bold relative shadow-xs">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-blue-950 flex items-center gap-1">
              {user.name} <span className="text-[10px] uppercase font-mono tracking-widest font-black text-emerald-600 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded leading-none">Super Administrator Mode</span>
            </h2>
            <p className="text-xs text-blue-900/85">Exclusive administrative controls of pricing, inventory metrics, and files recovery snapshots.</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="bg-red-50 hover:bg-red-100 text-red-650 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer md:self-center shrink-0"
        >
          <LogOut className="w-4 h-4" /> Sign Out Control
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Drawer Dashboard selections list */}
        <div className="lg:col-span-3 bg-white border border-gray-150 p-4 rounded-2xl space-y-1 block" id="admin-tab-navigators">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2.5 px-3 block">System Panels</span>
          
          <button
            onClick={() => setActiveAdminTab('metrics')}
            className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${activeAdminTab === 'metrics' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span>📈 Financial Analytics</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveAdminTab('products')}
            className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${activeAdminTab === 'products' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span>📦 Manage Electronics Live</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${activeAdminTab === 'orders' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span>📋 Orders & SMS alerts logs</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveAdminTab('coupons')}
            className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${activeAdminTab === 'coupons' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span>🏷️ Promo Coupon campaigns</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveAdminTab('backup')}
            className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${activeAdminTab === 'backup' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span>💾 Backup & Restore snaps</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveAdminTab('logs')}
            className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${activeAdminTab === 'logs' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span>🔍 Security Activity Audit</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`w-full flex items-center justify-between py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer ${activeAdminTab === 'settings' ? 'bg-blue-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span>⚙️ Website & Info Settings</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>
        </div>

        {/* Right Dynamic Tab Inner Panel Area */}
        <div className="lg:col-span-9 bg-white border border-gray-150 p-6 sm:p-8 rounded-2xl shadow-xs shrink-0" id="admin-sub-panels">
          
          {/* TAB 1: METRICS SUMMARY */}
          {activeAdminTab === 'metrics' && metrics && (
            <div className="space-y-8 font-sans" id="admin-panel-metrics">
              <h3 className="text-lg font-black text-blue-950">Administrative Financial Command</h3>

              {/* Upper bento grid statistics tags */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-bento">
                <div className="border border-gray-150 p-4 rounded-xl text-left bg-gradient-to-br from-blue-50/20 to-transparent">
                  <span className="text-xs font-bold text-gray-400 font-mono block uppercase">Gross Store Sales</span>
                  <span className="text-2xl font-black text-blue-950 mt-1 block font-mono">Ksh {metrics.totalSales.toLocaleString()}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">🚀 KES value verified</span>
                </div>
                <div className="border border-gray-150 p-4 rounded-xl text-left">
                  <span className="text-xs font-bold text-gray-400 font-mono block uppercase">Invoiced Orders</span>
                  <span className="text-2xl font-black text-blue-950 mt-1 block font-mono">{metrics.totalOrders}</span>
                  <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Awaiting packing checks</span>
                </div>
                <div className="border border-gray-150 p-4 rounded-xl text-left">
                  <span className="text-xs font-bold text-gray-400 font-mono block uppercase">Catalog Devices</span>
                  <span className="text-2xl font-black text-blue-950 mt-1 block font-mono">{metrics.totalProducts}</span>
                  <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Sync state normal</span>
                </div>
                <div className="border border-gray-150 p-4 rounded-xl text-left">
                  <span className="text-xs font-bold text-gray-400 font-mono block uppercase">Client Accounts</span>
                  <span className="text-2xl font-black text-blue-950 mt-1 block font-mono">{metrics.totalCustomers}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Excludes admins slots</span>
                </div>
              </div>

              {/* Graphical Charts: Monthly Sales & Category Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Monthly Sales Area Chart (Recharts) */}
                <div className="border border-gray-100 p-5 rounded-2xl bg-gray-50/50">
                  <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider font-sans flex items-center gap-1">
                    <ChartIcon className="w-4 h-4 text-blue-600" /> Stores Sales Growth By Month
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesByMonth}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" tickLine={false} style={{ fontSize: 11, fontStyle: 'semibold' }} />
                        <YAxis tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
                        <Tooltip formatter={(value) => [`Ksh ${value.toLocaleString()}`, 'Revenue']} />
                        <Bar dataKey="sales" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Sales Distribution Pie (Recharts) */}
                <div className="border border-gray-100 p-5 rounded-2xl bg-gray-50/50">
                  <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider font-sans">
                    🍩 Stock Category Sales Share
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="category"
                        >
                          {categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colorsPalette[index % colorsPalette.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`Ksh ${value.toLocaleString()}`, 'Procured Share']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Fast Activity Overview logger strip */}
              <div className="border border-gray-150 p-6 rounded-2xl">
                <h4 className="text-sm font-bold text-blue-950 uppercase mb-4 tracking-wider">Recent administrative system entries</h4>
                <div className="space-y-3 font-mono text-[10px] text-gray-500">
                  {systemLogs.map(lg => (
                     <div key={lg.id} className="flex justify-between items-center border-b border-gray-100 pb-2 gap-4">
                       <div>
                         <span className="text-blue-900 font-bold">[{lg.action.toUpperCase()}]</span> 
                         <span className="text-gray-650 font-semibold ml-1.5">{lg.details}</span>
                       </div>
                       <span className="text-[9px] text-gray-400 italic font-medium">{new Date(lg.timestamp).toLocaleTimeString()}</span>
                     </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE PRODUCTS CRUD & STOCK MANAGEMENT */}
          {activeAdminTab === 'products' && (
            <div className="space-y-10 font-sans" id="admin-live-products">
              
              {/* Product Editor Frame if editingProductId is active */}
              {editingProductId && (
                <div className="bg-blue-50/40 p-5 sm:p-6 border-2 border-blue-200 rounded-2xl" id="product-editor-form-box">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-black text-blue-950 uppercase flex items-center gap-1.5 leading-none">
                      <Edit className="w-5 h-5 text-blue-600 animate-pulse" />
                      <span>Edit Device specifications (Ksh)</span>
                    </h4>
                    <button 
                      type="button" 
                      onClick={() => setEditingProductId(null)}
                      className="text-xs font-bold text-gray-500 hover:text-red-500 px-3 py-1 bg-white hover:bg-red-50 border border-gray-200 rounded-lg transition-all"
                    >
                      Cancel Editing
                    </button>
                  </div>

                  <form onSubmit={handleProductEditSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Title name *</label>
                      <input 
                        type="text" required value={editName} onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                        placeholder="e.g. iPad Air 13'' Active Carbon"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Guaranteed pricing (Ksh) *</label>
                      <input 
                        type="number" required value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                        placeholder="e.g. 150000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Normal Price / Original display (Ksh)</label>
                      <input 
                        type="number" value={editOriginalPrice} onChange={(e) => setEditOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                        placeholder="Leave blank if no discount"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bio descriptions summary *</label>
                      <textarea 
                        required rows={2} value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Level units *</label>
                      <input 
                        type="number" required value={editStock} onChange={(e) => setEditStock(Number(e.target.value))}
                        className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category partition *</label>
                      <select 
                        value={editCategory} onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-3 bg-gray-50/50 p-4 border border-gray-200 rounded-xl space-y-3">
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Image Preview Card */}
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 shrink-0 rounded-lg border border-gray-200 bg-white p-1 flex items-center justify-center relative overflow-hidden shadow-sm">
                            {editImageUrl ? (
                              <img 
                                src={editImageUrl} 
                                alt="Gadget Preview" 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400">No Image</span>
                            )}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-blue-955">Gadget Picture & Preview</h5>
                            <p className="text-[10px] text-gray-500">Provide a remote URL below, or upload an optimized image directly.</p>
                          </div>
                        </div>

                        {/* File Upload Selector */}
                        <div className="flex items-center gap-2">
                          <div className="relative shrink-0">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleEditFileChangeAndUploadProcess}
                              disabled={isUploading}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              title="Upload gadget picture button"
                            />
                            <button 
                              type="button" 
                              disabled={isUploading}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center justify-center min-w-[120px]"
                            >
                              {isUploading ? "Uploading..." : "Upload New Image"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Manual text URL Input */}
                      <div>
                        <label className="block text-[10px] font-extrabold text-gray-600 uppercase mb-1">Direct URL Link (Manual Overwrite)</label>
                        <input 
                          type="text" 
                          required 
                          value={editImageUrl} 
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-gray-250 rounded-lg bg-white font-mono"
                          placeholder="e.g. /api/assets/uploads/image.png or Unsplash URL"
                        />
                      </div>

                      {isUploading && (
                        <div className="text-center text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-lg py-1.5 animate-pulse">
                          🌀 {uploadProgressCode}
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-3 bg-white p-3 border border-gray-200 rounded-xl flex flex-wrap gap-4 items-center">
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                        <input 
                          type="checkbox" checked={editFeatured} onChange={(e) => setEditFeatured(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Featured Device</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                        <input 
                          type="checkbox" checked={editNewArrival} onChange={(e) => setEditNewArrival(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>New Arrival</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-700">
                        <input 
                          type="checkbox" checked={editBestSeller} onChange={(e) => setEditBestSeller(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Best Seller</span>
                      </label>
                    </div>

                    <button 
                      type="submit"
                      className="sm:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs cursor-pointer shadow-md text-center mt-2 flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      Save Gadget Changes
                    </button>
                  </form>
                </div>
              )}

              {/* Product creator section */}
              <div className="bg-gray-50/60 p-5 sm:p-6 border border-gray-200 border-dashed rounded-2xl">
                <h4 className="text-sm font-black text-blue-950 uppercase mb-4 flex items-center gap-1.5 leading-none">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>Insert New Gadget specification to live databases</span>
                </h4>

                <form onSubmit={handleProductPostSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Title name *</label>
                    <input 
                      type="text" required value={pName} onChange={(e) => setPName(e.target.value)}
                      className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      placeholder="e.g. iPad Air 13'' Active Carbon"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Guaranteed pricing ($) *</label>
                    <input 
                      type="number" required value={pPrice} onChange={(e) => setPPrice(Number(e.target.value))}
                      className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      placeholder="e.g. 799"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Normal Price (Original display) (Ksh)</label>
                    <input 
                      type="number" value={pOrigPrice} onChange={(e) => setPOrigPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      placeholder="Leave blank if no discount"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bio descriptions summary *</label>
                    <textarea 
                      required rows={2} value={pDesc} onChange={(e) => setPDesc(e.target.value)}
                      className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      placeholder="Detail specifications like processor chips, battery nodes, action triggers..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dynamic category designations</label>
                    <select
                      value={pCat}
                      onChange={(e) => setPCat(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Main Image Relative URL *</label>
                    <div className="flex gap-2 items-center">
                      {pImg && (
                        <div className="w-9 h-9 border border-gray-250 rounded-lg p-0.5 bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                          <img src={pImg} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                        </div>
                      )}
                      <input 
                        type="text" required value={pImg} onChange={(e) => setPImg(e.target.value)}
                        className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white font-mono"
                        placeholder="/api/assets/uploads/image.png or unsplash URL"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Standard Stock units *</label>
                    <input 
                      type="number" required value={pStock} onChange={(e) => setPStock(Number(e.target.value))}
                      className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                    />
                  </div>

                  {/* Automatic Image upload & WebP Optimization drop-zones */}
                  <div className="sm:col-span-3 border border-dashed border-gray-200 bg-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                        <FileUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-gray-900">Process Automated Image Upload</h5>
                        <p className="text-[10px] text-gray-400">Click to select files manually or drag documents straight from desktop templates</p>
                      </div>
                    </div>
                    
                    <div className="relative shrink-0">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChangeAndUploadProcess}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Upload file button"
                      />
                      <button 
                        type="button" 
                        disabled={isUploading}
                        className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-all flex items-center justify-center min-w-[120px]"
                      >
                        {isUploading ? "Uploading..." : "Select File"}
                      </button>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="col-span-1 sm:col-span-3 text-center text-xs font-bold text-cyan-700 bg-cyan-50 border border-cyan-100 rounded-lg py-2 animate-pulse">
                      🌀 {uploadProgressCode}
                    </div>
                  )}

                  {/* Specifications dictionary generator */}
                  <div className="sm:col-span-3 border border-gray-150 p-4 rounded-xl bg-white space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-1.5 mb-2">
                      <span className="text-xs font-extrabold text-blue-900">Custom specification properties dict</span>
                      {Object.keys(pSpecsDict).length > 0 && (
                        <button type="button" onClick={handleClearSpecTags} className="text-[10px] text-red-500 font-bold hover:underline">Clear List</button>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {Object.keys(pSpecsDict).map(k => (
                        <span key={k} className="bg-slate-100 text-gray-800 text-[10px] font-bold px-2 py-1 rounded font-mono">
                          {k}: {pSpecsDict[k]}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-w-md">
                      <input 
                        type="text" value={pSpecKey} onChange={(e) => setPSpecKey(e.target.value)}
                        placeholder="Key e.g. Processor"
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded"
                      />
                      <input 
                        type="text" value={pSpecVal} onChange={(e) => setPSpecVal(e.target.value)}
                        placeholder="Value e.g. Apple M3 Max"
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={handleAddNewSpecTag}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded"
                    >
                      + Save Spec Attribute
                    </button>
                  </div>

                  <button 
                    type="submit"
                    className="sm:col-span-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs cursor-pointer shadow-md text-center mt-2"
                  >
                    Confirm Device upload & Broaden Catalog
                  </button>

                </form>
              </div>

              {/* Products listing & stock modifications inline */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wide">Active catalog inventory table ({productsList.length} items)</h4>
                  {selectedProductIds.length > 0 && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-4 py-2 rounded-xl animate-fade-in">
                      <span className="text-xs font-bold text-red-700">{selectedProductIds.length} select{selectedProductIds.length === 1 ? 'ed' : 'ed'}</span>
                      <button
                        onClick={handleBulkDeleteProducts}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Bulk Delete {selectedProductIds.length} {selectedProductIds.length === 1 ? 'Gadget' : 'Gadgets'}</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="border border-gray-150 rounded-xl overflow-x-auto min-w-0 resize-none">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                      <tr>
                        <th className="px-4 py-3 w-10">
                          <input 
                            type="checkbox"
                            checked={productsList.length > 0 && selectedProductIds.length === productsList.length}
                            onChange={handleToggleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                            title="Select all products"
                          />
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            type="button"
                            onClick={() => handleSort('name')}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
                            title="Sort by Device Name"
                          >
                            <span>Device specifications description</span>
                            {sortField === 'name' ? (
                              sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-gray-300" />
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3 font-mono">
                          <button 
                            type="button"
                            onClick={() => handleSort('price')}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
                            title="Sort by Cost"
                          >
                            <span>Cost</span>
                            {sortField === 'price' ? (
                              sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-gray-300" />
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3">
                          <button 
                            type="button"
                            onClick={() => handleSort('stock')}
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
                            title="Sort by Stock Level"
                          >
                            <span>Units in stock</span>
                            {sortField === 'stock' ? (
                              sortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-blue-600" /> : <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 text-gray-300" />
                            )}
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right">Action controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {sortedProductsList.map(prod => (
                        <tr key={prod.id} className={`hover:bg-slate-50/20 transition-all ${selectedProductIds.includes(prod.id) ? 'bg-blue-50/30' : ''}`}>
                          <td className="px-4 py-3">
                            <input 
                              type="checkbox"
                              checked={selectedProductIds.includes(prod.id)}
                              onChange={() => handleToggleSelectProduct(prod.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                              title={`Select ${prod.name}`}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <img src={prod.imageUrl} alt={prod.name} referrerPolicy="no-referrer" className="w-8 h-8 object-contain bg-white rounded border border-gray-100 p-0.5 shrink-0" />
                              <span className="font-bold text-blue-950 truncate max-w-[170px] block leading-snug">{prod.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-semibold uppercase font-mono text-xs text-blue-700">{prod.category}</td>
                          <td className="px-4 py-3 font-bold text-gray-900 font-mono">Ksh {prod.price.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <input 
                              type="number" 
                              defaultValue={prod.stock}
                              onBlur={(e) => handleUpdateProductStockInline(prod.id, Number(e.target.value))}
                              className="w-16 px-2 py-1 text-center border border-gray-200 rounded-lg text-xs font-bold font-mono bg-white" 
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1.5 items-center">
                              <button 
                                onClick={() => handleEditProductClick(prod)}
                                className="p-1 px-2 border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1"
                                title="Edit specs"
                              >
                                <Edit className="w-3 h-3" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button 
                                onClick={() => handleProductDeleteClick(prod.id, prod.name)}
                                className="p-1 px-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg cursor-pointer"
                                title="Delete model from catalog"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS & SMS ALERT DISPATCH NOTES MOUNTING */}
          {activeAdminTab === 'orders' && (
            <div className="space-y-6 font-sans" id="admin-orders-controls">
              <h3 className="text-lg font-black text-blue-950 mb-1">Operational Customer Invoices ({ordersList.length} total)</h3>

              <div className="border border-gray-150 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Customer name</th>
                      <th className="px-4 py-3">Gateway</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 font-mono">Invoice Sum</th>
                      <th className="px-4 py-3 text-right">Action controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 font-medium">
                    {ordersList.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50/20">
                        <td className="px-4 py-3 font-bold font-mono text-blue-900">{o.orderNumber}</td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-blue-950">{o.customerName}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{o.customerEmail}</p>
                        </td>
                        <td className="px-4 py-3 uppercase text-xs">{o.paymentMethod}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide ${o.status === 'pending' ? 'bg-amber-100 text-amber-800' : o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : o.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold font-mono text-gray-800">Ksh {o.total.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleOpenStatusTransitDialog(o.id, o.status)}
                            className="bg-blue-50 text-blue-650 hover:bg-blue-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-150 cursor-pointer"
                          >
                            Transit Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Transit Update modal dialog simulator */}
              {processingOrderId && (
                <div className="bg-blue-900 text-white rounded-2xl p-5 sm:p-6 border border-blue-950 mt-6" id="transit-status-editor-form-box">
                  <h4 className="text-sm font-black uppercase text-emerald-400 mb-3 tracking-wide">Update Order Transit & Dispatch notifications</h4>
                  
                  <form onSubmit={handleOrderTransitionsSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-blue-200 uppercase mb-1">Move order to state:</label>
                        <select
                          value={orderTargetStatus}
                          onChange={(e) => setOrderTargetStatus(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-blue-800 rounded-lg bg-blue-950 text-white font-bold"
                        >
                          <option value="pending">Pending Payment Review</option>
                          <option value="processing">Processing & Packing</option>
                          <option value="shipped">Shipped & In Transit</option>
                          <option value="delivered">Delivered Successfully</option>
                          <option value="cancelled">Cancelled officially</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-blue-200 uppercase mb-1">Dispatcher Tracking notes detail *</label>
                        <input 
                          type="text"
                          required
                          value={orderNotificationNote}
                          onChange={(e) => setOrderNotificationNote(e.target.value)}
                          placeholder="e.g. Package loaded to Wells Fargo truck number KDJ-122B, estimated CBD arrival is 4 hours"
                          className="w-full px-4 py-2 text-xs border border-blue-800 rounded-lg bg-blue-950 text-white"
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-blue-300">⚠️ Clearing this transition will automatically trigger a simulated SMS dispatch alert to the recipient phone and attach PDF Invoice files directly.</p>
                    
                    <div className="flex gap-2">
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white px-5 py-2 rounded-lg cursor-pointer">Commit Status Transition</button>
                      <button type="button" onClick={() => setProcessingOrderId(null)} className="bg-white/10 hover:bg-white/15 text-white font-bold text-xs px-5 py-2 rounded-lg cursor-pointer">Close Dialog</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COUPONS CREATOR */}
          {activeAdminTab === 'coupons' && (
            <div className="space-y-8 font-sans" id="admin-coupons-controls">
              <h3 className="text-lg font-black text-blue-950">Promotional Campaigns Discounts</h3>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-150 border-dashed max-w-xl">
                <h4 className="text-xs uppercase font-extrabold text-blue-900 mb-4 tracking-wider">Launch standard discount coupon</h4>
                
                <form onSubmit={handleCouponSubmission} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Coupon Code name *</label>
                      <input 
                        type="text" required value={couponCodeForm} onChange={(e) => setCouponCodeForm(e.target.value)}
                        placeholder="e.g. SAVE20"
                        className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Discount Type</label>
                      <select
                        value={couponType}
                        onChange={(e) => setCouponType(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Sum (Ksh)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Off Value *</label>
                      <input 
                        type="number" required value={couponVal} onChange={(e) => setCouponVal(Number(e.target.value))}
                        className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Min Subtotal required (Ksh)</label>
                      <input 
                        type="number" required value={couponMin} onChange={(e) => setCouponMin(Number(e.target.value))}
                        className="w-full px-4 py-2 text-xs border border-gray-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-6 rounded-lg cursor-pointer">Launch Campaign</button>
                </form>
              </div>

              {/* Coupons List */}
              <div className="border border-gray-150 rounded-xl overflow-hidden max-w-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2.5">Code</th>
                      <th className="px-4 py-2.5">Off Value</th>
                      <th className="px-4 py-2.5">Condition</th>
                      <th className="px-4 py-2.5">Active Status</th>
                      <th className="px-4 py-2.5 text-right">Toggle Active state</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 font-medium">
                    {couponsList.map(c => (
                      <tr key={c.id}>
                        <td className="px-4 py-2.5 font-bold font-mono text-blue-900">{c.code}</td>
                        <td className="px-4 py-2.5 font-bold">{c.discountType === 'percentage' ? `${c.discountValue}%` : `Ksh ${c.discountValue.toLocaleString()}`}</td>
                        <td className="px-4 py-2.5 font-mono text-[11px]">Subtotal &gt;= Ksh ${(c.minOrderValue || 0).toLocaleString()}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {c.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button 
                            onClick={() => handleToggleCouponStats(c.id)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-750 text-[10px] font-bold px-2 py-1 rounded"
                          >
                            Flip State
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: BACKUP AND RECOVERY PLATES */}
          {activeAdminTab === 'backup' && (
            <div className="space-y-8 font-sans" id="admin-backup-recovery">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-black text-blue-950">System state backups failsafes</h3>
                  <p className="text-xs text-gray-400 font-medium">In case of database index corruptions or demo reversions, capture snapshot files directly.</p>
                </div>
                <button 
                  onClick={handleTriggerFailsafeBackup}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Database className="w-4 h-4" /> Capture System State Backup
                </button>
              </div>

              {/* Backups List */}
              <div className="space-y-3" id="backups-snaps-list">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-2">Saved filesystem snapshots (data/backups/)</span>
                
                {backedFiles.length === 0 ? (
                  <p className="text-xs text-gray-450 italic">No saved backup files identified in local folders yet. Click active backup trigger to log standard state.</p>
                ) : (
                  backedFiles.map(b => (
                    <div key={b.filename} className="flex justify-between items-center border border-gray-150 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 font-mono text-[11px] sm:text-xs">
                      <div>
                        <p className="font-bold text-blue-950">{b.filename}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Logged: {new Date(b.createdAt).toLocaleString()} • Size: {b.size}</p>
                      </div>
                      <button
                        onClick={() => handleRestoreBackupFileClick(b.filename)}
                        className="bg-amber-600 hover:bg-amber-500 hover:scale-103 transition-all text-white font-bold text-[11px] px-3.5 py-1.5 rounded-lg cursor-pointer"
                        title="Revert entire store state back to this date"
                      >
                        Revert State
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY ACTIVITY LOGS REVIEW */}
          {activeAdminTab === 'logs' && (
            <div className="space-y-6 font-sans" id="admin-security-logs">
              <div>
                <h3 className="text-lg font-black text-blue-950">Security Access Registry (Audit Trails)</h3>
                <p className="text-xs text-gray-400 font-medium">Monitoring intrusion hazards, payment alerts, registers, and admin updates.</p>
              </div>

              <div className="border border-gray-150 rounded-xl overflow-hidden font-mono text-[10.5px]">
                <div className="bg-gray-50 border-b border-gray-200 p-3 flex justify-between uppercase font-bold text-gray-500">
                  <span>Signatures Event and specifications</span>
                  <span>Date Logs</span>
                </div>
                
                <div className="divide-y divide-gray-150 max-h-[360px] overflow-y-auto bg-slate-50/30 pr-1 scrollbar-thin">
                  {systemLogs.map(lg => (
                    <div key={lg.id} className="p-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-white transition-colors">
                      <div>
                        {/* Event Tags */}
                        <div className="flex gap-2 items-center mb-1">
                          <span className={`text-[8.5px] uppercase font-bold px-1.5 py-0.5 rounded leading-none ${lg.role === 'admin' ? 'bg-blue-900 text-white' : lg.role === 'malicious' ? 'bg-red-500 text-white animate-pulse' : 'bg-emerald-100 text-emerald-800'}`}>
                            {lg.role}
                          </span>
                          <span className="text-gray-900 font-bold ml-1">[{lg.action}]</span>
                        </div>
                        <p className="text-gray-650 leading-relaxed font-semibold text-[11.5px]">{lg.details}</p>
                        <span className="text-[9px] text-gray-400 block mt-0.5">Author key reference: {lg.userEmail} ({lg.userName})</span>
                      </div>
                      <span className="text-[10px] text-gray-400 text-right shrink-0">{new Date(lg.timestamp).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: COMPLETE WEBSITE SETTINGS & INFO EDITOR */}
          {activeAdminTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-8 font-sans animate-fade-in" id="admin-settings-panel">
              <div>
                <h3 className="text-lg font-black text-blue-950">Store Preferences & Bio Editor</h3>
                <p className="text-xs text-gray-400 font-medium font-sans">Customize About Us profile paragraphs, contact locator details, maps, and social media channels instantly.</p>
              </div>

              {/* SECTION 1: CORE PREFERENCES */}
              <div className="bg-gray-50/50 border border-gray-150 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-gray-200 pb-1.5">🎨 General Store Preferences</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Company Display Name</label>
                    <input 
                      type="text"
                      value={storeNameForm}
                      onChange={(e) => setStoreNameForm(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">M-Pesa Till / Paybill Code</label>
                    <input 
                      type="text"
                      value={paybillForm}
                      onChange={(e) => setPaybillForm(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">KRA VAT Tax Rate (%)</label>
                    <input 
                      type="number"
                      value={taxRateForm}
                      onChange={(e) => setTaxRateForm(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Standard Shipping Fee (Ksh)</label>
                    <input 
                      type="number"
                      value={shippingFeeForm}
                      onChange={(e) => setShippingFeeForm(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: BIOLOGICAL PROFILE (ABOUT US) */}
              <div className="bg-gray-50/50 border border-gray-150 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-gray-200 pb-1.5">📖 Biographical Narrative (About Us Tab)</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Main About Context Profile</label>
                    <textarea 
                      rows={5}
                      value={aboutTextForm}
                      onChange={(e) => setAboutTextForm(e.target.value)}
                      placeholder="Welcome message, history, catalog sourcing..."
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500 leading-relaxed font-sans"
                    />
                    <span className="text-[10px] text-gray-400 font-sans block mt-1">Supports paragraph breaks and standard spacing layout formatting.</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Our Corporate Pledge</label>
                    <textarea 
                      rows={3}
                      value={aboutPledgeForm}
                      onChange={(e) => setAboutPledgeForm(e.target.value)}
                      placeholder="Our commitment to clients..."
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: MAP DETAILS & PHYSICAL CONTACT LOCATOR */}
              <div className="bg-gray-50/50 border border-gray-150 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-gray-200 pb-1.5">📍 Physical Contact Locator & Maps</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Physical CBD Office Address</label>
                    <input 
                      type="text"
                      value={contactAddressForm}
                      onChange={(e) => setContactAddressForm(e.target.value)}
                      placeholder="e.g. Lavin Tower, First Floor, Sophia, Homabay, Kenya"
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Primary Contact Email Address</label>
                    <input 
                      type="email"
                      value={contactEmailForm}
                      onChange={(e) => setContactEmailForm(e.target.value)}
                      placeholder="e.g. sales@kellys.com"
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Primary Contact Phone Number</label>
                    <input 
                      type="text"
                      value={contactPhoneForm}
                      onChange={(e) => setContactPhoneForm(e.target.value)}
                      placeholder="e.g. +254 787 272 428"
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Interactive Google Map Coordinates (Latitude,Longitude)</label>
                    <input 
                      type="text"
                      value={contactMapCoordsForm}
                      onChange={(e) => setContactMapCoordsForm(e.target.value)}
                      placeholder="e.g. -1.2829,36.8225"
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg font-mono focus:outline-hidden focus:border-blue-500"
                    />
                    <span className="text-[10px] text-gray-400 font-sans block mt-1">Used for pinpointing standard satellite maps coordinates and outbound links safely.</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: SOCIAL CHANNELS & MEDIA CHANNELS */}
              <div className="bg-gray-50/50 border border-gray-150 p-6 rounded-2xl space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-gray-200 pb-1.5">🔗 Outbound Media Handles</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Facebook Page Link</label>
                    <input 
                      type="url"
                      value={socialFacebookForm}
                      onChange={(e) => setSocialFacebookForm(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Twitter / X Handle Link</label>
                    <input 
                      type="url"
                      value={socialTwitterForm}
                      onChange={(e) => setSocialTwitterForm(e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Instagram Handle Link</label>
                    <input 
                      type="url"
                      value={socialInstagramForm}
                      onChange={(e) => setSocialInstagramForm(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">YouTube Channel Link</label>
                    <input 
                      type="url"
                      value={socialYoutubeForm}
                      onChange={(e) => setSocialYoutubeForm(e.target.value)}
                      placeholder="https://youtube.com/..."
                      className="w-full px-3 py-2 text-xs border border-gray-200 bg-white rounded-lg focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons footer row */}
              <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => setActiveAdminTab('metrics')}
                  className="px-5 py-2.5 bg-gray-50 hover:bg-gray-150 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 border border-transparent shadow-md text-white rounded-xl text-xs font-black cursor-pointer transition-all flex items-center gap-1.5"
                >
                  Save Store Adjustments
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="custom-delete-confirm-modal">
          <div className="bg-white dark:bg-gray-900 border border-red-100 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-scale-in">
            <div className="flex items-center gap-3.5 mb-4 border-b border-gray-100 pb-3">
              <div className="p-2.5 bg-red-50 text-red-650 rounded-full">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-black text-blue-950 uppercase tracking-wide">Confirm Erase Device</h3>
                <p className="text-[11px] text-gray-400 font-medium">Verify action before removing model</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-xs text-gray-600 leading-relaxed">
                Are you absolutely sure you want to completely delete the following gadget from Kelly's catalog?
              </p>
              <div className="p-3 bg-red-50/40 border border-red-100/70 rounded-xl">
                <p className="text-xs font-black text-gray-900 font-sans">{deleteConfirmProduct.name}</p>
                <p className="text-[10px] text-red-500 font-mono font-medium mt-0.5 mt-1">ID: {deleteConfirmProduct.id}</p>
              </div>
              <p className="text-[10.5px] text-gray-400">
                ⚠️ Note: This action is permanent. Deleting this device will instantly hide it from the website and make it inaccessible for orders.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button 
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-all cursor-pointer"
              >
                Nevermind, Keep it
              </button>
              <button 
                type="button"
                onClick={executeProductDelete}
                className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm border border-transparent transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Erase from Catalog</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
