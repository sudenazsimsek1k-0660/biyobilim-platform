import type { Metadata } from "next";
import PodcastContent from "./PodcastContent";

export const metadata: Metadata = {
  title: "Podcast | Biyobilim",
  description:
    "Biyobilim Podcast ile biyoloji, bilim, doğa ve yaşam bilimleri üzerine sohbetleri keşfedin.",
};

export default function PodcastPage() {
  return <PodcastContent />;
}