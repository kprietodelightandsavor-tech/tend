import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const SEASONS = ["spring", "summer", "fall", "winter"];

function getSeason() {
  const month = new Date().getMonth();
  if ((month >= 2 && month <= 4)) return "spring";
  if ((month >= 5 && month <= 7)) return "summer";
  if ((month >= 8 && month <= 10)) return "fall";
  return "winter";
}

function getSchoolYear() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  return month >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

export default function MemoryBookScreen({ settings, onNavigate }) {
  const userId = settings?.userId;
  const [view, setView] = useState("grid"); // grid or timeline
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Filters
  const [selectedSeason, setSelectedSeason] = useState(getSeason());
  const [selectedYear, setSelectedYear] = useState(getSchoolYear());
  const [years, setYears] = useState([getSchoolYear()]);

  // Upload state
  const [uploadCaption, setUploadCaption] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const cameraRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (userId) {
      loadMemoryBook();
    }
  }, [userId]);

  const loadMemoryBook = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("memory_book")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setImages(data || []);

      // Collect unique school years for filter dropdown
      const uniqueYears = [...new Set((data || []).map(img => img.school_year))];
      setYears(uniqueYears.length > 0 ? uniqueYears : [getSchoolYear()]);
    } catch (err) {
      console.error("Error loading memory book:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
      setShowUploadForm(true);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
      setShowCamera(true);
      setTimeout(() => {
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please use file upload instead.");
    }
  };

  const capturePhoto = () => {
    if (!cameraRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = cameraRef.current.videoWidth;
    canvas.height = cameraRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(cameraRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
      setPreviewFile(file);
      setPreviewUrl(canvas.toDataURL());
      setShowUploadForm(true);
      stopCamera();
    });
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const generateCaption = async () => {
  if (!previewUrl) return;

  try {
    setGeneratingCaption(true);

    // Compress image to stay under Claude's 5 MB limit
    const compressedDataUrl = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDimension = 1568; // Claude's recommended max
        let { width, height } = img;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = previewUrl;
    });

    const base64Image = compressedDataUrl.split(",")[1];

    const response = await fetch("https://tend-ds.netlify.app/.netlify/functions/anthropic-api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-opus-4-6",
        max_tokens: 150,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: base64Image,
                },
              },
              {
                type: "text",
                text: "Write a beautiful, poetic one-sentence caption for this memory from a Charlotte Mason homeschool year. Focus on the moment, the beauty, or what was learned. Keep it under 20 words.",
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Caption API error:", data);
      alert(`Caption error: ${data.error || response.statusText}`);
      return;
    }

    const caption = data.content?.[0]?.text || "";
    setUploadCaption(caption);
  } catch (err) {
    console.error("Error generating caption:", err);
    alert(`Could not generate caption: ${err.message}`);
  } finally {
    setGeneratingCaption(false);
  }
};
    const data = await response.json();

    // Surface the real error so we can see what's actually wrong
    if (!response.ok || data.error) {
      console.error("Caption API error:", data);
      alert(`Caption error: ${data.error || response.statusText}`);
      return;
    }

    const caption = data.content?.[0]?.text || "";
    setUploadCaption(caption);
  } catch (err) {
    console.error("Error generating caption:", err);
    alert(`Could not generate caption: ${err.message}`);
  } finally {
    setGeneratingCaption(false);
  }
};
    

  const handleUpload = async () => {
    if (!userId || !previewFile) return;

    try {
      setUploading(true);

      // Upload image to Supabase Storage
      const fileName = `${userId}/${Date.now()}-${previewFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("memory-book-images")
        .upload(fileName, previewFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("memory-book-images")
        .getPublicUrl(fileName);

      // Save record to database
      const { error: dbError } = await supabase.from("memory_book").insert([
        {
          user_id: userId,
          image_url: publicUrl.publicUrl,
          caption: uploadCaption || null,
          season: selectedSeason,
          school_year: selectedYear,
          created_at: new Date().toISOString(),
        },
      ]);

      if (dbError) throw dbError;

      // Reload and reset form
      await loadMemoryBook();
      setPreviewFile(null);
      setPreviewUrl(null);
      setUploadCaption("");
      setShowUploadForm(false);
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!confirm("Delete this memory?")) return;

    try {
      const { error } = await supabase.from("memory_book").delete().eq("id", id).eq("user_id", userId);

      if (error) throw error;

      await loadMemoryBook();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  // Filter images
  const filteredImages = images.filter(
    img => img.season === selectedSeason && img.school_year === selectedYear
  );

  return (
    <div className="screen">
      <p className="eyebrow" style={{ marginBottom: 6 }}>Delight & Savor</p>
      <h1 className="display serif" style={{ marginBottom: 8 }}>Memory Book</h1>
      <p className="corm italic" style={{ fontSize: 15, color: "var(--ink-faint)", marginBottom: 24, lineHeight: 1.6 }}>
        Recall the year in images. A visual journal of beauty and growth.
      </p>

      {/* Upload Section */}
      {!showUploadForm && !showCamera && (
        <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 4, padding: "16px", marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 12 }}>
            Add a Memory
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                flex: 1,
                background: "var(--sage)",
                color: "white",
                border: "none",
                borderRadius: 3,
                padding: "12px",
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}>
              📸 Upload Photo
            </button>
            <button
              onClick={startCamera}
              style={{
                flex: 1,
                background: "var(--sage)",
                color: "white",
                border: "none",
                borderRadius: 3,
                padding: "12px",
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}>
              📷 Take Photo
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
        </div>
      )}

      {/* Camera View */}
      {showCamera && (
        <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 4, padding: "16px", marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 12 }}>
            Camera
          </p>
          <video
            ref={cameraRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              borderRadius: 3,
              marginBottom: 12,
              backgroundColor: "var(--rule)",
            }}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={capturePhoto}
              style={{
                flex: 1,
                background: "var(--sage)",
                color: "white",
                border: "none",
                borderRadius: 3,
                padding: "10px",
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}>
              Capture
            </button>
            <button
              onClick={stopCamera}
              style={{
                flex: 1,
                background: "none",
                border: "1px solid var(--sage)",
                borderRadius: 3,
                padding: "10px",
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--sage)",
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Form */}
      {showUploadForm && previewUrl && (
        <div style={{ background: "var(--sage-bg)", border: "1px solid var(--sage-md)", borderRadius: 4, padding: "16px", marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontFamily: "'Lato', sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 12 }}>
            Add Caption & Save
          </p>

          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: "100%", borderRadius: 3, marginBottom: 12 }}
          />

          <textarea
            placeholder="Write a caption... (or use AI)"
            value={uploadCaption}
            onChange={e => setUploadCaption(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 10,
              border: "1px solid var(--rule)",
              borderRadius: 3,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 12,
              minHeight: 50,
              outline: "none",
              resize: "vertical",
            }}
          />

          <button
            onClick={generateCaption}
            disabled={generatingCaption}
            style={{
              width: "100%",
              background: "none",
              border: "1px solid var(--sage)",
              borderRadius: 3,
              padding: "8px",
              marginBottom: 10,
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
              fontSize: 10,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--sage)",
              opacity: generatingCaption ? 0.6 : 1,
            }}>
            {generatingCaption ? "Generating..." : "✨ Generate Caption with AI"}
          </button>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <select
              value={selectedSeason}
              onChange={e => setSelectedSeason(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid var(--rule)",
                borderRadius: 3,
                fontFamily: "'Lato', sans-serif",
                fontSize: 11,
                outline: "none",
              }}>
              {SEASONS.map(s => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid var(--rule)",
                borderRadius: 3,
                fontFamily: "'Lato', sans-serif",
                fontSize: 11,
                outline: "none",
              }}>
              {years.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleUpload}
              disabled={uploading}
              style={{
                flex: 1,
                background: "var(--sage)",
                color: "white",
                border: "none",
                borderRadius: 3,
                padding: "10px",
                fontFamily: "'Lato', sans-serif",
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                cursor: uploading ? "wait" : "pointer",
                opacity: uploading ? 0.7 : 1,
              }}>
              {uploading ? "Saving..." : "Save Memory"}
            </button>
            <button
              onClick={() => {
                setShowUploadForm(false);
                setPreviewFile(null);
                setPreviewUrl(null);
                setUploadCaption("");
              }}
              style={{
                flex: 1,
                background: "none",
                border: "1px solid var(--rule)",
                borderRadius: 3,
                padding: "10px",
                cursor: "pointer",
                fontFamily: "'Lato', sans-serif",
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: "var(--ink-faint)",
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters & View Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
        <select
          value={selectedSeason}
          onChange={e => setSelectedSeason(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 10px",
            border: "1px solid var(--rule)",
            borderRadius: 3,
            fontFamily: "'Lato', sans-serif",
            fontSize: 11,
            outline: "none",
          }}>
          {SEASONS.map(s => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 10px",
            border: "1px solid var(--rule)",
            borderRadius: 3,
            fontFamily: "'Lato', sans-serif",
            fontSize: 11,
            outline: "none",
          }}>
          {years.map(y => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => setView("grid")}
            title="Grid view"
            style={{
              width: 36,
              height: 36,
              background: view === "grid" ? "var(--sage)" : "var(--rule)",
              color: view === "grid" ? "white" : "var(--ink-faint)",
              border: "1px solid var(--rule)",
              borderRadius: 3,
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
              fontSize: 12,
            }}>
            ⊞
          </button>
          <button
            onClick={() => setView("timeline")}
            title="Timeline view"
            style={{
              width: 36,
              height: 36,
              background: view === "timeline" ? "var(--sage)" : "var(--rule)",
              color: view === "timeline" ? "white" : "var(--ink-faint)",
              border: "1px solid var(--rule)",
              borderRadius: 3,
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
              fontSize: 12,
            }}>
            ≣
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ textAlign: "center", color: "var(--ink-faint)" }}>Loading memories...</p>
      ) : filteredImages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--ink-faint)" }}>
          <p className="corm italic" style={{ fontSize: 15 }}>No memories yet for {selectedSeason} {selectedYear}.</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>Upload or take your first photo above to begin.</p>
        </div>
      ) : view === "grid" ? (
        // Grid View
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 32 }}>
          {filteredImages.map(img => (
            <div
              key={img.id}
              style={{
                position: "relative",
                paddingBottom: "100%",
                borderRadius: 3,
                overflow: "hidden",
                background: "var(--rule)",
                cursor: "pointer",
              }}>
              <img
                src={img.image_url}
                alt={img.caption || "Memory"}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <button
                onClick={() => deleteImage(img.id)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 24,
                  height: 24,
                  background: "rgba(0,0,0,.6)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: 12,
                  opacity: 0,
                  transition: "opacity .2s",
                }}
                onMouseEnter={e => e.target.style.opacity = "1"}
                onMouseLeave={e => e.target.style.opacity = "0"}>
                ×
              </button>
              {img.caption && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(0,0,0,.7)",
                    color: "white",
                    padding: "8px",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 11,
                    fontStyle: "italic",
                    lineHeight: 1.4,
                  }}>
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Timeline View
        <div style={{ marginBottom: 32 }}>
          {filteredImages.map((img, idx) => {
            const date = new Date(img.created_at);
            const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

            return (
              <div key={img.id} style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                {/* Timeline dot & line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "var(--sage)",
                      marginBottom: 8,
                    }}
                  />
                  {idx < filteredImages.length - 1 && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 100,
                        background: "var(--rule)",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: idx < filteredImages.length - 1 ? 24 : 0 }}>
                  <p style={{ fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--sage)", marginBottom: 8 }}>
                    {dateStr}
                  </p>
                  <img
                    src={img.image_url}
                    alt={img.caption || "Memory"}
                    style={{
                      width: "100%",
                      borderRadius: 3,
                      marginBottom: 10,
                      maxHeight: 300,
                      objectFit: "cover",
                    }}
                  />
                  {img.caption && (
                    <p style={{ fontSize: 13, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--ink-lt)", lineHeight: 1.6, marginBottom: 8 }}>
                      {img.caption}
                    </p>
                  )}
                  <button
                    onClick={() => deleteImage(img.id)}
                    style={{
                      fontSize: 10,
                      fontFamily: "'Lato', sans-serif",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "#D9534F",
                      background: "none",
                      border: "1px solid #D9534F",
                      borderRadius: 2,
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Back Button */}
      <div style={{ borderTop: "1px solid var(--rule)", paddingTop: 20 }}>
        <button
          onClick={() => onNavigate("home")}
          style={{
            width: "100%",
            background: "var(--sage)",
            color: "white",
            border: "none",
            borderRadius: 2,
            padding: "12px",
            fontFamily: "'Lato', sans-serif",
            fontSize: 11,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
