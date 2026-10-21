import type { Video } from "../data/content";

export function VideoCard({ video }: { video: Video }) {
  return (
    <a className="video-card" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
      <div className="video-thumb">
        <img src={video.thumbnail} alt="" />
      </div>
      <div className="video-body">
        <p className="video-title">
          <bdi>{video.title}</bdi>
        </p>
        <p className="video-time">{video.duration}</p>
        <p className="video-desc">
          <bdi>{video.description}</bdi>
        </p>
        <div className="video-meta">
          <span className="video-tag">{video.tag}</span>
          <span className="video-date">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
              <path d="M2 6.5h12M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {video.date}
          </span>
        </div>
      </div>
    </a>
  );
}
