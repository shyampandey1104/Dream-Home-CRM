import React from "react";
import { X, Play, Share2, ExternalLink, Video as VideoIcon, Film } from "lucide-react";

export default function VideoPlayerModal({ isOpen, onClose, video }) {
  if (!isOpen || !video) return null;

  // Helper to extract YouTube Embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/embed/")) return url;
    
    // Check for youtube.com/watch?v=ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;

    // Check for youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;

    // Check for youtube.com/shorts/ID
    const shortsMatch = url.match(/shorts\/([^?&]+)/);
    if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1`;

    return url;
  };

  const isDirectVideo = (url) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.startsWith("blob:") || 
      lower.startsWith("data:video") || 
      lower.endsWith(".mp4") || 
      lower.endsWith(".webm") || 
      lower.endsWith(".mov")
    );
  };

  const embedUrl = getEmbedUrl(video.url || video.video_url);
  const directVideo = isDirectVideo(video.url || video.video_url);

  // Fallback demo video stream if no valid URL provided
  const fallbackVideoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.9)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.75rem",
        overflowY: "auto"
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0f172a",
          borderRadius: "1.25rem",
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
          border: "1px solid #334155",
          overflow: "hidden",
          color: "#ffffff"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0f172a"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0 }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Film size={16} color="#ffffff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 800, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#ffffff" }}>
                {video.title}
              </h3>
              <p style={{ fontSize: "0.6875rem", color: "#94a3b8", margin: "0.1rem 0 0 0" }}>
                {video.duration || "4K HD Tour"} • 3D Virtual Walkthrough
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#ffffff",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Video Player Frame */}
        <div style={{ width: "100%", height: "230px", background: "#000000", position: "relative" }}>
          {embedUrl && (embedUrl.includes("youtube.com") || embedUrl.includes("vimeo.com")) ? (
            <iframe
              src={embedUrl}
              title={video.title}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={directVideo ? (video.url || video.video_url) : fallbackVideoSrc}
              controls
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
            />
          )}
        </div>

        {/* Video Info & Controls */}
        <div style={{ padding: "1rem 1.25rem", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#f8fafc" }}>{video.title}</div>
            <div style={{ fontSize: "0.6875rem", color: "#60a5fa", marginTop: "0.15rem" }}>
              🎬 HD Virtual Tour • Dream Homes Property Showcase
            </div>
          </div>

          <button
            onClick={() => {
              const text = encodeURIComponent(`🎥 Watch 3D Virtual Video Tour of *${video.title}*: ${video.url || window.location.href}`);
              window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
            }}
            style={{
              background: "#16a34a",
              color: "#ffffff",
              border: "none",
              padding: "0.45rem 0.75rem",
              borderRadius: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem"
            }}
          >
            <Share2 size={13} /> Share Tour
          </button>
        </div>
      </div>
    </div>
  );
}
