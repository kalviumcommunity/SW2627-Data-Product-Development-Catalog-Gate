import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { uploadCatalogFile } from "../../lib/api/catalogApi";
import { ApiError } from "../../lib/api/client";
import VendorAppFooter from "./VendorAppFooter";

export default function VendorUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Vendor";

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    console.log("handleDrop called");
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log("File dropped:", e.dataTransfer.files[0].name);
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    console.log("handleFileSelect called");
    console.log("Files selected:", e.target.files);
    if (e.target.files && e.target.files[0]) {
      console.log("Selected file:", e.target.files[0].name);
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    console.log("validateAndSetFile called with:", selectedFile.name);
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    
    console.log("File extension:", fileExtension);
    
    if (!validExtensions.includes(fileExtension)) {
      console.log("Invalid file extension");
      setError("Invalid file type. Please upload CSV, XLSX, or XLS files.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      console.log("File too large");
      setError("File size exceeds 50MB limit.");
      setFile(null);
      return;
    }

    console.log("File validation passed");
    setError("");
    setFile(selectedFile);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    console.log("handleUpload called");
    console.log("Current file state:", file);
    
    if (!file) {
      console.log("No file selected");
      setError("Please select a file to upload.");
      return;
    }

    console.log("Starting upload process");
    setUploading(true);
    setError("");

    try {
      console.log("Calling uploadCatalogFile");
      const response = await uploadCatalogFile(file);
      console.log("Upload response:", response);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/vendor");
      }, 2000);
    } catch (err) {
      console.error("Upload error:", err);
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to upload catalog. Please try again.";
      setError(message);
    } finally {
      console.log("Upload process completed");
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col antialiased">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-[#10b981] text-white px-6 py-3 rounded-[8px] text-sm font-semibold shadow-lg flex items-center gap-2 animate-bounce">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Catalog uploaded successfully!
        </div>
      )}

      <main className="flex-1 px-8 pt-6 pb-6 max-w-[1280px] w-full mx-auto flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748b] mb-1">
              <span>Vendor Dashboard</span>
              <span>/</span>
              <span>Upload Catalog</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">
              Ingest <strong className="font-bold text-[#7aa0ff]">Catalog</strong>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Profile Card */}
            <div className="flex items-center gap-2.5">
              <div className="text-right leading-tight">
                <div className="text-[0.775rem] font-bold text-[#1e293b]">{user?.email || "user@example.com"}</div>
                <div className="text-[0.65rem] font-semibold text-[#64748b] uppercase tracking-wider">
                  Vendor
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#7aa0ff]/20 shadow-xs"
              />
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate("/vendor")}
              className="px-3 py-2 border border-[#e2e8f0] hover:bg-slate-100 text-[#64748b] text-xs font-semibold rounded-[6px] bg-white transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Upload Card */}
        <div className="bg-white border border-[#e2e8f0] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-8">
          <div 
            className={`upload-dropzone ${dragActive ? 'dragover' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <div className="dropzone-inner">
              <div className="icon-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <h3>Select or Drop catalog spreadsheet</h3>
              <p className="formats-text">Supports CSV, XLSX, or XLS files (up to 50MB)</p>
              
              <div className="manual-upload">
                <button 
                  type="button"
                  className="btn-browse"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBrowseClick();
                  }}
                >
                  Browse Files
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-rose-50 border border-rose-200 rounded-[8px] p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Selected File */}
          {file && (
            <div className="mt-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[8px] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7aa0ff]/10 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#7aa0ff]">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#1e293b]">{file.name}</div>
                    <div className="text-xs text-[#64748b]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[#64748b] hover:text-[#ef4444] transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {file && (
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-[#e2e8f0] hover:bg-slate-100 text-[#64748b] text-xs font-semibold rounded-[6px] bg-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="bg-[#7aa0ff] hover:bg-[#5c85fa] text-white font-semibold px-6 py-2 text-xs rounded-[6px] shadow-[0_1px_3px_rgba(122,160,255,0.2)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Upload Catalog"}
              </button>
            </div>
          )}
        </div>
      </main>

      <VendorAppFooter />

      <style jsx>{`
        .upload-dropzone {
          border: 2px dashed #e2e8f0;
          border-radius: 14px;
          padding: 3rem 2rem;
          text-align: center;
          background-color: #f8fafc;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upload-dropzone:hover {
          border-color: #7aa0ff;
          background-color: rgba(122, 160, 255, 0.02);
        }

        .upload-dropzone.dragover {
          border-color: #7aa0ff;
          background-color: rgba(122, 160, 255, 0.05);
        }

        .dropzone-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background-color: rgba(122, 160, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7aa0ff;
        }

        .dropzone-inner h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .formats-text {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .manual-upload {
          margin-top: 0.5rem;
        }

        .btn-browse {
          background-color: #7aa0ff;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          padding: 0.65rem 1.5rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .btn-browse:hover {
          background-color: #5c85fa;
        }
      `}</style>
    </div>
  );
}