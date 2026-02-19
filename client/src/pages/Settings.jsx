import React, { useRef, useState } from 'react';

import {
    Building2,
    Upload,
    Save
} from "lucide-react";
import api from '../services/api';
import { toast } from 'sonner';
import { useEffect } from 'react';



const Settings = () => {

    const [logoPreview, setLogoPreview] = useState(null);
    const fileInputRef = useRef(null);


    const [businessInfo, setBusinessInfo] = useState({
        name: "",
        gstNumber: "",
        address: "",
        phone: "",
        email: "",
    });

    const [loading, setLoading] = useState(false);



    const fetchBusinessInfo = async () => {
        try {
            const { data } = await api.get("/api/business");
            if (data.success) {
                const b = data.business;

                setBusinessInfo({
                    name: b.business_name || "",
                    gstNumber: b.gst_number || "",
                    address: b.address || "",
                    phone: b.phone || "",
                    email: b.email || "",
                });

                if (b.logo_url) {
                    setLogoPreview(b.logo_url.startsWith("http") ? b.logo_url : `http://localhost:5000${b.logo_url}`);
                }

            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load business info");
        }
    }


    const handleSaveBusiness = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("business_name", businessInfo.name);
            formData.append("address", businessInfo.address);
            formData.append("phone", businessInfo.phone);
            formData.append("gst_number", businessInfo.gstNumber);

            const file = fileInputRef.current?.files[0];
            if (file) {
                formData.append("logo", file);
            }

            const { data } = await api.put("/api/business", formData, {
                headers: {
                    "Content-Type": "multipart/form-data" // optional, can omit axios sets automatically
                }
            });

            if (data.success) {
                toast.success("Business updated successfully");

                // If new logo uploaded, update local preview with new file or returned URL
                if (data.business.logo_url) {
                    // Add a timestamp to avoid browser cache issues
                    setLogoPreview(
                        data.business.logo_url + "?t=" + new Date().getTime()
                    );
                }

                // Update other business info locally
                setBusinessInfo({
                    name: data.business.business_name || "",
                    gstNumber: data.business.gst_number || "",
                    address: data.business.address || "",
                    phone: data.business.phone || "",
                    email: data.business.email || "",
                });
            }

            console.log("Update response:", data);

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update business");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchBusinessInfo()
    }, [])

    return (
        <div className='p-6 lg:p-8 space-y-6'>
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tighter">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your business preferences
                </p>
            </div>

            {/* <div className="flex gap-2 max-w-md">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium transition
                ${activeTab === tab
                                ? "bg-primary text-zinc-700"
                                : "bg-secondary text-gray-600 hover:text-gray-500 hover:bg-primary/45"
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div> */}

            {/* business */}

            <div className="glass-card p-6 space-y-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Building2 className="h-5 w-5" />
                    Business Profile
                </h2>

                {/* Logo */}
                <div className="flex gap-6 items-center">
                    {/* Preview Box */}
                    <div className="h-24 w-24 flex items-center justify-center rounded-xl border border-dashed border-border bg-secondary overflow-hidden">
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt="Logo Preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                    </div>

                    {/* Upload Button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 rounded-xl border border-border hover:bg-secondary transition"
                    >
                        Upload Logo
                    </button>

                    {/* Hidden Input */}
                    <input
                        type="file"
                        name='logo'
                        ref={fileInputRef}
                        accept="image/png, image/jpeg"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setLogoPreview(URL.createObjectURL(file));
                        }}
                    />
                </div>



                {/* Inputs */}
                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        ["Business Name", "name"],
                        ["GST Number", "gstNumber"],
                        ["Phone", "phone"],
                        ["Email", "email"],
                    ].map(([label, key]) => (
                        <div key={key} className='space-y-1'>
                            <label className='text-sm'>{label}</label>
                            <input
                                disabled={key === "email"}
                                className="w-full px-3 py-2 rounded-lg
                         bg-white dark:bg-zinc-800
                         text-gray-900 dark:text-gray-100
                         border border-gray-300 dark:border-zinc-600
                         placeholder-gray-400 dark:placeholder-gray-500
                         placeholder: text-sm
                         focus:outline-none focus:ring-2
                         focus:ring-primary"
                                value={businessInfo[key]}
                                onChange={(e) =>
                                    setBusinessInfo({
                                        ...businessInfo,
                                        [key]: e.target.value,
                                    })
                                }
                            />
                        </div>
                    ))}

                    <div className="sm:col-span-2 space-y-1">
                        <label className="text-sm">Address</label>
                        <textarea
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg
                         bg-white dark:bg-zinc-800
                         text-gray-900 dark:text-gray-100
                         border border-gray-300 dark:border-zinc-600
                         placeholder-gray-400 dark:placeholder-gray-500
                         placeholder: text-sm
                         focus:outline-none focus:ring-2
                         focus:ring-primary"
                            value={businessInfo.address}
                            onChange={(e) =>
                                setBusinessInfo({
                                    ...businessInfo,
                                    address: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                <button onClick={handleSaveBusiness} className='relative flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-semibold transition-transform shadow-md glow-effect-hover duration-300 hover:-translate-y-1'>
                    <Save className='h-5 w-5 transition-transform duration-300 group-hover:rotate-12' />
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>



        </div>
    );
}

export default Settings;






