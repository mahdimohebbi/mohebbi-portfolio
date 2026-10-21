import { useEffect } from "react";
import { VideoCard } from "../components/VideoCard";
import { videos } from "../data/content";

export function LearnPage() {
  useEffect(() => {
    document.title = "Learn together - Mohebbiam";
    return () => {
      document.title = "Mohebbiam";
    };
  }, []);

  return (
    <main>
      <section className="section inner learn">
        <p className="kicker">// Learn together</p>
        <h2>Latest videos from my YouTube channel</h2>
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </main>
  );
}
